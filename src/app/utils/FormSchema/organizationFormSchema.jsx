
const validateOrganizationSchema = (values, isEditMode) => {
  const errors = {};
    if (!values?.name) errors.name= "Company Name is required";
    if (!values?.legal_name) errors.legal_name= "Legal Name is required";
    if (!values?.phone_number) errors.phone_number= "Phone Number is required";
    if (!values?.email) errors.email= "Email is required";
    if (!values?.address) errors.address= "Address is required";
    if (!values?.state) errors.state= "State is required";
    if (!values?.city) errors.city= "City is required";
    if (!values?.zipcode) errors.zipcode= "Zip/Postal Code is required";
    if (!values?.time_zone) errors.time_zone= "Timezone is required";
    if (!values?.date_format) errors.date_format= "Date Format is required";
    if (!values?.country) errors.country= "Country is required";
    if (!values?.payroll_start_date) errors.payroll_start_date= "Payroll Start Date is required";
    if (!values?.licensing_authority) errors.licensing_authority= "Licensing Authority is required";
    if (!values?.registration_number) errors.registration_number= "Licensing Number is required";


    return errors;
}

export { validateOrganizationSchema}