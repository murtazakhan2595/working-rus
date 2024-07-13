import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import pdfIcon from "assets/images/pdfIcon.svg";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { getCountryFullName } from "utils/getValuesFromTables";
import { AiOutlineDownload } from "react-icons/ai";
import { formatNumber } from "data/Data";
import moment from "moment";
import { Labels } from "../Sections";
import { RenderJobApplicationActions } from "./Sections";
import { fetchJobById, downloadCV } from "app/hooks/recruitment";
import { IoMdArrowDropdown } from "react-icons/io";

const ViewApplicantDetails = ({
  applicantIndex,
  closeModel,
  handleOptionSelect,
  applicationsList,
}) => {
  const [jobDetails, setJobDetails] = useState(null);
  const [selectedApplicationIndex, setSelectedApplicationIndex] =
    useState(applicantIndex);
  const [applicant, setApplicant] = useState(null);

  useEffect(() => {
    let isMounted = true; // Track if the component is still mounted
    const fetchDetails = async () => {
      const applicant = applicationsList[selectedApplicationIndex];
      setApplicant(applicant);
      const jobDetailResponse = await fetchJobById(applicant?.job_id);
      if (isMounted) {
        setJobDetails(jobDetailResponse);
      }
    };
    fetchDetails();
    return () => {
      isMounted = false;
    };
  }, [selectedApplicationIndex]);

  const handleNext = () => {
    console.log(applicant, applicationsList, selectedApplicationIndex);

    if (selectedApplicationIndex < applicationsList.length - 1) {
      setSelectedApplicationIndex(selectedApplicationIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (selectedApplicationIndex > 0) {
      setSelectedApplicationIndex(selectedApplicationIndex - 1);
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
            <p class="text-base  mb-2">{applicant?.id}</p>
            <h2 class="text-2xl font-bold text-[#323333]">
              {applicant?.first_name} {applicant?.last_name}
            </h2>
          </div>
          <div className="text-base  flex items-center gap-x-4">
            <RenderJobApplicationActions
              row={applicant}
              handleOptionSelect={handleOptionSelect}
              labelContact={
                <div className="px-2 flex items-center gap-x-2 text-dark text-[16px]">
                  Action <IoMdArrowDropdown />
                </div>
              }
            />
          </div>
        </div>
        <div className="flex items-center gap-x-4 mb-8">
          <Labels label={`${applicant?.Year_of_Experience} Years`} />
          <Labels
            label={
              applicant?.current_salary ? `${jobDetails?.currency} ${formatNumber(applicant?.current_salary)}` : ""
            }
          />
          <Labels label={getCountryFullName(applicant?.location)} />
        </div>
        <div class="grid grid-cols-3 gap-x-8 gap-y-4 mb-4 border border-gray-400 rounded-lg px-3 py-4">
          <ApplicantDetail label={"Email"} value={applicant?.email} />
          <ApplicantDetail
            label={"Phone number"}
            value={applicant?.phone_number}
          />
          <ApplicantDetail label={"Education"} value={jobDetails?.Education} />
          <ApplicantDetail
            label={"Applied on"}
            value={moment(applicant?.updated_at).format("DD-MM-YYYY")}
          />
          <ApplicantDetail
            label={"Applied for"}
            value={jobDetails?.Job_Title}
          />
          <ApplicantDetail
            label={"Expected Salary"}
            value={`${jobDetails?.currency} ${formatNumber(applicant?.expected_salary)}`}
          />
          <ApplicantDetail
            label={"Notice Period"}
            value={applicant?.notice_period}
          />
          <ApplicantDetail
            label={"Available for Interview"}
            value={applicant?.availability_for_interview}
          />
        </div>

        <div className="mt-3">
          <h3 className="font-bold text-base text-[#323333]">
            Resume
          </h3>

          <div className="bg-[#F0F1F2] rounded-lg p-2 flex justify-between items-center">
            <div className="flex gap-x-3">
              <img src={pdfIcon} alt="" />
              <p class="text-[14px] text-[#323333]">
                {applicant?.first_name} {applicant?.last_name}
              </p>
            </div>
            <div
              className="flex gap-x-2 cursor-pointer"
              onClick={() =>
                downloadCV(
                  applicant?.cv,
                  `${applicant?.first_name} ${applicant?.last_name}`
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

export default ViewApplicantDetails;
