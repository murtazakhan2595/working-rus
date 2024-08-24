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
    ProfileManagement,
    LeaveBalance,
  } from "../Screens";
  const DashboardHR = [
  {
    type: "div",
    className: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
    children: [
      {
        type: "div",
        className: "w-full",
        content: <EmployeeOverview/>,
        value: "EmployeeOverview",
      },
      {
        type: "div",
        className: "w-full",
        content: <TaskProgress/>,
        value: "TaskProgress",
      },
      {
        type: "div",
        className: "w-full",
        content: <RecentActivity/>,
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
        className: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
        content: <LeaveTrackerOverview/>,
        value: "LeaveTracker",
      },
     
    ]
  },
  {
    type: "div",
    className: "talentsphere",
    children: [
      {
      type: "div",
      className: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
      content: <TalentSphere/>,
      value: "TalentSphere",
      },
    ]
  },
  {
    type: "div",
    className: "my-tasks grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
    children: [
      {
      type: "div",
      className: "col-span-2",
      content: <MyTasks/>,
      value: "MyTasks",
      },
      {
      type: "div",
      className: "",
      content: <AllProjects/>,
      value: "AllProjects",
      },
      
    ]
  },
  {
    type: "div",
    className: "my-teams ",
    children: [
      {
      type: "div",
      className: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
      content: <MyTeams/>,
      value: "MyTeams",
      },
    ]
  },
  
  {
    type: "div",
    className: "my-leaves",
    children: [
      {
      type: "div",
      className: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
      content: <MyLeaves/>,
      value: "MyLeaves",
      },
    ]
  },
  
{
  type: "div",
  className: "my-teams",
  children: [
    {
    type: "div",
    className: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
    content: <MyTeams />,
    value: "MyTeam",
    },
  ]
}]
  
const DashboardManager = [
  {
    type: "div",
    className: "flex flex-wrap w-[100%] lg:w-[70%]",
    children: [
      {
        type: "div",
        className: "w-[100%] md:w-[50%] overflow-hidden p-2",
        content: <MyLeaves />,
        value: "MyLeaves",
      },
      {
        type: "div",
        className: "h-[290px] w-[100%] md:w-[50%] overflow-hidden p-2",
        content: <TaskProgress />,
        value: "TaskProgress",
      },
      {
        type: "div",
        className: "w-[100%] overflow-hidden p-2",
        content: <LeaveTrackerOverview />,
        value: "LeaveTracker",
      },
      {
        type: "div",
        className: "w-[100%] overflow-hidden p-2",
        content: <AllProjects />,
        value: "AllProjects",
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
        content: <RecentActivity />,
        value: "RecentActivity",
      },
      {
        type: "div",
        className: "w-[100%] overflow-hidden p-2",
        content: <MyTasks />,
        value: "MyTasks",
      },
      {
        type: "div",
        className: "w-[100%] overflow-hidden p-2",
        content: <MyTeams />,
        value: "MyTeam",
      },
    ],
  },
];
const DashboardEmployee = [
  {
    type: "div",
    className: "flex flex-wrap w-[70%] gap-0 gap-x-0 gap-y-0",
    children: [
      {
        type: "div",
        className: " w-[100%] md:w-[50%] overflow-hidden p-2",
        content: <ProfileManagement />,
        value: "ProfileManagement",
      },
      {
        type: "div",
        className: " w-[100%] md:w-[50%] overflow-hidden p-2",
        content: <LeaveBalance />,
        value: "LeaveBalance",
      },
      {
        type: "div",
        className: " w-[100%] md:w-[50%] overflow-hidden p-2",
        content: <TaskProgress />,
        value: "TaskProgress",
      },

      {
        type: "div",
        className: " w-[100%] md:w-[50%] overflow-hidden p-2",
        content: <AllProjects />,
        value: "AllProjects",
      },
      {
        type: "div",
        className: " w-[100%] md:w-[50%] overflow-hidden p-2",
        content: <MyTeams />,
        value: "MyTeam",
      },
      {
        type: "div",
        className: "h-[341px] w-[100%] md:w-[50%] overflow-hidden p-2",
        content: <MyLeaves />,
        value: "MyLeaves",
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
        content: <RecentActivity />,
        value: "RecentActivity",
      },
      {
        type: "div",
        className: "w-[100%] overflow-hidden p-2",
        content: <MyTasks />,
        value: "MyTasks",
      },
    ],
  },
];
export const getDashboard = (userRole) => {
  if (userRole === 3 || userRole === 1) {
    return DashboardHR;
  } else if (userRole === 2) {
    return DashboardManager;
  }
  else return DashboardEmployee;
};
