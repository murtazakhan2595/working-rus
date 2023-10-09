import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { RiArrowDownSFill } from "react-icons/ri";
import { AiTwotoneStar } from "react-icons/ai";
import { FiFilter } from "react-icons/fi";
import BoardModel from "./BoardModel";
import Cookies from "universal-cookie";
import { setUserLogout } from "../../../state/actions/UserAction";

const BoardList = ({ userProfile, baseUrl, token }) => {
  const { id } = useParams(); // Access the id parameter from the URL
  const cookies = new Cookies();
  const [boardList, setBoardList] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProjectName, setCurrentProjectName] = useState("");
  const [projectMembers, setProjectMembers] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Get Board
  const getBoards = async (url = `${baseUrl}/board/?search={"project_id":[${id}]}`) => {
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setBoardList(response.data.results);
      }
    } catch (error) {
      console.error("Error while fetching boards:", error);
    }
    finally {
      setLoading(false);
    }
  };

  // Get Projects
  const getProjects = async (url = `${baseUrl}/project/`) => {
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setProjects(response.data.results);
      }
    } catch (error) {
      console.error("Error while fetching projects:", error);
    }
  };

  // get members
  const getMembers = async () => {
    try {
      const response = await axios.get(`${baseUrl}/emp/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setMembers(response.data.results);
        // console.log(response.data.results)
      }
    } catch (error) {
      console.error("Error while fetching project members:", error);
    }
  };

  // Fetch project members
  const fetchProjectMembers = () => {
    const project = projects.find((project) => project.id === parseInt(id));
    if (project && project.project_members) {
      setProjectMembers(project.project_members);
    }
  };


  // Fetch the current project name
  const fetchCurrentProjectName = () => {
    const project = projects.find((project) => project.id === parseInt(id));
    if (project) {
      setCurrentProjectName(project.name);
    }
  };

  useEffect(() => {
    getProjects();
    getMembers(); // Fetch project members
    fetchProjectMembers()
  }, [id]);

  useEffect(() => {
    getBoards();
    fetchCurrentProjectName(); // Fetch and set the current project name
  }, [id, projects]);

  // logout dropdown
  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // handle logout
  const handleLogout = () => {
    cookies.set("token", "", { path: "*" });
    setUserLogout();
    navigate("/");
  };

  // refresh board list
  const refreshBoardList = () => {
    getBoards(); // Call your getBoards function to fetch the updated board list
  };

  return (
    <div className="flex w-full flex-col items-center ">
      {/* Header */}
      <div className="py-5 pl-10 pr-2 flex gap-3 items-center justify-between w-full">
        <div className="flex items-center">
          <h1 className="text-3xl mr-2 leading-none font-semibold opacity-80 tracking-widest">
            <Link to="/">Board List</Link>
          </h1>
          <div className="relative">
            <IoIosSearch className="absolute top-2 left-3 text-white" />
            <input
              type="search"
              placeholder="Search"
              className="focus:outline-none focus:border-non bg-gray-200 py-1 pl-8 pr-4 text-white placeholder-white border-none md:flex lg:w-64 xs:w-[12.5rem] hidden rounded-md"
            />
          </div>
        </div>
        <div className="relative">
          <div className="flex py-2 justify-end px-5 items-center gap-3 rounded-lg bg-gray-200 cursor-pointer" onClick={handleDropdownClick}>
            <div className="text-3xl w-8 h-8 rounded-full border bg-white"></div>
            <div className="text-[#283b91]">{userProfile.username}</div>
            <div className="text-[#283b91]">
              <RiArrowDownSFill />
            </div>
          </div>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-[#283b91] border rounded-lg shadow-lg">
              <button
                className="block w-full py-2 px-4 text-left hover:bg-gray-100 hover:text-[#283b91] text-white"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Board Header */}
      <div className="bg-[#ebebeb] mb-6 pr-1 lg:pl-5 pl-1 gap-3 w-full justify-between py-2 flex">
        <div className="flex gap-2">
          <div className="flex justify-center lg:ml-4 ml-1 items-center">
            <AiTwotoneStar className="text-3xl text-[#283b91]" />
          </div>
          <div className="flex font-bold items-center lg:ml-2 ml-1 tracking-widest">
            {currentProjectName} {/* Display the current project name */}
          </div>
        </div>
        <div className="flex gap-3 pr-2">
          <div className={`${projectMembers.length > 0 && 'bg-[#E1E1E1]'} rounded-md flex gap-x-1 justify-center items-center`}>
            <div className={`flex gap-x-1 pl-2`}>
              {projectMembers.map((member, index) => (
                <div className="flex justify-center items-center w-7 h-7 rounded-full border bg-blue-800
                 text-white text-sm p-2" key={index}>{members[member - 1].username.slice(0, 2).toUpperCase()}</div>
              ))}
            </div>
            <div className="flex bg-white px-2 py-1 gap-3 items-center rounded-lg">
              <div className=" px-2 text-[#283b91]">Team Members</div>
            </div>
          </div>
          <div className="hidden bg-[#f7f7f8] px-2 py-1 gap-3 items-center rounded-lg ">
            <div className=" px-1 text-gray-400">
              <FiFilter />
            </div>
          </div>
        </div>
      </div>

      {/* Board List */}
      <div className="mt-1 w-[95%] relative">
        <div className="flex gap-10 flex-row border-b-2 mx-4">
          {/* <div className="font-semibold">SNO</div> */}
          <div className="font-semibold">Board Name</div>
        </div>
        <div className="overflow-y-auto max-h-96 roundScroll">
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : boardList.length !== 0 ? (
            boardList.map((board, index) => (
              <div className="flex gap-16 flex-row p-2 rounded bg-[#F2F2F2] mx-4 my-2" key={index}>
                {/* <div className="text-blue-500">{index + 1}</div> */}
                <div className="cursor-pointer text-blue-500 underline" onClick={() => { navigate(`/board/${board.id}`) }}>{board.name}</div>
              </div>
            ))
          ) : (
            <div className="text-center">There's no board in the project</div>
          )}
        </div>
      </div>

      {/* Add Board Button */}
      <div
        className="absolute bottom-10 right-5 w-10 h-10 flex justify-center items-center 
      bg-[#25A8E0] text-white font-bold border rounded-full text-xl cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        +
      </div>

      {/* Board Model */}
      {isModalOpen && <BoardModel onClose={() => setIsModalOpen(false)} projectId={id} refreshBoardList={refreshBoardList} />}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
    token: state.user.token,
    baseUrl: state.user.baseUrl,
    isLogin: state.user.isLogin,
  };
};

export default connect(mapStateToProps)(BoardList);
