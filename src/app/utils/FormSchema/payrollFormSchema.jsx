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
  if (!values.last_revised_date)
    errors.last_revised_date = "Last Revised Date is required";

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

// Validation function for the adjustment form
const validateAdjustmentForm = (values) => {
  const errors = {};

  // Required fields
  if (!values.employee_id) errors.employee_id = "Employee is required";
  if (!values.amounts) errors.amounts = "Amount is required";
  if (!values.month) errors.month = "Payable Month is required";
  if(!values.name) errors.name = "Adjustment name is required";

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
