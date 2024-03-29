/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import { MdLock, MdOutlinePayment, MdOutlineTimeToLeave } from "react-icons/md";
import { PiSuitcaseRollingBold } from "react-icons/pi";
import {
  AiOutlineCaretDown,
  AiOutlineCaretUp,
  AiOutlinePlus,
} from "react-icons/ai";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { GoProjectSymlink } from "react-icons/go";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import sidebg from "./sidebarBG.png";
import {
  TbLayoutSidebarRightCollapse,
  TbLayoutSidebarLeftCollapse,
} from "react-icons/tb";
import logo from "../../../../assets/images/logo.png";
import { setUserLogout } from "../../../../state/actions/UserAction";
import { connect } from "react-redux";
import ProjectModel from "./ProjectModel";
import Cookies from "universal-cookie";
import axios from "axios";
import { LiaHomeSolid } from "react-icons/lia";
import { RiProfileLine } from "react-icons/ri";
import { BiSpreadsheet } from "react-icons/bi";

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
  const [isProjectOpen, setisProjectOpen] = useState(false);
  const [isModelOpen, setisModelOpen] = useState(false);
  const [isLinksOpen, setIsLinksOpen] = useState(false);
  const [projects, setProjects] = useState({});
  const [nextPage, setNextPage] = useState("");
  const [previousPage, setPreviousPage] = useState("");
  const [projectsCount, setProjectCount] = useState(0);

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

  return (
    <>
      <div className="flex">
        {/* Sidebar content goes here */}
        <div
          style={{ backgroundImage: `url(${sidebg})` }}
          className={`h-screen bg-cover bg-[100%] bg-[#283b91]  w-56  p-4  ${isSidebarOpen ? "" : "hidden"
            }`}
        >
          <div className="text-xl z-10 bg-white py-3 px-7 flex flex-row items-center justify-start gap-1 text-[#2f4acf] font-semibold mb-4 rounded-md relative">
            <img src={logo} className="inline-block w-12" alt="logo" />
            <h1 className="inline-block">TECBRIX</h1>
          </div>
          <ul className="overflow-y-auto max-h-[calc(98vh-100px)] hideScroll -mt-10">
            <li>
              <div className="relative invisible">
                <IoIosSearch className="absolute top-3 left-3 text-white" />
                <input
                  type="search"
                  placeholder="Search"
                  className="focus:outline-none focus:border-non bg-[#8292e2] py-2 pl-10 pr-4 text-white placeholder-white border-none w-48 rounded-md"
                />
              </div>
            </li>

            {userProfile.role === 1 && (
              <>
                <li>
                  <Link to="/">
                    <div
                      className={`flex mb-3 mt-5 rounded-md py-2 px-4 items-center gap-1 hover:bg-blue-900 ${location.pathname === "/" ? "bg-[#259ED8]" : ""
                        }`}
                    >
                      <div className="text-white text-xl">
                        <LiaHomeSolid />
                      </div>
                      <p className="text-white">Home</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/profile">
                    <div
                      className={`flex mb-3 mt-5 rounded-md py-2 px-4 items-center gap-1 hover:bg-blue-900 ${location.pathname === "/profile" ? "bg-[#259ED8]" : ""
                        }`}
                    >
                      <div className="text-white text-xl">
                        <RiProfileLine />
                      </div>
                      <p className="text-white">Profile</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/employees">
                    <div
                      className={`flex mb-3 mt-5 rounded-md py-2 px-4 items-center gap-1 hover:bg-blue-900 ${location.pathname === "/employees" ? "bg-[#259ED8]" : ""
                        }`}
                    >
                      <div className="text-white text-xl">
                        <BiSpreadsheet />
                      </div>
                      <p className="text-white">Employee Sheet</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/jobs">
                    <div
                      className={`flex mb-3 mt-5 rounded-md py-2 px-4 items-center gap-1 hover:bg-blue-900 ${location.pathname === "/jobs" ? "bg-[#259ED8]" : ""
                        }`}
                    >
                      <div className="text-white text-xl">
                        <MdOutlinePayment />
                      </div>
                      <p className="text-white">Recruitment</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/leave-application">
                    <div
                      className={`flex mb-3 mt-5 rounded-md py-2 px-4 items-center gap-1 hover:bg-blue-900 ${location.pathname === "/leave-application"
                        ? "bg-[#259ED8]"
                        : ""
                        }`}
                    >
                      <div className="text-white text-xl">
                        <MdOutlineTimeToLeave />
                      </div>
                      <p className="text-white">Leave Application</p>
                    </div>
                  </Link>
                </li>

                <div className="text-white rounded-lg mb-2">
                  <div
                    className={`flex items-center gap-x-2 py-2 px-4 hover:bg-blue-900 ${location.pathname === "/leave-list" ||
                      location.pathname === "/leave-calender" ||
                      location.pathname === "/leave-balance"
                      ? "bg-[#25A8E0]"
                      : ""
                      } rounded-lg cursor-pointer`}
                    onClick={() => setIsLinksOpen(!isLinksOpen)}
                  >
                    <PiSuitcaseRollingBold className="text-4xl" />
                    Leave Application and Data
                  </div>
                  {isLinksOpen && (
                    <>
                      <Link to="/leave-list">
                        <div
                          className={`py-2 pl-10 ${location.pathname === "/leave-list"
                            ? "border-2 border-[#259ED8] rounded-lg my-1"
                            : ""
                            }`}
                        >
                          Leave Applications
                        </div>
                      </Link>
                      <Link to="/leave-calender">
                        <div
                          className={`py-2 pl-10 ${location.pathname === "/leave-calender"
                            ? "border-2 border-[#259ED8] rounded-lg my-1"
                            : ""
                            }`}
                        >
                          Leave Calendar
                        </div>
                      </Link>
                      <Link to="/leave-balance">
                        <div
                          className={`py-2 pl-10 ${location.pathname === "/leave-balance"
                            ? "border-2 border-[#259ED8] rounded-lg my-1"
                            : ""
                            }`}
                        >
                          Leave Balance
                        </div>
                      </Link>
                    </>
                  )}
                </div>

              </>
            )}
            {userProfile.role === 3 && (
              <>
                <li>
                  <Link to="/">
                    <div
                      className={`flex mb-3 mt-5 rounded-md py-2 px-4 items-center gap-1 hover:bg-blue-900 ${location.pathname === "/" ? "bg-[#259ED8]" : ""
                        }`}
                    >
                      <div className="text-white text-xl">
                        <LiaHomeSolid />
                      </div>
                      <p className="text-white">Home</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/profile">
                    <div
                      className={`flex mb-3 mt-5 rounded-md py-2 px-4 items-center gap-1 hover:bg-blue-900 ${location.pathname === "/profile" ? "bg-[#259ED8]" : ""
                        }`}
                    >
                      <div className="text-white text-xl">
                        <RiProfileLine />
                      </div>
                      <p className="text-white">Profile</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/employees">
                    <div
                      className={`flex mb-3 mt-5 rounded-md py-2 px-4 items-center gap-1 hover:bg-blue-900 ${location.pathname === "/employees" ? "bg-[#259ED8]" : ""
                        }`}
                    >
                      <div className="text-white text-xl">
                        <BiSpreadsheet />
                      </div>
                      <p className="text-white">Employee Sheet</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/jobs">
                    <div
                      className={`flex mb-3 mt-5 rounded-md py-2 px-4 items-center gap-1 hover:bg-blue-900 ${location.pathname === "/jobs" ? "bg-[#259ED8]" : ""
                        }`}
                    >
                      <div className="text-white text-xl">
                        <MdOutlinePayment />
                      </div>
                      <p className="text-white">Recruitment</p>
                    </div>
                  </Link>
                </li>

                <div className="text-white rounded-lg mb-2">
                  <div
                    className={`flex items-center gap-x-2 py-2 px-4 hover:bg-blue-900 ${location.pathname === "/leave-list" ||
                      location.pathname === "/leave-calender" ||
                      location.pathname === "/leave-balance"
                      ? "bg-[#25A8E0]"
                      : ""
                      } rounded-lg cursor-pointer`}
                    onClick={() => setIsLinksOpen(!isLinksOpen)}
                  >
                    <PiSuitcaseRollingBold className="text-4xl" />
                    Leave Application and Data
                  </div>
                  {isLinksOpen && (
                    <>
                      <Link to="/leave-list">
                        <div
                          className={`py-2 pl-10 ${location.pathname === "/leave-list"
                            ? "border-2 border-[#259ED8] rounded-lg my-1"
                            : ""
                            }`}
                        >
                          Leave Applications
                        </div>
                      </Link>
                      <Link to="/leave-calender">
                        <div
                          className={`py-2 pl-10 ${location.pathname === "/leave-calender"
                            ? "border-2 border-[#259ED8] rounded-lg my-1"
                            : ""
                            }`}
                        >
                          Leave Calendar
                        </div>
                      </Link>
                      <Link to="/leave-balance">
                        <div
                          className={`py-2 pl-10 ${location.pathname === "/leave-balance"
                            ? "border-2 border-[#259ED8] rounded-lg my-1"
                            : ""
                            }`}
                        >
                          Leave Balance
                        </div>
                      </Link>
                    </>
                  )}
                </div>
              </>
            )}
            {(userProfile.role === 2) && (
              <>
                <li>
                  <Link to="/">
                    <div
                      className={`flex mb-3 mt-5 rounded-md py-2 px-4 items-center gap-1 hover:bg-blue-900 ${location.pathname === "/" ? "bg-[#259ED8]" : ""
                        }`}
                    >
                      <div className="text-white text-xl">
                        <LiaHomeSolid />
                      </div>
                      <p className="text-white">Home</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/profile">
                    <div
                      className={`flex mb-3 mt-5 rounded-md py-2 px-4 items-center gap-1 hover:bg-blue-900 ${location.pathname === "/profile" ? "bg-[#259ED8]" : ""
                        }`}
                    >
                      <div className="text-white text-xl">
                        <RiProfileLine />
                      </div>
                      <p className="text-white">Profile</p>
                    </div>
                  </Link>
                </li>

                <li>
                  <Link to="/leave-application">
                    <div
                      className={`flex mb-3 mt-5 rounded-md py-2 px-4 items-center gap-1 hover:bg-blue-900 ${location.pathname === "/leave-application"
                        ? "bg-[#259ED8]"
                        : ""
                        }`}
                    >
                      <div className="text-white text-xl">
                        <MdOutlineTimeToLeave />
                      </div>
                      <p className="text-white">Leave Application</p>
                    </div>
                  </Link>
                </li>

                <div className="text-white rounded-lg mb-2">
                  <div
                    className={`flex items-center gap-x-2 py-2 px-4 hover:bg-blue-900 
                    ${location.pathname === "/leave-list" ||
                        location.pathname === "/leave-calender" ||
                        location.pathname === "/leave-balance"
                        ? "bg-[#25A8E0]"
                        : ""
                      } rounded-lg cursor-pointer`}
                    onClick={() => setIsLinksOpen(!isLinksOpen)}
                  >
                    <PiSuitcaseRollingBold className="text-4xl" />
                    Leave Application and Data
                  </div>
                  {isLinksOpen && (
                    <>
                      <Link to="/leave-list">
                        <div
                          className={`py-2 pl-10 ${location.pathname === "/leave-list"
                            ? "border-2 border-[#259ED8] rounded-lg my-1"
                            : ""
                            }`}
                        >
                          Leave Applications
                        </div>
                      </Link>
                      <Link to="/leave-balance">
                        <div
                          className={`py-2 pl-10 ${location.pathname === "/leave-balance"
                            ? "border-2 border-[#259ED8] rounded-lg my-1"
                            : ""
                            }`}
                        >
                          Leave Balance
                        </div>
                      </Link>
                    </>
                  )}
                </div>
              </>
            )}
            {(userProfile.role === 4) && (
              <>
                <li>
                  <Link to="/">
                    <div
                      className={`flex mb-3 mt-5 rounded-md py-2 px-4 items-center gap-1 hover:bg-blue-900 ${location.pathname === "/" ? "bg-[#259ED8]" : ""
                        }`}
                    >
                      <div className="text-white text-xl">
                        <LiaHomeSolid />
                      </div>
                      <p className="text-white">Home</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/profile">
                    <div
                      className={`flex mb-3 mt-5 rounded-md py-2 px-4 items-center gap-1 hover:bg-blue-900 ${location.pathname === "/profile" ? "bg-[#259ED8]" : ""
                        }`}
                    >
                      <div className="text-white text-xl">
                        <RiProfileLine />
                      </div>
                      <p className="text-white">Profile</p>
                    </div>
                  </Link>
                </li>

                <li>
                  <Link to="/leave-application">
                    <div
                      className={`flex mb-3 mt-5 rounded-md py-2 px-4 items-center gap-1 hover:bg-blue-900 ${location.pathname === "/leave-application"
                        ? "bg-[#259ED8]"
                        : ""
                        }`}
                    >
                      <div className="text-white text-xl">
                        <MdOutlineTimeToLeave />
                      </div>
                      <p className="text-white">Leave Application</p>
                    </div>
                  </Link>
                </li>

                <div className="text-white bg-[#202F72] rounded-lg mb-2">
                  <div
                    className="flex items-center gap-x-2 py-2 px-4 bg-[#25A8E0] rounded-lg cursor-pointer"
                    onClick={() => setIsLinksOpen(!isLinksOpen)}
                  >
                    <PiSuitcaseRollingBold className="text-4xl" />
                    Leave Application and Data
                  </div>
                  {isLinksOpen && (
                    <>
                      <Link to="/leave-balance">
                        <div
                          className={`py-2 pl-10 ${location.pathname === "/leave-balance"
                            ? "border-2 border-[#259ED8] rounded-lg my-1"
                            : ""
                            }`}
                        >
                          Leave Balance
                        </div>
                      </Link>
                    </>
                  )}
                </div>
              </>
            )}

            {userProfile.role !== 3 && (
              <>
                <hr className="opacity-40" />

                <li
                  onClick={() => {
                    setisProjectOpen(!isProjectOpen);
                  }}
                  className="flex mb-1 mt-3 justify-between rounded-md py-2 px-4 items-center gap-1"
                >
                  <div className="flex gap-1">
                    <GoProjectSymlink className="text-white text-xl" />{" "}
                    <p className="text-white">Projects</p>
                  </div>
                  {isProjectOpen ? (
                    <AiOutlineCaretUp className="text-white text-xs" />
                  ) : (
                    <AiOutlineCaretDown className="text-white text-xs" />
                  )}
                </li>
                {isProjectOpen && (
                  <>
                    <div className="flex flex-col rounded-xl mb-4 p-2 bg-[#202F72]">
                      <div className="flex justify-between mb-1 items-center">
                        <div className="flex gap-1">
                          {projectsCount > 10 && (
                            <>
                              <FaChevronLeft
                                onClick={() => {
                                  getProjects(previousPage);
                                }}
                                className="text-white text-[0.65rem] text-xs opacity-60"
                              />
                              <FaChevronRight
                                onClick={() => {
                                  getProjects(nextPage);
                                }}
                                className="text-white text-[0.65rem] opacity-60"
                              />
                            </>
                          )}
                        </div>
                        <div className="flex items-center opacity-60 gap-1 text-white">
                          <div className="text-xs">{projectsCount}</div>
                          {userProfile.role !== 4 && (
                            <AiOutlinePlus
                              onClick={() => {
                                setisModelOpen(true);
                              }}
                              className="text-white text-sm hover:cursor-pointer"
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
                              className="flex gap-3 mb-1 cursor-pointer"
                            >
                              <div className="bg-blue-950 rounded-md w-[25px] h-[25px]"></div>
                              <div className="text-white">{project.name}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            <hr className="opacity-40" />

            <li
              onClick={() => {
                cookies.set("token", "", { path: "*" });
                setUserLogout();
                navigate("/");
              }}
              className="flex mb-1 mt-1  rounded-md py-2 px-4 items-center gap-1"
            >
              <MdLock className="text-white text-xl" />{" "}
              <p className="text-white cursor-pointer">Logout</p>
            </li>
          </ul>
        </div>

        {/* Sidebar collapse button */}
        <button
          className={`bg-[#283b91] text-white p-1.5 absolute ${isSidebarOpen ? "left-[13.5rem]" : "left-0"
            } rounded-e-lg top-3 mt-4 mr-4`}
          onClick={handleSidebarToggle}
        >
          {isSidebarOpen ? (
            <TbLayoutSidebarLeftCollapse className="text-xl" />
          ) : (
            <TbLayoutSidebarRightCollapse className="text-xl" />
          )}
        </button>

        <Outlet isSidebarOpen={isSidebarOpen} />
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
    sidebarRefresh: state.user.sidebarRefresh,
  };
};
export default connect(mapStateToProps, { setUserLogout })(Sidebar);
