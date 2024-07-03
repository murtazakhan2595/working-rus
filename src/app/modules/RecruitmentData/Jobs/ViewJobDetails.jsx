import { RxCross2 } from "react-icons/rx";
import { LuExternalLink } from "react-icons/lu";
import { Link } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { PiBriefcaseThin } from "react-icons/pi";
import { IoArrowForward } from "react-icons/io5";
import { Tabs, Blocks, Header, StatusLabel, Labels } from "../Sections";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { convertToK } from "../../../../utils/ConvertToK";
import { useState } from "react";
import EditJobDetails from "./EditJobDetails";

const ViewJobDetails = ({ job, onClose }) => {
  const [showEdit, setShowEdit] = useState(false);

  const handleEditClick = () => {
    setShowEdit(true);
  };

  const handleEditClose = () => {
    setShowEdit(false);
  };
  return (
    <div className="fixed top-0 right-0 w-[50%] h-full z-10 overflow-y-auto hideScroll pl-10">
      <div className="bg-white h-auto shadow-lg p-10">
        <div
          className="absolute right-6 top-6 cursor-pointer"
          onClick={onClose}
        >
          <RxCross2 className="text-baseGray" />
        </div>

        <div class="flex justify-between items-center mb-1">
          <Labels
            label={job?.status === "live" ? "Open" : "Close"}
            iconDot={true}
            iconColor={`${
              job?.status === "live" ? "bg-green-500" : "bg-red-500"
            }`}
            backgroungColor={`${
              job?.status === "live" ? "bg-green-100" : "bg-red-100"
            }`}
          />
        </div>

        <div class="mb-4 flex items-center justify-between">
          <div>
            <p class="text-capitalize text-base text-baseGray mb-3">
              {job?.id}
            </p>
            <h2 class="text-2xl text-capitalize font-bold text-[#323333]">
              {job?.Job_Title}
            </h2>
          </div>
          <div className="text-base text-baseGray flex items-center gap-x-4">
            <button
              onClick={handleEditClick}
              className="border px-3 py-2 rounded-md border-black flex items-center gap-x-2"
            >
              <CiEdit className="text-xl" />
              Edit Job
            </button>
            <Link to={`/job-description/${job?.id}`}>
              <LuExternalLink />
            </Link>
            <PiDotsThreeOutlineFill />
          </div>
        </div>
        <div class="grid grid-cols-3 gap-4 mb-4 border border-gray-400 rounded-lg px-3 py-4">
          <div>
            <p class="text-[14px] font-normal text-baseGray">Education</p>
            <p class="text-base font-semibold text-baseGray">
              {job?.Education}
            </p>
          </div>
          <div>
            <p class="text-[14px] font-normal text-baseGray">Job type</p>
            <p class="text-base font-semibold text-baseGray">{job?.Job_Type}</p>
          </div>
          <div>
            <p class="text-[14px] font-normal text-baseGray">Work type</p>
            <p class="text-base font-semibold text-baseGray">
              {job?.Work_type}
            </p>
          </div>
          <div>
            <p class="text-[14px] font-normal text-baseGray">Location</p>
            <p class="text-base font-semibold text-baseGray">{job?.location}</p>
          </div>
          <div>
            <p class="text-[14px] font-normal text-baseGray">Employee type</p>
            <p class="text-base font-semibold text-baseGray">
              {job?.Employee_Type}
            </p>
          </div>
          <div>
            <p class="text-[14px] font-normal text-baseGray">Salary</p>
            <p class="text-base font-semibold text-baseGray">
              {convertToK(job?.min_salary)} - {convertToK(job?.max_salary)}
            </p>
          </div>
          <div>
            <p class="text-[14px] font-normal text-baseGray">Start date</p>
            <p class="text-base font-semibold text-baseGray">
              {job?.created_at.slice(0, 10)}
            </p>
          </div>
          <div>
            <p class="text-[14px] font-normal text-baseGray">Deadline</p>
            <p class="text-base font-semibold text-baseGray">{job?.Deadline}</p>
          </div>
        </div>

        <div class="flex justify-between items-center">
          <button class="flex items-center gap-x-2 rounded-full bg-[#E6E9F0] px-3 py-1 text-baseGray text-base font-normal">
            <PiBriefcaseThin className="text-xl" /> {job?.total_applications}{" "}
            Applications
          </button>
          <Link
            to={`/applicants/${job?.id}`}
            className="border px-3 py-2 rounded-md border-black flex items-center gap-x-2"
          >
            Applications
            <IoArrowForward className="text-xl" />
          </Link>
        </div>

        <div className="mt-3">
          <h3 className="font-bold text-base text-[#323333]">
            Job Description
          </h3>
          <p className="text-base font-normal text-baseGray">
            {job?.Job_Description}
          </p>
        </div>
        <h3 className="font-bold text-base text-[#323333]">Job Requirements</h3>
        <p className="text-base font-normal text-baseGray">
          {job?.Job_Requirement}
        </p>
      </div>

      {showEdit && <EditJobDetails job={job} onClose={handleEditClose} />}
    </div>
  );
};

export default ViewJobDetails;
