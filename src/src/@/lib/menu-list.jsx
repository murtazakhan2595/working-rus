import {
  Users,
  SquareStack,
  House,
  ArrowLeftRight,
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
  Settings2,
} from "lucide-react";

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
  const userRolesMap = {
    isPeopleTeam: userRole.userRole === 1 || userRole.userRole === 3,
    isSelfServiceHub: userRole.userRole === 1 || userRole.userRole === 2 || userRole.userRole === 3 || userRole.userRole === 4,
    isTaskManagement: userRole.userRole === 1 || userRole.userRole === 2 || userRole.userRole === 3 || userRole.userRole === 4,
    isTalentSphere: userRole.userRole === 1 || userRole.userRole === 2 || userRole.userRole === 3,
    isPayrollAttendance: userRole.userRole === 1 || userRole.userRole === 2 || userRole.userRole === 3,
    isReportsMenu: userRole.userRole === 1 || userRole.userRole === 2,
    performanceManagementMenus: userRole.userRole === 1 || userRole.userRole === 2 || userRole.userRole === 3,
    dailyTaskReportMenus: userRole.userRole === 1 || userRole.userRole === 2 || userRole.userRole === 3,
    personalDevelopmentMenus: userRole.userRole === 1 || userRole.userRole === 2 || userRole.userRole === 3
  };

  const createMenu = (to, label, icon, submenus = [], active = pathname === to) => ({
    to,
    label,
    active,
    icon,
    submenus,
  });

  const commonMenus = [
    createMenu("/services", "Services", SquareStack),
    createMenu("/", "Dashboard", House),
    
  ];

  const peopleTeamMenus = [
    createMenu("", "People Team", Users, [
      createMenu("/profile-management", "Profile Management"),
      createMenu("/settings", "Profile Settings"),
      createMenu("/travel-details", "Travel Details"),
      createMenu("/exit-clearance", "Exit & Clearance"),
      createMenu("/create-employee", "Employee Creation"),
      createMenu("/customise-employees", "Customize Employee"),
      createMenu("/relocation", "Relocation"),
    ], pathname === "/profile-management"),
    createMenu("", "Transfer Employee", ArrowLeftRight, [
      createMenu("/internal", "Internal"),
      createMenu("/external", "External"),
    ], pathname === "/internal"),
  ];

  const selfServiceHubMenus = [
    createMenu("", "Self Service Hub", UserRoundCheck, [
      createMenu("/my-profile", "My Profile", Users),
      createMenu("/my-team", "My Team", Users),
      createMenu("/calendar", "Calendar", Users),
      createMenu("/attendance", "Attendance", Users),
      createMenu("/leave-tracker", "Leave Tracker", Users),
      createMenu("/files-data", "Files & Data", Users),
      createMenu("/my-travel-details", "My Travel Details", Users),
      createMenu("/exit-employee", "Exit", Users),
    ], pathname === "/internal"),
  ];

  const taskManagementMenus = [
    createMenu("", "Task Management", ListTodo, [
      createMenu("/my-task", "My Task"),
      createMenu("/my-team", "My Team DTR"),
      createMenu("/projects", "Project Board"),
      createMenu("/attendence", "Time Management"),
    ], pathname === "/my-task"),
    createMenu("", "Leave Management", CalendarRange, [
      createMenu("/leave-tracker", "Leave Tracker"),
      createMenu("/leave-requests", "Leave Request"),
      createMenu("/leave-calender", "Calendar"),
      createMenu("/leave-history", "Leave History"),
      createMenu("/leave-allotement", "Leave Allotment"),
      createMenu("/leave-balance", "Holidays"),
      createMenu("", "Settings", Settings2, [createMenu("/leave-type", "Leave Type")]),
    ], pathname === "/leave-tracker"),
  ];

  const talentSphereMenus = [
    createMenu("", "Talent Sphere", UserRoundSearch, [
      createMenu("/personnel-requisition", "Personnel Requisition"),
      createMenu("/jobs", "Jobs"),
      createMenu("/applicants", "Applicants"),
      createMenu("/referrals", "Referrals"),
    ], pathname === "/personnel-requisition"),
  ];

  const dailyTaskReportMenus = [
    createMenu("", "Daily Task Report", FileChartColumnIncreasing, [
      createMenu("/create-task", "Create Task"),
      createMenu("/my-dtr", "My DTR"),
    ], pathname === "/daily-task-report"),
  ];

  const personalDevelopmentMenus = [
    createMenu("", "Personal Development", UsersRound, [
      createMenu("/learn", "Learn"),
      createMenu("/career-planning", "Career Planning"),
      createMenu("/succession-plan", "Succession Plan"),
    ], pathname === "/learn"),
  ];

  const payrollAndAttendanceMenus = [
    createMenu("", "Payroll & Attendance", CalendarClockIcon, [
      createMenu("/payroll", "Payroll"),
      createMenu("/attendance", "Attendance"),
    ], pathname === "/payroll"),
  ];

  const peopleEngagementMenus = [
    createMenu("", "People Engagement", Crosshair, [
      createMenu("/announcement", "Announcement"),
      createMenu("/recognition", "Recognition"),
    ], pathname === "/announcement"),
  ];

  const performanceManagementMenus = [
    createMenu("", "Performance Management", Award, [
      createMenu("/employee-evaluation", "Employee Evaluation"),
    ], pathname === "/employee-evaluation"),
  ];

  const reportsMenus = [
    createMenu("/reports", "Reports", GalleryHorizontalEnd, [], pathname === "/reports"),
  ];

  const menuList = [
    { groupLabel: "", menus: commonMenus },
    userRolesMap.isPeopleTeam && { groupLabel: "", menus: peopleTeamMenus },
    userRolesMap.isSelfServiceHub && { groupLabel: "", menus: selfServiceHubMenus },
    userRolesMap.isTaskManagement && { groupLabel: "", menus: taskManagementMenus },
    userRolesMap.isTalentSphere && { groupLabel: "", menus: talentSphereMenus },
    userRolesMap.performanceManagementMenus && {groupLabel:"", menus: performanceManagementMenus},
    userRolesMap.isPayrollAttendance && { groupLabel: "", menus: payrollAndAttendanceMenus },
    userRolesMap.dailyTaskReportMenus && {groupLabel:"", menus: dailyTaskReportMenus},
    userRolesMap.personalDevelopmentMenus && { groupLabel:"", menus: personalDevelopmentMenus},
    { groupLabel: "", menus: peopleEngagementMenus },
    userRolesMap.isReportsMenu && { groupLabel: "", menus: reportsMenus },
  ].filter(Boolean);

  return menuList;
}

export default getMenuList;
