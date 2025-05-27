import moment from "moment";

const { getShiftById } = require("app/hooks/attendance");
const { getShiftSchedule } = require("app/hooks/shiftManagement");

const getEmployeeActiveShift = async (employeeId, shiftId) => {
  const scheduleResponse = await getShiftSchedule({
    filterData: {
      employee: employeeId,
      status: "Approved",
      date: new Date().toISOString().split("T")[0],
    },
    ordering: "-id",
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
export const getChangeRequestComparison = async(changeRequest)=> {
  if (changeRequest.is_change_request) {
    // 2. Find all approved schedules that overlap with this date range
    const overlappingSchedules = await getShiftSchedule({
      filterData: {
        employee: changeRequest.employee,
        end_date_gte: changeRequest.start_date, // overlaps start
        start_date_lte: changeRequest.end_date, // overlaps end
        status: "Approved",
        is_change_request: false, // Only get regular approved schedules
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


export { getEmployeeActiveShift };