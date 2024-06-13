import React from "react";
import { IoCalendarOutline } from "react-icons/io5";

const JobDetails = ({ post, jobIcon }) => {
  return (
    <div className="flex flex-col justify-between gap-y-12">
      <div className="flex justify-between">
        <div className="flex items-center gap-x-2">
          <img src={jobIcon} alt="Job Icon" />
          <div>
            <p className="font-lato text-baseGray text-base">{post.id}</p>
            <h3 className="font-lato text-[20px] text-baseGray font-bold">
              {post.Job_Title}
            </h3>
          </div>
        </div>
        <div className="font-lato text-base text-baseGray flex items-center gap-x-2">
          <IoCalendarOutline className="text-lg" />
          {`${post.updated_at?.slice(0, 10)} to ${post.Deadline} `}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div
          className={`flex items-center text-baseGray font-lato text-base font-normal rounded-2xl px-2 ${
            post.status === "live" ? "bg-green-100" : "bg-red-100"
          }`}
        >
          <span
            className={`w-3 h-3 rounded-full mr-2 ${
              post.status === "live" ? "bg-green-500" : "bg-red-500"
            }`}
          ></span>
          {post.status}
        </div>
        <div className="text-baseGray font-lato text-base font-normal bg-[#E6E9F0] rounded-2xl px-2">
          {post.Employee_Type}
        </div>
        <div className="text-baseGray font-lato text-base font-normal bg-[#E6E9F0] rounded-2xl px-2">
          {post.Work_type}
        </div>
        <div className="text-baseGray font-lato text-base font-normal bg-[#E6E9F0] rounded-2xl px-2">
          {post.location}
        </div>
        <div className="text-baseGray font-lato text-base font-normal bg-[#E6E9F0] rounded-2xl px-2">
          {post.Job_Type}
        </div>
      </div>
    </div>
  );
};


export default JobDetails;
