/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import { MdLock } from "react-icons/md";
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
import { links } from "../../../../data/Data";

const Sidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  baseUrl,
  token,
  sidebarRefresh,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const cookies = new Cookies();
  const [isProjectOpen, setisProjectOpen] = useState(false);
  const [isModelOpen, setisModelOpen] = useState(false);
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

  const getProjects = async (url = `${baseUrl}/project/`) => {
    try {
      await axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            console.log("try");
            setProjects(response.data.results);
            setProjectCount(response.data.count);
            setNextPage(response.data.next);
            setPreviousPage(response.data.previous);
          }
        });
    } catch (error) {}
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
          className={`h-screen hideScroll bg-cover bg-[100%] bg-[#283b91]  w-56  p-4  ${
            isSidebarOpen ? "" : "hidden"
          }`}
        >
          <div className="text-xl bg-white py-3 px-7 flex flex-row items-center justify-start gap-1 text-[#2f4acf] font-semibold mb-4 rounded-md">
            <img src={logo} className="inline-block w-12" alt="logo" />
            <h1 className="inline-block">TECBRIX</h1>
          </div>
          <ul>
            <li>
              <div className="relative">
                <IoIosSearch className="absolute top-3 left-3 text-white" />
                <input
                  type="search"
                  placeholder="Search"
                  className="focus:outline-none focus:border-non bg-[#8292e2] py-2 pl-10 pr-4 text-white placeholder-white border-none w-48 rounded-md"
                />
              </div>
            </li>

            {links.map((link, index) => (
              <li key={index}>
                <Link to={link.to}>
                  <div
                    className={`flex mb-3 mt-5 rounded-md py-2 px-4 items-center gap-1 hover:bg-blue-900 ${
                      location.pathname === link.to ? "bg-[#259ED8]" : ""
                    }`}
                  >
                  <div className="text-white text-xl">{link.icon}</div>
                  <p className="text-white">{link.text}</p>
                  </div>
                </Link>
              </li>
            ))}
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
                      <AiOutlinePlus
                        onClick={() => {
                          setisModelOpen(true);
                        }}
                        className="text-white text-sm hover:cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="max-h-[20vh] overflow-y-auto hideScroll">
                    {projects.map((project, index) => (
                      <div key={index} className="flex flex-col gap-2">
                        <div
                          onClick={() => {
                            navigate(`/project/${project.id}`);
                          }}
                          className="flex gap-3 mb-1 cursor-pointer"
                        >
                          <div className="bg-blue-950 rounded-md p-3"></div>
                          <div className="text-white">{project.name}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
              <p className="text-white">Logout</p>
            </li>
          </ul>
        </div>

        {/* Sidebar collapse button */}
        <button
          className={`bg-[#283b91] text-white p-1.5 absolute ${
            isSidebarOpen ? "left-[13.5rem]" : "left-0"
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
