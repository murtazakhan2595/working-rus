const maxSize1MB = 1024 * 1024; // 1 MB in bytes
const maxSize2MB = 2 * 1024 * 1024; // 2 MB in bytes

const validationTaskFormSchema = (values) => {
  const errors = {};

  // Validate required fields
  if (!values.name) errors.name = "Name is required";
  if (!values.board_id) errors.board_id = "Board name is required";
  if (!values.project_id) errors.project_id = "Project name is required";
  // if (!values.description) errors.description = "Description is required";
  // if (!values.priority) errors.priority = "Priority is required";
  // if (!values.end_date) errors.end_date = "Due date is required";
  if (!values.assigned_by) errors.assigned_by = "Assigned by is required";
  if (values.assigned_to && values.assigned_to.length === 0)
    errors.assigned_to = "At least one assignee is required";

  // Validate Attachments
  if (values.attachment && values.attachment.length > 0) {
    const invalidAttachments = values.attachment
      .filter(
        (file) =>
          file.attachments &&
          file.attachments instanceof File &&
          file.attachments.size > maxSize2MB // Check valid File objects and size
      )
      .map((file) => file.name); // Collect file names of invalid attachments

    if (invalidAttachments.length > 0) {
      errors.attachment = `Please upload a file smaller than 2MB. File that are exceeding size are:\n${invalidAttachments.join(
        ",\n"
      )}`;
    }
  }

  return errors;
};

const validationProjectFormSchema = (values) => {
  const errors = {};

  // Validate Name
  if (!values.name) errors.name = "Name is required";

  // Validate Description
  if (!values.description) errors.description = "Description is required";
  if (!values.status) errors.status = "Description is required";

  // Validate Assigned Users
  if (values.project_members && values.project_members.length === 0)
    errors.project_members = "At least one assignee is required";

  // Validate File (Profile)
  if (values.profile && values.profile instanceof File) {
    if (values.profile.size > maxSize1MB) {
      errors.profile = "Please upload a file smaller than 1 MB.";
    }
  }

  return errors;
};

export { validationTaskFormSchema, validationProjectFormSchema };
