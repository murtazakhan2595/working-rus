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

export { validateLeaveRequestFormSchema };
