/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { IoIosSearch, IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdBarChart, MdOutlineLogout, MdOutlineTrendingUp } from "react-icons/md";
import {
    AiOutlinePlus,
} from "react-icons/ai";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaChevronLeft, FaChevronRight, FaRegStar } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa6";
import { Outlet, Link, useNavigate, useLocation, NavLink } from "react-router-dom";
import sidebg from "./sidebarBG.png";
import logo from "../../../../assets/images/logo.png";
import { setUserLogout } from "../../../../state/actions/UserAction";
import { connect } from "react-redux";
import ProjectModel from "./ProjectModel";
import Cookies from "universal-cookie";
import axios from "axios";
import { BsPersonGear } from "react-icons/bs";
import { LuCalendarDays } from "react-icons/lu";
import HrRole from "./HrRole";
import ManagerRole from "./ManagerRole";
import EmployeeRole from "./EmployeeRole";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { toggleDropdown } from "../../../../state/slices/DropdownSlice";
import { GoHome, GoPeople, GoPerson } from "react-icons/go";
import { SlBadge } from "react-icons/sl";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { HiOutlineDocumentReport } from "react-icons/hi";
import getNavigation from '../../../utils/Types/Navigation';

const Sidebar = ({
    isSidebarOpen,
    setIsSidebarOpen,
    baseUrl,
    token,
    userProfile,
    sidebarRefresh,
}) => {

    const normalLink = `flex rounded-md my-1 py-1.5 ${!isSidebarOpen ? "px-1" : "px-4"} items-center gap-x-1 text-[#5C5E64] hover:border hover:border-blue-300 text-[10px]`
    const activeLink = `flex rounded-md my-1 py-1.5 ${!isSidebarOpen ? "px-1" : "px-4"} items-center gap-x-1 bg-[#DAEFF8] text-[#5C5E64]`;
    const ComingActiveLink = `flex rounded-md my-1 py-1.5 ${!isSidebarOpen ? "px-1" : "px-4"} items-center gap-x-1 text-[#5C5E64]`;

    const location = useLocation();
    const navigate = useNavigate();
    const cookies = new Cookies();
    const [isModelOpen, setisModelOpen] = useState(false);
    const [projects, setProjects] = useState([]);
    const [nextPage, setNextPage] = useState("");
    const [previousPage, setPreviousPage] = useState("");
    const [projectsCount, setProjectCount] = useState(0);
    const [profileImage, setProfileImage] = useState(null);
    const [employee, setEmployee] = useState(null);
    const [Navigation, setNavigation] = useState(null);
    const { isDbOpen, isServiceHubOpen, isRecruitmentOpen, isPerformanceOpen, isPayrollOpen, isPeopleEngagementOpen, isPersonalDevelopmentOpen, isLeaveOpen, isProjectOpen, isProfileOpen, isDtrOpen } = useSelector(state => state.dropdown);
    const dispatch = useDispatch();
    const handleToggleDropdown = (dropdownName) => {
        dispatch(toggleDropdown(dropdownName));
    };
    const handleSidebarToggle = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    const closeProjectModal = () => {
        setisModelOpen(false);
    };

    const dropdownOpen = {
        HRDatabase: isDbOpen,
        serviceHub: isServiceHubOpen,
        Recruitment: isRecruitmentOpen,
        LeaveManagement: isLeaveOpen,
        performance: isPerformanceOpen,
        payrollAndAttendance: isPayrollOpen,
        peopleEngagement: isPeopleEngagementOpen,
        personalDevelopment: isPersonalDevelopmentOpen,
        dtr: isDtrOpen,
    }

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
        const employeeData = employeeResponse.data;
        setEmployee(employeeData)
        setNavigation(getNavigation(employeeData.user_role))
        setProfileImage(employeeResponse.data?.profile_picture?.file || employeeResponse.data?.profile_picture);
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
                    className={`h-screen bg-cover bg-[100%] bg-[#fafafa] border border-gray-300 rounded-e-lg ${isSidebarOpen ? "w-[14.2rem]" : "w-24"
                        }`}

                >
                    <div className="text-xl z-10 py-3 px-3 flex border-b border-gray-300 flex-row items-center justify-start gap-1 text-[#2f4acf] font-semibold mb-4 relative">
                        <img src={logo} className="inline-block w-12" alt="logo" />
                        <h1 className={`inline-block overflow-hidden transition-all text-2xl ${isSidebarOpen ? 'w-28' : 'w-0'}`}>TECBRIX</h1>
                    </div>
                    <ul className="hideScroll mx-2">
                        <div className="flex flex-col justify-between h-[87vh]">
                            <div className={`hideScroll ${isSidebarOpen ? 'overflow-y-auto overflow-x-visible' : ''}`}>
                                <>
                                    <li className="d-none">
                                        <div className="relative">
                                            <IoIosSearch className="absolute top-3 left-3 text-white" />
                                            <input
                                                type="search"
                                                placeholder="Search"
                                                className="focus:outline-none focus:border-non bg-[#8292e2] py-2 pl-10 pr-4  placeholder-white border-none w-48 rounded-md"
                                            />
                                        </div>
                                    </li>
                                    
                                    {Navigation && Navigation.items.map((item, index) => {
                                        return (
                                            <>
                                                <li className="group relative">
                                                    <div
                                                        onClick={() => {
                                                            if (item.url) navigate(item.url)
                                                            else handleToggleDropdown(item.dropdown)
                                                        }}
                                                        className={`flex items-center justify-between py-2 px-2 mt-2 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${dropdownOpen[item.dropdown] ? "bg-[#DAEFF8] text-[#0D2282]" : "text-[#5C5E64]"
                                                            } ${isSidebarOpen ? "rounded-t-lg" : "rounded-lg"} cursor-pointer `}
                                                    >
                                                        <div className="flex flex-col justify-center">
                                                            <div className={`text-xl mr-3 ${!isSidebarOpen ? 'ml-[12px] flex justify-center' : ''}`}>{item.icon}</div>
                                                            <p className={`text-xs text-center transition-opacity duration-300 ${isSidebarOpen ? 'hidden' : 'hidden group-hover:block group-hover:opacity-100'}`}
                                                                style={{
                                                                    overflow: 'hidden',
                                                                }}>
                                                                {item.name}
                                                            </p>
                                                        </div>
                                                        <span className={`flex items-center gap-x-1 flex-grow ${isSidebarOpen ? 'block' : 'hidden'}`}>
                                                            <p className="flex-grow text-[14px]">{item.name}</p>
                                                            {!(item.url) && <FaAngleDown className={`text-xs transition-transform duration-300 ${dropdownOpen[item.dropdown] ? 'transform rotate-180' : ''}`} />}
                                                        </span>
                                                    </div>
                                                    {item.children &&
                                                        <>
                                                            {!isSidebarOpen && (
                                                                <div className="absolute rounded-lg border border-gray-100 ml-20 bg-white w-44 text-base opacity-00 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-50 shadow-bottom"
                                                                    style={{ top: '0' }}>
                                                                    <div className="flex flex-col bg-white rounded-lg">
                                                                        <li>
                                                                            {item.children.map((child, index) => {
                                                                                return (
                                                                                    <>
                                                                                        <NavLink to={child.url}
                                                                                            className={({ isActive }) => isActive ? activeLink : normalLink}
                                                                                        >
                                                                                            <p className="text-sm px-2">{child.name}</p>
                                                                                        </NavLink>
                                                                                    </>
                                                                                )
                                                                            })}
                                                                        </li>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {(dropdownOpen[item.dropdown] && isSidebarOpen) &&
                                                                <div className="flex flex-col bg-[#F7F8FA]">
                                                                    {item.children.map((child, index) => {
                                                                        return (
                                                                            <>
                                                                                <NavLink to={child.url}
                                                                                    className={({ isActive }) => isActive ? activeLink : normalLink}
                                                                                >
                                                                                    <p className="text-sm px-2">{child.name}</p>
                                                                                </NavLink>
                                                                            </>
                                                                        )
                                                                    })}
                                                                </div>
                                                            }
                                                        </>
                                                    }
                                                </li>
                                            </>
                                        )
                                    })}
                                </>
                                {/* {userProfile.role === 3 && (
                                    <HrRole isSidebarOpen={isSidebarOpen} />
                                )} */}
                                {/* {(userProfile.role === 2) && (
                                    <ManagerRole isSidebarOpen={isSidebarOpen} />
                                )} */}
                                {/* {(userProfile.role === 4) && (
                                    <EmployeeRole isSidebarOpen={isSidebarOpen} />
                                )} */}

                                {userProfile.role !== 3 && (
                                    <>
                                        <li
                                            onClick={() => handleToggleDropdown("Projects")}
                                            className={`flex group mt-2 justify-between hover:bg-[#DAEFF8] hover:text-[#0D2282] py-2 px-2 items-center gap-1 cursor-pointer ${isProjectOpen ? "bg-[#DAEFF8] text-[#0D2282]" : "text-[#5C5E64]"
                                                } ${isSidebarOpen ? "rounded-t-lg" : "rounded-lg"}`}
                                        >
                                            <div className="flex gap-x-2">
                                                <div className="flex flex-col items-center">
                                                    <IoMdCheckmarkCircleOutline className={`text-xl ${!isSidebarOpen ? 'ml-[10px]' : ''}`} />{" "}
                                                    <p className={`text-center ml-2 text-xs transition-opacity duration-300 ${isSidebarOpen ? 'hidden' : 'hidden group-hover:block group-hover:opacity-100'}`}>
                                                        Task
                                                    </p>
                                                </div>
                                                <p className={` text-[14px] ${isSidebarOpen ? 'block' : 'hidden'}`}>Task Management</p>
                                            </div>
                                            <FaAngleDown
                                                className={`text-xs transform transition-transform ${isProjectOpen ? 'rotate-180' : ''
                                                    } ${isSidebarOpen ? 'block' : 'hidden'}`}
                                            />
                                            {!isSidebarOpen && <div className="absolute rounded-lg border border-gray-1 ml-20 bg-white w-44 text-base
                                                opacity-00 -translate-x-3 transition-all
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
                            </div>

                            <div className="">
                                <li className={`${isSidebarOpen ? 'bg-white rounded-lg border border-gray-200 shadow-bottom mb-3 mt-1' : ''}`}>

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
                                            <div className="absolute rounded-lg border border-gray-1 ml-20
                                                bg-white w-44 text-sm
                                                opacity-00 
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
                                                        <div className="text-xs overflow-hidden text-ellipsis" style={{ width: '100px' }}>{employee?.work_email}</div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-y-2 mt-2 mx-1">
                                                    <Link to="/profile" className="flex items-center justify-between px-3 py-1 rounded-md hover:bg-[#DAEFF8] text-[#616366] text-sm hover:text-[#0D2282]">
                                                        <p>Profile Settings</p>
                                                        <BsPersonGear />
                                                    </Link>
                                                    <div className="flex items-center cursor-pointer justify-between px-3 py-1 mb-1 rounded-md hover:bg-[#DAEFF8] text-[#616366] text-sm hover:text-[#0D2282]"
                                                        onClick={() => {
                                                            cookies.set("token", "", { path: "*" });
                                                            setUserLogout();
                                                            navigate("/login");
                                                        }}>
                                                        <p>Logout</p>
                                                        <MdOutlineLogout />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className={`flex flex-col text-[#5C5E64] ${isSidebarOpen ? 'block' : 'hidden'}`} onClick={() => handleToggleDropdown("Profile")}>
                                            <div className="flex items-center gap-x-2">
                                                <div className="font-semibold">{employee?.username}</div>
                                                <FaAngleDown className={`text-xs transition-transform duration-300 ${isProfileOpen ? 'transform rotate-180' : ''}`} />
                                            </div>
                                            <div className="text-xs overflow-hidden text-ellipsis" style={{ width: '130px' }}>{employee?.work_email}</div>
                                        </div>
                                    </div>

                                    {(isProfileOpen && isSidebarOpen) && (
                                        <div className="flex flex-col gap-y-2 mt-2">
                                            <Link to="/profile" className="flex items-center justify-between px-3 py-1 rounded-md hover:bg-[#DAEFF8] text-[#616366] text-sm hover:text-[#0D2282]">
                                                <p>Profile Settings</p>
                                                <BsPersonGear />
                                            </Link>
                                            <div className="flex items-center cursor-pointer justify-between px-3 py-1 rounded-md hover:bg-[#DAEFF8] text-[#616366] text-sm hover:text-[#0D2282]"
                                                onClick={() => {
                                                    cookies.set("token", "", { path: "*" });
                                                    setUserLogout();
                                                    navigate("/login");
                                                }}>
                                                <p>Logout</p>
                                                <MdOutlineLogout />
                                            </div>
                                        </div>
                                    )}
                                </li>
                            </div>
                        </div>
                    </ul>
                </div >

                {/* Sidebar collapse button */}
                <button button
                    className={`bg-white text-gray-500 border border-gray-300 p-1.5 absolute ${isSidebarOpen ? "left-[10rem] top-10" : "left-20 top-8"
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
