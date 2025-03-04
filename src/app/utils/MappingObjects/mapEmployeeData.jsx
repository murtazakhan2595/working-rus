import {
  Employee,
  EmployeeDepartmentInfo,
  EmployeeVisaDetails,
  EmployeeAcademicRecord,
  EmployeeCVDetails,
  EmployeeProfessionalExperiance,
  EmployeeBankDetails,
  EmployeeCertifiation,
  EmployeeInformation,
  EmployeePersonalInformation,
} from "app/utils/Types/Employee";
import moment from "moment";
import { getManagerSelected } from "data/Data";

export function mapEmployeePayloadData(data, id) {
  // Initialize an empty payload object
  const payload = {};
  // Iterate over the keys in the Task object
  for (const key in EmployeeInformation) {
    // Check if the key exists in the data object
    if (data.hasOwnProperty(key) && data[key]) {
      // Add the key and its value to the payload
      payload[key] = data[key];
    }
  }

  // Return the constructed payload
  return payload;
}

export function mapEmployeePersonalInformationPayloadData(data) {
  // Initialize an empty payload object
  const formData = new FormData();
  // Iterate over the keys in the Task object
  for (const key in EmployeePersonalInformation) {
    // Check if the key exists in the data object
    if (data.hasOwnProperty(key) && data[key]) {
      // Add the key and its value to the payload
      if (key === "profile_picture") {
        if (data[key] instanceof File)
          // Handle file fields
          formData.append(key, data[key]);
      } else {
        // Handle non-file fields
        formData.append(key, data[key]);
      }
    }
  }

  // Return the constructed payload
  return formData;
}

export function mapEmployeeBankDetailPayloadData(data) {
  // Initialize an empty payload object
  const payload = {};
  // Iterate over the keys in the object
  for (const key in EmployeeBankDetails) {
    // Check if the key exists in the data object
    if (data.hasOwnProperty(key) && data[key]) {
      // Add the key and its value to the payload
      payload[key] = data[key];
    }
  }

  // Return the constructed payload
  return payload;
}

function mapEmployeeData(data) {
  const employee = Employee;
  employee.id = data.id;
  employee.personalInformation = getPersonalInfo(data);
  employee.EmployeeContactInformation = getContactInfo(data);
  employee.visaDetails = getVisaDetails(data);
  employee.bankDetails = getBankDetails(data);
  employee.department = getWorkInformation(data);
  employee.academicRecord = getAcademicRecord(data);
  employee.professionalExperiance = getProfessionalExperiance(data);

  return employee;
}

function getPersonalInfo(data) {
  const personalInfo = Object.keys(EmployeePersonalInformation).reduce(
    (acc, key) => {
      if (data.hasOwnProperty(key)) {
        acc[key] = data[key];
      }
      return acc;
    },
    {}
  );

  return personalInfo;
}
function getContactInfo(data) {
  const contactInfo = {
    emergency_country_code: data?.emergency_country_code,
    emergency_phone_no: data.emergency_phone_no,
    emergency_first_name: data.emergency_first_name,
    emergency_relation: data.emergency_relation,
    current_address: data.current_address,
    residential_address: data.residential_address,
  };
  return contactInfo;
}

function getVisaDetails(data) {
  const visaDetails = EmployeeVisaDetails;
  visaDetails.id = data.id ?? null;
  visaDetails.is_passport_applicable = data.is_passport_applicable ?? false;
  visaDetails.is_insurance_applicable = data.is_insurance_applicable ?? false;
  visaDetails.is_visa_applicable = data.is_visa_applicable ?? false;
  visaDetails.employee_id = data.employee_id ?? null;
  visaDetails.passport_number = data.passport_number ?? null;
  visaDetails.Passport_Issuance_Country =
    data.Passport_Issuance_Country ?? null;
  visaDetails.Passport_Issuance_Date = data.Passport_Issuance_Date ?? null;
  visaDetails.Passport_Expiry_Date = data.Passport_Expiry_Date ?? null;
  visaDetails.entry_permit_number = data.entry_permit_number ?? null;
  visaDetails.country_of_visa_issuance = data.country_of_visa_issuance ?? null;
  visaDetails.visa_duration = data.visa_duration ?? null;
  visaDetails.uid_number = data.uid_number ?? null;
  visaDetails.living_country_id_no = data.living_country_id_no ?? null;
  visaDetails.dha_id = data.dha_id ?? null;
  visaDetails.card_number = data.card_number ?? null;
  visaDetails.insurance_policy = data.insurance_policy ?? null;
  visaDetails.insurance_company = data.insurance_company ?? null;
  visaDetails.visa_expiry_date = data.visa_expiry_date ?? null;
  visaDetails.visa_issuance_date = data.visa_issuance_date ?? null;
  visaDetails.visa_country_entry_date = data.visa_country_entry_date ?? null;
  visaDetails.visa_country_exit_date = data.visa_country_exit_date ?? null;
  visaDetails.id_issuance_date = data.id_issuance_date ?? null;
  visaDetails.id_expiry_date = data.id_expiry_date ?? null;
  visaDetails.insurance_active_date = data.insurance_active_date ?? null;
  visaDetails.insurance_expiry_date = data.insurance_expiry_date ?? null;
  visaDetails.visa_type = data.visa_type ?? null;
  visaDetails.place_of_issuance = data.place_of_issuance ?? null;

  return visaDetails;
}

function getCVDetails(data) {
  const cvDetails = EmployeeCVDetails;
  cvDetails.cv = data.document;
  cvDetails.cvName = data.document.name;
  cvDetails.existingCVId = data.id ?? "";

  return cvDetails;
}

async function getProfessionalExperiance(data) {
  const experience = [];
  if (data && data.length > 0) {
    await data.forEach((profExperience) => {
      const professionalExperience = {
        id: profExperience?.id ?? "",
        employee_id: profExperience?.employee_id ?? "",
        exp_organization: profExperience?.exp_organization ?? "",
        exp_designation: profExperience?.exp_designation ?? "",
        exp_discription: profExperience?.exp_discription ?? "",
        exp_letter: profExperience?.exp_letter ?? "",
        resume: profExperience?.resume ?? "",
        exp_start_date: profExperience.exp_start_date
          ? profExperience.exp_start_date
          : null,
        exp_end_date: profExperience.exp_end_date
          ? profExperience.exp_end_date
          : null,
        disableEndDate: profExperience.exp_end_date ? false : true,
      };
      experience.push(professionalExperience);
    });
    return experience;
  }
  return [EmployeeProfessionalExperiance];
}

function getAcademicRecord(data) {
  const educations = [];
  if (data && data.length > 0) {
    data.map((record) => {
      const empCerficate = {
        id: record.id,
        employee_id: record.employee_id,
        education_level: record?.education_level ?? "",
        program: record?.program ?? "",
        institute_name: record?.institute_name ?? "",
        edu_start_date: record?.edu_start_date ?? "",
        edu_end_date: record?.edu_end_date ?? "",
        education_body: record?.education_body ?? "",
      };
      educations.push(empCerficate);
      return record;
    });

    return educations;
  }
  return [EmployeeAcademicRecord];
}

function getCertifications(data) {
  const cerfications = [];
  if (data && data.length > 0) {
    data.map((record) => {
      const empCerficate = {
        id: record.id,
        employee_id: record.employee_id,
        certification_name: record?.certification_name ?? "",
        completion_date: record?.completion_date ?? "",
        certification_institute: record?.certification_institute ?? "",
        expiry_date: record?.expiry_date ?? "",
        certification_body: record?.certification_body ?? "",
      };
      cerfications.push(empCerficate);
      return record;
    });

    return cerfications;
  }
  return [EmployeeCertifiation];
}

function getWorkInformation(data) {
  const department = EmployeeDepartmentInfo;
  department.employeeName = data.first_name + " " + data.last_name;
  department.department_name = data?.department_name ?? "";
  department.department_position = data?.department_position ?? "";
  department.direct_report = data?.direct_report ?? "";
  department.indirect_report = data?.indirect_report ?? "";
  department.department_manager = data?.department_manager ?? "";
  department.employee_type = data?.employee_type ?? "";
  department.employee_status = data?.employee_status ?? "";
  department.employee_work_type = data?.employee_work_type ?? "";
  department.employee_location = data?.employee_location ?? "";
  department.joining_date = data?.joining_date ?? null;
  department.is_indirect_report_applicable = data.indirect_report
    ? true
    : false;

  return department;
}

function getBankDetails(data) {
  const bankDetail = EmployeeBankDetails;
  bankDetail.bank_name = data?.bank_name ?? "";
  bankDetail.account_title = data?.account_title ?? "";
  bankDetail.account_number = data?.account_number ?? "";
  bankDetail.account_iban = data?.account_iban ?? "";
  bankDetail.branch_address = data?.branch_address ?? "";
  bankDetail.branch_code = data?.branch_code ?? "";
  bankDetail.swift_code = data?.swift_code ?? "";

  return bankDetail;
}

async function getEmployeeInformation(data) {
  // Filter the input data to include only keys that exist in EmployeeInformation
  const employeeInformation = Object.keys(EmployeeInformation).reduce(
    (acc, key) => {
      if (data.hasOwnProperty(key)) {
        if (key === "contract_start_date") acc["active_contract"] = !!data[key];
        if (key !== "password") acc[key] = data[key];
      }
      return acc;
    },
    {}
  );

  return employeeInformation;
}

export {
  mapEmployeeData,
  getVisaDetails,
  getPersonalInfo,
  getContactInfo,
  getAcademicRecord,
  getCVDetails,
  getProfessionalExperiance,
  getWorkInformation,
  getBankDetails,
  getCertifications,
  getEmployeeInformation,
};
