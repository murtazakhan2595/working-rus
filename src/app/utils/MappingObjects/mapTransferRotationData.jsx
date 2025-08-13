import { EmployeeTransfer, JobRotation } from "app/utils/Types/TransferAndRotation";
import { mapApproverDetails } from "app/utils/MappingObjects/mapGeneralData";

export async function mapEmployeeTransferData(data, fetchApprovalDetails = true) {
  const RecordDetails = {};

  for (const key of Object.keys(EmployeeTransfer)) {
    if (key === "approval_details" && fetchApprovalDetails) {
      RecordDetails[key] = await mapApproverDetails(data);
    } else {
      if (Object.prototype.hasOwnProperty.call(data, key))
        RecordDetails[key] = data[key];
    }
  }

  return RecordDetails;
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

export async function mapRotationData(data, fetchApprovalDetails = true) {
  const Details = {};

  for (const key of Object.keys(JobRotation)) {
    if (key === "approval_details" && fetchApprovalDetails) {
      Details[key] = await mapApproverDetails(data);
    } else {
      if (Object.prototype.hasOwnProperty.call(data, key))
        Details[key] = data[key];
    }
  }

  return Details;
}