import { Task, Project, CustomFieldData } from "app/utils/Types/TaskManagment";
export function mapTaskPayloadData(data) {
  // Initialize an empty payload object
  const payload = {};
  // Iterate over the keys in the Task object
  for (const key in Task) {
    // Check if the key exists in the data object
    if (data.hasOwnProperty(key) && data[key]) {
      // Add the key and its value to the payload
      if (key === "assigned_to" || key === "attachment") {
        if (Array.isArray(data[key]) && data[key].length > 0)
          payload[key] = data[key];
      } else payload[key] = data[key];
    }
  }

  // Return the constructed payload
  return payload;
}

export function mapProjectPayloadData(data) {
  // Initialize an empty payload object
  const payload = {};
  // Iterate over the keys in the Task object
  for (const key in Project) {
    // Check if the key exists in the data object
    if (data.hasOwnProperty(key) && data[key]) {
      // Add the key and its value to the payload
      payload[key] = data[key];
    }
  }

  // Return the constructed payload
  return payload;

  // const formData = new FormData();
  // for (const key in Project) {
  //   if (data.hasOwnProperty(key) && data[key]) {
  //     if (key === "profile") {
  //       if (data[key] instanceof File) formData.append(key, data[key]);
  //     } else if (Array.isArray(data[key])) {
  //       const array = data[key];
  //       if (array.length > 0) {
  //         array.forEach((obj) => formData.append(key, obj));
  //       } else {
  //         formData.append(key, "[]"); // Or JSON.stringify([]) if backend expects JSON format
  //       }
  //     } else {
  //       formData.append(key, data[key]);
  //     }
  //   }
  // }

  // return formData;
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
