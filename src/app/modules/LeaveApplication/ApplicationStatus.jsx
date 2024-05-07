import React, { useState, useEffect } from "react";
import LeaveHeader from "./LeaveHeader";
import { connect } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ApplicationStatus = ({ baseUrl, token, userProfile }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [newApplications, setNewApplications] = useState([]);
  const [oldApplications, setOldApplications] = useState([]);

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    const fetchLeaveList = async () => {
      try {
        const response = await axios.get(`${baseUrl}/leave?search={"employee_id":${userProfile.id}}`, { headers });
        if (response.status === 200) {
          const applications = response.data;
          const newApps = applications.filter(app => app.status_manager === "Pending" || app.status_hr === "Pending");
          const oldApps = applications.filter(app => app.status_manager !== "Pending" && app.status_hr !== "Pending");
          setNewApplications(newApps);
          setOldApplications(oldApps);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchLeaveList();
  }, []);

  return (
    <div className="bg-[#F9F9F9] w-full">
      <LeaveHeader post="My Application Status" />
      <div className="overflow-y-auto max-h-[80vh] roundScroll px-8 py-3">
        <div className="overflow-x-auto">
          <h2 className="text-lg font-semibold mb-2">New Leave Request</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-sm">
              <tr>
                <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-2 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Total Leaves</th>
                <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">From</th>
                <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">To</th>
                <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Manager Approval</th>
                <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">HR Approval</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {newApplications.map((leave) => (
                <tr key={leave.id} className="hover:text-[#0D2282] hover:bg-[#25A8E026] text-sm text-gray-500"
                >
                  <td className="px-4 py-2 whitespace-nowrap">{leave.date}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{leave.total_leave}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{leave.start_date}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{leave.end_date}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{leave.leave_type}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{leave.status_manager}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{leave.status_hr}</td>
                </tr>
              ))}
              {newApplications.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center">No new leave requests.</td>
                </tr>
              )}
            </tbody>
          </table>

          <h2 className="text-lg font-semibold mb-2">Leave History</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-sm">
              <tr>
                <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-2 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Total Leaves</th>
                <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">From</th>
                <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">To</th>
                <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Manager Approval</th>
                <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">HR Approval</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {oldApplications.map((leave) => (
                <tr key={leave.id} className="hover:text-[#0D2282] hover:bg-[#25A8E026] text-sm text-gray-500"
                >
                  <td className="px-4 py-2 whitespace-nowrap">{leave.date}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{leave.total_leave}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{leave.start_date}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{leave.end_date}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{leave.leave_type}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{leave.status_manager}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{leave.status_hr}</td>
                </tr>
              ))}
              {oldApplications.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center">No leave history.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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

export default connect(mapStateToProps)(ApplicationStatus);
