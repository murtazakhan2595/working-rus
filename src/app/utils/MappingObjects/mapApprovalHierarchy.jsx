import {
  ApprovalHierarchy,
  ApprovalHierarchyHistoryLogs,
  ApprovalLevel,
  DelegateLevel,
} from "app/utils/Types/ApprovalHierarchy";
import { addSeconds, format } from "date-fns";
import _ from "lodash";
import moment from 'moment'
export async function mapApprovalHierarchyData(data) {
  const approvalHierarchyData = {};
  for (const key of Object.keys(ApprovalHierarchy)) {
    if (data.hasOwnProperty(key)) {
      if (key === "levels") {
        const levels = await mapHierarchyLevelListData(data[key] || []);
        approvalHierarchyData[key] = levels;
      } else if (key === "level_groups") {
        const levels = approvalHierarchyData.levels;
        const level_groups = data[key];
        if (!levels || !Array.isArray(levels) || levels.length === 0)
          approvalHierarchyData[key] = level_groups;
        else {
          approvalHierarchyData[key] = _.uniq(
            levels.map((level) => level.group_name) || []
          );
        }
      } else {
        approvalHierarchyData[key] = data[key];
      }
    } else {
      approvalHierarchyData[key] = ApprovalHierarchy[key];
    }
  }

  return approvalHierarchyData;
}

export async function mapApprovalHierarchyListData(data) {
  if (!Array.isArray(data) || data.length === 0) return [];

  const ApprovalHierarchyList = await Promise.all(
    data.map((approvalHierarchy) => mapApprovalHierarchyData(approvalHierarchy))
  );

  return ApprovalHierarchyList;
}

export async function mapApprovalHierarchyPayloadData(data, id) {
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
      else if (key === "levels") {
        const levels = data[key] || [];
        const levels_payload = await levels.map((level) =>
          mapLevelPayloadData(level)
        );
        payload[key] = levels_payload;
      } else payload[key] = data[key];
    }
  }

  // Return the constructed payload
  return payload;
}

export function mapLevelPayloadData(data) {
  // Initialize an empty payload object
  const payload = {};
  // Iterate over the keys in the Task object
  for (const key in ApprovalLevel) {
    // Check if the key exists in the data object
    if (
      data.hasOwnProperty(key) &&
      data[key] !== null &&
      data[key] !== undefined &&
      !["id"].includes(key)
    ) {
      if (key === "auto_forward_threshold") {
        if (data.auto_forward_enabled && data[key]) {
          const threshold = parseFloat(data[key]);
          const totalSeconds = Math.floor(threshold * 3600);

          const baseDate = new Date(moment().startOf('day'));
          const targetDate = addSeconds(baseDate, totalSeconds);

          const days = Math.floor(totalSeconds / (24 * 3600));
          const timePart = format(targetDate, "HH:mm:ss");

          payload[key] = `${days} ${timePart}.000000`;
        } else {
          payload[key] = "";
        }
      } else {
        payload[key] = data[key];
      }
    }
  }

  // Return the constructed payload
  return payload;
}

export function mapApprovalHierarchyHistoryLogsData(data) {
  const historyData = Object.keys(ApprovalHierarchyHistoryLogs).reduce(
    (acc, key) => {
      if (data.hasOwnProperty(key)) {
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
        if (key === "auto_forward_threshold" && data[key]) {
          try {
            const threshold = data[key];
            if (!threshold) {
              acc[key] = null;
              return;
            }

            let dayPart = "0";
            let timePart = threshold;

            // If format includes space, it has both day and time
            if (threshold.includes(" ")) {
              [dayPart, timePart] = threshold.split(" ");
            }

            const days = parseInt(dayPart, 10) || 0;
            const [hours = 0, minutes = 0, secondsWithMicro = "0"] =
              timePart.split(":");
            const [seconds = 0, micro = 0] = secondsWithMicro.split(".");

            const totalHours =
              days * 24 +
              parseInt(hours, 10) +
              parseInt(minutes, 10) / 60 +
              parseInt(seconds, 10) / 3600 +
              parseInt(micro, 10) / 1e6 / 3600;

            acc[key] = totalHours;
          } catch (error) {
            console.error("Threshold parsing error for key:", key, error);
            acc[key] = null;
          }
        } else if (key === "group_name") {
          const group_name = data[key];
          if (!group_name || group_name.length === 0)
            acc[key] = `Group ${data.initiative_designation.join(" ")}`;
          else acc[key] = group_name;
        } else acc[key] = data[key];
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

export async function mapHierarchyLevelListData(data) {
  if (!data || data.length === 0) return [];
  const HierarchyLevelList = await data?.map((hierarchyLevel) => {
    return mapHierarchyLevelData(hierarchyLevel);
  });

  return HierarchyLevelList;
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
  const delegateLevelData = Object.keys(DelegateLevel).reduce((acc, key) => {
    if (data.hasOwnProperty(key)) {
      acc[key] = data[key];
    } else {
      // Use default values from ApprovalHierarchy type
      acc[key] = DelegateLevel[key];
    }
    return acc;
  }, {});

  return delegateLevelData;
}

export async function mapDelegateLevelListData(data) {
  if (!data || data.length === 0) return [];
  const DelegateLevelList = await data?.map((delegateLevel) => {
    return mapDelegateLevelData(delegateLevel);
  });

  return DelegateLevelList;
}
