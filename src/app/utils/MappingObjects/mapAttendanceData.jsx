import { Attendance, Shift } from "app/utils/Types/Attendance";
import moment from "moment";

export function mapShiftData(data) {
  const shiftDetails = Object.keys(Shift).reduce((acc, key) => {
    if (data.hasOwnProperty(key)) {
      if (key === "starttime")
        acc['shiftStartTime'] = moment(data[key]).format("hh:mm A")
      if (key === "endtime")
        acc['shiftEndTime'] = moment(data[key]).format("hh:mm A")
      acc[key] = data[key];
    }
    return acc;
  }, {});
  return shiftDetails;
}
export function mapAttendanceData(data, shiftDetails) {
  // Initialize an empty payload object
  const payload = {};
  // Iterate over the keys in the Task object
  for (const key in Attendance) {
    // Check if the key exists in the data object
    if (
      data.hasOwnProperty(key) &&
      data[key] !== undefined &&
      data[key] !== null
    ) {
      // Add the key and its value to the payload
      if (key === "status") {
        if (data[key] === "Absent") payload["is_absent"] = true;
        else if (data[key] === "Present") payload["is_absent"] = false;
        else if (data[key] === "Late") {
          payload["is_late"] = true;
          payload["is_absent"] = false;
        } else if (data[key] === "Weekend") {
          payload["is_weekend"] = true;
          payload["is_absent"] = false;
        }
        payload[key] = data[key];
      } else if (key === "checkin") {
        const checkInTime = moment(data[key]);
        payload[key] = data[key];
        if (shiftDetails) {
          const startTime = moment(shiftDetails.starttime);
          const endTime = moment(shiftDetails.endtime);
          const totalHours = endTime.diff(startTime, "hours", true);
          payload["total_hours"] = totalHours;
          payload.is_absent = false;
        }
        payload.is_weekend = [0, 6].includes(checkInTime.day());
      } else if (key === "checkout") {
        debugger;
        const checkin = moment(payload.checkin);
        payload[key] = data[key];
        payload["payable_hours"] = parseFloat(
          moment(payload.checkout).diff(checkin, "hours", true)
        ).toFixed(2);
        if (payload.payable_hours > payload.total_hours) {
          payload["overtime_hours"] = parseFloat(
            parseFloat(payload.payable_hours) - parseFloat(payload.total_hours)
          ).toFixed(2);
        }
      } else payload[key] = data[key];
    }
  }

  // Return the constructed payload
  return payload;
}
