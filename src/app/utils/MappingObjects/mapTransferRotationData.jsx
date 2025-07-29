import { EmployeeTransfer, JobRotation } from "app/utils/Types/TransferAndRotation";

export function mapEmployeeTransferData(data) {
  const employeeTransferDetails = Object.keys(EmployeeTransfer).reduce((acc, key) => {
    if (data.hasOwnProperty(key)) {
      acc[key] = data[key];
    }
    return acc;
  }, {});

  return employeeTransferDetails;
}

export function mapEmployeeTransferPayloadData(data) {
  // Initialize an empty payload object
  const payload = {};
  // Iterate over the keys in the Task object
  for (const key in EmployeeTransfer) {
    // Check if the key exists in the data object
    if (data.hasOwnProperty(key) && data[key]) {
      // Add the key and its value to the payload
      payload[key] = data[key];
    }
  }

  // Return the constructed payload
  return payload;
}
export function mapEmployeeTransferInfo(data) {
  // Initialize an empty payload object
  const payload = {};
  payload.department_name = data.new_department;
  payload.direct_report = data.new_reporting_manager;
  payload.branch_id = data.new_branch;

  // Return the constructed payload
  return payload;
}


export function mapRotationPayloadData(data) {
  // Initialize an empty payload object
  const payload = {};
  // Iterate over the keys in the Task object
  for (const key in JobRotation) {
    // Check if the key exists in the data object
    if (data.hasOwnProperty(key) && data[key]) {
      // Add the key and its value to the payload
      payload[key] = data[key];
    }
  }

  // Return the constructed payload
  return payload;
}