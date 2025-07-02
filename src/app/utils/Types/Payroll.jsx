import moment from "moment";

export const PayRun = {
  id: null,
  end_date: moment().endOf("month").format("YYYY-MM-DD"),
  salary_on_hold: [],
  nationalities: null,
  is_payroll_run: false,
  departments: null,
  branches: null,
  start_date: moment().startOf("month").format("YYYY-MM-DD"),
  managers: null,
  religions: null,
  month: moment().startOf("month").format("YYYY-MM-DD"),
  genders: null,
  payrun_date: `${moment().startOf("month").format("YYYY-MM-DD")},${moment()
    .endOf("month")
    .format("YYYY-MM-DD")}`,
  excluded_employees: [],
  excluded_employees_total_net: null,
};

export const EmployeePayRoll = {
  basic_salary: null,
  salary_type: null,
  id: null,
  gross_salary: null,
  ctc: null,
  house_allowance: null,
  employee: null,
  hourly_rate: null,
  is_eos_applicable: null,
  is_new: null,
  latest_effective_date: null,
  medical_allowance: null,
  name: null,
  other_allowance: null,
  payout_period: null,
  salary_breakdown_type: null,
  serial_number: null,
  total_deductions: null,
  total_deductions_types: null,
  total_earnings: null,
  total_earnings_types: null,
  total_reimbursements: null,
  transport_allowance: null,
  work_email: null,
};

export const EmployeeSalary = {
  basic_salary: null,
  salary_type: null,
  id: null,
  gross_salary: null,
  ctc: null,
  house_allowance: null,
  employee: null,
  hourly_rate: null,
  is_eos_applicable: null,
  is_new: null,
  medical_allowance: null,
  other_allowance: null,
  transport_allowance: null,
  salary_breakdown_type: "fixed",
  earning_types: [],
  earnings: [],
  deduction_types: [],
  deductions: [],
};
export const EmployeeSalaryRevision = {
  new_salary: null,
  previous_salary: null,
  revision_difference: null,
  percentage: null,
  last_revised_date: null,
  effective_date: null,
  notes: null,
  revision_letter: "DRAFT",
  revision_status: "PENDING",
};

export const EmployeePayRunPaySlip = {
  basic_salary: null,
  total_earnings: [],
  employeeid: null,
  reimbursements: null,
  inflation_effect: null,
};

export const PayrollAdjustment = {
  amount: null,
  amount_type: null,
  name: null,
  scope: null,
  type: null,
  calculated_amount: null,
};


export const FinalSettlement = {
  last_working_date: null,
  remaining_salary: null,
  earned_leave_encashment: null,
  total_deductions: null,
  gratuity_amount: null,
  final_amount: null,
  notes: null,
  employee_payroll: null,
  id: null,
};