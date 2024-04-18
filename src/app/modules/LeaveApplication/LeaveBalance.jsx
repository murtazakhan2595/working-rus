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

const LeaveBalance = ({ baseUrl, token, userProfile, isSidebarOpen }) => {

  const [leaves, setLeaves] = useState([])
  const [managers, setManagers] = useState([])
  const [loading, setLoading] = useState(true);

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const fetchLeaves = async () => {
    try {
      const response = await axios.get(`${baseUrl}/leave`, { headers });
      setLeaves(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    } finally {
      // setLoading(false);
    }
  };

  const fetchManagers = async () => {
    try {
      const response = await axios.get(`${baseUrl}/emp/`, {
        headers,
      });

      if (response.status === 200) {
        setManagers(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLeaves();
    fetchManagers()
  }, []);

  const getReportingManger = (userId) => {
    const reportingManger = managers?.find((user) => user.id === userId);
    return reportingManger ? reportingManger.department_manager : null;
  };


  // Get country options for Select component
  const countryOptions = Object.keys(getAllCountries()).map((countryCode) => ({
    value: countryCode,
    label: getAllCountries()[countryCode].name
  }));

  return (
    <div className="bg-[#F9F9F9] w-full">
      <LeaveHeader post="Leave Balance" />
      <div className="md:my-3 lg:mx-8 lg:my-5 my-2">
        <div className="flex flex-wrap justify-between md:justify-center lg:justify-between md:gap-x-14 lg:gap-x-0 items-center bg-[#F2F2F2] rounded-md">
          <div className="p-2 lg:p-3 block">
            <div className="relative">
              <IoIosSearch className="absolute top-2 left-3 text-black" />
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
        <h2 className="text-[#343434] font-semibold w-[70%] md:w-[87%] lg:w-[71%] rounded-tl-md rounded-bl-lg py-1 bg-[#F2F2F2] text-lg text-center">
          Employee Data
        </h2>
        <h2 className="text-[#343434] font-semibold w-[30%] md:w-[13%] lg:w-[29%] rounded-tr-md rounded-br-lg py-1 bg-[#F2F2F2] text-lg text-center">
          Leave Data
        </h2>
      </div>
      <div className={`px-1 py-4 md:p-3 md:py-3 lg:px-8 lg:py-1 overflow-x-auto overflow-y-auto max-h-[60.5vh] md:max-h-[75.5vh] lg:max-h-[58vh] roundScroll ${isSidebarOpen ? 'w-[1120px]' : 'w-[1240px]'}`}>
        <table className="min-w-full">
          <thead>
            <tr className="text-baseBlue bg-[#F2F2F2] whitespace-nowrap">
              <th className="px-6 py-3 text-left rounded-tl-lg">Employee ID</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Department</th>
              <th className="px-6 py-3 text-left">Designation</th>
              <th className="px-2 py-3 text-left border-r-8 border-white rounded">
                Reporting Manger
              </th>
              <th className="px-2 py-3 text-left">Type</th>
              <th className="px-2 py-3 text-left">Alloted</th>
              <th className="px-2 py-3 text-left">Used</th>
              <th className="px-2 py-3 text-left rounded-tr-lg">Left</th>
            </tr>
          </thead>
          {loading ? (<LeavesLoader />) : (
            <tbody className="bg-white text-gray-500">
              {leaves?.map((leave) => (
                <tr
                  className="whitespace-nowrap border-b-2 hover:bg-gray-100"
                  key={leave.employee_id}
                >
                  <td className="px-6 py-2 text-left">{`TXB-${leave.employee_id?.toString().padStart(4, "0")}`}</td>
                  <td className="px-6 py-2 text-left">{leave.name}</td>
                  <td className="px-6 py-2 text-left">{leave.department}</td>
                  <td className="px-6 py-2 text-left">{leave.position}</td>
                  <td className="px-3 py-2 text-left">{getReportingManger(leave?.report_to)}</td>
                  <td className="px-3 py-2 text-left">{leave.leave_type}</td>
                  <td className="px-2 py-2 text-left">
                    {/* <div className="text-sm">&#9664;</div> */}
                    {leave.total_alloted_leave}
                    {/* <div className="text-sm">&#9654;</div> */}
                  </td>
                  <td className="px-2 py-2 text-left">{leave.used_leave}</td>
                  <td className="px-2 py-2 text-left">{leave.left_leave}</td>
                </tr>
              ))
              }
            </tbody>
          )}
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
