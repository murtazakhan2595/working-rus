import { useState } from "react";
import { RiArrowDownSFill } from "react-icons/ri";
import { connect } from "react-redux";
import Cookies from "universal-cookie";
import { setUserLogout } from "../../../state/actions/UserAction";
import { Link, useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { BsPersonPlus, BsTable } from "react-icons/bs";
import { FiFilter } from "react-icons/fi";

const EmpDataHeader = ({ userProfile, title }) => {
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
      <div className="py-5 pl-10 pr-2 flex gap-3 items-center justify-between w-full">
        <div className="flex items-center">
          <h1 className="text-xl lg:text-3xl mr-2 items-center leading-none font-semibold opacity-80 tracking-widest">
            Employee Data
          </h1>
          <div className="relative">
            <IoIosSearch className="absolute top-2 left-3 text-white" />
            <input
              type="search"
              placeholder="Search"
              className="focus:outline-none focus:border-non bg-[#D7D7D7] py-1 pl-8 pr-4 text-white placeholder-white border-none md:flex lg:w-64 xs:w-[12.5rem] hidden rounded-md"
            />
          </div>
        </div>
        <div className="relative">
          <div
            className="flex py-2 justify-end px-5 items-center gap-3 rounded-lg bg-gray-200 cursor-pointer"
            onClick={handleDropdownClick}
          >
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
      {/* Emp Header */}
      <div className="flex justify-between items-center px-2 md:px-6 lg:px-10 bg-[#F2F2F2] py-3">
        <h2 className="text-lg leading-none font-semibold opacity-80 tracking-wider">
          {title}
        </h2>
        <div className="flex gap-x-5">
          <Link
            to="/emp-data"
            className={`p-2 rounded-md  ${window.location.pathname === '/emp-data' ? 'bg-[#25A8E0] text-white' : 'bg-white text-gray-400'}`}
          >
            <BsTable title="Employee Data Table" />
          </Link>
          <Link
            to="/emp-dataform"
            className={`p-2 rounded-md  ${window.location.pathname === '/emp-dataform' ? 'bg-[#25A8E0] text-white' : 'bg-white text-gray-400'}`}

          >
            <BsPersonPlus title="Add Employee" />
          </Link>
          <Link className="p-2 rounded-md bg-white text-gray-400">
            <FiFilter />
          </Link>
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

export default connect(mapStateToProps)(EmpDataHeader);
