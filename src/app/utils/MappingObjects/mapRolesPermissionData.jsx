import {
  Module,
  UserRole,
  UserRolePermissions,
  RoleAssignmentHistoryLogs,
} from "app/utils/Types/RolesPermission";
import Config from "constants/config";

export function mapModuleData(data) {
  if (Config[data.code_name]) {
    const moduleData = Object.keys(Module).reduce((acc, key) => {
      if (data.hasOwnProperty(key)) {
        // Special handling for arrays
        if (key === "submodules" && Array.isArray(data[key])) {
          const ResponseList = data[key].map((module) => mapSubmoduleData(module));
          acc[key] = ResponseList.filter(Boolean);
        } else {
          acc[key] = data[key];
        }
      } else {
        // Use default values from Module type
        acc[key] = Module[key];
      }
      return acc;
    }, {});
    return moduleData;
  }
  return null;
}

// Helper function for mapping submodules
export function mapSubmoduleData(data) {
  if (!Config[data.code_name]) return null;
  return {
    id: data.id || null,
    name: data.name || null,
    code_name: data.code_name || null,
    order: data.order || null,
    features: data.features ? data.features.map(mapFeatureData) : [],
  };
}

// Helper function for mapping features
export function mapFeatureData(data) {
  return {
    id: data.id || null,
    name: data.name || null,
    code_name: data.code_name || null,
    description: data.description || null,
  };
}

export async function mapModuleListData(data) {
  if (!data || data.length === 0) return [];
  const ResponseList = data.map((module) => mapModuleData(module));

  return ResponseList.filter(Boolean);
}

export function mapUserRoleData(data) {
  const userRoleData = Object.keys(UserRole).reduce((acc, key) => {
    if (data.hasOwnProperty(key)) {
      acc[key] = data[key];
    } else {
      // Use default values from UserRole type
      acc[key] = UserRole[key];
    }
    return acc;
  }, {});

  return userRoleData;
}

export async function mapUserRoleListData(data) {
  if (!data || data.length === 0) return [];
  const UserRoleList = await data?.map((userRole) => {
    const user_Role = mapUserRoleData(userRole);
    return { label: user_Role.name, value: user_Role.id, ...user_Role };
  });

  return UserRoleList;
}

export function mapUserRolePermissionsData(data) {
  const userRolePermissionData = Object.keys(UserRolePermissions).reduce(
    (acc, key) => {
      if (data.hasOwnProperty(key)) {
        acc[key] = data[key];
      }
      return acc;
    },
    {}
  );

  return userRolePermissionData;
}

export function mapUserRolePayloadData(data, id) {
  // Initialize an empty payload object
  const payload = {};
  // Iterate over the keys in the Task object
  for (const key in UserRole) {
    // Check if the key exists in the data object
    if (
      data.hasOwnProperty(key) &&
      data[key] !== null &&
      data[key] !== undefined
    ) {
      if (key === "name" || key === "description")
        payload[key] = data[key].trim();
      else payload[key] = data[key];
    }
  }

  // Return the constructed payload
  return payload;
}

export function mapUserRolePermissionsPayloadData(data, id) {
  // Initialize an empty payload object
  const payload = {};
  // Iterate over the keys in the Task object
  for (const key in UserRolePermissions) {
    // Check if the key exists in the data object
    if (
      data.hasOwnProperty(key) &&
      data[key] !== null &&
      data[key] !== undefined
    ) {
      payload[key] = data[key];
    }
  }

  // Return the constructed payload
  return payload;
}

export function mapRoleAssignmentHistoryLogsData(data) {
  const historyData = Object.keys(RoleAssignmentHistoryLogs).reduce(
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

export async function mapRoleAssignmentHistoryLogsListData(data) {
  if (!data || data.length === 0) return [];
  const HistoryList = await data?.map((history) => {
    return mapRoleAssignmentHistoryLogsData(history);
  });

  return HistoryList;
}

export async function mapEffectivePermissionsListData(data) {
  if (!data || data.length === 0) return [];
  const PermissionList = await data?.map((permissions) => {
    return { ...permissions.feature };
  });

  return PermissionList;
}
export async function mapUserPermissionsListData(data) {
  if (!data || data.length === 0) return [];

  const allFeatures = data.flatMap((item) => item.feature || []);

  // Remove duplicates by 'id'
  const uniqueFeatures = Array.from(
    new Map(allFeatures.map((f) => [f.id, f])).values()
  );

  return { id: data[0].id, features: uniqueFeatures };
}
