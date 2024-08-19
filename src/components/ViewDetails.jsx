import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import pdfIcon from "assets/images/pdfIcon.svg";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { getCountryFullName } from "utils/getValuesFromTables";
import { AiOutlineDownload } from "react-icons/ai";
import { formatNumber } from "data/Data";
import moment from "moment";
import {downloadCV } from "app/hooks/recruitment";

const ViewDetails = ({ currentIndex, closeModel, dataList  }) => {
  const [details, setDetails] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(currentIndex);
  useEffect(() => {
    let isMounted = true; // Track if the component is still mounted
    const fetchDetails = async () => {
      const details = dataList[selectedIndex];
      setDetails(details);
    };
    fetchDetails();
    return () => {
      isMounted = false;
    };
  }, [selectedIndex]);

  const handleNext = () => {
    if (selectedIndex < dataList.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  return (
    <div
      className="fixed top-0 text-baseGray right-0 w-[95%] h-[100vh] z-10 overflow-y-auto pl-10 hideScroll"
      style={{ maxWidth: "700px" }}
    >
      <div className="bg-white h-auto p-10" style={{ minHeight: "100vh" }}>
        <div className="flex justify-between gap-x-3 items-center border-b border-[#D7E4FF] b-2">
          <h2 className="font-bold text-xl ">Applicant details</h2>
          <div className="flex justify-center ">
            <button
              className="flex items-center px-2 py-2"
              onClick={() => {
                handlePrevious();
              }}
            >
              <IoChevronBack className="mr-2" /> Previous
            </button>
            <button
              className="flex items-center px-2 py-2 ml-4"
              onClick={() => {
                handleNext();
              }}
            >
              Next <IoChevronForward className="ml-2" />
            </button>
          </div>
          <RxCross2
            className=" cursor-pointer"
            onClick={() => {
              closeModel();
            }}
          />
        </div>
        <div class="mb-4 flex items-center justify-between mt-9">
          <div>
            <p class="text-base  mb-2">{details?.id}</p>
            <h2 class="text-2xl font-bold text-[#323333]">
              {details?.first_name} {details?.last_name}
            </h2>
          </div>
          <div className="text-base  flex items-center gap-x-4">
            
          </div>
        </div>
        <div className="flex items-center gap-x-4 mb-8">
        
        </div>
        <div class="grid grid-cols-3 gap-x-8 gap-y-4 mb-4 border border-gray-400 rounded-lg px-3 py-4">
          <ApplicantDetail label={"Email"} value={details?.email} />
          <ApplicantDetail
            label={"Phone number"}
            value={details?.phone_number}
          />
          <ApplicantDetail label={"Education"} value={details?.Education} />
          <ApplicantDetail
            label={"Applied on"}
            value={moment(details?.updated_at).format("DD-MM-YYYY")}
          />
          <ApplicantDetail label={"Applied for"} value={details?.Job_Title} />
          <ApplicantDetail
            label={"Expected Salary"}
            value={`${details?.currency} ${formatNumber(
              details?.expected_salary
            )}`}
          />
          <ApplicantDetail
            label={"Notice Period"}
            value={details?.notice_period}
          />
          <ApplicantDetail
            label={"Available for Interview"}
            value={details?.availability_for_interview}
          />
        </div>

        <div className="mt-3">
          <h3 className="font-bold text-base text-[#323333]">Resume</h3>

          <div className="bg-[#F0F1F2] rounded-lg p-2 flex justify-between items-center">
            <div className="flex gap-x-3">
              <img src={pdfIcon} alt="" />
              <p class="text-[14px] text-[#323333]">
                {details?.first_name} {details?.last_name}
              </p>
            </div>
            <div
              className="flex gap-x-2 cursor-pointer"
              onClick={() =>
                downloadCV(
                  details?.cv,
                  `${details?.first_name} ${details?.last_name}`
                )
              }
            >
              <p class="text-[14px] text-[#323333]">Download</p>
              <AiOutlineDownload />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ApplicantDetail = ({ label, value }) => {
  return (
    <div>
      <p class="text-[14px] font-normal">{label}</p>
      <p class="text-[14px] font-semibold">{value ?? "N/A"}</p>
    </div>
  );
};

export default ViewDetails;
