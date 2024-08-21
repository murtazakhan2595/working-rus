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
        className: "",
        content: <EmployeeOverview/>,
        value: "EmployeeOverview",
      },
      {
        type: "div",
        className: "",
        content: <TaskProgress/>,
        value: "TaskProgress",
      },
      {
        type: "div",
        className: "",
        content: <RecentActivity/>,
        value: "RecentActivity",
      },
    ],
  },
  {
    type: "div",
    className: "grid grid-cols-[200px_minmax(1fr,_.5fr)_100px] gap-4 ",
    children: [
      {
        type: "div",
        className: "",
        content: <LeaveTrackerOverview/>,
        value: "LeaveTracker",
      },
      // {
      //   type: "div",
      //   className: "",
      //   content: <TalentSphere/>,
      //   value: "TalentSphere",
      // },
      
      // {
      //   type: "div",
      //   className: "",
      //   content: <MyTasks/>,
      //   value: "MyTasks",
      // },
      // {
      //   type: "div",
      //   className: "",
      //   content: <MyTeams/>,
      //   value: "MyTeam",
      // },
      // {
      //   type: "div",
      //   className: "",
      //   content: <MyLeaves/>,
      //   value: "MyLeaves",
      // },
      // {
      //   type: "div",
      //   className: "",
      //   content: <AllProjects/>,
      //   value: "AllProjects",
      // },
    ]
  }
  ];
     
  
  // {
  //   type: "div",
  //   className: "flex flex-wrap w-[100%] lg:w-[30%]",
  //   children: [
  //     {
  //       type: "div",
  //       className: "w-[100%] overflow-hidden p-2",
  //       content: <RecentActivity/>,
  //       value: "RecentActivity",
  //     },
  //     {
  //       type: "div",
  //       className: "w-[100%] overflow-hidden p-2",
  //       content: <MyTasks/>,
  //       value: "MyTasks",
  //     },
  //     {
  //       type: "div",
  //       className: "w-[100%] overflow-hidden p-2",
  //       content: <MyTeams/>,
  //       value: "MyTeam",
  //     },
  //   ],
  // },
  // {
  //   type: "div",
  //   className: " flex flex-wrap w-[100%]",
  //   children: [
  //     {
  //       type: "div",
  //       className: "w-[100%] md:w-[30%] overflow-hidden p-2",
  //       content: <MyLeaves/>,
  //       value: "MyLeaves",
  //     },
  //     {
  //       type: "div",
  //       className: "w-[100%] md:w-[70%] overflow-hidden p-2",
  //       content: <AllProjects/>,
  //       value: "AllProjects",
  //     },
  //   ],
  // },

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
