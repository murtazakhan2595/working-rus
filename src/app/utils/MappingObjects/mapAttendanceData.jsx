import { Attendance } from "app/utils/Types/Attendance";
import moment from "moment";
export function mapAttendanceData(data) {
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
        else if (data[key] === "Late") payload["is_late"] = true;
        else if (data[key] === "Weekend") payload["is_weekend"] = true;
      }
      payload[key] = data[key];
    }
  }

  // Return the constructed payload
  return payload;
}
