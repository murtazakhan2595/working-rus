export const AmountPattern = /^[0-9][0-9]*[.]?[0-9]{0,2}$$/;

// Email Validation: Ensures proper email format, e.g., user@example.com
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

//Password Validation (At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character)
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

//Phone Number Validation (Supports international formats Allows numbers with optional + for country codes)
export const PHONE_REGEX = /^\+?[0-9]{10,15}$/;

//URL Validation(Supports both HTTP & HTTPS URLs)
export const URL_REGEX = /^(https?:\/\/)?([\w\d-]+\.)+[\w\d]{2,}(\/.*)?$/;

//Hex Color Code Validation(Supports both 3 and 6 character hex colors)
export const HEX_COLOR_REGEX = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;

//Date Validation (YYYY-MM-DD format)
export const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// Only Numbers (Integer validation)
export const NUMBER_REGEX = /^\d+$/;

// Alphabetic Characters Only
export const ALPHA_REGEX = /^[A-Za-z\s]+$/;

//Alphanumeric Validation (Letters + Numbers, no special characters)
export const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9]+$/;

//Blood Group Validation
export const BLOOD_GROUP_REGEX = /^(A|B|AB|O)[+-]$/;
