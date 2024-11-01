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
} from "lucide-react";

/**
 * @typedef {Object} Group
 * @property {string} groupLabel - The label for the group.
 * @property {Menu[]} menus - The list of menus in the group.
 */
// export const UserRoles = [
//   { value: 1, label: "Super Admin" },
//   { value: 2, label: "Manager" },
//   { value: 3, label: "HR" },
//   { value: 4, label: "Employee" },
// ];
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
  const userRolesMap = {
    isPeopleTeam: userRole === 1 || userRole === 3 || userRole ===2,
    isSelfServiceHub:  userRole === 1 || userRole === 2 || userRole === 3 || userRole === 4,
    isPayroll: userRole === 1 || userRole === 2 || userRole === 3,    
    isTaskManagement:
      userRole === 1 || userRole === 2 || userRole === 3 || userRole === 4,
    isTalentSphere: userRole === 1 || userRole === 2 || userRole === 3,
    isLeaveTracker: userRole === 1 || userRole === 2 || userRole === 3,
    isPayrollAttendance: userRole === 1 || userRole === 2 || userRole === 3,
    isReportsMenu: userRole === 1 || userRole === 2,
    performanceManagementMenus:
      userRole === 1 || userRole === 2 || userRole === 3,
    dailyTaskReportMenus: userRole === 1 || userRole === 2 || userRole === 3,
    personalDevelopmentMenus:
      userRole === 1 || userRole === 2 || userRole === 3,
    peopleEngagementMenus:
      userRole === 1 || userRole === 2 || userRole === 3 || userRole === 4,
  };

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

  const commonMenus = [
    createMenu("/", "Dashboard", House),
    // createMenu("/services", "Services", SquareStack),
  ];

  const peopleTeamMenus = [
    createMenu(
      "",
      "Team Management",
      Users,
      [
        ...(userRole !== 2 ? [createMenu("/profile-management", "Profile Management")] : []),
        // createMenu("/settings", "Profile Settings"),
        // createMenu("/travel-details", "Travel Details"),
        ...(userRole !== 2 ? [createMenu("/create-employee", "Employee Creation")] : []),
        createMenu("/exit-clearance", "Exit & Clearance"),
        // createMenu("/edit-employee", "Customize Employee"),
        // createMenu("/relocation", "Relocation"),
        // createMenu("/internal", "Internal"),
        // createMenu("/external", "External"),
      ],
    ),
  ];

  const selfServiceHubMenus = [
    createMenu("", "Self Service Hub ", UserRoundCheck, [
      createMenu("/my-profile", "My Profile"),
      // createMenu("/my-team", "My Team"),
      // createMenu("/calendar", "Calendar"),
      createMenu("/attendance", "Attendance"),
      createMenu("/my-leave-tracker", " My Leave Tracker"),
      // createMenu("/files-data", "Files & Data"),
      // createMenu("/my-travel-details", "My Travel Details"),
      createMenu("/my-payroll", "My Payroll"),
      createMenu("/my-claims", "My Claims"),
      createMenu("/exit-employee", "Exit"),
      // createMenu("/letter1", "Type of Letter 1"),
      // createMenu("/letter2", "Type of Letter 2"),
    ]),
  ];


  const payrollMenus = [
    createMenu(
      "",
      "Payroll",
      BadgeDollarSign ,
      [
        createMenu("/payroll", "Employee Payrolls"),
        createMenu("/salary-setup", "Salary Setup"),
        // createMenu("/loans", "Loans"),
        createMenu("/claim-request", "Claim Request"),
        createMenu("/pay-run", "Pay Run"),
        // createMenu("/payslips", "Payslips"),
        
      ],
    ),
  ];

  

  

  const taskManagementMenus = [
    createMenu(
      "",
      "Task Management",
      ListTodo,
      [
        // createMenu("/my-task", "My Task"),
        // createMenu("/my-team", "My Team DTR"),
        createMenu("/projects", "Project Board"),
        // createMenu("/attendence", "Time Management"),
      ],
      pathname === "/my-task"
    ),
  ];
  const leaveTrackerMenus = [
    createMenu(
      "",
      "Leave Tracker",
      CalendarRange,
      [
        createMenu("/leave-records", "Leave Records"),
        createMenu("/leave-request", "Leave Request"),
      ],
      pathname === "/leave-tracker"
    ),
  ];

  const talentSphereMenus = [
    createMenu(
      "",
      "Talent Sphere",
      UserRoundSearch,
      [
        // createMenu("/personnel-requisition", "Personnel Requisition"),
        createMenu("/jobs", "Jobs"),
        createMenu("/applicants", "Applicants"),
        // createMenu("/referrals", "Referrals"),
        // createMenu("/on-boarding", "On Boarding"),
      ],
      pathname === "/personnel-requisition"
    ),
  ];

  const dailyTaskReportMenus = [
    createMenu(
      "",
      "Daily Task Report",
      FileChartColumnIncreasing,
      [
        // createMenu("/create-task", "Create Task"),
        // createMenu("/my-dtr", "My DTR"),
      ],
      // pathname === "/daily-task-report"
    ),
  ];

  const personalDevelopmentMenus = [
    createMenu(
      "",
      "Personal Development",
      UsersRound,
      [ 
        // createMenu("/learn", "Learn"),
        // createMenu("/career-planning", "Career Planning"),
        // createMenu("/succession-plan", "Succession Plan"),
      ],
      pathname === "/learn"
    ),
  ];

  const AndAttendanceMenus = [
    createMenu(
      "",
      "Attendance",
      CalendarClockIcon,
      [
        createMenu("/attendance", "Attendance"),
      ],
     
    ),
  ];

  const peopleEngagementMenus = [
    createMenu(
      "",
      "People Engagement",
      Crosshair,
      [
        createMenu("/announcement", "Announcement"),
        createMenu("/recognition", "Recognition"),
      ],
      pathname === "/announcement"
    ),
  ];

  const performanceManagementMenus = [
    createMenu(
      "",
      "Performance Management",
      Award,
      [createMenu("/employee-evaluation", "Employee Evaluation")],
      pathname === "/employee-evaluation"
    ),
  ];

  const reportsMenus = [
    createMenu(
      "/reports",
      "Reports",
      GalleryHorizontalEnd,
      [],
      pathname === "/reports"
    ),
  ];

  const menuList = [
    { groupLabel: "", menus: commonMenus },
    userRolesMap.isPeopleTeam && { groupLabel: "", menus: peopleTeamMenus },
    userRolesMap.isSelfServiceHub && {
      groupLabel: "",
      menus: selfServiceHubMenus,
    },
    userRolesMap.isLeaveTracker && {
      groupLabel: "",
      menus: leaveTrackerMenus,
    },
    userRolesMap.isPayroll && {
      groupLabel: "",
      menus: payrollMenus,
    },
    userRolesMap.isTaskManagement && {
      groupLabel: "",
      menus: taskManagementMenus,
    },
    userRolesMap.isTalentSphere && { groupLabel: "", menus: talentSphereMenus },
    userRolesMap.performanceManagementMenus && {
      groupLabel: "",
      menus: performanceManagementMenus,
    },
    userRolesMap.isPayrollAttendance && {
      groupLabel: "",
      menus: AndAttendanceMenus,
    },
    userRolesMap.dailyTaskReportMenus && {
      groupLabel: "",
      menus: dailyTaskReportMenus,
    },
    userRolesMap.personalDevelopmentMenus && {
      groupLabel: "",
      menus: personalDevelopmentMenus,
    },
    userRolesMap.peopleEngagementMenus && {
      groupLabel: "",
      menus: peopleEngagementMenus,
    },
    userRolesMap.isReportsMenu && { groupLabel: "", menus: reportsMenus },
  ].filter(Boolean);

  return menuList;
}

export default getMenuList;
