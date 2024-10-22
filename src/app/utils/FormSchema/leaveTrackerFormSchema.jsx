const validateLeaveRequestFormSchema = (values) => {
  const errors = {};
  if (!values.component_type) errors.component_type = "Leave type is required";
  if (!values.no_of_days) errors.no_of_days = "Number of days is required";
  if (!values.start_date) errors.start_date = "Start date is required";
  if (!values.end_date) errors.end_date = "End date is required";
  if (!values.reason) errors.reason = "Reason is required";
  return errors;
};

export { validateLeaveRequestFormSchema };
