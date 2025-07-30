import { validateStartAndEndDateField } from "app/utils/FormSchema/generalFormSchema";

export const validateApprovalHierarchyFormSchema = (values) => {
  const errors = {};
  if (!values?.name?.trim()) errors.name = "Name is required";
  if (!values?.request_type) errors.request_type = "Request type is required";
  return errors;
};

export const validateHierarchyLevelFormSchema = (level, level_list = []) => {
  const errors = {};
  if (!level.assignment_type) {
    errors.assignment_type = "Approver type is required.";
  } else {
    if (level.assignment_type === "DESIGNATION") {
      if (!level.designation) {
        errors.designation = "Designation is required";
      } else {
        const isDesignationExist =
          level_list?.filter(
            (obj) =>
              parseInt(obj.designation) === parseInt(level.designation) &&
              level.level_number !== obj.level_number
          )?.length || 0 > 0;
        if (isDesignationExist) {
          errors.designation = "Designation must be unique";
        }
      }
    } else if (level.assignment_type === "DIRECT_REPORTING") {
      const seenDirectApprover =
        level_list?.filter(
          (obj) =>
            obj.assignment_type === "DIRECT_REPORTING" &&
            level.level_number !== obj.level_number
        )?.length || 0 > 0;
      if (seenDirectApprover) {
        errors.assignment_type =
          "Direct reporting can only be assigned as an approver for one level.";
      }
    } else if (level.assignment_type === "INDIRECT_REPORTING") {
      const seenIndirectApprover =
        level_list?.filter(
          (obj) =>
            obj.assignment_type === "INDIRECT_REPORTING" &&
            level.level_number !== obj.level_number
        )?.length || 0 > 0;
      if (seenIndirectApprover) {
        errors.assignment_type =
          "Indirect reporting can only be assigned as an approver for one level.";
      }
    }
  }
  if (level.auto_forward_enabled)
    if (!level.auto_forward_threshold)
      errors.auto_forward_threshold = "Threshold in hours is required";
  if (level.is_final_approval) {
    const finalApprovalCount =
      level_list?.filter(
        (obj) =>
          obj.is_final_approval && level.level_number !== obj.level_number
      )?.length || 0;
    if (finalApprovalCount > 0)
      errors.is_final_approval = "Only one level can have final approval";
  }
  return Object.keys(errors).length > 0 ? errors : null;
};

export const validateAddHierarchyLevelsForm = (
  values,
  {
    request_initiative: existingRequestInitiator,
    level_groups: existingLevelGroups,
  }
) => {
  const errors = {};

  if (!values.level_groups) errors.level_groups = "Name is required";
  else if (typeof values.level_groups !== "string")
    errors.level_groups = "Name is required";
  else if (!values.level_groups.trim())
    errors.level_groups = "Name is required";
  else {
    const level_groups = values.level_groups.trim();
    const is_group_name_exist = existingLevelGroups.find(
      (name) => name === level_groups
    );
    if (is_group_name_exist)
      errors.level_groups =
        "Levels with this name already exist. Please choose a different name.";
  }

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
  if (
    !values.levels ||
    !Array.isArray(values.levels) ||
    values.levels.length === 0
  ) {
    errors.levels = "At least one level is required";
  } else {
    const levelList = values.levels;
    const levelErrors = levelList
      .map((level) => {
        return validateHierarchyLevelFormSchema(level, values.levels);
      })
      ?.filter(Boolean);
    console.log(levelErrors);
    if (levelErrors && levelErrors.length > 0) errors.levels = levelErrors;
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
