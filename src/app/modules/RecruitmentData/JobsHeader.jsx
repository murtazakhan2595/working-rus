import { MdOutlineCalendarMonth } from "react-icons/md";
import { IoMdClock } from "react-icons/io";
import { IoLocationOutline } from "react-icons/io5";
import { LiaMoneyBillWaveSolid } from "react-icons/lia";
import { PiSuitcaseThin } from "react-icons/pi";
import { FcGraduationCap } from "react-icons/fc";
import { IoPersonCircleOutline } from "react-icons/io5";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const JobsHeader = ({ token, baseUrl }) => {
  const [jobDetails, setJobDetails] = useState(null);

  const { id } = useParams();
  // Functions for calling the API
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // Fetching users
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${baseUrl}/recruitment/${id}`, {
          headers,
        });
        setJobDetails(response.data);
        console.log("Job details response by ID", response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchPosts();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
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
                  <MdOutlineCalendarMonth />
                </div>
                <div className="flex">
                  <div className="text-sm md:text-base">
                    {" "}
                    <p>Open: {formatDate(jobDetails?.created_at)}</p>
                    <p>Deadline: {formatDate(jobDetails?.Deadline)}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 md:w-[30%] xl:w-auto">
                <div className="text-[28px]">
                  <IoMdClock />
                </div>
                <div className="flex">
                  <div className="text-sm md:text-base">
                    {" "}
                    <p>{jobDetails?.Work_type}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 md:w-[30%] xl:w-auto ml-[50px] md:ml-0">
                <div className="text-[28px]">
                  <IoLocationOutline />
                </div>
                <div className="flex">
                  <div className="text-sm md:text-base">
                    {" "}
                    <address>{jobDetails?.location}</address>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 md:w-[30%] xl:w-auto">
                <div className="text-[28px]">
                  <LiaMoneyBillWaveSolid />
                </div>
                <div className="flex">
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
                  <PiSuitcaseThin />
                </div>
                <div className="flex">
                  <div className="text-sm md:text-base">
                    {" "}
                    <p>{jobDetails?.Job_Type}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center  gap-x-2 md:w-[30%] xl:w-auto">
                <div className="text-[28px]">
                  <FcGraduationCap />
                </div>
                <div className="flex">
                  <div className="text-sm md:text-base">
                    {" "}
                    <p>{jobDetails?.Education}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center  gap-x-2 md:w-[30%] xl:w-auto ml-[25px] md:ml-0">
                <div className="text-[28px]">
                  <IoPersonCircleOutline />
                </div>
                <div className="flex">
                  <div className="text-sm md:text-base">
                    {" "}
                    <p>{jobDetails?.Employee_Type}</p>
                  </div>
                </div>
              </div>
            </div>
              <Link to={`/apply/${jobDetails?.id}`}>
            <div className="flex justify-center md:flex-end">
              <button className="md:w-[25%] mt-2 md:-mt-8 xl:mt-0 xl:w-full bg-baseBlue text-white px-5 py-1 rounded-md font-sfpro">
                Apply Now
              </button>
            </div>
              </Link>
          </div>
        </div>
        {/* job description */}
        <div className="bg-[#F9F9F9] px-6 xl:px-14 overflow-y-auto max-h-[500px] h-[600px]">
          <h2 className="py-5 text-baseBlue text-xl font-semibold">
            Job Description:
          </h2>
          <p>{jobDetails?.Job_Description}</p>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    baseUrl: state.user.baseUrl,
  };
};

export default connect(mapStateToProps)(JobsHeader);
