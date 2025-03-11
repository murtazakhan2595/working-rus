export const validationEmpTranferFormSchema = (values) => {
  const errors = {};
  if (!values.transfer_type) errors.transfer_type = "Transfer Type is required";
  if (!values.employee_id) errors.employee_id = "Employee is required";
  if (!values.new_department)
    errors.new_department = "Department name is required";
  if (!values.new_location) errors.new_location = "Location is required";
  if (!values.effective_transfer_date)
    errors.effective_transfer_date = "Date is required";
  if (!values.reason_of_transfer)
    errors.reason_of_transfer = "Reason is required";
  return errors;
};
