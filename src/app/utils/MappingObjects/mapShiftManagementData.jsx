import moment from "moment";
import { renderTime } from "utils/DateTimeUtils";
import { CalculateTotalWorkingHours } from "utils/renderValues";
import { ActiveShift } from "app/utils/Types/ShiftManagement";
import { eachDayOfInterval } from "date-fns";

export function mapCustomShiftData(data, date) {
  const {
    is_off,
    is_split,
    end_time,
    start_time,
    start_time_1,
    end_time_1,
    start_time_2,
    end_time_2,
  } = data;
  const formattedDate = date ? moment(date).format("YYYY-MM-DD") : null;
  const active_shift = {
    is_split_shift: Boolean(is_split),
    total_hours: 0,
    shifts: [],
    is_weekly_off: is_off,
    name: "Custom Shift",
    is_custom_shift: true,
  };
  if (is_split) {
    if (start_time_1 && end_time_1 && start_time_2 && end_time_2) {
      const first_start_time = renderTime(start_time_1, formattedDate);
      const first_end_time = renderTime(end_time_1, formattedDate);
      const second_start_time = renderTime(start_time_2, formattedDate);
      const second_end_time = renderTime(end_time_2, formattedDate);
      active_shift.shifts = [
        {
          start_time: moment(first_start_time).format("hh:mm A"),
          startTime: first_start_time,
          endTime: first_end_time,
          end_time: moment(first_end_time).format("hh:mm A"),
        },
        {
          start_time: moment(second_start_time).format("hh:mm A"),
          end_time: moment(second_end_time).format("hh:mm A"),
          startTime: second_start_time,
          endTime: second_start_time,
        },
      ];
      active_shift.total_hours =
        CalculateTotalWorkingHours(first_start_time, first_end_time) +
        CalculateTotalWorkingHours(second_start_time, second_end_time);
    }
    return active_shift;
  }

  if (start_time && end_time) {
    const startTime = renderTime(start_time, formattedDate);
    const endTime = renderTime(end_time, formattedDate);
    active_shift.shifts = [
      {
        start_time: moment(startTime).format("hh:mm A"),
        end_time: moment(endTime).format("hh:mm A"),
        startTime: startTime,
        endTime: endTime,
      },
    ];
    active_shift.total_hours = CalculateTotalWorkingHours(start_time, end_time);
  }
  return active_shift;
}

export function mapDefaultShiftData(data) {
  const { type, starttime, endtime, name, id } = data;
  const formattedDate = moment().format("YYYY-MM-DD");
  const active_shift = {
    is_split_shift: false,
    total_hours: 0,
    shifts: [],
    is_weekly_off: false,
    name: name,
    id: id,
    type: type,
    is_custom_shift: false,
  };

  if (starttime && endtime) {
    const startTime = renderTime(starttime, formattedDate);
    const endTime = renderTime(endtime, formattedDate);
    active_shift.shifts = [
      {
        start_time: moment(startTime).format("hh:mm A"),
        end_time: moment(endTime).format("hh:mm A"),
        startTime: startTime,
        endTime: endTime,
      },
    ];
    active_shift.total_hours = CalculateTotalWorkingHours(endTime, endtime);
  }
  return active_shift;
}

export function mapActiveShiftData(
  date,
  default_shift,
  custom_shift,
  leave_details,
  holiday_details
) {
  try {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    const isWeekend = moment(date).day() === 0 || moment(date).day() === 6;
    const isDefaultShiftValid =
      default_shift && typeof default_shift === "object";
    const isCustomShiftValid = custom_shift && typeof custom_shift === "object";

    const active_shift = { ...ActiveShift, date: formattedDate };

    if (isCustomShiftValid) {
      if (custom_shift.is_weekly_off)
        return { ...active_shift, isOffToday: true, OffLabel: "Weekly Off" };
      return { ...active_shift, ...custom_shift };
    }

    // 2. Fallback to default shift
    if (isDefaultShiftValid) {
      const weekend_shift = default_shift?.type === "Weekend";
      if ((weekend_shift && isWeekend) || (!weekend_shift && !isWeekend)) {
        return { ...active_shift, ...default_shift };
      } else {
        active_shift.isOffToday = true;
        active_shift.OffLabel = "Weekly Off";
        active_shift.is_weekly_off = true;
        return active_shift;
      }
    }
    return {
      ...active_shift,
      OffLabel: "No Shift Assigned",
      shift_assigned: false,
    };
  } catch (error) {
    console.error("Error in getEmployeeActiveShift:", error);
    return null;
  }
}
export async function mapActiveShiftListData(
  start_date,
  end_date,
  default_shift,
  custom_shift_list = {},
  leave_details,
  holiday_details
) {
  const StartDate = moment(start_date);
  const EndDate = moment(end_date);
  if (!StartDate.isValid() || !EndDate.isValid()) return [];
  const IntervalList = eachDayOfInterval({
    start: new Date(StartDate),
    end: new Date(EndDate),
  });
  const ResponseList = await Promise.all(
    IntervalList.map((date) => {
      const dateKey = moment(date).format("YYYY-MM-DD");
      const custom_shift = custom_shift_list[dateKey];
      const shift = mapActiveShiftData(dateKey, default_shift, custom_shift);
      return shift;
    })
  );

  return ResponseList;
}

export async function mapCustomShiftListData(data, start_date, end_date) {
  if (!Array.isArray(data) || data.length === 0) return [];
  const formattedStartDate = moment(start_date).format("YYYY-MM-DD");
  const formattedEndDate = moment(end_date).format("YYYY-MM-DD");
  const dateRange = eachDayOfInterval({
    start: new Date(formattedStartDate),
    end: new Date(formattedEndDate),
  });
  const customSchedules =
    data?.filter(
      (schedule) =>
        schedule.custom_schedule &&
        Object.keys(schedule.custom_schedule).length > 0
    ) || [];

  const ResponseObject = {};
  await Promise.all(
    dateRange.map((date) => {
      const dateKey = moment(date).format("YYYY-MM-DD");
      // Find the latest custom schedule for this date (due to ordering by -created_at)
      let customShiftForDate = null;
      for (const schedule of customSchedules) {
        // Check if this date falls within the schedule's date range
        const scheduleStart = moment(schedule.start_date);
        const scheduleEnd = moment(schedule.end_date);

        if (moment(date).isBetween(scheduleStart, scheduleEnd, "day", "[]")) {
          // Check if this specific date has a custom schedule entry
          if (schedule.custom_schedule[dateKey]) {
            customShiftForDate = schedule.custom_schedule[dateKey];
            break; // Take the first one (latest due to ordering)
          }
        }
      }
      // Add to result - null if no custom shift found
      if (customShiftForDate) {
        const ResponseData = mapCustomShiftData(customShiftForDate, dateKey);
        ResponseObject[dateKey] = ResponseData;
        return ResponseData;
      }
      ResponseObject[dateKey] = customShiftForDate;
      return customShiftForDate;
    })
  );
  return ResponseObject;
}
