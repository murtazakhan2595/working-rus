import moment from "moment";
export const validateUpdateAttendanceFormSchema = (values) => {
  const errors = {};
  if (!values.status) errors.status = "Status is required";
  else if (values.status) {
    if (values.status !== "Absent" && !values.checkin)
      errors.checkin = "Check-In Time is required";
  }
  if (!values.date) errors.date = "Date is required";
  else if (
    values.status !== "Absent" &&
    moment(values.date).isBefore(moment(), "day")
  )
    if (!values.checkout) errors.checkout = "Check-In Time is required";
  if (!values.employee_id) errors.employee_id = "Employee is required";
  return errors;
};

export const validateTimeAdjustmentFormSchema = (values) => {
  const errors = {};
  if (!values.reason) errors.reason = "Reason is required";
  if (values.reason && !values.reason.trim())
    errors.reason = "Reason is required";
  return errors;
};

export const validateAttendanceAdjustmentFormSchema = (values) => {
  const errors = {};
  if (values.date && moment(values.date).isBefore(moment())) {
    if (!values.requested_checkout)
      errors.checkout = "New check-out time is required";
  }
  if (!values.requested_checkin)
    errors.requested_checkin = "New check-in time is required";
  if (!values.employee_id) errors.employee_id = "Employee is required";
  if (!values.reason) errors.reason = "Reason is required";
  else if (!values.reason.trim()) errors.reason = "Reason is required";
  if (!values.date) errors.date = "Date is required";
  return errors;
};
