import { Module,UserRole } from "app/utils/Types/RolesPermission";


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

export async function mapUserRoleListData(data) {
  if (!data || data.length === 0) return [];
  const UserRoleList = await data?.map((userRole) => {
    return mapUserRoleData(userRole);
  });

  return UserRoleList;
}
