// src/app/utils/Types/ShiftManagement.jsx

export const ShiftSchedule = {
  id: null,
  employee_id: null,
  shift_id: null,
  start_date: "",
  end_date: "",
  is_split_shift: false,
  split_start_time: null,
  split_end_time: null,
  is_off_day: false,
  status: "Pending", // Pending, Approved, Rejected
  assigned_by: null,
  approved_by: null,
  created_at: null,
  updated_at: null,
};

export const ShiftChangeRequest = {
  id: null,
  employee_id: null,
  date: "",
  current_shift_id: null,
  requested_shift_id: null,
  current_start_time: null,
  current_end_time: null,
  requested_start_time: null,
  requested_end_time: null,
  is_current_off: false,
  is_requested_off: false,
  is_current_split: false,
  is_requested_split: false,
  current_split_start_time: null,
  current_split_end_time: null,
  requested_split_start_time: null,
  requested_split_end_time: null,
  requested_by: null,
  requestor_role: "",
  status: "Pending", // Pending, Approved, Rejected
  rejection_reason: null,
  reviewed_by: null,
  review_date: null,
  created_at: null,
  updated_at: null,
};

export const DailySchedule = {
  date: "",
  day: "",
  isOff: false,
  isSplit: false,
  startTime: null,
  endTime: null,
  splitStartTime1: null,
  splitEndTime1: null,
  splitStartTime2: null,
  splitEndTime2: null,
};

export const ScheduleFormValues = {
  dateRange: "",
  employees: [],
  shiftType: "predefined",
  shiftId: "",
  dailySchedule: [],
  totalHours: {
    daily: {},
    weekly: 0,
  },
};

// src/app/utils/Types/Shift.js
export const ShiftInformation = {
  id: null,
  name: "",
  type: "",
  starttime: null,
  endtime: null,
  weekdays: "", // comma-separated days of the week this shift applies to
  is_org_based: false, // whether this is an organization-defined shift
  is_split_shift: false,
  split_start_time1: null,
  split_end_time1: null,
  split_start_time2: null,
  split_end_time2: null,
  created_at: null,
  updated_at: null,
};

export const ActiveShift = {
  date: null,
  is_split_shift: false,
  total_hours: 0,
  shifts: null,
  shift_assigned: true,
  status: false,
  is_weekly_off: false,
  isOffToday: false,
  OffLabel: null,
  is_holiday:false,
  is_on_leave:false,
};
