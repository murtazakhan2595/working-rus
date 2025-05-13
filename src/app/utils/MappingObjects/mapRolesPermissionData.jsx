import { Module } from "app/utils/Types/RolesPermission";

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
