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
  if (!values.termination_letter) {
    errors.termination_letter = "Termination letter is required";
  }
  return errors;
};

const validateClearanceForm = (values) => {
  const errors = {};
  
  // Required field validation
  if (!values.last_working_date) {
    errors.last_working_date = "Last working date is required";
  }
  
  if (!values.remaining_salary) {
    errors.remaining_salary = "Remaining salary is required";
  } else if (isNaN(Number(values.remaining_salary)) || Number(values.remaining_salary) < 0) {
    errors.remaining_salary = "Please enter a valid positive number";
  }
  
  if (!values.final_amount) {
    errors.final_amount = "Final amount is required";
  } else if (isNaN(Number(values.final_amount))) {
    errors.final_amount = "Please enter a valid number";
  }
  
  // Optional fields number validation
  if (values.earned_leave_encashment && (isNaN(Number(values.earned_leave_encashment)) || Number(values.earned_leave_encashment) < 0)) {
    errors.earned_leave_encashment = "Please enter a valid positive number";
  }
  
  if (values.total_deductions && (isNaN(Number(values.total_deductions)) || Number(values.total_deductions) < 0)) {
    errors.total_deductions = "Please enter a valid positive number";
  }
  
  if (values.gratuity_amount && (isNaN(Number(values.gratuity_amount)) || Number(values.gratuity_amount) < 0)) {
    errors.gratuity_amount = "Please enter a valid positive number";
  }
  
  return errors;
}

export { validateTerminationForm, validateClearanceForm };