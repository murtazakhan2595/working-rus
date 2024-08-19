
import { Users, SquarePen, SquareStack, House } from "lucide-react"


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


export function getMenuList(pathname, groups, userRole) {
  const commonMenus = [
    {
      to: "/services",
      label: "Services",
      active: pathname.includes("/services"),
      icon: SquareStack,
      submenus: [],
    },
    {
      to: "/",

      label: "Dashboard",
      active: pathname === "/",
      icon: House,
      submenus: [],
    },
  ];


  const peopleTeamMenus = [
    {
      to: "/profile-management",
      label: "Profile Management",
      active: pathname === "/profile-management",
      icon: Users,
      submenus: [],
    },
    {
      to: "/settings",
      label: "Profile Settings",
      active: pathname === "/settings",
      icon: Users,
      submenus: [],
    },
    {
      to: "/travel-details",
      label: "Travel Details",
      active: pathname === "/travel-details",
      icon: Users,
      submenus: [],
    },
    {
      to: "/exit-clearance",
      label: "Exit & Clearance",
      active: pathname === "/exit-clearance",
      icon: Users,
      submenus: [],
    },
    {
      to: "/create-employee",
      label: "Employee Creation",
      active: pathname === "/create-employee",
      icon: Users,
      submenus: [],
    },
    {
      to: "/customise-employees",
      label: "Customize Employee",
      active: pathname === "/customise-employees",
      icon: Users,
      submenus: [],
    },
    {
      to: "/relocation",
      label: "Relocation",
      active: pathname === "/relocation",
      icon: Users,
      submenus: [],
    },
  ];

  const selfServiceHub = [
    {
      to: "/my-profile",
      label: "My Profile",
      active: pathname === "/my-profile",
      icon: Users,
      submenus: [],
    },
    {
      to: "/my-team",
      label: "My Team",
      active: pathname === "/my-team",
      icon: Users,
      submenus: [],
    },
    {
      to: "/calendar",
      label: "Calendar",
      active: pathname === "/calendar",
      icon: Users,
      submenus: [],
    },
    {
      to: "/attendance",
      label: "Attendance",
      active: pathname === "/attendance",
      icon: Users,
      submenus: [],
    },
    {
      to: "/leave-tracker",
      label: "Leave Tracker",
      active: pathname === "/leave-tracker",
      icon: Users,
      submenus: [],
    },
    {
      to: "/files-data",
      label: "Files & Data",
      active: pathname === "/files-data",
      icon: Users,
      submenus: [],
    },
    {
      to: "/my-travel-details",
      label: "My Travel Details",
      active: pathname === "/my-travel-details",
      icon: Users,
      submenus: [],
    },
    {
      to: "/exit-employee",
      label: "Exit",
      active: pathname === "/exit-employee",
      icon: Users,
      submenus: [],
    },
  ];


  const menuList = [
    {
      groupLabel: "",
      menus: commonMenus,
    },
    {
      groupLabel: "",
      // groupLabel: userRole === 1 || userRole === 3 ? "" : "People Team",
      menus: userRole === 1 || userRole === 3 ? peopleTeamMenus : [
        {
          to: "",
          label: "People Team",
          active: pathname === "/profile-management",
          icon: Users,
          submenus: [
            {
              to: "/profile-management",
              label: "Profile Management",
            },
            {
              to: "/settings",
              label: "Profile Settings",
            },
            {
              to: "/travel-details",
              label: "Travel Details",
            },
            {
              to: "/exit-clearance",
              label: "Exit & Clearance",
            },
            {
              to: "/create-employee",
              label: "Employee Creation",
            },
            {
              to: "/customise-employees",
              label: "Customize Employee",
            },
          ],
        },
      ],
    },
    {
      // groupLabel: userRole === 1 || userRole === 3 ? "" : "Self Service Hub",
      menus: userRole === 1 || userRole === 3 ? selfServiceHub : [
        {
          to: "",
          label: "Transfer Employee",
          active: pathname === "/internal",
          icon: SquarePen,
          submenus: [
            {

              to: "/internal",
              label: "Internal",
            },
            {
              to: "/external",
              label: "External",
            },
          ],
        },
      ],
    },
    {
      to: "/relocation",
      label: "Relocation",
      active: pathname === "/relocation",
      icon: Users,
      submenus: [],
    },
  ];


  return menuList;
}

export default getMenuList;

