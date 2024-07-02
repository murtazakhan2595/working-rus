import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  IoArrowForward,
  IoChevronBack,
  IoChevronForward,
} from "react-icons/io5";
import { PiBriefcaseThin } from "react-icons/pi";
import { RxCross2 } from "react-icons/rx";
import { Link } from "react-router-dom";
import { ManagerName } from "utils/getValuesFromTables";

const ViewLeaveDetails = ({ onClose, application }) => {
  return (
    <div className="fixed top-0 right-0 w-[45%] h-full z-10 overflow-y-auto hideScroll pl-10">
      <div className="bg-white h-auto shadow-lg p-10">
        <div className="flex justify-between gap-x-3 items-center border-b border-[#D7E4FF] b-2">
          <h2 className="font-bold text-xl ">Details</h2>
          <div className="flex justify-center ">
            <button className="flex items-center px-2 py-2">
              <IoChevronBack className="mr-2" /> Previous
            </button>
            <button className="flex items-center px-2 py-2 ml-4">
              Next <IoChevronForward className="ml-2" />
            </button>
          </div>
          <RxCross2
            className=" cursor-pointer"
            onClick={() => {
              onClose();
            }}
          />
        </div>

        <div class="flex justify-between items-center mb-1 font-lato text-2xl font-bold">
          {application?.name}
        </div>

        <div class="mb-1 flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <p class="text-capitalize text-base text-baseGray mb-3">
              ID:{application?.employee_id} |{""}
            </p>
            <p class="text-capitalize text-base text-baseGray mb-3">
              {application?.position} |{" "}
            </p>
            <p class="text-capitalize text-base text-baseGray mb-3">
              {application?.department_name}
            </p>
            <h2 class="text-2xl text-capitalize font-bold text-[#323333]"></h2>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-4 mb-4 border border-gray-400 rounded-lg px-3 py-4">
          <div>
            <p class="text-[14px] font-normal text-baseGray">Nationality</p>
            <p class="text-base font-semibold text-baseGray">
              {application?.nationality}
            </p>
          </div>
          <div>
            <p class="text-[14px] font-normal text-baseGray">
              Last Working Day
            </p>
            <p class="text-base font-semibold text-baseGray">
              {moment(application?.last_work_day, "YYYY-MM-DD").format(
                "DD-MM-YYYY"
              )}
            </p>
          </div>
          <div>
            <p class="text-[14px] font-normal text-baseGray">
              Leave Start Date
            </p>
            <p class="text-base font-semibold text-baseGray">
              {moment(application?.start_date, "YYYY-MM-DD").format(
                "DD-MM-YYYY"
              )}
            </p>
          </div>
          <div>
            <p class="text-[14px] font-normal text-baseGray">Leave Type</p>
            <p class="text-base font-semibold text-baseGray">
              {application?.leave_type}
            </p>
          </div>
          <div>
            <p class="text-[14px] font-normal text-baseGray">Rejoin Date</p>
            <p class="text-base font-semibold text-baseGray">
              {moment(application?.rejoining_date, "YYYY-MM-DD").format(
                "DD-MM-YYYY"
              )}
            </p>
          </div>
          <div>
            <p class="text-[14px] font-normal text-baseGray">Leave End Date</p>
            <p class="text-base font-semibold text-baseGray">
              {moment(application?.end_date, "YYYY-MM-DD").format("DD-MM-YYYY")}
            </p>
          </div>
          <div>
            <p class="text-[14px] font-normal text-baseGray">No of leaves</p>
            <p class="text-base font-semibold text-baseGray">
              {application?.total_leave}
            </p>
          </div>
          <div>
            <p class="text-[14px] font-normal text-baseGray">Contact no</p>
            <p class="text-base font-semibold text-baseGray">
              {application?.contact_no}
            </p>
          </div>
          <div>
            <p class="text-[14px] font-normal text-baseGray">Manager</p>
            <p class="text-base font-semibold text-baseGray">
              <ManagerName value={application?.report_to} />
            </p>
          </div>
        </div>

        <div class="flex justify-end items-center">
          <Link
            // to={`/applicants/${job?.id}`}
            className="border px-3 py-2 rounded-md border-black flex items-center gap-x-2"
          >
            View History
            <IoArrowForward className="text-xl" />
          </Link>
        </div>

        <div className="mt-3">
          <h3 className="font-bold text-base text-[#323333]">Reasoning</h3>
          <p className="text-base font-normal text-baseGray">
            {application?.reason}
          </p>
        </div>

        <div class="flex gap-x-6 items-center mt-4">
          <button
            className="px-3 py-2 rounded-md border flex items-center gap-x-2 justify-center"
            style={{ width: "150px", height: "40px" }}
          >
            Deny
          </button>
          <button
            className="border px-3 py-2 rounded-md flex items-center justify-center gap-x-2"
            style={{ width: "150px", height: "40px" }}
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewLeaveDetails;
