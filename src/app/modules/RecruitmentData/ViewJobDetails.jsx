import { RxCross2 } from "react-icons/rx";
import { LuExternalLink } from "react-icons/lu";
import { Link } from "react-router-dom";
import dots from "../../../assets/images/dots.svg";
import { CiEdit } from "react-icons/ci";
import { PiBriefcaseThin } from "react-icons/pi";
import { IoArrowForward } from "react-icons/io5";

const ViewJobDetails = ({ post, onClose }) => {
  return (
    <div className="absolute top-0 right-0 w-[40%] h-full bg-white shadow-lg z-10 p-10 overflow-y-auto hideScroll">
      <div className="absolute right-6 top-6 cursor-pointer" onClick={onClose}>
        <RxCross2 className="text-baseGray" />
      </div>

      <div class="flex justify-between items-center mb-1">
        <div
          class={`flex items-center px-2 rounded-2xl ${
            post?.status === "Live" ? "bg-green-200" : "bg-red-200"
          } font-semibold`}
        >
          <span
            class={`inline-block w-3 h-3 ${
              post?.status === "Live" ? "bg-green-500" : "bg-red-500"
            }  rounded-full mr-2`}
          ></span>
          <span className="font-lato text-base text-baseGray font-normal">
            {post?.status}
          </span>
        </div>
      </div>

      <div class="mb-4 flex items-center justify-between">
        <div>
          <p class="font-lato text-base text-baseGray mb-3">{post?.id}</p>
          <h2 class="text-2xl font-lato font-bold text-[#323333]">
            {post?.Job_Title}
          </h2>
        </div>
        <div className="font-lato text-base text-baseGray flex items-center gap-x-4">
          <Link
            to={`/applicants/${post.id}`}
            className="border px-3 py-2 rounded-md border-black flex items-center gap-x-2"
          >
            <CiEdit className="text-xl" />
            Edit Job
          </Link>
          <LuExternalLink />
          <img
            src={dots}
            alt=""
            // onClick={() => handleDotsClick(post)}
            className="cursor-pointer"
          />
        </div>
      </div>
      <div class="grid grid-cols-3 gap-4 mb-4 border border-gray-400 rounded-lg px-3 py-4">
        <div>
          <p class="text-[14px] font-normal font-lato text-baseGray">
            Education
          </p>
          <p class="text-base font-semibold font-lato text-baseGray">
            {post?.Education}
          </p>
        </div>
        <div>
          <p class="text-[14px] font-normal font-lato text-baseGray">
            Job type
          </p>
          <p class="text-base font-semibold font-lato text-baseGray">
            {post?.Job_Type}
          </p>
        </div>
        <div>
          <p class="text-[14px] font-normal font-lato text-baseGray">
            Work type
          </p>
          <p class="text-base font-semibold font-lato text-baseGray">
            {post?.Work_type}
          </p>
        </div>
        <div>
          <p class="text-[14px] font-normal font-lato text-baseGray">
            Location
          </p>
          <p class="text-base font-semibold font-lato text-baseGray">
            {post?.location}
          </p>
        </div>
        <div>
          <p class="text-[14px] font-normal font-lato text-baseGray">
            Employee type
          </p>
          <p class="text-base font-semibold font-lato text-baseGray">
            {post?.Employee_Type}
          </p>
        </div>
        <div>
          <p class="text-[14px] font-normal font-lato text-baseGray">Salary</p>
          <p class="text-base font-semibold font-lato text-baseGray">
            {post?.min_salary} - {post?.max_salary}
          </p>
        </div>
        <div>
          <p class="text-[14px] font-normal font-lato text-baseGray">
            Start date
          </p>
          <p class="text-base font-semibold font-lato text-baseGray">
            06-07-2024
          </p>
        </div>
        <div>
          <p class="text-[14px] font-normal font-lato text-baseGray">
            Deadline
          </p>
          <p class="text-base font-semibold font-lato text-baseGray">
            29-08-2024
          </p>
        </div>
      </div>

      <div class="flex justify-between items-center">
        <button class="flex items-center gap-x-2 rounded-full bg-[#E6E9F0] px-3 py-1 font-lato text-baseGray text-base font-normal">
          <PiBriefcaseThin className="text-xl" /> 40 Applications
        </button>
        <button className="border px-3 py-2 rounded-md border-black flex items-center gap-x-2">
          Applications
          <IoArrowForward className="text-xl" />
        </button>
      </div>

      <div className="mt-3">
        <h3 className="font-lato font-bold text-base text-[#323333]">
          Job Description
        </h3>
        <p className="text-base font-lato font-normal text-baseGray">
          {post?.Job_Description}
        </p>
      </div>
      <h3 className="font-lato font-bold text-base text-[#323333]">
        Job Requirements
      </h3>
      <p className="text-base font-lato font-normal text-baseGray">
        {post?.Job_Requirement}
      </p>
    </div>
  );
};

export default ViewJobDetails;
