

// Event type definitions and colors
export const EVENT_TYPES = {
  BIRTHDAY: "birthday",
  EVENT: "event", // Custom events
  WORK_ANNIVERSARY: "work_anniversary", // Added work anniversary type
};

export const EVENT_COLORS = {
  [EVENT_TYPES.BIRTHDAY]: "bg-indigo-100 text-indigo-800",
  [EVENT_TYPES.EVENT]: "bg-blue-100 text-blue-800",
  [EVENT_TYPES.WORK_ANNIVERSARY]: "bg-amber-100 text-amber-800", // Amber color for work anniversaries
};

// Validation function for event form
export const validateEventForm = (values) => {
  const errors = {};

  if (!values.name) {
    errors.name = "Event name is required";
  }
  if (!values.start_date) {
    errors.start_date = "Start date is required";
  }
  if (!values.end_date) {
    errors.end_date = "End date is required";
  }

  // Optional validations for start/end time
  if (values.start_date && values.end_date) {
    // Parse time values in format "HH:mm"
    const [startHours, startMinutes] = values.start_date.split(":").map(Number);
    const [endHours, endMinutes] = values.end_date.split(":").map(Number);

    if (
      !isNaN(startHours) &&
      !isNaN(startMinutes) &&
      !isNaN(endHours) &&
      !isNaN(endMinutes)
    ) {
      // Compare hours and minutes
      if (
        endHours < startHours ||
        (endHours === startHours && endMinutes <= startMinutes)
      ) {
        errors.end_date = "End time must be after start time";
      }
    }
  }

  return errors;
};
