export const validateGraceTimeFormSchema = (values) => {
  const errors = {};
  if (!values.name) errors.name = "Name is required";
  if (!values.grace_time_minutes)
    errors.grace_time_minutes = "Grace time is required in minutes";
  else if (values.grace_time_minutes) {
    const grace_time = parseInt(values.grace_time_minutes);
    if (grace_time <= 0 || grace_time > 60)
      errors.grace_time_minutes = "Grace time should be between 1-60 minutes";
  }
  if (!values.branches) errors.branches = "Branch is required";
  else if (values.branches) {
    const branches = values.branches;
    if (!Array.isArray(branches) || branches.length === 0)
      errors.branches = "Atleast one branch is required";
  }
  return errors;
};

export const validateRatingScaleFormSchema = (values) => {
  const errors = {};
  if (!values.rating_values || values.rating_values.length === 0);
  errors.rating_values = "Atleast one rating value is required";
return errors;
};
