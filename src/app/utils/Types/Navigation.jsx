
import {GoHome, GoPeople, GoPerson } from "react-icons/go";
import { LuCalendarDays } from "react-icons/lu";
import { FaRegStar } from "react-icons/fa";
import { SlBadge } from "react-icons/sl";
import { BiTask } from "react-icons/bi";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { MdBarChart, MdOutlineTrendingUp } from "react-icons/md";
import { HiOutlineDocumentReport } from "react-icons/hi";



function getNavigation(userRole) {
    const Navigation = {
        items: [
            ...[{
                name: 'Home',
                icon: <GoHome/>,
                dropdown: '',
                url: '/',
            }],
            ...((userRole === 1 || userRole === 3) ? [{
                name: 'People Team',
                icon: <GoPeople />,
                dropdown: 'HRDatabase',
                children: [
                    ...((userRole === 1 || userRole === 3) ? [{
                        name: 'Profile Management',
                        url: '/profile-management',
                    }] : []),
                    ...((userRole === 1 || userRole === 3) ? [{
                        name: 'Settings',
                        url: '/settings',
                    }] : []),
                    ...((userRole === 1 || userRole === 3) ? [{
                        name: 'Travel Details',
                        url: '/travel-details',
                    }] : []),
                    ...((userRole === 1 || userRole === 3) ? [{
                        name: 'Exit & Clearence',
                        url: '/exit-clearance',
                    }] : []),
                    ...((userRole === 1 || userRole === 3) ? [{
                        name: 'Employee Creation',
                        url: '/create-employee',
                    }] : []),
                    ...((userRole === 1 || userRole === 3) ? [{
                        name: 'Customise Employees',
                        url: '/customise-employees',
                    }] : []),
                    ...((userRole === 1 || userRole === 3) ? [{
                        name: 'Relocation',
                        url: '/relocation',
                    }] : []),
                ],
            }] : []),
            ...((userRole === 1 || userRole === 2 || userRole === 4 || userRole === 3) ? [{
                name: 'Self Service Hub',
                icon: <GoPerson />,
                dropdown: 'serviceHub',
                children: [
                    ...((userRole === 1 || userRole === 2 || userRole === 4 || userRole === 3) ? [{
                        name: 'My Profile',
                        url: '/my-profile',
                    }] : []),
                    ...((userRole === 1 || userRole === 2 || userRole === 4 || userRole === 3) ? [{
                        name: 'My Team',
                        url: '/my-team',
                    }] : []),
                    ...((userRole === 4 || userRole === 2 || userRole === 3) ? [{
                        name: 'Calender',
                        url: '/calender',
                    }] : []),
                    ...((userRole === 1 || userRole === 2 || userRole === 4 || userRole === 3) ? [{
                        name: 'Attendance',
                        url: '/attendence',
                    }] : []),
                    ...((userRole === 1 || userRole === 2 || userRole === 4 || userRole === 3) ? [{
                        name: 'My Leaves',
                        url: '/my-leaves',
                    }] : []),
                    ...((userRole === 1 || userRole === 2 || userRole === 4 || userRole === 3) ? [{
                        name: 'Files & Data',
                        url: '/files-data',
                    }] : []),
                    ...((userRole === 1 || userRole === 2 || userRole === 4 || userRole === 3) ? [{
                        name: 'My Travel Details',
                        url: '/my-travel-details',
                    }] : []),
                    ...((userRole === 1 || userRole === 2 || userRole === 4 || userRole === 3) ? [{
                        name: 'Letter Requests',
                        url: '/letter-request',
                    }] : []),
                ],
            }] : []),
            ...((userRole === 1 || userRole === 2 || userRole === 4 || userRole === 3) ? [{
                name: 'Leave Management',
                icon: <LuCalendarDays />,
                dropdown: 'LeaveManagement',
                children: [
                    ...((userRole === 1 || userRole === 2 || userRole === 4 || userRole === 3) ? [{
                        name: 'Leave Application',
                        url: '/leave-application',
                    }] : []),
                    ...((userRole === 1 || userRole === 2 || userRole === 4 || userRole === 3) ? [{
                        name: 'Leave Calender',
                        url: '/leave-calender',
                    }] : []),
                    ...((userRole === 1 || userRole === 2 || userRole === 4 || userRole === 3) ? [{
                        name: 'Team Application Status',
                        url: '/leave-list',
                    }] : []),
                    ...((userRole === 1 || userRole === 2 || userRole === 4 || userRole === 3) ? [{
                        name: 'Team Leave Balance',
                        url: '/leave-balance',
                    }] : []),
                ],
            }] : []),
            ...((userRole === 1 || userRole === 2 || userRole === 3) ? [{
                name: 'Talent Sphere',
                icon: <FaRegStar />,
                dropdown: 'Recruitment',
                children: [
                    ...((userRole === 1 || userRole === 2 || userRole === 3) ? [{
                        name: 'Personnel Requisition',
                        url: '/personnel-requisition',
                    }] : []),
                    ...((userRole === 1 || userRole === 2 || userRole === 3) ? [{
                        name: 'Jobs',
                        url: '/jobs',
                    }] : []),
                    ...((userRole === 1 || userRole === 2 || userRole === 3) ? [{
                        name: 'Post a Job',
                        url: '/job-post',
                    }] : []),
                    ...((userRole === 1 || userRole === 2 || userRole === 3) ? [{
                        name: 'Applicants',
                        url: '/applicants',
                    }] : []),
                    ...((userRole === 1 || userRole === 2 || userRole === 3) ? [{
                        name: 'Referals',
                        url: '/referals',
                    }] : []),
                    ...((userRole === 1 || userRole === 2 || userRole === 3) ? [{
                        name: 'On Boarding',
                        url: '/on-boarding',
                    }] : []),
                ],
            }] : []),
            ...((userRole === 1 || userRole === 2 || userRole === 3) ? [{
                name: 'Performance Management',
                icon: <SlBadge />,
                dropdown: 'performance',
                children: [
                    ...((userRole === 1 || userRole === 2 || userRole === 3) ? [{
                        name: 'Employee Evaluation',
                        url: '/employee-evaluation',
                    }] : []),
                ],
            }] : []),
            ...((userRole === 1 || userRole === 3) ? [{
                name: 'Payroll & Attendance',
                icon: <IoCheckmarkDoneOutline />,
                dropdown: 'payrollAndAttendance',
                children: [
                    ...((userRole === 1 || userRole === 3) ? [{
                        name: 'Payroll',
                        url: '/payroll',
                    }] : []),
                    ...((userRole === 1 || userRole === 3) ? [{
                        name: 'Attendance',
                        url: '/attendance',
                    }] : []),
                ],
            }] : []),
            ...((userRole === 1 || userRole === 2 || userRole === 3) ? [{
                name: 'Personnel Development',
                icon: <MdBarChart />,
                dropdown: 'personalDevelopment',
                children: [
                    ...((userRole === 1 || userRole === 2 || userRole === 3) ? [{
                        name: 'Learn',
                        url: '/learn',
                    }] : []),
                    ...((userRole === 1 || userRole === 2 || userRole === 3) ? [{
                        name: 'Career Planning',
                        url: '/coming-soon',
                    }] : []),
                    ...((userRole === 1 || userRole === 2 || userRole === 3) ? [{
                        name: 'Succession Plan',
                        url: '/career-planning',
                    }] : []),
                    ...((userRole === 1 || userRole === 3) ? [{
                        name: 'Development Plan',
                        url: '/development-plan',
                    }] : []),
                ],
            }] : []),
            ...((userRole === 1 || userRole === 2 || userRole === 4 || userRole === 3) ? [{
                name: 'People Engagement',
                icon: <MdOutlineTrendingUp />,
                dropdown: 'peopleEngagement',
                children: [
                    ...((userRole === 1 || userRole === 2 || userRole === 4 || userRole === 3) ? [{
                        name: 'Announcement',
                        url: '/announcement',
                    }] : []),
                    ...((userRole === 1 || userRole === 2 || userRole === 4 || userRole === 3) ? [{
                        name: 'Recognition',
                        url: '/recognition',
                    }] : []),
                ],
            }] : []),
            ...((userRole === 1) ? [{
                name: 'Daily Task Report',
                icon: <BiTask />,
                dropdown: 'dtr',
                children: [
                    ...((userRole === 1) ? [{
                        name: 'Create Task',
                        url: '/create-task',
                    }] : []),
                    ...((userRole === 1) ? [{
                        name: 'My DTR',
                        url: '/my-dtr',
                    }] : []),
                ],
            }] : []),
            ...((userRole === 1) ? [{
                name: 'Reports',
                icon: <HiOutlineDocumentReport />,
                dropdown: '',
                url: '/reports',
            }] : []),
        ]
    };

    return Navigation;
}

export default getNavigation;
