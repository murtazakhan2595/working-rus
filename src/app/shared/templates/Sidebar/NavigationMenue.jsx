/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { IoIosSearch, IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineLogout } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import {
    FaAngleDoubleLeft,
    FaAngleDoubleRight,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa6";
import { Outlet, Link, useNavigate, NavLink } from "react-router-dom";
import logo from "../../../../assets/images/logo.png";
import { connect } from "react-redux";
import ProjectModel from "./ProjectModel";
import Cookies from "universal-cookie";
import axios from "axios";
import { BsPersonGear } from "react-icons/bs";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { toggleDropdown } from "../../../../state/slices/DropdownSlice";
import { setUserLogout } from "../../../../state/actions/UserAction";

const NavigationMenue = ({
    isSidebarOpen,
    navigation,
}) => {
    const normalLink = `flex rounded-md my-1 py-1.5 ${!isSidebarOpen ? "px-1" : "px-4"
        } items-center gap-x-1 text-[#5C5E64] hover:border hover:border-blue-300 text-[10px]`;
    const activeLink = `flex rounded-md my-1 py-1.5 ${!isSidebarOpen ? "px-1" : "px-4"
        } items-center gap-x-1 bg-[#DAEFF8] text-[#5C5E64]`;
    // const ComingActiveLink = `flex rounded-md my-1 py-1.5 ${!isSidebarOpen ? "px-1" : "px-4"} items-center gap-x-1 text-[#5C5E64]`;

    const navigate = useNavigate();
    const {
        isDbOpen,
        isServiceHubOpen,
        isRecruitmentOpen,
        isPerformanceOpen,
        isPayrollOpen,
        isPeopleEngagementOpen,
        isPersonalDevelopmentOpen,
        isLeaveOpen,
        isProjectOpen,
        isDtrOpen,
        isTransferOpen,
        isLetterRequestOpen,
        isTodoOpen,
        isDevelopmentPlanOpen,
        isSettingsOpen,
    } = useSelector((state) => state.dropdown);
    const dispatch = useDispatch();
    const handleToggleDropdown = (dropdownName) => {
        dispatch(toggleDropdown(dropdownName));
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
        transfer: isTransferOpen,
        letterRequest: isLetterRequestOpen,
        todo: isTodoOpen,
        developmentPlan: isDevelopmentPlanOpen,
        settings: isSettingsOpen,
        Projects: isProjectOpen,
    };

    return (
        <ul className="">
            {navigation &&
                navigation.items.map((item, index) => (
                    <li className="group relative" key={index}>
                        <div
                            onClick={() => {
                                if (item.url) navigate(item.url);
                                else handleToggleDropdown(item.dropdown);
                            }}
                            className={`flex items-center justify-between py-2 px-2 mt-2 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${dropdownOpen[item.dropdown]
                                ? "bg-[#DAEFF8] text-[#0D2282]"
                                : "text-[#5C5E64]"
                                } ${isSidebarOpen ? "rounded-t-lg" : "rounded-lg"
                                } cursor-pointer `}
                        >
                            <div className="flex flex-col justify-center">
                                <div
                                    className={`text-xl mr-3 ${!isSidebarOpen
                                        ? "ml-[12px] flex justify-center"
                                        : ""
                                        }`}
                                >
                                    {item.icon}
                                </div>
                                <p
                                    className={`text-xs text-center transition-opacity duration-300 ${isSidebarOpen
                                        ? "hidden"
                                        : "hidden group-hover:block group-hover:opacity-100"
                                        }`}
                                    style={{
                                        overflow: "hidden",
                                    }}
                                >
                                    {item.name}
                                </p>
                            </div>
                            <span
                                className={`flex items-center gap-x-1 flex-grow ${isSidebarOpen ? "block" : "hidden"
                                    }`}
                            >
                                <p className="flex-grow text-[14px]">{item.name}</p>
                                {!item.url && (
                                    <FaAngleDown
                                        className={`text-xs transition-transform duration-300 ${dropdownOpen[item.dropdown]
                                            ? "transform rotate-180"
                                            : ""
                                            }`}
                                    />
                                )}
                            </span>
                        </div>
                        {item.children && (
                            <>
                                {!isSidebarOpen && (
                                    <div
                                        className="absolute rounded-lg border border-gray-100 ml-20 bg-white w-44 text-base opacity-00 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-50 shadow-bottom"
                                        style={{ top: "0" }}
                                    >
                                        <div className="flex flex-col bg-white rounded-lg">
                                            <li>
                                                {item.children.map((child, index) => (
                                                    <NavLink
                                                        to={child.url}
                                                        key={index}
                                                        className={({ isActive }) =>
                                                            isActive ? activeLink : normalLink
                                                        }
                                                    >
                                                        <p className="text-sm px-2">
                                                            {child.name}
                                                        </p>
                                                    </NavLink>
                                                ))}
                                            </li>
                                        </div>
                                    </div>
                                )}
                                {dropdownOpen[item.dropdown] && isSidebarOpen && (
                                    <div className="flex flex-col bg-[#F7F8FA]">
                                        {item.children.map((child, index) => (
                                            <div key={index}>
                                                {child.children ? (
                                                    <div>
                                                        <div
                                                            onClick={() =>
                                                                handleToggleDropdown(child.dropdown)
                                                            }
                                                            className={`rounded-t-lg flex items-center justify-between py-2 px-2 mt-2 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${dropdownOpen[child.dropdown]
                                                                ? "bg-[#DAEFF8] text-[#0D2282]"
                                                                : "text-[#5C5E64]"
                                                                } cursor-pointer`}
                                                        >
                                                            <div className="flex flex-col justify-center">
                                                                <div
                                                                    className={`text-xl mr-3 ${!isSidebarOpen
                                                                        ? "ml-[12px] flex justify-center"
                                                                        : ""
                                                                        }`}
                                                                >
                                                                    {child.icon}
                                                                </div>
                                                                <p className={`text-sm px-2`}>
                                                                    {child.name}
                                                                </p>
                                                            </div>
                                                            <FaAngleDown
                                                                className={`text-xs transition-transform duration-300 ${dropdownOpen[child.dropdown]
                                                                    ? "transform rotate-180"
                                                                    : ""
                                                                    }`}
                                                            />
                                                        </div>
                                                        {dropdownOpen[child.dropdown] &&
                                                            isSidebarOpen && (
                                                                <div className="flex flex-col bg-[#F7F8FA]">
                                                                    {child.children.map(
                                                                        (subChild, subIndex) => (
                                                                            <NavLink
                                                                                to={subChild.url}
                                                                                key={subIndex}
                                                                                className={({ isActive }) =>
                                                                                    isActive
                                                                                        ? activeLink
                                                                                        : normalLink
                                                                                }
                                                                            >
                                                                                <p className="text-sm px-2">
                                                                                    {subChild.name}
                                                                                </p>
                                                                            </NavLink>
                                                                        )
                                                                    )}
                                                                </div>
                                                            )}
                                                    </div>
                                                ) : (
                                                    <NavLink
                                                        to={child.url}
                                                        className={({ isActive }) =>
                                                            isActive ? activeLink : normalLink
                                                        }
                                                    >
                                                        <p className="text-sm px-2">
                                                            {child.name}
                                                        </p>
                                                    </NavLink>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </li>
                ))}
            {/* {userProfile.role !== 3 && (
                        <>
                            <li
                                onClick={() => handleToggleDropdown("Projects")}
                                className={`flex group mt-2 justify-between hover:bg-[#DAEFF8] hover:text-[#0D2282] py-2 px-2 items-center gap-1 cursor-pointer ${isProjectOpen
                                    ? "bg-[#DAEFF8] text-[#0D2282]"
                                    : "text-[#5C5E64]"
                                    } ${isSidebarOpen ? "rounded-t-lg" : "rounded-lg"}`}
                            >
                                <div className="flex gap-x-2">
                                    <div className="flex flex-col items-center">
                                        <IoMdCheckmarkCircleOutline
                                            className={`text-xl ${!isSidebarOpen ? "ml-[10px]" : ""
                                                }`}
                                        />{" "}
                                        <p
                                            className={`text-center ml-2 text-xs transition-opacity duration-300 ${isSidebarOpen
                                                ? "hidden"
                                                : "hidden group-hover:block group-hover:opacity-100"
                                                }`}
                                        >
                                            Task
                                        </p>
                                    </div>
                                    <p
                                        className={` text-[14px] ${isSidebarOpen ? "block" : "hidden"
                                            }`}
                                    >
                                        Task Management
                                    </p>
                                </div>
                                <FaAngleDown
                                    className={`text-xs transform transition-transform ${isProjectOpen ? "rotate-180" : ""
                                        } ${isSidebarOpen ? "block" : "hidden"}`}
                                />
                                {!isSidebarOpen && (
                                    <div
                                        className="absolute rounded-lg border border-gray-1 ml-20 bg-white w-44 text-base
                                                opacity-00 -translate-x-3 transition-all
                                                group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-50 shadow-bottom"
                                    >
                                        <div className="max-h-[20vh] overflow-y-auto p-1">
                                            {projects?.map((project, index) => (
                                                <div key={index} className="flex flex-col gap-2">
                                                    <NavLink
                                                        to={`/project/${project.id}`}
                                                        className={({ isActive }) =>
                                                            `flex items-center rounded-md gap-3 mb-1 cursor-pointer text-[#616366] hover:border hover:border-blue-300 ${isActive
                                                                ? "bg-[#DAEFF8] text-[#0D2282]"
                                                                : ""
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
                                )}
                            </li>
                            {isProjectOpen && isSidebarOpen && (
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
                                                            `flex items-center rounded-md gap-3 mb-1 cursor-pointer text-[#616366] hover:border hover:border-blue-300 ${isActive
                                                                ? "bg-[#DAEFF8] text-[#0D2282]"
                                                                : ""
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
                    )} */}
        </ul>
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
export default connect(mapStateToProps, { setUserLogout })(NavigationMenue);
