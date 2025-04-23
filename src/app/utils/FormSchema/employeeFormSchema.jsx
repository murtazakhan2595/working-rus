import Joi from "joi";
import { EMAIL_REGEX } from "app/utils/Types/ValidationPattern";

const validationEmployeeInfoFormSchema = (values, isEditMode) => {
  const errors = {};
  if (!isEditMode) {
    if (!values.first_name) errors.first_name = "First name is required";
    if (!values.last_name) errors.last_name = "Last name is required";
    if (!values.country_code)
      errors.country_code = "Phone Country Code name is required";
    if (!values.mobile_no) errors.mobile_no = "Phone number is required";
    if (!values.username) errors.username = "Username is required";
    if (!values.branch_id) errors.branch_id = "Branch is required";
    if (!values.work_email) errors.work_email = "Email is required";
    // if (values.work_email && EMAIL_REGEX.test(values.work_email))
    //   errors.work_email = "Invalid email address";
    if (!values.password) errors.password = "Password is required";
    if (!values.residential_address)
      errors.residential_address = "Address is required";
    if (values.residential_address && values.residential_address.length > 200) {
      errors.residential_address =
        "Residential address cannot exceed 200 characters";
    }
    if (values.permanent_address && values.permanent_address.length > 255) {
      errors.permanent_address = "Permanent address cannot exceed 255 characters";
    }
  }
  if (!values.user_role) errors.user_role = "User role is required";
  if (!values.department_name)
    errors.department_name = "Department is required";
  if (!values.department_position)
    errors.department_position = "Designation is required";
  if (values.direct_report && values.indirect_report) {
    if (values.indirect_report.includes(values.direct_report))
      errors.indirect_report =
        "Direct reporting manager cannot be assigned as an indirect reporting manager.";
  }
  if (!values.employee_type) errors.employee_type = "Employee type is required";
  if (!values.employee_work_type)
    errors.employee_work_type = "Work type is required";
  if (!values.employee_location)
    errors.employee_location = "Work location is required";
  if (!values.employee_status) errors.employee_status = "Status is required";
  if (!values.joining_date) errors.joining_date = "Joining date is required";

  // Validate probation dates in relation to joining date
  if (values.joining_date && values.probation_start_date) {
    const joiningDate = new Date(values.joining_date);
    const probationStartDate = new Date(values.probation_start_date);

    if (probationStartDate < joiningDate) {
      errors.probation_start_date =
        "Probation start date cannot be before joining date";
    }
  }

  // Validate probation end date is after start date
  if (values.probation_start_date && values.probation_end_date) {
    const startDate = new Date(values.probation_start_date);
    const endDate = new Date(values.probation_end_date);

    if (endDate < startDate) {
      errors.probation_end_date =
        "Probation end date must be after the start date";
    }
  }

  if (!values.salary_type && !isEditMode)
    errors.salary_type = "Salary type is required";
  if (!values.salary && !isEditMode) errors.salary = "Salary is required";
  if (values.active_contract) {
    if (!values.contract_start_date)
      errors.contract_start_date = "Start date is required";
    if (!values.contract_end_date)
      errors.contract_end_date = "End date is required";
  }
  // UAE Family Book validation (mandatory only for UAE nationals)
  if (
    values.employee_location === "United Arab Emirates" &&
    !values.family_book_number
  ) {
    errors.family_book_number =
      "Family Book Number is required for UAE Nationals";
  }

  // Optional validations for PO Box (if provided, ensure it's in correct format)
  if (values.po_box_number && !/^\d+$/.test(values.po_box_number)) {
    errors.po_box_number = "PO Box Number must contain only numbers";
  }
  if (values.employee_location === "United Arab Emirates") {
    // Validate disbursement type (required only for UAE employees)
    if (!values.disbursement_type) {
      errors.disbursement_type = "Disbursement type is required";
    }
  }
  return errors;
};

const validationEmployeeContactInfoFormSchema = (values) => {
  const errors = {};
  if (!values.emergency_first_name)
    errors.emergency_first_name = "First name is required";
  if (!values.emergency_relation)
    errors.emergency_relation = "Contact Relation is required";
  if (!values.emergency_phone_no)
    errors.emergency_phone_no = "Phone number is required";
  if (!values.residential_address)
    errors.residential_address = "Permanent Address is required";
  if (!values.current_address)
    errors.current_address = "Current Address is required";
  return errors;
};

const validateEmployeePersonalInfoForm = (values) => {
  const errors = {};
  if (!values.profile_picture)
    errors.profile_picture = "Profile image is required";
  if (!values.first_name) errors.first_name = "First Name is required";
  if (!values.last_name) errors.last_name = "Last Name is required";
  if (!values.mobile_no) {
    errors.mobile_no = "Mobile Number is required";
  }
  if (!values.nationality) {
    errors.nationality = "Nationality is required";
  }
  if (!values.other_email) {
    errors.other_email = "Other email is required";
  }
  if (!values.nic) errors.nic = "ID Card no is required";
  if (!values.father_name) errors.father_name = "Father Name is required";
  if (!values.mother_name) errors.mother_name = "Mother Name is required";
  if (!values.blood_group) errors.blood_group = "Blood Group is required";
  if (!values.gender) errors.gender = "Gender is required";

  return errors;
};

const validationEmployeeExperienceFormSchema = (values) => {
  const errors = {};
  if (values.experiences) {
    values.experiences.forEach((value, index) => {
      const experienceErrors = {};
      if (!value.disableEndDate && !value.exp_end_date && index !== 0)
        experienceErrors.exp_end_date = "End Date is required";
      if (!value.exp_start_date)
        experienceErrors.exp_start_date = "Start Date is required";
      if (!value.exp_organization)
        experienceErrors.exp_organization = "Company Name is required";
      if (!value.exp_designation)
        experienceErrors.exp_designation = "Position is required";
      if (!value.exp_discription)
        experienceErrors.exp_discription = "Responsibilities is required";
      if (Object.keys(experienceErrors).length > 0) {
        errors.experiences = errors.experiences || [];
        errors.experiences[index] = experienceErrors;
      }
    });
  }
  return errors;
};

const validateEmployeeBankInformationForm = (values) => {
  const errors = {};
  if (!values.bank_name) errors.bank_name = "Bank Name is required";
  if (!values.account_title) errors.account_title = "Account Title is required";
  if (!values.account_number)
    errors.account_number = "Account Number is required";
  if (!values.account_iban) errors.account_iban = "IBAN Number is required";
  return errors;
};

const validateEmployeeEducationForm = (values) => {
  const errors = { educations: [] };

  values.educations.forEach((education, index) => {
    const educationErrors = {};

    if (!education.education_level)
      educationErrors.education_level = "Education Level is required";
    if (!education.program) educationErrors.program = "Program is required";
    if (!education.institute_name)
      educationErrors.institute_name = "Institute Name is required";
    if (!education.edu_start_date)
      educationErrors.edu_start_date = "Start Date is required";
    if (!education.edu_end_date)
      educationErrors.edu_end_date = "End Date is required";

    if (Object.keys(educationErrors).length > 0) {
      errors.educations[index] = educationErrors;
    }
  });

  return errors;
};

const validateEmployeeIdentificationForm = (values) => {
  const errors = {};
  if (!values.living_country_id_no)
    errors.living_country_id_no = "Living Country ID is required";
  if (!values.place_of_issuance)
    errors.place_of_issuance = "Place of Issuance is required";
  if (!values.id_issuance_date)
    errors.id_issuance_date = "Issuance Date is Required";
  return errors;
};
const validationPersonalInfoFormSchema = Joi.object({
  first_name: Joi.string().min(3).max(40).required().label("First Name"),
  last_name: Joi.string().min(3).max(40).required().label("Last Name"),
  father_name: Joi.string().min(3).max(40).required().label("Father Name"),
  mother_name: Joi.string().min(3).max(40).required().label("Mother Name"),
  country_code: Joi.string().max(6).required().label("Country Code"),
  mobile_no: Joi.string().required().label("Phone Number"),
  date_of_birth: Joi.string().required().label("DOB"),
  marital_status: Joi.string()
    .min(3)
    .max(20)
    .required()
    .label("Marital Status"),
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
    file: Joi.string().required().label("Education Document"),
    name: Joi.string().required().label("File Name"),
  })
    .required()
    .label("Education Body"),
});

const validateExitRequestForm = (values) => {
  const errors = {};
  if (!values?.exit_date) errors.exit_date = "Exit Date is required";
  if (!values?.notice_period)
    errors.notice_period = "Notice Period is required";
  if (!values?.reason_for_leaving)
    errors.reason_for_leaving = "Reason for Leaving is required";
  if (!values?.resignation_Letter)
    errors.resignation_Letter = "Resignation letter is required";
  return errors;
};

const validationDepartmentInfoFormSchema = Joi.object({
  department_name: Joi.string().required().label("Department Name").messages({
    "string.empty": `Department Name is required`,
  }),
  department_position: Joi.string()
    .regex(/^[a-zA-Z\s]+$/)
    .required()
    .label("Position")
    .messages({
      "string.empty": `Position is required`,
      "string.pattern.base": `Position must only contain letters and spaces`,
    }),
  employee_status: Joi.string().required().label("Employee status").messages({
    "string.empty": `Employee Status is required`,
  }),
  employee_work_type: Joi.string().required().label("Work Type").messages({
    "string.empty": `Work Type is required`,
  }),
  employee_location: Joi.string()
    .required()
    .label("Employee Location")
    .messages({
      "string.empty": `Employee Location is required`,
    }),
  employee_type: Joi.string().required().label("Employee type").messages({
    "string.empty": `Employee type is required`,
  }),
  // department_manager: Joi.string()
  //   .required()
  //   .label("Department Manger")
  //   .messages({
  //     "string.empty": `Department Manger is required`,
  //   }),
  joining_date: Joi.string()
    .regex(/^\d{2}-\d{2}-\d{4}$/) // Matches "DD-MM-YYYY" format
    .required()
    .label("Joining Date")
    .messages({
      "string.empty": "Joining Date is required",
      "string.pattern.base": 'Joining Date must be in "DD-MM-YYYY" format',
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
const validateOnboardingDocuments = (onboardingDocuments) => {
  if (!onboardingDocuments || !Array.isArray(onboardingDocuments)) {
    return {};
  }

  const errors = { onboardingDocuments: [] }; // Initialize with the array already
  let hasErrors = false;

  // Validate each document
  onboardingDocuments.forEach((doc, index) => {
    // Only validate active documents
    if (doc.isActive) {
      // Check if active documents have attachments
      if (!doc.attachment || doc.attachment.length === 0) {
        // Initialize the object at this index if it doesn't exist
        if (!errors.onboardingDocuments[index]) {
          errors.onboardingDocuments[index] = {};
        }
        errors.onboardingDocuments[index].attachment = "Document is required";
        hasErrors = true;
      }

      // Check if expiry date is provided when hasExpiryDate is true
      if (doc.hasExpiryDate && !doc.expiryDate) {
        // Initialize the object at this index if it doesn't exist
        if (!errors.onboardingDocuments[index]) {
          errors.onboardingDocuments[index] = {};
        }
        errors.onboardingDocuments[index].expiryDate =
          "Expiry date is required";
        hasErrors = true;
      }
    }
  });

  return hasErrors ? errors : {};
};
export {
  validationPersonalInfoFormSchema,
  validationAcademicRecordSchema,
  validationDepartmentInfoFormSchema,
  validationBankDetailsFormSchema,
  validationEmployeeInfoFormSchema,
  validationEmployeeContactInfoFormSchema,
  validationEmployeeExperienceFormSchema,
  validateEmployeePersonalInfoForm,
  validateEmployeeBankInformationForm,
  validateEmployeeEducationForm,
  validateEmployeeIdentificationForm,
  validateExitRequestForm,
  validateOnboardingDocuments,
};
