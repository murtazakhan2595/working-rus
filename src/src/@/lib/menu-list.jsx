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
} from "lucide-react";
import Config from "constants/config";

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
    isPeopleTeam: userRole === 1 || userRole === 3,
    isTeamManagement: userRole === 2,
    isOfficeSetting: userRole === 1 || userRole === 3,
    isSelfServiceHub:
      userRole === 1 || userRole === 2 || userRole === 3 || userRole === 4,
    isPayroll: userRole === 1 || userRole === 2 || userRole === 3,
    isTaskManagement:
      userRole === 1 || userRole === 2 || userRole === 3 || userRole === 4,
    isTalentSphere: userRole === 1 || userRole === 3,
    isLeaveTracker: userRole === 1 || userRole === 2 || userRole === 3,
    isPayrollAttendance: userRole === 1 || userRole === 2 || userRole === 3,
    isReportsMenu: userRole === 1 || userRole === 2,
    performanceManagementMenus:
      userRole === 1 || userRole === 2 || userRole === 3,
    dailyTaskReportMenus:
      userRole === 1 || userRole === 2 || userRole === 3 || userRole === 4,
    personalDevelopmentMenus:
      userRole === 1 || userRole === 2 || userRole === 3,
    peopleEngagementMenus:
      userRole === 1 || userRole === 2 || userRole === 3 || userRole === 4,
    organizationalChart: true,
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
      "People Team",
      Users,
      [
        Config.PROFIL_MANAGMENT &&
          userRole !== 2 &&
          createMenu("/profile-management", "Profile Management"),
        // createMenu("/settings", "Profile Settings"),
        // createMenu("/travel-details", "Travel Details"),
        Config.EMPLOYEE_OFFBOARDING &&
          createMenu("/exit-clearance", "Exit & Clearance"),
        Config.PROFIL_MANAGMENT &&
          userRole !== 2 &&
          createMenu("/create-employee", "Employee Creation"),
        // createMenu("/edit-employee", "Customize Employee"),
        // createMenu("/relocation", "Relocation"),
        // createMenu("/internal", "Internal"),
        // createMenu("/external", "External"),
      ].filter(Boolean)
    ),
  ];

  const teamManagmentMenus = [
    createMenu(
      "",
      "Team Management",
      Users,
      [
        Config.PROFIL_MANAGMENT &&
          createMenu("/team-profile-management", "Team Profile"),
        // createMenu("/settings", "Profile Settings"),
        // createMenu("/travel-details", "Travel Details"),
        Config.EMPLOYEE_OFFBOARDING &&
          createMenu("/exit-clearance", "Exit & Clearance"),
        // createMenu("/edit-employee", "Customize Employee"),
        // createMenu("/relocation", "Relocation"),
        // createMenu("/internal", "Internal"),
        // createMenu("/external", "External"),
      ].filter(Boolean)
    ),
  ];

  const selfServiceHubMenus = [
    createMenu(
      "",
      "Self Service Hub ",
      UserRoundCheck,
      [
        createMenu("/my-profile", "My Profile"),
        // createMenu("/my-team", "My Team"),
        // createMenu("/calendar", "Calendar"),
        Config.MY_ATTENDANCE && createMenu("/my-attendance", "My Attendance"),
        Config.MY_DAILY_TASK_REPORT &&
          createMenu("/my-dtr", "Daily Task Report"),

        createMenu("/my-leave-tracker", " My Leave Tracker"),
        // createMenu("/files-data", "Files & Data"),
        // createMenu("/my-travel-details", "My Travel Details"),
        createMenu("/my-payroll", "My Payroll"),
        createMenu("/my-claims", "My Claims"),
        createMenu("/exit-employee", "Exit"),
        // createMenu("/letter1", "Type of Letter 1"),
        // createMenu("/letter2", "Type of Letter 2"),
      ].filter(Boolean)
    ),
  ];

  const payrollMenus = [
    createMenu("", "Payroll", BadgeDollarSign, [
      // createMenu("/payroll", "Employee Payrolls"),
      ...(userRole !== 2 ? [createMenu("/payroll", "Employee Payrolls")] : []),
      ...(userRole !== 2 ? [createMenu("/salary-setup", "Salary Setup")] : []),
      createMenu("/claim-request", "Claim Request"),
      ...(userRole !== 2 ? [createMenu("/pay-run", "Pay Run")] : []),
      // createMenu("/salary-setup", "Salary Setup"),
      // createMenu("/loans", "Loans"),
      // createMenu("/pay-run", "Pay Run"),
      // createMenu("/payslips", "Payslips"),
    ]),
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
        Config.TS_PERSONAL_REQUISITION &&
          createMenu("/personnel-requisition", "Personnel Requisition"),
        Config.TS_JOBS && createMenu("/jobs", "Jobs"),
        Config.TS_APPLICANTS && createMenu("/applicants", "Applicants"),
        Config.TS_REFERRALS && createMenu("/referrals", "Referrals"),
        Config.TS_ON_BOARDING && createMenu("/on-boarding", "On Boarding"),
      ].filter(Boolean), // Filter out undefined values
      pathname === "/personnel-requisition"
    ),
  ];

  const dailyTaskReportMenus = [
    createMenu(
      "",
      "Daily Task Report",
      FileChartColumnIncreasing,
      [createMenu("/create-task", "Create Task")],
      pathname === "/my-dtr"
    ),
  ];

  const personalDevelopmentMenus = [
    createMenu(
      "",
      "Personal Development",
      UsersRound,
      [
        createMenu("/learn", "Learn"),
        createMenu("/career-planning", "Career Planning"),
        createMenu("/succession-plan", "Succession Plan"),
      ],
      pathname === "/learn"
    ),
  ];

  const AndAttendanceMenus = [
    createMenu("", "Attendance", CalendarClockIcon, [
      createMenu("/attendance", "Attendance"),
      createMenu("/shift-calendar", "Shift Calendar"),
      createMenu("/employee-dtrs", "Daily Tasks Report"),
    ]),
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

  const OfficeSettingMenu = [
    createMenu("/office-settings", "Office Setting", Settings),
    // createMenu("/services", "Services", SquareStack),
  ];
  const organizationalChartMenu = [
    createMenu("/organizational-chart", "Organization Chart", Network),
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
    userRolesMap.isSelfServiceHub &&
      Config.SELF_SERVICE_HUB && {
        groupLabel: "",
        menus: selfServiceHubMenus,
      },
    userRolesMap.isTeamManagement &&
      Config.TEAM_MANAGEMENT && { groupLabel: "", menus: teamManagmentMenus },
    userRolesMap.isPeopleTeam &&
      Config.PROFIL_MANAGMENT && { groupLabel: "", menus: peopleTeamMenus },
    userRolesMap.isPayrollAttendance &&
      Config.ATTENDANCE && {
        groupLabel: "",
        menus: AndAttendanceMenus,
      },
    userRolesMap.isLeaveTracker &&
      Config.LEAVE_MANAGMENT && {
        groupLabel: "",
        menus: leaveTrackerMenus,
      },
    userRolesMap.isPayroll &&
      Config.PAYROLL && {
        groupLabel: "",
        menus: payrollMenus,
      },
    userRolesMap.isTaskManagement &&
      Config.TASK_MANAGMENT && {
        groupLabel: "",
        menus: taskManagementMenus,
      },
    userRolesMap.isTalentSphere &&
      Config.TALENT_SPHERE && { groupLabel: "", menus: talentSphereMenus },
    userRolesMap.organizationalChart &&
      Config.ORGANIZATIONAL_CHART && {
        groupLabel: "",
        menus: organizationalChartMenu,
      },
    userRolesMap.performanceManagementMenus &&
      Config.PERFORMANCE_MANAGEMENT && {
        groupLabel: "",
        menus: performanceManagementMenus,
      },

    // userRolesMap.dailyTaskReportMenus &&
    //   Config.DAILY_TASK_REPORT && {
    //     groupLabel: "",
    //     menus: dailyTaskReportMenus,
    //   },
    userRolesMap.personalDevelopmentMenus &&
      Config.PERSONAL_DEVELOPMENT && {
        groupLabel: "",
        menus: personalDevelopmentMenus,
      },
    userRolesMap.peopleEngagementMenus &&
      Config.PEOPLE_ENGAGEMENT && {
        groupLabel: "",
        menus: peopleEngagementMenus,
      },
    userRolesMap.isReportsMenu &&
      Config.REPORTS && { groupLabel: "", menus: reportsMenus },
    userRolesMap.isOfficeSetting &&
      Config.OFFICE_SETTING && { groupLabel: "", menus: OfficeSettingMenu },
  ].filter(Boolean);

  return menuList;
}

export default getMenuList;
