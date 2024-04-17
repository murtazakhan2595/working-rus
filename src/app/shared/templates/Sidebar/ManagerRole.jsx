/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import { MdExitToApp, MdLock, MdOutlineAccountTree, MdOutlineCalendarMonth, MdOutlineLogout, MdOutlinePayment, MdOutlineTimeToLeave, MdSettings } from "react-icons/md";
import { PiSuitcaseRollingBold } from "react-icons/pi";
import { FaAngleDown } from "react-icons/fa6";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { setUserLogout } from "../../../../state/actions/UserAction";
import { connect } from "react-redux";
import ProjectModel from "./ProjectModel";
import Cookies from "universal-cookie";
import axios from "axios";
import { LiaHomeSolid } from "react-icons/lia";
import { RiProfileLine } from "react-icons/ri";
import { BiSpreadsheet } from "react-icons/bi";
import { BsPersonFillGear, BsPersonGear } from "react-icons/bs";
import { LuCalendarDays, LuFolderCog2 } from "react-icons/lu";
import { GrTree } from "react-icons/gr";
import HrRole from "./HrRole";

const ManagerRole = ({
    isSidebarOpen,
}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const cookies = new Cookies();
    const [isProjectOpen, setIsProjectOpen] = useState(false);
    const [isModelOpen, setisModelOpen] = useState(false);
    const [isLinksOpen, setIsLinksOpen] = useState(false);
    const [isRecruitmentOpen, setIsRecruitmentOpen] = useState(false);
    const [isLeaveOpen, setIsLeaveOpen] = useState(false);


    const toggleDropdown = (dropdownName) => {
        if (dropdownName === "LeaveManagement") {
            setIsLeaveOpen((prev) => !prev);
            setIsProjectOpen(false);
        } else if (dropdownName === "Projects") {
            setIsProjectOpen((prev) => !prev);
            setIsLeaveOpen(false);
        }
    };


    return (
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
                    onClick={() => toggleDropdown("LeaveManagement")}
                    className={`flex items-center justify-between my-2 py-2 px-2 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${isLeaveOpen ? "bg-[#DAEFF8] text-[#0D2282]" : "text-[#5C5E64]"
                        } rounded-lg cursor-pointer`}
                >
                    <LuCalendarDays className={`text-xl mr-1 ${!isSidebarOpen ? 'ml-[10px]' : ''}`} />
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
                                <Link to="/leave-application-status">
                                    <div
                                        className={`flex rounded-md my-2 py-2 px-4 items-center gap-x-1 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${location.pathname === "/leave-calender" ? "bg-[#DAEFF8] text-[#0D2282]" : "text-gray-400"
                                            }`}
                                    >
                                        <p className="text-sm">Application Status</p>
                                    </div>
                                </Link>
                                {/* <Link to="/leave-calender">
                                    <div
                                        className={`flex rounded-md mx-1 my-1 py-2 px-2 items-center gap-x-1 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${location.pathname === "/leave-calender" ? "bg-[#DAEFF8] text-[#0D2282]" : "text-gray-400"
                                            }`}
                                    >
                                        <p className="text-sm">Leave Calender</p>
                                    </div>
                                </Link> */}
                                <Link to="/leave-list">
                                    <div
                                        className={`flex rounded-md mx-1 my-1 py-2 px-2 items-center gap-x-1 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${location.pathname === "/leave-list" ? "bg-[#DAEFF8] text-[#0D2282]" : "text-gray-400"
                                            }`}
                                    >
                                        <p className="text-sm">Leave List</p>
                                    </div>
                                </Link>
                                <Link to="/leave-balance-manager">
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
                        <Link to="/leave-application-status">
                            <div
                                className={`flex rounded-md my-2 py-2 px-4 items-center gap-x-1 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${location.pathname === "/leave-calender" ? "bg-[#DAEFF8] text-[#0D2282]" : "text-gray-400"
                                    }`}
                            >
                                <p className="text-sm">Application Status</p>
                            </div>
                        </Link>
                        {/* <Link to="/leave-calender">
                            <div
                                className={`flex rounded-md my-2 py-2 px-4 items-center gap-x-1 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${location.pathname === "/leave-calender" ? "bg-[#DAEFF8] text-[#0D2282]" : "text-gray-400"
                                    }`}
                            >
                                <p className="text-sm">Leave Calender</p>
                            </div>
                        </Link> */}
                        <Link to="/leave-list">
                            <div
                                className={`flex rounded-md my-2 py-2 px-4 items-center gap-x-1 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${location.pathname === "/leave-list" ? "bg-[#DAEFF8] text-[#0D2282]" : "text-gray-400"
                                    }`}
                            >
                                <p className="text-sm">Leave List</p>
                            </div>
                        </Link>
                        <Link to="/leave-balance-manager">
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
    )
}

export default ManagerRole