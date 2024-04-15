/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import { MdOutlineAccountTree, MdOutlineLogout } from "react-icons/md";
import { PiSuitcaseRollingBold } from "react-icons/pi";
import {
  AiOutlinePlus,
} from "react-icons/ai";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa6";
import { GoProjectSymlink } from "react-icons/go";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import sidebg from "./sidebarBG.png";
import logo from "../../../../assets/images/logo.png";
import { setUserLogout } from "../../../../state/actions/UserAction";
import { connect } from "react-redux";
import ProjectModel from "./ProjectModel";
import Cookies from "universal-cookie";
import axios from "axios";
import { LiaHomeSolid } from "react-icons/lia";
import { BsPersonFillGear, BsPersonGear } from "react-icons/bs";
import { LuCalendarDays, LuFolderCog2 } from "react-icons/lu";
import { GrTree } from "react-icons/gr";
import HrRole from "./HrRole";
import ManagerRole from "./ManagerRole";
import EmployeeRole from "./EmployeeRole";

const Sidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  baseUrl,
  token,
  userProfile,
  sidebarRefresh,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const cookies = new Cookies();
  const [isProjectOpen, setIsProjectOpen] = useState(false);
  const [isModelOpen, setisModelOpen] = useState(false);
  const [isLinksOpen, setIsLinksOpen] = useState(false);
  const [isDbOpen, setIsDbOpen] = useState(false);
  const [isRecruitmentOpen, setIsRecruitmentOpen] = useState(false);
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [nextPage, setNextPage] = useState("");
  const [previousPage, setPreviousPage] = useState("");
  const [projectsCount, setProjectCount] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [expanded, setExpanded] = useState(true);

  const toggleDropdown = (dropdownName) => {
    if (dropdownName === "HRDatabase") {
      setIsDbOpen((prev) => !prev);
      setIsRecruitmentOpen(false);
      setIsLeaveOpen(false);
      setIsProjectOpen(false);
      setIsProfileOpen(false);
    } else if (dropdownName === "Recruitment") {
      setIsRecruitmentOpen((prev) => !prev);
      setIsDbOpen(false);
      setIsLeaveOpen(false);
      setIsProjectOpen(false);
      setIsProfileOpen(false);
    } else if (dropdownName === "LeaveManagement") {
      setIsLeaveOpen((prev) => !prev);
      setIsDbOpen(false);
      setIsRecruitmentOpen(false);
      setIsProjectOpen(false);
      setIsProfileOpen(false);
    } else if (dropdownName === "Projects") {
      setIsProjectOpen((prev) => !prev);
      setIsProfileOpen(false);
      setIsDbOpen(false);
      setIsRecruitmentOpen(false);
      setIsLeaveOpen(false);
    } else if (dropdownName === "Profile") {
      setIsProfileOpen((prev) => !prev);
      setIsProjectOpen(false);
      setIsDbOpen(false);
      setIsRecruitmentOpen(false);
      setIsLeaveOpen(false);
    }
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeProjectModal = () => {
    setisModelOpen(false);
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
  }, [isModelOpen, sidebarRefresh]);


  const fetchData = async () => {
    const employeeResponse = await axios.get(`${baseUrl}/emp/${userProfile.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    console.log('employee', employeeResponse)
    const employeeData = employeeResponse.data;
    setEmployee(employeeData)
    setProfileImage(employeeResponse.data?.profile_picture.file || employeeResponse.data?.profile_picture);
  }

  useEffect(() => {
    fetchData();
  }, []);



  return (
    <>
      <div className="flex">
        {/* Sidebar content goes here */}
        <div
          style={{ backgroundImage: `url(${sidebg})` }}
          className={`h-screen bg-cover bg-[100%] bg-[#fafafa] border border-gray-300 rounded-lg  ${isSidebarOpen ? "w-[14.2rem]" : "w-24"
            }`}

        >
          <div className="text-xl z-10 py-3 px-7 flex border-b border-gray-300 flex-row items-center justify-start gap-1 text-[#2f4acf] font-semibold mb-4 relative">
            <img src={logo} className="inline-block w-12" alt="logo" />
            <h1 className={`inline-block overflow-hidden transition-all ${isSidebarOpen ? 'w-28' : 'w-0'}`}>TECBRIX</h1>
          </div>
          <ul className="overflow-y-auto overflow-x-hidden max-h-[calc(98vh-100px)] hideScroll -mt-10 m-4">
            <li>
              <div className="relative invisible">
                <IoIosSearch className="absolute top-3 left-3 text-white" />
                <input
                  type="search"
                  placeholder="Search"
                  className="focus:outline-none focus:border-non bg-[#8292e2] py-2 pl-10 pr-4  placeholder-white border-none w-48 rounded-md"
                />
              </div>
            </li>

            {userProfile.role === 1 && (
              <>
                <li className="group">
                  <Link to="/">
                    <div className={`flex mb-3 mt-5 rounded-md py-2 t px-2 items-center gap-1 hover:bg-[#DAEFF8] ${location.pathname === "/" ? "bg-[#DAEFF8] text-[#0D2282]" : "text-[#5C5E64]"
                      }`}>
                      <div className={`text-xl ${!isSidebarOpen ? 'ml-[10px]' : ''}`}>
                        <LiaHomeSolid />
                      </div>
                      <p className={`overflow-hidden transition-all ${isSidebarOpen ? 'w-28' : 'w-0'}`}>Home</p>
                    </div>
                  </Link>

                  {!isSidebarOpen && (
                    <div className="absolute rounded-md top-24 ml-20
          bg-white w-24 text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-50  shadow-bottom">

                      <p className="m-1 px-2 py-1 rounded-lg text-[#5C5E64] hover:bg-[#DAEFF8] hover:text-[#0D2282]"><Link to="/">Home</Link></p>
                    </div>
                  )}
                </li>

                <li className="group">
                  <div
                    onClick={() => toggleDropdown("HRDatabase")}
                    className={`flex items-center justify-between py-2 px-2 my-2 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${isDbOpen ? "bg-[#DAEFF8] text-[#0D2282]" : "text-[#5C5E64]"
                      } rounded-lg cursor-pointer `}
                  >
                    <LuFolderCog2 className={`text-xl mr-2 ${!isSidebarOpen ? 'ml-[10px]' : ''}`} />
                    <span className={`flex items-center gap-x-1 flex-grow ${isSidebarOpen ? 'block' : 'hidden'}`}>
                      <p className="flex-grow">People Team</p>
                      <FaAngleDown className={`text-xs transition-transform duration-300 ${isDbOpen ? 'transform rotate-180' : ''}`} />
                    </span>
                  </div>

                  {!isSidebarOpen && (
                    <div className="absolute rounded-md top-40 ml-20
          bg-white w-32 text-base
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-50  shadow-bottom">

                      <div className="flex flex-col bg-white rounded-lg">
                        <li>
                          <Link to="/employees">
                            <div
                              className={`flex rounded-md mx-1 my-1 py-2 items-center gap-x-1 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${location.pathname === "/employees" ? "bg-[#DAEFF8] text-[#0D2282]" : "text-gray-400"
                                }`}
                            >
                              <p className="text-sm px-2">Employee Sheet</p>
                            </div>
                          </Link>
                          <Link to="/add-employee">
                            <div
                              className={`flex rounded-md mx-1 my-1 py-2 items-center gap-x-1 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${location.pathname === "/add-employee" ? "bg-[#DAEFF8] text-[#0D2282]" : "text-gray-400"
                                }`}
                            >
                              <p className="text-sm px-2">Add Employee</p>
                            </div>
                          </Link>
                        </li>
                      </div>
                    </div>
                  )}
                </li>
                {(isDbOpen && isSidebarOpen) &&
                  <div className="flex flex-col mt-2 bg-[#F7F8FA]">
                    <li>
                      <Link to="/employees">
                        <div
                          className={`flex rounded-md my-2 py-2 px-4 items-center gap-x-1 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${location.pathname === "/employees" ? "bg-[#DAEFF8] text-[#0D2282]" : "text-gray-400"
                            }`}
                        >
                          <p className="text-sm">Employee Sheet</p>
                        </div>
                      </Link>
                      <Link to="/add-employee">
                        <div
                          className={`flex rounded-md my-2 py-2 px-4 items-center gap-x-1 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${location.pathname === "/add-employee" ? "bg-[#DAEFF8] text-[#0D2282]" : "text-gray-400"
                            }`}
                        >
                          <p className="text-sm">Add Employee</p>
                        </div>
                      </Link>
                    </li>

                  </div>
                }
                <li className="group">
                  <div
                    onClick={() => toggleDropdown("Recruitment")}
                    className={`flex items-center justify-between my-2 py-2 px-2 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${isRecruitmentOpen ? "bg-[#DAEFF8] text-[#0D2282]" : " text-[#5C5E64]"
                      } rounded-lg cursor-pointer`}
                  >
                    <BsPersonFillGear className={`text-xl mr-2 ${!isSidebarOpen ? 'ml-[10px]' : ''}`} />
                    <div className={`flex items-center gap-x-2 flex-grow ${isSidebarOpen ? 'block' : 'hidden'}`}>
                      <p className="flex-grow">Recruitment</p>
                      <FaAngleDown className={`text-xs transition-transform duration-300 ${isRecruitmentOpen ? 'transform rotate-180' : ''}`} />
                    </div>
                  </div>
                  {!isSidebarOpen && (
                    <div className="absolute rounded-md top-52 ml-20
          bg-white w-32 text-base
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-50  shadow-bottom">

                      <div className="flex flex-col rounded-lg bg-white">
                        <li>
                          <Link to="/jobs">
                            <div
                              className={`flex rounded-md mx-1 my-2 py-2 px-2 items-center hover:bg-[#DAEFF8] hover:text-[#0D2282] gap-x-1 ${location.pathname === "/jobs" ? "bg-[#DAEFF8] text-[#0D2282]" : "text-gray-400"
                                }`}
                            >
                              <p className="text-sm">Jobs</p>
                            </div>
                          </Link>
                          <Link to="/job-post">
                            <div
                              className={`flex rounded-md mx-1 my-2 py-2 px-2 items-center gap-x-1 hover:bg-[#DAEFF8] hover:text-[#0D2282]  ${location.pathname === "/job-post" ? "bg-[#DAEFF8] text-[#0D2282]" : "text-gray-400"
                                }`}
                            >
                              <p className="text-sm">Post a Job</p>
                            </div>
                          </Link>
                        </li>

                      </div>
                    </div>
                  )}
                </li>

                {(isRecruitmentOpen && isSidebarOpen) &&
                  <div className="flex flex-col mt-2 bg-[#F7F8FA]">
                    <li>
                      <Link to="/jobs">
                        <div
                          className={`flex rounded-md my-2 py-2 px-4 items-center hover:bg-[#DAEFF8] hover:text-[#0D2282] gap-x-1 ${location.pathname === "/jobs" ? "bg-[#DAEFF8] text-[#0D2282]" : "text-gray-400"
                            }`}
                        >
                          <p className="text-sm">Jobs</p>
                        </div>
                      </Link>
                      <Link to="/job-post">
                        <div
                          className={`flex rounded-md my-2 py-2 px-4 items-center gap-x-1 hover:bg-[#DAEFF8] hover:text-[#0D2282]  ${location.pathname === "/job-post" ? "bg-[#DAEFF8] text-[#0D2282]" : "text-gray-400"
                            }`}
                        >
                          <p className="text-sm">Post a Job</p>
                        </div>
                      </Link>
                    </li>

                  </div>
                }
                <li className="group">
                  <div
                    onClick={() => toggleDropdown("LeaveManagement")}
                    className={`flex items-center justify-between my-2 py-2 px-2 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${isLeaveOpen ? "bg-[#DAEFF8] text-[#0D2282]" : "text-[#5C5E64]"
                      } rounded-lg cursor-pointer`}
                  >
                    <LuCalendarDays  className={`text-xl mr-1 ${!isSidebarOpen ? 'ml-[10px]' : ''}`} />
                    <div className={`flex items-center gap-x-1 flex-grow ${isSidebarOpen ? 'block' : 'hidden'}`}>
                      <p className="flex-grow">Leave Management</p>
                      <FaAngleDown className={`text-xs transition-transform duration-300 ${isLeaveOpen ? 'transform rotate-180' : ''}`} />
                    </div>
                  </div>
                  {!isSidebarOpen && (
                    <div className="absolute rounded-md top-56 ml-20
          bg-white w-32 text-base
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-50  shadow-bottom">

                      <div className="flex flex-col rounded-lg bg-white">
                        <li>
                          <Link to="/leave-application">
                            <div
                              className={`flex rounded-md mx-1 my-1 py-2 px-2 items-center gap-x-1 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${location.pathname === "/leave-application" ? "bg-[#DAEFF8] text-[#0D2282]" : "text-gray-400"
                                }`}
                            >
                              <p className="text-sm">Leave Application</p>
                            </div>
                          </Link>
                          <Link to="/leave-calender">
                            <div
                              className={`flex rounded-md mx-1 my-1 py-2 px-2 items-center gap-x-1 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${location.pathname === "/leave-calender" ? "bg-[#DAEFF8] text-[#0D2282]" : "text-gray-400"
                                }`}
                            >
                              <p className="text-sm">Leave Calender</p>
                            </div>
                          </Link>
                          <Link to="/leave-list">
                            <div
                              className={`flex rounded-md mx-1 my-1 py-2 px-2 items-center gap-x-1 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${location.pathname === "/leave-list" ? "bg-[#DAEFF8] text-[#0D2282]" : "text-gray-400"
                                }`}
                            >
                              <p className="text-sm">Leave List</p>
                            </div>
                          </Link>
                          <Link to="/leave-balance">
                            <div
                              className={`flex rounded-md mx-1 my-1 py-2 px-2 items-center gap-x-1 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${location.pathname === "/leave-balance" ? "bg-[#DAEFF8] text-[#0D2282]" : "text-gray-400"
                                }`}
                            >
                              <p className="text-sm">Leave Balance</p>
                            </div>
                          </Link>
                        </li>

                      </div>
                    </div>
                  )}
                </li>

                {(isLeaveOpen && isSidebarOpen) &&
                  <div className="flex flex-col mt-2 bg-[#F7F8FA]">
                    <li>
                      <Link to="/leave-application">
                        <div
                          className={`flex rounded-md my-2 py-2 px-4 items-center gap-x-1 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${location.pathname === "/leave-application" ? "bg-[#DAEFF8] text-[#0D2282]" : "text-gray-400"
                            }`}
                        >
                          <p className="text-sm">Leave Application</p>
                        </div>
                      </Link>
                      <Link to="/leave-calender">
                        <div
                          className={`flex rounded-md my-2 py-2 px-4 items-center gap-x-1 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${location.pathname === "/leave-calender" ? "bg-[#DAEFF8] text-[#0D2282]" : "text-gray-400"
                            }`}
                        >
                          <p className="text-sm">Leave Calender</p>
                        </div>
                      </Link>
                      <Link to="/leave-list">
                        <div
                          className={`flex rounded-md my-2 py-2 px-4 items-center gap-x-1 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${location.pathname === "/leave-list" ? "bg-[#DAEFF8] text-[#0D2282]" : "text-gray-400"
                            }`}
                        >
                          <p className="text-sm">Leave List</p>
                        </div>
                      </Link>
                      <Link to="/leave-balance">
                        <div
                          className={`flex rounded-md my-2 py-2 px-4 items-center gap-x-1 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${location.pathname === "/leave-balance" ? "bg-[#DAEFF8] text-[#0D2282]" : "text-gray-400"
                            }`}
                        >
                          <p className="text-sm">Leave Balance</p>
                        </div>
                      </Link>
                    </li>

                  </div>
                }

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
                  onClick={() => toggleDropdown("Projects")}
                  className={`flex group mb-1 mt-2 mb-2 justify-between hover:bg-[#DAEFF8] hover:text-[#0D2282] rounded-md py-2 px-2 items-center gap-1 cursor-pointer ${isProjectOpen ? "bg-[#DAEFF8] text-[#0D2282]" : "text-[#5C5E64]"
                    }`}
                >
                  <div className="flex gap-1">
                    <MdOutlineAccountTree className={`text-xl ${!isSidebarOpen ? 'ml-[10px]' : ''}`} />{" "}
                    <p className={`${isSidebarOpen ? 'block' : 'hidden'}`}>Task Management</p>
                  </div>
                  <FaAngleDown
                    className={`text-xs transform transition-transform ${isProjectOpen ? 'rotate-180' : ''
                      } ${isSidebarOpen ? 'block' : 'hidden'}`}
                  />
                  {!isSidebarOpen && <div className="absolute rounded-md top-60 ml-20
          bg-white w-32 text-base
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-50 shadow-bottom">
                    <div className="max-h-[20vh] overflow-y-auto hideScroll p-1">
                      {projects?.map((project, index) => (
                        <div key={index} className="flex flex-col gap-2">
                          <div
                            onClick={() => {
                              navigate(`/project/${project.id}`);
                            }}
                            className="flex items-center rounded-md gap-3 mb-1 cursor-pointer hover:bg-[#DAEFF8] text-[#616366] hover:text-[#0D2282]"
                          >
                            <div className="bg-[#616366] rounded-md w-[22px] h-[22px]"></div>
                            <div className="text-sm">{project.name}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>}
                </li>
                {(isProjectOpen && isSidebarOpen) && (
                  <>
                    <div className="flex flex-col rounded-xl mb-4 p-2 bg-[#F0F1F2] ">
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
                      <div className="max-h-[20vh] overflow-y-auto hideScroll">
                        {projects?.map((project, index) => (
                          <div key={index} className="flex flex-col gap-2">
                            <div
                              onClick={() => {
                                navigate(`/project/${project.id}`);
                              }}
                              className="flex items-center rounded-md gap-3 mb-1 cursor-pointer hover:bg-[#DAEFF8] text-[#616366] hover:text-[#0D2282]"
                            >
                              <div className="bg-[#616366] rounded-md w-[25px] h-[25px]"></div>
                              <div className="text-sm">{project.name}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            <li className={`${isSidebarOpen ? 'bg-white py-2 px-2 rounded-lg border border-gray-200 shadow-bottom mb-3 mt-1' : ''}`}>

              <div className={`flex group items-center gap-x-2 py-3 ${isSidebarOpen ? 'bg-[#F0F1F2]' : 'borderr border--[#5C5E64]'} px-2 rounded-lg cursor-pointer`}>
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

                {!isSidebarOpen && (
                  <div className="absolute rounded-md top-80 ml-20
          bg-white w-40 text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-50  shadow-bottom">

                    <div className="flex items-center bg-[#F0F1F2] rounded-lg m-1">
                      <div className={`flex group items-center gap-x-2 py-3 px-2 rounded-lg cursor-pointer`}>
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
                      </div>
                      <div className={`flex flex-col text-[#5C5E64]`} >
                        <div className="flex items-center gap-x-2">
                          <div className="font-semibold">{employee?.username}</div>
                        </div>
                        <div className="text-xs">{employee?.email}</div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-y-2 mt-2 mx-1">
                      <Link to="/profile" className="flex items-center justify-between px-3 py-1 rounded-md hover:bg-[#DAEFF8] text-[#616366] text-sm hover:text-[#0D2282]">
                        <p>Profile Settings</p>
                        <BsPersonGear />
                      </Link>
                      <div className="flex items-center justify-between px-3 py-1 mb-1 rounded-md hover:bg-[#DAEFF8] text-[#616366] text-sm hover:text-[#0D2282]"
                        onClick={() => {
                          cookies.set("token", "", { path: "*" });
                          setUserLogout();
                          navigate("/");
                        }}>
                        <p>Logout</p>
                        <MdOutlineLogout />
                      </div>
                    </div>
                  </div>
                )}

                <div className={`flex flex-col text-[#5C5E64] ${isSidebarOpen ? 'block' : 'hidden'}`} onClick={() => toggleDropdown("Profile")}>
                  <div className="flex items-center gap-x-2">
                    <div className="font-semibold">{employee?.username}</div>
                    <FaAngleDown className={`text-xs transition-transform duration-300 ${isProfileOpen ? 'transform rotate-180' : ''}`} />
                  </div>
                  <div className="text-xs">{employee?.email}</div>
                </div>
              </div>
              {(isProfileOpen && isSidebarOpen) && (
                <div className="flex flex-col gap-y-2 mt-2">
                  <Link to="/profile" className="flex items-center justify-between px-3 py-1 rounded-md hover:bg-[#DAEFF8] text-[#616366] text-sm hover:text-[#0D2282]">
                    <p>Profile Settings</p>
                    <BsPersonGear />
                  </Link>
                  <div className="flex items-center justify-between px-3 py-1 rounded-md hover:bg-[#DAEFF8] text-[#616366] text-sm hover:text-[#0D2282]"
                    onClick={() => {
                      cookies.set("token", "", { path: "*" });
                      setUserLogout();
                      navigate("/");
                    }}>
                    <p>Logout</p>
                    <MdOutlineLogout />
                  </div>
                </div>
              )}
            </li>
          </ul >
        </div >

        {/* Sidebar collapse button */}
        <button button
          className={`bg-white text-gray-500 border border-gray-300 p-1.5 absolute ${isSidebarOpen ? "left-[13rem] top-10" : "left-20 top-8"
            } rounded-lg  mt-4 mr-4 z-10`}
          onClick={handleSidebarToggle}
        >
          {
            isSidebarOpen ? (
              <FaAngleDoubleLeft title="Close" className="text-xl" />
            ) : (
              <FaAngleDoubleRight title="Open" className="text-xl" />
            )}
        </button >

        <Outlet isSidebarOpen={isSidebarOpen} />
      </div >

      {isModelOpen && <ProjectModel onClose={closeProjectModal} />
      }
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
    baseUrl: state.user.baseUrl,
    token: state.user.token,
    isLogin: state.user.isLogin,
    sidebarRefresh: state.user.sidebarRefresh,
  };
};
export default connect(mapStateToProps, { setUserLogout })(Sidebar);
