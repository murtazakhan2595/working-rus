import { useState, useEffect } from "react";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import logo from "../../../../assets/images/logo.png";
import { Outlet, Link, useNavigate, useLocation, NavLink } from "react-router-dom";
import sidebg from "./sidebarBG.png";
import { setUserLogout } from "../../../../state/actions/UserAction";
import { connect } from "react-redux";
import ProjectModel from "./ProjectModel";
import Cookies from "universal-cookie";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { toggleDropdown } from "../../../../state/slices/DropdownSlice";
import { LuCalendarDays } from "react-icons/lu";
import { FaAngleDown } from "react-icons/fa6";
import {  BsPersonGear } from "react-icons/bs";
import HrRole from "./HrRole";
import ManagerRole from "./ManagerRole";
import EmployeeRole from "./EmployeeRole";
import {  MdOutlineLogout } from "react-icons/md";
import { GoHome, GoPeople, GoPerson } from "react-icons/go";
import { SlBadge } from "react-icons/sl";
import { FaRegStar } from "react-icons/fa";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { MdBarChart, MdOutlineTrendingUp } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

const MobSidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  userProfile,
  baseUrl,
  token,
}) => {
  const activeLink = `flex rounded-md my-1 py-1.5 ${!isSidebarOpen ? "px-1" : "px-4"} items-center gap-x-1 bg-[#DAEFF8] text-[#5C5E64]`;
  const normalLink = `flex rounded-md my-1 py-1.5 ${!isSidebarOpen ? "px-1" : "px-4"} items-center gap-x-1 text-[#5C5E64] hover:border hover:border-blue-300 text-[10px]`
  const { isDbOpen, isServiceHubOpen, isRecruitmentOpen, isPerformanceOpen, isPayrollOpen, isPeopleEngagementOpen, isPersonalDevelopmentOpen, isLeaveOpen, isProjectOpen, isProfileOpen, isDtrOpen } = useSelector(state => state.dropdown);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const cookies = new Cookies();
  // const [isProjectOpen, setisProjectOpen] = useState(false);
  const [isModelOpen, setisModelOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [nextPage, setNextPage] = useState("");
  const [previousPage, setPreviousPage] = useState("");
  // const [projectCount, setProjectCount] = useState(0);
  const [isLinksOpen, setIsLinksOpen] = useState(false);
  const [projectsCount, setProjectCount] = useState(0);
  const [profileImage, setProfileImage] = useState(null);
  const [employee, setEmployee] = useState(null);

  const handleSidebarToggle = () => {
    setIsSidebarOpen((prev) => !prev);
  };


  const closeProjectModal = () => {
    setisModelOpen(false);
  };

  const handleToggleDropdown = (dropdownName) => {
    dispatch(toggleDropdown(dropdownName));
  };

  const getProjects = async (
    url = `${baseUrl}/project/${userProfile.role === 1 || userProfile.role === 2
      ? ""
      : `?search={"project_members":[${userProfile.id}]}`
      }`
  ) => {
    try {
      await axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setProjects(response.data);
            setProjectCount(response.data.count);
            setNextPage(response.data.next);
            setPreviousPage(response.data.previous);
          }
        });
    } catch (error) { }
  };

  useEffect(() => {
    getProjects();
  }, [isModelOpen]);

  const fetchData = async () => {
    const employeeResponse = await axios.get(`${baseUrl}/emp/${userProfile.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    const employeeData = employeeResponse.data;
    setEmployee(employeeData)
    setProfileImage(employeeResponse.data?.profile_picture.file || employeeResponse.data?.profile_picture);
  }

  useEffect(() => {
    fetchData();
  }, []);


  return (
    <>
      <div className="lg:flex">
        {/* Sidebar content goes here */}
        <div
          style={{ backgroundImage: `url(${sidebg})` }}
          className={`fixed inset-y-0 left-0 z-50 w-56 bg-[#fafafa] border border-gray-300 rounded-e-lg text-white transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <div className="text-xl z-10 py-1.5 px-7 flex border-b border-gray-300 flex-row items-center justify-start gap-1 text-[#2f4acf] font-semibold">
            <img src={logo} className="inline-block w-12" alt="logo" />
            <h1 className={`inline-block overflow-hidden transition-all ${isSidebarOpen ? 'w-28' : 'w-0'}`}>TECBRIX</h1>
          </div>
          <div className="flex flex-col justify-between h-[92vh] p-4">
            <ul className="overflow-y-auto hideScroll list-none">
              {userProfile.role === 1 && (
                <>
                  <li className="group">
                    <NavLink
                      to="/"
                      className={({ isActive }) =>
                        `flex mb-3 mt-5 rounded-md py-2 px-2 items-center gap-x-2 text-[#5C5E64] hover:bg-[#DAEFF8] hover:text-[#0D2282] ${isActive ? 'bg-[#DAEFF8] text-[#0D2282]' : ''
                        }`
                      }
                    >
                      <div className={`text-xl ${!isSidebarOpen ? 'ml-[10px]' : ''}`}>
                        <GoHome />
                      </div>
                      <p className={`overflow-hidden text-[14px] transition-all ${isSidebarOpen ? 'w-28' : 'w-0'}`}>
                        Home
                      </p>
                    </NavLink>
                  </li>

                  <li className="group">
                    <div
                      onClick={() => handleToggleDropdown("HRDatabase")}
                      className={`flex items-center justify-between py-2 px-2 mt-2 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${isDbOpen ? "bg-[#DAEFF8] text-[#0D2282]" : "text-[#5C5E64]"
                        } ${isSidebarOpen ? "rounded-t-lg" : "rounded-lg"} cursor-pointer `}
                    >
                      <GoPeople className={`text-xl mr-3 ${!isSidebarOpen ? 'ml-[10px]' : ''}`} />
                      <span className={`flex items-center gap-x-1 flex-grow ${isSidebarOpen ? 'block' : 'hidden'}`}>
                        <p className="flex-grow text-[14px]">People Team</p>
                        <FaAngleDown className={`text-xs transition-transform duration-300 ${isDbOpen ? 'transform rotate-180' : ''}`} />
                      </span>
                    </div>
                  </li>
                  {(isDbOpen && isSidebarOpen) &&
                    <div className="flex flex-col bg-[#F7F8FA]">
                      <NavLink to="/employees"
                        className={({ isActive }) => isActive ? activeLink : normalLink}
                      >
                        <p className="text-sm px-2">Employee Sheet</p>

                      </NavLink>
                      <NavLink to="/add-employee"
                        className={({ isActive }) => isActive ? activeLink : normalLink}
                      >
                        <p className="text-sm px-2">Add Employee</p>

                      </NavLink>
                      <NavLink to="/coming-soon"
                        className={({ isActive }) => isActive ? activeLink : normalLink}
                      >
                        <p className="text-sm px-2">Profile Management</p>

                      </NavLink>
                      <NavLink to="/coming-soon"
                        className={({ isActive }) => isActive ? activeLink : normalLink}
                      >
                        <p className="text-sm px-2">Settings</p>

                      </NavLink>
                      <NavLink to="/coming-soon"
                        className={({ isActive }) => isActive ? activeLink : normalLink}
                      >
                        <p className="text-sm px-2">Travel Details</p>

                      </NavLink>
                      <NavLink to="/coming-soon"
                        className={({ isActive }) => isActive ? activeLink : normalLink}
                      >
                        <p className="text-sm px-2">Exit & Clearence</p>

                      </NavLink>
                      <NavLink to="/coming-soon"
                        className={({ isActive }) => isActive ? activeLink : normalLink}
                      >
                        <p className="text-sm px-2">Employee Creation</p>

                      </NavLink>
                      <NavLink to="/coming-soon"
                        className={({ isActive }) => isActive ? activeLink : normalLink}
                      >
                        <p className="text-sm px-2">Customise Employees</p>

                      </NavLink>
                      <NavLink to="/coming-soon"
                        className={({ isActive }) => isActive ? activeLink : normalLink}
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
                      <GoPerson className={`text-xl mr-3 ${!isSidebarOpen ? 'ml-[10px]' : ''}`} />
                      <span className={`flex items-center gap-x-1 flex-grow ${isSidebarOpen ? 'block' : 'hidden'}`}>
                        <p className="flex-grow text-[14px]">Self Service Hub</p>
                        <FaAngleDown className={`text-xs transition-transform duration-300 ${isServiceHubOpen ? 'transform rotate-180' : ''}`} />
                      </span>
                    </div>
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
                      <div className="absolute rounded-lg border border-gray-1 top-80 ml-20
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

                  {/* Payroll and attendance */}
                  <li className="group">
                    <div
                      onClick={() => handleToggleDropdown("payrollAndAttendance")}
                      className={`flex items-center justify-between mt-2 py-2 px-2 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${isPayrollOpen ? "bg-[#DAEFF8] text-[#0D2282]" : " text-[#5C5E64]"
                        } ${isSidebarOpen ? "rounded-t-lg" : "rounded-lg"} cursor-pointer`}
                    >
                      <IoCheckmarkDoneOutline className={`text-xl mr-3 ${!isSidebarOpen ? 'ml-[10px]' : ''}`} />
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
                            className={({ isActive }) => isActive ? activeLink : normalLink}
                          >
                            <p className="text-sm px-2">Payroll</p>

                          </NavLink>
                          <NavLink to="/coming-soon"
                            className={({ isActive }) => isActive ? activeLink : normalLink}
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
                        className={({ isActive }) => isActive ? activeLink : normalLink}
                      >
                        <p className="text-sm px-2">Payroll</p>

                      </NavLink>
                      <NavLink to="/coming-soon"
                        className={({ isActive }) => isActive ? activeLink : normalLink}
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
                      <MdOutlineTrendingUp className={`text-xl mr-3 ${!isSidebarOpen ? 'ml-[10px]' : ''}`} />
                      <div className={`flex items-center gap-x-2 flex-grow ${isSidebarOpen ? 'block' : 'hidden'}`}>
                        <p className="flex-grow text-[14px]">People Engagement</p>
                        <FaAngleDown className={`text-xs transition-transform duration-300 ${isPeopleEngagementOpen ? 'transform rotate-180' : ''}`} />
                      </div>
                    </div>
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

                  {/* Reports */}
                  <NavLink
                    to="/coming-sonn"
                    className={({ isActive }) =>
                      `flex rounded-md py-2 px-2 items-center gap-x-2 text-[#5C5E64] hover:bg-[#DAEFF8] hover:text-[#0D2282] ${isActive ? 'bg-[#DAEFF8] text-[#0D2282]' : ''
                      }`
                    }
                  >
                    <div className={`text-xl ${!isSidebarOpen ? 'ml-[10px]' : ''}`}>
                      <HiOutlineDocumentReport />
                    </div>
                    <p className={`overflow-hidden text-[14px] transition-all ${isSidebarOpen ? 'w-28' : 'w-0'}`}>
                      Reports
                    </p>
                  </NavLink>

                  {/* dtrs */}
                  {/* <li className="group">
                     <div
                         onClick={() => handleToggleDropdown("dtr")}
                         className={`flex items-center justify-between my-2 py-2 px-2 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${isLeaveOpen ? "bg-[#DAEFF8] text-[#0D2282]" : "text-[#5C5E64]"
                             } rounded-lg cursor-pointer`}
                     >
                         <BiTask className={`text-xl mr-1 ${!isSidebarOpen ? 'ml-[10px]' : ''}`} />
                         <div className={`flex items-center gap-x-1 flex-grow ${isSidebarOpen ? 'block' : 'hidden'}`}>
                             <p className="flex-grow">Daily Task Report</p>
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
                 } */}

                </>
              )}

              {userProfile.role === 3 && (
                <HrRole isSidebarOpen={isSidebarOpen} />
              )}
              {(userProfile.role === 2) && (
                <ManagerRole isSidebarOpen={isSidebarOpen} />
              )}
              {(userProfile.role === 4) && (
                <EmployeeRole isSidebarOpen={isSidebarOpen} />
              )}

              {userProfile.role !== 3 && (
                <>
                  <li
                    onClick={() => handleToggleDropdown("Projects")}
                    className={`flex group mt-2 justify-between hover:bg-[#DAEFF8] hover:text-[#0D2282] items-center gap-1 cursor-pointer ${isProjectOpen ? "bg-[#DAEFF8] text-[#0D2282]" : "text-[#5C5E64]"
                      } ${isSidebarOpen ? "rounded-t-lg" : "rounded-lg"}`}
                  >
                    <div className="flex gap-x-2">
                      <IoMdCheckmarkCircleOutline className={`text-xl ${!isSidebarOpen ? 'ml-[10px]' : ''}`} />{" "}
                      <p className={` text-[14px] ${isSidebarOpen ? 'block' : 'hidden'}`}>Task Management</p>
                    </div>
                    <FaAngleDown
                      className={`text-xs transform transition-transform ${isProjectOpen ? 'rotate-180' : ''
                        } ${isSidebarOpen ? 'block' : 'hidden'}`}
                    />
                    {!isSidebarOpen && <div className="absolute rounded-lg border border-gray-1 top-96 ml-20 bg-white w-44 text-base
invisible opacity-20 -translate-x-3 transition-all
group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-50 shadow-bottom">
                      <div className="max-h-[20vh] overflow-y-auto p-1">
                        {projects?.map((project, index) => (
                          <div key={index} className="flex flex-col gap-2">
                            <NavLink
                              to={`/project/${project.id}`}
                              className={({ isActive }) =>
                                `flex items-center rounded-md gap-3 mb-1 cursor-pointer text-[#616366] hover:border hover:border-blue-300 ${isActive ? 'bg-[#DAEFF8] text-[#0D2282]' : ''
                                }`
                              }
                            >
                              <div className="bg-[#616366] rounded-md w-[25px] h-[25px]"></div>
                              <div className="text-sm">{project.name}</div>
                            </NavLink>
                          </div>
                        ))}
                      </div>
                    </div>}
                  </li>
                  {(isProjectOpen && isSidebarOpen) && (
                    <>
                      <div className="flex flex-col mb-4 p-2 bg-[#F0F1F2] ">
                        <div className="flex justify-between mb-1 items-center">
                          <div className="flex gap-1">
                            {projectsCount > 10 && (
                              <>
                                <FaChevronLeft
                                  onClick={() => {
                                    getProjects(previousPage);
                                  }}
                                  className="text-[#616366] text-[0.65rem] text-xs opacity-60"
                                />
                                <FaChevronRight
                                  onClick={() => {
                                    getProjects(nextPage);
                                  }}
                                  className="text-[#616366] text-[0.65rem] opacity-60"
                                />
                              </>
                            )}
                          </div>
                          <div className="flex items-center opacity-60 gap-1 text-white">
                            <div className="text-xs">{projectsCount}</div>
                            {userProfile.role !== 4 && (
                              <AiOutlinePlus
                                title="Add Project"
                                onClick={() => {
                                  setisModelOpen(true);
                                }}
                                className="text-[#616366] text-base hover:cursor-pointer"
                              />
                            )}
                          </div>
                        </div>
                        <div className="max-h-[20vh] overflow-y-auto">
                          {projects?.map((project, index) => (
                            <div key={index} className="flex flex-col gap-2">
                              <NavLink
                                to={`/project/${project.id}`}
                                className={({ isActive }) =>
                                  `flex items-center rounded-md gap-3 mb-1 cursor-pointer text-[#616366] hover:border hover:border-blue-300 ${isActive ? 'bg-[#DAEFF8] text-[#0D2282]' : ''
                                  }`
                                }
                              >
                                <div className="bg-[#616366] rounded-md w-[25px] h-[25px]"></div>
                                <div className="text-sm">{project.name}</div>
                              </NavLink>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </ul>

            <div className="">
              <li className={`${isSidebarOpen ? 'bg-white pb-2 pt-0 px-2 rounded-lg border border-gray-200 shadow-bottom mb-3 mt-1' : ''}`}>

                <div className={`flex group items-center gap-x-2 ${isSidebarOpen ? 'bg-[#F0F1F2]' : 'borderr border--[#5C5E64]'} p-2 rounded-lg cursor-pointer`}>
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={`${employee?.first_name} ${employee?.last_name}'s Picture`}
                      style={{ width: "45px", height: "45px", borderRadius: "50%" }}
                    />
                  ) : (
                    <>
                      {employee?.first_name?.toUpperCase().slice(0, 1)}
                      {employee?.last_name?.toUpperCase().slice(0, 1)}
                    </>
                  )}

                  <div className={`flex flex-col text-[#5C5E64] ${isSidebarOpen ? 'block' : 'hidden'}`} onClick={() => handleToggleDropdown("Profile")}>
                    <div className="flex items-center gap-x-2">
                      <div className="font-semibold">{employee?.username}</div>
                      <FaAngleDown className={`text-xs transition-transform duration-300 ${isProfileOpen ? 'transform rotate-180' : ''}`} />
                    </div>
                    <div className="text-xs overflow-hidden text-ellipsis" style={{ width: '113px' }}>{employee?.work_email}</div>
                  </div>
                </div>

                {(isProfileOpen && isSidebarOpen) && (
                  <div className="flex flex-col gap-y-1 mt-2">
                    <Link to="/profile" className="flex items-center justify-between px-3 py-1 rounded-md hover:bg-[#DAEFF8] text-[#616366] text-sm hover:text-[#0D2282]">
                      <p>Profile Settings</p>
                      <BsPersonGear />
                    </Link>
                    <div className="flex items-center cursor-pointer justify-between px-3 py-1 rounded-md hover:bg-[#DAEFF8] text-[#616366] text-sm hover:text-[#0D2282]"
                      onClick={() => {
                        window.localStorage.setItem("token","")
                        setUserLogout();
                        navigate("/");
                      }}>
                      <p>Logout</p>
                      <MdOutlineLogout />
                    </div>
                  </div>
                )}
              </li>
            </div>
          </div>

        </div>


        <button className={`bg-white text-gray-500 border border-gray-300 z-10 p-2 absolute ${isSidebarOpen ? "left-56" : "left-0"
          } rounded-e-lg top-0 mt-10 mr-4`}
          onClick={handleSidebarToggle}
        >
          {
            isSidebarOpen ? (
              <FaAngleDoubleLeft title="Close" className="text-xl" />
            ) : (
              <FaAngleDoubleRight title="Open" className="text-xl" />
            )}
        </button >
        <Outlet isSidebarOpen={false} />
      </div>
      {isModelOpen && <ProjectModel onClose={closeProjectModal} />}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
    baseUrl: state.user.baseUrl,
    token: state.user.token,
    isLogin: state.user.isLogin,
  };
};
export default connect(mapStateToProps, { setUserLogout })(MobSidebar);
