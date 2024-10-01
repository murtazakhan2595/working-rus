const validateTerminationForm = (values) => {
  const errors = {};
  if (!values.terminate_employee) {
    errors.terminate_employee = "Employee is required";
  }
  if (!values.reason_for_terminating) {
    errors.reason_for_terminating = "Reason is required";
  }
  if (!values.notice_period) {
    errors.notice_period = "Notice period is required";
  }
  if (!values.last_working_day) {
    errors.last_working_day = "Last working day is required";
  }
  if (!values.exit_interview_date) {
    errors.exit_interview_date = "Exit interview date is required";
  }
  console.log("ERRORS", errors);
  return errors;
};


export { validateTerminationForm };