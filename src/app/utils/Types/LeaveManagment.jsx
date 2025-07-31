const Leave = {
  leave_duration: null,
  leave_type: null,
  start_date: null,
  end_date: null,
  full_paid_days: null,
  half_paid_days: null,
  total_days: null,
  reason: null,
  is_full_paid: true,
  status: null,
  reason: null,
  id: null,
  leave_type_name: null,
  leave_duration_name: null,
  employee: null,
  created_at: null,
  request_id: null,
  approval_details: null,
  attachment: null,
  is_cancelled: false,
  employee_department_name: null,
  employee_designation: null,
  employee_branch_name: null,
  employee_name: null,
  employee_serial_number: null,
};

const EmployeeLeaveTypesList = {
  count: 0,
  results: [],
  leaveTypes: 0,
  allotedLeaves: 0,
  remainingLeaves: 0,
  usedLeaves: 0,
};

export const LeaveType = {
  id: null,
  name: "",
  short_code: "",
  leave_count: "",
  is_carry_forward_allowed: false,
  max_carry_forward_limit: "",
  is_encashable: false,
  requires_attachment: false,
  min_days_notice: "",
  branches_ids: [],
  departments_ids: [],
  nationalities: [],
  branches: null,
  departments: null,
  genders: [],
  marital_statuses: [],
  grades: [],
  probation_restriction: false,
  day_count_type: "work_days", // Set default value for radio button
  max_consecutive_days: "",
  is_all_paid: true, // Set default to true
  full_paid_days: "",
  half_paid_days: "",
  status: true, // Set default to active
  tooltip_info: "",
  created_at: null,
  updated_at: null,
};

export const PublicHoliday = {
  name: null,
  date: null,
  end_date: null,
  branches: null,
  country: null,
  religion: null,
  id: null,
};

export const LeaveOffsetSetting = {
  nationalities: null,
  grades: null,
  branches: null,
  departments: null,
  offset_leave_days: 1,
  conversion_ratio_hours: null,
  validity_months: null,
  leave_cap_enabled: false,
  max_leaves_per_month: null,
  max_leaves_per_year: null,
  leave_type: 1,
  id: null,
  branches_name: null,
  departments_name: null,
  grades_name: null,
  genders: null,
};

export { Leave, EmployeeLeaveTypesList };
