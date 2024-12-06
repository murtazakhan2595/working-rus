

const validationTaskFormSchema = (values) => {
  const errors = {};
  if (!values.name) errors.name = "Name is required";
  if (!values.description) errors.description = "Description is required";
  if (!values.end_date) errors.end_date = "Due date is required";
  if (!values.assigned_by) errors.assigned_by = "Assigned by is required";
  if (values.assigned_to && values.assigned_to.length === 0)
    errors.assigned_to = "Atleast one assignee is required";
  return errors;
};

export { validationTaskFormSchema };
