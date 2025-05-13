import axios from "axios";
import { toast } from "react-toastify";
import { getRolesList, saveRole, deleteRole } from "./general";

// Get permissions schema
export const getPermissionsSchema = async () => {
  try {
    // Using a simplified but comprehensive permissions schema based on the actual modules
    const permissionsSchema = [
      {
        name: "Dashboard",
        subModules: []
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
                supportedPermissions: ["View"]
              },
              {
                key: "MY_PROFILE.EDIT_PERSONAL_INFORMATION",
                name: "Edit Personal Information",
                supportedPermissions: ["Edit"]
              },
              {
                key: "MY_PROFILE.VIEW_JOB_INFORMATION",
                name: "View Job Information",
                supportedPermissions: ["View"]
              }
            ]
          },
          {
            name: "My Attendance",
            features: [
              {
                key: "MY_ATTENDANCE.MARK_ATTENDANCE",
                name: "Mark My Attendance",
                supportedPermissions: ["Add"]
              },
              {
                key: "MY_ATTENDANCE.VIEW_ATTENDANCE",
                name: "View Attendance Records",
                supportedPermissions: ["View"]
              }
            ]
          }
        ]
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
                supportedPermissions: ["Add"]
              },
              {
                key: "PROFILE_MANAGEMENT.VIEW_EMPLOYEES",
                name: "View Employees",
                supportedPermissions: ["View"]
              },
              {
                key: "PROFILE_MANAGEMENT.EDIT_EMPLOYEE",
                name: "Edit Employee",
                supportedPermissions: ["Edit"]
              }
            ]
          },
          {
            name: "HR Documents",
            features: [
              {
                key: "HR_DOCUMENTS.UPLOAD_HR_DOCUMENT",
                name: "Upload HR Document",
                supportedPermissions: ["Add"]
              },
              {
                key: "HR_DOCUMENTS.VIEW_HR_DOCUMENT",
                name: "View HR Document",
                supportedPermissions: ["View"]
              },
              {
                key: "HR_DOCUMENTS.ASSIGN_HR_DOCUMENT",
                name: "Assign HR Document",
                supportedPermissions: ["Add", "Edit"]
              }
            ]
          }
        ]
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
                supportedPermissions: ["Add"]
              },
              {
                key: "DEPARTMENTS.VIEW_DEPARTMENTS",
                name: "View Departments",
                supportedPermissions: ["View"]
              },
              {
                key: "DEPARTMENTS.EDIT_DEPARTMENTS",
                name: "Edit Departments",
                supportedPermissions: ["Edit"]
              },
              {
                key: "DEPARTMENTS.DELETE_DEPARTMENTS",
                name: "Delete Departments",
                supportedPermissions: ["Delete"]
              }
            ]
          },
          {
            name: "Roles & Permissions",
            features: [
              {
                key: "ROLES.ADD_ROLE",
                name: "Add Role",
                supportedPermissions: ["Add"]
              },
              {
                key: "ROLES.VIEW_ROLES",
                name: "View Roles",
                supportedPermissions: ["View"]
              },
              {
                key: "ROLES.EDIT_ROLES",
                name: "Edit Roles",
                supportedPermissions: ["Edit"]
              },
              {
                key: "ROLES.DELETE_ROLES",
                name: "Delete Roles",
                supportedPermissions: ["Delete"]
              }
            ]
          }
        ]
      }
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
    // Call the getRolesList with a filter for the role name
    const response = await getRolesList({
      filterData: { name: name },
    });
    
    // If any results are returned with the same name, it's not unique
    return response.results.length === 0;
  } catch (error) {
    console.error("Failed to check role name uniqueness:", error);
    throw error;
  }
};

// Re-export functions from general.js
export { getRolesList, saveRole, deleteRole };
