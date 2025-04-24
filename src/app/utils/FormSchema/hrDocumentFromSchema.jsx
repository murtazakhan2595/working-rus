export const validationHRDocumentFormSchema = (values) => {
  const errors = {};
  if (!values.acknowledgment_type)
    errors.acknowledgment_type = "Acknowledgment Type is required";
  if (!values.name) errors.name = "Name is required";
  if (!values.category) errors.category = "Category is required";
  if (!values.expiration_date) errors.expiration_date = "Date is required";
  if (!values.description) errors.description = "Note is required";
  if (!values.target_audience)
    errors.target_audience = "Target Audience is required";
  if (values.target_audience) {
    if (values.target_audience === "Department" && !values.object_id)
      errors.object_id = "Department is required";
    if (values.target_audience === "Specific Employee" && !values.object_id)
      errors.object_id = "Employee is required";
  }
  return errors;
};
export const validationDocumentCategoryFormSchema = (values) => {
  const errors = {};
  if (!values.name) errors.name = "Name is required";
  return errors;
};
