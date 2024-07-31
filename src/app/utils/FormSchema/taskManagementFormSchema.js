

const validationTaskFormSchema = (values) => {
  const errors = {};
  if (!values.name) errors.name = "Name is required";
  if (!values.description) errors.description = "Description is required";
  if (!values.start_date) errors.start_date = "Start date is required";
  if (!values.end_date) errors.end_date = "End date is required";
  if (!values.priority) errors.priority = "Priority is required";
  if (!values.assigned_by) errors.assigned_by = "Assigned by is required";
  if (values.assigned_to && values.assigned_to.length === 0)
    errors.assigned_to = "Atleast one assignee is required";

  // Check if both start_date and end_date are present before comparing
  if (values.start_date && values.end_date) {
    const startDate = new Date(values.start_date);
    const endDate = new Date(values.end_date);

    if (startDate > endDate) {
      errors.end_date = "End date must be greater than start date";
    }
  }
  return errors;
};

export { validationTaskFormSchema };
