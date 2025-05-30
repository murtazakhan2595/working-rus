export const Attendance = {
  break_duration: null,
  total_hours: null,
  overtime_hours: null,
  payable_hours: null,
  checkin: null,
  checkout: null,
  date: null,
  is_weekend: false,
  is_absent: false,
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
};
