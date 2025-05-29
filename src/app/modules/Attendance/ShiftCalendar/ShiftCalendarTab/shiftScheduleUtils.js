// app/utils/shiftScheduleUtils.js
import moment from "moment";
import { getShiftSchedule } from "app/hooks/shiftManagement";
import { getShiftById, employeeData } from "app/hooks/attendance";

/**
 * Filter out older overlapping schedules, keeping only the latest ones
 * @param {Array} schedules - Array of schedule objects sorted by newest first
 * @returns {Array} Filtered array with no overlapping schedules
 */
export const filterOverlappingSchedules = (schedules) => {
  if (!schedules || schedules.length === 0) return [];

  const filteredSchedules = [];

  schedules.forEach((schedule) => {
    const scheduleStart = moment(schedule.start_date);
    const scheduleEnd = moment(schedule.end_date);

    // Check if this schedule overlaps with any already added schedule
    const hasOverlap = filteredSchedules.some((existing) => {
      const existingStart = moment(existing.start_date);
      const existingEnd = moment(existing.end_date);

      // Check if dates overlap
      return (
        scheduleStart.isSameOrBefore(existingEnd) &&
        scheduleEnd.isSameOrAfter(existingStart)
      );
    });

    // Only add if no overlap (since we're going newest first)
    if (!hasOverlap) {
      filteredSchedules.push(schedule);
    }
  });

  return filteredSchedules;
};

/**
 * Get comparison data between change request and existing schedules
 * @param {Object} changeRequest - The shift change request object
 * @returns {Promise<Array>} Array of comparison data for changed/new days only
 */
export const getChangeRequestComparison = async (
  changeRequest,
  shift_requested = "Manager"
) => {
  // Find all approved schedules that overlap with this date range
  const overlappingSchedules = await getShiftSchedule({
    filterData: {
      employee: changeRequest.employee,
      end_date_gte: changeRequest.start_date,
      start_date_lte: changeRequest.end_date,
      status: "Approved",
      is_change_request: false,
    },
  });

  // Get employee's direct shift assignment as fallback
  let directShift = null;
  try {
    const empData = await employeeData(changeRequest.employee);
    if (empData?.shift_assignment) {
      directShift = await getShiftById(empData.shift_assignment);
    }
  } catch (error) {
    console.error("Error fetching employee direct shift:", error);
  }

  // Build comparison data - ONLY for changed/new days
  const comparisonData = [];
  const startDate = moment(changeRequest.start_date);
  const endDate = moment(changeRequest.end_date);

  let current = startDate.clone();
  while (current.isSameOrBefore(endDate)) {
    const dateStr = current.format("YYYY-MM-DD");

    // Only process days that are in the custom_schedule
    if (
      changeRequest.custom_schedule &&
      changeRequest.custom_schedule[dateStr]
    ) {
      // Find original shift from overlapping schedules
      let originalShift = "No Shift";
      let originalShiftSource = "none";

      // Check approved schedules first
      for (const schedule of overlappingSchedules.results || []) {
        if (
          current.isBetween(
            moment(schedule.start_date),
            moment(schedule.end_date),
            "day",
            "[]"
          )
        ) {
          if (schedule.is_org_based && schedule.shift_details) {
            // Organization-based schedule
            const startTime = moment(schedule.shift_details.starttime).format(
              "HH:mm"
            );
            const endTime = moment(schedule.shift_details.endtime).format(
              "HH:mm"
            );
            originalShift = `${startTime}-${endTime}`;
            originalShiftSource = "org_schedule";
          } else if (
            schedule.custom_schedule &&
            schedule.custom_schedule[dateStr]
          ) {
            // Custom schedule
            const day = schedule.custom_schedule[dateStr];
            if (day.is_off) {
              originalShift = "OFF";
            } else if (day.is_split) {
              originalShift = `Split: ${day.start_time_1}-${day.end_time_1}, ${day.start_time_2}-${day.end_time_2}`;
            } else {
              originalShift = `${day.start_time}-${day.end_time}`;
            }
            originalShiftSource = "custom_schedule";
          }
          break;
        }
      }

      // If no scheduled shift found, use direct assignment
      if (originalShift === "No Shift" && directShift) {
        const dayOfWeek = current.day();
        // Assuming direct shifts apply Mon-Fri (you can adjust this logic)
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          const startTime = moment(directShift.starttime).format("HH:mm");
          const endTime = moment(directShift.endtime).format("HH:mm");
          originalShift = `${startTime}-${endTime}`;
          originalShiftSource = "direct_assignment";
        }
      }

      // Get requested shift
      let requestedShift = "No Shift";
      const day = changeRequest.custom_schedule[dateStr];
      if (day.is_off) {
        requestedShift = "OFF";
      } else if (day.is_split) {
        requestedShift = `Split: ${day.start_time_1}-${day.end_time_1}, ${day.start_time_2}-${day.end_time_2}`;
      } else {
        requestedShift = `${day.start_time}-${day.end_time}`;
      }

      // Check if there's actually a change
      const hasChange = originalShift !== requestedShift;

      // ONLY include days with changes or new shifts
      if (hasChange || originalShift === "No Shift") {
        comparisonData.push({
          date: dateStr,
          day: current.format("ddd"),
          current_shift: originalShift,
          current_shift_source: originalShiftSource,
          requested_shift: requestedShift,
          has_change: true,
          is_new_shift: originalShift === "No Shift",
          // Check if this day was explicitly marked as changed
          is_changed_day: changeRequest.changed_days
            ? changeRequest.changed_days.includes(dateStr)
            : true,
        });
      }
    }

    current.add(1, "day");
  }

  // Handle requested date range if it exists
  if (changeRequest.requested_date_range) {
    const [reqStart, reqEnd] = changeRequest.requested_date_range.split(",");
    const requestedStart = moment(reqStart);
    const requestedEnd = moment(reqEnd);

    // Check if there are days in the requested range that aren't in the full range
    let checkDate = requestedStart.clone();
    while (checkDate.isSameOrBefore(requestedEnd)) {
      const dateStr = checkDate.format("YYYY-MM-DD");

      // If this date is within requested range but not in the comparison yet
      if (
        (checkDate.isBefore(startDate) || checkDate.isAfter(endDate)) &&
        changeRequest.custom_schedule &&
        changeRequest.custom_schedule[dateStr]
      ) {
        // This is a day that was requested but is outside the original schedule range
        const day = changeRequest.custom_schedule[dateStr];
        let requestedShift = "No Shift";

        if (day.is_off) {
          requestedShift = "OFF";
        } else if (day.is_split) {
          requestedShift = `Split: ${day.start_time_1}-${day.end_time_1}, ${day.start_time_2}-${day.end_time_2}`;
        } else {
          requestedShift = `${day.start_time}-${day.end_time}`;
        }

        comparisonData.push({
          date: dateStr,
          day: checkDate.format("ddd"),
          current_shift: "No Shift",
          current_shift_source: "none",
          requested_shift: requestedShift,
          has_change: true,
          is_new_shift: true,
          is_changed_day: true,
        });
      }

      checkDate.add(1, "day");
    }
  }

  // Sort by date
  comparisonData.sort((a, b) => moment(a.date).diff(moment(b.date)));

  return comparisonData;
};

/**
 * Fetch employee shift data including direct assignment and scheduled shifts
 * @param {number} employeeId - The employee ID
 * @returns {Promise<Object>} Object containing employeeShift and scheduleShifts
 */
export const fetchEmployeeShiftData = async (employeeId) => {
  try {
    // Fetch employee data
    const empData = await employeeData(employeeId);

    // Fetch approved scheduled shifts
    const empScheduleShift = await getShiftSchedule({
      filterData: {
        status: "Approved",
        employee: employeeId,
        is_change_request: false, 
      },
      ordering: "-created_at", 
    });

    let employeeShift = null;
    let scheduleShifts = { results: [], count: 0 };

    // Check if employee has any shift data
    if (!empData?.shift_assignment && empScheduleShift?.count === 0) {
      return { employeeShift, scheduleShifts };
    }

    // Fetch direct shift assignment if exists
    if (empData?.shift_assignment) {
      const shiftData = await getShiftById(empData.shift_assignment);
      if (shiftData) {
        employeeShift = shiftData;
      }
    }

    // Filter schedules to remove older overlapping ones
    if (empScheduleShift && empScheduleShift.results.length > 0) {
      const filteredSchedules = filterOverlappingSchedules(
        empScheduleShift.results
      );

      scheduleShifts = {
        results: filteredSchedules,
        count: filteredSchedules.length,
      };
    }

    return { employeeShift, scheduleShifts };
  } catch (error) {
    console.error("Error fetching employee shift data:", error);
    throw error;
  }
};

/**
 * Format shift time string for display
 * @param {Object} shiftData - Object containing shift time information
 * @returns {string} Formatted shift time string
 */
export const formatShiftDisplay = (shiftData) => {
  if (!shiftData) return "No Shift";

  if (shiftData.is_off) {
    return "OFF";
  } else if (shiftData.is_split) {
    return `Split: ${shiftData.start_time_1}-${shiftData.end_time_1}, ${shiftData.start_time_2}-${shiftData.end_time_2}`;
  } else {
    return `${shiftData.start_time}-${shiftData.end_time}`;
  }
};

/**
 * Check if two date ranges overlap
 * @param {string} start1 - Start date of first range
 * @param {string} end1 - End date of first range
 * @param {string} start2 - Start date of second range
 * @param {string} end2 - End date of second range
 * @returns {boolean} True if ranges overlap
 */
export const doDateRangesOverlap = (start1, end1, start2, end2) => {
  const startDate1 = moment(start1);
  const endDate1 = moment(end1);
  const startDate2 = moment(start2);
  const endDate2 = moment(end2);

  return (
    startDate1.isSameOrBefore(endDate2) && endDate1.isSameOrAfter(startDate2)
  );
};
