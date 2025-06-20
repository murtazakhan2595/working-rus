import {
  Attendance,
  Shift,
  TimeAdjustment,
  AttendanceAdjustment,
} from "app/utils/Types/Attendance";
import { CalculateTotalWorkingHours, calculateTotal } from "utils/renderValues";
import moment from "moment";
import { renderTime } from "utils/DateTimeUtils";

export function mapShiftData(data) {
  const shiftDetails = Object.keys(Shift).reduce((acc, key) => {
    if (data.hasOwnProperty(key)) {
      if (key === "starttime") {
        acc["start_time"] = moment(data[key]);
        acc[key] = moment(data[key]).format('"hh:mm A"');
      }
      if (key === "endtime") {
        acc["end_time"] = moment(data[key]);
        acc[key] = moment(data[key]).format('"hh:mm A"');
      } else acc[key] = data[key];
    }
    return acc;
  }, {});
  return shiftDetails;
}
export function mapAttendanceData(data, shiftDetails) {
  const [firstShift, secondShift] = shiftDetails?.shifts || [];
  const Hours = shiftDetails?.total_hours || data.total_hours || 0;
  const attendanceDate = data.date || moment();
  // Initialize an empty payload object
  const payload = {};
  // Iterate over the keys in the Task object
  for (const key in Attendance) {
    // Check if the key exists in the data object
    if (
      data.hasOwnProperty(key) &&
      data[key] !== undefined &&
      data[key] !== null
    ) {
      // Add the key and its value to the payload
      if (key === "total_hours") {
        payload["total_hours"] = Hours;
      } else if (key === "checkin") {
        payload["total_hours"] = Hours;
        const shiftStartTime = renderTime(
          firstShift.start_time,
          attendanceDate
        );
        payload[key] = renderTime(data[key], attendanceDate);
        const checkInTime = moment(payload.checkin);
        if (shiftDetails) {
          payload.is_absent = false;
        }
        // payload.is_weekend = [0, 6].includes(moment(checkInTime).day());

        // Now check if check-in is after the shift start
        const isLate = checkInTime.isAfter(shiftStartTime);
        payload["status"] = isLate ? "Late" : "Present";
        payload["is_late"] = isLate;
        payload["is_absent"] = false;
      } else if (key === "second_checkin") {
        const shiftStartTime = renderTime(
          secondShift.start_time,
          attendanceDate
        );
        payload[key] = renderTime(data[key], attendanceDate);
        const checkInTime = moment(payload.second_checkin);
        if (shiftDetails) {
          payload.is_absent = false;
        }
        //payload.is_weekend = [0, 6].includes(checkInTime.day());

        // Now check if check-in is after the shift start
        const isLate = checkInTime.isAfter(shiftStartTime);
        payload["status"] = isLate ? "Late" : "Present";
        payload["is_late"] = isLate;
        payload["is_absent"] = false;
      } else if (key === "checkout") {
        const checkin = moment(payload.checkin);
        payload[key] = renderTime(data[key], attendanceDate);
        const totalHoursWorked = CalculateTotalWorkingHours(
          checkin,
          payload.checkout
        );
        const payableHours =
          totalHoursWorked - parseFloat(data.break_duration || 0);
        payload["payable_hours"] = parseFloat(
          parseFloat(payableHours).toFixed(2)
        );
        if (Hours > 0) {
          if (
            parseFloat(payload.payable_hours) > parseFloat(payload.total_hours)
          ) {
            payload["overtime_hours"] = parseFloat(
              parseFloat(payload.payable_hours) -
                parseFloat(payload.total_hours)
            ).toFixed(2);
          } else {
            payload["overtime_hours"] = parseFloat(0).toFixed(2);
          }
        }
      } else if (key === "second_checkout") {
        const checkin = moment(payload.second_checkin);
        payload[key] = renderTime(data[key], attendanceDate);
        const totalHoursWorked = CalculateTotalWorkingHours(
          checkin,
          payload.checkout
        );
        const payableHours =
          parseFloat(payload.payable_hours) +
          totalHoursWorked -
          parseFloat(data.break_duration || 0);
        payload["payable_hours"] = parseFloat(
          parseFloat(payableHours).toFixed(2)
        );
        if (Hours > 0) {
          if (
            parseFloat(payload.payable_hours) > parseFloat(payload.total_hours)
          ) {
            const overtime = parseFloat(
              parseFloat(payload.payable_hours) -
                parseFloat(payload.total_hours)
            ).toFixed(2);
            payload["overtime_hours"] = overtime;
            payload["remaining_offset_leave_hours"] = overtime;
          } else {
            payload["overtime_hours"] = parseFloat(0).toFixed(2);
            payload["remaining_offset_leave_hours"] = parseFloat(0).toFixed(2);
          }
        }
      } else payload[key] = data[key];
    }
  }

  // Return the constructed payload
  return payload;
}

export function mapAttendanceBreakDurationData(breakData = []) {
  // Return 0 if input is not an array or is empty
  if (!Array.isArray(breakData) || breakData.length === 0) return 0;

  let totalBreakDuration = 0;

  // Use breakData.results if exists, else fallback to breakData itself
  const breaks = Array.isArray(breakData.results) ? breakData.results : breakData;

  breaks.forEach((entry) => {
    const startRaw = entry?.starttime;
    const endRaw = entry?.endtime;

    // Skip if either start or end is missing
    if (!startRaw || !endRaw) return;

    const start = moment(renderTime(startRaw));
    const end = moment(renderTime(endRaw));

    // Ensure both times are valid and end is after start
    if (start.isValid() && end.isValid() && end.isAfter(start)) {
      const duration = CalculateTotalWorkingHours(start, end);
      totalBreakDuration += duration;
    }
  });

  return parseFloat(parseFloat(totalBreakDuration).toFixed(2));
}

export function mapTimeAdjustmentPayloadeData(data) {
  const payload = {};
  // Iterate over the keys in the TimeAdjustment object
  for (const key in TimeAdjustment) {
    // Check if the key exists in the data object
    if (
      data.hasOwnProperty(key) &&
      data[key] !== undefined &&
      data[key] !== null
    ) {
      // Add the key and its value to the payload
      if (key === "reason") payload[key] = data[key]?.trim();
      else payload[key] = data[key];
    }
  }

  // Return the constructed payload
  return payload;
}

export function mapEmployeeAttendanceDetail(data) {
  const emp_attendance_data = {};
  const MonthlyShiftDataList = data.monthly_shifts;
  const WeeklyShiftDataList = data.weekly_shifts;
  const monthly_total_hours = calculateTotal(
    MonthlyShiftDataList,
    "total_hours"
  );
  const weekly_total_hours = calculateTotal(WeeklyShiftDataList, "total_hours");
  const today_shift = MonthlyShiftDataList.find(
    (shift) => shift.date === moment().format("YYYY-MM-DD")
  );
  const yesterday_shift = MonthlyShiftDataList.find(
    (shift) => shift.date === moment().subtract(1, "day").format("YYYY-MM-DD")
  );
  const tomorrow_shift = MonthlyShiftDataList.find(
    (shift) => shift.date === moment().add(1, "day").format("YYYY-MM-DD")
  );

  emp_attendance_data.default_shift = data.default_shift;
  emp_attendance_data.monthly_total_hours = monthly_total_hours;
  emp_attendance_data.weekly_total_hours = weekly_total_hours;
  emp_attendance_data.employee_id = data.employee_id;
  emp_attendance_data.today_shift = today_shift || {};
  emp_attendance_data.yesterday_shift = yesterday_shift || {};
  emp_attendance_data.tomorrow_shift = tomorrow_shift || {};
  emp_attendance_data.checkin = data.check_in_time;
  emp_attendance_data.monthly_overtime = parseFloat(data.monthly_overtime || 0);
  emp_attendance_data.weekly_overtime = parseFloat(data.weekly_overtime || 0);
  emp_attendance_data.monthly_payable_hours = parseFloat(
    data.monthly_payable_hours || 0
  );
  emp_attendance_data.weekly_payable_hours = parseFloat(
    data.weekly_payable_hours || 0
  );
  emp_attendance_data.employee_name = data.employee_name;
  emp_attendance_data.employee_serial_number = data.employee_serial_number;

  emp_attendance_data.monthly_leaves = data.monthly_leaves;
  emp_attendance_data.weekly_leaves = data.weekly_leaves;
  emp_attendance_data.is_leave_today = data.is_leave_today;
  emp_attendance_data.leave_details = data.leave_details;
  emp_attendance_data.break_hours = data.break_hours;
  emp_attendance_data.this_month_offs = data.this_month_offs;
  emp_attendance_data.this_week_offs = data.this_week_offs;
  emp_attendance_data.checkout = data.check_out_time;
  emp_attendance_data.total_hours = data.total_hours;
  emp_attendance_data.break_time = data.break_time;
  emp_attendance_data.break_object = data.break_object;
  emp_attendance_data.overtime = data.overtime;
  emp_attendance_data.is_off_today = data.is_off_today;
  emp_attendance_data.is_off_yesterday = data.is_off_yesterday;
  emp_attendance_data.off_today = data.off_today;
  emp_attendance_data.off_yesterday = data.off_yesterday;
  emp_attendance_data.off_tomorrow = data.off_tomorrow;
  emp_attendance_data.is_off_tomorrow = data.is_off_tomorrow;
  emp_attendance_data.overtime = data.overtime;
  return emp_attendance_data;
}

export async function mapAttendanceAdjustmentData(data) {
  const attendanceAdjustmentData = {};
  for (const key of Object.keys(AttendanceAdjustment)) {
    if (key === "approval_details") {
      const approver_logs = data["approval_logs"] || [];
      const approval_levels = data["approval_levels"] || [];
      const level_list = approval_levels
        .map((level) => {
          const level_number = parseInt(level.level_number);
          const logs = approver_logs.find(
            (log) => parseInt(log.level_number) === level_number
          );
          const level_detail = {
            status: "PENDING",
            designation: level.designation,
            level_number: level_number,
            time: null,
          };
          if (level_number === parseInt(data.current_level)) {
            level_detail.approver = data.current_approver;
          } else if (logs) {
            level_detail.status = logs.action_type;
            level_detail.approver = logs.changed_by;
            level_detail.time = logs.timestamp;
          }
          return level_detail;
        })
        .sort((a, b) => a.level_number - b.level_number); // Sort by level_number

      attendanceAdjustmentData[key] = level_list;
    } else {
      if (Object.prototype.hasOwnProperty.call(data, key))
        attendanceAdjustmentData[key] = data[key];
    }
  }

  return attendanceAdjustmentData;
}

export async function mapAttendanceAdjustmentListData(data) {
  if (!Array.isArray(data) || data.length === 0) return [];

  const AttendanceAdjustmentList = await Promise.all(
    data.map((attendanceAdjustment) =>
      mapAttendanceAdjustmentData(attendanceAdjustment)
    )
  );

  return AttendanceAdjustmentList;
}

export function mapAdjustmentFromAttendnaceData(data) {
  const attendanceAdjustmentData = Object.keys(AttendanceAdjustment).reduce(
    (acc, key) => {
      if (key === "employee") acc[key] = data.employee_id;
      else if (key === "attendance") acc[key] = data.id;
      else if (key === "requested_checkin")
        acc[key] = renderTime(data.checkin, data.date);
      else if (key === "requested_checkout")
        acc[key] = renderTime(data.checkout, data.date);
      else if (key === "attendance_date") acc[key] = data.date;
      else if (key === "is_second_shift") acc[key] = false;
      else if (key === "reason") acc[key] = null;
      return acc;
    },
    {}
  );
  attendanceAdjustmentData.date = data.date;
  attendanceAdjustmentData.employee_id = data.employee_id;
  return attendanceAdjustmentData;
}

export function mapAttendanceAdjustmentPayloadData(data, id) {
  // Initialize an empty payload object
  const payload = {};
  // Iterate over the keys in the Task object
  for (const key in AttendanceAdjustment) {
    // Check if the key exists in the data object
    if (
      data.hasOwnProperty(key) &&
      data[key] !== null &&
      data[key] !== undefined
    ) {
      if (key === "reason") payload[key] = data[key].trim();
      else payload[key] = data[key];
    }
  }

  // Return the constructed payload
  return payload;
}

export async function mapTimeAdjustmentData(data) {
  const timeAdjustmentDetails = {};

  for (const key of Object.keys(TimeAdjustment)) {
    if (key === "approval_details") {
      const approver_logs = data["approval_logs"] || [];
      const approval_levels = data["approval_levels"] || [];
      const level_list = approval_levels
        .map((level) => {
          const level_number = parseInt(level.level_number);
          const logs = approver_logs.find(
            (log) =>
              parseInt(log.level_number) === level_number &&
              log.action_type !== "CREATED"
          );
          const level_detail = {
            status: "PENDING",
            designation: level.designation,
            level_number: level_number,
            time: null,
          };
          if (level_number === parseInt(data.current_level)) {
            level_detail.approver = data.current_approver;
          } else if (logs) {
            level_detail.status = logs.action_type;
            level_detail.approver = logs.changed_by;
            level_detail.time = logs.timestamp;
          }
          return level_detail;
        })
        .sort((a, b) => a.level_number - b.level_number); // Sort by level_number

      timeAdjustmentDetails[key] = level_list;
    } else {
      if (Object.prototype.hasOwnProperty.call(data, key))
        timeAdjustmentDetails[key] = data[key];
    }
  }

  return timeAdjustmentDetails;
}

export function mapTimeAdjustmentFromAttendance(
  attendance,
  shiftDetails,
  data = {}
) {
  const TimeAdjustmentObj = {};
  const new_start_time = attendance?.second_checkin ?? attendance?.checkin;

  for (const key of Object.keys(TimeAdjustment)) {
    if (key === "attendance_id") {
      TimeAdjustmentObj[key] = attendance?.id ?? null;
    } else if (key === "checkin_time") {
      TimeAdjustmentObj[key] = new_start_time ?? null;
    } else if (key === "date") {
      TimeAdjustmentObj[key] = attendance?.date ?? null;
    } else if (key === "is_second_shift") {
      TimeAdjustmentObj[key] = Boolean(attendance?.second_checkin);
    } else if (key === "shift_end_time") {
      try {
        const { shifts = [] } = shiftDetails || {};
        const [firstShift = {}, secondShift = {}] = shifts;
        const selectedShift = attendance?.second_checkin
          ? secondShift
          : firstShift;

        const { start_time, end_time } = selectedShift;
        if (!start_time || !end_time || !new_start_time) {
          TimeAdjustmentObj[key] = null;
        } else {
          const ShiftHours = CalculateTotalWorkingHours(start_time, end_time);
          const EndTime = moment(new_start_time).add(ShiftHours, "hours");
          TimeAdjustmentObj[key] = moment(EndTime).utc().toISOString();
        }
      } catch (err) {
        console.error("Error calculating shift_end_time:", err);
        TimeAdjustmentObj[key] = null;
      }
    } else if (key === "shift_start_time") {
      TimeAdjustmentObj[key] = new_start_time ?? null;
    } else {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        TimeAdjustmentObj[key] = data[key];
      } else {
        TimeAdjustmentObj[key] = null;
      }
    }
  }

  return TimeAdjustmentObj;
}
