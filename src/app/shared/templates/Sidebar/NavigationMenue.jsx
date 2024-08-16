// Sidebar menu links

import { FaAngleDown } from "react-icons/fa6";
import { Outlet, Link, useNavigate, NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { toggleDropdown } from "../../../../state/slices/DropdownSlice";
import { setUserLogout } from "../../../../state/actions/UserAction";
import { ScrollArea } from "../../../../src/@/components/ui/scroll-area";
import React from "react"
import { Ellipsis, LogOut } from "lucide-react"
import { useLocation } from "react-router-dom"
import { cn } from "../../../../src//@/lib/utils"
import { Button } from "../../../../src/@/components/ui/button"
import { CollapseMenuButton } from "../../../../components/ui/collapse-menu-button"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from "../../../../src/@/components/ui/tooltip"
const NavigationMenue = ({
    isOpen,
    isSidebarOpen,
    navigation,
}) => {
  
    
    const normalLink = `flex  my-1 py-1.5 ${!isSidebarOpen ? "px-1" : "px-4"
        } items-center gap-x-1 text-[#5C5E64] hover:border hover:border-blue-300 text-[10px]`;
    const activeLink = `flex rounded-full bg-plum-2 my-1 py-1.5 ${!isSidebarOpen ? "px-1" : "px-4"
        } items-center gap-x-1 bg-plum-2 text-plum-11`;
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
        <>
            <ScrollArea className="[&>div>div[style]]:!block">
                <nav className="w-full h-full mt-8">
                    <ul className="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-1 px-2">                    
                        {navigation &&
                            navigation.items.map((item, index) => (
                                <li className="relative w-full group" key={index}>
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
                                                    className="absolute z-50 ml-20 text-base transition-all -translate-x-3 bg-white border border-gray-100 rounded-lg w-44 opacity-00 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 shadow-bottom"
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
                                                                    <p className="px-2 text-sm">
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
                                                                                            <p className="px-2 text-sm">
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
                                                                    <p className="px-2 text-sm">
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
                        
                    </ul>
                </nav>
            </ScrollArea>
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
export default connect(mapStateToProps, { setUserLogout })(NavigationMenue);
