# Office Setting Module - Roles and Permissions Documentation

## Overview

The Office Setting module provides comprehensive organizational management capabilities with a robust permission system that controls access to different features based on user roles. This module allows administrators to manage organizations, departments, designations, branches, working hours, and onboarding checklists.

## Module Structure

```
src/app/modules/OfficeSetting/
├── components/
│   └── PermissionWrapper.jsx          # Permission wrapper component
├── hooks/
│   └── useOfficeSettingPermissions.js # Permission hook
├── permissions/
│   └── constants.js                   # Permission constants
├── Screens/
│   ├── OfficeSetting.jsx             # Main component
│   ├── Organizations/                # Organization management
│   ├── Departments/                  # Department management
│   ├── Designations/                 # Designation management
│   ├── Branches/                     # Branch management
│   ├── GraceTime/                    # Grace time management
│   ├── WorkingHours.jsx              # Working hours management
│   └── OnboardingChecklist/          # Onboarding checklist management
└── sections/
    └── Shift/                        # Shift management
```

## Permission System Architecture

### 1. Permission Constants (`permissions/constants.js`)

Defines all permission codes used in the module:

```javascript
export const OFFICE_SETTING_PERMISSIONS = {
  ORGANIZATION: {
    VIEW: 'VIEW_ORGANIZATION',
    CREATE: 'EDIT_ORGANIZATION', // Uses EDIT as CREATE
    UPDATE: 'EDIT_ORGANIZATION',
    DELETE: 'DELETE_ORGANIZATION'
  },
  DEPARTMENTS: {
    VIEW: 'VIEW_DEPARTMENTS',
    CREATE: 'ADD_DEPARTMENTS',
    UPDATE: 'EDIT_DEPARTMENTS',
    DELETE: 'DELETE_DEPARTMENTS'
  },
  DESIGNATIONS: {
    VIEW: 'VIEW_DESIGNATIONS',
    CREATE: 'ADD_DESIGNATIONS',
    UPDATE: 'EDIT_DESIGNATIONS',
    DELETE: 'DELETE_DESIGNATIONS'
  },
  BRANCHES: {
    VIEW: 'VIEW_BRANCHES',
    CREATE: 'ADD_BRANCHES',
    UPDATE: 'EDIT_BRANCHES',
    DELETE: 'DELETE_BRANCHES'
  },
  WORKING_HOURS: {
    VIEW: 'VIEW_SHIFTS',
    CREATE: 'ADD_SHIFTS',
    UPDATE: 'EDIT_SHIFTS',
    DELETE: 'DELETE_SHIFTS'
  },
  SHIFT: {
    VIEW: 'VIEW_SHIFTS',
    CREATE: 'ADD_SHIFTS',
    UPDATE: 'EDIT_SHIFTS',
    DELETE: 'DELETE_SHIFTS',
    ASSIGN: 'ASSIGN_SHIFT'
  },
  GRACE_TIME: {
    VIEW: 'VIEW_SHIFTS',
    CREATE: 'ADD_SHIFTS',
    UPDATE: 'EDIT_SHIFTS',
    DELETE: 'DELETE_SHIFTS'
  },
  ONBOARDING: {
    VIEW: 'VIEW_ONBOARDING_CHECKLIST',
    CREATE: 'ADD_ONBOARDING_CHECKLIST',
    UPDATE: 'EDIT_ONBOARDING_CHECKLIST',
    DELETE: 'DELETE_ONBOARDING_CHECKLIST'
  },
  ORG_CHART: {
    VIEW: 'VIEW_ORGANIZATION_TREE',
    MANAGE: 'MANAGE_ORGANIZATION_TREE'
  }
};
```

### 2. Permission Hook (`hooks/useOfficeSettingPermissions.js`)

Provides a centralized way to check permissions:

```javascript
export const useOfficeSettingPermissions = () => {
  const permissionsFromState = useSelector(state => 
    state.roles_permissions?.my_permissions || []
  );
  
  const permissions = permissionsFromState.filter(Boolean);
  
  const hasPermission = (permissionCode) => {
    return permissions.includes(permissionCode);
  };

  return {
    organization: {
      canView: hasPermission(OFFICE_SETTING_PERMISSIONS.ORGANIZATION.VIEW),
      canCreate: hasPermission(OFFICE_SETTING_PERMISSIONS.ORGANIZATION.CREATE),
      canUpdate: hasPermission(OFFICE_SETTING_PERMISSIONS.ORGANIZATION.UPDATE),
      canDelete: hasPermission(OFFICE_SETTING_PERMISSIONS.ORGANIZATION.DELETE)
    },
    departments: {
      canView: hasPermission(OFFICE_SETTING_PERMISSIONS.DEPARTMENTS.VIEW),
      canCreate: hasPermission(OFFICE_SETTING_PERMISSIONS.DEPARTMENTS.CREATE),
      canUpdate: hasPermission(OFFICE_SETTING_PERMISSIONS.DEPARTMENTS.UPDATE),
      canDelete: hasPermission(OFFICE_SETTING_PERMISSIONS.DEPARTMENTS.DELETE)
    },
    designations: {
      canView: hasPermission(OFFICE_SETTING_PERMISSIONS.DESIGNATIONS.VIEW),
      canCreate: hasPermission(OFFICE_SETTING_PERMISSIONS.DESIGNATIONS.CREATE),
      canUpdate: hasPermission(OFFICE_SETTING_PERMISSIONS.DESIGNATIONS.UPDATE),
      canDelete: hasPermission(OFFICE_SETTING_PERMISSIONS.DESIGNATIONS.DELETE)
    },
    branches: {
      canView: hasPermission(OFFICE_SETTING_PERMISSIONS.BRANCHES.VIEW),
      canCreate: hasPermission(OFFICE_SETTING_PERMISSIONS.BRANCHES.CREATE),
      canUpdate: hasPermission(OFFICE_SETTING_PERMISSIONS.BRANCHES.UPDATE),
      canDelete: hasPermission(OFFICE_SETTING_PERMISSIONS.BRANCHES.DELETE)
    },
    workingHours: {
      canView: hasPermission(OFFICE_SETTING_PERMISSIONS.WORKING_HOURS.VIEW),
      canCreate: hasPermission(OFFICE_SETTING_PERMISSIONS.WORKING_HOURS.CREATE),
      canUpdate: hasPermission(OFFICE_SETTING_PERMISSIONS.WORKING_HOURS.UPDATE),
      canDelete: hasPermission(OFFICE_SETTING_PERMISSIONS.WORKING_HOURS.DELETE)
    },
    shift: {
      canView: hasPermission(OFFICE_SETTING_PERMISSIONS.SHIFT.VIEW),
      canCreate: hasPermission(OFFICE_SETTING_PERMISSIONS.SHIFT.CREATE),
      canUpdate: hasPermission(OFFICE_SETTING_PERMISSIONS.SHIFT.UPDATE),
      canDelete: hasPermission(OFFICE_SETTING_PERMISSIONS.SHIFT.DELETE),
      canAssign: hasPermission(OFFICE_SETTING_PERMISSIONS.SHIFT.ASSIGN)
    },
    graceTime: {
      canView: hasPermission(OFFICE_SETTING_PERMISSIONS.GRACE_TIME.VIEW),
      canCreate: hasPermission(OFFICE_SETTING_PERMISSIONS.GRACE_TIME.CREATE),
      canUpdate: hasPermission(OFFICE_SETTING_PERMISSIONS.GRACE_TIME.UPDATE),
      canDelete: hasPermission(OFFICE_SETTING_PERMISSIONS.GRACE_TIME.DELETE)
    },
    onboarding: {
      canView: hasPermission(OFFICE_SETTING_PERMISSIONS.ONBOARDING.VIEW),
      canCreate: hasPermission(OFFICE_SETTING_PERMISSIONS.ONBOARDING.CREATE),
      canUpdate: hasPermission(OFFICE_SETTING_PERMISSIONS.ONBOARDING.UPDATE),
      canDelete: hasPermission(OFFICE_SETTING_PERMISSIONS.ONBOARDING.DELETE)
    },
    orgChart: {
      canView: hasPermission(OFFICE_SETTING_PERMISSIONS.ORG_CHART.VIEW),
      canManage: hasPermission(OFFICE_SETTING_PERMISSIONS.ORG_CHART.MANAGE)
    }
  };
};
```

### 3. Permission Wrapper (`components/PermissionWrapper.jsx`)

Protects UI elements based on permissions:

```javascript
export const OfficeSettingPermissionWrapper = ({ 
  permissions, 
  children, 
  fallback = null,
  showError = false 
}) => {
  const userPermissionsRaw = useSelector(state => 
    state.roles_permissions?.my_permissions || []
  );
  
  const userPermissions = userPermissionsRaw.filter(Boolean);
  
  const hasPermission = Array.isArray(permissions)
    ? permissions.every(permission => userPermissions.includes(permission))
    : userPermissions.includes(permissions);
  
  if (!hasPermission) {
    if (showError) {
      return (
        <div className="flex items-center justify-center p-4 bg-red-50 rounded-lg">
          <div className="flex flex-col items-center text-center">
            <svg className="w-12 h-12 text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-sm text-gray-600">
              You don't have permission to access this feature
            </p>
          </div>
        </div>
      );
    }
    return fallback;
  }
  
  return children;
};
```

## Permission Implementation Patterns

### 1. Tab-Level Protection

Tabs are filtered based on VIEW permissions:

```javascript
const tabsData = [
  { 
    value: "offices", 
    label: "Organization", 
    permission: OFFICE_SETTING_PERMISSIONS.ORGANIZATION.VIEW 
  },
  { 
    value: "department", 
    label: "Department", 
    permission: OFFICE_SETTING_PERMISSIONS.DEPARTMENTS.VIEW 
  },
  // ... other tabs
];

const availableTabs = tabsData.filter(tab => {
  return userPermissions.includes(tab.permission);
});
```

### 2. Component-Level Protection

Individual components check for specific permissions:

```javascript
// In AddDepartment component
const permissions = useOfficeSettingPermissions();

if (!permissions.departments.canCreate) {
  return null;
}
```

### 3. Action-Level Protection

Action buttons are conditionally rendered:

```javascript
// In DepartmentAction component
<DropdownActionMenu
  onView={permissions.departments.canView ? handleView : null}
  onEdit={permissions.departments.canUpdate ? handleEdit : null}
  onDelete={permissions.departments.canDelete ? handleDelete : null}
/>
```

### 4. Content-Level Protection

Entire screens are wrapped with permission checks:

```javascript
// In Departments index component
<OfficeSettingPermissionWrapper 
  permissions={OFFICE_SETTING_PERMISSIONS.DEPARTMENTS.VIEW}
  showError={true}
>
  <DepartmentContent />
</OfficeSettingPermissionWrapper>
```

## Module Permissions

### Organization Module
- **VIEW_ORGANIZATION**: View organization details
- **EDIT_ORGANIZATION**: Create/update organization information
- **DELETE_ORGANIZATION**: Delete organization (if applicable)

### Departments Module
- **VIEW_DEPARTMENTS**: View department list and details
- **ADD_DEPARTMENTS**: Create new departments
- **EDIT_DEPARTMENTS**: Update department information
- **DELETE_DEPARTMENTS**: Delete departments

### Designations Module
- **VIEW_DESIGNATIONS**: View designation list and details
- **ADD_DESIGNATIONS**: Create new designations
- **EDIT_DESIGNATIONS**: Update designation information
- **DELETE_DESIGNATIONS**: Delete designations

### Branches Module
- **VIEW_BRANCHES**: View branch list and details
- **ADD_BRANCHES**: Create new branches
- **EDIT_BRANCHES**: Update branch information
- **DELETE_BRANCHES**: Delete branches

### Working Hours/Shift Module
- **VIEW_SHIFTS**: View working hours and shift schedules
- **ADD_SHIFTS**: Create new shifts and working hours
- **EDIT_SHIFTS**: Update shift information
- **DELETE_SHIFTS**: Delete shifts
- **ASSIGN_SHIFT**: Assign shifts to employees

### Grace Time Module
- **VIEW_SHIFTS**: View grace time settings (uses shift permissions)
- **ADD_SHIFTS**: Create grace time rules
- **EDIT_SHIFTS**: Update grace time settings
- **DELETE_SHIFTS**: Delete grace time rules

### Onboarding Checklist Module
- **VIEW_ONBOARDING_CHECKLIST**: View onboarding documents
- **ADD_ONBOARDING_CHECKLIST**: Create new onboarding documents
- **EDIT_ONBOARDING_CHECKLIST**: Update onboarding documents
- **DELETE_ONBOARDING_CHECKLIST**: Delete onboarding documents

## Usage Examples

### 1. Checking Permissions in Components

```javascript
import { useOfficeSettingPermissions } from "../hooks/useOfficeSettingPermissions";

const MyComponent = () => {
  const permissions = useOfficeSettingPermissions();
  
  return (
    <div>
      {permissions.departments.canView && (
        <DepartmentList />
      )}
      {permissions.departments.canCreate && (
        <AddDepartmentButton />
      )}
    </div>
  );
};
```

### 2. Protecting Components with Wrapper

```javascript
import { OfficeSettingPermissionWrapper } from "../components/PermissionWrapper";
import { OFFICE_SETTING_PERMISSIONS } from "../permissions/constants";

const ProtectedComponent = () => (
  <OfficeSettingPermissionWrapper 
    permissions={OFFICE_SETTING_PERMISSIONS.DEPARTMENTS.VIEW}
    showError={true}
  >
    <DepartmentContent />
  </OfficeSettingPermissionWrapper>
);
```

### 3. Conditional Action Rendering

```javascript
const ActionMenu = () => {
  const permissions = useOfficeSettingPermissions();
  
  return (
    <DropdownActionMenu
      onView={permissions.departments.canView ? handleView : null}
      onEdit={permissions.departments.canUpdate ? handleEdit : null}
      onDelete={permissions.departments.canDelete ? handleDelete : null}
    />
  );
};
```

## Error Handling

### Permission Denied States

1. **Tab Level**: Tabs without VIEW permission are hidden
2. **Component Level**: Components return `null` if no CREATE permission
3. **Content Level**: Shows error message if no access
4. **Action Level**: Actions are disabled/hidden if no permission

### Error Messages

```javascript
// Custom error message
<OfficeSettingPermissionWrapper 
  permissions="REQUIRED_PERMISSION"
  showError={true}
  fallback={<CustomErrorMessage />}
>
  <ProtectedContent />
</OfficeSettingPermissionWrapper>
```

## Best Practices

### 1. Permission Checking
- Always check permissions at the component level
- Use the permission hook for consistent checking
- Implement graceful degradation for missing permissions

### 2. Component Protection
- Wrap sensitive components with PermissionWrapper
- Return `null` for components without required permissions
- Show appropriate error messages for denied access

### 3. Action Protection
- Conditionally render action buttons based on permissions
- Disable actions instead of hiding when appropriate
- Provide clear feedback for unavailable actions

### 4. Performance
- Use permission checks efficiently
- Avoid unnecessary re-renders
- Cache permission results when possible

## Troubleshooting

### Common Issues

1. **Tabs not showing**: Check if user has VIEW permissions for the module
2. **Add buttons missing**: Verify user has CREATE permissions
3. **Actions disabled**: Confirm user has UPDATE/DELETE permissions
4. **Permission errors**: Check Redux state structure and permission codes

### Debug Tools

```javascript
// Enable debug logging in useOfficeSettingPermissions.js
console.log('Available permissions:', permissions);
console.log('Permission check result:', hasPermission('PERMISSION_CODE'));
```

## Security Considerations

1. **Client-side Only**: These permissions are for UI control only
2. **Server Validation**: Always validate permissions on the server
3. **Sensitive Data**: Don't expose sensitive data to unauthorized users
4. **Permission Updates**: Handle permission changes gracefully

## Migration Guide

When updating permissions:

1. Update permission constants
2. Update permission hook logic
3. Update component permission checks
4. Test all permission scenarios
5. Update documentation

---

*Last Updated: January 2024*
*Version: 1.0.0* 