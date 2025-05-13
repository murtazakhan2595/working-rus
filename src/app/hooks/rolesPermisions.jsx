import axios from "axios";
import { toast } from "react-toastify";
import { saveRole, deleteRole } from "./general";
import { initialState } from "state/slices/UserSlice";
import {
  mapModuleListData,
  mapUserRoleListData,
} from "app/utils/MappingObjects/mapRolesPermissionData";

const baseUrl = initialState.baseUrl;
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});
// Get permissions schema
export const getPermissionsSchema = async () => {
  try {
    // Using a simplified but comprehensive permissions schema based on the actual modules
    const permissionsSchema = [
      {
        name: "Dashboard",
        subModules: [],
      },
      {
        name: "Self Service Hub",
        subModules: [
          {
            name: "My Profile",
            features: [
              {
                key: "MY_PROFILE.VIEW_PERSONAL_INFORMATION",
                name: "View Personal Information",
                supportedPermissions: ["View"],
              },
              {
                key: "MY_PROFILE.EDIT_PERSONAL_INFORMATION",
                name: "Edit Personal Information",
                supportedPermissions: ["Edit"],
              },
              {
                key: "MY_PROFILE.VIEW_JOB_INFORMATION",
                name: "View Job Information",
                supportedPermissions: ["View"],
              },
            ],
          },
          {
            name: "My Attendance",
            features: [
              {
                key: "MY_ATTENDANCE.MARK_ATTENDANCE",
                name: "Mark My Attendance",
                supportedPermissions: ["Add"],
              },
              {
                key: "MY_ATTENDANCE.VIEW_ATTENDANCE",
                name: "View Attendance Records",
                supportedPermissions: ["View"],
              },
            ],
          },
        ],
      },
      {
        name: "People Team",
        subModules: [
          {
            name: "Profile Management",
            features: [
              {
                key: "PROFILE_MANAGEMENT.ADD_EMPLOYEE",
                name: "Add Employee",
                supportedPermissions: ["Add"],
              },
              {
                key: "PROFILE_MANAGEMENT.VIEW_EMPLOYEES",
                name: "View Employees",
                supportedPermissions: ["View"],
              },
              {
                key: "PROFILE_MANAGEMENT.EDIT_EMPLOYEE",
                name: "Edit Employee",
                supportedPermissions: ["Edit"],
              },
            ],
          },
          {
            name: "HR Documents",
            features: [
              {
                key: "HR_DOCUMENTS.UPLOAD_HR_DOCUMENT",
                name: "Upload HR Document",
                supportedPermissions: ["Add"],
              },
              {
                key: "HR_DOCUMENTS.VIEW_HR_DOCUMENT",
                name: "View HR Document",
                supportedPermissions: ["View"],
              },
              {
                key: "HR_DOCUMENTS.ASSIGN_HR_DOCUMENT",
                name: "Assign HR Document",
                supportedPermissions: ["Add", "Edit"],
              },
            ],
          },
        ],
      },
      {
        name: "Organizational Setup",
        subModules: [
          {
            name: "Departments",
            features: [
              {
                key: "DEPARTMENTS.ADD_DEPARTMENTS",
                name: "Add Departments",
                supportedPermissions: ["Add"],
              },
              {
                key: "DEPARTMENTS.VIEW_DEPARTMENTS",
                name: "View Departments",
                supportedPermissions: ["View"],
              },
              {
                key: "DEPARTMENTS.EDIT_DEPARTMENTS",
                name: "Edit Departments",
                supportedPermissions: ["Edit"],
              },
              {
                key: "DEPARTMENTS.DELETE_DEPARTMENTS",
                name: "Delete Departments",
                supportedPermissions: ["Delete"],
              },
            ],
          },
          {
            name: "Roles & Permissions",
            features: [
              {
                key: "ROLES.ADD_ROLE",
                name: "Add Role",
                supportedPermissions: ["Add"],
              },
              {
                key: "ROLES.VIEW_ROLES",
                name: "View Roles",
                supportedPermissions: ["View"],
              },
              {
                key: "ROLES.EDIT_ROLES",
                name: "Edit Roles",
                supportedPermissions: ["Edit"],
              },
              {
                key: "ROLES.DELETE_ROLES",
                name: "Delete Roles",
                supportedPermissions: ["Delete"],
              },
            ],
          },
        ],
      },
    ];

    return permissionsSchema;
  } catch (error) {
    console.error("Failed to fetch permissions schema:", error);
    throw error;
  }
};

// Check if role name is unique
export const checkRoleNameUniqueness = async (name) => {
  try {
    // Call the getUserRoleList with a filter for the role name
    const response = await getUserRoleList({
      filterData: { name: name },
    });

    // If any results are returned with the same name, it's not unique
    return response.results.length === 0;
  } catch (error) {
    console.error("Failed to check role name uniqueness:", error);
    throw error;
  }
};
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

// Re-export functions from general.js
export { saveRole, deleteRole };
