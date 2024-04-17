import React, { useState, useEffect } from "react";
import LeaveHeader from "./LeaveHeader";
import { connect } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LeaveApplicationList = ({ baseUrl, token, userProfile }) => {
  console.log(userProfile);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [leavesList, setLeavesList] = useState([]);

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    const fetchLeaveList = async () => {
      try {
        const response = await axios.get(`${baseUrl}/leave`, { headers });
        if (response.status == 200) {
          setLeavesList(response.data);
          //   console.log(response);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchLeaveList();
  }, []);

  const handleClick = (employeeId) => {
    if (userProfile.role === 2) {
      navigate(`/leave-request/${employeeId}`);
    } else if (userProfile.role === 3) {
      navigate(`/leave-request-hr/${employeeId}`);
    } else {
      navigate(`/leave-request/${employeeId}`);
    }
  };

  return (
    <div className="bg-[#F9F9F9] w-full">
      <LeaveHeader post="Leave" />
      <div className="overflow-y-auto max-h-[80vh] roundScroll px-8 py-3">
        {loading ? (
          <div className="mt-2">
            <div className="bg-gray-300 h-8 mb-1 w-full animate-pulse rounded"></div>
            <div className="bg-gray-300 h-8 mb-1 w-full animate-pulse rounded"></div>
            <div className="bg-gray-300 h-8 mb-1 w-full animate-pulse rounded"></div>
            <div className="bg-gray-300 h-8 mb-1 w-full animate-pulse rounded"></div>
          </div>
        ) : leavesList.length !== 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Position</th>
                  <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                  <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leavesList.map((employee) => (
                  <tr key={employee.id} className="cursor-pointer hover:text-[#0D2282] hover:bg-[#25A8E026] text-gray-500" onClick={() => handleClick(employee.id)}>
                    <td className="px-4 py-2 whitespace-nowrap">{employee.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{employee.department}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{employee.position}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{employee.start_date}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{employee.end_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center">There's no leave request today.</div>
        )}
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

export default connect(mapStateToProps)(LeaveApplicationList);
