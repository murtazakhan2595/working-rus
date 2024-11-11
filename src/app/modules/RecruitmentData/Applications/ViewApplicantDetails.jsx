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
import { Button } from "components/ui/button";
import EmployeeDataInfo from "app/modules/payroll/Sections/EmployeeDataInfo";

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
    <div className="p-4">
      <div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              handlePrevious();
            }}
          >
            <IoChevronBack className="mr-2" /> Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              handleNext();
            }}
          >
            Next <IoChevronForward className="ml-2" />
          </Button>
        </div>
      </div>
      <div class="mb-4 flex items-center justify-between mt-9">
        <EmployeeDataInfo
          name={applicant?.first_name + " " + applicant?.last_name}
          email={applicant?.email}
          id={applicant?.id}
          src={applicant?.profile_picture?.file}
        />

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
      {/* <div className="flex items-center gap-x-4 mb-8">
          <Labels label={`${applicant?.Year_of_Experience} Years`} />
          <Labels
            label={
              applicant?.current_salary ? `${jobDetails?.currency} ${formatNumber(applicant?.current_salary)}` : ""
            }
          />
          <Labels label={getCountryFullName(applicant?.location)} />
        </div> */}
      <div className="flex flex-col bg-white rounded-lg shadow border border-zinc-200 p-6 mt-8">
        <div className="text-[#111827] text-sm font-semibold whitespace-nowrap">
          Details
        </div>
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
        <ApplicantDetail label={"Applied for"} value={jobDetails?.Job_Title} />
        <ApplicantDetail
          label={"Expected Salary"}
          value={`${jobDetails?.currency} ${formatNumber(
            applicant?.expected_salary
          )}`}
        />
        <ApplicantDetail
          label={"Notice Period"}
          value={applicant?.notice_period}
        />
        <ApplicantDetail
          label={"Available for Interview"}
          value={applicant?.availability_for_interview}
        />
              <div className="mt-3">
        <h3 className="font-bold text-base text-[#323333]">Resume</h3>

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
      <div className="flex gap-4 items-center mt-4 max-w-full">
        <div className="flex flex-col leading-none min-w-[88px] text-neutral-900 w-[132px]">
          <div>{label}</div>
        </div>
        <div className="flex-1 shrink leading-5 basis-0">
          {value ?? "N/A"}
        </div>
      </div>
    </div>
  );
};

export default ViewApplicantDetails;
