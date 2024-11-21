import { useEffect } from "react";
import {
  getCountryFullName,
  getEmployeeType,
  getWorkType,
  getJobType,
} from "utils/getValuesFromTables";
import { useState } from "react";
import EditJobDetails from "./EditJobDetails";
import { getJobById } from "app/hooks/recruitment";
import { PageLoader } from "components";
import { formatNumber } from "data/Data";
import moment from "moment";
import SheetComponent from "components/ui/SheetComponent";
import { DetailBox } from "components/SheetCardExtension";
import { EmployeeNameInfo } from "components";
import { EmployeeID } from "utils/getValuesFromTables";
import JobsActions from "./JobsActions";
import { StatusLabel } from "components";
import { JobStatusLabel } from "components/StatusLabel";
import { DetailCard } from "components/SheetCardExtension";
import { Button } from "components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ViewJobDetails = ({ job, onClose, isOpen, setIsOpen ,fetchJobPosts, posts }) => {
  const [showEdit, setShowEdit] = useState(false);
  const [viewJob, setViewJob] = useState(job)
  const [currentJob, setCurrentJob] = useState(posts?.results?.findIndex((p) => p.id === job?.id)); 
  const [isLoading, setIsLoading] = useState(false);

  const handleEditClick = () => {
    setShowEdit(true);
    // setIsOpen(false)
  };

  const handleEditClose = () => {
    // getPosts();
    setShowEdit(false);
  };

  

  const handleNexJob = () => {
    const nextIndex = (currentJob + 1) % posts?.results?.length; 
    setCurrentJob(nextIndex);
    setViewJob(posts?.results[nextIndex]);
  };

  const handlePreviousJob = () => {
    const previousIndex = (currentJob - 1 + posts?.results?.length) % posts?.results?.length; 
    setCurrentJob(previousIndex);
    setViewJob(posts?.results[previousIndex]);
  };

  const formSheetData = {
    triggerText: null,
    title: "Jobs",

    description: null,
    footer: null,
  };

  return (
    <SheetComponent
      {...formSheetData}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      
    >
      <div className="">
        {isLoading ? (
          <PageLoader />
        ) : (
          <>
          <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handlePreviousJob}> <ChevronLeft/> Previous</Button>
          <Button variant="outline" onClick={handleNexJob}>Next <ChevronRight/> </Button>
          </div>
              <div className="flex justify-between w-full">
                <EmployeeNameInfo
                  jobId={<EmployeeID value={job?.serial_number} />}
                  name={viewJob?.Job_Title}
                  showPosition={false}
                  position={null}
                  date={
                    job?.created_at
                      ? moment(viewJob?.created_at).format("MMM D, YYYY")
                      : ""
                  }
                />
                <JobsActions row={viewJob} fetchJobPosts={fetchJobPosts} isEdit={handleEditClick}/>
              </div>
              <div className="flex gap-2 mt-4">
                <StatusLabel  status={getWorkType(viewJob?.Work_type)}/>
                <StatusLabel  status={getJobType(viewJob?.Job_Type)}/>
                <StatusLabel  status={getEmployeeType(viewJob?.Employee_Type)}/>
              </div>
            <DetailCard detailCardTitle={"Details"} date={viewJob?.created_at}>
              <DetailBox label="Eductation" value={viewJob?.Education} />
              <DetailBox
                label="Start Date"
                value={
                  viewJob?.created_at
                    ? moment(viewJob?.created_at).format("DD-MM-YYYY")
                    : ""
                }
              />

              <DetailBox
                label="Location"
                value={getCountryFullName(viewJob?.location)}
              />
              <DetailBox
                label="End Date"
                value={
                  job?.Deadline
                    ? moment(viewJob?.Deadline).format("DD-MM-YYYY")
                    : ""
                }
              />
              <DetailBox
                label="Salary"
                value={`${viewJob?.currency} ${formatNumber(
                  viewJob?.min_salary
                )}-${formatNumber(viewJob?.max_salary)}`}
              />
              <DetailBox label="Applications" value={viewJob?.total_applications} />
              <DetailBox label="Status" value={<JobStatusLabel status={viewJob?.status}/>} />
              </DetailCard>

            <DetailCard>
              <div className="text-[#111827] text-sm font-semibold whitespace-nowrap">
                Job Description
              </div>
              <p>{viewJob?.Job_Description}</p>

              <div className="text-[#111827] text-sm font-semibold whitespace-nowrap">
                Job Requirement
              </div>
              <p>{viewJob?.Job_Requirement}</p>
            </DetailCard>

            {/* <div className="flex items-center justify-between">
              <Link
                to="/applicants"
                state={{ jobId: job.id }}
                className="flex items-center px-3 py-2 border border-black rounded-md gap-x-2"
              >
                Applications
                <IoArrowForward className="text-xl" />
              </Link>
            </div> */}
          </>
        )}
      </div>

      {showEdit && <EditJobDetails job={viewJob} onClose={handleEditClose} fetchJobPosts={fetchJobPosts}/>}
    </SheetComponent>
  );
};

export default ViewJobDetails;
