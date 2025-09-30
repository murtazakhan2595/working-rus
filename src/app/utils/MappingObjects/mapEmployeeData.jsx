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
  EmployeeContactInformation,
} from "app/utils/Types/Employee";
import { calculateTotalCount } from "utils/renderValues";
import { mapDefaultShiftData } from 'app/utils/MappingObjects/mapShiftManagementData';
import moment from 'moment';
import { formatDaysDuration } from "utils/DateTimeUtils";


export function mapEmployeePayloadData(data, id) {
  // Initialize an empty payload object
  const payload = {};
  // Iterate over the keys in the Task object
  for (const key in EmployeeInformation) {
    // Check if the key exists in the data object
    if (data.hasOwnProperty(key) && data[key]) {
      // Add the key and its value to the payload
      if (key === 'probation_start_date' || key === 'probation_end_date') {
        const [start_date, end_date] = data['probation_date_range']?.split(",") || "";
        payload['probation_start_date'] = start_date;
        payload['probation_end_date'] = end_date;
        payload['probation_period'] = formatDaysDuration(start_date, end_date);
      } else if (key === 'confirmation_date') {
        payload[key] = moment(payload['probation_end_date']).add(1, "days").format("YYYY-MM-DD")
      }
      else payload[key] = data[key];
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

async function mapEmployeeData(data) {
  const PersonalInformation = getPersonalInfo(data);
  const EmployeeContactInformation = getContactInfo(data);
  const BankDetails = getBankDetails(data);
  const WorkInformation = await getEmployeeInformation(data);
  const employee = {
    id: data.id,
    name: `${data.first_name} ${data.last_name}`,
    name_initials: `${data?.first_name?.charAt(0)?.toUpperCase() || ""}${data?.last_name?.charAt(0)?.toUpperCase() || ""
      }`,
    ...PersonalInformation,
    ...EmployeeContactInformation,
    ...BankDetails,
    ...WorkInformation,
  };
  return employee;
}

export async function mapEmployeeInfoData(data) {
  const employee = {
    id: data.id,
    name: `${data.first_name} ${data.last_name}`,
    name_initials: `${data?.first_name?.charAt(0)?.toUpperCase() || ""}${data?.last_name?.charAt(0)?.toUpperCase() || ""
      }`,
    default_shift_id: data.shift_assignment,
    default_shift: mapDefaultShiftData(data.default_shift),
  };
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

  return {
    ...personalInfo,
    phone_no: `+${data?.country_code}${data?.mobile_no}`,
  };
}
function getContactInfo(data) {
  const contactInfo = Object.keys(EmployeeContactInformation).reduce(
    (acc, key) => {
      if (data.hasOwnProperty(key)) {
        acc[key] = data[key];
      }
      return acc;
    },
    {}
  );

  return contactInfo;
}

function getVisaDetails(data) {
  const visaDetails = Object.keys(EmployeeVisaDetails).reduce((acc, key) => {
    if (data.hasOwnProperty(key)) {
      acc[key] = data[key];
    }
    return acc;
  }, {});
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
  const bankDetail = Object.keys(EmployeeBankDetails).reduce((acc, key) => {
    if (data.hasOwnProperty(key)) {
      acc[key] = data[key];
    }
    return acc;
  }, {});

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

function mapEmployeeDocsChecklist(data) {
  let arrayData;
  if (Array.isArray(data)) {
    // Data is already an array
    arrayData = data;
  } else if (
    data &&
    typeof data === "object" &&
    Array.isArray(data.onboardingDocuments)
  ) {
    // Data is an object that has onboardingDocuments array
    arrayData = data.onboardingDocuments;
  } else {
    // Handle the case where neither condition is met
    console.error("Invalid data format for mapEmployeeDocsChecklist");
    arrayData = [];
  }
  const employeeDocsChecklist = arrayData.map((template) => {
    const doc = {
      id: template.id,
      employee_id: data?.employeeId,
      checklist_id: template.templateId,
      is_Active: template.isActive,
      has_expiry_date: template.isActive,
      expiry_date: template.expiryDate,
      attachment: template?.attachment?.[0]?.attachment ?? null,
    };
    return doc;
  });
  return employeeDocsChecklist;
}

export async function mapEmployeeStatsData(data) {
  if (!data || data.length === 0)
    return { Active: 0, Managers: 0, Exit: 0, Total: 0 };
  const Active = calculateTotalCount(data, "employee_status", "Active");
  const Total = data.length || 0;
  const Managers = data.filter((item) =>
    Array.isArray(item.user_role_name) &&
    item.user_role_name.some((role) =>
      typeof role === "string" && role.toLowerCase().includes("manager")
    )
  )?.length || 0;
  const Exit = data.filter((item) => ['Terminated', 'Deceased', 'Resigned', 'Absconded', 'Exit'].includes(item.employee_status))?.length || 0;
  return { Active, Managers, Exit, Total };
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
  mapEmployeeDocsChecklist,
};
