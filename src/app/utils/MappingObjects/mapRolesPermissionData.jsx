import { Module, UserRole } from "app/utils/Types/RolesPermission";

// Dynamic mapping that handles nested structures
export function mapModuleData(data) {
  const moduleData = Object.keys(Module).reduce((acc, key) => {
    if (data.hasOwnProperty(key)) {
      // Special handling for arrays
      if (key === "submodules" && Array.isArray(data[key])) {
        acc[key] = data[key].map((submodule) => mapSubmoduleData(submodule));
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

// Helper function for mapping submodules
export function mapSubmoduleData(data) {
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
  return data.map((module) => mapModuleData(module));
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
  return data.map((userRole) => mapUserRoleData(userRole));
}

// Helper function to extract feature IDs from role permissions response
export function extractFeatureIdsFromRolePermissions(rolePermissions) {
  const featureIds = [];

  if (!rolePermissions || !Array.isArray(rolePermissions)) {
    return featureIds;
  }

  rolePermissions.forEach((permission) => {
    if (permission.feature && Array.isArray(permission.feature)) {
      permission.feature.forEach((feature) => {
        if (feature.id) {
          featureIds.push(feature.id);
        }
      });
    }
  });

  return featureIds;
}
