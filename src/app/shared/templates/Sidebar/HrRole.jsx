/* eslint-disable react-hooks/exhaustive-deps */
import { FaAngleDown } from "react-icons/fa6";
import { Link, NavLink, useLocation } from "react-router-dom";
import { LuCalendarDays, } from "react-icons/lu";
import { toggleDropdown } from "../../../../state/slices/DropdownSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { GoHome, GoPeople, GoPerson } from "react-icons/go";
import { SlBadge } from "react-icons/sl";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { FaRegStar } from "react-icons/fa";
import { MdBarChart, MdOutlineTrendingUp } from "react-icons/md";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { BiTask } from "react-icons/bi";

const HrRole = ({ isSidebarOpen }) => {

  const activeLink = `flex rounded-md my-1 py-1.5 ${!isSidebarOpen ? "px-1" : "px-4"} items-center gap-x-1 bg-[#DAEFF8] text-[#5C5E64]`;
  const normalLink = `flex rounded-md my-1 py-1.5 ${!isSidebarOpen ? "px-1" : "px-4"} items-center gap-x-1 text-[#5C5E64] hover:border hover:border-blue-300 text-[10px]`
  const ComingActiveLink = `flex rounded-md my-1 py-1.5 ${!isSidebarOpen ? "px-1" : "px-4"} items-center gap-x-1 text-[#5C5E64]`;

  const { isDbOpen, isServiceHubOpen, isRecruitmentOpen, isPerformanceOpen, isPayrollOpen, isPeopleEngagementOpen, isPersonalDevelopmentOpen, isLeaveOpen, isProjectOpen, isProfileOpen, isDtrOpen } = useSelector(state => state.dropdown);;
  const dispatch = useDispatch();
  const location = useLocation();

  const handleToggleDropdown = (dropdownName) => {
    dispatch(toggleDropdown(dropdownName));
  };

  return (
    <>
      <li className="group">

        <NavLink
          to="/"
          className={({ isActive }) =>
            `group flex mb-3 mt-5 rounded-md py-2 px-2 items-center gap-x-2 text-[#5C5E64] hover:bg-[#DAEFF8] hover:text-[#0D2282] ${isActive ? 'bg-[#DAEFF8] text-[#0D2282]' : ''}`
          }
        >
          <div className="flex flex-col">
            <div className={`text-xl ${!isSidebarOpen ? 'ml-[12px]' : ''}`}>
              <GoHome />
            </div>
            <p className={`text-xs text-center ml-[5px] transition-opacity duration-300 ${isSidebarOpen ? 'hidden' : 'hidden group-hover:block group-hover:opacity-100'}`}>
              Home
            </p>
          </div>
          <p className={`overflow-hidden text-[14px] transition-all ${isSidebarOpen ? 'w-28' : 'w-0'}`}>
            Home
          </p>
        </NavLink>

        {!isSidebarOpen && (
          <div className="absolute rounded-md top-24 ml-20
bg-white w-40 text-sm
invisible opacity-20 -translate-x-3 transition-all
group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-50  shadow-bottom">

            <p className="m-1 px-2 py-1 rounded-lg text-[#5C5E64] hover:bg-[#DAEFF8] hover:text-[#0D2282]"><Link to="/">Home</Link></p>
          </div>
        )}
      </li>

      <li className="group">
        <div
          onClick={() => handleToggleDropdown("HRDatabase")}
          className={`flex items-center justify-between py-2 px-2 mt-2 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${isDbOpen ? "bg-[#DAEFF8] text-[#0D2282]" : "text-[#5C5E64]"
            } ${isSidebarOpen ? "rounded-t-lg" : "rounded-lg"} cursor-pointer `}
        >
          <div className="flex flex-col justify-center">
            <GoPeople className={`text-xl mr-3 ${!isSidebarOpen ? 'ml-[12px]' : ''}`} />
            <p className={`text-xs text-center transition-opacity duration-300 ${isSidebarOpen ? 'hidden' : 'hidden group-hover:block group-hover:opacity-100'}`}>
              People Team
            </p>
          </div>
          <span className={`flex items-center gap-x-1 flex-grow ${isSidebarOpen ? 'block' : 'hidden'}`}>
            <p className="flex-grow text-[14px]">People Team</p>
            <FaAngleDown className={`text-xs transition-transform duration-300 ${isDbOpen ? 'transform rotate-180' : ''}`} />
          </span>
        </div>

        {!isSidebarOpen && (
          <div className="absolute rounded-lg border border-gray-100 top-40 ml-20
bg-white w-44 text-base
invisible opacity-20 -translate-x-3 transition-all
group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-50 shadow-bottom">

            <div className="flex flex-col bg-white rounded-lg">
              <li>
                <NavLink to="/employees"
                  className={({ isActive }) => isActive ? activeLink : normalLink}
                >
                  <p className="text-sm px-2">Employee Sheet</p>

                </NavLink>
                <NavLink to="/add-employee"
                  className={({ isActive }) => isActive ? activeLink : normalLink}
                >
                  <p className="text-sm px-2">Employee Creation</p>

                </NavLink>
              </li>
            </div>
          </div>
        )}
      </li>
      {(isDbOpen && isSidebarOpen) &&
        <div className="flex flex-col bg-[#F7F8FA]">
          <NavLink to="/employees"
            className={({ isActive }) => isActive ? activeLink : normalLink}
          >
            <p className="text-sm px-2">Employee Sheet</p>

          </NavLink>
          <NavLink to="/coming-soon"
            className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
          >
            <p className="text-sm px-2">Profile Management</p>

          </NavLink>
          <NavLink to="/coming-soon"
            className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
          >
            <p className="text-sm px-2">Settings</p>

          </NavLink>
          <NavLink to="/coming-soon"
            className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
          >
            <p className="text-sm px-2">Travel Details</p>

          </NavLink>
          <NavLink to="/coming-soon"
            className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
          >
            <p className="text-sm px-2">Exit & Clearence</p>

          </NavLink>
          <NavLink to="/add-employee"
            className={({ isActive }) => isActive ? activeLink : normalLink}
          >
            <p className="text-sm px-2">Employee Creation</p>

          </NavLink>
          <NavLink to="/coming-soon"
            className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
          >
            <p className="text-sm px-2">Customise Employees</p>

          </NavLink>
          <NavLink to="/coming-soon"
            className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
          >
            <p className="text-sm px-2">Relocation</p>

          </NavLink>

        </div>
      }

      {/* self service hub */}
      <li className="group">
        <div
          onClick={() => handleToggleDropdown("serviceHub")}
          className={`flex items-center justify-between py-2 px-2 mt-2 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${isServiceHubOpen ? "bg-[#DAEFF8] text-[#0D2282]" : "text-[#5C5E64]"
            } ${isSidebarOpen ? "rounded-t-lg" : "rounded-lg"} cursor-pointer `}
        >
          <div className="flex flex-col justify-center">
            <GoPerson className={`text-xl mr-3 ${!isSidebarOpen ? 'ml-[12px]' : ''}`} />
            <p className={`text-center text-xs transition-opacity duration-300 ${isSidebarOpen ? 'hidden' : 'hidden group-hover:block group-hover:opacity-100'}`}>
              Self Service Hub
            </p>
          </div>
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
              <NavLink to="/profile"
                className={({ isActive }) => isActive ? activeLink : normalLink}
              >
                <p className="text-sm px-2">My Profile</p>

              </NavLink>
              <NavLink to="/coming-soon"
                className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
              >
                <p className="text-sm px-2">My Team</p>

              </NavLink>
              <NavLink to="/coming-soon"
                className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
              >
                <p className="text-sm px-2">Calender</p>

              </NavLink>
              <NavLink to="/coming-soon"
                className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
              >
                <p className="text-sm px-2">Attendance</p>

              </NavLink>
              <NavLink to="/coming-soon"
                className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
              >
                <p className="text-sm px-2">My Leaves</p>

              </NavLink>
              <NavLink to="/coming-soon"
                className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
              >
                <p className="text-sm px-2">Files & Data</p>

              </NavLink>
              <NavLink to="/coming-soon"
                className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
              >
                <p className="text-sm px-2">My Travel Details</p>

              </NavLink>
              <NavLink to="/coming-soon"
                className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
              >
                <p className="text-sm px-2">Letter Requests</p>

              </NavLink>
            </div>
          </div>
        )}
      </li>
      {(isServiceHubOpen && isSidebarOpen) &&
        <div className="flex flex-col bg-[#F7F8FA]">
          <NavLink to="/profile"
            className={({ isActive }) => isActive ? activeLink : normalLink}
          >
            <p className="text-sm px-2">My Profile</p>

          </NavLink>
          <NavLink to="/coming-soon"
            className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
          >
            <p className="text-sm px-2">My Team</p>

          </NavLink>
          <NavLink to="/coming-soon"
            className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
          >
            <p className="text-sm px-2">Calender</p>

          </NavLink>
          <NavLink to="/coming-soon"
            className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
          >
            <p className="text-sm px-2">Attendance</p>

          </NavLink>
          <NavLink to="/coming-soon"
            className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
          >
            <p className="text-sm px-2">My Leaves</p>

          </NavLink>
          <NavLink to="/coming-soon"
            className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
          >
            <p className="text-sm px-2">Files & Data</p>

          </NavLink>
          <NavLink to="/coming-soon"
            className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
          >
            <p className="text-sm px-2">My Travel Details</p>

          </NavLink>
          <NavLink to="/coming-soon"
            className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
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
          <div className="flex flex-col justify-center">
            <LuCalendarDays className={`text-xl mr-3 ${!isSidebarOpen ? 'ml-[12px]' : ''}`} />
            <p className={`text-center text-xs transition-opacity duration-300 ${isSidebarOpen ? 'hidden' : 'hidden group-hover:block group-hover:opacity-100'}`}>
              Leave Tracker
            </p>
          </div>
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
          <div className="flex flex-col justify-center">
            <FaRegStar className={`text-xl mr-3 ${!isSidebarOpen ? 'ml-[12px]' : ''}`} />
            <p className={`text-center text-xs transition-opacity duration-300 ${isSidebarOpen ? 'hidden' : 'hidden group-hover:block group-hover:opacity-100'}`}>
              Talent Sphere
            </p>
          </div>
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
                className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
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
                className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
              >
                <p className="text-sm px-2">Applicants</p>

              </NavLink>
              <NavLink to="/coming-soon"
                className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
              >
                <p className="text-sm px-2">Referals</p>

              </NavLink>
              <NavLink to="/coming-soon"
                className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
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
            className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
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
            className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
          >
            <p className="text-sm px-2">Applicants</p>

          </NavLink>
          <NavLink to="/coming-soon"
            className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
          >
            <p className="text-sm px-2">Referals</p>

          </NavLink>
          <NavLink to="/coming-soon"
            className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
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
          <div className="flex flex-col justify-center">
            <SlBadge className={`text-xl mr-3 ${!isSidebarOpen ? 'ml-[12px]' : ''}`} />
            <p className={`text-center text-xs transition-opacity duration-300 ${isSidebarOpen ? 'hidden' : 'hidden group-hover:block group-hover:opacity-100'}`}>
              Perform...
            </p>
          </div>
          <div className={`flex items-center gap-x-2 flex-grow ${isSidebarOpen ? 'block' : 'hidden'}`}>
            <p className="flex-grow text-[14px]">Performance Management</p>
            <FaAngleDown className={`text-xs transition-transform duration-300 ${isPerformanceOpen ? 'transform rotate-180' : ''}`} />
          </div>
        </div>
        {!isSidebarOpen && (
          <div className="absolute rounded-lg border border-gray-1 top-80 ml-20
bg-white w-44 text-base
invisible opacity-20 -translate-x-3 transition-all
group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-50  shadow-bottom">

            <div className="flex flex-col rounded-lg bg-white">
              <NavLink to="/coming-soon"
                className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
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
            className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
          >
            <p className="text-sm px-2">Employee Evaluation</p>

          </NavLink>
        </div>
      }

      {/* Payroll and attendance */}
      <li className="group">
        <div
          onClick={() => handleToggleDropdown("payrollAndAttendance")}
          className={`flex items-center justify-between mt-2 py-2 px-2 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${isPayrollOpen ? "bg-[#DAEFF8] text-[#0D2282]" : " text-[#5C5E64]"
            } ${isSidebarOpen ? "rounded-t-lg" : "rounded-lg"} cursor-pointer`}
        >
          <div className="flex flex-col justify-center">
            <IoCheckmarkDoneOutline className={`text-xl mr-3 ${!isSidebarOpen ? 'ml-[12px]' : ''}`} />
            <p className={`text-center text-xs transition-opacity duration-300 ${isSidebarOpen ? 'hidden' : 'hidden group-hover:block group-hover:opacity-100'}`}>
              Payroll
            </p>
          </div>
          <div className={`flex items-center gap-x-2 flex-grow ${isSidebarOpen ? 'block' : 'hidden'}`}>
            <p className="flex-grow text-[14px]">Payroll & Attendance</p>
            <FaAngleDown className={`text-xs transition-transform duration-300 ${isPayrollOpen ? 'transform rotate-180' : ''}`} />
          </div>
        </div>
        {!isSidebarOpen && (
          <div className="absolute rounded-lg border border-gray-1 top-80 ml-20
bg-white w-44 text-base
invisible opacity-20 -translate-x-3 transition-all
group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-50  shadow-bottom">

            <div className="flex flex-col rounded-lg bg-white">
              <NavLink to="/coming-soon"
                className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
              >
                <p className="text-sm px-2">Payroll</p>

              </NavLink>
              <NavLink to="/coming-soon"
                className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
              >
                <p className="text-sm px-2">Attendance</p>

              </NavLink>

            </div>
          </div>
        )}
      </li>

      {(isPayrollOpen && isSidebarOpen) &&
        <div className="flex flex-col bg-[#F7F8FA]">
          <NavLink to="/coming-soon"
            className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
          >
            <p className="text-sm px-2">Payroll</p>

          </NavLink>
          <NavLink to="/coming-soon"
            className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
          >
            <p className="text-sm px-2">Attendance</p>

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
          <div className="flex flex-col justify-center">
            <MdOutlineTrendingUp className={`text-xl mr-3 ${!isSidebarOpen ? 'ml-[12px]' : ''}`} />
            <p className={`text-center text-xs transition-opacity duration-300 ${isSidebarOpen ? 'hidden' : 'hidden group-hover:block group-hover:opacity-100'}`}>
              People
            </p>
          </div>
          <div className={`flex items-center gap-x-2 flex-grow ${isSidebarOpen ? 'block' : 'hidden'}`}>
            <p className="flex-grow text-[14px]">People Engagement</p>
            <FaAngleDown className={`text-xs transition-transform duration-300 ${isPeopleEngagementOpen ? 'transform rotate-180' : ''}`} />
          </div>
        </div>
        {!isSidebarOpen && (
          <div className="absolute rounded-lg border border-gray-1 top-96 ml-20
bg-white w-44 text-base
invisible opacity-20 -translate-x-3 transition-all
group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-50  shadow-bottom">

            <div className="flex flex-col rounded-lg bg-white">
              <NavLink to="/coming-soon"
                className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
              >
                <p className="text-sm px-2">Announcement</p>

              </NavLink>
              <NavLink to="/coming-soon"
                className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
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
            className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
          >
            <p className="text-sm px-2">Announcement</p>

          </NavLink>
          <NavLink to="/coming-soon"
            className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
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
          <div className="flex flex-col justify-center">
            <MdBarChart className={`text-xl mr-3 ${!isSidebarOpen ? 'ml-[12px]' : ''}`} />
            <p className={`text-center text-xs transition-opacity duration-300 ${isSidebarOpen ? 'hidden' : 'hidden group-hover:block group-hover:opacity-100'}`}>
              Personnel
            </p>
          </div>
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
                className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
              >
                <p className="text-sm px-2">Learn</p>

              </NavLink>
              <NavLink to="/coming-soon"
                className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
              >
                <p className="text-sm px-2">Career Planning</p>

              </NavLink>
              <NavLink to="/coming-soon"
                className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
              >
                <p className="text-sm px-2">Succession Plan</p>

              </NavLink>
              <NavLink to="/coming-soon"
                className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
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
            className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
          >
            <p className="text-sm px-2">Learn</p>

          </NavLink>
          <NavLink to="/coming-soon"
            className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
          >
            <p className="text-sm px-2">Career Planning</p>

          </NavLink>
          <NavLink to="/coming-soon"
            className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
          >
            <p className="text-sm px-2">Succession Plan</p>

          </NavLink>
          <NavLink to="/coming-soon"
            className={({ isActive }) => isActive ? ComingActiveLink : normalLink}
          >
            <p className="text-sm px-2">Development Plan</p>

          </NavLink>
        </div>
      }

      {/* Reports */}
      <NavLink
        to="/coming-soon"
        className={({ isActive }) =>
          `group flex rounded-md py-2 px-2 items-center gap-x-2 text-[#5C5E64] hover:bg-[#DAEFF8] hover:text-[#0D2282] ${isActive ? 'bg-[#DAEFF8] text-[#0D2282]' : ''}`
        }
      >
        <div className="flex flex-col">
          <div className={`text-xl ${!isSidebarOpen ? 'ml-[12px]' : ''}`}>
            <HiOutlineDocumentReport />
          </div>
          <p className={`text-xs ml-1 text-center transition-opacity duration-300 ${isSidebarOpen ? 'hidden' : 'hidden group-hover:block group-hover:opacity-100'}`}>
            Reports
          </p>
        </div>
        <p className={`overflow-hidden text-[14px] transition-all ${isSidebarOpen ? 'w-28' : 'w-0'}`}>
          Reports
        </p>
      </NavLink>

      {/* <NavLink
        to="/coming-sonn"
        className={({ isActive }) =>
            `group flex rounded-md py-2 px-2 items-center gap-x-2 text-[#5C5E64] hover:bg-[#DAEFF8] hover:text-[#0D2282] ${isActive ? 'bg-[#DAEFF8] text-[#0D2282]' : ''
            }`
        }
    >
        <div className="flex flex-col items-center">
            <div className={`text-xl ${!isSidebarOpen ? '' : ''}`}>
                <HiOutlineDocumentReport />
            </div>
            <p className={`text-center text-xs transition-opacity duration-300 ${isSidebarOpen ? 'hidden' : 'hidden group-hover:block group-hover:opacity-100'}`}>
                Reports
            </p>
        </div>
        <p className={`overflow-hidden text-[14px] transition-all ${isSidebarOpen ? 'w-28' : 'w-0'}`}>
            Reports
        </p>
    </NavLink> */}

      {/* dtrs */}
       <li className="group">
        <div
            onClick={() => handleToggleDropdown("dtr")}
            className={`flex items-center justify-between my-2 py-2 px-2 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${isLeaveOpen ? "bg-[#DAEFF8] text-[#0D2282]" : "text-[#5C5E64]"
                } rounded-lg cursor-pointer`}
        >
            <BiTask className={`text-xl mr-2 ${!isSidebarOpen ? 'ml-[10px]' : ''}`} />
            <div className={`flex items-center gap-x-1 flex-grow ${isSidebarOpen ? 'block' : 'hidden'}`}>
                <p className="flex-grow text-sm">Daily Task Report</p>
                <FaAngleDown className={`text-xs transition-transform duration-300 ${isDtrOpen ? 'transform rotate-180' : ''}`} />
            </div>
        </div>
        {!isSidebarOpen && (
            <div className="absolute rounded-md top-72 ml-20
bg-white w-32 text-base
invisible opacity-20 -translate-x-3 transition-all
group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-50  shadow-bottom">

                <div className="flex flex-col rounded-lg bg-white">
                    <li>
                        <Link to="/create-task">
                            <div
                                className={`flex rounded-md mx-1 my-1 py-2 px-2 items-center gap-x-1 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${location.pathname === "/leave-application" ? "bg-[#DAEFF8] text-[#0D2282]" : "text-gray-400"
                                    }`}
                            >
                                <p className="text-sm">Create Task</p>
                            </div>
                        </Link>
                    </li>

                </div>
                <div className="flex flex-col rounded-lg bg-white">
                    <li>
                        <Link to="/my-dtr">
                            <div
                                className={`flex rounded-md mx-1 my-1 py-2 px-2 items-center gap-x-1 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${location.pathname === "/leave-application" ? "bg-[#DAEFF8] text-[#0D2282]" : "text-gray-400"
                                    }`}
                            >
                                <p className="text-sm">My DTR</p>
                            </div>
                        </Link>
                    </li>

                </div>
            </div>
        )}
    </li>

    {(isDtrOpen && isSidebarOpen) &&
        <div className="flex flex-col mt-2 bg-[#F7F8FA]">
            <li>
                <NavLink to="/create-task"
                    className={({ isActive }) => isActive ? activeLink : normalLink}
                >
                    <div
                    // className={`flex rounded-md my-2 py-2 px-4 items-center gap-x-1 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${location.pathname === "/leave-application" ? "bg-[#DAEFF8] text-[#0D2282]" : "text-gray-400"
                    //     }`}

                    >
                        <p className="text-sm">Create Task</p>
                    </div>
                </NavLink>
            </li>
            <li>
                <NavLink to="/my-dtr"
                    className={({ isActive }) => isActive ? activeLink : normalLink}
                >
                    <div
                    // className={`flex rounded-md my-2 py-2 px-4 items-center gap-x-1 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${location.pathname === "/leave-application" ? "bg-[#DAEFF8] text-[#0D2282]" : "text-gray-400"
                    //     }`}

                    >
                        <p className="text-sm">My DTR</p>
                    </div>
                </NavLink>
            </li>

        </div>
    } 

    </>
  )
}

export default HrRole