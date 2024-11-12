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
import { DetailBox } from "components/SheetCardExtension";
import { DetailCard } from "components/SheetCardExtension";

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

      <DetailCard detailCardTitle="Details" date={applicant?.created_at}>
        <DetailBox label={"Phone number"} value={applicant?.phone_number} />
        <DetailBox label={"Applied for"} value={jobDetails?.Job_Title} />
        <DetailBox
          label={"Applied on"}
          value={moment(applicant?.updated_at).format("MMM D, YYYY")}
        />
        <DetailBox
          label={"Current Salary"}
          value={`${jobDetails?.currency} ${formatNumber(
            applicant?.current_salary
          )}`}
        />
        <DetailBox
          label={"Expected Salary"}
          value={`${jobDetails?.currency} ${formatNumber(
            applicant?.expected_salary
          )}`}
        />
        <DetailBox label={"Experience"} value={applicant?.Year_of_Experience} />
        <DetailBox label={"Education"} value={jobDetails?.Education} />
        <DetailBox
          label={"Notice Period"}
          value={`${applicant?.notice_period} months`}
        />
        <DetailBox
          label={"Available for Interview"}
          value={moment(applicant?.availability_for_interview).format("MMM D, YYYY")}
        />
        <div className="mt-3 flex justify-between">
          <h3 className="font-bold text-base text-[#323333]">Resume</h3>

          <div className="border rounded-lg p-2 flex justify-between items-center min-w-80">
            <div className="flex gap-x-3">
              <img src={pdfIcon} alt="" />
              <p class="text-[14px] text-[#323333]">
                {applicant?.first_name} {applicant?.last_name}
              </p>
            </div>
            <Button
              onClick={() =>
                downloadCV(
                  applicant?.cv?.file,
                  `${applicant?.first_name} ${applicant?.last_name}`
                )
              }
            >
              Download
            </Button>
          </div>
        </div>
      </DetailCard>
    </div>
  );
};

export default ViewApplicantDetails;
