import { employeeData } from "app/hooks/attendance";
import moment from "moment";
import { saveShiftSchedulesLogs } from "../../../../hooks/shiftManagement";

const { getShiftById } = require("app/hooks/attendance");
const { getShiftSchedule } = require("app/hooks/shiftManagement");

const getEmployeeActiveShift = async (employeeId, shiftId) => {
  const scheduleResponse = await getShiftSchedule({
    filterData: {
      employee: employeeId,
      status: "Approved",
      date: new Date().toISOString().split("T")[0],
      // date: "2025-06-03",
    },
    ordering: "-id",
    options: {
      page: 1,
      sizePerPage: 1, // Get only the latest schedule
    },
  });
  if (scheduleResponse && scheduleResponse.count > 0) {
    return scheduleResponse.results[0];
  }
  const directShiftInfo = await getShiftById(shiftId);
  if (directShiftInfo && directShiftInfo.id) {
    return directShiftInfo;
  }
  return null;
};


// When displaying change request comparison
 const getChangeRequestComparison = async(changeRequest)=> {
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
}

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

export { getEmployeeActiveShift, getChangeRequestComparison, generateShiftScheduleLog };