import moment from "moment";

const validateLeaveRequestFormSchema = (values) => {
  const errors = {};
  if (!values.component_type) errors.component_type = "Leave type is required";
  if (!values.no_of_days) errors.no_of_days = "Number of days is required";
  if (!values.start_date) errors.start_date = "Start date is required";
  if (!values.end_date) errors.end_date = "End date is required";
  if (!values.reason) errors.reason = "Reason is required";
  if (values.start_date && values.end_date) {
    const startDate = moment(values.start_date).endOf("day");
    const endDate = moment(values.end_date).endOf("day");
    if (startDate.isAfter(endDate)) {
      errors.end_date = "End cannot be before start date.";
    }
  }
  return errors;
};

const validateLeaveDurationFormSchema = (values) => {
  const errors = {}
  if(!values.duration_name){
    errors.duration_name = "Duration name is required";
  }
  if(!values.duration_hours){
    errors.duration_hours = "Duration hours is required";
  }else if(isNaN(values.duration_hours)){
    errors.duration_hours = "Duration hours must be a number";
  }
  if(!values.nationalities){
    errors.nationalities = "Nationalities are required";
  }
  if(!values.branches_ids){
    errors.branches_ids = "Branches are required";
  }
  if(!values.departments_ids){
    errors.departments_ids = "Departments are required";
  }
  return errors;
}

export { validateLeaveRequestFormSchema, validateLeaveDurationFormSchema };
