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
import getNavigation from "../../../utils/Types/Navigation";
import { setUserLogout } from "../../../../state/actions/UserAction";
import NavigationMenue from "./NavigationMenue";

const Sidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  baseUrl,
  token,
  userProfile,
  sidebarRefresh,
}) => {
  const normalLink = `flex rounded-md my-1 py-1.5 ${!isSidebarOpen ? "px-1" : "px-4"
    } items-center gap-x-1 text-[#5C5E64] hover:border hover:border-blue-300 text-[10px]`;
  const activeLink = `flex rounded-md my-1 py-1.5 ${!isSidebarOpen ? "px-1" : "px-4"
    } items-center gap-x-1 bg-[#DAEFF8] text-[#5C5E64]`;
  // const ComingActiveLink = `flex rounded-md my-1 py-1.5 ${!isSidebarOpen ? "px-1" : "px-4"} items-center gap-x-1 text-[#5C5E64]`;

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
    isProfileOpen,
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
    transfer: isTransferOpen,
    letterRequest: isLetterRequestOpen,
    todo: isTodoOpen,
    developmentPlan: isDevelopmentPlanOpen,
    settings: isSettingsOpen,
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
            setNavigation(getNavigation(employee.user_role, response.data));
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
    const employeeResponse = await axios.get(
      `${baseUrl}/emp/${userProfile.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const employeeData = employeeResponse.data;
    setEmployee(employeeData);
    setNavigation(getNavigation(employeeData.user_role, projects));
    setProfileImage(
      employeeResponse.data?.profile_picture?.file ||
      employeeResponse.data?.profile_picture
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="flex">
        {/* Sidebar content goes here */}
        <div
          // style={{ backgroundImage: `url(${sidebg})` }}
          className={`h-screen bg-cover bg-[100%] bg-[#fafafa] border border-gray-300 rounded-e-lg ${isSidebarOpen ? "w-64" : "w-28"
            }`}
        >
          <div className="text-xl z-10 py-3 px-3 flex border-b border-gray-300 flex-row items-center justify-start gap-1 text-[#2f4acf] font-semibold relative">
            <img
              src={logo}
              className={`w-12 ${isSidebarOpen ? "inline-block" : "block mx-auto"
                } `}
              alt="logo"
            />
            <h1
              className={`inline-block overflow-hidden transition-all text-2xl ${isSidebarOpen ? "w-28" : "w-0"
                }`}
            >
              TECBRIX
            </h1>
          </div>
          <div className={`mx-2 hideScroll ${isSidebarOpen ? "overflow-y-auto overflow-x-visible" : ""}`} style={{ height: `calc(100vh - ${isSidebarOpen ? isProfileOpen ? '245px' : '175px' : '155px'}` }}>
            <NavigationMenue navigation={Navigation} isSidebarOpen={isSidebarOpen} sidebarRefresh={sidebarRefresh} />
          </div>

          <ProfileDetails isSidebarOpen={isSidebarOpen} profileImage={profileImage} employee={employee} handleToggleDropdown={handleToggleDropdown} isProfileOpen={isProfileOpen} />
        </div>

        {/* Sidebar collapse button */}
        <button
          button
          className={`bg-white text-gray-500 border border-gray-300 p-1.5 absolute ${isSidebarOpen ? "left-[12.5rem] top-10" : "left-[5.5rem] top-10"
            } rounded-lg  mt-4 mr-4 z-10`}
          onClick={handleSidebarToggle}
        >
          {isSidebarOpen ? (
            <FaAngleDoubleLeft title="Close" className="text-xl" />
          ) : (
            <FaAngleDoubleRight title="Open" className="text-xl" />
          )}
        </button>

        <Outlet isSidebarOpen={isSidebarOpen} />
      </div>

      {isModelOpen && <ProjectModel onClose={closeProjectModal} />}
    </>
  );
};

const ProfileDetails = ({ isSidebarOpen, employee, profileImage, handleToggleDropdown, isProfileOpen }) => {
  const navigate = useNavigate();
  return (
    <div className="pb-2 mx-2">
      <div
        className={`${isSidebarOpen
          ? "bg-white rounded-lg border border-gray-200 shadow-bottom mb-3 mt-1"
          : ""
          }`}
      >
        <div
          className={`flex group items-center gap-x-2 py-3 ${isSidebarOpen
            ? "bg-[#F0F1F2]"
            : "borderr border--[#5C5E64]"
            } px-2 rounded-lg cursor-pointer`}
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt={`${employee?.first_name} ${employee?.last_name}'s Picture`}
              style={{
                width: "45px",
                height: "45px",
                borderRadius: "50%",
              }}
            />
          ) : (
            <>
              {employee?.first_name?.toUpperCase().slice(0, 1)}
              {employee?.last_name?.toUpperCase().slice(0, 1)}
            </>
          )}

          {!isSidebarOpen && (
            <div
              className="absolute rounded-lg border border-gray-1 ml-20
                                      bg-white w-44 text-sm
                                      opacity-00 
                                      group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-50  shadow-bottom"
              style={{ bottom: "5px" }}
            >
              <div className="flex items-center bg-[#F0F1F2] rounded-lg m-1">
                <div
                  className={`flex group items-center gap-x-2 py-3 px-2 rounded-lg cursor-pointer`}
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={`${employee?.first_name} ${employee?.last_name}'s Picture`}
                      style={{
                        width: "45px",
                        height: "45px",
                        borderRadius: "50%",
                      }}
                    />
                  ) : (
                    <>
                      {employee?.first_name
                        ?.toUpperCase()
                        .slice(0, 1)}
                      {employee?.last_name?.toUpperCase().slice(0, 1)}
                    </>
                  )}
                </div>
                <div className={`flex flex-col text-[#5C5E64]`}>
                  <div className="flex items-center gap-x-2">
                    <div className="font-semibold">
                      {employee?.username}
                    </div>
                  </div>
                  <div
                    className="text-xs overflow-hidden text-ellipsis"
                    style={{ width: "100px" }}
                  >
                    {employee?.work_email}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-y-2 mt-2 mx-1">
                <Link
                  to="/my-profile"
                  className="flex items-center justify-between px-3 py-1 rounded-md hover:bg-[#DAEFF8] text-[#616366] text-sm hover:text-[#0D2282]"
                >
                  <p>Profile Settings</p>
                  <BsPersonGear />
                </Link>
                <div
                  className="flex items-center cursor-pointer justify-between px-3 py-1 mb-1 rounded-md hover:bg-[#DAEFF8] text-[#616366] text-sm hover:text-[#0D2282]"
                  onClick={() => {
                    window.localStorage.setItem("token", "")
                    setUserLogout();
                    navigate("/login");
                  }}
                >
                  <p>Logout</p>
                  <MdOutlineLogout />
                </div>
              </div>
            </div>
          )}

          <div
            className={`flex flex-col text-[#5C5E64] ${isSidebarOpen ? "block" : "hidden"
              }`}
            onClick={() => handleToggleDropdown("Profile")}
          >
            <div className="flex items-center gap-x-2">
              <div className="font-semibold">
                {employee?.username}
              </div>
              <FaAngleDown
                className={`text-xs transition-transform duration-300 ${isProfileOpen ? "transform rotate-180" : ""
                  }`}
              />
            </div>
            <div
              className="text-xs overflow-hidden text-ellipsis"
              style={{ width: "130px" }}
            >
              {employee?.work_email}
            </div>
          </div>
        </div>

        {isProfileOpen && isSidebarOpen && (
          <div className="flex flex-col gap-y-2 mt-2">
            <Link
              to="/my-profile"
              className="flex items-center justify-between px-3 py-1 rounded-md hover:bg-[#DAEFF8] text-[#616366] text-sm hover:text-[#0D2282]"
            >
              <p>Profile Settings</p>
              <BsPersonGear />
            </Link>
            <div
              className="flex items-center cursor-pointer justify-between px-3 py-1 rounded-md hover:bg-[#DAEFF8] text-[#616366] text-sm hover:text-[#0D2282]"
              onClick={() => {
                window.localStorage.setItem("token", "")
                setUserLogout();
                navigate("/login");
              }}
            >
              <p>Logout</p>
              <MdOutlineLogout />
            </div>
          </div>
        )}
      </div>
    </div>)
}

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
