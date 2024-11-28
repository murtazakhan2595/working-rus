
const validateOrganizationSchema = (values, isEditMode) => {
  const errors = {};
    if (!values?.name) errors.name= "Company Name is required";
    if (!values?.legal_name) errors.legal_name= "Legal Name is required";
    if (!values?.phone_number) errors.phone_number= "Phone Number is required";
    if (!values?.email) errors.email= "Email is required";
    if (!values?.address) errors.address= "Address is required";
    if (!values?.state) errors.state= "State is required";
    return errors;
}

export { validateOrganizationSchema}