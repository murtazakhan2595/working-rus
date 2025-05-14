import { Module, UserRole,UserRolePermissions } from "app/utils/Types/RolesPermission";

export function mapModuleData(data) {
  const moduleData = Object.keys(Module).reduce((acc, key) => {
    if (data.hasOwnProperty(key)) {
      acc[key] = data[key];
    }
    return acc;
  }, {});

  return moduleData;
}

export async function mapModuleListData(data) {
  if (!data || data.length === 0) return [];
  const ModuleList = await data?.map((module) => {
    return mapModuleData(module);
  });

  return ModuleList;
}

export function mapUserRoleData(data) {
  const userRoleData = Object.keys(UserRole).reduce((acc, key) => {
    if (data.hasOwnProperty(key)) {
      acc[key] = data[key];
    }
    return acc;
  }, {});

  return userRoleData;
}

export function mapUserRolePermissionsData(data) {
  const userRoleData = Object.keys(UserRolePermissions).reduce((acc, key) => {
    if (data.hasOwnProperty(key)) {
      acc[key] = data[key];
    }
    return acc;
  }, {});

  return userRoleData;
}

export async function mapUserRoleListData(data) {
  if (!data || data.length === 0) return [];
  const UserRoleList = await data?.map((userRole) => {
    return mapUserRoleData(userRole);
  });

  return UserRoleList;
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
      payload[key] = data[key];
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
