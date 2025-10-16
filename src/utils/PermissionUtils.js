import { useSelector } from "react-redux";

export function HasAccess(key) {
  // Check if feature is enabled in config AND user has permission
  const permissions = useSelector(
    (state) => state.roles_permissions.my_permissions
  );
  const isAllowed = permissions.includes(key);
  return Boolean(isAllowed);
}

// hooks/usePermissions.js

export function usePermissions() {
  const permissions = useSelector(
    (state) => state.roles_permissions.my_permissions
  );

  const hasAccess = (key) => permissions.includes(key);

  return { permissions, hasAccess };
}

