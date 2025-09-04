import moment from "moment";

export const validationHRDocumentFormSchema = (values) => {
  const errors = {};
  if (!values.acknowledgment_type)
    errors.acknowledgment_type = "Acknowledgment Type is required";
  if (!values.name) errors.name = "Name is required";
  if (!values.category) errors.category = "Category is required";
  if (!values.description) errors.description = "Note is required";
  // Check if expiration_date exists
  if (values.expiration_date) {
    // Prevent selecting today's or past dates
    const today = moment().startOf("day");
    const expiryDate = moment(values.expiration_date);
    if (expiryDate.isBefore(today)) {
      errors.expiration_date = "Expiration date must be a future date";
    }
  }
  if (!values.file) {
    errors.file = "Document is required";
  }
  return errors;
};
export const validationAssignHRDocumentFormSchema = (values) => {
  const errors = {};
  if (!values.target_audience)
    errors.target_audience = "Target Audience is required";
  if (values.target_audience) {
    if (values.target_audience === "Department" && Array.isArray(values.object_id) && values.object_id.length === 0)
      errors.object_id = "Department is required";
    if (values.target_audience === "Specific Employee" && Array.isArray(values.object_id) && values.object_id.length === 0)
      errors.object_id = "Employee is required";
  }
  return errors;
};
export const validationDocumentCategoryFormSchema = (values) => {
  const errors = {};
  if (!values.name) errors.name = "Name is required";
  return errors;
};


// Original validation for letter request creation
export const validationLetterRequestFormSchema = (values) => {
  const errors = {};
  if (!values.name) errors.name = "Name is required";
  if (!values.description) errors.description = "Description is required";
  return errors;
};

// New validation for HR Accept/Reject form
export const validationLetterRequestStatusSchema = (values, actionType) => {
  const errors = {};

  // Only validate attachment requirements when accepting
  if (actionType === "accept") {
    // Validate attachment method selection
    if (!values.attachment_type) {
      errors.attachment_type = "Please select an attachment method";
    }
    
    // Validate based on selected attachment method
    if (values.attachment_type === "upload" && !values.attachments) {
      errors.attachments = "Please upload a document";
    }
    
    if (values.attachment_type === "existing" && !values.selected_document_id) {
      errors.selected_document_id = "Please select an HR document";
    }
  }

  // No validation needed for reject action
  return errors;
};

// Alternative comprehensive validation that can be used in the form
export const validationAcceptRejectFormSchema = (values) => {
  const errors = {};
  
  // This would be used if you want to validate everything at once
  // But with custom buttons, validation is handled per action
  
  return errors;
};