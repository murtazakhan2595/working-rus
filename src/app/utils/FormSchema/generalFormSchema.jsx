import moment from "moment";

export const validateChangePasswordForm = (values) => {
  const errors = {};
  if (!values?.confirm_password)
    errors.confirm_password = "Confirm password is required";
  if (!values?.new_password) errors.new_password = "New Password is required";
  if (!values?.current_password)
    errors.current_password = "Current password is required";
  if (
    values?.confirm_password &&
    values.new_password &&
    values.confirm_password !== values.new_password
  ) {
    errors.confirm_password =
      "Confirm password does not match with new password";
  }
  return errors;
};

export const validateResetPasswordForm = (values = {}) => {
  const errors = {};
  const { password = "", confirm_password = "" } = values;
  const passwordError = validatePasswordFieldSchema(password);
  const confirmPasswordError = validatePasswordFieldSchema(confirm_password);
  if (passwordError) {
    errors.password = passwordError;
  }
  if (confirmPasswordError) {
    errors.confirm_password = confirmPasswordError;
  }
  if (
    !passwordError &&
    !confirmPasswordError &&
    password !== confirm_password
  ) {
    errors.confirm_password = "Confirm password does not match with password";
  }
  return errors;
};

export const validatePasswordFieldSchema = (Password) => {
  if (!Password) return "Password is required";
  const password = Password.trim();
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  if (!hasLetter) {
    return "Password must contain at least one letter";
  }
  if (!hasNumber) {
    return "Password must contain at least one number";
  }
  return null; // Valid password
};

export const validateStartAndEndDateField = (start_date, end_date) => {
  const errors = {};
  if (!start_date) errors.start_date = "Start date is required";
  if (!end_date) errors.end_date = "End date is required";
  if (start_date && end_date) {
    const startDate = moment(start_date).endOf("day");
    const endDate = moment(end_date).endOf("day");
    if (startDate.isAfter(endDate)) {
      errors.end_date = "End cannot be before start date.";
    }
  }
  return errors
};
