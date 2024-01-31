import React, { useState, useEffect } from "react";
import LeaveHeader from "./LeaveHeader";
import { connect } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

const LeaveApplicationList = ({ baseUrl, token, userProfile }) => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="bg-[#F9F9F9] w-full">
      <LeaveHeader post="Leave" />
      <div className="overflow-y-auto max-h-96 roundScroll">
        {loading ? (
          <div className="mt-2">
            {[1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="bg-gray-300 h-8 mb-1 w-full animate-pulse rounded"
              ></div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-3">
            <div className="flex gap-16 flex-row p-2 rounded bg-[#F2F2F2] mx-4 my-2">
              <div className="cursor-pointer text-[#828282] text-base font-semibold">
                Name here
              </div>
            </div>
          </div>
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
