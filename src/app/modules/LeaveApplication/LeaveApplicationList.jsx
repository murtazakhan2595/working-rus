import React, { useState, useEffect } from "react";
import LeaveHeader from "./LeaveHeader";
import { connect } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LeaveApplicationList = ({ baseUrl, token, userProfile }) => {
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
          leavesList.map((employee) => (
            <div
              className="flex gap-16 flex-row px-4 py-2 rounded bg-[#F2F2F2] mx-4 my-2"
              key={employee.id}
            >
              <div
                className="cursor-pointer text-[#828282] font-semibold"
                onClick={() => {
                  navigate(`/leave-request/${employee.id}`);
                }}
              >
                {employee.name}
              </div>
            </div>
          ))
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
