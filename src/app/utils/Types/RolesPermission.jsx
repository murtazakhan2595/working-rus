export const Module = {
  id: null,
  name: null,
  code_name: null,
  order: null,
  submodules: null,
};

export const UserRole = {
  name: null,
  description: null,
  status: "inactive",
  id: null,
  is_default: false,
  role_permission_id: null,
};
export const UserRolePermissions = {
  role: null,
  feature_ids: [],
  id: null,
};
export const RoleAssignmentHistoryLogs = {
  action: null,
  branch: null,
  feature_ids: null,
  permission_changed: null,
  employee_id: null,
  employee_name: null,
  performed_by: null,
  role: null,
  timestamp: null,
};

export const AssignedRole = {
  id: null,
  employeeId: null,
  employee: {
    id: null,
    name: "",
    employeeId: "",
    department: "",
    branch: "",
    email: "",
    phone: "",
  },
  roles: [],
  created_at: null,
  updated_at: null,
  created_by: null,
  updated_by: null,
};
