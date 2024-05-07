import React, { useState, useEffect } from "react";
import LeaveHeader from "./LeaveHeader";
import { connect } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LeaveApplicationListHR = ({ baseUrl, token, userProfile }) => {
  // Initialize state variables
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [leavesList, setLeavesList] = useState([]);

  // HTTP headers for authorization
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // Fetch leave list from the API
  useEffect(() => {
    const fetchLeaveList = async () => {
      try {
        const response = await axios.get(`${baseUrl}/leave?ordering=date`, { headers });
        if (response.status === 200) {
          setLeavesList(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchLeaveList();
  }, []);

  // Handle click event on leave application
  const handleClick = (employeeId, status_manager, status_hr) => {
    let leaveUrl = "";
    if (userProfile.role === 2) {
      leaveUrl = `/leave-request/${employeeId}`;
    } else if (userProfile.role === 3) {
      leaveUrl = `/leave-request-hr/${employeeId}`;
    } else {
      leaveUrl = `/leave-request/${employeeId}`;
    }

    if (status_manager || status_hr) {
      leaveUrl += `?status_manager=${status_manager}&status_hr=${status_hr}`;
    }

    navigate(leaveUrl);
  };

  // Filter new and old leave applications based on status
  const newApplications = leavesList.filter(employee => employee.status_manager === "Pending" || employee.status_hr === "Pending");
  const oldApplications = leavesList.filter(employee => employee.status_manager !== "Pending" && employee.status_hr !== "Pending");

  return (
    <div className="bg-[#F9F9F9] w-full">
      <LeaveHeader post="Team Application Status" />
      <div className="overflow-y-auto max-h-[80vh] roundScroll px-8 py-3">

        {loading && (
          <div className="text-center">
            <div className="mt-2">
              <div className="bg-gray-300 h-8 mb-1 w-full animate-pulse rounded"></div>
              <div className="bg-gray-300 h-8 mb-1 w-full animate-pulse rounded"></div>
              <div className="bg-gray-300 h-8 mb-1 w-full animate-pulse rounded"></div>
              <div className="bg-gray-300 h-8 mb-1 w-full animate-pulse rounded"></div>
            </div>
          </div>
        )}
        {/* Display new applications if available */}
        {!loading && newApplications.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">New Leave Request</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 text-sm">
                  {/* Table header */}
                  <tr>
                    <th scope="col" className="px-3 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-3 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                    <th scope="col" className="px-3 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-3 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th scope="col" className="px-3 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Position</th>
                    <th scope="col" className="px-3 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                    <th scope="col" className="px-3 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                    <th scope="col" className="px-3 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Manager Status</th>
                    <th scope="col" className="px-3 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">HR Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Render table rows for new applications */}
                  {!loading && newApplications.map((employee) => (
                    <tr key={employee.id} className="cursor-pointer text-sm hover:text-[#0D2282] hover:bg-[#25A8E026] text-gray-500"
                      onClick={() => handleClick(employee.id, employee.status_manager, employee.status_hr)}>
                      <td className="px-3 py-2 whitespace-nowrap">{employee.date}</td>
                      <td className="px-3 py-2 whitespace-nowrap">TXB-{employee.employee_id.toString().padStart(4, "0")}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{employee.name}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{employee.department}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{employee.position}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{employee.start_date}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{employee.end_date}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{employee.status_manager}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{employee.status_hr}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Display old applications if available */}
        {oldApplications.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mt-2 mb-2">Leave History</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 text-sm">
                  {/* Table header */}
                  <tr>
                    <th scope="col" className="px-3 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-3 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                    <th scope="col" className="px-3 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-3 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th scope="col" className="px-3 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Position</th>
                    <th scope="col" className="px-3 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                    <th scope="col" className="px-3 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                    <th scope="col" className="px-3 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Manager Status</th>
                    <th scope="col" className="px-3 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">HR Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Render table rows for old applications */}
                  {oldApplications.map((employee) => (
                    <tr key={employee.id} className="cursor-pointer text-sm hover:text-[#0D2282] hover:bg-[#25A8E026] text-gray-500"
                      onClick={() => handleClick(employee.id, employee.status_manager, employee.status_hr)}>
                      <td className="px-3 py-2 whitespace-nowrap">{employee.date}</td>
                      <td className="px-3 py-2 whitespace-nowrap">TXB-{employee.employee_id.toString().padStart(4, "0")}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{employee.name}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{employee.department}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{employee.position}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{employee.start_date}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{employee.end_date}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{employee.status_manager}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{employee.status_hr}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Display message if no leave requests */}
        {!loading && newApplications.length === 0 && oldApplications.length === 0 && (
          <div className="text-center">There's no leave request for today.</div>
        )}
      </div>
    </div>
  );
};

// Map Redux state to component props
const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    baseUrl: state.user.baseUrl,
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(LeaveApplicationListHR);
