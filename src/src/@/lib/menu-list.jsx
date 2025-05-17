import {
  Users,
  SquareStack,
  House,
  Award,
  CalendarClockIcon,
  CalendarRange,
  Crosshair,
  FileChartColumnIncreasing,
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

const findRouteByCodeName = (codeName) => {
  return SidebarRoutes.find(
    (route) =>
      route.name === codeName ||
      route.name?.toUpperCase() === codeName.toUpperCase()
  );
};

/**
 * @typedef {Object} Group
 * @property {string} groupLabel - The label for the group.
 * @property {Menu[]} menus - The list of menus in the group.
 */
/**
 * @typedef {Object} Menu
 * @property {string} to - The URL of the menu item.
 * @property {string} label - The label of the menu item.
 * @property {boolean} active - Whether the menu item is active.
 * @property {React.ComponentType} icon - The icon component for the menu item.
 * @property {Menu[]} submenus - The list of submenus.
 */

/**
 * Example function using the Group type.
 * @param {Group[]} groups - The list of groups.
 */
export function getMenuList(pathname, userRole) {
  const ModuleTee = { code_name: "ORG", childrens: userRole };
  const createMenu = (
    to,
    label,
    icon,
    submenus = [],
    active = pathname === to
  ) => ({
    to,
    label,
    active,
    icon,
    submenus,
  });

  const getSubModuleMenueList = (CurrentNodeTree) => {
    const SubModules = CurrentNodeTree.childrens || [];
    const Sub_Menue = [];
    SubModules.forEach(({ code_name }) => {
      const sub_module = getNodeExistInTree(
        CurrentNodeTree,
        code_name,
        "code_name"
      );
      if (Config[code_name] && sub_module) {
        // config flag check or no flag required
        const route = findRouteByCodeName(code_name);
        if (route) {
          Sub_Menue.push(createMenu(route.path, sub_module.name));
        } else {
          // fallback if route not found
          Sub_Menue.push(createMenu("#", code_name));
        }
      }
    });

    return Sub_Menue;
  };

  const commonMenus = [
    createMenu("/", "Dashboard", House),
    // createMenu("/services", "Services", SquareStack),
  ];

  const MenueItems = (ModuleName, Icon) => {
    const CurrentNodeTree = getNodeExistInTree(
      ModuleTee,
      ModuleName,
      "code_name"
    );
    if (!CurrentNodeTree) return null;
    if (CurrentNodeTree) {
      const route = findRouteByCodeName(ModuleName);
      const Sub_Menue = getSubModuleMenueList(CurrentNodeTree);
      return {
        groupLabel: "",
        menus: [
          createMenu(
            route?.path || "#",
            CurrentNodeTree.name,
            Icon,
            Sub_Menue.filter(Boolean)
          ),
        ],
      };
    }
    return null;
  };


  const menuList = [
    { groupLabel: "", menus: commonMenus },
    Config.SELF_SERVICE_HUB && MenueItems("SELF_SERVICE_HUB", UserRoundCheck),
    Config.TEAM_MANAGEMENT && MenueItems("TEAM_MANAGEMENT", Users),
    Config.PEOPLE_TEAM && MenueItems("PEOPLE_TEAM", Users),
    Config.ATTENDANCE && MenueItems("ATTENDANCE", CalendarClockIcon),
    Config.LEAVE_MANAGEMENT && MenueItems("LEAVE_MANAGEMENT", CalendarRange),
    Config.PAYROLL && MenueItems("PAYROLL", BadgeDollarSign),
    Config.TASK_MANAGEMENT && MenueItems("TASK_MANAGEMENT", ListTodo),
    Config.TALENT_SPHERE && MenueItems("TALENT_SPHERE", UserRoundSearch),
    Config.ASSET_MANAGEMENT && MenueItems("ASSET_MANAGEMENT", Laptop),
    Config.ORGANIZATIONAL_CHART && MenueItems("ORGANIZATIONAL_CHART", Network),
    Config.PERFORMANCE_MANAGEMENT &&
      MenueItems("PERFORMANCE_MANAGEMENT", Award),
    Config.PERSONAL_DEVELOPMENT &&
      MenueItems("PERSONAL_DEVELOPMENT", UsersRound),
    Config.PEOPLE_ENGAGEMENT && MenueItems("PEOPLE_ENGAGEMENT", Crosshair),
    Config.REPORTS && MenueItems("REPORTS", GalleryHorizontalEnd),
    Config.OFFICE_SETTING && MenueItems("OFFICE_SETTING", Settings),
  ].filter(Boolean);

  return menuList;
}

export default getMenuList;
