import axios from "axios";
import { toast } from "react-toastify";
import { deleteRole } from "./general";
import { initialState } from "state/slices/UserSlice";
import {
  mapModuleListData,
  mapUserRoleListData,
  mapUserRolePayloadData,
  mapUserRolePermissionsPayloadData,
  mapUserRoleData,
  mapUserRolePermissionsData,
  mapRoleAssignmentHistoryLogsListData,
  mapEffectivePermissionsListData,
} from "app/utils/MappingObjects/mapRolesPermissionData";

import { HandleLogout } from "./general";
import { renderErrorMessages } from "utils/renderErrors";
import { saveEmployeeWorkInformationData } from "./employee";
const baseUrl = initialState.baseUrl;
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

export const getModuleList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "order";
  try {
    const URL = `/modules/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const moduleResponse = response.data;
      // const moduleList = await mapmoduleList(moduleResponse?.results);
      const moduleList = await mapModuleListData(moduleResponse?.results);
      return { results: moduleList, count: moduleResponse.count };
    } else return [];
  } catch (error) {
    console.error("Error fetching Personal Info data :", error);
  }
  return [];
};
// Get roles list
export const getUserRoleList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "-id";
  try {
    const URL = `/userrole/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const rolesResponse = response.data;
      const rolesList = await mapUserRoleListData(rolesResponse?.results);
      return { results: rolesList, count: rolesResponse.count };
    } else return { results: [], count: 0 };
  } catch (error) {
    console.error("Error fetching roles data:", error);
    return { results: [], count: 0 };
  }
};

// Get roles list
export const getRoleAssignmentHistoryLogsList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "-id";
  try {
    const URL = `/role-history/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const rolesResponse = response.data;
      const rolesList = await mapRoleAssignmentHistoryLogsListData(rolesResponse?.results);
      return { results: rolesList, count: rolesResponse.count };
    } else return { results: [], count: 0 };
  } catch (error) {
    console.error("Error fetching roles data:", error);
    return { results: [], count: 0 };
  }
};
// Save/Update role
export const saveUpdateUserRole = async (payload, roleID) => {
  try {
    const url = roleID
      ? `${baseUrl}/userrole/${roleID}`
      : `${baseUrl}/userrole/`;

    const method = roleID ? "PATCH" : "POST"; // Determine method based on existence of id
    const expectedStatus = roleID ? 200 : 201;
    const finalPayload = mapUserRolePayloadData(payload);
    const response = await axios({
      method,
      url,
      data: finalPayload,
      headers: headers(),
    });

    if (response.status === expectedStatus) {
      return response.data;
    }

    renderErrorMessages(response?.data);
    console.warn(
      "API call succeeded but with unexpected status code:",
      response.status
    );
    return false;
  } catch (error) {
    console.error("API error in saveUpdateUserRole:", error);
    if (error?.response?.status === 401) {
      HandleLogout(); // Assuming this logs out the user properly
    }
    renderErrorMessages(error?.response?.data);
    return false; // To be caught and handled in UI/component
  }
};
export const saveUpdateUserRolePermission = async (payload, id) => {
  try {
    const url = id
      ? `${baseUrl}/role-permissions/${id}/`
      : `${baseUrl}/role-permissions/`;

    const method = id ? "patch" : "post";
    const expectedStatus = id ? 200 : 201;
    const finalPayload = mapUserRolePermissionsPayloadData(payload);
    const response = await axios({
      method,
      url,
      data: finalPayload,
      headers: headers(),
    });

    if (response.status === expectedStatus) {
      return response.data;
    }

    renderErrorMessages(response?.data);
    console.warn(
      "API call succeeded but with unexpected status code:",
      response.status
    );
    return false;
  } catch (error) {
    console.error("API error in saveUpdateUserRole:", error);
    if (error?.response?.status === 401) {
      HandleLogout(); // Assuming this logs out the user properly
    }
    renderErrorMessages(error?.response?.data);
    return false; // To be caught and handled in UI/component
  }
};

export const getUserRoleData = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/userrole/${id}`, {
      headers: headers(),
    });
    const UserRoleData = mapUserRoleData(response.data);
    const permissionslist = await getUserRolePermissionsData(UserRoleData.id);
    // Extract all `feature` arrays and flatten into a single array
    const feature_ids = await permissionslist.flatMap((item) =>
      item.feature.map((f) => f.id)
    );
    const role_permission_id =
      Array.isArray(permissionslist) && permissionslist.length > 0
        ? permissionslist[0].id
        : null;
    return {
      ...UserRoleData,
      feature_ids: feature_ids,
      role_permission_id: role_permission_id,
    };
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching data:", error);
  }
  return {};
};

export const getUserRolePermissionsData = async (ids) => {
  try {
    const response = await axios.get(
      `${baseUrl}/role-permissions?search=${encodeURIComponent(
        JSON.stringify({ role: ids })
      )}`,
      {
        headers: headers(),
      }
    );
    // const UserRolePermissionData = ;
    return response.data.results;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching data:", error);
  }
  return 0;
};

const saveAssignedRole = async (id, payload) => {
  try{
    const response = await saveEmployeeWorkInformationData(id, payload);
    return response;
  }catch(error){
    console.error("Error saving assigned role:", error);
    throw error;
  }
};

// Delete assigned role (dummy implementation)
const deleteAssignedRole = async (id, name) => {
  try {
    console.log("Deleting assigned role:", id);
    deleteRole(id, name);
    return {
      success: true,  
      message: "Role assignments removed successfully",
    };
  } catch (error) {
    console.error("Error deleting assigned role:", error);
    throw error;
  }
};


const saveRolePermissions = async (id, roleId, featureIds) => {
  try {
    if (id) {
      const URL = `/role-permissions/${id}/`;
      const payload = {
        role: roleId,
        feature_ids: featureIds,
      };
      const response = await axios.put(`${baseUrl}${URL}`, payload, {
        headers: headers(),
      });
      if (response.status === 200) {
        return response.data;
      }
    } else {
      const URL = `/role-permissions/`;
      const payload = {
        role: roleId,
        feature_ids: featureIds,
      };

      const response = await axios.post(`${baseUrl}${URL}`, payload, {
        headers: headers(),
      });

      if (response.status === 201 || response.status === 200) {
        return response.data;
      }
      throw new Error("Failed to save role permissions");
    }
  } catch (error) {
    console.error("Error saving role permissions:", error);
    throw error;
  }
};

const getRolePermissions = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "order";
  try {
    const URL = `/role-permissions/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    } else return [];
  } catch (error) {
    console.error("Error fetching Personal Info data :", error);
  }
  return [];
};
// Get roles list
export const getMyEffectivePermissions = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "-id";
  try {
    const URL = `/effective-permissions/my_permissions/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const permissionResponse = response.data;
      const permissionList = await mapEffectivePermissionsListData(permissionResponse);
      return { results: permissionList, count: permissionResponse.length };
    } else return { results: [], count: 0 };
  } catch (error) {
    console.error("Error fetching roles data:", error);
    return { results: [], count: 0 };
  }
};

export {
  deleteRole,
  saveAssignedRole,
  deleteAssignedRole,
  saveRolePermissions,
  getRolePermissions,
};
