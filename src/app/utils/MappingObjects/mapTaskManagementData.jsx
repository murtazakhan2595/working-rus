import {
  Task,
  CustomField,
  CustomFieldData,
} from "app/utils/Types/TaskManagment";
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
export function mapCustomFieldPayloadData(data, projectID = null, id) {
  const fieldData = {};
  for (const key in CustomFieldData) {
    // Check if the key exists in the data object
    if (data.hasOwnProperty(key) && data[key]) {
      // Add the key and its value to the payload
      fieldData[key] = data[key];
    }
  }
  // Initialize an empty payload object
  const payload = {
    ...(projectID && { project: projectID }),
    dynamic_fields: [{ ...(id && { id: id }), field_data: fieldData }],
  };
  return payload;
}
