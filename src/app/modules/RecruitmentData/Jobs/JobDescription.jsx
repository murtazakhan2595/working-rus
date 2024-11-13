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
import Newlogo from "assets/images/NewLogo.jsx";
import { Card } from "components/ui/card";
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
    <div className="main-content !pt-0 !px-0  mx-auto">
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b">
        <Newlogo className="h-8" />
        <div className="text-gray-500 text-sm">
          A Project by TecBrix
        </div>
      </div>
      <Header title={"Job Description"}/>
      <Card className="p-6 relative  rounded-lg shadow-sm md:mx-4 h-[90vh] overflow-y-auto hideScroll">
        

        <div className="max-w-4xl">
          <div className="mb-6">
            <span className="text-gray-600">
              Job ID: {jobDetails?.id}
            </span>
            <h3 className="text-xl font-semibold text-purple-600 mt-1">
              {jobDetails?.Job_Title}
            </h3>
            
            <div className="flex justify-between items-center mt-2">
              <div>
                <div className="flex items-center gap-2">
                  <span>{getCountryFullName(jobDetails?.location)}</span>
                  <span>•</span>
                  <span>{getJobType(jobDetails?.Job_Type)}</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Apply before {moment(jobDetails?.Deadline).format("DD-MM-YYYY")} • {calculateRemainingDays(jobDetails?.Deadline)}
                </div>
              </div>
              <button className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800">
                Apply Now
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
              <img src={restart} alt="" className="w-5 h-5" />
              <span>{getEmployeeType(jobDetails?.Employee_Type)}</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
              <img src={education} alt="" className="w-5 h-5" />
              <span>{jobDetails?.Education}</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
              <img src={proCheck} alt="" className="w-5 h-5" />
              <span>{getWorkType(jobDetails?.Work_type)}</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
              <img src={money} alt="" className="w-5 h-5" />
              <span>{`${jobDetails?.currency} ${formatNumber(jobDetails?.min_salary)} - ${formatNumber(jobDetails?.max_salary)} /month`}</span>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold mb-2">Job Description:</h4>
              <p className="text-gray-700">{jobDetails?.Job_Description}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Job Requirements:</h4>
              <p className="text-gray-700">{jobDetails?.Job_Requirement}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    baseUrl: state.user.baseUrl,
  };
};

export default connect(mapStateToProps)(JobDescription);
