import axios from "axios";
import { toast } from "react-toastify";
import { getRolesList, saveRole, deleteRole } from "./general";

// Get permissions schema
export const getPermissionsSchema = async () => {
  try {
    // Mock permissions schema data instead of API call
    const mockPermissionsSchema = [
      {
        name: "Employees",
        features: [
          {
            key: "employees.view",
            name: "View Employees",
            supportedPermissions: ["View"]
          },
        ],
        subModules: [
          {
            name: "Management",
            features: [
              {
                key: "employees.management.view",
                name: "View Employee Details",
                supportedPermissions: ["View", "Add", "Edit", "Delete"]
              },
              {
                key: "employees.management.create",
                name: "Create Employee",
                supportedPermissions: ["View", "Add"]
              }
            ]
          },
          {
            name: "Team",
            features: [
              {
                key: "employees.team.view",
                name: "View Team Members",
                supportedPermissions: ["View"]
              }
            ]
          }
        ]
      },
      {
        name: "Attendance",
        features: [
          {
            key: "attendance.view",
            name: "View Attendance Dashboard",
            supportedPermissions: ["View"]
          }
        ],
        subModules: [
          {
            name: "Management",
            features: [
              {
                key: "attendance.management.view",
                name: "View Attendance Reports",
                supportedPermissions: ["View", "Add", "Edit"]
              }
            ]
          },
          {
            name: "Self",
            features: [
              {
                key: "attendance.self.view",
                name: "View Own Attendance",
                supportedPermissions: ["View"]
              }
            ]
          },
          {
            name: "Team",
            features: [
              {
                key: "attendance.team.view",
                name: "View Team Attendance",
                supportedPermissions: ["View", "Approve"]
              }
            ]
          }
        ]
      },
      {
        name: "Leaves",
        features: [
          {
            key: "leaves.view",
            name: "View Leave Dashboard",
            supportedPermissions: ["View"]
          }
        ],
        subModules: [
          {
            name: "Management",
            features: [
              {
                key: "leaves.management.view",
                name: "Manage Leaves",
                supportedPermissions: ["View", "Add", "Edit", "Approve"]
              }
            ]
          },
          {
            name: "Self",
            features: [
              {
                key: "leaves.self.create",
                name: "Apply for Leave",
                supportedPermissions: ["View", "Add"]
              }
            ]
          },
          {
            name: "Team",
            features: [
              {
                key: "leaves.team.approve",
                name: "Approve Team Leaves",
                supportedPermissions: ["View", "Approve"]
              }
            ]
          }
        ]
      },
      {
        name: "Tasks",
        features: [
          {
            key: "tasks.view",
            name: "View Tasks Dashboard",
            supportedPermissions: ["View"]
          }
        ],
        subModules: [
          {
            name: "Team",
            features: [
              {
                key: "tasks.team.create",
                name: "Manage Team Tasks",
                supportedPermissions: ["View", "Add", "Edit", "Delete"]
              }
            ]
          }
        ]
      },
      {
        name: "Roles",
        subModules: [
          {
            name: "Management",
            features: [
              {
                key: "roles.management.view",
                name: "Manage Roles",
                supportedPermissions: ["View", "Add", "Edit", "Delete"]
              }
            ]
          }
        ]
      },
      {
        name: "Departments",
        subModules: [
          {
            name: "Management",
            features: [
              {
                key: "departments.management.view",
                name: "Manage Departments",
                supportedPermissions: ["View", "Add", "Edit", "Delete"]
              }
            ]
          }
        ]
      },
      {
        name: "Profile",
        subModules: [
          {
            name: "Management",
            features: [
              {
                key: "profile.management.view",
                name: "View Profile",
                supportedPermissions: ["View"]
              }
            ]
          }
        ]
      }
    ];

    return mockPermissionsSchema;
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
