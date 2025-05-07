import Notifications from "app/modules/Notifications";
import {
  RecentActivity,
  MyTasks,
  EmployeeOverview,
  LeaveTrackerOverview,
  TalentSphere,
  MyLeaves,
  AllProjects,
  MyTeams,
  TaskProgress,
  LeaveEmployeeDetails,
  OnGoingApplications,
  ExpiredDocuments,
  MyAttendanceSumary,
  ProfileCompletion,
  ShiftDetailsWidget,
  MonthlyAttendanceCalendar,
  EventCalendar,
  AttritionAndNewJoinersWidget,
  DepartmentAttendanceWidget,
  CompanyAttendanceOverview,
  ShiftComplianceWidget,
} from "../Screens";

const DashboardHR = [
  {
    type: "div",
    className: `w-full`,
    content: <EmployeeOverview />,
    value: "EmployeeOverview",
  },
  // {
  //   type: "div",
  //   className: `w-full`,
  //   content: <TaskProgress />,
  //   value: "TaskProgress",
  // },
  {
    type: "div",
    className: `w-full`,
    content: <RecentActivity />,
    value: "RecentActivity",
  },

  {
    type: "div",
    className: `col-span-2`,
    content: <LeaveTrackerOverview />,
    value: "LeaveTracker",
  },

  // {
  //   type: "div",
  //   className: `w-full`,
  //   content: <LeaveEmployeeDetails />,
  //   value: "LeaveEmployeeDetails",
  // },
  // {
  //   type: "div",
  //   className: `col-span-2`,
  //   content: <TalentSphere />,
  //   value: "TalentSphere",
  // },
  // {
  //   type: "div",
  //   className: `w-full`,
  //   content: <OnGoingApplications />,
  //   value: "OnGoingApplications",
  // },

  // {
  //   type: "div",
  //   className: `col-span-2`,
  //   content: <MyTasks />,
  //   value: "MyTasks",
  // },
  // {
  //   type: "div",
  //   className: `w-full`,
  //   content: <AllProjects />,
  //   value: "AllProjects",
  // },

  {
    type: "div",
    className: `col-span-2`,
    content: <MyLeaves />,
    value: "MyLeaves",
  },
  // {
  //   type: "div",
  //   className: `w-full`,
  //   content: <MyTeams />,
  //   value: "MyTeam",
  // },
  {
    type: "div",
    className: `w-full`,
    content: <ExpiredDocuments />,
    value: "ExpiredDocuments",
  },
  {
    type: "div",
    className: `w-full`,
    content: <EventCalendar />,
    value: "EventCalendar",
  },
  {
    type: "div",
    className: `w-full`,
    content: <AttritionAndNewJoinersWidget />,
    value: "AttritionAndNewJoinersWidget",
  },
  {
    type: "div",
    className: `w-full`,
    content: <CompanyAttendanceOverview />,
    value: "CompanyAttendanceOverview",
  },
  {
    type: "div",
    className: `col-span-2`,
    content: <DepartmentAttendanceWidget />,
    value: "DepartmentAttendanceWidget",
  },
  {
    type: "div",
    className: `col-span-2`,
    content: <ShiftComplianceWidget />,
    value: "ShiftComplianceWidget",
  },
];

const DashboardManager = [
  {
    type: "div",
    className: `w-full`,
    content: <EmployeeOverview />,
    value: "EmployeeOverview",
  },
  {
    type: "div",
    className: `w-full`,
    content: <TaskProgress />,
    value: "TaskProgress",
  },
  {
    type: "div",
    className: `w-full`,
    content: <RecentActivity />,
    value: "RecentActivity",
  },

  {
    type: "div",
    className: `col-span-2`,
    content: <LeaveTrackerOverview />,
    value: "LeaveTracker",
  },
  {
    type: "div",
    className: `w-full`,
    content: <LeaveEmployeeDetails />,
    value: "LeaveEmployeeDetails",
  },
  {
    type: "div",
    className: `col-span-2`,
    content: <MyTasks />,
    value: "MyTasks",
  },
];
const DashboardEmployee = [
  {
    type: "div",
    className: `w-full`,
    content: <MyAttendanceSumary />,
    value: "MyAttendanceSumary",
  },
  {
    type: "div",
    className: `w-full`,
    content: <EventCalendar />,
    value: "EventCalendar",
  },
  {
    type: "div",
    className: `w-full`,
    content: <ProfileCompletion />,
    value: "ProfileCompletion",
  },

  {
    type: "div",
    className: "w-full col-span-2",
    content: <MyLeaves />,
    value: "MyLeaves",
  },
  {
    type: "div",
    className: "w-full",
    content: <ShiftDetailsWidget />,
    value: "ShiftDetailsWidget",
  },
  {
    type: "div",
    className: "w-full",
    content: <ExpiredDocuments />,
    value: "ExpiredDocuments",
  },
  {
    type: "div",
    className: `w-full`,
    content: <RecentActivity />,
    value: "RecentActivity",
  },
  {
    type: "div",
    className: `w-full`,
    content: <MonthlyAttendanceCalendar />,
    value: "MonthlyAttendanceCalendar",
  },
];
export const getDashboard = (userRole) => {
  if (userRole === 3 || userRole === 1) {
    return DashboardHR;
  } else if (userRole === 2) {
    return DashboardManager;
  } else return DashboardEmployee;
};
