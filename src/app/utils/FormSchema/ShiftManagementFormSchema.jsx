import { renderDate } from "utils/renderValues";

export const validateShiftFormSchema = (
  values,
  existingShifts = [],
  currentShiftId = null
) => {
  const errors = {};

  // Validate required fields
  if (!values.name?.trim()) errors.name = "Shift name is required";
  if (!values.type) errors.type = "Shift type is required";

  const hasSplit = Boolean(values.is_split_shift);

  // Validate time fields based on shift type
  if (hasSplit) {
    if (!values.split_start_time1)
      errors.split_start_time1 = "First half start time is required";
    if (!values.split_end_time1)
      errors.split_end_time1 = "First half end time is required";
    if (!values.split_start_time2)
      errors.split_start_time2 = "Second half start time is required";
    if (!values.split_end_time2)
      errors.split_end_time2 = "Second half end time is required";
  } else {
    if (!values.starttime) errors.starttime = "Start time is required";
    if (!values.endtime) errors.endtime = "End time is required";
  }

  // Check for duplicate shift (for regular shift only)
  const isDuplicateShift =
    !hasSplit &&
    values.name &&
    values.type &&
    values.starttime &&
    currentShiftId &&
    values.endtime &&
    Array.isArray(existingShifts) &&
    existingShifts.length > 0 &&
    existingShifts.some((shift) => {
      if (shift?.id === currentShiftId) return false;

      const sameName = shift.name?.toLowerCase() === values.name.toLowerCase();
      const sameType = shift.type === values.type;
      const sameStartTime =
        renderDate(shift.starttime, "--", "time") ===
        renderDate(values.starttime, "--", "time");
      const sameEndTime =
        renderDate(shift.endtime, "--", "time") ===
        renderDate(values.endtime, "--", "time");

      return sameName && sameType && sameStartTime && sameEndTime;
    });

  if (isDuplicateShift) {
    errors.name =
      "A shift with the same name, type, and timings already exists";
  }

  return errors;
};

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
    const dailyScheduleErrors = {}; // ✅ Use object instead of array
    let hasErrors = false; // ✅ Track if any errors exist

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
        hasErrors = true; // ✅ Mark that we have errors
      }
    });

    if (hasErrors) {
      // ✅ Use boolean check instead of length
      errors.dailySchedule = dailyScheduleErrors;
    }
  }

  console.log("🔍 Validation errors:", errors); // ✅ Add debugging
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
  validateScheduleShiftFormSchema,
  validateShiftRequestFormSchema,
};
