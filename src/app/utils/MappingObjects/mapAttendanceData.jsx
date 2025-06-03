import {
  Attendance,
  Shift,
  TimeAdjustment,
  AttendanceAdjustment,
} from "app/utils/Types/Attendance";
import { CalculateTotalWorkingHours, calculateTotal } from "utils/renderValues";
import moment from "moment";

export function mapShiftData(data) {
  const shiftDetails = Object.keys(Shift).reduce((acc, key) => {
    if (data.hasOwnProperty(key)) {
      if (key === "starttime")
        acc["shiftStartTime"] = moment(data[key]).format("hh:mm A");
      if (key === "endtime")
        acc["shiftEndTime"] = moment(data[key]).format("hh:mm A");
      acc[key] = data[key];
    }
    return acc;
  }, {});
  return shiftDetails;
}
export function mapAttendanceData(data, shiftDetails) {
  const [firstShift, secondShift] = shiftDetails?.shifts||[];
  const Hours = shiftDetails.total_hours;
  // Initialize an empty payload object
  const payload = { total_hours: Hours };
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
        const shiftStartTime = firstShift.start_time;
        const checkInTime = moment(data[key]);
        payload[key] = data[key];
        if (shiftDetails) {
          payload.is_absent = false;
        }
        payload.is_weekend = [0, 6].includes(checkInTime.day());
        // Assume shiftDetails.start_time and end_time are time strings like "09:00 AM"
        const shiftDate = checkInTime.clone().startOf("day"); // Today's date (midnight)
        // Combine date with shift time to make full datetime
        const startTime = moment.utc(
          `${shiftDate.format("YYYY-MM-DD")} ${shiftStartTime}`,
          "YYYY-MM-DD hh:mm A"
        );
        // Now check if check-in is after the shift start
        const isLate = checkInTime.isAfter(startTime);
        payload["status"] = isLate ? "Late" : "Present";
        payload["is_late"] = isLate;
        payload["is_absent"] = false;
      } else if (key === "checkout") {
        const checkin = moment(payload.checkin);
        payload[key] = data[key];
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
      } else payload[key] = data[key];
    }
  }

  // Return the constructed payload
  return payload;
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
  emp_attendance_data.overtime = data.overtime;
  emp_attendance_data.overtime = data.overtime;
  return emp_attendance_data;
}

export async function mapAttendanceAdjustmentData(data) {
  const attendanceAdjustmentData = Object.keys(AttendanceAdjustment).reduce(
    (acc, key) => {
      if (data.hasOwnProperty(key)) {
        acc[key] = data[key];
      }
      return acc;
    },
    {}
  );
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
      else if (key === "requested_checkin") acc[key] = data.checkin;
      else if (key === "requested_checkout") acc[key] = data.checkout;
      else if (data.hasOwnProperty(key)) {
        acc[key] = data[key];
      }
      return acc;
    },
    {}
  );
  attendanceAdjustmentData.date = data.date;
  attendanceAdjustmentData.employee_id = data.employee_id;
  attendanceAdjustmentData.status = data.status;
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
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      if (key === "approval_logs") {
        const approver_logs = data[key] || [];
        const logs_list = approver_logs
          .filter((log) => log.action_type !== "CREATED")
          .map((log) => ({
            status: log.action_type,
            approver: log.changed_by,
            level_number: log.level_number,
            time: log.timestamp,
          }))
          .sort((a, b) => a.level_number - b.level_number); // Sort by level_number

        timeAdjustmentDetails[key] = logs_list;
      } else {
        timeAdjustmentDetails[key] = data[key];
      }
    }
  }

  return timeAdjustmentDetails;
}
