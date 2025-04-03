import { Attendance } from "app/utils/Types/Attendance";
import moment from "moment";
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
        payload[key] = moment(data[key]);
        if (shiftDetails) {
          const startTime = moment(shiftDetails.starttime);
          const endTime = moment(shiftDetails.endtime);
          const totalHours = endTime.diff(startTime, "hours", true);
          payload["total_hours"] = totalHours;
        }
      } else if (key === "checkout") {
        payload[key] = moment(data[key]);
        if (!data.payable_hours) {
          payload["payable_hours"] = payload.checkout.diff(
            payload.checkin,
            "hours",
            true
          );
        }
        if (!data.overtime_hours) {
          if (payload.payable_hours > payload.total_hours) {
            payload["overtime_hours"] =
              payload.payable_hours - payload.total_hours;
          }
        }
      } else payload[key] = data[key];
    }
  }

  // Return the constructed payload
  return payload;
}
