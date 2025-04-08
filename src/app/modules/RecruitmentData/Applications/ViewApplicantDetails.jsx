import React, { useEffect, useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { formatNumber } from "utils/renderValues";
import moment from "moment";
import { RenderJobApplicationActions } from "./Sections";
import { fetchJobById, downloadCV } from "app/hooks/recruitment";
import { IoMdArrowDropdown } from "react-icons/io";
import { Button } from "components/ui/button";
import EmployeeDataInfo from "app/modules/Payroll/Sections/EmployeeDataInfo";
import {
  DetailBox,
  DisplayFile,
  DetailCard,
} from "components/SheetCardExtension";

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
    <div>
      <div className="flex justify-end gap-2">
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
      <div class="mb-4 flex items-center justify-between mt-4">
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
          value={moment(applicant?.availability_for_interview).format(
            "MMM D, YYYY"
          )}
        />
        <DetailBox label={"Reason for Rejection"} value={applicant?.reason} />
        <div className="mt-3 flex gap-24">
          <h3 className="font-bold text-base text-[#323333]">Resume</h3>
          <DisplayFile
            firstName={applicant?.first_name}
            lastName={applicant?.last_name}
            file={applicant?.cv}
          />
        </div>

        <div className="mt-3 flex gap-24">
          <h3 className="font-bold text-base text-[#323333]">Cover Letter</h3>
          <DisplayFile
            firstName={applicant?.first_name}
            lastName={applicant?.last_name}
            file={applicant?.coverletter}
          />
        </div>

      </DetailCard>
    </div>
  );
};

export default ViewApplicantDetails;
