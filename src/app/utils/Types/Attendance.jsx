export const Attendance = {
  id: null,
  break_duration: null,
  total_hours: null,
  overtime_hours: null,
  payable_hours: null,
  checkin: null,
  checkout: null,
  second_checkin: null,
  second_checkout: null,
  date: null,
  is_weekend: false,
  is_absent: true,
  is_late: false,
  status: "Present",
  employee_id: null,
};

export const Shift = {
  endtime: null,
  id: null,
  name: null,
  starttime: null,
  type: null,
  weekdays: null,
};

export const TimeAdjustment = {
  attendance_id: null,
  reason: null,
  status: "PENDING",
  id: null,
  approval_logs: null,
  checkin_time: null,
  date: null,
  created_at: null,
  request: null,
  employee_id: null,
};
export const TimeAdjustmentLogs = {
  employee_id: null,
  employee_name: null,
  employee_email: null,
  branch: null,
  department: null,
  checkin_time: null,
  reason: null,
  shift_start: null,
  shift_end: null,
  submission_time: null,
  approval_status: null,
  action_by_name: null,
  action_time: null,
};

export const AttendanceAdjustment = {
  employee: null,
  attendance: null,
  requested_checkin: null,
  requested_checkout: null,
  reason: null,
};
