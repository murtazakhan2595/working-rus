import moment from "moment";
import { renderTime } from "utils/DateTimeUtils";
import { EMAIL_REGEX } from "app/utils/Types/ValidationPattern";

export const validateRequiredFields = (Fields = [], values) => {
  const errors = {};

  // Check if Fields is a valid array
  if (!Array.isArray(Fields) || Fields.length === 0) return errors;

  for (const Field of Fields) {
    if (!Field || typeof Field !== "object") continue;

    const { name, required, label, renderCondition, value } = Field;
    if (renderCondition === false) continue;
    // Ensure name exists and is a string
    if (required && typeof name === "string" && typeof label === "string") {
      if (!values[name] && !value) errors[name] = `${label} is required`;
    }
  }

  return errors;
};

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
  if (!start_date) errors.start_date = true;
  if (!end_date) errors.end_date = true;
  if (start_date && end_date) {
    const startDate = moment(start_date).startOf("day");
    const endDate = moment(end_date).startOf("day");
    if (startDate.isAfter(endDate)) {
      errors.end_date_before = true;
    }
  }
  return errors;
};
export const validateEmailField = (email, label) => {
  if (!email) return `${label} is required`;
  else if (email && !EMAIL_REGEX.test(email)) return `${label} is invalid`;
  return null;
};

export const validateStartAndEndTimeField = (
  start_time,
  end_time,
  date = moment().format("YYYY-MM-DD")
) => {
  // Ensure both times are provided
  if (!start_time) {
    return true;
  }
  if (!end_time) {
    return true;
  }

  // Only continue if both times exist
  if (start_time && end_time) {
    const start = moment(renderTime(start_time, date));
    const end = moment(renderTime(end_time, date));

    if (!start.isValid()) {
      return true;
    }
    if (!end.isValid()) {
      return true;
    }

    // Compare times only if valid
    if (start.isValid() && end.isValid()) {
      if (end.isBefore(start)) {
        return true;
      }
    }
  }
  return false;
};
