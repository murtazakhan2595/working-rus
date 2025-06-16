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

const GetEmployeeActiveShift = async (
  employeeId,
  defaultShift,
  date = new Date()
) => {
  try {
    if (!employeeId || !date) return null;
    const formattedDate = moment(date).format("YYYY-MM-DD");
    const isWeekend = moment(date).day() === 0 || moment(date).day() === 6;
    const isDefaultShiftValid =
      defaultShift &&
      typeof defaultShift === "object" &&
      defaultShift.start_time &&
      defaultShift.end_time;

    const active_shift = {
      date: formattedDate,
      is_split_shift: false,
      total_hours: 0,
      shifts: [],
      shift_assigned: true,
      status: false,
      is_weekly_off: false,
          isOffToday: false,
    };

    // 1. Fetch approved custom schedule
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
    const schedule = scheduleResponse?.results?.[0];
    const customSchedule = schedule?.custom_schedule?.[formattedDate];

    if (customSchedule) {
      if (customSchedule.is_off) {
        return {
          ...active_shift,
          isOffToday: true,
          is_weekly_off: true,
          OffLabel: "Weekly Off",
        };
      }

      active_shift.status = true;
      active_shift.isOffToday = false;

      if (customSchedule.is_split) {
        if (
          customSchedule.start_time_1 &&
          customSchedule.end_time_1 &&
          customSchedule.start_time_2 &&
          customSchedule.end_time_2
        ) {
          const first_start_time = `${formattedDate}T${customSchedule.start_time_1}`;
          const first_end_time = `${formattedDate}T${customSchedule.end_time_1}`;
          const second_start_time = `${formattedDate}T${customSchedule.start_time_2}`;
          const second_end_time = `${formattedDate}T${customSchedule.end_time_2}`;

          active_shift.is_split_shift = true;
          active_shift.shifts = [
            {
              start_time: format(new Date(first_start_time), "hh:mm a"),
              end_time: format(new Date(first_end_time), "hh:mm a"),
            },
            {
              start_time: format(new Date(second_start_time), "hh:mm a"),
              end_time: format(new Date(second_end_time), "hh:mm a"),
            },
          ];
          active_shift.total_hours =
            CalculateTotalWorkingHours(first_start_time, first_end_time) +
            CalculateTotalWorkingHours(second_start_time, second_end_time);
        }
        return active_shift;
      }

      // Regular shift fallback
      const start_time = customSchedule.start_time;
      const end_time = customSchedule.end_time;

      if (start_time && end_time) {
        const start_time = `${formattedDate}T${customSchedule.start_time}`;
        const end_time = `${formattedDate}T${customSchedule.end_time}`;
        active_shift.shifts = [
          {
            start_time: format(new Date(start_time), "hh:mm a"),
            end_time: format(new Date(end_time), "hh:mm a"),
          },
        ];
        active_shift.total_hours = CalculateTotalWorkingHours(
          start_time,
          end_time
        );
      }
      return active_shift;
    }

    // 2. Fallback to default shift
    if (!isDefaultShiftValid) {
      return {
        ...active_shift,
        status: false,
        shift_assigned: false,
        isOffToday: true,
        OffLabel: "No Shift Assigned",
      };
    }

    const weekend_shift = defaultShift?.type === "Weekend";
    const default_start = defaultShift.start_time;
    const default_end = defaultShift.end_time;

    if ((weekend_shift && isWeekend) || (!weekend_shift && !isWeekend)) {
      if (default_start && default_end) {
        active_shift.status = true;
        active_shift.shifts = [
          {
            start_time: format(new Date(default_start), "hh:mm a"),
            end_time: format(new Date(default_end), "hh:mm a"),
          },
        ];
        active_shift.total_hours = CalculateTotalWorkingHours(
          default_start,
          default_end
        );
        active_shift.isOffToday = false;
      }
    } else {
      active_shift.status = false;
      active_shift.isOffToday = true;
      active_shift.OffLabel = "Weekly Off";
      active_shift.is_weekly_off = true;
    }

    return active_shift;
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
  console.log("Generating shift schedule log for:", {
    scheduleData,
    logType,
    userProfile,
    status,
  });
  // Helper to format daily schedule into readable string
  const formatScheduleDetails = (schedule, dateRange = null) => {
    if (!schedule) return "No Previous Shift";

    // For organization shifts
    if (schedule.is_org_based && schedule.shift_details) {
      const shift = schedule.shift_details;

      // Parse start time (ISO format)
      const startMoment = moment(shift.starttime);

      // Parse end time (handle multiple formats)
      let endMoment;
      if (shift.endtime.includes("T")) {
        // ISO format like "2025-06-09T12:00:00Z"
        endMoment = moment(shift.endtime);
      } else if (shift.endtime.includes("M")) {
        // 12-hour format like "05:00 PM" or "5:00 AM"
        endMoment = moment(shift.endtime, ["hh:mm A", "h:mm A"]);
      } else if (shift.endtime.includes(":")) {
        // 24-hour format like "17:00"
        endMoment = moment(shift.endtime, "HH:mm");
      } else {
        // Fallback - try to parse as-is
        endMoment = moment(shift.endtime);
      }

      // Only proceed if both times are valid
      if (!startMoment.isValid() || !endMoment.isValid()) {
        console.error("Invalid time formats in generateShiftScheduleLog:", {
          starttime: shift.starttime,
          endtime: shift.endtime,
          startValid: startMoment.isValid(),
          endValid: endMoment.isValid(),
        });
        return "Invalid shift times";
      }

      const startTime = startMoment.format("HH:mm");
      const endTime = endMoment.format("HH:mm");

      // Parse weekdays
      let weekdays = [];
      try {
        weekdays = JSON.parse(shift.weekdays || "[]");
      } catch (error) {
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
      // Parse start time (ISO format)
      const startMoment = moment(schedule.starttime);

      // Parse end time (handle multiple formats)
      let endMoment;
      if (schedule.endtime.includes("T")) {
        // ISO format like "2025-06-09T12:00:00Z"
        endMoment = moment(schedule.endtime);
      } else if (schedule.endtime.includes("M")) {
        // 12-hour format like "05:00 PM" or "5:00 AM"
        endMoment = moment(schedule.endtime, ["hh:mm A", "h:mm A"]);
      } else if (schedule.endtime.includes(":")) {
        // 24-hour format like "17:00"
        endMoment = moment(schedule.endtime, "HH:mm");
      } else {
        // Fallback - try to parse as-is
        endMoment = moment(schedule.endtime);
      }

      // Only proceed if both times are valid
      if (!startMoment.isValid() || !endMoment.isValid()) {
        console.error("Invalid time formats in direct shift assignment:", {
          starttime: schedule.starttime,
          endtime: schedule.endtime,
          startValid: startMoment.isValid(),
          endValid: endMoment.isValid(),
        });
        return "Invalid shift times";
      }

      const startTime = startMoment.format("HH:mm");
      const endTime = endMoment.format("HH:mm");

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

  // Extract employee ID (handle both number and object formats)
  const employeeId = scheduleData.employee?.id || scheduleData.employee;

  try {
    
    // Fetch existing approved schedules
    const existingSchedules = await getShiftSchedule({
      filterData: {
        employee: employeeId,
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
      const empData = await employeeData(employeeId);
      if (empData?.shift_assignment) {
        const directShift = await getShiftById(empData.shift_assignment);
        if (directShift) {
          assignedShift = formatScheduleDetails(directShift, dateRange);
        }
      }
    }
  } catch (error) {
    console.error("Error fetching shift_assigned shift:", error);
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
    employee: employeeId,
    action_by: scheduleData?.assigned_by,
    approved_by: userProfile?.employee_id || userProfile?.id,  
  };

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

    const shiftPromises = datesOfMonth.map(async (date) => {
      const dateStr = moment(date).format("YYYY-MM-DD");
      try {
        const res = await GetEmployeeActiveShift(
          employee_id,
          default_shift,
          date
        );
        if (!res) return null;
        return res;
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


const parseShiftTime = (timeString) => {
  if (!timeString) return null;

  let parsedTime;

  if (timeString.includes("T")) {
    // ISO format like "2025-06-09T12:00:00Z"
    parsedTime = moment(timeString);
  } else if (timeString.includes("M")) {
    // 12-hour format like "05:00 PM" or "5:00 AM"
    parsedTime = moment(timeString, ["hh:mm A", "h:mm A"]);
  } else if (timeString.includes(":")) {
    // 24-hour format like "17:00"
    parsedTime = moment(timeString, "HH:mm");
  } else {
    // Fallback - try to parse as-is
    parsedTime = moment(timeString);
  }

  return parsedTime.isValid() ? parsedTime.format("HH:mm") : null;
};

export {
  GetEmployeeActiveShift,
  getChangeRequestComparison,
  generateShiftScheduleLog,
  parseShiftTime,
};
