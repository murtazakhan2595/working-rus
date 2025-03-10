import { EmployeeTranfer } from "app/utils/Types/EmployeeTranfer";

export function mapEmployeeTranferData(data) {
  const employeeTranferDetails = Object.keys(EmployeeTranfer).reduce((acc, key) => {
    if (data.hasOwnProperty(key)) {
      acc[key] = data[key];
    }
    return acc;
  }, {});

  return employeeTranferDetails;
}

export function mapEmployeeTranferPayloadData(data) {
    // Initialize an empty payload object
    const payload = {};
    // Iterate over the keys in the Task object
    for (const key in EmployeeTranfer) {
      // Check if the key exists in the data object
      if (data.hasOwnProperty(key) && data[key]) {
        // Add the key and its value to the payload
        payload[key] = data[key];
      }
    }
  
    // Return the constructed payload
    return payload;
  }