import {
    Employee, EmployeePersonalInformation, EmployeeDepartmentInfo, EmployeeVisaDetails, EmployeeAcademicRecord,
    EmployeeCVDetails,
    EmployeeProfessionalExperiance,
    EmployeeBankDetails,
} from '../Types/Employee'
import moment from "moment";

function mapEmployeeData(data) {
    debugger
    const employee = Employee;
    employee.id = data.id;
    employee.personalInformation = getPersonalInfo(data);
    employee.visaDetails = getVisaDetails(data)
    employee.academicRecord = getAcademicRecord(data);
    employee.cv = getCVDetails(data);
    employee.professionalExperiance = getProfessionalExperiance(data);

    console.log(employee)
    return employee;
}

function getPersonalInfo(data) {
    const personalInfo = EmployeePersonalInformation;
    personalInfo.first_name = data.first_name;
    personalInfo.last_name = data.last_name;
    personalInfo.father_name = data.father_name;
    personalInfo.mother_name = data.mother_name;
    personalInfo.country_code = data.country_code;
    personalInfo.mobile_no = data.mobile_no;
    personalInfo.date_of_birth = data.date_of_birth;
    personalInfo.marital_status = data.marital_status;
    personalInfo.nationality = data.nationality;
    personalInfo.email = data.email;
    personalInfo.work_email = data.work_email;
    personalInfo.current_address = data.current_address;
    personalInfo.residential_address = data.residential_address;
    personalInfo.nic = data.nic;
    personalInfo.emergency_first_name = data.emergency_first_name;
    personalInfo.emergency_last_name = data.emergency_last_name;
    personalInfo.emergency_country_code = data.emergency_country_code;
    personalInfo.emergency_phone_no = data.emergency_phone_no;
    personalInfo.emergency_relation = data.emergency_relation;
    personalInfo.profile_picture = data.profile_picture;

    return personalInfo;
}

function getVisaDetails(data) {
    const visaDetails = EmployeeVisaDetails;
    visaDetails.passport_number = data.passport_number;
    visaDetails.Passport_Issuance_Country = data.Passport_Issuance_Country;
    visaDetails.Passport_Issuance_Date = data.Passport_Issuance_Date;
    visaDetails.Passport_Expiry_Date = data.Passport_Expiry_Date;
    visaDetails.entry_permit_number = data.entry_permit_number;
    visaDetails.country_of_visa_issuance = data.country_of_visa_issuance;
    visaDetails.visa_duration = data.visa_duration;
    visaDetails.uid_number = data.uid_number;
    visaDetails.living_country_id_no = data.living_country_id_no;
    visaDetails.dha_id = data.dha_id;
    visaDetails.card_number = data.card_number;
    visaDetails.insurance_policy = data.insurance_policy;
    visaDetails.insurance_company = data.insurance_company;
    visaDetails.visa_expiry_date = data.visa_expiry_date;
    visaDetails.visa_issuance_date = data.visa_issuance_date;
    visaDetails.visa_country_entry_date = data.visa_country_entry_date;
    visaDetails.visa_country_exit_date = data.visa_country_exit_date;
    visaDetails.id_issuance_date = data.id_issuance_date;
    visaDetails.id_expiry_date = data.id_expiry_date;
    visaDetails.insurance_active_date = data.insurance_active_date;
    visaDetails.insurance_expiry_date = data.insurance_expiry_date;
    visaDetails.visa_type = data.visa_type;
    visaDetails.place_of_issuance = data.place_of_issuance;

    return visaDetails;
}

function getCVDetails(data) {
    const cvDetails = EmployeeCVDetails;
    cvDetails.cv = data.passport_number;
    cvDetails.cvName = data.Passport_Issuance_Country;

    return cvDetails;
}

function getProfessionalExperiance(data) {
    const experience = [];
    if (data && data.length > 0) {
        data.map(profExperience => {
            const professionalExperiance = EmployeeProfessionalExperiance;
            professionalExperiance.employee_id = profExperience?.id ?? '';
            professionalExperiance.exp_organization = profExperience?.exp_organization ?? '';
            professionalExperiance.exp_designation = profExperience?.exp_designation ?? '';
            professionalExperiance.exp_letter = profExperience?.file ?? '';
            professionalExperiance.exp_start_date = profExperience.exp_start_date ? moment(profExperience.exp_start_date, "DD-MM-YYYY").format(
                "YYYY-MM-DD"
            ) : null;
            professionalExperiance.exp_end_date = profExperience.exp_end_date
                ? moment(profExperience.exp_end_date, "DD-MM-YYYY").format("YYYY-MM-DD")
                : null;

            experience.push(professionalExperiance);
        })

        return experience;
    }
    return [EmployeeProfessionalExperiance];
}

function getAcademicRecord(data) {
    const academicRecord = EmployeeAcademicRecord;
    academicRecord.employee_id = data.id;
    academicRecord.education_level = data?.education_level ?? '';
    academicRecord.program = data?.program ?? '';
    academicRecord.institute_name = data?.institute_name ?? '';
    academicRecord.edu_start_date = data?.edu_start_date ?? '';
    academicRecord.edu_end_date = data?.edu_end_date ?? '';
    academicRecord.certificate = data?.certificate ?? [];

    return academicRecord;
}

function getDepartmentInfo(data) {
    const department = EmployeeDepartmentInfo;
    department.department_name = data?.department_name ?? '';
    department.department_position = data?.department_position ?? '';
    department.direct_report = data?.direct_report ?? '';
    department.indirect_report = data?.indirect_report ?? '';
    department.department_manager = data?.department_manager ?? '';
    department.employee_type = data?.employee_type ?? '';
    department.employee_status = data?.employee_status ?? '';
    department.joining_date = data?.joining_date ?? null;

    return department;
}

function getBankDetails(data) {
    const bankDetail = EmployeeBankDetails;
    bankDetail.bank_name = data?.bank_name ?? '';
    bankDetail.account_title = data?.account_title ?? '';
    bankDetail.account_number = data?.account_number ?? '';
    bankDetail.account_iban = data?.account_iban ?? '';
    bankDetail.branch_address = data?.branch_address ?? '';
    bankDetail.branch_code = data?.branch_code ?? '';
    bankDetail.swift_code = data?.swift_code ?? '';

    return bankDetail;
}


export {
    mapEmployeeData,
    getVisaDetails,
    getPersonalInfo,
    getAcademicRecord,
    getCVDetails,
    getProfessionalExperiance,
    getDepartmentInfo,
    getBankDetails,
}