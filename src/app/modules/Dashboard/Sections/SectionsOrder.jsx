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
} from "../Screens";

const sectionClass =
  "grid-col-1 lg:gap-x-4 md:gap-x-4 sm:gap-x-0  gap-y-4 xl:grid lg:grid md:grid   xl:grid-cols-3 md:grid-cols-2 lg:grid-cols-3";
const DashboardHR = [
  {
    type: "div",
    className:
      "grid grid-col-1 gap-x-4 gap-y-4  xl:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 ",
    children: [
      {
        type: "div",
        className: "w-full",
        content: <EmployeeOverview />,
        value: "EmployeeOverview",
      },
      {
        type: "div",
        className: "w-full",
        content: <TaskProgress />,
        value: "TaskProgress",
      },
      {
        type: "div",
        className: "w-full",
        content: <RecentActivity />,
        value: "RecentActivity",
      },
    ],
  },
  {
    type: "div",
    className: "leave-tracker ",
    children: [
      {
        type: "div",
        className: `${sectionClass}`,
        content: <LeaveTrackerOverview />,
        value: "LeaveTracker",
      },
    ],
  },
  {
    type: "div",
    className: "talentsphere",
    children: [
      {
        type: "div",
        className: `${sectionClass}`,
        content: <TalentSphere />,
        value: "TalentSphere",
      },
    ],
  },
  {
    type: "div",
    className: `my-tasks ${sectionClass}`,
    children: [
      {
        type: "div",
        className: "col-span-2",
        content: <MyTasks />,
        value: "MyTasks",
      },
      {
        type: "div",
        className:
          "w-full xl:col-span-1 lg:col-span-1 md:col-span-2 sm:col-span-1",
        content: <AllProjects />,
        value: "AllProjects",
      },
    ],
  },
  {
    type: "div",
    className: `my-team ${sectionClass}`,
    children: [
      {
        type: "div",
        className: "w-full col-span-2",
        content: <MyLeaves />,
        value: "MyLeaves",
      },
      {
        type: "div",
        className:
          "w-full xl:col-span-1 lg:col-span-1 md:col-span-2 sm:col-span-1",
        content: <MyTeams />,
        value: "MyTeam",
      },
    ],
  },
];

const DashboardManager = [
  {
    type: "div",
    className: `${sectionClass}`,
    children: [
      {
        type: "div",
        className: "w-full",
        content: <EmployeeOverview />,
        value: "EmployeeOverview",
      },
      {
        type: "div",
        className: "w-full",
        content: <TaskProgress />,
        value: "TaskProgress",
      },
      {
        type: "div",
        className: "w-full",
        content: <RecentActivity />,
        value: "RecentActivity",
      },
    ],
  },
  {
    type: "div",
    className: "leave-tracker ",
    children: [
      {
        type: "div",
        className: `${sectionClass}`,
        content: <LeaveTrackerOverview />,
        value: "LeaveTracker",
      },
    ],
  },

  {
    type: "div",
    className: `${sectionClass} my-tasks`,
    children: [
      {
        type: "div",
        className: "col-span-2",
        content: <MyTasks />,
        value: "MyTasks",
      },
    ],
  },
];
const DashboardEmployee = [

  {
    type: "div",
    className: `my-tasks ${sectionClass}`,
    children: [
      {
        type: "div",
        className: "col-span-2",
        content: <MyTasks />,
        value: "MyTasks",
      },
      {
        type: "div",
        className:
          "w-full xl:col-span-1 lg:col-span-1 md:col-span-2 sm:col-span-1",
        content: <AllProjects />,
        value: "AllProjects",
      },
    ],
  },
  {
    type: "div",
    className: `${sectionClass} my-team`,
    children: [
      {
        type: "div",
        className: "w-full col-span-2",
        content: <MyLeaves />,
        value: "MyLeaves",
      },
      {
        type: "div",
        className:
          "w-full xl:col-span-1 lg:col-span-1 md:col-span-2 sm:col-span-1",
        content: <MyTeams />,
        value: "MyTeam",
      },
    ],
  },
];
export const getDashboard = (userRole) => {
  if (userRole === 3 || userRole === 1) {
    return DashboardHR;
  } else if (userRole === 2) {
    return DashboardManager;
  } else return DashboardEmployee;
};
