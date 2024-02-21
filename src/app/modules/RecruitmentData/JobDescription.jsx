import { connect } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import calender from "../../../assets/images/calendar.png";
import time from "../../../assets/images/time.png";
import pin from "../../../assets/images/pin.png";
import money from "../../../assets/images/money.png";
import suitcase from "../../../assets/images/suitcase.png";
import magistrate from "../../../assets/images/magistrate.png";
import employee from "../../../assets/images/employee.png";

const JobDescription = ({ baseUrl }) => {
  const [jobDetails, setJobDetails] = useState(null);
  const searchParams = new URLSearchParams(window.location.search);
  const jobStatus = searchParams.get("status");

  const { id } = useParams();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${baseUrl}/recruitment/${id}`);
        setJobDetails(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchPosts();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  };

  return (
    <>
      <div className="">
        <div className="border border-gray-400 px-4 xl:px-8">
          <p className="pt-4 pb-2 text-input font-sfpro text-sm md:text-base">
            Job ID: {jobDetails?.id}
          </p>
          <h1 className="text-black text-2xl font-black">
            {jobDetails?.Job_Title}
          </h1>

          {/* job details */}
          <div
            className={`mt-3 md:mt-4 flex flex-col justify-between xl:items-center xl:flex-row xl:justify-between pb-2 xl:pb-4`}
          >
            <div className="flex flex-wrap gap-x-[34px] md:flex-row md:flex-wrap gap-y-2 xl:gap-x-8">
              {/* <div className="flex flex-wrap gap-x-[33px] gap-y-2 xl:gap-x-8"> */}
              <div className="flex flex-wrap items-center gap-x-2 md:w-[30%] xl:w-auto">
                <div className="text-[28px]">
                  <img src={calender} alt="calender" className="w-7" />
                </div>
                <div className="flex items-center">
                  <div className="text-sm md:text-base">
                    {" "}
                    <p>Open: {formatDate(jobDetails?.created_at)}</p>
                    <p>Deadline: {formatDate(jobDetails?.Deadline)}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 md:w-[30%] xl:w-auto">
                <div className="text-[28px]">
                  <img src={time} alt="clock" className="w-7" />
                </div>
                <div className="flex items-center">
                  <div className="text-sm md:text-base">
                    {" "}
                    <p>{jobDetails?.Work_type}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 md:w-[30%] xl:w-auto ml-[50px] md:ml-0">
                <div className="text-[28px]">
                  <img src={pin} alt="location" className="w-7" />
                </div>
                <div className="flex items-center">
                  <div className="text-sm md:text-base">
                    {" "}
                    <address>{jobDetails?.location}</address>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 md:w-[30%] xl:w-auto">
                <div className="text-[28px]">
                  <img src={money} alt="money" className="w-7" />
                </div>
                <div className="flex items-center">
                  <div className="text-sm md:text-base">
                    {" "}
                    <p>
                      {jobDetails?.min_salary} - {jobDetails?.max_salary}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 md:w-[30%] xl:w-auto">
                <div className="text-[28px]">
                  <img src={suitcase} alt="suitcase" className="w-7" />
                </div>
                <div className="flex items-center">
                  <div className="text-sm md:text-base">
                    {" "}
                    <p>{jobDetails?.Job_Type}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center  gap-x-2 md:w-[30%] xl:w-auto">
                <div className="text-[28px]">
                  <img src={magistrate} alt="Graduate" className="w-7" />
                </div>
                <div className="flex items-center">
                  <div className="text-sm md:text-base">
                    {" "}
                    <p>{jobDetails?.Education}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center  gap-x-2 md:w-[30%] xl:w-auto ml-[25px] md:ml-0">
                <div className="text-[28px]">
                  <img src={employee} alt="employee" className="w-7" />
                </div>
                <div className="flex items-center">
                  <div className="text-sm md:text-base">
                    {" "}
                    <p>{jobDetails?.Employee_Type}</p>
                  </div>
                </div>
              </div>
            </div>
            {jobStatus === "expired" ? "" : <Link to={`/apply/${jobDetails?.id}`}>
              <div className="flex justify-center md:flex-end">
                <button className="md:w-[25%] mt-2 md:-mt-8 xl:mt-0 xl:w-full bg-baseBlue text-white px-5 py-1 rounded-md font-sfpro">
                  Apply Now
                </button>
              </div>
            </Link>}

          </div>
        </div>
        {/* job description */}
        {jobStatus === 'expired' ? <p className="text-center text-red-600 mt-10 font-semibold text-lg">
          <div
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-50"
          >
            <div className="bg-white p-5 rounded-lg shadow-lg relative w-full md:w-2/3 lg:w-1/3">
              
              <div className="flex items-center gap-x-5">
                <div className="text-6xl">
                  😔
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Job Expired! </h1>
                  </div>
                  <p className="text-left text-black mt-2 font-semibold text-lg">
                    Sorry you are late, this job is expired. For more updates, please follow the
                    <Link to="https://tecbrix.com/careers/" target="_blank" className="underline mx-2 text-baseBlue">
                      careers
                    </Link>
                    pages.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </p> : <div className="bg-[#F9F9F9] px-6 xl:px-14 overflow-y-auto max-h-[500px] h-[600px]">
          <h2 className="py-5 text-baseBlue text-xl font-semibold">
            Job Description:
          </h2>
          <p>{jobDetails?.Job_Description}</p>
          <h2 className="py-5 text-baseBlue text-xl font-semibold">
            Job Requirement:
          </h2>
          <p>{jobDetails?.Job_Requirement}</p>
        </div>
        }

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
