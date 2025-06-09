import moment from "moment";

const validateLeaveRequestFormSchema = (values, validationObj) => {
  const errors = {};
  if (!values.leave_type) errors.leave_type = "Leave type is required";
  if (!values.leave_duration)
    errors.leave_duration = "Leave duration is required";
  if (!values.total_days) errors.total_days = "Number of days is required";
  if (!values.start_date) errors.start_date = "Start date is required";
  if (!values.end_date) errors.end_date = "End date is required";
  if (!values.reason) errors.reason = "Reason is required";
  if (values.start_date && values.end_date) {
    const startDate = moment(values.start_date).endOf("day");
    const endDate = moment(values.end_date).endOf("day");
    if (startDate.isAfter(endDate)) {
      errors.end_date = "End cannot be before start date.";
    }
  }
  if (validationObj) {
    const { total_days = 0, start_date} = values;
    const {
      allowedLeaves,
      allowedConsecutiveDays,
      noticeDays,
      halfPaidAllowed,
    } = validationObj;
    if (total_days) {
      if (allowedLeaves && total_days > allowedLeaves) {
        errors.total_days = `Cannot apply for more than ${allowedLeaves} leaves`;
      } else if (allowedConsecutiveDays && total_days > allowedConsecutiveDays)
        errors.total_days = `Cannot apply for more than ${allowedConsecutiveDays} leaves at once`;
      if (noticeDays && start_date)
        errors.start_date = `Leave must be applied before ${noticeDays} days for this leave type`;
    }
  }
  return errors;
};

const validateLeaveDurationFormSchema = (values) => {
  const errors = {};
  if (!values.duration_name) {
    errors.duration_name = "Duration name is required";
  }
  if (!values.duration_hours) {
    errors.duration_hours = "Duration hours is required";
  } else if (isNaN(values.duration_hours)) {
    errors.duration_hours = "Duration hours must be a number";
  }
  if (!values.nationalities) {
    errors.nationalities = "Nationalities are required";
  }
  if (!values.branches_ids) {
    errors.branches_ids = "Branches are required";
  }
  if (!values.departments_ids) {
    errors.departments_ids = "Departments are required";
  }
  return errors;
};

const validateLeaveTypeFormSchema = (values) => {
  const errors = {};

  // Leave Type Name validation
  if (!values.name) {
    errors.name = "Leave type name is required";
  }

  // Short Code validation
  if (!values.short_code) {
    errors.short_code = "Short code is required";
  }

  // Leave Count validation
  if (!values.leave_count) {
    errors.leave_count = "Leave count is required";
  } else if (isNaN(values.leave_count)) {
    errors.leave_count = "Leave count must be a number";
  } else if (values.leave_count <= 0) {
    errors.leave_count = "Leave count must be greater than 0";
  }

  // Max Carry Forward Limit validation (only if carry forward is enabled)
  if (values.is_carry_forward_allowed) {
    if (!values.max_carry_forward_limit) {
      errors.max_carry_forward_limit =
        "Max carry forward limit is required when carry forward is enabled";
    } else if (isNaN(values.max_carry_forward_limit)) {
      errors.max_carry_forward_limit =
        "Max carry forward limit must be a number";
    } else if (values.max_carry_forward_limit <= 0) {
      errors.max_carry_forward_limit =
        "Max carry forward limit must be greater than 0";
    }
  }

  // Min Days Notice validation
  if (!values.min_days_notice) {
    errors.min_days_notice = "Min days notice required is required";
  } else if (isNaN(values.min_days_notice)) {
    errors.min_days_notice = "Min days notice must be a number";
  } else if (values.min_days_notice < 0) {
    errors.min_days_notice = "Min days notice cannot be negative";
  }

  // Paid days validation (only if not all paid)
  if (!values.is_all_paid) {
    // Full Paid Days validation
    if (!values.full_paid_days) {
      errors.full_paid_days = "Full paid days is required when not all paid";
    } else if (isNaN(values.full_paid_days)) {
      errors.full_paid_days = "Full paid days must be a number";
    } else if (values.full_paid_days < 0) {
      errors.full_paid_days = "Full paid days cannot be negative";
    }

    // Half Paid Days validation
    if (!values.half_paid_days) {
      errors.half_paid_days = "Half paid days is required when not all paid";
    } else if (isNaN(values.half_paid_days)) {
      errors.half_paid_days = "Half paid days must be a number";
    } else if (values.half_paid_days < 0) {
      errors.half_paid_days = "Half paid days cannot be negative";
    }

    // Sum validation - Full + Half should not exceed total leave count
    if (values.full_paid_days && values.half_paid_days && values.leave_count) {
      const totalPaidDays =
        parseInt(values.full_paid_days) + parseInt(values.half_paid_days);
      const leaveCount = parseInt(values.leave_count);

      if (totalPaidDays > leaveCount) {
        errors.full_paid_days = `Total paid days (${totalPaidDays}) cannot exceed leave count (${leaveCount})`;
        errors.half_paid_days = `Total paid days (${totalPaidDays}) cannot exceed leave count (${leaveCount})`;
      }
    }
  }

  // // Nationalities validation
  // if (!values.nationalities || values.nationalities.length === 0) {
  //   errors.nationalities = "Nationalities selection is required";
  // }

  // // Branches validation
  // if (!values.branches_ids || values.branches_ids.length === 0) {
  //   errors.branches_ids = "Branches selection is required";
  // }

  // // Departments validation
  // if (!values.departments_ids || values.departments_ids.length === 0) {
  //   errors.departments_ids = "Departments selection is required";
  // }

  // Work days or calendar days validation
  if (!values.day_count_type) {
    errors.day_count_type = "Work days or calendar days selection is required";
  }

  // Max Consecutive Days validation
  if (!values.max_consecutive_days) {
    errors.max_consecutive_days = "Max consecutive days allowed is required";
  } else if (isNaN(values.max_consecutive_days)) {
    errors.max_consecutive_days = "Max consecutive days must be a number";
  } else if (values.max_consecutive_days <= 0) {
    errors.max_consecutive_days = "Max consecutive days must be greater than 0";
  }

  return errors;
};
export { validateLeaveRequestFormSchema, validateLeaveDurationFormSchema, validateLeaveTypeFormSchema };
