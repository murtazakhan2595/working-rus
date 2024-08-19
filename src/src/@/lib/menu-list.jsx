import { Users, SquarePen, SquareStack, House, UsersRound, FileText, Home } from "lucide-react"




/**
 * @typedef {Object} Group
 * @property {string} groupLabel - The label for the group.
 * @property {Menu[]} menus - The list of menus in the group.
 */

/**
 * @typedef {Object} Menu
 * @property {string} href - The URL of the menu item.
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
      href: "/",
      label: "Dashboard",
      active: pathname === "/",
      icon: House,
      submenus: [],
    },
  ];
  const peopleTeamMenus = [
    {
      href: "/profile-management",
      label: "Profile Management",
      active: pathname === "/profile-management",
    },
    {
      href: "/settings",
      label: "Profile Settings",
      active: pathname === "/settings",
    },
    {
      href: "/travel-details",
      label: "Travel Details",
      active: pathname === "/travel-details",
    },
    {
      href: "/exit-clearance",
      label: "Exit & Clearance",
      active: pathname === "/exit-clearance",
    },
    {
      href: "/create-employee",
      label: "Employee Creation",
      active: pathname === "/create-employee",
    },
    {
      href: "/customise-employees",
      label: "Customize Employee",
      active: pathname === "/customise-employees",
    },    
    {
      href: "/relocation",
      label: "Relocation",
      active: pathname === "/relocation",
    },
  ];

  const selfServiceHub  = [
  {
      href: "/my-profile",
      label: "My Profile",
      active: pathname === "/my-profile",
  },
  {
      href: "/my-team",
      label: "My Team",
      active: pathname === "/my-team",
  },
  {
      href: "/calendar",
      label: "Calendar",
      active: pathname === "/calendar",
  },
  {
     href: "/attendance",
     label: "Attendance",
     active: pathname === "/attendance",
  },
  {
    href: "/leave-tracker",
    label: "Leave Tracker",
    active: pathname === "/leave-tracker",
  },
  {
    href: "/files-data",
    label: "Files & Data",
    active: pathname === "/files-data",
  },
  {
    href: "/my-travel-details",
    label: "My Travel Details",
    active: pathname === "/my-travel-details",
  },
  {
    href: "/exit-employee",
    label: "Exit",
    active: pathname === "/exit-employee",
  },
  ]
  const menuList = [
    {
      groupLabel: "",
      menus: commonMenus,
    },
    {
      groupLabel: "",
      menus: userRole === 1 || userRole === 3 ? peopleTeamMenus : [
        {
          href:"",
          label: "People Team",
          active: pathname === "/profile-management",
          icon: Users,
          submenus: [
        {   
          href: "/profile-management",
          label: "Profile Management",
          
        },
        {
          href: "/settings",
          label: "Profile Settings",
        },
        {
          href: "/travel-details",
          label: "Travel Details",
       },
        {
          href: "/exit-clearance",
          label: "Exit & Clearance",
        },
        {
          href: "/create-employee",
          label: "Employee Creation",

        },
        {
          href: "/customise-employees",
          label: "Customize Employee",
        },
          ],
        },        
        
      ],
      
    },
    {
      groupLabel: "",
      menus: userRole === 1 || userRole === 3 ? selfServiceHub : [
        {
          href: "",
          label: "Transfer Employee",
          active: pathname === "/internal",
          icon: SquarePen,
          submenus: [
            {
              href: "/internal",
              label: "Internal",
            },
            {
              href: "/external",
              label: "External",
            },
          ]
        }
      ]
    },
    {
      href: "/relocation",
      label: "Relocation",
      active: pathname === "/relocation",
    },
  ];
 
  return menuList;
}

export default getMenuList;



