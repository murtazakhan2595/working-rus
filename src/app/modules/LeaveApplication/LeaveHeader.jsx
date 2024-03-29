import { useState } from "react";
import { RiArrowDownSFill } from "react-icons/ri";
import { connect } from "react-redux";
import Cookies from "universal-cookie";
import { setUserLogout } from "../../../state/actions/UserAction";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";


const LeaveHeader = ({ userProfile, post }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const cookies = new Cookies();
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

  return (
    <>
      {/* Header */}
      <div className="py-5 pl-10 pr-0 lg:pr-2  flex gap-3  items-center md:flex-row lg:flex-row justify-between w-full">
        <div className="flex items-center">
          <h1 className="text-xl lg:text-3xl mr-2 items-center leading-none font-semibold opacity-80 tracking-widest">
            Leave Application and Data
          </h1>
        </div>
        <div className="relative">
          <div
            className="flex py-2 justify-end px-[.5rem] items-center gap-3 rounded-lg rounded-tl-full rounded-bl-full md:rounded-tl-md md:rounded-bl-md bg-gray-200 cursor-pointer"
          >
            {/* <FaBell className="text-[#259ED8] bg-[E9EAEA] rounded-full w-7 h-7" />
            <div className="absolute top-5 right-5 bg-white rounded-md z-50">
              <div className="w-60 p-3">
                <h1 className="text-base leading-none font-semibold tracking-wider">Notifications</h1>
                <div className="flex items-center gap-x-3 mt-4">
                  <h3 className="text-[#259ED8] bg-[#d4f0fd] rounded-md px-3 py-1 text-sm">All</h3>
                  <h3 className="text-gray-400 text-sm">Unread</h3>
                </div>
                <h2 className="mt-4 font-semibold text-sm">New</h2>
                <div className="mt-1">
                  <div className="flex items-center gap-x-2 py-2">
                    <div className="h-8 w-8 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="text-xs font-semibold">Sammy send leaves to Johnyy</p>
                      <div className="text-xs text-gray-400">3 days ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-x-2 py-2">
                    <div className="h-8 w-8 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="text-xs font-semibold">Sammy send leaves to Johnyy</p>
                      <div className="text-xs text-gray-400">3 days ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-x-2 py-2">
                    <div className="h-8 w-8 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="text-xs font-semibold">Sammy send leaves to Johnyy</p>
                      <div className="text-xs text-gray-400">3 days ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-x-2 py-2">
                    <div className="h-8 w-8 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="text-xs font-semibold">Sammy send leaves to Johnyy</p>
                      <div className="text-xs text-gray-400">3 days ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-x-2 py-2">
                    <div className="h-8 w-8 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="text-xs font-semibold">Sammy send leaves to Johnyy</p>
                      <div className="text-xs text-gray-400">3 days ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-x-2 py-2">
                    <div className="h-8 w-8 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="text-xs font-semibold">Sammy send leaves to Johnyy</p>
                      <div className="text-xs text-gray-400">3 days ago</div>
                    </div>
                  </div>

                </div>
              </div>
            </div> */}
            <div className="flex items-center gap-x-2" onClick={handleDropdownClick}>
              <div className="text-3xl w-8 h-8 rounded-full border bg-white"></div>
              <div className="text-[#283b91] hidden md:block lg:block">
                {userProfile.username}
              </div>
              <div className="text-[#283b91]">
                <RiArrowDownSFill />
              </div>
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
      {/* Emp Header */}
      <div className="flex justify-between items-center px-2 md:px-6 lg:px-10 bg-[#F2F2F2] py-3">
        <h2 className="text-lg leading-none font-semibold opacity-80 tracking-wider">
          {post}
        </h2>
        <div className="flex flex-col md:flex-row lg:flex-row gap-y-2 gap-x-3">
          <div className="flex gap-x-4 justify-end"></div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(LeaveHeader);
