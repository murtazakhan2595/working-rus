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
  const DashboardHR = [
  {
    type: "div",
    className: "flex flex-wrap w-[100%] lg:w-[70%]",
    children: [
      {
        type: "div",
        className: "h-[290px] w-[100%] md:w-[50%] overflow-hidden p-2",
        content: <EmployeeOverview/>,
        value: "EmployeeOverview",
      },
      {
        type: "div",
        className: "h-[290px] w-[100%] md:w-[50%] overflow-hidden p-2",
        content: <TaskProgress/>,
        value: "TaskProgress",
      },
      {
        type: "div",
        className: "w-[100%] overflow-hidden p-2",
        content: <LeaveTrackerOverview/>,
        value: "LeaveTracker",
      },
      {
        type: "div",
        className: "w-[100%] overflow-hidden p-2",
        content: <TalentSphere/>,
        value: "TalentSphere",
      },
    ],
  },
  {
    type: "div",
    className: "flex flex-wrap w-[100%] lg:w-[30%]",
    children: [
      {
        type: "div",
        className: "w-[100%] overflow-hidden p-2",
        content: <RecentActivity/>,
        value: "RecentActivity",
      },
      {
        type: "div",
        className: "w-[100%] overflow-hidden p-2",
        content: <MyTasks/>,
        value: "MyTasks",
      },
      {
        type: "div",
        className: "w-[100%] overflow-hidden p-2",
        content: <MyTeams/>,
        value: "MyTeam",
      },
    ],
  },
  {
    type: "div",
    className: " flex flex-wrap w-[100%]",
    children: [
      {
        type: "div",
        className: "w-[100%] md:w-[30%] overflow-hidden p-2",
        content: <MyLeaves/>,
        value: "MyLeaves",
      },
      {
        type: "div",
        className: "w-[100%] md:w-[70%] overflow-hidden p-2",
        content: <AllProjects/>,
        value: "AllProjects",
      },
    ],
  },
];

export const getDashboard = (userRole) => {
  if (userRole === 3 || userRole === 1) {
    return DashboardHR;
  } else {
    return DashboardHR;
  }
};
