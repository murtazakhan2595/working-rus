const validationJobFormSchema = (values) => {
  const errors = {};
  if (!values.Job_Title) errors.Job_Title = "Job Title is required";
  if(!values.Job_Type) errors.Job_Type = "Job Type is required";
  if(!values.Work_type) errors.Work_type = "Work Type is required";
  if(!values.Employee_Type) errors.Employee_Type = "Employee Type is required";
  if(!values.Education) errors.Education = "Education is required";
  if(!values.location) errors.location = "Location is required";
  if(!values.min_salary) errors.min_salary = "Minimum Salary is required";
  if(!values.max_salary) errors.max_salary = "Maximum Salary is required";
  if(!values.Deadline) errors.Deadline = "Deadline is required";
  if(!values.Job_Requirement) errors.Job_Requirement = "Job Requirement is required";
  if(!values.Job_Description) errors.Job_Description = "Job Description is required";

  return errors;
};

export { validationJobFormSchema}