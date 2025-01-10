import { Task } from "app/utils/Types/TaskManagment";
export function mapTaskPayloadData(data) {
  // Initialize an empty payload object
  const payload = {};

  // Iterate over the keys in the Task object
  for (const key in Task) {
    // Check if the key exists in the data object
    if (data.hasOwnProperty(key) && data[key]) {
      // Add the key and its value to the payload
      payload[key] = data[key];
    }
  }

  // Return the constructed payload
  return payload;
}
