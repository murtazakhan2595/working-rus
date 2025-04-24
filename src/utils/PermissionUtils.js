import Config from "constants/config";

export function hasAccess(key) {
  // Check if feature is enabled in config AND user has permission
  return Config[key];
}
