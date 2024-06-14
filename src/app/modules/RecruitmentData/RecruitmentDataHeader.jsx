import { useState } from "react";
import { RiArrowDownSFill } from "react-icons/ri";
import { connect } from "react-redux";
import Cookies from "universal-cookie";
import { setUserLogout } from "../../../state/actions/UserAction";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { BsTable } from "react-icons/bs";
import { FiFilter } from "react-icons/fi";
import { FaRegPlusSquare } from "react-icons/fa";
import { FaBriefcase } from "react-icons/fa6";
import PageHeader from "../../shared/templates/PageHeader";

const RecruitmentDataHeader = ({ userProfile, post,}) => {
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const cookies = new Cookies();
  // logout dropdown
  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };


  // show search bar
  const handleSearchClick = () => {
    setIsSearchVisible(!isSearchVisible);
    if (!isSearchVisible) {
      setSearchTerm("");
    }
  };

  // handle search functionality
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  
const dropdownOptions = [
  "Selected",
  "Shortlisted",
  "Offer-made",
  "Onboard",
  "Declined",
  "Contacted",
  "Rejected",
];

  return (
    <>
      {/* Header */}
      <PageHeader
          title={'Recruitment Data'}
        />
      {/* Emp Header */}
      <div className="flex justify-between items-center px-2 md:px-6 lg:px-10 bg-[#F2F2F2] py-3">
        <h2 className="text-lg leading-none font-semibold opacity-80 tracking-wider">
          {post}
        </h2>
        <div className="flex flex-col md:flex-row lg:flex-row gap-y-2 gap-x-3">
          <div className="flex gap-x-4 justify-end">
            <Link
              to="/jobs"
              className={`p-2 rounded-md  ${
                location.pathname === "/jobs"
                  ? "bg-[#25A8E0] text-white"
                  : "bg-white text-gray-400"
              }`}
            >
              <BsTable title="Jobs Data Table" />
            </Link>

            <Link
              to="/job-post"
              className={`p-2 rounded-md  ${
                location.pathname === "/job-post"
                  ? "bg-[#25A8E0] text-white"
                  : "bg-white text-gray-400"
              }`}
            >
              <FaRegPlusSquare title="Add New Post" />
            </Link>
            
            {isSearchVisible && (
           <>
            {
                    <div className="absolute right-6 top-36 bg-white border border-gray-300 z-10 pt-2 pb-2 rounded-xl shadow-md">
                      {dropdownOptions.map((option) => (
                        <div
                          key={option}
                          className='cursor-pointer border-b-2 pl-2 w-[85px] hover:bg-blue-100 text-sm'
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  }
           </>
          )}
          </div>
          
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

export default connect(mapStateToProps)(RecruitmentDataHeader);
