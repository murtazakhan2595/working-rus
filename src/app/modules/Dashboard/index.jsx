import { connect } from "react-redux";
import WorkTime from "./WorkTime";
import TodoList from "./Todolist";
import TaskPlanner from "./TaskPlanner";
// import "./index.css";
import DailyTaskRpt from "./DailyTaskRpt";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { setUserLogout } from "state/actions/UserAction";
import { RiArrowDownSFill } from "react-icons/ri";
import { getEmployeeData } from "app/hooks/employee";
import ProfileManagement from "./sections/ProfileManagement";
import LeaveBalance from "./sections/LeaveBalance";
import EmployeeOverview from "./sections/EmployeeOverview";
import TalentSphere from "./sections/TalentSphere";
import LeaveTrackerOverview from "./sections/LeaveTrackerOverview";
import MyTasks from "./MyTasks";
import MyLeaves from "./sections/MyLeaves";

const Dashboard = ({ isSidebarOpen, userProfile }) => {
  // const [isBarOpen, seIsBarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profileData, setProfileData] = useState({image:"",initials:""});

  const navigate = useNavigate();
  const cookies = new Cookies();

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);

  };

  const handleLogout = () => {
    window.localStorage.setItem("token","")
    setUserLogout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchData = async () => {
      try{
        const response =await getEmployeeData(userProfile.id);
        setProfileData(
         { image:response?.profile_picture?.file ||
          response?.profile_picture,
          initials: `${response?.first_name?.toUpperCase().slice(0, 1)}${response?.last_name?.toUpperCase().slice(0, 1)}`
        }
        );
        
      }catch(err){
        console.error(err)
      }
    }
    fetchData()
  }, [userProfile]);
  return (
    <>
      {/* ##########################   First Column   ########################## */}

      <div
        className={`bg-[#f9f9f9] h-screen overflow-y-auto overflow-x-hidden scroll
         ${
           isSidebarOpen
             ? "3xl:w-[92%] xl:w-[100%] w-[100%]"
             : "3xl:w-[100%] xl:w-[100%] w-[100%]"
         }`}
      >
        {/***********************   Dashboard Header   **********************************/}
        <div className="py-8 px-10 flex gap-3  items-center justify-between ">
          <h1 className="text-3xl leading-none font-semibold  opacity-80 tracking-widest">
            Dashboard
          </h1>
          <div className="relative flex justify-end mr-2">
            <div
              className="flex py-2 justify-end px-[.5rem] items-center gap-3 rounded-lg rounded-tl-full rounded-bl-full md:rounded-tl-md md:rounded-bl-md bg-gray-200 cursor-pointer"
              onClick={handleDropdownClick}
            >
              <div className="text-3xl w-8 h-8 rounded-full border bg-white">
                {profileData.image ? (
                  <img
                    src={profileData.image}
                    alt={`profile Picture`}
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  <>{profileData.initials}</>
                )}
              </div>
              <div className="text-[#283b91] hidden md:block lg:block">
                {userProfile.username}
              </div>
              <div className="text-[#283b91]">
                <RiArrowDownSFill />
              </div>
            </div>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-10 w-48 bg-[#283b91] border rounded-lg shadow-lg">
                <button
                  className="block w-full py-2 px-4 text-left hover:bg-gray-100 hover:text-[#283b91] text-white"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
          {/* <div className="relative">
            <IoIosSearch className="absolute top-2 left-3 text-white" />
            <input
              type="search"
              placeholder="Search"
              className="focus:outline-none focus:border-non bg-gray-200 py-1 pl-8 pr-4 text-white placeholder-white border-none  md:flex lg:w-64 xs:w-[12.5rem] hidden rounded-md"
            />
          </div> */}
        </div>
        <main className="flex-wrap content-start self-stretch px-8 pt-8 rounded-xl max-md:px-5">
          <div className="flex gap-5 ">
            <div className="flex flex-col min-w-[895px] ">
              <div className="flex flex-col py-px">
                <div className="">
                  <div className="flex gap-5 ">
                    {(userProfile.role === 1 || userProfile.role === 3) && (
                      <EmployeeOverview />
                    )}
                  </div>
                </div>
                <div className="mt-5 ">
                  <div className="flex gap-5 ">
                  {(userProfile.role === 1 || userProfile.role === 3) && ( <LeaveTrackerOverview/>)}
                  </div>
                </div>
                <div className="mt-5 ">
                  <div className="flex gap-5 ">
                    {/* <MyTeam />
                    <MyLeaves /> */}

                    {(userProfile.role === 1 || userProfile.role === 3) && (
                      <TalentSphere />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full gap-5 ">
              <div>Recent activity</div>
              <MyTasks />
            </div>
          </div>
          <div className="flex gap-5 my-5">
              <MyLeaves/>
          </div>

        </main>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(Dashboard);
