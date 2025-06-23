import moment from "moment";
import { renderTime } from "utils/DateTimeUtils";
import { CalculateTotalWorkingHours } from "utils/renderValues";
import { ActiveShift } from "app/utils/Types/ShiftManagement";

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
    date: formattedDate,
    is_split_shift: Boolean(is_split),
    total_hours: 0,
    shifts: [],
    status: !Boolean(is_off),
    is_weekly_off: is_off,
    is_holiday_off: false,
    is_on_leave: false,
    isOffToday: is_off,
    OffLabel: "Weekly Off",
    name: "Custom Shift",
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
    date: formattedDate,
    is_split_shift: false,
    total_hours: 0,
    shifts: [],
    status: true,
    is_weekly_off: false,
    is_holiday_off: false,
    is_on_leave: false,
    isOffToday: false,
    OffLabel: null,
    name: name,
    id: id,
    type: type,
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
    const isWeekend = moment(date).day() === 0 || moment(date).day() === 6;
    const isDefaultShiftValid =
      default_shift && typeof default_shift === "object";
    const isCustomShiftValid = custom_shift && typeof custom_shift === "object";

    const active_shift = ActiveShift;

    if (isCustomShiftValid) return { ...active_shift, ...custom_shift };

    // 2. Fallback to default shift
    if (isDefaultShiftValid) {
      const weekend_shift = default_shift?.type === "Weekend";
      if ((weekend_shift && isWeekend) || (!weekend_shift && !isWeekend)) {
        return { ...active_shift, ...default_shift };
      } else {
        active_shift.status = false;
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
