/* eslint-disable react-hooks/exhaustive-deps */
import { FaAngleDown } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";
import { LiaHomeSolid } from "react-icons/lia";
import { BsPersonFillGear } from "react-icons/bs";
import { LuCalendarDays, LuFolderCog2 } from "react-icons/lu";
import { toggleDropdown, isDbOpen, isRecruitmentOpen, isLeaveOpen } from "../../../../state/slices/DropdownSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const HrRole = ({ isSidebarOpen }) => {
  const location = useLocation();
  
  const { isDbOpen, isRecruitmentOpen, isLeaveOpen } = useSelector(state => state.dropdown);
  const dispatch = useDispatch();

  const handleToggleDropdown = (dropdownName) => {
    dispatch(toggleDropdown(dropdownName));
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
          onClick={() => handleToggleDropdown("HRDatabase")}
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
          onClick={() => handleToggleDropdown("Recruitment")}
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
          onClick={() => handleToggleDropdown("LeaveManagement")}
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
                    <p className="text-sm">My Application Status</p>
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
                {/* <Link to="/leave-list">
                  <div
                    className={`flex rounded-md mx-1 my-1 py-2 px-2 items-center gap-x-1 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${location.pathname === "/leave-list" ? "bg-[#DAEFF8] text-[#0D2282]" : "text-gray-400"
                      }`}
                  >
                    <p className="text-sm">Leave List</p>
                  </div>
                </Link> */}
                <Link to="/leave-balance-hr">
                  <div
                    className={`flex rounded-md mx-1 my-1 py-2 px-2 items-center gap-x-1 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${location.pathname === "/leave-balance-hr" ? "bg-[#DAEFF8] text-[#0D2282]" : "text-gray-400"
                      }`}
                  >
                    <p className="text-sm">My Leave Balance</p>
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
                <p className="text-sm">My Application Status</p>
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
            {/* <Link to="/leave-list">
              <div
                className={`flex rounded-md my-2 py-2 px-4 items-center gap-x-1 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${location.pathname === "/leave-list" ? "bg-[#DAEFF8] text-[#0D2282]" : "text-gray-400"
                  }`}
              >
                <p className="text-sm">Leave List</p>
              </div>
            </Link> */}
            {/* <Link to="/leave-balance">
              <div
                className={`flex rounded-md my-2 py-2 px-4 items-center gap-x-1 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${location.pathname === "/leave-balance" ? "bg-[#DAEFF8] text-[#0D2282]" : "text-gray-400"
                  }`}
              >
                <p className="text-sm">Leave Balance</p>
              </div>
            </Link> */}
            
            <Link to="/leave-balance-hr">
              <div
                className={`flex rounded-md my-2 py-2 px-4 items-center gap-x-1 hover:bg-[#DAEFF8] hover:text-[#0D2282] ${location.pathname === "/leave-balance-hr" ? "bg-[#DAEFF8] text-[#0D2282]" : "text-gray-400"
                  }`}
              >
                <p className="text-sm">My Leave Balance</p>
              </div>
            </Link>
          </li>

        </div>
      }

    </>
  )
}

export default HrRole