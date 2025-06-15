import React from 'react';
import { useSelector } from 'react-redux';

export const PermissionWrapper = ({ 
  permissions, 
  children, 
  fallback = null,
  showError = false 
}) => {
  const userPermissions = useSelector(state => state.roles_permissions?.my_permissions || []);
  
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
                d="M12 15v2m0 0v2m0-2h2m-2 0H8m4-6V4"
              />
            </svg>
            <p className="text-sm text-gray-600">
              You don't have permission to view this content
            </p>
          </div>
        </div>
      );
    }
    return fallback;
  }
  
  return children;
};

// Higher Order Component version
export const withPermission = (WrappedComponent, permissions, options = {}) => {
  return function WithPermissionComponent(props) {
    return (
      <PermissionWrapper
        permissions={permissions}
        {...options}
      >
        <WrappedComponent {...props} />
      </PermissionWrapper>
    );
  };
}; 