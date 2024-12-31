const validateShiftFormSchema = (values) => {
    const errors = {};
    if (!values.name) errors.name = "Shift Name is required";
    if (!values.type) errors.type = "Shift Type is required";
    // if (!values.starttime) errors.starttime = "Start time is required";
    // if (!values.endtime) errors.endtime = "End time is required";
    return errors;
  };
  
  export { validateShiftFormSchema };