import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { restart, education, money, proCheck } from "../../../../assets/images";
import { Header, Labels } from "../Sections";
import { fetchJobById } from "../../../hooks/recruitment";
import { formatNumber } from "data/Data";
import { RxCross2 } from "react-icons/rx";
import moment from "moment";
import {
  getCountryFullName,
  getEmployeeType,
  getWorkType,
  getJobType,
} from "utils/getValuesFromTables";

const JobDescription = ({ baseUrl }) => {
  const [jobDetails, setJobDetails] = useState(null);
  const searchParams = new URLSearchParams(window.location.search);
  const jobStatus = searchParams.get("status");

  const { id } = useParams();

  useEffect(() => {
    const getJobDetails = async () => {
      try {
        const data = await fetchJobById(id);
        setJobDetails(data);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };
    getJobDetails();
  }, [id]);

  console.log("jobDetails", jobDetails)

  const calculateRemainingDays = (deadline) => {
    const currentDate = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - currentDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return `${diffDays} days left`;
    } else if (diffDays < 0) {
      return ` expired ${Math.abs(diffDays)} days ago`;
    } else {
      return `Today is the deadline`;
    }
  };

  return (
    <>
      <div className="bg-[#F0F1F2] w-full">
        <Header title="Job Application" />
        <div className="p-6 relative bg-[#FAFBFC] rounded-lg shadow-sm md:mx-4 h-[90vh] overflow-y-auto hideScroll">
          <Link to="/jobs" className="absolute top-5 right-5">
            <RxCross2 className="text-xl" title="Back to Jobs" />
          </Link>
          <div className="max-w-4xl">
            <div className="mb-4">
              <span className="text-base font-lato font-normal text-baseGray">
                Job ID: {jobDetails?.id}
              </span>
              <h3 className="text-2xl font-lato font-bold text-baseGray mt-1">
                {jobDetails?.Job_Title}
              </h3>
              <div className="flex justify-between border-b border-[#DADADA] pb-4">
                <div>
                  <div className="flex items-center text-baseGray mt-1 font-lato">
                    <span>{getCountryFullName(jobDetails?.location)}</span>
                    <span className="mx-2">•</span>
                    <span>{getJobType(jobDetails?.Job_Type)}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Apply before{" "}
                    {moment(jobDetails?.Deadline).format("DD-MM-YYYY")} •{" "}
                    {calculateRemainingDays(jobDetails?.Deadline)}
                  </div>
                </div>
                <Link className="btn btn-dark d-flex items-center" to={`/apply/${jobDetails?.id}`}>
                  Apply now
                </Link>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 mb-4">
              <Labels
                label={getEmployeeType(jobDetails?.Employee_Type)}
                src={restart}
                backgroungColor={"bg-[#F0F1F2]"}
              />
              <Labels
                label={jobDetails?.Education}
                src={education}
                backgroungColor={"bg-[#F0F1F2]"}
              />
              <Labels
                label={getWorkType(jobDetails?.Work_type)}
                src={proCheck}
                backgroungColor={"bg-[#F0F1F2]"}
              />
              <Labels
                label={`${jobDetails?.currency} ${formatNumber(
                  jobDetails?.min_salary
                )} - ${formatNumber(jobDetails?.max_salary)} /month`}
                src={money}
                backgroungColor={"bg-[#F0F1F2]"}
              />
            </div>
            <div className="mb-4">
              <h4 className="text-lg font-semibold font-lato text-baseGray">
                Job Description:
              </h4>
              <p className="text-baseGray font-lato text-base mt-2">
                {jobDetails?.Job_Description}
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold font-lato text-baseGray">
                Job Requirements:
              </h4>
              <p className="text-baseGray font-lato text-base mt-2">
                {jobDetails?.Job_Requirement}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    baseUrl: state.user.baseUrl,
  };
};

export default connect(mapStateToProps)(JobDescription);
