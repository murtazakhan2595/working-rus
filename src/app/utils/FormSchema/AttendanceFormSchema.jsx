import moment from "moment";
import { validateStartAndEndTimeField } from "app/utils/FormSchema/generalFormSchema";
export const validateUpdateAttendanceFormSchema = (
  values,
  isSplitShift = false
) => {
  const errors = {};
  if (!values.status) errors.status = "Status is required";
  else if (values.status) {
    if (values.status !== "Absent" && !values.checkin)
      errors.checkin = "Check-In Time is required";
    if (isSplitShift && values.status !== "Absent" && !values.second_checkin)
      errors.second_checkin = "Check-In Time is required";
  }
  if (!values.date) errors.date = "Date is required";
  else if (moment(values.date).isBefore(moment(), "day")) {
    if (isSplitShift && !values.second_checkout)
      errors.second_checkout = "Check-Out Time is required";
    if (!values.checkout) errors.checkout = "Check-Out Time is required";
  }
  if (!values.employee_id) errors.employee_id = "Employee is required";
  if (values.checkin && values.checkout && values.date) {
    const ischeckoutBefore = validateStartAndEndTimeField(
      values.checkin,
      values.checkout,
      values.date,
      "Check-out"
    );
    if (ischeckoutBefore) errors.checkout = "Check-out must be after check-in.";
  }
  if (values.second_checkin && values.second_checkout && values.date) {
    const ischeckoutBefore = validateStartAndEndTimeField(
      values.second_checkin,
      values.second_checkout,
      values.date,
      "Check-out"
    );
    if (ischeckoutBefore)
      errors.second_checkout = "Check-out must be after check-in";
  }
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
  if (!values.employee) errors.employee_id = "Employee is required";
  if (!values.reason) errors.reason = "Reason is required";
  else if (!values.reason.trim()) errors.reason = "Reason is required";
  if (!values.date) errors.date = "Date is required";
  return errors;
};
