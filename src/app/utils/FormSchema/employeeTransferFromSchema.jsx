export const validationEmpTranferFormSchema = (
  values,
  validateRejectionReasonOnly = false
) => {
  const errors = {};
  if (!validateRejectionReasonOnly) {
    if (!values.transfer_type)
      errors.transfer_type = "Transfer Type is required";
    if (!values.employee_id) errors.employee_id = "Employee is required";
    if (!values.new_department)
      errors.new_department = "Department name is required";
    if (values.transfer_type === "EXTERNAL" && !values.new_branch)
      errors.new_branch = "Location is required";
    if (!values.reason_of_transfer || !values.reason_of_transfer.trim())
      errors.reason_of_transfer = "Reason is required";
    if (!values.effective_transfer_date) {
      errors.effective_transfer_date = "Effective transfer date is required";
    } else {
      // Get today's date at midnight (start of the day)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Convert the selected date to a Date object
      const selectedDate = new Date(values.effective_transfer_date);
      selectedDate.setHours(0, 0, 0, 0);

      // Compare dates to prevent past dates
      if (selectedDate < today) {
        errors.effective_transfer_date =
          "Effective transfer date cannot be in the past";
      }
    }
  } else {
    if (!values.reason_of_rejection)
      errors.reason_of_rejection = "Reason is required";
  }
  return errors;
};
