import Joi from "joi";

const validationEmployeeInfoFormSchema = (values) => {
  const errors = {};
  if (!values.first_name)
    errors.first_name = 'First name is required';
  if (!values.last_name)
    errors.last_name = 'Last name is required';
  if (!values.country_code)
    errors.country_code = 'Phone Country Code name is required';
  if (!values.mobile_no)
    errors.mobile_no = 'Phone number is required';
  if (!values.username)
    errors.username = 'Username is required';
  if (!values.work_email)
    errors.work_email = 'Email is required';
  if (!values.password)
    errors.password = 'Password is required';
  if (!values.user_role)
    errors.user_role = 'User role is required';
  if (!values.residential_address)
    errors.residential_address = 'Address is required';
  if (!values.department_name)
    errors.department_name = 'Department is required';
  if (!values.department_position)
    errors.department_position = 'Designation is required';
  if (!values.direct_report)
    errors.direct_report = 'Manager is required';
  if (!values.department_manager)
    errors.department_manager = 'Manager is required';
  if (!values.employee_type)
    errors.employee_type = 'Employee type is required';
  if (!values.employee_work_type)
    errors.employee_work_type = 'Work type is required';
  if (!values.employee_location)
    errors.employee_location = 'Work location is required';
  if (!values.employee_status)
    errors.employee_status = 'Status is required';
  if (!values.joining_date)
    errors.joining_date = 'Joining date is required';
  if (!values.organization)
    errors.organization = 'Organization is required';
  return errors;
}
const validationPersonalInfoFormSchema = Joi.object({
  first_name: Joi.string().min(3).max(40).required().label("First Name"),
  last_name: Joi.string().min(3).max(40).required().label("Last Name"),
  father_name: Joi.string().min(3).max(40).required().label("Father Name"),
  mother_name: Joi.string().min(3).max(40).required().label("Mother Name"),
  country_code: Joi.string().max(6).required().label("Country Code"),
  mobile_no: Joi.string().required().label("Phone Number"),
  date_of_birth: Joi.string().required().label("DOB"),
  marital_status: Joi.string().min(3).max(20).required().label("Marital Status"),
  nationality: Joi.string().min(3).max(20).required().label("Nationality"),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .label("Personal Email"),
  work_email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .label("Work Email"),
  current_address: Joi.string().required().label("Current Address"),
  residential_address: Joi.string().required().label("Permanent Address"),
  nic: Joi.string().required().label("NIC"),
  emergency_first_name: Joi.string()
    .min(3)
    .max(40)
    .required()
    .label("First Name"),
  emergency_last_name: Joi.string()
    .min(3)
    .max(40)
    .required()
    .label("Last Name"),
  emergency_country_code: Joi.string()
    .pattern(/^\+\d{1,4}$/) // Assuming country codes start with '+' followed by 1 to 4 digits
    .required()
    .label("Country Code")
    .messages({
      "string.empty": `Country Code is required`,
      "string.pattern.base": `Country Code must be a valid country code`,
    }),
  emergency_phone_no: Joi.string()
    .pattern(/^\d{8,15}$/) // Assuming phone numbers are between 10 and 15 digits long
    .required()
    .label("Emergency Phone Number")
    .messages({
      "string.empty": `Emergency Phone Number is required`,
      "string.pattern.base": `Emergency Phone Number must be a valid phone number`,
    }),
  emergency_relation: Joi.string()
    .regex(/^[a-zA-Z\s]+$/)
    .required()
    .label("Relation")
    .messages({
      "string.empty": `Emergency Relation is required`,
      "string.pattern.base": `Emergency Relation must only contain letters and spaces`,
    }),
});


const validationAcademicRecordSchema = Joi.object({
  education_level: Joi.string().required().label("Education Level"),
  program: Joi.string().required().label("Program"),
  institute_name: Joi.string().required().label("Institute Name"),
  edu_start_date: Joi.string().required().label("Start Date"),
  edu_end_date: Joi.string().required().label("End Date"),
  education_body: Joi.object({
    file: Joi.string().required().label('Education Document'),
    name: Joi.string().required().label('File Name')
  }).required().label('Education Body')
});

const validationDepartmentInfoFormSchema = Joi.object({
  department_name: Joi.string()
    .required()
    .label('Department Name')
    .messages({
      "string.empty": `Department Name is required`,
    }),
  department_position: Joi.string()
    .regex(/^[a-zA-Z\s]+$/)
    .required()
    .label('Position')
    .messages({
      "string.empty": `Position is required`,
      "string.pattern.base": `Position must only contain letters and spaces`,
    }),
  employee_status: Joi.string().required().label('Employee status')
    .messages({
      "string.empty": `Employee Status is required`,
    }),
  employee_work_type: Joi.string().required().label('Work Type')
    .messages({
      "string.empty": `Work Type is required`,
    }),
  employee_location: Joi.string().required().label('Employee Location')
    .messages({
      "string.empty": `Employee Location is required`,
    }),
  employee_type: Joi.string().required().label('Employee type')
    .messages({
      "string.empty": `Employee type is required`,
    }),
  department_manager: Joi.string().required().label('Department Manger').messages({
    "string.empty": `Department Manger is required`,
  }),
  joining_date: Joi.string()
    .regex(/^\d{2}-\d{2}-\d{4}$/) // Matches "DD-MM-YYYY" format
    .required()
    .label('Joining Date')
    .messages({
      'string.empty': 'Joining Date is required',
      'string.pattern.base': 'Joining Date must be in "DD-MM-YYYY" format',
    }),
  direct_report: Joi.string().required(),
});

const validationBankDetailsFormSchema = Joi.object({
  bank_name: Joi.string()
    .regex(/^[a-zA-Z\s]+$/) // Only alphabets and spaces allowed
    .required()
    .label("Bank Name")
    .messages({
      "string.empty": `Bank Name is required`,
      "string.pattern.base": `Bank Name must contain only letters and spaces`,
    }),
  account_title: Joi.string()
    .regex(/^[a-zA-Z\s]+$/)
    .required()
    .label("Account Title")
    .messages({
      "string.empty": `Account Title is required`,
      "string.pattern.base": `Account Title must contain only letters and spaces`,
    }),
  account_number: Joi.string()
    .regex(/^\d+$/) // Only numbers allowed
    .min(10) // Minimum length 10 digits
    .required()
    .label("Account Number")
    .messages({
      "string.empty": `Account Number is required`,
      "string.pattern.base": `Account Number must contain only numbers`,
      "string.min": `Account Number must be at least 10 digits long`,
    }),
  branch_address: Joi.string()
    // .min(10) // Minimum length 10 characters
    .required()
    .label("Branch Address")
    .messages({
      "string.empty": `Branch Address is required`,
      "string.min": `Branch Address must be at least 10 characters long`,
    }),
  branch_code: Joi.string()
    .regex(/^\d+$/) // Only numbers allowed
    .min(3) // Minimum length 3 digits
    .required()
    .label("Branch Code")
    .messages({
      "string.empty": `Branch Code is required`,
      "string.pattern.base": `Branch Code must contain only numbers`,
      "string.min": `Branch Code must be at least 3 digits long`,
    }),
  swift_code: Joi.string()
    .alphanum() // Allow alphanumeric characters
    .min(4) // Assuming a minimum length for Swift code
    .required()
    .label("Swift Code")
    .messages({
      "string.empty": `Swift Code is required`,
      "string.alphanum": `Swift Code must contain only letters and numbers`,
    }),
});

export {
  validationPersonalInfoFormSchema,
  validationAcademicRecordSchema,
  validationDepartmentInfoFormSchema,
  validationBankDetailsFormSchema,
  validationEmployeeInfoFormSchema,
}