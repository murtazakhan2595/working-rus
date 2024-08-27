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
    className: "my-team grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
    children: [
      {
        type: "div",
        className: "w-full col-span-2",
        content: <MyLeaves/>,
        value: "MyLeaves",
        },
        {
        type: "div",
        className: "",
        content: <MyTeams />,
        value: "MyTeam",
      },
      
      
    ]
  },
]
  
const DashboardManager = [
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
        content: <MyTeams />,
        value: "MyTeam",
      },
      
    ]
  },
  
];
const DashboardEmployee = [
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
    className: "my-team grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
    children: [
      {
        type: "div",
        className: "w-full col-span-2",
        content: <MyLeaves/>,
        value: "MyLeaves",
        },
        {
        type: "div",
        className: "",
        content: <MyTeams />,
        value: "MyTeam",
      },
      
      
    ]
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
