const validateRevisedSalaryForm = (values, isEditMode) => {
  const errors = {};
  if (values.previous_salary === null || values.previous_salary === undefined || values.previous_salary === "") {
    errors.previous_salary = "Previous CTC is required";
  }
  if (!values.new_salary) errors.new_salary = "Revised CTC is required";
  if (!values.last_revised_date)
    errors.last_revised_date = "Last Revised Date is required";

  return errors;
};

const validateClaimRequestForm = (values) =>{
  const errors = {};
  if(!values.expense_type){
    errors.expense_type = "Expense Type is required";
  }
  if(!values.amount){
    errors.amount = "Amount is required";
  }
  if(!values.payment_date){
    errors.payment_date = "Date of Expense is required";
  }
  if(!values.description){
    errors.description = "Description is required";
  } 
  return errors;
}

export { validateRevisedSalaryForm, validateClaimRequestForm };
