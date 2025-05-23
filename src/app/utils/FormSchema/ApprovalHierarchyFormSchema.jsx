export const validateApprovalHierarchyFormSchema = (values) => {
  const errors = {};
  if (!values?.name?.trim()) errors.name = "Name is required";
  if (!values?.request_type) errors.request_type = "Request type is required";
  if (values.auto_forward_enabled)
    if (!values.auto_forward_threshold)
      errors.auto_forward_threshold = "Threshold in hours is required";
  return errors;
};
