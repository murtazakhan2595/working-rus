import { validateStartAndEndDateField } from "app/utils/FormSchema/generalFormSchema";

export const validateApprovalHierarchyFormSchema = (values) => {
  const errors = {};
  if (!values?.name?.trim()) errors.name = "Name is required";
  if (!values?.request_type) errors.request_type = "Request type is required";
  return errors;
};

export const validateHierarchyLevelFormSchema = (values) => {
  const errors = {};
  // if (!values?.name?.trim()) errors.name = "Name is required";
  if (!values?.level_number) errors.request_type = "Level number is required";
  if (values.assignment_type && values.assignment_type === "DESIGNATION")
    if (!values.designation) errors.designation = "Designation is required";
  return errors;
};

export const validateAddHierarchyLevelsForm = (
  values,
  existingRequestInitiator
) => {
  const errors = {};

  // Validate request_initiative
  if (!values.request_initiative) {
    errors.request_initiative = "Request Initiator is required";
  } else {
    const request_initiator = values.request_initiative;
    if (Array.isArray(request_initiator)) {
      if (request_initiator.length === 0) {
        errors.request_initiative = "Request Initiator is required";
      } else if (
        existingRequestInitiator &&
        Array.isArray(existingRequestInitiator) &&
        request_initiator.some((item) =>
          existingRequestInitiator.includes(item)
        )
      ) {
        errors.request_initiative =
          "Hierarchy Level against selected designation is already created. Please select different designation.";
      }
    }
  }

  // Validate levels
  if (!values.levels || !Array.isArray(values.levels)) {
    errors.levels = "At least one level is required";
  } else {
    const seenDesignations = new Set();
    let finalApprovalCount = 0;

    values.levels.forEach((level, index) => {
      const levelErrors = {};

      if (!level.designation) {
        levelErrors.designation = "Designation is required";
      } else if (seenDesignations.has(level.designation)) {
        levelErrors.designation = "Designation must be unique";
      } else {
        seenDesignations.add(level.designation);
      }

      if (level.auto_forward_enabled)
        if (!level.auto_forward_threshold)
          levelErrors.auto_forward_threshold = "Threshold in hours is required";

      if (level.is_final_approval) {
        if (finalApprovalCount > 0)
          levelErrors.is_final_approval =
            "Only one level can have final approval";
        finalApprovalCount++;
      }

      if (Object.keys(levelErrors).length > 0) {
        if (!errors.levels) errors.levels = [];
        errors.levels[index] = levelErrors;
      }
    });
  }

  return errors;
};

export const validateDelegateLevelFormSchema = (values) => {
  const errors = {};
  if (!values?.reason?.trim()) errors.reason = "Reason is required";
  if (!values?.branch) errors.branch = "Branch is required";
  if (!values?.department) errors.department = "Department is required";
  if (!values?.delegate) errors.delegate = "Delegate User is required";
  const dateErrors = validateStartAndEndDateField(
    values.start_date,
    values.end_date
  );
  return { ...errors, ...dateErrors };
};
