import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const ProtectedRoute = ({ 
  permissions, 
  component: Component,
  redirectPath = '/unauthorized'
}) => {
  const userPermissions = useSelector(state => state.auth.permissions);
  
  const hasPermission = Array.isArray(permissions)
    ? permissions.every(permission => userPermissions.includes(permission))
    : userPermissions.includes(permissions);

  if (!hasPermission) {
    return <Navigate to={redirectPath} />;
  }

  return <Component />;
};

// Usage example:
// <Route
//   path="/self-service/profile"
//   element={
//     <ProtectedRoute
//       permissions={[SELF_SERVICE_PERMISSIONS.PROFILE.PERSONAL_INFO.VIEW]}
//       component={MyProfile}
//     />
//   }
// /> 