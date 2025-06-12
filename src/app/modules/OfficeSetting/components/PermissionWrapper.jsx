import React from 'react';
import { useSelector } from 'react-redux';

export const OfficeSettingPermissionWrapper = ({ 
  permissions, 
  children, 
  fallback = null,
  showError = false 
}) => {
  const userPermissionsRaw = useSelector(state => state.roles_permissions?.my_permissions || []);
  
  // The permissions are already strings (permission codes), not objects
  const userPermissions = userPermissionsRaw.filter(Boolean); // Remove any undefined/null values
  
  const hasPermission = Array.isArray(permissions)
    ? permissions.every(permission => userPermissions.includes(permission))
    : userPermissions.includes(permissions);
  
  if (!hasPermission) {
    if (showError) {
      return (
        <div className="flex items-center justify-center p-4 bg-red-50 rounded-lg">
          <div className="flex flex-col items-center text-center">
            <svg
              className="w-12 h-12 text-red-400 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
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

// Higher Order Component version for OfficeSetting
export const withOfficeSettingPermission = (WrappedComponent, permissions, options = {}) => {
  return function WithOfficeSettingPermissionComponent(props) {
    return (
      <OfficeSettingPermissionWrapper
        permissions={permissions}
        {...options}
      >
        <WrappedComponent {...props} />
      </OfficeSettingPermissionWrapper>
    );
  };
}; 