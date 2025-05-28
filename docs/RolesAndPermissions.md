# HRMS Roles and Permissions Implementation Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Permission Structure](#permission-structure)
3. [Implementation Guide](#implementation-guide)
4. [Module-Specific Examples](#module-specific-examples)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)
7. [Route and Permission Mapping](#route-and-permission-mapping)

## Introduction

This guide explains how to implement role-based access control (RBAC) in the HRMS application. The system uses a permission-based approach where each user's actions are controlled by specific permissions assigned to their role.

### Key Concepts

- **Permissions**: Individual access rights (e.g., VIEW_EMPLOYEE)
- **Roles**: Collections of permissions (e.g., HR Manager)
- **Access Control**: Mechanism to restrict/allow features based on permissions

## Permission Structure

### Permission Naming Convention

```javascript
const PERMISSION_KEYS = {
  // Employee Module
  EMPLOYEE: {
    // Personal Information
    PERSONAL_INFO: {
      VIEW: 'VIEW_EMPLOYEE_PERSONAL_INFO',
      UPDATE: 'UPDATE_EMPLOYEE_PERSONAL_INFO',
      CREATE: 'CREATE_EMPLOYEE',
      DELETE: 'DELETE_EMPLOYEE'
    },
    // Financial Information
    FINANCIAL: {
      VIEW_SALARY: 'VIEW_EMPLOYEE_SALARY',
      UPDATE_SALARY: 'UPDATE_EMPLOYEE_SALARY',
      VIEW_BANK: 'VIEW_EMPLOYEE_BANK_DETAILS',
      UPDATE_BANK: 'UPDATE_EMPLOYEE_BANK_DETAILS'
    },
    // Documents
    DOCUMENTS: {
      VIEW: 'VIEW_EMPLOYEE_DOCUMENTS',
      UPLOAD: 'UPLOAD_EMPLOYEE_DOCUMENTS',
      DELETE: 'DELETE_EMPLOYEE_DOCUMENTS'
    },
    // Employment
    EMPLOYMENT: {
      VIEW_HISTORY: 'VIEW_EMPLOYMENT_HISTORY',
      UPDATE_STATUS: 'UPDATE_EMPLOYMENT_STATUS',
      MANAGE_POSITION: 'MANAGE_EMPLOYEE_POSITION'
    }
  },

  // Attendance Module
  ATTENDANCE: {
    // Daily Attendance
    DAILY: {
      VIEW: 'VIEW_DAILY_ATTENDANCE',
      MARK: 'MARK_ATTENDANCE',
      UPDATE: 'UPDATE_ATTENDANCE',
      DELETE: 'DELETE_ATTENDANCE'
    },
    // Break Management
    BREAK: {
      VIEW: 'VIEW_BREAK',
      MARK: 'MARK_BREAK',
      UPDATE: 'UPDATE_BREAK'
    },
    // Team Attendance
    TEAM: {
      VIEW: 'VIEW_TEAM_ATTENDANCE',
      MANAGE: 'MANAGE_TEAM_ATTENDANCE',
      EXPORT: 'EXPORT_TEAM_ATTENDANCE'
    },
    // Reports
    REPORTS: {
      VIEW: 'VIEW_ATTENDANCE_REPORTS',
      GENERATE: 'GENERATE_ATTENDANCE_REPORTS',
      EXPORT: 'EXPORT_ATTENDANCE_REPORTS'
    }
  },

  // Leave Module
  LEAVE: {
    // Leave Applications
    APPLICATIONS: {
      VIEW: 'VIEW_LEAVE_APPLICATIONS',
      APPLY: 'APPLY_LEAVE',
      UPDATE: 'UPDATE_LEAVE',
      CANCEL: 'CANCEL_LEAVE'
    },
    // Leave Approval
    APPROVAL: {
      APPROVE: 'APPROVE_LEAVE',
      REJECT: 'REJECT_LEAVE',
      MANAGE: 'MANAGE_LEAVE_REQUESTS'
    },
    // Leave Types
    TYPES: {
      VIEW: 'VIEW_LEAVE_TYPES',
      CREATE: 'CREATE_LEAVE_TYPE',
      UPDATE: 'UPDATE_LEAVE_TYPE',
      DELETE: 'DELETE_LEAVE_TYPE'
    },
    // Team Leave
    TEAM: {
      VIEW: 'VIEW_TEAM_LEAVE',
      MANAGE: 'MANAGE_TEAM_LEAVE',
      REPORT: 'TEAM_LEAVE_REPORT'
    }
  },

  // Payroll Module
  PAYROLL: {
    // Salary Structure
    SALARY: {
      VIEW: 'VIEW_SALARY_STRUCTURE',
      CREATE: 'CREATE_SALARY_STRUCTURE',
      UPDATE: 'UPDATE_SALARY_STRUCTURE',
      DELETE: 'DELETE_SALARY_STRUCTURE'
    },
    // Payroll Processing
    PROCESSING: {
      GENERATE: 'GENERATE_PAYROLL',
      APPROVE: 'APPROVE_PAYROLL',
      PROCESS: 'PROCESS_PAYROLL',
      ROLLBACK: 'ROLLBACK_PAYROLL'
    },
    // Components
    COMPONENTS: {
      MANAGE_EARNINGS: 'MANAGE_PAYROLL_EARNINGS',
      MANAGE_DEDUCTIONS: 'MANAGE_PAYROLL_DEDUCTIONS',
      MANAGE_BENEFITS: 'MANAGE_PAYROLL_BENEFITS'
    },
    // Reports
    REPORTS: {
      VIEW: 'VIEW_PAYROLL_REPORTS',
      GENERATE: 'GENERATE_PAYROLL_REPORTS',
      DOWNLOAD: 'DOWNLOAD_PAYROLL_REPORTS'
    }
  },

  // Claims Module
  CLAIMS: {
    // Expense Claims
    EXPENSE: {
      VIEW: 'VIEW_EXPENSE_CLAIMS',
      CREATE: 'CREATE_EXPENSE_CLAIM',
      UPDATE: 'UPDATE_EXPENSE_CLAIM',
      DELETE: 'DELETE_EXPENSE_CLAIM'
    },
    // Approval
    APPROVAL: {
      APPROVE: 'APPROVE_CLAIMS',
      REJECT: 'REJECT_CLAIMS',
      MANAGE: 'MANAGE_CLAIMS'
    },
    // Types
    TYPES: {
      VIEW: 'VIEW_CLAIM_TYPES',
      CREATE: 'CREATE_CLAIM_TYPE',
      UPDATE: 'UPDATE_CLAIM_TYPE',
      DELETE: 'DELETE_CLAIM_TYPE'
    },
    // Reports
    REPORTS: {
      VIEW: 'VIEW_CLAIMS_REPORTS',
      GENERATE: 'GENERATE_CLAIMS_REPORTS',
      EXPORT: 'EXPORT_CLAIMS_REPORTS'
    }
  },

  // Task Management
  TASKS: {
    // Task Items
    ITEMS: {
      VIEW: 'VIEW_TASKS',
      CREATE: 'CREATE_TASK',
      UPDATE: 'UPDATE_TASK',
      DELETE: 'DELETE_TASK'
    },
    // Assignment
    ASSIGNMENT: {
      ASSIGN: 'ASSIGN_TASK',
      TRANSFER: 'TRANSFER_TASK',
      MANAGE: 'MANAGE_TASK_ASSIGNMENTS'
    },
    // Categories
    CATEGORIES: {
      VIEW: 'VIEW_TASK_CATEGORIES',
      CREATE: 'CREATE_TASK_CATEGORY',
      UPDATE: 'UPDATE_TASK_CATEGORY',
      DELETE: 'DELETE_TASK_CATEGORY'
    },
    // Reports
    REPORTS: {
      VIEW: 'VIEW_TASK_REPORTS',
      GENERATE: 'GENERATE_TASK_REPORTS',
      EXPORT: 'EXPORT_TASK_REPORTS'
    }
  },

  // Asset Management
  ASSETS: {
    // Asset Items
    ITEMS: {
      VIEW: 'VIEW_ASSETS',
      CREATE: 'CREATE_ASSET',
      UPDATE: 'UPDATE_ASSET',
      DELETE: 'DELETE_ASSET'
    },
    // Assignment
    ASSIGNMENT: {
      ASSIGN: 'ASSIGN_ASSET',
      REVOKE: 'REVOKE_ASSET',
      MANAGE: 'MANAGE_ASSET_ASSIGNMENTS'
    },
    // Categories
    CATEGORIES: {
      VIEW: 'VIEW_ASSET_CATEGORIES',
      CREATE: 'CREATE_ASSET_CATEGORY',
      UPDATE: 'UPDATE_ASSET_CATEGORY',
      DELETE: 'DELETE_ASSET_CATEGORY'
    },
    // Maintenance
    MAINTENANCE: {
      SCHEDULE: 'SCHEDULE_MAINTENANCE',
      UPDATE: 'UPDATE_MAINTENANCE',
      TRACK: 'TRACK_MAINTENANCE'
    }
  },

  // Exit Management
  EXIT: {
    // Exit Process
    PROCESS: {
      VIEW: 'VIEW_EXIT_PROCESS',
      INITIATE: 'INITIATE_EXIT',
      UPDATE: 'UPDATE_EXIT_PROCESS',
      CANCEL: 'CANCEL_EXIT_PROCESS'
    },
    // Approval
    APPROVAL: {
      APPROVE: 'APPROVE_EXIT',
      REJECT: 'REJECT_EXIT',
      MANAGE: 'MANAGE_EXIT_REQUESTS'
    },
    // Checklist
    CHECKLIST: {
      VIEW: 'VIEW_EXIT_CHECKLIST',
      CREATE: 'CREATE_EXIT_CHECKLIST',
      UPDATE: 'UPDATE_EXIT_CHECKLIST',
      DELETE: 'DELETE_EXIT_CHECKLIST'
    },
    // Reports
    REPORTS: {
      VIEW: 'VIEW_EXIT_REPORTS',
      GENERATE: 'GENERATE_EXIT_REPORTS',
      EXPORT: 'EXPORT_EXIT_REPORTS'
    }
  },

  // Settings
  SETTINGS: {
    // Organization
    ORGANIZATION: {
      VIEW: 'VIEW_ORG_SETTINGS',
      UPDATE: 'UPDATE_ORG_SETTINGS',
      MANAGE_STRUCTURE: 'MANAGE_ORG_STRUCTURE'
    },
    // Departments
    DEPARTMENTS: {
      VIEW: 'VIEW_DEPARTMENTS',
      CREATE: 'CREATE_DEPARTMENT',
      UPDATE: 'UPDATE_DEPARTMENT',
      DELETE: 'DELETE_DEPARTMENT'
    },
    // Roles
    ROLES: {
      VIEW: 'VIEW_ROLES',
      CREATE: 'CREATE_ROLE',
      UPDATE: 'UPDATE_ROLE',
      DELETE: 'DELETE_ROLE',
      ASSIGN: 'ASSIGN_ROLE'
    },
    // System
    SYSTEM: {
      VIEW: 'VIEW_SYSTEM_SETTINGS',
      UPDATE: 'UPDATE_SYSTEM_SETTINGS',
      MANAGE_BACKUP: 'MANAGE_SYSTEM_BACKUP',
      VIEW_LOGS: 'VIEW_SYSTEM_LOGS'
    }
  }
};
```

## Implementation Guide

### 1. Permission Check Utility

```javascript
// utils/PermissionUtils.js

export function HasAccess(permissionKey) {
  const permissions = useSelector((state) => state.user.permissions);
  return permissions?.includes(permissionKey);
}

export function HasMultipleAccess(permissionKeys = []) {
  return permissionKeys.every(key => HasAccess(key));
}

export function HasAnyAccess(permissionKeys = []) {
  return permissionKeys.some(key => HasAccess(key));
}
```

### 2. Protected Components

```javascript
// components/ProtectedComponent.jsx

const ProtectedComponent = ({ 
  permissionRequired, 
  fallback = null,
  children 
}) => {
  const hasPermission = HasAccess(permissionRequired);

  if (!hasPermission) {
    return fallback || (
      <UnauthorizedAccess
        title="Access Denied"
        featureName={permissionRequired}
      />
    );
  }

  return children;
};
```

### 3. API Integration

```javascript
// hooks/usePermissionedAPI.js

export const usePermissionedAPI = (permissionKey) => {
  const hasPermission = HasAccess(permissionKey);

  const makeRequest = async (apiCall) => {
    if (!hasPermission) {
      throw new Error('Permission denied');
    }

    try {
      return await apiCall();
    } catch (error) {
      handleAPIError(error);
      throw error;
    }
  };

  return { makeRequest, hasPermission };
};
```

## Module-Specific Examples

### 1. Employee Module Implementation

```javascript
// modules/Employee/EmployeeManagement.jsx

const EmployeeManagement = () => {
  // Permission checks
  const canViewEmployees = HasAccess('VIEW_EMPLOYEE');
  const canCreateEmployee = HasAccess('CREATE_EMPLOYEE');
  const canUpdateEmployee = HasAccess('UPDATE_EMPLOYEE');
  const canViewSalary = HasAccess('VIEW_EMPLOYEE_SALARY');

  // API hooks with permissions
  const { makeRequest } = usePermissionedAPI('VIEW_EMPLOYEE');

  const fetchEmployees = async () => {
    return await makeRequest(() => 
      axios.get('/api/employees')
    );
  };

  return (
    <ProtectedComponent permissionRequired="VIEW_EMPLOYEE">
      <div className="employee-management">
        {/* Create Employee Button */}
        {canCreateEmployee && (
          <Button onClick={handleCreateEmployee}>
            Add New Employee
          </Button>
        )}

        {/* Employee List */}
        <EmployeeList 
          canUpdate={canUpdateEmployee}
          canViewSalary={canViewSalary}
        />
      </div>
    </ProtectedComponent>
  );
};
```

### 2. Attendance Module Implementation

```javascript
// modules/Attendance/AttendanceManagement.jsx

const AttendanceManagement = () => {
  // Permission checks
  const canViewAttendance = HasAccess('VIEW_ATTENDANCE');
  const canMarkAttendance = HasAccess('MARK_ATTENDANCE');
  const canMarkBreak = HasAccess('MARK_BREAK');
  const canExport = HasAccess('EXPORT_ATTENDANCE');

  // Combined permission checks
  const canManageAttendance = HasMultipleAccess([
    'VIEW_ATTENDANCE',
    'MARK_ATTENDANCE'
  ]);

  return (
    <ProtectedComponent permissionRequired="VIEW_ATTENDANCE">
      <div className="attendance-management">
        {/* Attendance Marking Section */}
        {canMarkAttendance && (
          <AttendanceMarking 
            canMarkBreak={canMarkBreak}
          />
        )}

        {/* Attendance List */}
        <AttendanceList 
          canExport={canExport}
        />
      </div>
    </ProtectedComponent>
  );
};
```

### 3. Leave Module Implementation

```javascript
// modules/Leave/LeaveManagement.jsx

const LeaveManagement = () => {
  const canViewLeave = HasAccess('VIEW_LEAVE');
  const canApplyLeave = HasAccess('APPLY_LEAVE');
  const canApproveLeave = HasAccess('APPROVE_LEAVE');
  const canRejectLeave = HasAccess('REJECT_LEAVE');

  const handleLeaveAction = async (action, leaveId) => {
    const permissionMap = {
      approve: 'APPROVE_LEAVE',
      reject: 'REJECT_LEAVE'
    };

    if (!HasAccess(permissionMap[action])) {
      toast.error('Permission denied');
      return;
    }

    // Perform leave action
  };

  return (
    <ProtectedComponent permissionRequired="VIEW_LEAVE">
      <div className="leave-management">
        {canApplyLeave && (
          <LeaveApplicationForm />
        )}

        <LeaveList 
          canApprove={canApproveLeave}
          canReject={canRejectLeave}
          onAction={handleLeaveAction}
        />
      </div>
    </ProtectedComponent>
  );
};
```

### 4. Payroll Module Implementation

```javascript
// modules/Payroll/PayrollManagement.jsx

const PayrollManagement = () => {
  const canViewPayroll = HasAccess('VIEW_PAYROLL');
  const canGeneratePayroll = HasAccess('GENERATE_PAYROLL');
  const canApprovePayroll = HasAccess('APPROVE_PAYROLL');
  const canDownloadPayroll = HasAccess('DOWNLOAD_PAYROLL');

  // API integration with permissions
  const { makeRequest } = usePermissionedAPI('GENERATE_PAYROLL');

  const generatePayroll = async () => {
    return await makeRequest(() => 
      axios.post('/api/payroll/generate')
    );
  };

  return (
    <ProtectedComponent permissionRequired="VIEW_PAYROLL">
      <div className="payroll-management">
        <PayrollActions 
          canGenerate={canGeneratePayroll}
          canApprove={canApprovePayroll}
          onGenerate={generatePayroll}
        />

        <PayrollList 
          canDownload={canDownloadPayroll}
        />
      </div>
    </ProtectedComponent>
  );
};
```

## Best Practices

### 1. Permission Checking

```javascript
// DO: Check permissions before performing actions
const handleDelete = () => {
  if (!HasAccess('DELETE_EMPLOYEE')) {
    toast.error('Permission denied');
    return;
  }
  // Proceed with deletion
};

// DON'T: Assume permissions are checked elsewhere
const handleDelete = () => {
  deleteEmployee(); // Might fail if user lacks permission
};
```

### 2. Error Handling

```javascript
// Good error handling practice
try {
  if (!HasAccess(requiredPermission)) {
    throw new Error('Permission denied');
  }
  // Proceed with operation
} catch (error) {
  toast.error(error.message);
  // Log error for monitoring
  console.error('Permission error:', error);
}
```

### 3. Component Organization

```javascript
// Good: Separate permission logic
const EmployeeActions = ({ employee }) => {
  const canEdit = HasAccess('UPDATE_EMPLOYEE');
  const canDelete = HasAccess('DELETE_EMPLOYEE');

  return (
    <div className="employee-actions">
      {canEdit && <EditButton employee={employee} />}
      {canDelete && <DeleteButton employee={employee} />}
    </div>
  );
};
```

### 4. Permission Groups

```javascript
// Define permission groups for common combinations
const PERMISSION_GROUPS = {
  EMPLOYEE_MANAGER: [
    'VIEW_EMPLOYEE',
    'CREATE_EMPLOYEE',
    'UPDATE_EMPLOYEE'
  ],
  ATTENDANCE_MANAGER: [
    'VIEW_ATTENDANCE',
    'MARK_ATTENDANCE',
    'APPROVE_ATTENDANCE'
  ]
};

// Check for permission groups
const isEmployeeManager = HasMultipleAccess(PERMISSION_GROUPS.EMPLOYEE_MANAGER);
```

## Troubleshooting

### Common Issues and Solutions

1. **Permission Not Recognized**
   ```javascript
   // Check if permission is properly loaded in Redux store
   console.log(useSelector(state => state.user.permissions));
   ```

2. **Multiple Permission Checks**
   ```javascript
   // Use HasMultipleAccess instead of multiple HasAccess calls
   const hasAllPermissions = HasMultipleAccess([
     'VIEW_EMPLOYEE',
     'UPDATE_EMPLOYEE'
   ]);
   ```

3. **Permission Loading Delays**
   ```javascript
   // Handle loading state
   const [isLoading, setIsLoading] = useState(true);
   const permissions = useSelector(state => state.user.permissions);

   useEffect(() => {
     if (permissions) {
       setIsLoading(false);
     }
   }, [permissions]);
   ```

### Debugging Tips

1. Add permission debugging utility:
```javascript
export const debugPermissions = (requiredPermissions) => {
  const userPermissions = useSelector(state => state.user.permissions);
  console.table({
    required: requiredPermissions,
    has: userPermissions,
    missing: requiredPermissions.filter(p => !userPermissions.includes(p))
  });
};
```

2. Use React Developer Tools to inspect permission states

3. Implement permission logging:
```javascript
export const logPermissionDenial = (permission, context) => {
  console.warn(`Permission denied: ${permission} in ${context}`);
};
```

## API Reference

### Permission Check Functions

```javascript
HasAccess(permissionKey: string): boolean
HasMultipleAccess(permissionKeys: string[]): boolean
HasAnyAccess(permissionKeys: string[]): boolean
```

### Protected Components

```javascript
ProtectedComponent
ProtectedRoute
ProtectedButton
```

### Permission Hooks

```javascript
usePermissionedAPI
usePermissions
usePermissionGroup
```

## Testing

### Unit Testing Permissions

```javascript
describe('Permission Checks', () => {
  it('should check single permission correctly', () => {
    const mockPermissions = ['VIEW_EMPLOYEE'];
    const result = HasAccess('VIEW_EMPLOYEE');
    expect(result).toBe(true);
  });

  it('should check multiple permissions correctly', () => {
    const mockPermissions = ['VIEW_EMPLOYEE', 'UPDATE_EMPLOYEE'];
    const result = HasMultipleAccess(mockPermissions);
    expect(result).toBe(true);
  });
});
```

### Integration Testing

```javascript
describe('Protected Components', () => {
  it('should render component when user has permission', () => {
    render(
      <ProtectedComponent permissionRequired="VIEW_EMPLOYEE">
        <div>Protected Content</div>
      </ProtectedComponent>
    );
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should show unauthorized when permission is missing', () => {
    render(
      <ProtectedComponent permissionRequired="ADMIN_ACCESS">
        <div>Protected Content</div>
      </ProtectedComponent>
    );
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
  });
});
```

## Route and Permission Mapping

### Module Routes and Required Permissions

```javascript
const ROUTE_PERMISSIONS = {
  // Dashboard Module
  DASHBOARD: {
    path: '/',
    permissions: ['VIEW_DASHBOARD']
  },

  // Employee Module Routes
  EMPLOYEE: {
    // Profile Management
    PROFILE: {
      VIEW: {
        path: '/profile-management',
        permissions: ['VIEW_EMPLOYEE']
      },
      CREATE: {
        path: '/create-employee',
        permissions: ['CREATE_EMPLOYEE']
      },
      EDIT: {
        path: '/edit-employee/:id',
        permissions: ['UPDATE_EMPLOYEE']
      },
      VIEW_DETAILS: {
        path: '/user/:id',
        permissions: ['VIEW_EMPLOYEE']
      }
    },
    // Documents
    DOCUMENTS: {
      VIEW: {
        path: '/documents',
        permissions: ['VIEW_EMPLOYEE_DOCUMENTS']
      },
      DETAILS: {
        path: '/documents/detail',
        permissions: ['VIEW_EMPLOYEE_DOCUMENTS']
      }
    }
  },

  // Attendance Module Routes
  ATTENDANCE: {
    // My Attendance
    MY_ATTENDANCE: {
      path: '/my-attendance',
      permissions: ['VIEW_ATTENDANCE', 'MARK_ATTENDANCE']
    },
    // Employee Attendance
    EMPLOYEE_ATTENDANCE: {
      path: '/employee-attendance',
      permissions: ['VIEW_TEAM_ATTENDANCE', 'MANAGE_TEAM_ATTENDANCE']
    },
    // Shift Calendar
    SHIFT: {
      MY_CALENDAR: {
        path: '/my-shift-calendar',
        permissions: ['VIEW_SHIFT_CALENDAR']
      },
      TEAM_CALENDAR: {
        path: '/shift-calendar',
        permissions: ['VIEW_TEAM_SHIFT_CALENDAR', 'MANAGE_SHIFTS']
      }
    }
  },

  // Leave Module Routes
  LEAVE: {
    // My Leave
    MY_LEAVE: {
      path: '/my-leave-tracker',
      permissions: ['VIEW_LEAVE', 'APPLY_LEAVE']
    },
    // Team Leave
    TEAM_LEAVE: {
      path: '/team-leave-request',
      permissions: ['VIEW_TEAM_LEAVE', 'APPROVE_LEAVE', 'REJECT_LEAVE']
    }
  },

  // Payroll Module Routes
  PAYROLL: {
    // My Payroll
    MY_PAYROLL: {
      path: '/my-payroll',
      permissions: ['VIEW_PAYROLL']
    },
    // Salary Setup
    SALARY: {
      path: '/salary-setup',
      permissions: ['VIEW_SALARY_STRUCTURE', 'UPDATE_SALARY_STRUCTURE']
    },
    // Payrun
    PAYRUN: {
      LIST: {
        path: '/payrun',
        permissions: ['VIEW_PAYROLL', 'GENERATE_PAYROLL']
      },
      CREATE: {
        path: '/payrun/create',
        permissions: ['GENERATE_PAYROLL']
      },
      DETAILS: {
        path: '/payrun/:id',
        permissions: ['VIEW_PAYROLL', 'PROCESS_PAYROLL']
      }
    }
  },

  // Claims Module Routes
  CLAIMS: {
    // My Claims
    MY_CLAIMS: {
      path: '/my-claims',
      permissions: ['VIEW_CLAIMS', 'CREATE_CLAIMS']
    },
    // Team Claims
    TEAM_CLAIMS: {
      path: '/claims',
      permissions: ['VIEW_TEAM_CLAIMS', 'APPROVE_CLAIMS', 'REJECT_CLAIMS']
    }
  },

  // Task Management Routes
  TASKS: {
    // Projects
    PROJECTS: {
      LIST: {
        path: '/projects',
        permissions: ['VIEW_TASKS']
      },
      BOARD: {
        path: '/project-board/:projectId',
        permissions: ['VIEW_TASKS', 'UPDATE_TASKS']
      },
      TASK: {
        path: '/project-board/card/:taskId',
        permissions: ['VIEW_TASKS', 'UPDATE_TASKS']
      }
    }
  },

  // Asset Management Routes
  ASSETS: {
    // My Assets
    MY_ASSETS: {
      path: '/my-assets',
      permissions: ['VIEW_ASSETS']
    },
    // Team Assets
    TEAM_ASSETS: {
      path: '/assets',
      permissions: ['VIEW_TEAM_ASSETS', 'MANAGE_ASSET_ASSIGNMENTS']
    }
  },

  // Exit Management Routes
  EXIT: {
    // Self Exit
    SELF_EXIT: {
      path: '/exit-employee',
      permissions: ['VIEW_EXIT', 'INITIATE_EXIT']
    },
    // Team Exit
    TEAM_EXIT: {
      path: '/team-exit-clearance',
      permissions: ['VIEW_TEAM_EXIT', 'APPROVE_EXIT', 'REJECT_EXIT']
    }
  },

  // Settings Routes
  SETTINGS: {
    // Organization
    ORGANIZATION: {
      path: '/organization-settings',
      permissions: ['VIEW_ORG_SETTINGS', 'UPDATE_ORG_SETTINGS']
    },
    // Roles
    ROLES: {
      path: '/roles',
      permissions: ['VIEW_ROLES', 'MANAGE_ROLE_PERMISSIONS']
    },
    // System
    SYSTEM: {
      path: '/system-settings',
      permissions: ['VIEW_SYSTEM_SETTINGS', 'UPDATE_SYSTEM_SETTINGS']
    }
  }
};
```

### Route Protection Implementation

To protect routes based on permissions:

```javascript
// components/ProtectedRoute.jsx

const ProtectedRoute = ({ path, permissions, children }) => {
  const hasAccess = usePermissionCheck(permissions);
  
  if (!hasAccess) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};

// Usage in Router
<Router>
  <Routes>
    {Object.entries(ROUTE_PERMISSIONS).map(([module, moduleRoutes]) => 
      Object.entries(moduleRoutes).map(([key, route]) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <ProtectedRoute permissions={route.permissions}>
              {route.component}
            </ProtectedRoute>
          }
        />
      ))
    )}
  </Routes>
</Router>
```

### Permission Check Hook

```javascript
// hooks/usePermissionCheck.js

const usePermissionCheck = (requiredPermissions) => {
  const userPermissions = useSelector(state => state.auth.permissions);
  
  return Array.isArray(requiredPermissions)
    ? requiredPermissions.every(permission => userPermissions.includes(permission))
    : userPermissions.includes(requiredPermissions);
};
```

## Additional Implementation Guidelines

### 1. API Middleware Implementation

```javascript
// middleware/permissionMiddleware.js

export const createPermissionMiddleware = (axiosInstance) => {
  axiosInstance.interceptors.request.use((config) => {
    // Add permissions to headers
    const userPermissions = store.getState().auth.permissions;
    config.headers['X-User-Permissions'] = JSON.stringify(userPermissions);
    return config;
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 403) {
        // Handle permission denied
        toast.error('Permission denied for this action');
        // Log for monitoring
        console.error('Permission denied:', {
          url: error.config.url,
          method: error.config.method
        });
      }
      return Promise.reject(error);
    }
  );
};
```

### 2. Component-Level Permission Implementation

```javascript
// components/PermissionWrapper.jsx

export const PermissionWrapper = ({ 
  permissions, 
  children, 
  fallback = null,
  showError = false 
}) => {
  const hasPermission = usePermissionCheck(permissions);
  
  if (!hasPermission) {
    if (showError) {
      return (
        <div className="permission-denied">
          <Icon name="lock" />
          <p>You don't have permission to view this content</p>
        </div>
      );
    }
    return fallback;
  }
  
  return children;
};

// Usage Example
const EmployeeActions = ({ employeeId }) => {
  return (
    <div className="employee-actions">
      <PermissionWrapper permissions="VIEW_EMPLOYEE_SALARY">
        <ViewSalaryButton employeeId={employeeId} />
      </PermissionWrapper>
      
      <PermissionWrapper 
        permissions={['UPDATE_EMPLOYEE', 'MANAGE_EMPLOYEE_POSITION']}
        showError
      >
        <UpdatePositionButton employeeId={employeeId} />
      </PermissionWrapper>
    </div>
  );
};
```

### 3. Redux Integration

```javascript
// state/slices/permissionSlice.js

const permissionSlice = createSlice({
  name: 'permissions',
  initialState: {
    userPermissions: [],
    rolePermissions: {},
    isLoading: false,
    error: null
  },
  reducers: {
    setPermissions: (state, action) => {
      state.userPermissions = action.payload;
    },
    setRolePermissions: (state, action) => {
      state.rolePermissions = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPermissions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserPermissions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userPermissions = action.payload;
      })
      .addCase(fetchUserPermissions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  }
});
```

### 4. Permission-Based Feature Flags

```javascript
// utils/featureFlags.js

export const FEATURE_FLAGS = {
  PAYROLL_PROCESSING: {
    enabled: true,
    requiredPermissions: ['PROCESS_PAYROLL', 'VIEW_PAYROLL']
  },
  BULK_EMPLOYEE_UPDATE: {
    enabled: true,
    requiredPermissions: ['UPDATE_EMPLOYEE', 'BULK_OPERATIONS']
  },
  ADVANCED_REPORTS: {
    enabled: true,
    requiredPermissions: ['VIEW_REPORTS', 'EXPORT_REPORTS']
  }
};

export const checkFeatureAccess = (featureKey) => {
  const feature = FEATURE_FLAGS[featureKey];
  if (!feature || !feature.enabled) return false;
  
  return usePermissionCheck(feature.requiredPermissions);
};

// Usage
const ReportsSection = () => {
  const canAccessAdvancedReports = checkFeatureAccess('ADVANCED_REPORTS');
  
  return (
    <div>
      <BasicReports />
      {canAccessAdvancedReports && <AdvancedReports />}
    </div>
  );
};
```

### 5. Module-Specific Permission Hooks

```javascript
// hooks/modulePermissions.js

export const useEmployeePermissions = () => {
  const permissions = useSelector(state => state.auth.permissions);
  
  return {
    canView: permissions.includes('VIEW_EMPLOYEE'),
    canCreate: permissions.includes('CREATE_EMPLOYEE'),
    canUpdate: permissions.includes('UPDATE_EMPLOYEE'),
    canDelete: permissions.includes('DELETE_EMPLOYEE'),
    canViewSalary: permissions.includes('VIEW_EMPLOYEE_SALARY'),
    canManageDocuments: permissions.includes('MANAGE_EMPLOYEE_DOCUMENTS')
  };
};

export const useAttendancePermissions = () => {
  const permissions = useSelector(state => state.auth.permissions);
  
  return {
    canView: permissions.includes('VIEW_ATTENDANCE'),
    canMark: permissions.includes('MARK_ATTENDANCE'),
    canApprove: permissions.includes('APPROVE_ATTENDANCE'),
    canViewTeam: permissions.includes('VIEW_TEAM_ATTENDANCE'),
    canManageShifts: permissions.includes('MANAGE_SHIFTS')
  };
};

// Usage in components
const EmployeeProfile = () => {
  const {
    canView,
    canUpdate,
    canViewSalary,
    canManageDocuments
  } = useEmployeePermissions();

  if (!canView) return <UnauthorizedAccess />;

  return (
    <div className="employee-profile">
      <BasicInfo />
      {canUpdate && <EditButton />}
      {canViewSalary && <SalarySection />}
      {canManageDocuments && <DocumentsSection />}
    </div>
  );
};
```

### 6. Permission-Based Navigation

```javascript
// components/Navigation/SidebarMenu.jsx

const MENU_ITEMS = {
  DASHBOARD: {
    path: '/',
    label: 'Dashboard',
    icon: 'dashboard',
    permissions: ['VIEW_DASHBOARD']
  },
  EMPLOYEE: {
    path: '/employees',
    label: 'Employees',
    icon: 'users',
    permissions: ['VIEW_EMPLOYEE'],
    subItems: [
      {
        path: '/employees/list',
        label: 'All Employees',
        permissions: ['VIEW_EMPLOYEE']
      },
      {
        path: '/employees/create',
        label: 'Add Employee',
        permissions: ['CREATE_EMPLOYEE']
      }
    ]
  },
  ATTENDANCE: {
    path: '/attendance',
    label: 'Attendance',
    icon: 'clock',
    permissions: ['VIEW_ATTENDANCE', 'VIEW_TEAM_ATTENDANCE'],
    subItems: [
      {
        path: '/attendance/my',
        label: 'My Attendance',
        permissions: ['VIEW_ATTENDANCE']
      },
      {
        path: '/attendance/team',
        label: 'Team Attendance',
        permissions: ['VIEW_TEAM_ATTENDANCE']
      }
    ]
  }
  // ... other menu items
};

const SidebarMenu = () => {
  const renderMenuItem = (item) => {
    const hasPermission = usePermissionCheck(item.permissions);
    
    if (!hasPermission) return null;
    
    return (
      <MenuItem
        key={item.path}
        icon={item.icon}
        label={item.label}
        path={item.path}
      >
        {item.subItems?.map(subItem => {
          const hasSubPermission = usePermissionCheck(subItem.permissions);
          if (!hasSubPermission) return null;
          
          return (
            <SubMenuItem
              key={subItem.path}
              label={subItem.label}
              path={subItem.path}
            />
          );
        })}
      </MenuItem>
    );
  };

  return (
    <nav className="sidebar-menu">
      {Object.values(MENU_ITEMS).map(renderMenuItem)}
    </nav>
  );
};
```

### 7. Error Boundary with Permission Handling

```javascript
// components/PermissionErrorBoundary.jsx

class PermissionErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    if (error.name === 'PermissionError') {
      return { hasError: true, error };
    }
    throw error;
  }

  componentDidCatch(error, errorInfo) {
    if (error.name === 'PermissionError') {
      console.error('Permission Error:', {
        error,
        component: errorInfo.componentStack
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="permission-error">
          <h3>Access Denied</h3>
          <p>You don't have permission to perform this action.</p>
          {this.props.fallback}
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
const ProtectedModule = () => {
  return (
    <PermissionErrorBoundary
      fallback={<RedirectToHome />}
    >
      <SensitiveComponent />
    </PermissionErrorBoundary>
  );
}; 