import {
  Attendance,
  Shift,
  TimeAdjustment,
  AttendanceAdjustment,
} from "app/utils/Types/Attendance";
import {
  CalculateTotalWorkingHours,
  calculateTotal,
  calculateAverage,
  calculatePercentage,
} from "utils/renderValues";
import moment from "moment";
import { renderTime } from "utils/DateTimeUtils";
import { calculateTotalCount } from "utils/renderValues";
import { mapApproverDetails } from "app/utils/MappingObjects/mapGeneralData";

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

export function mapAttendanceCheckInPayload(
  time,
  attendance,
  isSplitShift,
  employee_id
) {
  if (attendance && attendance?.checkout && !isSplitShift) {
    return null;
  }
  if (attendance && attendance?.second_checkout && isSplitShift) {
    return null;
  }
  const checkInTime = moment(time).utc().toISOString();
  // Compare time only
  const payload = {
    employee_id: employee_id,
    date: moment(time).format("YYYY-MM-DD"),
  };
  if (isSplitShift && attendance?.checkin && !attendance?.second_checkin)
    payload.second_checkin = checkInTime;
  else if (!attendance?.checkin) payload.checkin = checkInTime;
  return payload;
}
export function mapAttendanceCheckOutPayload(time, attendance, isSplitShift) {
  if (!attendance) return null;
  const checkout = moment(time).utc().toISOString();
  const payload = {
    break_duration: attendance?.break_duration,
    checkin: attendance?.checkin,
    second_checkin: attendance?.second_checkin,
    id: attendance?.id,
    payable_hours: attendance?.payable_hours,
    date: attendance.date,
  };
  if (
    isSplitShift &&
    attendance?.second_checkin &&
    !attendance?.second_checkout
  )
    payload.second_checkout = checkout;
  else if (!attendance?.checkout) payload.checkout = checkout;
  return payload;
}

export function mapAttendanceData(data, shiftDetails) {
  const [firstShift, secondShift] = shiftDetails?.shifts || [];
  const Hours = shiftDetails?.total_hours ?? data.total_hours ?? 0;
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
        payload[key] = renderTime(data[key], attendanceDate);
        const checkInTime = moment(payload.checkin);
        if (shiftDetails) {
          payload.is_absent = false;
        }
        // payload.is_weekend = [0, 6].includes(moment(checkInTime).day());
        if (firstShift?.start_time) {
          // Now check if check-in is after the shift start
          const shiftStartTime = renderTime(
            firstShift?.start_time,
            attendanceDate
          );
          const isLate = checkInTime.isAfter(shiftStartTime);
          payload["status"] = isLate ? "Late" : "Present";
          payload["is_late"] = isLate;
          payload["is_absent"] = false;
        } else {
          payload["status"] = "Present";
          payload["is_absent"] = false;
        }
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
        if (
          parseFloat(payload.payable_hours) >
          parseFloat(payload.total_hours || 0)
        ) {
          payload["overtime_hours"] = parseFloat(
            parseFloat(payload.payable_hours) -
              parseFloat(payload.total_hours || 0)
          ).toFixed(2);
        } else {
          payload["overtime_hours"] = parseFloat(0).toFixed(2);
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
        if (
          parseFloat(payload.payable_hours) >
          parseFloat(payload.total_hours || 0)
        ) {
          const overtime = parseFloat(
            parseFloat(payload.payable_hours) -
              parseFloat(payload.total_hours || 0)
          ).toFixed(2);
          payload["overtime_hours"] = overtime;
          payload["remaining_offset_leave_hours"] = overtime;
        } else {
          payload["overtime_hours"] = parseFloat(0).toFixed(2);
          payload["remaining_offset_leave_hours"] = parseFloat(0).toFixed(2);
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
  const breaks = Array.isArray(breakData.results)
    ? breakData.results
    : breakData;

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
  emp_attendance_data.monthly_total_hours = monthly_total_hours;
  const weekly_total_hours = calculateTotal(WeeklyShiftDataList, "total_hours");
  emp_attendance_data.weekly_total_hours = weekly_total_hours;
  const today_shift = MonthlyShiftDataList.find(
    (shift) => shift.date === moment().format("YYYY-MM-DD")
  );
  emp_attendance_data.today_shift = today_shift || {};
  const yesterday_shift = MonthlyShiftDataList.find(
    (shift) => shift.date === moment().subtract(1, "day").format("YYYY-MM-DD")
  );
  emp_attendance_data.yesterday_shift = yesterday_shift || {};
  const tomorrow_shift = MonthlyShiftDataList.find(
    (shift) => shift.date === moment().add(1, "day").format("YYYY-MM-DD")
  );
  emp_attendance_data.tomorrow_shift = tomorrow_shift || {};
  emp_attendance_data.default_shift = data.default_shift;
  emp_attendance_data.employee_id = data.employee_id;
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
  emp_attendance_data.this_month_offs = data.this_month_offs;
  emp_attendance_data.this_week_offs = data.this_week_offs;
  emp_attendance_data.is_off_today = today_shift.isOffToday;
  emp_attendance_data.off_today = today_shift.OffLabel;

  return emp_attendance_data;
}

export async function mapAttendanceAdjustmentData(
  data,
  fetchApprovalDetails = true
) {
  const attendanceAdjustmentData = {};
  for (const key of Object.keys(AttendanceAdjustment)) {
    if (key === "approval_details" && fetchApprovalDetails) {
      attendanceAdjustmentData[key] = await mapApproverDetails(data);
    } else {
      if (Object.prototype.hasOwnProperty.call(data, key))
        attendanceAdjustmentData[key] = data[key];
    }
  }

  return attendanceAdjustmentData;
}

export async function mapAttendanceAdjustmentListData(data) {
  if (!Array.isArray(data) || data.length === 0) return [];

  const ResponseList = await Promise.all(
    data.map(async (item) => {
      return await mapAttendanceAdjustmentData(item);
    })
  );

  return ResponseList;
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

export async function mapTimeAdjustmentData(data, fetchApprovalDetails = true) {
  const timeAdjustmentDetails = {};

  for (const key of Object.keys(TimeAdjustment)) {
    if (key === "approval_details" && fetchApprovalDetails) {
      timeAdjustmentDetails[key] = await mapApproverDetails(data);
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

export function mapEmpAttendanceOverview({
  attendanceDetails = [],
  shiftResponse = [],
}) {
  const attendanceOverview = {};
  attendanceOverview.late_count = calculateTotalCount(
    attendanceDetails,
    "is_late",
    true
  );
  attendanceOverview.overtime_hours = calculateTotal(
    attendanceDetails,
    "overtime_hours"
  );
  attendanceOverview.payable_hours = calculateTotal(
    attendanceDetails,
    "payable_hours"
  );
  attendanceOverview.total_hours = calculateTotal(
    attendanceDetails,
    "total_hours"
  );
  attendanceOverview.average_hours = calculateAverage(
    attendanceDetails,
    "payable_hours",
    "total_hours"
  );

  attendanceOverview.present_count = attendanceDetails?.length || 0;
  attendanceOverview.working_days = calculateTotalCount(
    shiftResponse,
    "isOffToday",
    false
  );
  attendanceOverview.absent_count = parseInt(
    parseInt(attendanceOverview.working_days) - attendanceOverview.present_count
  );
  attendanceOverview.on_time_percentage = calculatePercentage(
    attendanceOverview.late_count,
    attendanceOverview.working_days
  );

  return attendanceOverview;
}

/**
 * Maps and validates biometric break payload based on time and existing records.
 *
 * @param {Object} data - The break data containing `time` and other optional fields.
 * @param {Array} existingData - Array of existing break records to check for duplicates.
 * @returns {Object|null|boolean} - Returns payload object, `null` if duplicate found, or `true` if break cannot be created.
 */
export function mapBreakPayloadData(data, existingData = []) {
  // Return empty object if data is missing or time is not provided
  if (!data || !data.time) return {};

  const formattedTime = moment(data.time).utc().toISOString();

  // Validate existing data presence and structure
  if (Array.isArray(existingData) && existingData.length > 0) {
    const isDuplicate = existingData.some((entry) => {
      if (!entry || (!entry.starttime && !entry.endtime)) return false;

      const startTime = entry.starttime
        ? moment(entry.starttime).utc().toISOString()
        : null;
      const endTime = entry.endtime
        ? moment(entry.endtime).utc().toISOString()
        : null;

      return formattedTime === startTime || formattedTime === endTime;
    });

    if (isDuplicate) {
      // Skip adding break if time matches any existing break
      return null;
    }

    // If no valid endtime in the most recent break, prevent new break
    const lastBreakEndTime = existingData[0]?.endtime;
    if (!lastBreakEndTime) {
      return {
        endtime: formattedTime,
        id: existingData[0]?.id,
      };
    }
  }

  // Build and return the break payload
  return {
    reason: "Biometric break",
    break_type: "Other",
    starttime: formattedTime,
    ...data,
  };
}
