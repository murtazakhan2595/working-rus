import { employeeData } from "app/hooks/attendance";
import moment from "moment";
import { CalculateTotalWorkingHours } from "utils/renderValues";
import { saveShiftSchedulesLogs } from "../../../../hooks/shiftManagement";
import { getShiftById } from "app/hooks/attendance";
import { getShiftSchedule } from "app/hooks/shiftManagement";
import {
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  startOfWeek,
  parseISO,
  isWithinInterval,
  format,
} from "date-fns";

const getEmployeeActiveShift = async (employeeId, date) => {
  try {
    const formattedDate = moment(date).format("YYYY-MM-DD");

    // First check for approved schedules for this date
    const scheduleResponse = await getShiftSchedule({
      filterData: {
        employee: employeeId,
        status: "Approved",
        end_date_gte: formattedDate,
        start_date_lte: formattedDate,
        is_change_request: "true,false",
      },
      ordering: "-created_at",
    });

    // If we have approved schedules
    if (scheduleResponse?.results?.length > 0) {
      const schedule = scheduleResponse.results[0];

      // Check if it's a custom schedule
      if (schedule.custom_schedule && schedule.custom_schedule[formattedDate]) {
        const daySchedule = schedule.custom_schedule[formattedDate];

        // Check for off day
        if (daySchedule.is_off) {
          return {
            status: "off",
            is_weekly_off: true,
          };
        }

        // Check for split shift
        if (daySchedule.is_split) {
          return {
            status: "active",
            is_split_shift: true,
            split_shifts: [
              {
                start_time: `${formattedDate} ${daySchedule.start_time_1}`,
                end_time: `${formattedDate} ${daySchedule.end_time_1}`,
              },
              {
                start_time: `${formattedDate} ${daySchedule.start_time_2}`,
                end_time: `${formattedDate} ${daySchedule.end_time_2}`,
              },
            ],
            overtime_hours: daySchedule.overtime_hours || 0,
          };
        }

        // Regular shift
        return {
          status: "active",
          start_time: `${formattedDate} ${daySchedule.start_time}`,
          end_time: `${formattedDate} ${daySchedule.end_time}`,
          overtime_hours: daySchedule.overtime_hours || 0,
        };
      }
    }

    // If no schedule found, check employee's default shift assignment
    const empData = await employeeData(employeeId);
    if (empData?.shift_assignment) {
      const shiftInfo = await getShiftById(empData.shift_assignment);

      if (shiftInfo) {
        // Check if it's a working day (assuming Mon-Fri are working days)
        const dayOfWeek = moment(date).day();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        if (isWeekend) {
          return {
            status: "off",
            is_weekly_off: true,
          };
        }

        // Get the shift timing for the specific date
        const startTime = moment(shiftInfo.starttime).format("HH:mm:ss");
        const endTime = moment(shiftInfo.endtime).format("HH:mm:ss");

        return {
          status: "active",
          start_time: `${formattedDate} ${startTime}`,
          end_time: `${formattedDate} ${endTime}`,
          overtime_hours: 0,
        };
      }
    }

    // Check for leave
    // Note: You'll need to implement the leave check based on your leave management system
    const isOnLeave = false; // Replace with actual leave check
    if (isOnLeave) {
      return {
        status: "off",
        is_on_leave: true,
      };
    }

    // If no shift found
    return {
      status: "no_shift",
    };
  } catch (error) {
    console.error("Error in getEmployeeActiveShift:", error);
    return null;
  }
};

// When displaying change request comparison
const getChangeRequestComparison = async (changeRequest) => {
  if (changeRequest.is_change_request) {
    // 2. Find all approved schedules that overlap with this date range
    const overlappingSchedules = await getShiftSchedule({
      filterData: {
        employee: changeRequest.employee,
        end_date_gte: changeRequest.start_date, // overlaps start
        start_date_lte: changeRequest.end_date, // overlaps end
        status: "Approved",
        is_change_request: "true,false",
      },
    });

    // 3. Build comparison data
    const comparisonData = [];
    const startDate = moment(changeRequest.start_date);
    const endDate = moment(changeRequest.end_date);

    let current = startDate.clone();
    while (current.isSameOrBefore(endDate)) {
      const dateStr = current.format("YYYY-MM-DD");

      // Find original shift from overlapping schedules
      let originalShift = "No Shift";

      for (const schedule of overlappingSchedules.results) {
        if (
          current.isBetween(schedule.start_date, schedule.end_date, "day", "[]")
        ) {
          if (schedule.custom_schedule && schedule.custom_schedule[dateStr]) {
            const day = schedule.custom_schedule[dateStr];
            if (day.is_off) {
              originalShift = "OFF";
            } else if (day.is_split) {
              originalShift = `Split: ${day.start_time_1}-${day.end_time_1}, ${day.start_time_2}-${day.end_time_2}`;
            } else {
              originalShift = `${day.start_time}-${day.end_time}`;
            }
          }
          break;
        }
      }

      // Get requested shift
      let requestedShift = "No Shift";
      if (changeRequest.custom_schedule[dateStr]) {
        const day = changeRequest.custom_schedule[dateStr];
        if (day.is_off) {
          requestedShift = "OFF";
        } else if (day.is_split) {
          requestedShift = `Split: ${day.start_time_1}-${day.end_time_1}, ${day.start_time_2}-${day.end_time_2}`;
        } else {
          requestedShift = `${day.start_time}-${day.end_time}`;
        }
      }

      comparisonData.push({
        date: dateStr,
        current_shift: originalShift,
        requested_shift: requestedShift,
        has_change: originalShift !== requestedShift,
      });

      current.add(1, "day");
    }

    return {
      ...changeRequest,
      comparison_data: comparisonData,
    };
  }
};

const generateShiftScheduleLog = async ({
  scheduleData,
  logType,
  userProfile,
  status,
}) => {
  // Helper to format daily schedule into readable string
  const formatScheduleDetails = (schedule, dateRange = null) => {
    console.log("Formatting Schedule Details:", schedule, dateRange);
    if (!schedule) return "No Previous Shift";

    // For organization shifts
    if (schedule.is_org_based && schedule.shift_details) {
      const shift = schedule.shift_details;

      // Extract just the time part from starttime and endtime
      const startTime = moment(shift.starttime).format("HH:mm");
      const endTime = moment(shift.endtime).format("HH:mm");

      // Parse weekdays
      let weekdays = [];
      try {
        weekdays = JSON.parse(shift.weekdays || "[]");
      } catch (e) {
        weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
      }

      // Create a map for quick weekday lookup
      const weekdaySet = new Set(weekdays);

      // Get date range from schedule object
      const startDate = moment(schedule.start_date);
      const endDate = moment(schedule.end_date);

      const dailyDetails = [];
      let current = startDate.clone();

      // Generate daily breakdown for the date range
      while (current.isSameOrBefore(endDate)) {
        const dateStr = current.format("MMM DD");
        const dayName = current.format("dddd"); // Full day name (Monday, Tuesday, etc.)

        if (weekdaySet.has(dayName)) {
          dailyDetails.push(`${dateStr}: ${startTime}-${endTime}`);
        } else {
          dailyDetails.push(`${dateStr}: OFF`);
        }

        current.add(1, "day");
      }

      return `${dailyDetails.join(", ")} (${
        schedule.total_weekly_hours || "40"
      }h/week)`;
    }

    // For custom schedules
    if (schedule.custom_schedule) {
      const entries = Object.entries(schedule.custom_schedule).sort((a, b) =>
        moment(a[0]).diff(moment(b[0]))
      );

      const dailyDetails = entries.map(([date, day]) => {
        const dateStr = moment(date).format("MMM DD");

        if (day.is_off) {
          return `${dateStr}: OFF`;
        } else if (day.is_split) {
          return `${dateStr}: Split ${day.start_time_1}-${day.end_time_1}/${day.start_time_2}-${day.end_time_2}`;
        } else {
          return `${dateStr}: ${day.start_time}-${day.end_time}`;
        }
      });

      // Show ALL days
      const displayDetails = dailyDetails.join(", ");

      return `${displayDetails} (${schedule.total_weekly_hours}h/week)`;
    }

    // For direct shift assignment
    if (schedule.starttime && schedule.endtime) {
      const startTime = moment(schedule.starttime).format("HH:mm");
      const endTime = moment(schedule.endtime).format("HH:mm");

      // If we have a date range, show daily breakdown
      if (dateRange) {
        const start = moment(dateRange.start);
        const end = moment(dateRange.end);
        const days = [];

        let current = start.clone();
        while (current.isSameOrBefore(end)) {
          const dateStr = current.format("MMM DD");
          // Assume weekdays only for direct assignments
          if (current.day() !== 0 && current.day() !== 6) {
            days.push(`${dateStr}: ${startTime}-${endTime}`);
          } else {
            days.push(`${dateStr}: OFF`);
          }
          current.add(1, "day");
        }

        return `[${schedule.name}] ${days.join(", ")} (40h/week)`;
      }

      return `[${schedule.name}] ${startTime}-${endTime} (Mon-Fri)`;
    }

    return "Unknown Schedule Type";
  };

  let assignedShift = "No Previous Shift";
  let dateRange = {
    start: scheduleData.start_date,
    end: scheduleData.end_date,
  };

  try {
    // Fetch existing approved schedules
    const existingSchedules = await getShiftSchedule({
      filterData: {
        employee: scheduleData.employee,
        end_date_gte: scheduleData.start_date,
        start_date_lte: scheduleData.end_date,
        status: "Approved",
        is_change_request: "false,true",
      },
      ordering: "-created_at",
    });

    if (existingSchedules?.results && existingSchedules.results.length > 0) {
      assignedShift = formatScheduleDetails(existingSchedules.results[0]);
    } else {
      // Check for direct shift assignment
      const empData = await employeeData(scheduleData.employee);
      if (empData?.shift_assignment) {
        const directShift = await getShiftById(empData.shift_assignment);
        if (directShift) {
          assignedShift = formatScheduleDetails(directShift, dateRange);
        }
      }
    }
  } catch (error) {
    console.error("Error fetching assigned shift:", error);
  }

  // Format requested shift
  const requestedShift = formatScheduleDetails(scheduleData);

  // Build payload
  const payload = {
    log_type: logType,
    assigned_shift: assignedShift,
    requested_shift: requestedShift,
    approved_on: moment().format("YYYY-MM-DD HH:mm:ss"),
    status: status,
    employee: scheduleData.employee?.id || scheduleData.employee,
    action_by: userProfile?.employee_id || userProfile?.id,
    approved_by: userProfile?.employee_id || userProfile?.id,
  };

  console.log("Generated Shift Schedule Log Payload:", payload);
  await saveShiftSchedulesLogs(payload);
};

export const getMontlyShiftData = async (employee_id, default_shift = {}) => {
  if (!employee_id) return [];
  try {
    const today = new Date();
    const datesOfMonth = eachDayOfInterval({
      start: startOfMonth(today),
      end: endOfMonth(today),
    });

    const isDefaultShiftValid =
      typeof default_shift === "object" &&
      default_shift.start_time &&
      default_shift.end_time;

    const default_starttime = isDefaultShiftValid ? default_shift.start_time : null;
    const default_endtime = isDefaultShiftValid ? default_shift.end_time : null;
    const weekend_shift = default_shift.type === "Weekend";

    const shiftPromises = datesOfMonth.map(async (date) => {
      const dateStr = moment(date).format("YYYY-MM-DD");

      try {
        const res = await getEmployeeActiveShift(employee_id, date);
        if (!res) return null;

        const shift = {
          date: dateStr,
          is_split_shift: Boolean(res.is_split_shift),
          total_hours: 0,
          shifts: [],
          assigned: true,
          status: res.status,
        };

        const isWeekend = moment(date).day() === 0 || moment(date).day() === 6;

        if (res.status === "off") {
          shift.status = false;
          shift.isOffToday = true;
          shift.is_weekly_off = res.is_weekly_off || false;
          shift.OffLabel = shift.is_weekly_off ? "Weekly Off" : undefined;
        } else if (res.status === "active") {
          shift.isOffToday = false;

          if (res.is_split_shift && Array.isArray(res.split_shifts)) {
            const [first, second] = res.split_shifts;
            shift.shifts = [
              {
                start_time: format(new Date(first.start_time), "hh:mm a"),
                end_time: format(new Date(first.end_time), "hh:mm a"),
              },
              {
                start_time: format(new Date(second.start_time), "hh:mm a"),
                end_time: format(new Date(second.end_time), "hh:mm a"),
              },
            ];
            shift.total_hours =
              CalculateTotalWorkingHours(first.start_time, first.end_time) +
              CalculateTotalWorkingHours(second.start_time, second.end_time);
          } else {
            shift.shifts = [
              {
                start_time: format(new Date(res.start_time), "hh:mm a"),
                end_time: format(new Date(res.end_time), "hh:mm a"),
              },
            ];
            shift.total_hours = CalculateTotalWorkingHours(res.start_time, res.end_time);
          }

          shift.status = true;
        } else if (res.status === "no_shift") {
          if (!isDefaultShiftValid) {
            shift.status = false;
            shift.assigned = false;
            shift.total_hours = 0;
            shift.shifts = [];
            shift.isOffToday = true;
            shift.is_weekly_off = res.is_weekly_off || false;
            shift.OffLabel = shift.is_weekly_off ? "Weekly Off" : undefined;
          } else {
            if ((weekend_shift && isWeekend) || (!weekend_shift && !isWeekend)) {
              shift.status = true;
              shift.shifts = [
                {
                  start_time: format(new Date(default_starttime), "hh:mm a"),
                  end_time: format(new Date(default_endtime), "hh:mm a"),
                },
              ];
              shift.total_hours = CalculateTotalWorkingHours(
                default_starttime,
                default_endtime
              );
              shift.isOffToday = false;
            } else {
              shift.status = false;
              shift.shifts = [];
              shift.total_hours = 0;
              shift.isOffToday = true;
              shift.OffLabel = "Weekly Off";
              shift.is_weekly_off = true;
            }
          }
        }

        return shift;
      } catch (err) {
        console.error(`Error fetching shift for ${dateStr}:`, err);
        return null;
      }
    });

    const shifts = await Promise.all(shiftPromises);
    return shifts.filter(Boolean);
  } catch (error) {
    console.error("Error fetching monthly shift data:", error);
    return [];
  }
};

export const getThisWeekShiftData = (MonthlyShiftDataList) => {
  if (!Array.isArray(MonthlyShiftDataList)) return [];

  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday as start
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 }); // Sunday as end

  const thisWeekShifts = MonthlyShiftDataList.filter((shift) => {
    const shiftDate =
      typeof shift.date === "string"
        ? parseISO(shift.date)
        : new Date(shift.date);
    return isWithinInterval(shiftDate, { start: weekStart, end: weekEnd });
  });

  return thisWeekShifts;
};

export {
  getEmployeeActiveShift,
  getChangeRequestComparison,
  generateShiftScheduleLog,
};
