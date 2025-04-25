const validateOrganizationSchema = (values, isEditMode) => {
  const errors = {};
    if (!values?.name) errors.name= "Company Name is required";
    if (!values?.legal_name) errors.legal_name= "Legal Name is required";
    if (!values?.phone_number) errors.phone_number= "Phone Number is required";
    if (!values?.email) errors.email= "Email is required";
    if (!values?.address) errors.address= "Address is required";
    if (!values?.state) errors.state= "State is required";
    if (!values?.city) errors.city= "City is required";
    if (!values?.po_box) errors.po_box= "Zip/Postal Code is required";
    if (!values?.time_zone) errors.time_zone= "Timezone is required";
    if (!values?.date_format) errors.date_format= "Date Format is required";
    if (!values?.country) errors.country= "Country is required";
    if (!values?.payroll_start_date) errors.payroll_start_date= "Payroll Start Date is required";
    if (!values?.currency) errors.currency= "Currency is required";
    if (!values?.website) errors.website= "Official Website is required";
    if (!values?.logo) errors.logo = "Logo is Required";
    
    // URL validation for website
    if (values?.website && !/^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/.test(values.website)) {
      errors.website = "Please enter a valid website URL";
    }
    
    // Phone format validation
    if (values?.phone_number && !/^(\+\d{1,3}[- ]?)?\d{10,}$/.test(values.phone_number)) {
      errors.phone_number = "Please enter a valid phone number";
    }
    
    // Email format validation
    if (values?.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "Please enter a valid email address";
    }

    return errors;
}

export { validateOrganizationSchema}