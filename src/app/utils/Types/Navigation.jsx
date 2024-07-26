import { GoHome, GoPeople, GoPerson } from "react-icons/go";
import { LuCalendarDays } from "react-icons/lu";
import { FaRegStar } from "react-icons/fa";
import { SlBadge } from "react-icons/sl";
import { BiTask } from "react-icons/bi";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { MdBarChart, MdOutlineTrendingUp } from "react-icons/md";
import { HiOutlineDocumentReport } from "react-icons/hi";
import buble from "../../../assets/images/buble.png";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

function getNavigation(userRole) {
  const Navigation = {
    items: [
      ...[
        {
          name: "Services",
          icon: <img src={buble} />,
          dropdown: "",
          url: "/services",
        },
      ],
      ...[
        {
          name: "Home",
          icon: <GoHome />,
          dropdown: "",
          url: "/",
        },
      ],
      ...(userRole === 1 || userRole === 3
        ? [
            {
              name: "People Team",
              icon: <GoPeople />,
              dropdown: "HRDatabase",
              children: [
                ...(userRole === 1 || userRole === 3
                  ? [
                      {
                        name: "Profile Management",
                        url: "/profile-management",
                      },
                    ]
                  : []),
                ...(userRole === 1 || userRole === 3
                  ? [
                      {
                        name: "Settings",
                        url: "/settings",
                      },
                    ]
                  : []),
                ...(userRole === 1 || userRole === 3
                  ? [
                      {
                        name: "Travel Details",
                        url: "/travel-details",
                      },
                    ]
                  : []),
                ...(userRole === 1 || userRole === 3
                  ? [
                      {
                        name: "Exit & Clearence",
                        url: "/exit-clearance",
                      },
                    ]
                  : []),
                ...(userRole === 1 || userRole === 3
                  ? [
                      {
                        name: "Employee Creation",
                        url: "/create-employee",
                      },
                    ]
                  : []),
                ...(userRole === 1 || userRole === 3
                  ? [
                      {
                        name: "Customise Employees",
                        url: "/customise-employees",
                      },
                    ]
                  : []),
                {
                  name: "Employee Transfer",
                  dropdown: "transfer",
                  children: [
                    {
                      name: "Internal",
                      url: "/internal",
                    },
                    {
                      name: "External",
                      url: "/external",
                    },
                  ],
                },

                ...(userRole === 1 || userRole === 3
                  ? [
                      {
                        name: "Relocation",
                        url: "/relocation",
                      },
                    ]
                  : []),
              ],
            },
          ]
        : []),
      ...(userRole === 1 || userRole === 2 || userRole === 4 || userRole === 3
        ? [
            {
              name: "Self Service Hub",
              icon: <GoPerson />,
              dropdown: "serviceHub",
              children: [
                ...(userRole === 1 ||
                userRole === 2 ||
                userRole === 4 ||
                userRole === 3
                  ? [
                      {
                        name: "My Profile",
                        url: "/my-profile",
                      },
                    ]
                  : []),
                ...(userRole === 1 ||
                userRole === 2 ||
                userRole === 4 ||
                userRole === 3
                  ? [
                      {
                        name: "My Team",
                        url: "/my-team",
                      },
                    ]
                  : []),
                ...(userRole === 4 || userRole === 2 || userRole === 3
                  ? [
                      {
                        name: "Calender",
                        url: "/calender",
                      },
                    ]
                  : []),
                ...(userRole === 1 ||
                userRole === 2 ||
                userRole === 4 ||
                userRole === 3
                  ? [
                      {
                        name: "Attendance",
                        url: "/attendence",
                      },
                    ]
                  : []),
                ...(userRole === 1 ||
                userRole === 2 ||
                userRole === 4 ||
                userRole === 3
                  ? [
                      {
                        name: "Leave Tracker",
                        url: "/leave-tracker",
                      },
                    ]
                  : []),
                ...(userRole === 1 ||
                userRole === 2 ||
                userRole === 4 ||
                userRole === 3
                  ? [
                      {
                        name: "Files & Data",
                        url: "/files-data",
                      },
                    ]
                  : []),
                ...(userRole === 1 ||
                userRole === 2 ||
                userRole === 4 ||
                userRole === 3
                  ? [
                      {
                        name: "My Travel Details",
                        url: "/my-travel-details",
                      },
                    ]
                  : []),
                ...(userRole === 1 ||
                userRole === 2 ||
                userRole === 4 ||
                userRole === 3
                  ? [
                      {
                        name: "Letter Request",
                        dropdown: "letterRequest",
                        children: [
                          {
                            name: "Type of letter 1",
                            url: "/letter1",
                          },
                          {
                            name: "Type of letter 2",
                            url: "/letter2",
                          },
                        ],
                      },
                    ]
                  : []),
              ],
            },
          ]
        : []),

      ...(userRole === 1 || userRole === 2 || userRole === 3 || userRole === 4
        ? [
            {
              name: "Task Management",
              icon: <IoMdCheckmarkCircleOutline />,
              dropdown: "Projects",
              children: [
                ...(userRole === 1 ||
                userRole === 2 ||
                userRole === 3 ||
                userRole === 4
                  ? [
                      {
                        name: "My Task",
                        url: "/my-task",
                      },
                    ]
                  : []),
                ...(userRole === 1 ||
                userRole === 2 ||
                userRole === 3 ||
                userRole === 4
                  ? [
                      {
                        name: "My Team DTR",
                        url: "/my-team",
                      },
                    ]
                  : []),
                ...(userRole === 4 ||
                userRole === 2 ||
                userRole === 1 ||
                userRole === 3
                  ? [
                      {
                        name: "Project Board",
                        url: "/projects",
                      },
                    ]
                  : []),
                ...(userRole === 1 ||
                userRole === 2 ||
                userRole === 3 ||
                userRole === 4
                  ? [
                      {
                        name: "Time Managment",
                        url: "/attendence",
                      },
                    ]
                  : []),
              ],
            },
          ]
        : []),
      ...(userRole === 1 || userRole === 2 || userRole === 3 || userRole === 4
        ? [
            {
              name: "Leave Management",
              icon: <LuCalendarDays />,
              dropdown: "LeaveManagement",
              children: [
                ...(userRole === 4
                  ? [
                      {
                        name: "Leave Tracker",
                        url: "/leave-tracker",
                      },
                    ]
                  : []),
                
                ...(userRole === 4
                  ? [
                      {
                        name: "Leave Request",
                        url: "/request-leave",
                      },
                    ]
                  : []),
                ...(userRole === 1 || userRole === 2 || userRole === 3
                  ? [
                      {
                        name: "Leave Request",
                        url: "/leave-requests",
                      },
                    ]
                  : []),
                ...(userRole === 1 || userRole === 2 || userRole === 3
                  ? [
                      {
                        name: "Calender",
                        url: "/leave-calender",
                      },
                    ]
                  : []),
                ...(userRole === 1 || userRole === 2 || userRole === 3
                  ? [
                      {
                        name: "Leave History",
                        url: "/leave-history",
                      },
                    ]
                  : []),
                ...(userRole === 1 || userRole === 3
                  ? [
                      {
                        name: "Leave Allotement",
                        url: "/leave-allotement",
                      },
                    ]
                  : []),
                ...(userRole === 1 || userRole === 2 || userRole === 3
                  ? [
                      {
                        name: "Holidays",
                        url: "/leave-balance",
                      },
                    ]
                  : []),
                ...(userRole === 1 ||
                userRole === 2 ||
                userRole === 4 ||
                userRole === 3
                  ? [
                      {
                        name: "Settings",
                        dropdown: "settings",
                        children: [
                          {
                            name: "Leave Type",
                            url: "/leave-type",
                          },
                        ],
                      },
                    ]
                  : []),
              ],
            },
          ]
        : []),
      ...(userRole === 1 || userRole === 2 || userRole === 3
        ? [
            {
              name: "Talent Sphere",
              icon: <FaRegStar />,
              dropdown: "Recruitment",
              children: [
                ...(userRole === 1 || userRole === 2 || userRole === 3
                  ? [
                      {
                        name: "Personnel Requisition",
                        url: "/personnel-requisition",
                      },
                    ]
                  : []),
                ...(userRole === 1 || userRole === 2 || userRole === 3
                  ? [
                      {
                        name: "Jobs",
                        url: "/jobs",
                      },
                    ]
                  : []),
                ...(userRole === 1 || userRole === 2 || userRole === 3
                  ? [
                      {
                        name: "Applicants",
                        url: "/applicants",
                      },
                    ]
                  : []),
                ...(userRole === 1 || userRole === 2 || userRole === 3
                  ? [
                      {
                        name: "Referrals",
                        url: "/referrals",
                      },
                    ]
                  : []),
                {
                  name: "To Do",
                  dropdown: "todo",
                  children: [
                    {
                      name: "Interview",
                      url: "/interview",
                    },
                    {
                      name: "Assessment",
                      url: "/assessment",
                    },
                    {
                      name: "Screening",
                      url: "/screening",
                    },
                    {
                      name: "Interview Reports",
                      url: "/interview-reports",
                    },
                  ],
                },
                ...(userRole === 1 || userRole === 2 || userRole === 3
                  ? [
                      {
                        name: "On Boarding",
                        url: "/on-boarding",
                      },
                    ]
                  : []),
              ],
            },
          ]
        : []),
      ...(userRole === 1 || userRole === 2 || userRole === 3
        ? [
            {
              name: "Performance Management",
              icon: <SlBadge />,
              dropdown: "performance",
              children: [
                ...(userRole === 1 || userRole === 2 || userRole === 3
                  ? [
                      {
                        name: "Employee Evaluation",
                        url: "/employee-evaluation",
                      },
                    ]
                  : []),
              ],
            },
          ]
        : []),
      ...(userRole === 1 || userRole === 3
        ? [
            {
              name: "Payroll & Attendance",
              icon: <IoCheckmarkDoneOutline />,
              dropdown: "payrollAndAttendance",
              children: [
                ...(userRole === 1 || userRole === 3
                  ? [
                      {
                        name: "Payroll",
                        url: "/payroll",
                      },
                    ]
                  : []),
                ...(userRole === 1 || userRole === 3
                  ? [
                      {
                        name: "Attendance",
                        url: "/attendance",
                      },
                    ]
                  : []),
              ],
            },
          ]
        : []),
      ...(userRole === 1 || userRole === 2 || userRole === 3
        ? [
            {
              name: "Personnel Development",
              icon: <MdBarChart />,
              dropdown: "personalDevelopment",
              children: [
                ...(userRole === 1 || userRole === 2 || userRole === 3
                  ? [
                      {
                        name: "Learn",
                        url: "/learn",
                      },
                    ]
                  : []),
                ...(userRole === 1 || userRole === 2 || userRole === 3
                  ? [
                      {
                        name: "Career Planning",
                        url: "/coming-soon",
                      },
                    ]
                  : []),
                ...(userRole === 1 || userRole === 2 || userRole === 3
                  ? [
                      {
                        name: "Succession Plan",
                        url: "/career-planning",
                      },
                    ]
                  : []),
                ...(userRole === 1 || userRole === 3
                  ? [
                      {
                        name: "Development Plan",
                        dropdown: "developmentPlan",
                        children: [
                          {
                            name: "Individual Plan",
                            url: "/individual-plan",
                          },
                          {
                            name: "Team Development Plan",
                            url: "/team-pevelopment-plan",
                          },
                        ],
                      },
                    ]
                  : []),
              ],
            },
          ]
        : []),
      ...(userRole === 1 || userRole === 2 || userRole === 4 || userRole === 3
        ? [
            {
              name: "People Engagement",
              icon: <MdOutlineTrendingUp />,
              dropdown: "peopleEngagement",
              children: [
                ...(userRole === 1 ||
                userRole === 2 ||
                userRole === 4 ||
                userRole === 3
                  ? [
                      {
                        name: "Announcement",
                        url: "/announcement",
                      },
                    ]
                  : []),
                ...(userRole === 1 ||
                userRole === 2 ||
                userRole === 4 ||
                userRole === 3
                  ? [
                      {
                        name: "Recognition",
                        url: "/recognition",
                      },
                    ]
                  : []),
              ],
            },
          ]
        : []),
      ...(userRole === 1
        ? [
            {
              name: "Daily Task Report",
              icon: <BiTask />,
              dropdown: "dtr",
              children: [
                ...(userRole === 1
                  ? [
                      {
                        name: "Create Task",
                        url: "/create-task",
                      },
                    ]
                  : []),
                ...(userRole === 1
                  ? [
                      {
                        name: "My DTR",
                        url: "/my-dtr",
                      },
                    ]
                  : []),
              ],
            },
          ]
        : []),
      ...(userRole === 1
        ? [
            {
              name: "Reports",
              icon: <HiOutlineDocumentReport />,
              dropdown: "",
              url: "/reports",
            },
          ]
        : []),
    ],
  };

  return Navigation;
}

export default getNavigation;
