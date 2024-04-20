
import React, { useState, useEffect } from "react";
import LeaveHeader from "./LeaveHeader";
import { connect } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import Select from "react-select";
import Datepicker from "../Dashboard/Datepicker";
import moment from "moment";
import LeavesLoader from "../../../common/LeavesLoader";
import { getAllCountries } from 'countries-and-timezones';
import { FaAngleDown } from "react-icons/fa";

const LeaveBalance = ({ baseUrl, token, userProfile, isSidebarOpen }) => {
  const [leaves, setLeaves] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null); // State to track expanded row

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const fetchLeaves = async () => {
    try {
      const response = await axios.get(`${baseUrl}/leave?search={}`, { headers });
      setLeaves(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  const fetchManagers = async () => {
    try {
      const response = await axios.get(`${baseUrl}/emp/`, { headers });

      if (response.status === 200) {
        setManagers(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLeaves();
    fetchManagers();
  }, []);

  const getReportingManager = (userId) => {
    const reportingManager = managers.find((user) => user.id === userId);
    return reportingManager ? reportingManager.username : null;
  };

  // Function to toggle expanded row
  const toggleRow = (employeeId) => {
    setExpandedRow(expandedRow === employeeId ? null : employeeId);
  };

  // Get country options for Select component
  const countryOptions = Object.keys(getAllCountries()).map((countryCode) => ({
    value: countryCode,
    label: getAllCountries()[countryCode].name,
  }));

  return (
    <div className="bg-[#F9F9F9] w-full">
      <LeaveHeader post="Leave Balance" />
      <div className="md:my-3 lg:mx-8 lg:my-5 my-2">
        <div className="flex flex-wrap justify-between md:justify-center lg:justify-between md:gap-x-14 lg:gap-x-0 items-center bg-[#F2F2F2] rounded-md">
          <div className="p-2 lg:p-3 block">
            <div className="relative">
              <IoIosSearch className="absolute top-2 left-2 text-black" />
              <input
                type="search"
                placeholder="Search by Name"
                className="focus:outline-none focus:border-non py-1 pl-8 pr-4 border-none md:w-60 lg:w-64 xs:w-[19rem] rounded-md"
              />
            </div>
          </div>
          {/* <Select
            name="userrole"
            className="w-36 mx-2 lg:mx-0 md:w-44"
            value=""
            options={userRoles}
            required
          //   onChange={(selectedOption) =>
          //     handleChange("userrole", selectedOption)
          //   }
          /> */}
          <Select
            name="nationality"
            className="w-36 mx-2 lg:mx-0 md:w-44"
            options={countryOptions}
            // value={countryOptions.find(
            //   (option) => option.label === formData.nationality
            // )}
            // onChange={(selectedOption) =>
            //   handleChange("nationality", selectedOption.label)
            // }
            menuPlacement="bottom"
          />
          <div className="flex items-center gap-x-1 lg:gap-x-4 border-[2px] border-[#29BAFF] px-2 mt-2 lg:mt-0 py-3 rounded-lg">
            <Datepicker
              className="z-50"
              required
              onChange={(date) => {
                let formattedDate = moment(date).format("YYYY-MM-DD");
                //   handleChange("Deadline", formattedDate);
              }}
            />
            -
            <Datepicker
              className="z-50"
              required
              onChange={(date) => {
                let formattedDate = moment(date).format("YYYY-MM-DD");
                //   handleChange("Deadline", formattedDate);
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center mx-1 md:mx-2 lg:mx-8 gap-x-2">
        <h2 className="text-[#343434] font-semibold w-[100%] rounded-tl-md rounded-bl-lg py-1 bg-[#F2F2F2] text-lg text-center">
          Employee Data
        </h2>
        {/* <h2 className="text-[#343434] font-semibold w-[30%] md:w-[13%] lg:w-[29%] rounded-tr-md rounded-br-lg py-1 bg-[#F2F2F2] text-lg text-center">
          Leave Data
        </h2> */}
      </div>
      <div className={`px-1 py-4 md:p-3 md:py-3 lg:px-8 lg:py-1 overflow-x-auto overflow-y-auto min-h-[62%] max-h-[62%] md:max-h-[75.5vh] lg:max-h-[58vh] roundScroll`}>
        <table className="min-w-full">
          <thead>
            <tr className="text-baseBlue bg-[#F2F2F2] whitespace-nowrap">
              <th className="px-6 py-3 text-left rounded-tl-lg"></th>
              <th className="px-6 py-3 text-left">Employee ID</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Department</th>
              <th className="px-6 py-3 text-left">Designation</th>
              <th className="px-6 py-3 text-lef">
                Reporting Manger
              </th>
              {/* <th className="px-2 py-3 text-left">Type</th>
              <th className="px-2 py-3 text-left">Alloted</th>
              <th className="px-2 py-3 text-left">Used</th>
              <th className="px-2 py-3 text-left rounded-tr-lg">Left</th> */}
            </tr>
          </thead>
          <tbody className="bg-white text-gray-500">
            {loading ? (
              <LeavesLoader />
            ) : (
              leaves.map((leave, index) => (
                <React.Fragment key={leave.employee_id}>
                  <tr
                    className="whitespace-nowrap border-b-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => toggleRow(leave.employee_id)}
                  >
                    <td className="text-white text-sm flex rounded-full justify-center items-center plus-icon w-9 h-9 bg-baseBlue">
                      {leave?.name
                        ?.split(' ')
                        .map(word => word[0].toUpperCase())
                        .join('')
                        .slice(0, 2)}
                    </td>
                    <td className="px-6 py-2 text-left">{`TXB-${leave.employee_id?.toString().padStart(4, "0")}`}</td>
                    <td className="px-6 py-2 text-left">{leave.name}</td>
                    <td className="px-6 py-2 text-left">{leave.department}</td>
                    <td className="px-6 py-2 text-left">{leave.position}</td>
                    <td className="px-6 py-2 text-left flex items-center gap-x-3">{getReportingManager(leave?.report_to)} <FaAngleDown className={`transition-transform duration-300 ${expandedRow === leave.employee_id ? 'transform rotate-180' : ''}`} /></td>
                  </tr>
                  {expandedRow === leave.employee_id && (
                    <tr>
                      <td colSpan="5">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-200">
                              <th className="px-3 py-2 text-left">Leave Type</th>
                              <th className="px-2 py-2 text-left">Allotted</th>
                              <th className="px-2 py-2 text-left">Used</th>
                              <th className="px-2 py-2 text-left">Left</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="px-3 py-2 text-left">{leave.leave_type}</td>
                              <td className="px-2 py-2 text-left">{leave.total_alloted_leave}</td>
                              <td className="px-2 py-2 text-left">{leave.used_leave}</td>
                              <td className="px-2 py-2 text-left">{leave.left_leave}</td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    baseUrl: state.user.baseUrl,
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(LeaveBalance);
