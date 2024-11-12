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

const ViewJobDetails = ({ jobId, onClose, isOpen, setIsOpen ,fetchJobPosts }) => {
  const [showEdit, setShowEdit] = useState(false);
  const [job, setJob] = useState(false);
  // const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false);

  const handleEditClick = () => {
    setShowEdit(true);
    // setIsOpen(false)
  };

  const handleEditClose = () => {
    getPosts();
    setShowEdit(false);
  };

  const getPosts = async () => {
    setIsLoading(true);
    try {
      const data = await getJobById(jobId);
      setJob(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, [jobId]);

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
      width="568px"
    >
      <div className="">
        {isLoading ? (
          <PageLoader />
        ) : (
          <>
              <div className="flex justify-between w-full">
                <EmployeeNameInfo
                  jobId={<EmployeeID value={job?.serial_number} />}
                  name={job?.Job_Title}
                  showPosition={false}
                  position={null}
                  date={
                    job?.created_at
                      ? moment(job?.created_at).format("MMM D, YYYY")
                      : ""
                  }
                />
                <JobsActions row={job} fetchJobPosts={fetchJobPosts} isEdit={handleEditClick}/>
              </div>
              <div className="flex gap-2 mt-4">
                <StatusLabel  status={getWorkType(job?.Work_type)}/>
                <StatusLabel  status={getJobType(job?.Job_Type)}/>
                <StatusLabel  status={getEmployeeType(job?.Employee_Type)}/>
              </div>
              {/* <Labels
                label={job?.status === "live" ? "Open" : "Close"}
                iconDot={true}
                iconColor={`${
                  job?.status === "live" ? "bg-green-500" : "bg-red-500"
                }`}
                backgroungColor={`${
                  job?.status === "live" ? "bg-green-100" : "bg-red-100"
                }`}
              /> */}
            <DetailCard detailCardTitle={"Details"} date={job?.created_at}>
              <DetailBox label="Eductation" value={job?.Education} />
              <DetailBox
                label="Start Date"
                value={
                  job?.created_at
                    ? moment(job?.created_at).format("DD-MM-YYYY")
                    : ""
                }
              />

              <DetailBox
                label="Location"
                value={getCountryFullName(job?.location)}
              />
              <DetailBox
                label="End Date"
                value={
                  job?.Deadline
                    ? moment(job?.Deadline).format("DD-MM-YYYY")
                    : ""
                }
              />
              <DetailBox
                label="Salary"
                value={`${job?.currency} ${formatNumber(
                  job?.min_salary
                )}-${formatNumber(job?.max_salary)}`}
              />
              <DetailBox label="Applications" value={job?.total_applications} />
              <DetailBox label="Status" value={<JobStatusLabel status={job?.status}/>} />
              </DetailCard>

            <DetailCard>
              <div className="text-[#111827] text-sm font-semibold whitespace-nowrap">
                Job Description
              </div>
              <p>{job?.Job_Description}</p>

              <div className="text-[#111827] text-sm font-semibold whitespace-nowrap">
                Job Requirement
              </div>
              <p>{job?.Job_Requirement}</p>
            </DetailCard>

            {/* <div className="flex justify-between items-center">
              <Link
                to="/applicants"
                state={{ jobId: job.id }}
                className="border px-3 py-2 rounded-md border-black flex items-center gap-x-2"
              >
                Applications
                <IoArrowForward className="text-xl" />
              </Link>
            </div> */}
          </>
        )}
      </div>

      {showEdit && <EditJobDetails job={job} onClose={handleEditClose} fetchJobPosts={fetchJobPosts}/>}
    </SheetComponent>
  );
};

export default ViewJobDetails;
