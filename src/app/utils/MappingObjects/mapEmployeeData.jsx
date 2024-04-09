import { Employee, EmployeePersonalInformation, EmployeeVisaDetails } from '../Types/Employee'

export function mapdata(data) {
    const employee = Employee;
    const personalInfo = getPersonalInfo(data);
    employee.id = data.id;
    employee.personalInformation = personalInfo;

    return employee;

}

export function getPersonalInfo(data) {
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

export function getVisaDetails(data) {
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