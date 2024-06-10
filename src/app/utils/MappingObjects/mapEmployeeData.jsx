import {
  Employee,
  EmployeeDepartmentInfo,
  EmployeeVisaDetails,
  EmployeeAcademicRecord,
  EmployeeCVDetails,
  EmployeeProfessionalExperiance,
  EmployeeBankDetails,
  EmployeeCertifiation,
} from "../Types/Employee";
import moment from "moment";

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

  console.log(employee);
  return employee;
}

function getPersonalInfo(data) {
  const personalInfo = {
    first_name: data.first_name,
    last_name: data.last_name,
    country_code: data?.country_code ?? '',
    mobile_no: data.mobile_no,
    date_of_birth: data.date_of_birth
      ? moment(data.date_of_birth).format("YYYY-MM-DD")
      : "",
    marital_status: data.marital_status,
    nationality: data.nationality,
    other_email: data.other_email,
    nic: data.nic,
    mother_name: data.mother_name,
    profile_picture: data.profile_picture,
  };
  return personalInfo;
}
function getContactInfo(data) {
  const contactInfo = {
    emergency_phone_no: data.emergency_phone_no,
    emergency_first_name: data.emergency_first_name,
    emergency_relation: data.emergency_relation,
    current_address: data.current_address,
    residential_address: data.residential_address,
    emergency_country_code: data.emergency_country_code,
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
        exp_description: profExperience?.exp_discription ?? "",
        exp_letter: profExperience?.exp_letter ?? "",
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
    });

    return cerfications;
  }
  return [EmployeeCertifiation];
}

function getWorkInformation(data) {
  const department = EmployeeDepartmentInfo;
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
function getManagerSelected(managers) {
  debugger;
  if (managers) {
    const matchingObjects = managers.map((obj) => {
      return obj.value;
    });

    return matchingObjects.join(", ");
  }
  return [];
}

function getEmployeeInformation(data) {
  const employeeInformation = {
    id: data.id ?? 0,
    username: data.username,
    first_name: data.first_name,
    last_name: data.last_name,
    work_email: data.work_email,
    user_role: data.user_role,
    department_name: data?.department_name ?? '',
    residential_address: data?.residential_address ?? '',
    mobile_no: data?.mobile_no ?? '',
    country_code: data?.country_code ?? '',
    department_position: data?.department_position ?? '',
    direct_report: data?.direct_report ?? '',
    indirect_report: data?.indirect_report ?? '',
    department_manager: data?.department_manager ?? '',
    employee_type: data?.employee_type ?? '',
    employee_status: data?.employee_status ?? '',
    employee_work_type: data?.employee_work_type ?? '',
    employee_location: data?.employee_location ?? '',
    joining_date: data?.joining_date ?? null,
    is_indirect_report_applicable: data.indirect_report
      ? true
      : false,
  };
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
