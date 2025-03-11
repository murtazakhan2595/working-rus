/* eslint-disable no-unused-vars */
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import {  useNavigate, useParams } from "react-router-dom";
import { restart, education, money, proCheck } from "../../../../assets/images";
import { Header} from "../Sections";
import { fetchJobById } from "../../../hooks/recruitment";
import { formatNumber } from "utils/renderValues";
import moment from "moment";
import {
  getCountryFullName,
  getEmployeeType,
  getWorkType,
  getJobType,
} from "utils/getValuesFromTables";
import Newlogo from "assets/images/NewLogo.jsx";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
const JobDescription = ({ baseUrl }) => {
  const navigate = useNavigate()
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

    let color;
    if (diffDays <= 1) {
      color = 'text-red-300';
    } else if (diffDays <= 5) {
      color = 'text-amber-300';
    } else {
      color = 'text-emerald-300';
    }

    if (diffDays > 0) {
      return { text: `${diffDays} days left`, color };
    } else if (diffDays < 0) {
      return { text: `expired ${Math.abs(diffDays)} days ago`, color: 'text-red-500' };
    } else {
      return { text: `Today is the deadline`, color: 'text-red-500' };
    }
  };


  return (
    <div className="main-content !pt-0 !px-0  mx-auto">
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b">
        <Newlogo className="h-8" />
        <div className="text-sm text-gray-500">
          A Project by TecBrix
        </div>
      </div>
      <div className=" max-w-[800px] mx-auto">
      <Header title={"Job Description"}/>
      <Card className="p-6 relative  rounded-lg shadow-sm md:mx-4 h-[90vh] overflow-y-auto hideScroll">
        

        <div className="max-w-4xl">
          <div className="mb-6">
            <span className="text-neutral-900">
              Job ID: {jobDetails?.id}
            </span>
            <h3 className="mt-1 text-xl font-semibold text-primary">
              {jobDetails?.Job_Title}
            </h3>
            
            <div className="flex items-center justify-between mt-2">
              <div>
                <div className="flex items-center gap-2">
                  <span>{getCountryFullName(jobDetails?.location)}</span>
                  <span>•</span>
                  <span>{getJobType(jobDetails?.Job_Type)}</span>
                </div>
                <div className="mt-1 text-sm">
                  Apply before {moment(jobDetails?.Deadline).format("DD-MM-YYYY")} • 
                  <span className={`ml-1 ${calculateRemainingDays(jobDetails?.Deadline).color}`}>
                    {calculateRemainingDays(jobDetails?.Deadline).text}
                  </span>
                </div>
              </div>
              <Button 
                  onClick={() => navigate(`/apply/${jobDetails?.id}`)} // Navigate on button click
                  disabled={new Date() > new Date(jobDetails?.Deadline)} 
                >
                  Apply Now
                </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
              <img src={restart} alt="" className="w-5 h-5" />
              <span>{getEmployeeType(jobDetails?.Employee_Type)}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
              <img src={education} alt="" className="w-5 h-5" />
              <span>{jobDetails?.Education}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
              <img src={proCheck} alt="" className="w-5 h-5" />
              <span>{getWorkType(jobDetails?.Work_type)}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
              <img src={money} alt="" className="w-5 h-5" />
              <span>{`${jobDetails?.currency} ${formatNumber(jobDetails?.min_salary)} - ${formatNumber(jobDetails?.max_salary)} /month`}</span>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="mb-2 text-lg font-semibold">Job Description:</h4>
              <p className="text-neutral-900">{jobDetails?.Job_Description}</p>
            </div>
            <div>
              <h4 className="mb-2 text-lg font-semibold">Job Requirements:</h4>
              <p className="text-neutral-900">{jobDetails?.Job_Requirement}</p>
            </div>
          </div>
        </div>
      </Card>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    baseUrl: state.user.baseUrl,
  };
};

export default connect(mapStateToProps)(JobDescription);
