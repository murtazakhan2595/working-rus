import React, { useEffect } from "react";
import { IoCalendarOutline } from "react-icons/io5";

import { fetchJobPosts } from "../../../../hooks/recruitment";
import { JobStatusLabel } from "../../../../../components/StatusLabel";
import {
  getEmployeeType,
  getWorkType,
  getJobType,
  getWorkLocation,
} from "utils/getValuesFromTables";
import moment from "moment";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "../../../../../src/@/components/ui/tabs";

import { Button } from "components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Message = ({ message }) => {
  return (
    <div className="mt-5">
      <p className="text-center">{message}</p>
    </div>
  );
};

export const JobDetails = ({ job, handleJobChange, jobs }) => {
  if (job) {
    const employeeType = getEmployeeType(job.Employee_Type);
    const workType = getWorkType(job.Work_type);
    const workLocation = getWorkLocation(job.location);
    const jobType = getJobType(job.Job_Type);

    const formattedUpdatedAt = job?.updated_at
      ? moment(job?.updated_at).format("DD MMMM YYYY")
      : "N/A";
    const formattedDeadline = job?.Deadline
      ? moment(job?.Deadline).format("DD MMMM YYYY")
      : "N/A";


    return (
      <div className="">
        <div className="">
          <div className="flex flex-col gap-4">
            {/* <img src={jobIcon} alt="Job Icon" /> */}
            <h3 className="text-primary h6">{job?.Job_Title}</h3>
            <p className="text-sm text-neutral-1200">Job Id: {job?.id}</p>
            <div className="flex items-center gap-3 text-base">
              <IoCalendarOutline className="text-lg" />
              {`${formattedUpdatedAt} - ${formattedDeadline} `}
            </div>
              <div className="flex gap-3">
                <JobStatusLabel
                  label={job.status === "live" ? "Open" : "Close"}
                  type="status"
                />
                <JobStatusLabel
                  label={employeeType}
                  type="employeeType"
                />
                <JobStatusLabel
                  label={workType}
                  type="workType"
                />
                <JobStatusLabel
                  label={workLocation}
                  type="workLocation"
                />
                <JobStatusLabel
                  label={jobType}
                  type="jobType"
                />
              </div>
                <div className="flex justify-start w-full gap-3">
                <Button
                  disabled={jobs[0]?.id === job?.id}
                  onClick={() => handleJobChange(true)}
                  variant="outline"
                >
                  <ChevronLeft /> Previous
                </Button>
                <Button variant="outline" onClick={() => handleJobChange(false)}>
                  Next <ChevronRight />
                </Button>
              </div>
            
          </div>
        </div>

      </div>



    );
  } else {
    return <Message message={"No job to display"} />;
  }
};

const TabComponent = ({
  onTabChange,
  activeTab,
  activeJobId,
  changeJobFilter,
  setActiveTab,
  jobs,
  setJobs,
  setCurrentJob,
}) => {
  const tabs = ["All Candidates", "Jobs"];


  const handleTabChange = (tab) => {
    if (tab === 0) {
      changeJobFilter("");
    } else if (tab === 1) {
      setCurrentJob(0);
      if (jobs && jobs.length > 0) changeJobFilter(jobs[0]?.id);
    }
    onTabChange(tab);
  };

  useEffect(() => {
    const loadJob = async () => {
      try {
        const jobData = await fetchJobPosts();
        if (jobData.results && jobData.results.length > 0) {
          const index = jobData.results.findIndex(
            (obj) => obj.id === activeJobId
          );
          setCurrentJob(index ?? 0);
          setJobs(jobData.results);
        }
      } catch (error) {
        console.error("Error fetching job:", error);
      }
    };
    loadJob();
  }, [activeJobId]);

  return (
    <div className="flex justify-between">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex justify-center mb-4">
          {tabs?.map((tab, index) => (
            <TabsTrigger
              key={index}
              value={index}
              onClick={() => handleTabChange(index)}
              className="data-[state=active]:bg-primary-200 w-28 data-[state=active]:text-primary-1100 rounded-sm data-[state-active]:font-medium"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div></div>
    </div>
  );
};

export default TabComponent;
