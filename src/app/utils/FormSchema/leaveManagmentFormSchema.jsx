const validationLeaveRequestFormSchema = (values, allowedLeaves) => {
  const errors = {};
  if (!values.start_date) errors.start_date = "Start date is required";
  if (!values.end_date) errors.end_date = "End date is required";
  if (!values.rejoining_date)
    errors.rejoining_date = "Rejoing dater is required";
  if (!values.total_leave) errors.total_leave = "Total leaves is required";
  if (!values.leave_type) errors.leave_type = "Leave type is required";
  if (!values.reason) errors.reason = "Reason is required";
  if (!values.contact_no) errors.contact_no = "Contact No. is required";
  if (values.total_leave && values.total_leave > allowedLeaves)
    errors.total_leave = `${allowedLeaves} leaves are allowed only.`;
  return errors;
};

export { validationLeaveRequestFormSchema };
