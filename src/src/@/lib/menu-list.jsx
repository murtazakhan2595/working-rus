import {
  Users,
  House,
  Award,
  CalendarClockIcon,
  CalendarRange,
  Crosshair,
  ListTodo,
  UserRoundCheck,
  GalleryHorizontalEnd,
  UserRoundSearch,
  UsersRound,
  BadgeDollarSign,
  Settings,
  Network,
  Laptop,
} from "lucide-react";
import Config from "constants/config";
import { getNodeExistInTree } from "utils/renderValues";
import { SidebarRoutes } from "constants/routes";

// Helper function to fetch route
const findRouteByCodeName = (codeName) =>
  SidebarRoutes.find(
    (route) => route.name?.toUpperCase() === codeName.toUpperCase()
  );

// Create menu function with default values
const createMenu = (to, label, icon, submenus = [], active = false) => ({
  to,
  label,
  active,
  icon,
  submenus,
});

// Fetch submenu list efficiently
const getSubModuleMenuList = (currentNodeTree) =>
  (currentNodeTree?.childrens || [])
    .filter(({ code_name }) => Config[code_name])
    .map(({ code_name,name }) => {
      const route = findRouteByCodeName(code_name);
      return createMenu(route?.path || "#", name);
    });

// Function to generate menu items
const generateMenuItems = (moduleName, icon, moduleTree) => {
  const currentNodeTree = getNodeExistInTree(moduleTree, moduleName, "code_name");
  if (!currentNodeTree) return null;

  const route = findRouteByCodeName(moduleName);
  return {
    groupLabel: "",
    menus: [
      createMenu(route?.path || "#", currentNodeTree.name, icon, getSubModuleMenuList(currentNodeTree)),
    ],
  };
};

// Main function to retrieve the menu list
export function getMenuList(pathname, userRole) {
  const moduleTree = { code_name: "ORG", childrens: userRole };
  // Define common menus
  const commonMenus = [{ groupLabel: "", menus: [createMenu("/", "Dashboard", House)] }];

  // Dynamically generate menu items based on configuration flags
  const configMenus = [
    ["SELF_SERVICE_HUB", UserRoundCheck],
    ["TEAM_MANAGEMENT", Users],
    ["PEOPLE_TEAM", Users],
    ["ATTENDANCE", CalendarClockIcon],
    ["LEAVE_MANAGEMENT", CalendarRange],
    ["PAYROLL", BadgeDollarSign],
    ["TASK_MANAGEMENT", ListTodo],
    ["TALENT_SPHERE", UserRoundSearch],
    ["ASSET_MANAGEMENT", Laptop],
    ["ORGANIZATIONAL_CHART", Network],
    ["PERFORMANCE_MANAGEMENT", Award],
    ["PERSONAL_DEVELOPMENT", UsersRound],
    ["PEOPLE_ENGAGEMENT", Crosshair],
    ["REPORTS", GalleryHorizontalEnd],
    ["OFFICE_SETTING", Settings],
  ].map(([name, icon]) => Config[name] && generateMenuItems(name, icon, moduleTree))
    .filter(Boolean);

  return [...commonMenus, ...configMenus];
}

export default getMenuList;