import { EmployeeExit } from "app/utils/Types/EmployeeExit";
import { calculateTotalCount } from "utils/renderValues";
import { mapApproverDetails } from "app/utils/MappingObjects/mapGeneralData";

export async function mapEmployeeExitData(data) {
  const ResponseData = {};
  for (const key of Object.keys(EmployeeExit)) {
    if (key === "approval_details") {
      ResponseData[key] = await mapApproverDetails(data);
    } else {
      if (Object.prototype.hasOwnProperty.call(data, key))
        ResponseData[key] = data[key];
    }
  }

  return ResponseData;
}

export function mapEmployeeExitPayloadData(data) {
  // Initialize an empty payload object
  const formData = new FormData();
  // Iterate over the keys in the Task object
  for (const key in EmployeeExit) {
    // Check if the key exists in the data object
    if (data.hasOwnProperty(key) && data[key]) {
      // Add the key and its value to the payload
      if (
        [
          "resignation_letter",
          "termination_letter",
          "clearance_report",
        ].includes(key)
      ) {
        if (data[key] instanceof File) formData.append(key, data[key]);
      } else formData.append(key, data[key]);
    }
  }

  // Return the constructed payload
  return formData;
}

export async function mapExitStatsData(data) {
  if (!data || data.length === 0)
    return { Pending: 0, Approved: 0, Rejected: 0, Cancelled: 0, Total: 0 };
  const Pending = calculateTotalCount(data, "status", "PENDING");
  const Total = data.length || 0;
  const Approved = calculateTotalCount(data, "status", "APPROVED");
  const Rejected = calculateTotalCount(data, "status", "REJECTED");
  const Clearance = calculateTotalCount(data, "clearance_status", "COMPLETED");
  const Exit = calculateTotalCount(data, "clearance_status", "EXIT_INTERVIEW");
  return { Pending, Approved, Rejected, Clearance, Total, Exit };
}
