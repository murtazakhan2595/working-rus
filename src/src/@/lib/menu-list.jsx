
import { Users, SquareStack, House, ArrowLeftRight, Award, CalendarClockIcon, CalendarRange, Crosshair, FileChartColumnIncreasing, ListTodo, UserRoundCheck, GalleryHorizontalEnd , UserRoundSearch, UsersRound, ListRestart, Settings2, PlaneTakeoff, DoorOpen, UserRoundPlus, UserRoundCog } from "lucide-react"


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

  const reportsMenu = [
    {
      to: "/reports",
      label: "Reports",
      active: pathname === "/reports",
      icon: GalleryHorizontalEnd ,
      submenus: [],
    },
  ]


  const peopleTeamMenus = [
    {
      to: "/profile-management",
      label: "Profile Management",
      active: pathname === "/profile-management",
      icon: UsersRound,
      submenus: [],
    },
    {
      to: "/settings",
      label: "Profile Settings",
      active: pathname === "/settings",
      icon: Settings2,
      submenus: [],
    },
    {
      to: "/travel-details",
      label: "Travel Details",
      active: pathname === "/travel-details",
      icon: PlaneTakeoff,
      submenus: [],
    },
    {
      to: "/exit-clearance",
      label: "Exit & Clearance",
      active: pathname === "/exit-clearance",
      icon: DoorOpen,
      submenus: [],
    },
    {
      to: "/create-employee",
      label: "Employee Creation",
      active: pathname === "/create-employee",
      icon: UserRoundPlus,
      submenus: [],
    },
    {
      to: "/customise-employees",
      label: "Customize Employee",
      active: pathname === "/customise-employees",
      icon: UserRoundCog,
      submenus: [],
    },
    {
      to: "/relocation",
      label: "Relocation",
      active: pathname === "/relocation",
      icon: ArrowLeftRight,
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

  const taskManagement = [

    {
      label: "Task Management",
      icon: ListTodo,
      active: pathname === "/my-task",
      submenus: [
        {
          label: "My Task",
          to: "/my-task"
        },
        {
          label: "My Team DTR",
          to: "/my-team"
        },
        {
          label: "Project Board",
          to: "/projects"
        },
        {
          label: "Time Management",
          to: "/attendence"
        }
      ]
    },
    {
      label: "Leave Management",
      icon: CalendarRange,
      active: pathname === "/leave-tracker",
      submenus: [
        {
          label: "Leave Tracker",
          to: "/leave-tracker"
        },
        {
          label: "Leave Request",
          to: "/leave-requests"
        },
        {
          label: "Calendar",
          to: "/leave-calender"
        },
        {
          label: "Leave History",
          to: "/leave-history"
        },
        {
          label: "Leave Allotment",
          to: "/leave-allotement"
        },
        {
          label: "Holidays",
          to: "/leave-balance"
        },
        {
          label: "Settings",
          icon: Settings2,
          submenus: [
            {
              label: "Leave Type",
              to: "/leave-type"
            }
          ]
        }
      ]
    }


  ]
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
        {
          to: "",
          label: "Transfer Employee",
          active: pathname === "/internal",
          icon: ArrowLeftRight,
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
        {
          href: "/relocation",
          label: "Relocation",
          active: pathname === "/relocation",
          icon: ListRestart,
          submenus: [],
        },
      ],
    },
    {
      // groupLabel: userRole === 1 || userRole === 3 ? "" : "Self Service Hub",
      menus: userRole === 1 || userRole === 2 || userRole === 4 || userRole === 3 ? selfServiceHub : [
        {
          to: "",
          label: "Self Service Hub",
          active: pathname === "/internal",
          icon: UserRoundCheck,
          submenus: [
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
          ]
        },
      ],
    }, {
      groupLabel: "",
      // groupLabel: userRole === 1 || userRole === 2 || userRole === 3 || userRole === 4 ? "" : "Task Management",
      menus: userRole === 1 || userRole === 2 || userRole === 3 || userRole === 4 ? taskManagement : [
        {
          to: "",
          label: "Task Management",
          icon: ListTodo,
          active: pathname === "/my-task",
          submenus: [
            {
              label: "My Task",
              to: "/my-task"
            },
            {
              label: "My Team DTR",
              to: "/my-team"
            },
            {
              label: "Project Board",
              to: "/projects"
            },
            {
              label: "Time Management",
              to: "/attendence"
            }
          ]
        },
        {
          label: "Leave Management",
          icon: CalendarRange,
          active: pathname === "/leave-tracker",
          submenus: [
            {
              label: "Leave Tracker",
              to: "/leave-tracker"
            },
            {
              label: "Leave Request",
              to: "/leave-requests"
            },
            {
              label: "Calendar",
              to: "/leave-calender"
            },
            {
              label: "Leave History",
              to: "/leave-history"
            },
            {
              label: "Leave Allotment",
              to: "/leave-allotement"
            },
            {
              label: "Holidays",
              to: "/leave-balance"
            },
            {
              label: "Settings",

              submenus: [
                {
                  label: "Leave Type",
                  to: "/leave-type"
                }
              ]
            }
          ]
        },
        {
          label: "Talent Sphere",
          icon: UserRoundSearch,
          active: pathname === "/personnel-requisition",
          submenus: [
            {
              label: "Personnel Requisition",
              to: "/personnel-requisition"
            },
            {
              label: "Jobs",
              to: "/jobs"
            },
            {
              label: "Applicants",
              to: "/applicants"
            },
            {
              label: "Referrals",
              to: "/referrals"
            },
          ]
        },
        {
          label: "Performance Management",
          icon: Award,
          active: pathname === "/employee-evaluation",
          submenus: [
            {
              label: "Employee Evaluation",
              to: "/employee-evaluation"
            },
          ]
        },
        {
          label: "Payroll & Attendance",
          icon: CalendarClockIcon,
          active: pathname === "/payroll",
          submenus: [
            {
              label: "Payroll",
              to: "/payroll"
            },
            {
              label: "Attendance",
              to: "/attendance"
            },
          ]
        },
        {
          label: "Personnel Development",
          icon: UsersRound,
          active: pathname === "/learn",
          submenus: [
            {
              label: "Learn",
              to: "/learn"
            },
            {
              label: "Career Planning",
              to: "/career-planning"
            },
            {
              label: "Succession Plan",
              to: "/succession-plan"
            },
          ]
        },
        {
          label: "People Enagement",
          icon: Crosshair,
          active: pathname === "/announcement",
          submenus: [
            {
              label: "Announcement",
              to: "/announcement"
            },
            {
              label: "Recognition",
              to: "/recognition"
            },
          ]
        },
        {
          label: "Daily Task Report",
          icon: FileChartColumnIncreasing,
          active: pathname === "/daily-task-report",
          submenus: [
            {
              label: "Create Task",
              to: "/create-task"
            },
            {
              label: "My DTR",
              to: "/my-dtr"
            },
          ]
        }

      ]
    },
    {
      groupLabel: "",
      menus: reportsMenu,
    },

  ];


  return menuList;
}

export default getMenuList;

