export const Module = {
  id: null,
  name: null,
  code_name: null,
  order: null,
  submodules: null,
};

export const UserRole={
    name:null,
    description	:null,
    status:'inactive',
    id:null,
}

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
