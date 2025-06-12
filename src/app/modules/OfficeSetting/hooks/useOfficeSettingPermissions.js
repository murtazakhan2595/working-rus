import { useSelector } from 'react-redux';
import { OFFICE_SETTING_PERMISSIONS } from '../permissions/constants';

export const useOfficeSettingPermissions = () => {
  // Try different possible paths for permissions in Redux state
  const permissionsFromState = useSelector(state => {
    console.log('Full roles_permissions state:', state.roles_permissions);
    return state.roles_permissions?.my_permissions || [];
  });

  // The permissions are already strings (permission codes), not objects
  const permissions = permissionsFromState.filter(Boolean); // Remove any undefined/null values

  // Helper function to check if user has a specific permission
  const hasPermission = (permissionCode) => {
    return permissions.includes(permissionCode);
  };

  // Debug: Log available permissions (uncomment for debugging)
  console.log('OfficeSetting - Raw permissions from state:', permissionsFromState);
  console.log('OfficeSetting - Processed permissions:', permissions);
  console.log('OfficeSetting - Available permission codes:', permissions);
  console.log('OfficeSetting - Checking permissions for:', {
    'ADD_DEPARTMENTS': hasPermission('ADD_DEPARTMENTS'),
    'ADD_DESIGNATIONS': hasPermission('ADD_DESIGNATIONS'),
    'ADD_BRANCHES': hasPermission('ADD_BRANCHES'),
    'ADD_SHIFTS': hasPermission('ADD_SHIFTS'),
    'ADD_ONBOARDING_CHECKLIST': hasPermission('ADD_ONBOARDING_CHECKLIST')
  });

  return {
    // Organization Permissions
    organization: {
      canView: hasPermission(OFFICE_SETTING_PERMISSIONS.ORGANIZATION.VIEW),
      canCreate: hasPermission(OFFICE_SETTING_PERMISSIONS.ORGANIZATION.CREATE),
      canUpdate: hasPermission(OFFICE_SETTING_PERMISSIONS.ORGANIZATION.UPDATE),
      canDelete: hasPermission(OFFICE_SETTING_PERMISSIONS.ORGANIZATION.DELETE)
    },

    // Branches Permissions
    branches: {
      canView: hasPermission(OFFICE_SETTING_PERMISSIONS.BRANCHES.VIEW),
      canCreate: hasPermission(OFFICE_SETTING_PERMISSIONS.BRANCHES.CREATE),
      canUpdate: hasPermission(OFFICE_SETTING_PERMISSIONS.BRANCHES.UPDATE),
      canDelete: hasPermission(OFFICE_SETTING_PERMISSIONS.BRANCHES.DELETE)
    },

    // Departments Permissions
    departments: {
      canView: hasPermission(OFFICE_SETTING_PERMISSIONS.DEPARTMENTS.VIEW),
      canCreate: hasPermission(OFFICE_SETTING_PERMISSIONS.DEPARTMENTS.CREATE),
      canUpdate: hasPermission(OFFICE_SETTING_PERMISSIONS.DEPARTMENTS.UPDATE),
      canDelete: hasPermission(OFFICE_SETTING_PERMISSIONS.DEPARTMENTS.DELETE),
      canAssignPermissions: hasPermission(OFFICE_SETTING_PERMISSIONS.DEPARTMENTS.ASSIGN_PERMISSIONS)
    },

    // Designations Permissions
    designations: {
      canView: hasPermission(OFFICE_SETTING_PERMISSIONS.DESIGNATIONS.VIEW),
      canCreate: hasPermission(OFFICE_SETTING_PERMISSIONS.DESIGNATIONS.CREATE),
      canUpdate: hasPermission(OFFICE_SETTING_PERMISSIONS.DESIGNATIONS.UPDATE),
      canDelete: hasPermission(OFFICE_SETTING_PERMISSIONS.DESIGNATIONS.DELETE),
      canBulkUpload: hasPermission(OFFICE_SETTING_PERMISSIONS.DESIGNATIONS.BULK_UPLOAD)
    },

    // Grace Time Permissions
    graceTime: {
      canView: hasPermission(OFFICE_SETTING_PERMISSIONS.GRACE_TIME.VIEW),
      canCreate: hasPermission(OFFICE_SETTING_PERMISSIONS.GRACE_TIME.CREATE),
      canUpdate: hasPermission(OFFICE_SETTING_PERMISSIONS.GRACE_TIME.UPDATE),
      canDelete: hasPermission(OFFICE_SETTING_PERMISSIONS.GRACE_TIME.DELETE)
    },

    // Working Hours Permissions
    workingHours: {
      canView: hasPermission(OFFICE_SETTING_PERMISSIONS.WORKING_HOURS.VIEW),
      canCreate: hasPermission(OFFICE_SETTING_PERMISSIONS.WORKING_HOURS.CREATE),
      canUpdate: hasPermission(OFFICE_SETTING_PERMISSIONS.WORKING_HOURS.UPDATE),
      canDelete: hasPermission(OFFICE_SETTING_PERMISSIONS.WORKING_HOURS.DELETE)
    },

    // Shift Permissions
    shift: {
      canView: hasPermission(OFFICE_SETTING_PERMISSIONS.SHIFT.VIEW),
      canCreate: hasPermission(OFFICE_SETTING_PERMISSIONS.SHIFT.CREATE),
      canUpdate: hasPermission(OFFICE_SETTING_PERMISSIONS.SHIFT.UPDATE),
      canDelete: hasPermission(OFFICE_SETTING_PERMISSIONS.SHIFT.DELETE),
      canAssign: hasPermission(OFFICE_SETTING_PERMISSIONS.SHIFT.ASSIGN)
    },

    // Onboarding Checklist Permissions
    onboarding: {
      canView: hasPermission(OFFICE_SETTING_PERMISSIONS.ONBOARDING.VIEW),
      canCreate: hasPermission(OFFICE_SETTING_PERMISSIONS.ONBOARDING.CREATE),
      canUpdate: hasPermission(OFFICE_SETTING_PERMISSIONS.ONBOARDING.UPDATE),
      canDelete: hasPermission(OFFICE_SETTING_PERMISSIONS.ONBOARDING.DELETE)
    },

    // Organizational Chart Permissions
    orgChart: {
      canView: hasPermission(OFFICE_SETTING_PERMISSIONS.ORG_CHART.VIEW),
      canManage: hasPermission(OFFICE_SETTING_PERMISSIONS.ORG_CHART.MANAGE)
    }
  };
}; 