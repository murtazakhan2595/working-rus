const validateRevisedSalaryForm = (values, isEditMode) => {
  const errors = {};
  if (
    values.previous_salary === null ||
    values.previous_salary === undefined ||
    values.previous_salary === ""
  ) {
    errors.previous_salary = "Previous CTC is required";
  }
  if (!values.new_salary) errors.new_salary = "Revised CTC is required";
  if (!values.effective_date)
    errors.effective_date = "Effective Date is required";
  if (values.new_salary && values.previous_salary) {
    if (parseFloat(values.new_salary) <= parseFloat(values.previous_salary))
      errors.new_salary =
        "Revised CTC cannot be less than equal to previous CTC";
  }

  return errors;
};

const validateClaimRequestForm = (values) => {
  const errors = {};

  if (!values.expense_type) {
    errors.expense_type = "Expense Type is required";
  }

  if (!values.amount) {
    errors.amount = "Amount is required";
  }

  if (!values.payment_date) {
    errors.payment_date = "Date of Expense is required";
  }

  if (!values.description) {
    errors.description = "Description is required";
  } else if (values.description.length < 10) {
    errors.description = "Description must be at least 10 characters";
  }

  if (!values.reason) {
    errors.reason = "Reason is required";
  } else if (values.reason.length < 10) {
    errors.reason = "Reason must be at least 10 characters";
  }

  if (!values.attachment) {
    errors.attachment = "Attachment is required";
  }

  return errors;
};

export const validateGeneratePayRun = (values) => {
  const errors = {};
  if (!values.end_date) {
    errors.payrun_date = "Payroll end date is required";
  }
  if (!values.month) {
    errors.month = "Payroll month is required";
  }
  if (!values.start_date) {
    errors.payrun_date = "Payroll start date is required";
  }
  if (!values.payrun_date) {
    errors.payrun_date = "Payroll date is required";
  }
  return errors;
};
export const validateEmployeeSalarySetupForm = (values) => {
  const errors = {};
  if (!values.gross_salary) {
    errors.gross_salary = "Gross salary is required";
  }
  if (!values.salary_type) {
    errors.salary_type = "Salary type is required";
  }
  if (!values.basic_salary) {
    errors.basic_salary = "Basic salary is required";
  }
  if (!values.salary_breakdown_type) {
    errors.salary_breakdown_type = "Amount Type is required";
  } else {
    const {
      basic_salary = 0,
      medical_allowance = 0,
      transport_allowance = 0,
      house_allowance = 0,
      other_allowance = 0,
      salary_breakdown_type,
    } = values;
    const CTC =
      parseFloat(basic_salary || 0) +
      parseFloat(house_allowance || 0) +
      parseFloat(other_allowance || 0) +
      parseFloat(medical_allowance || 0) +
      parseFloat(transport_allowance || 0);
    if (salary_breakdown_type === "fixed") {
      if (CTC !== parseFloat(values.gross_salary))
        errors.ctc = "CTC must be equal to gross salary";
    }
    if (salary_breakdown_type === "percentage") {
      if (CTC !== 100) errors.ctc = "CTC must be equal to gross salary";
    }
  }
  return errors;
};

// Validation function for the adjustment form
const validateAdjustmentForm = (values) => {
  const errors = {};

  // Required fields
  if (!values.employee_id) errors.employee_id = "Employee is required";
  if (!values.amounts) errors.amounts = "Amount is required";
  if (!values.month) errors.month = "Payable Month is required";
  if (!values.name) errors.name = "Adjustment name is required";

  // Reason is required only if manager rejects
  if (
    values.manager_approval &&
    values.manager_approval.status === "rejected" &&
    (!values.reason || values.reason.trim() === "")
  ) {
    errors.reason = "Reason is required when rejecting an adjustment";
  }

  return errors;
};
export {
  validateRevisedSalaryForm,
  validateClaimRequestForm,
  validateAdjustmentForm,
};
