import { EmployeeTransfer, JobRotation } from "app/utils/Types/TransferAndRotation";
import { mapApproverDetails } from "app/utils/MappingObjects/mapGeneralData";
import { calculateTotalCount } from "utils/renderValues";

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


export async function mapTransferStatsData(data) {
  if (!data || data.length === 0)
    return { Pending: 0, Approved: 0, Rejected: 0, Total: 0 };
  const Pending = calculateTotalCount(data, "status", "PENDING");
  const Total = data.length || 0;
  const Approved = calculateTotalCount(data, "status", "APPROVED");
  const Rejected = calculateTotalCount(data, "status", "REJECTED");

  return { Pending, Approved, Rejected, Total };
}

export async function mapRotationStatsData(data) {
  if (!data || data.length === 0)
    return { Pending: 0, Approved: 0, Rejected: 0, Total: 0 };
  const Pending = calculateTotalCount(data, "status", "pending");
  const Total = data.length || 0;
  const Approved = calculateTotalCount(data, "status", "approved");
  const Rejected = calculateTotalCount(data, "status", "rejected");

  return { Pending, Approved, Rejected, Total };
}