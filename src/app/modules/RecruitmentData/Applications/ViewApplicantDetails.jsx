import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { LuExternalLink } from "react-icons/lu";
import { Link } from "react-router-dom";
import dots from "assets/images/dots.svg";
import pdfIcon from "assets/images/pdfIcon.svg";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { getCountryFullName } from "utils/getValuesFromTables";
import { AiOutlineDownload } from "react-icons/ai";
import moment from "moment";
import { Labels } from "../Sections";
import { fetchJobById } from "app/hooks/recruitment";

const ViewApplicantDetails = ({ applicant, closeModel }) => {
  const workLocation = getCountryFullName(applicant.location);
  const [jobDetails, setJobDetails] = useState(null);

  useEffect(() => {
    let isMounted = true; // Track if the component is still mounted
    const fetchJobDetails = async () => {
      const jobDetailResponse = await fetchJobById(applicant?.job_id);
      if (isMounted) {
        setJobDetails(jobDetailResponse);
      }
    };
    fetchJobDetails();
    return () => {
      isMounted = false; // Cleanup function to set isMounted to false
    };
  }, [applicant]);
  console.log(applicant);
  return (
    <div className="fixed top-0 text-baseGray right-0 w-[50%] h-full z-10 overflow-y-auto hideScroll pl-10">
      <div className="bg-white h-auto shadow-lg p-10">
        <div className="flex justify-between gap-x-3 items-center border-b border-[#D7E4FF] b-2">
          <h2 className="font-bold text-xl ">Applicant details</h2>
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
              closeModel();
            }}
          />
        </div>

        <div class="mb-4 flex items-center justify-between mt-9">
          <div>
            <p class="text-base  mb-2">{applicant.id}</p>
            <h2 class="text-2xl font-bold text-[#323333]">
              {applicant.first_name} {applicant.last_name}
            </h2>
          </div>
          <div className="text-base  flex items-center gap-x-4">
            <Link
              to={`/applicants/47}`}
              className="border px-3 py-1.5 rounded-md border-black flex items-center gap-x-2"
            >
              Action
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
        <div className="flex items-center gap-x-4 mb-8">
          <Labels label={`${applicant.Year_of_Experience} Years`} />
          <Labels
            label={
              applicant.current_salary ? `$${applicant.current_salary}` : ""
            }
          />
          <Labels label={workLocation} />
        </div>
        <div class="grid grid-cols-3 gap-x-8 gap-y-4 mb-4 border border-gray-400 rounded-lg px-3 py-4">
          <ApplicantDetail label={"Email"} value={applicant.email} />
          <ApplicantDetail
            label={"Phone number"}
            value={applicant.phone_number}
          />
          <ApplicantDetail label={"Education"} value={jobDetails?.Education} />
          <ApplicantDetail
            label={"Applied on"}
            value={moment(applicant.updated_at).format("DD-MM-YYYY")}
          />
          <ApplicantDetail label={"Applied for"} value={jobDetails?.Job_Title} />
          <ApplicantDetail
            label={"Expected Salary"}
            value={applicant.expected_salary}
          />
          <ApplicantDetail
            label={"Notice Period"}
            value={applicant.notice_period}
          />
          <ApplicantDetail
            label={"Available for Interview"}
            value={applicant.availability_for_interview}
          />
        </div>

        <div className="mt-3">
          <h3 className="font-bold text-base text-[#323333]">
            Job Description
          </h3>

          <div className="bg-[#F0F1F2] rounded-lg p-2 flex justify-between items-center">
            <div className="flex gap-x-3">
              <img src={pdfIcon} alt="" />
              <p class="text-[14px] text-[#323333]">
                {applicant.first_name} {applicant.last_name}
              </p>
            </div>
            <div className="flex gap-x-2">
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
