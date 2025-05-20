// src/app/utils/FormSchema/ShiftManagementFormSchema.jsx

// Validation for individual shift creation/editing
const validateShiftFormSchema = (values) => {
  const errors = {};

  // Basic field validation
  if (!values.name) errors.name = "Shift Name is required";
  if (!values.type) errors.type = "Shift Type is required";

  // Validate time fields if they exist
  if (values.is_split_shift) {
    // For split shifts, validate all split time fields
    if (!values.split_start_time1)
      errors.split_start_time1 = "Start time for first half is required";
    if (!values.split_end_time1)
      errors.split_end_time1 = "End time for first half is required";
    if (!values.split_start_time2)
      errors.split_start_time2 = "Start time for second half is required";
    if (!values.split_end_time2)
      errors.split_end_time2 = "End time for second half is required";
  } else {
    // For regular shifts, validate start and end times
    if (!values.starttime) errors.starttime = "Start time is required";
    if (!values.endtime) errors.endtime = "End time is required";
  }

  return errors;
};

// Validation for scheduling shifts for employees
const validateScheduleShiftFormSchema = (values) => {
  const errors = {};

  if (!values.dateRange) errors.dateRange = "Date range is required";

  if (!values.employees || values.employees.length === 0) {
    errors.employees = "At least one employee must be selected";
  }

  if (values.shiftType === "predefined" && !values.shiftId) {
    errors.shiftId = "Please select a shift";
  }

  // Validate daily schedule if using custom shifts
  if (values.shiftType === "custom" && values.dailySchedule) {
    const dailyScheduleErrors = [];

    values.dailySchedule.forEach((day, index) => {
      const dayErrors = {};

      if (!day.isOff) {
        if (day.isSplit) {
          // Validate split shift times
          if (!day.splitStartTime1)
            dayErrors.splitStartTime1 = "Start time is required";
          if (!day.splitEndTime1)
            dayErrors.splitEndTime1 = "End time is required";
          if (!day.splitStartTime2)
            dayErrors.splitStartTime2 = "Start time is required";
          if (!day.splitEndTime2)
            dayErrors.splitEndTime2 = "End time is required";
        } else {
          // Validate regular shift times
          if (!day.startTime) dayErrors.startTime = "Start time is required";
          if (!day.endTime) dayErrors.endTime = "End time is required";
        }
      }

      if (Object.keys(dayErrors).length > 0) {
        dailyScheduleErrors[index] = dayErrors;
      }
    });

    if (dailyScheduleErrors.length > 0) {
      errors.dailySchedule = dailyScheduleErrors;
    }
  }

  return errors;
};

// Validation for shift change requests
const validateShiftRequestFormSchema = (values) => {
  const errors = {};

  if (!values.date) errors.date = "Date is required";

  if (!values.is_off_requested) {
    if (!values.requested_start_time)
      errors.requested_start_time = "Start time is required";
    if (!values.requested_end_time)
      errors.requested_end_time = "End time is required";

    if (values.is_split_requested) {
      if (!values.requested_split_start_time1)
        errors.requested_split_start_time1 = "Start time is required";
      if (!values.requested_split_end_time1)
        errors.requested_split_end_time1 = "End time is required";
      if (!values.requested_split_start_time2)
        errors.requested_split_start_time2 = "Start time is required";
      if (!values.requested_split_end_time2)
        errors.requested_split_end_time2 = "End time is required";
    }
  }

  return errors;
};

export {
  validateShiftFormSchema,
  validateScheduleShiftFormSchema,
  validateShiftRequestFormSchema,
};
