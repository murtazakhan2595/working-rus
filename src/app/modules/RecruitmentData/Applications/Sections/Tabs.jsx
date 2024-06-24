import React, { useState, useEffect } from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { jobIcon } from '../../../../../assets/images';
import { FaCircleArrowRight } from "react-icons/fa6";
import {
  fetchJobPosts,
} from "../../../../hooks/recruitment";
import { Labels } from "../../Sections";
import {
  workTypeOptions,
  employeeTypeOptions,
  jobTypeOptions,
  locationTypeOptions,
} from "../../../../../data/Data";

const Message = ({ message }) => {
  return (
    <div className="mt-5">
      <p className="text-center">{message}</p>
    </div>
  );
};

const JobDetails = ({ job }) => {
  if (job) {
    const employeeType = employeeTypeOptions.find(
      (obj) => obj.value === job.Employee_Type
    );
    const workType = workTypeOptions.find((obj) => obj.value === job.Work_type);
    const workLocation = locationTypeOptions.find(
      (obj) => obj.value === job.location
    );
    const jobType = jobTypeOptions.find((obj) => obj.value === job.Job_Type);
    return (
      <div className="flex flex-col justify-between gap-y-12">
        <div className="flex justify-between">
          <div className="flex items-center gap-x-2">
            <img src={jobIcon} alt="Job Icon" />
            <div>
              <p className="font-lato text-baseGray text-base">{job?.id}</p>
              <h3 className="font-lato text-[20px] text-baseGray font-bold">
                {job?.Job_Title}
              </h3>
            </div>
          </div>
          <div className="font-lato text-base text-baseGray flex items-center gap-x-2">
            <IoCalendarOutline className="text-lg" />
            {`${job?.updated_at?.slice(0, 10)} to ${job?.Deadline} `}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Labels
            label={job.status === "live" ? "Open" : "Close"}
            iconDot={true}
            iconColor={`${job.status === "live" ? "bg-green-500" : "bg-red-500"
              }`}
            backgroungColor={`${job.status === "live" ? "bg-green-100" : "bg-red-100"
              }`}
          />
          <Labels label={employeeType?.label} />
          <Labels label={workType?.label} />
          <Labels label={workLocation?.label} />
          <Labels label={jobType?.label} />
        </div>
      </div>
    );
  } else {
    return (<Message message={'No job to display'} />)
  }
};

const Tabs = ({ activeTab, onTabChange, activeJobId, changeJobFilter }) => {
  const [jobs, setJobs] = useState([]);
  const [currentJob, setCurrentJob] = useState("");
  const tabs = ["All Candidates", "Jobs"];
  const handleTabChange = (tab) => {
    if (tab === 0) {
      changeJobFilter("")
    } else if (tab === 1) {
      setCurrentJob(0);
      if (jobs && jobs.length > 0)
        changeJobFilter(jobs[0]?.id)
    }
    onTabChange(tab);
  };

  const handleJobChange = () => {
    if (jobs && currentJob === jobs.length - 1) {
      setCurrentJob(0)
      changeJobFilter(jobs[0].id)
    } else {
      const newJobIndex = currentJob + 1;
      setCurrentJob(newJobIndex)
      changeJobFilter(jobs[newJobIndex]?.id)
    }

  }

  useEffect(() => {
    const loadJob = async () => {
      try {
        const jobData = await fetchJobPosts();
        if (jobData && jobData.length > 0) {
          const index = jobData.findIndex(obj => obj.id === activeJobId);
          setCurrentJob(index ?? 0)
          setJobs(jobData)
        }
      } catch (error) {
        console.error("Error fetching job:", error);
      }
    };
    loadJob();
  }, [activeJobId]);

  const tabContents = [
    <Message message={'Showing All Applications'} />,
    <JobDetails job={jobs[currentJob]} jobIcon={jobIcon} />,
  ];

  return (
    <div className="bg-white w-full rounded-[10px] py-2 px-4 mb-2 h-[100%]">
      <div className={`flex justify-between items-center border-b pb-2`}>
        <div className="flex justify-between w-full">
          <div className="flex space-x-4">
            {tabs.map((tab, index) => {
              return (
                <button
                  key={tab}
                  className={`py-1 px-2 ${activeTab === index
                    ? "border-b-2 border-[#35B6E9] text-baseGray text-base"
                    : "text-gray-500"
                    }`}
                  onClick={() => handleTabChange(index)}
                >
                  {tab}
                </button>
              )
            })}
          </div>
          <div className="flex items-center gap-x-3">
            {activeTab === 1 && <div className="text-[#47484C] flex items-center" role="button" onClick={() => { handleJobChange() }}><span className="mr-1">Change Job </span><FaCircleArrowRight /></div>}            {/* <button className="p-2 rounded-md bg-black"><FaCircleArrowRight className="text-white" /></button> */}
          </div>
        </div>
      </div>
      <div className={`${tabContents ? "mt-4" : ""}`}>
        {tabContents ? tabContents[activeTab] : null}
      </div>
    </div>
  );
};

export default Tabs;
