const validateShiftFormSchema = (values) => {
    const errors = {};
    if (!values.name) errors.component_type = "Shift Name is required";
    if (!values.type) errors.no_of_days = "Shift Type is required";
    if (!values.starttime) errors.start_date = "Start time is required";
    if (!values.endtime) errors.end_date = "End time is required";
    return errors;
  };
  
  export { validateShiftFormSchema };