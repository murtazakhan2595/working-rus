export const validateUserRoleFormSchema = (values) => {
    const errors = {};
    if (!values.name) errors.name = "Name is required";
    return errors;
  };
  
