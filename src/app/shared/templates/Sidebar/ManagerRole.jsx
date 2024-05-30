/* eslint-disable react-hooks/exhaustive-deps */
import { FaAngleDown } from "react-icons/fa6";
import { Link, NavLink, useLocation } from "react-router-dom";
import { LuCalendarDays, } from "react-icons/lu";
import { toggleDropdown } from "../../../../state/slices/DropdownSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { GoHome, GoPeople, GoPerson } from "react-icons/go";
import { SlBadge } from "react-icons/sl";
import { FaRegStar } from "react-icons/fa";
import { MdBarChart, MdOutlineTrendingUp } from "react-icons/md";

const ManagerRole = ({
    isSidebarOpen,
}) => {
    const activeLink = `flex rounded-md my-1 py-1.5 ${!isSidebarOpen ? "px-1" : "px-4"} items-center gap-x-1 bg-[#DAEFF8] text-[#5C5E64]`;
    const normalLink = `flex rounded-md my-1 py-1.5 ${!isSidebarOpen ? "px-1" : "px-4"} items-center gap-x-1 text-[#5C5E64] hover:border hover:border-blue-300 text-[10px]`
    const { isServiceHubOpen, isRecruitmentOpen, isPerformanceOpen, isPeopleEngagementOpen, isPersonalDevelopmentOpen, isLeaveOpen } = useSelector(state => state.dropdown);
    const dispatch = useDispatch();

    const handleToggleDropdown = (dropdownName) => {
        dispatch(toggleDropdown(dropdownName));
    };

    return (
        <>
            <li className="group">
                <Link to="/">
                    <div className={`flex mb-3 mt-5 rounded-md py-2 t px-2 items-center gap-x-2 text-[#5C5E64] bg-[#DAEFF8]`}>
                        <div className={`text-xl ${!isSidebarOpen ? 'ml-[10px]' : ''}`}>
                            <GoHome />
                        </div>
                        <p className={`overflow-hidden text-[14px] transition-all ${isSidebarOpen ? 'w-28' : 'w-0'}`}>Home</p>
                    </div>
                </Link>

                {!isSidebarOpen && (
                    <div className="absolute rounded-md top-24 ml-20
          bg-white w-40 text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-50  shadow-bottom">

                        <p className="m-1 px-2 py-1 rounded-lg text-[#5C5E64] hover:bg-[#DAEFF8] hover:text-[#0D2282]"><Link to="/">Home</Link></p>
                    </div>
                )}
            </li>

            {/* self service hub */}
            <li className="group">
                <div
                    onClick={() => handleToggleDropdown("serviceHub")}
                    className={`flex items-center justify-between py-2 px-2 mt-2 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${isServiceHubOpen ? "bg-[#DAEFF8] text-[#0D2282]" : "text-[#5C5E64]"
                        } ${isSidebarOpen ? "rounded-t-lg" : "rounded-lg"} cursor-pointer `}
                >
                    <GoPerson className={`text-xl mr-3 ${!isSidebarOpen ? 'ml-[10px]' : ''}`} />
                    <span className={`flex items-center gap-x-1 flex-grow ${isSidebarOpen ? 'block' : 'hidden'}`}>
                        <p className="flex-grow text-[14px]">Self Service Hub</p>
                        <FaAngleDown className={`text-xs transition-transform duration-300 ${isServiceHubOpen ? 'transform rotate-180' : ''}`} />
                    </span>
                </div>

                {!isSidebarOpen && (
                    <div className="absolute rounded-lg border border-gray-1 top-40 ml-20
          bg-[#F7F8FA] w-44 text-base
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-50 shadow-bottom">

                        <div className="flex flex-col bg-white rounded-lg">
                            <NavLink to="/coming-soon"
                                className={({ isActive }) => isActive ? activeLink : normalLink}
                            >
                                <p className="text-sm px-2">My Profile</p>

                            </NavLink>
                            <NavLink to="/coming-soon"
                                className={({ isActive }) => isActive ? activeLink : normalLink}
                            >
                                <p className="text-sm px-2">My Team</p>

                            </NavLink>
                            <NavLink to="/coming-soon"
                                className={({ isActive }) => isActive ? activeLink : normalLink}
                            >
                                <p className="text-sm px-2">Calender</p>

                            </NavLink>
                            <NavLink to="/coming-soon"
                                className={({ isActive }) => isActive ? activeLink : normalLink}
                            >
                                <p className="text-sm px-2">Attendance</p>

                            </NavLink>
                            <NavLink to="/coming-soon"
                                className={({ isActive }) => isActive ? activeLink : normalLink}
                            >
                                <p className="text-sm px-2">My Leaves</p>

                            </NavLink>
                            <NavLink to="/coming-soon"
                                className={({ isActive }) => isActive ? activeLink : normalLink}
                            >
                                <p className="text-sm px-2">Files & Data</p>

                            </NavLink>
                            <NavLink to="/coming-soon"
                                className={({ isActive }) => isActive ? activeLink : normalLink}
                            >
                                <p className="text-sm px-2">My Travel Details</p>

                            </NavLink>
                            <NavLink to="/coming-soon"
                                className={({ isActive }) => isActive ? activeLink : normalLink}
                            >
                                <p className="text-sm px-2">Letter Requests</p>

                            </NavLink>
                        </div>
                    </div>
                )}
            </li>
            {(isServiceHubOpen && isSidebarOpen) &&
                <div className="flex flex-col bg-[#F7F8FA]">
                    <NavLink to="/coming-soon"
                        className={({ isActive }) => isActive ? activeLink : normalLink}
                    >
                        <p className="text-sm px-2">My Profile</p>

                    </NavLink>
                    <NavLink to="/coming-soon"
                        className={({ isActive }) => isActive ? activeLink : normalLink}
                    >
                        <p className="text-sm px-2">My Team</p>

                    </NavLink>
                    <NavLink to="/coming-soon"
                        className={({ isActive }) => isActive ? activeLink : normalLink}
                    >
                        <p className="text-sm px-2">Calender</p>

                    </NavLink>
                    <NavLink to="/coming-soon"
                        className={({ isActive }) => isActive ? activeLink : normalLink}
                    >
                        <p className="text-sm px-2">Attendance</p>

                    </NavLink>
                    <NavLink to="/coming-soon"
                        className={({ isActive }) => isActive ? activeLink : normalLink}
                    >
                        <p className="text-sm px-2">My Leaves</p>

                    </NavLink>
                    <NavLink to="/coming-soon"
                        className={({ isActive }) => isActive ? activeLink : normalLink}
                    >
                        <p className="text-sm px-2">Files & Data</p>

                    </NavLink>
                    <NavLink to="/coming-soon"
                        className={({ isActive }) => isActive ? activeLink : normalLink}
                    >
                        <p className="text-sm px-2">My Travel Details</p>

                    </NavLink>
                    <NavLink to="/coming-soon"
                        className={({ isActive }) => isActive ? activeLink : normalLink}
                    >
                        <p className="text-sm px-2">Letter Requests</p>

                    </NavLink>
                </div>
            }

            {/* Leave Management */}

            <li className="group">
                <div
                    onClick={() => handleToggleDropdown("LeaveManagement")}
                    className={`flex items-center justify-between mt-2 py-2 px-2 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${isLeaveOpen ? "bg-[#DAEFF8] text-[#0D2282]" : "text-[#5C5E64]"
                        } ${isSidebarOpen ? "rounded-t-lg" : "rounded-lg"} cursor-pointer`}
                >
                    <LuCalendarDays className={`text-xl mr-3 ${!isSidebarOpen ? 'ml-[10px]' : ''}`} />
                    <div className={`flex items-center gap-x-1 flex-grow ${isSidebarOpen ? 'block' : 'hidden'}`}>
                        <p className="flex-grow text-[14px]">Leave Management</p>
                        <FaAngleDown className={`text-xs transition-transform duration-300 ${isLeaveOpen ? 'transform rotate-180' : ''}`} />
                    </div>
                </div>
                {!isSidebarOpen && (
                    <div className="absolute rounded-lg border border-gray-1 top-56 ml-20
          bg-white w-44 text-base
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-50  shadow-bottom">

                        <div className="flex flex-col rounded-lg bg-white">
                            <NavLink to="/leave-application"
                                className={({ isActive }) => isActive ? activeLink : normalLink}
                            >
                                <p className="text-sm px-2">Leave Application</p>

                            </NavLink>
                            <NavLink to="/leave-calender"
                                className={({ isActive }) => isActive ? activeLink : normalLink}
                            >
                                <p className="text-sm px-2">Leave Calender</p>

                            </NavLink>
                            <NavLink to="/leave-list"
                                className={({ isActive }) => isActive ? activeLink : normalLink}
                            >
                                <p className="text-sm px-2">Team Application Status</p>

                            </NavLink>
                            <NavLink to="/leave-balance"
                                className={({ isActive }) => isActive ? activeLink : normalLink}
                            >
                                <p className="text-sm px-2">Team Leave Balance</p>

                            </NavLink>
                        </div>
                    </div>
                )}
            </li>

            {(isLeaveOpen && isSidebarOpen) &&
                <div className="flex flex-col bg-[#F7F8FA]">
                    <NavLink to="/leave-application"
                        className={({ isActive }) => isActive ? activeLink : normalLink}
                    >
                        <p className="text-sm px-2">Leave Application</p>

                    </NavLink>
                    <NavLink to="/leave-calender"
                        className={({ isActive }) => isActive ? activeLink : normalLink}
                    >
                        <p className="text-sm px-2">Leave Calender</p>

                    </NavLink>
                    <NavLink to="/leave-list"
                        className={({ isActive }) => isActive ? activeLink : normalLink}
                    >
                        <p className="text-sm px-2">Team Application Status</p>

                    </NavLink>
                    <NavLink to="/leave-balance"
                        className={({ isActive }) => isActive ? activeLink : normalLink}
                    >
                        <p className="text-sm px-2">Team Leave Balance</p>

                    </NavLink>
                </div>
            }

            {/* Talent sphere */}
            <li className="group">
                <div
                    onClick={() => handleToggleDropdown("Recruitment")}
                    className={`flex items-center justify-between mt-2 py-2 px-2 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${isRecruitmentOpen ? "bg-[#DAEFF8] text-[#0D2282]" : " text-[#5C5E64]"
                        } ${isSidebarOpen ? "rounded-t-lg" : "rounded-lg"} cursor-pointer`}
                >
                    <FaRegStar className={`text-xl mr-3 ${!isSidebarOpen ? 'ml-[10px]' : ''}`} />
                    <div className={`flex items-center gap-x-2 flex-grow ${isSidebarOpen ? 'block' : 'hidden'}`}>
                        <p className="flex-grow text-[14px]">Talent Sphere</p>
                        <FaAngleDown className={`text-xs transition-transform duration-300 ${isRecruitmentOpen ? 'transform rotate-180' : ''}`} />
                    </div>
                </div>
                {!isSidebarOpen && (
                    <div className="absolute rounded-lg border border-gray-1 top-52 ml-20
          bg-white w-44 text-base
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-50 shadow-bottom">

                        <div className="flex flex-col rounded-lg bg-white">
                            <NavLink to="/coming-soon"
                                className={({ isActive }) => isActive ? activeLink : normalLink}
                            >
                                <p className="text-sm px-2">Personnel Requisition</p>

                            </NavLink>
                            <NavLink to="/jobs"
                                className={({ isActive }) => isActive ? activeLink : normalLink}
                            >
                                <p className="text-sm px-2">Jobs</p>

                            </NavLink>
                            <NavLink to="/job-post"
                                className={({ isActive }) => isActive ? activeLink : normalLink}
                            >
                                <p className="text-sm px-2">Post a Job</p>

                            </NavLink>
                            <NavLink to="/coming-soon"
                                className={({ isActive }) => isActive ? activeLink : normalLink}
                            >
                                <p className="text-sm px-2">Applicants</p>

                            </NavLink>
                            <NavLink to="/coming-soon"
                                className={({ isActive }) => isActive ? activeLink : normalLink}
                            >
                                <p className="text-sm px-2">Referals</p>

                            </NavLink>
                            <NavLink to="/coming-soon"
                                className={({ isActive }) => isActive ? activeLink : normalLink}
                            >
                                <p className="text-sm px-2">On Boarding</p>

                            </NavLink>
                        </div>
                    </div>
                )}
            </li>

            {(isRecruitmentOpen && isSidebarOpen) &&
                <div className="flex flex-col bg-[#F7F8FA]">
                    <NavLink to="/coming-soon"
                        className={({ isActive }) => isActive ? activeLink : normalLink}
                    >
                        <p className="text-sm px-2">Personnel Requisition</p>

                    </NavLink>
                    <NavLink to="/jobs"
                        className={({ isActive }) => isActive ? activeLink : normalLink}
                    >
                        <p className="text-sm px-2">Jobs</p>

                    </NavLink>
                    <NavLink to="/job-post"
                        className={({ isActive }) => isActive ? activeLink : normalLink}
                    >
                        <p className="text-sm px-2">Post a Job</p>

                    </NavLink>
                    <NavLink to="/coming-soon"
                        className={({ isActive }) => isActive ? activeLink : normalLink}
                    >
                        <p className="text-sm px-2">Applicants</p>

                    </NavLink>
                    <NavLink to="/coming-soon"
                        className={({ isActive }) => isActive ? activeLink : normalLink}
                    >
                        <p className="text-sm px-2">Referals</p>

                    </NavLink>
                    <NavLink to="/coming-soon"
                        className={({ isActive }) => isActive ? activeLink : normalLink}
                    >
                        <p className="text-sm px-2">On Boarding</p>

                    </NavLink>
                </div>
            }

            {/* Performance Management */}
            <li className="group">
                <div
                    onClick={() => handleToggleDropdown("performance")}
                    className={`flex items-center justify-between mt-2 py-2 px-2 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${isPerformanceOpen ? "bg-[#DAEFF8] text-[#0D2282]" : " text-[#5C5E64]"
                        } ${isSidebarOpen ? "rounded-t-lg" : "rounded-lg"} cursor-pointer`}
                >
                    <SlBadge className={`text-xl mr-3 ${!isSidebarOpen ? 'ml-[10px]' : ''}`} />
                    <div className={`flex items-center gap-x-2 flex-grow ${isSidebarOpen ? 'block' : 'hidden'}`}>
                        <p className="flex-grow text-[14px]">Performance Management</p>
                        <FaAngleDown className={`text-xs transition-transform duration-300 ${isPerformanceOpen ? 'transform rotate-180' : ''}`} />
                    </div>
                </div>
                {!isSidebarOpen && (
                    <div className="absolute rounded-lg border border-gray-1 top-72 ml-20
          bg-white w-44 text-base
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-50  shadow-bottom">

                        <div className="flex flex-col rounded-lg bg-white">
                            <NavLink to="/coming-soon"
                                className={({ isActive }) => isActive ? activeLink : normalLink}
                            >
                                <p className="text-sm px-2">Employee Evaluation</p>

                            </NavLink>

                        </div>
                    </div>
                )}
            </li>

            {(isPerformanceOpen && isSidebarOpen) &&
                <div className="flex flex-col bg-[#F7F8FA]">
                    <NavLink to="/coming-soon"
                        className={({ isActive }) => isActive ? activeLink : normalLink}
                    >
                        <p className="text-sm px-2">Employee Evaluation</p>

                    </NavLink>
                </div>
            }
            {/* People Engagement */}
            <li className="group">
                <div
                    onClick={() => handleToggleDropdown("peopleEngagement")}
                    className={`flex items-center justify-between mt-2 py-2 px-2 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${isPeopleEngagementOpen ? "bg-[#DAEFF8] text-[#0D2282]" : " text-[#5C5E64]"
                        } ${isSidebarOpen ? "rounded-t-lg" : "rounded-lg"} cursor-pointer`}
                >
                    <MdOutlineTrendingUp className={`text-xl mr-3 ${!isSidebarOpen ? 'ml-[10px]' : ''}`} />
                    <div className={`flex items-center gap-x-2 flex-grow ${isSidebarOpen ? 'block' : 'hidden'}`}>
                        <p className="flex-grow text-[14px]">People Engagement</p>
                        <FaAngleDown className={`text-xs transition-transform duration-300 ${isPeopleEngagementOpen ? 'transform rotate-180' : ''}`} />
                    </div>
                </div>
                {!isSidebarOpen && (
                    <div className="absolute rounded-lg border border-gray-1 top-80 ml-20
          bg-white w-44 text-base
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-50  shadow-bottom">

                        <div className="flex flex-col rounded-lg bg-white">
                            <NavLink to="/coming-soon"
                                className={({ isActive }) => isActive ? activeLink : normalLink}
                            >
                                <p className="text-sm px-2">Announcement</p>

                            </NavLink>
                            <NavLink to="/coming-soon"
                                className={({ isActive }) => isActive ? activeLink : normalLink}
                            >
                                <p className="text-sm px-2">Recognition</p>

                            </NavLink>

                        </div>
                    </div>
                )}
            </li>

            {(isPeopleEngagementOpen && isSidebarOpen) &&
                <div className="flex flex-col bg-[#F7F8FA]">
                    <NavLink to="/coming-soon"
                        className={({ isActive }) => isActive ? activeLink : normalLink}
                    >
                        <p className="text-sm px-2">Announcement</p>

                    </NavLink>
                    <NavLink to="/coming-soon"
                        className={({ isActive }) => isActive ? activeLink : normalLink}
                    >
                        <p className="text-sm px-2">Recognition</p>

                    </NavLink>
                </div>
            }

            {/* Personnel Development */}
            <li className="group">
                <div
                    onClick={() => handleToggleDropdown("personalDevelopment")}
                    className={`flex items-center justify-between mt-2 py-2 px-2 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${isPersonalDevelopmentOpen ? "bg-[#DAEFF8] text-[#0D2282]" : " text-[#5C5E64]"
                        } ${isSidebarOpen ? "rounded-t-lg" : "rounded-lg"} cursor-pointer`}
                >
                    <MdBarChart className={`text-xl mr-3 ${!isSidebarOpen ? 'ml-[10px]' : ''}`} />
                    <div className={`flex items-center gap-x-2 flex-grow ${isSidebarOpen ? 'block' : 'hidden'}`}>
                        <p className="flex-grow text-[14px]">Personnel Development</p>
                        <FaAngleDown className={`text-xs transition-transform duration-300 ${isPersonalDevelopmentOpen ? 'transform rotate-180' : ''}`} />
                    </div>
                </div>
                {!isSidebarOpen && (
                    <div className="absolute rounded-lg border border-gray-1 top-96 ml-20
          bg-white w-44 text-base
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-50  shadow-bottom">

                        <div className="flex flex-col rounded-lg bg-white">
                            <NavLink to="/coming-soon"
                                className={({ isActive }) => isActive ? activeLink : normalLink}
                            >
                                <p className="text-sm px-2">Learn</p>

                            </NavLink>
                            <NavLink to="/coming-soon"
                                className={({ isActive }) => isActive ? activeLink : normalLink}
                            >
                                <p className="text-sm px-2">Career Planning</p>

                            </NavLink>
                            <NavLink to="/coming-soon"
                                className={({ isActive }) => isActive ? activeLink : normalLink}
                            >
                                <p className="text-sm px-2">Succession Plan</p>

                            </NavLink>
                            <NavLink to="/coming-soon"
                                className={({ isActive }) => isActive ? activeLink : normalLink}
                            >
                                <p className="text-sm px-2">Development Plan</p>

                            </NavLink>
                        </div>
                    </div>
                )}
            </li>

            {(isPersonalDevelopmentOpen && isSidebarOpen) &&
                <div className="flex flex-col bg-[#F7F8FA]">
                    <NavLink to="/coming-soon"
                        className={({ isActive }) => isActive ? activeLink : normalLink}
                    >
                        <p className="text-sm px-2">Learn</p>

                    </NavLink>
                    <NavLink to="/coming-soon"
                        className={({ isActive }) => isActive ? activeLink : normalLink}
                    >
                        <p className="text-sm px-2">Career Planning</p>

                    </NavLink>
                    <NavLink to="/coming-soon"
                        className={({ isActive }) => isActive ? activeLink : normalLink}
                    >
                        <p className="text-sm px-2">Succession Plan</p>

                    </NavLink>
                    <NavLink to="/coming-soon"
                        className={({ isActive }) => isActive ? activeLink : normalLink}
                    >
                        <p className="text-sm px-2">Development Plan</p>

                    </NavLink>
                </div>
            }
        </>
    )
}

export default ManagerRole