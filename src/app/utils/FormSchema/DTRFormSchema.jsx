const validateLogTimeFormSchema = (values) => {
    const errors = {};
    if (!values.consumed_time) errors.consumed_time = "Time spent is required";
    if (!values.task_id) errors.task_id = "Task is required";
    if (!values.notes) errors.notes = "Notes is required";
    return errors;
  };
  
  export { validateLogTimeFormSchema };
  