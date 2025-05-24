import {
  ApprovalHierarchy,
  ApprovalHierarchyHistoryLogs,
  ApprovalLevel,
  DelegateLevel,
} from "app/utils/Types/ApprovalHierarchy";

export function mapApprovalHierarchyData(data) {
  const approvalHierarchyData = Object.keys(ApprovalHierarchy).reduce(
    (acc, key) => {
      if (data.hasOwnProperty(key)) {
        acc[key] = data[key];
      } else {
        // Use default values from ApprovalHierarchy type
        acc[key] = ApprovalHierarchy[key];
      }
      return acc;
    },
    {}
  );

  return approvalHierarchyData;
}

export async function mapApprovalHierarchyListData(data) {
  if (!data || data.length === 0) return [];
  const ApprovalHierarchyList = await data?.map((approvalHierarchy) => {
    return mapApprovalHierarchyData(approvalHierarchy);
  });

  return ApprovalHierarchyList;
}

export function mapApprovalHierarchyPayloadData(data, id) {
  // Initialize an empty payload object
  const payload = {};
  // Iterate over the keys in the Task object
  for (const key in ApprovalHierarchy) {
    // Check if the key exists in the data object
    if (
      data.hasOwnProperty(key) &&
      data[key] !== null &&
      data[key] !== undefined &&
      !["no_of_levels", "id", "has_delegation"].includes(key)
    ) {
      if (key === "name") payload[key] = data[key].trim();
      else payload[key] = data[key];
    }
  }

  // Return the constructed payload
  return payload;
}

export function mapApprovalHierarchyHistoryLogsData(data) {
  const historyData = Object.keys(ApprovalHierarchyHistoryLogs).reduce(
    (acc, key) => {
      if (key === "feature_ids") acc[key] = data.details.feature_ids;
      else if (key === "permission_changed")
        acc[key] = data.details.permission_changed;
      else if (key === "employee_id") acc[key] = data.employee.id;
      else if (key === "employee_name") acc[key] = data.employee.name;
      else if (data.hasOwnProperty(key)) {
        acc[key] = data[key];
      }
      return acc;
    },
    {}
  );

  return historyData;
}

export async function mapApprovalHierarchyHistoryLogsListData(data) {
  if (!data || data.length === 0) return [];
  const HistoryList = await data?.map((history) => {
    return mapApprovalHierarchyHistoryLogsData(history);
  });

  return HistoryList;
}

export function mapHierarchyLevelData(data) {
  const approvalHierarchyData = Object.keys(ApprovalLevel).reduce(
    (acc, key) => {
      if (data.hasOwnProperty(key)) {
        acc[key] = data[key];
      } else {
        // Use default values from ApprovalHierarchy type
        acc[key] = ApprovalLevel[key];
      }
      return acc;
    },
    {}
  );

  return approvalHierarchyData;
}

export function mapDelegateLevelPayloadData(data) {
  // Initialize an empty payload object
  const payload = {};
  // Iterate over the keys in the Task object
  for (const key in DelegateLevel) {
    // Check if the key exists in the data object
    if (
      data.hasOwnProperty(key) &&
      data[key] !== null &&
      data[key] !== undefined &&
      !["id"].includes(key)
    ) {
      if (key === "reason") payload[key] = data[key].trim();
      else payload[key] = data[key];
    }
  }

  // Return the constructed payload
  return payload;
}


export function mapDelegateLevelData(data) {
  const delegateLevelData = Object.keys(DelegateLevel).reduce(
    (acc, key) => {
      if (data.hasOwnProperty(key)) {
        acc[key] = data[key];
      } else {
        // Use default values from ApprovalHierarchy type
        acc[key] = DelegateLevel[key];
      }
      return acc;
    },
    {}
  );

  return delegateLevelData;
}

export async function mapDelegateLevelListData(data) {
  if (!data || data.length === 0) return [];
  const DelegateLevelList = await data?.map((delegateLevel) => {
    return mapDelegateLevelData(delegateLevel);
  });

  return DelegateLevelList;
}
