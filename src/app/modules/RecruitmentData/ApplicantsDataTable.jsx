import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import RecruitmentDataHeader from "./RecruitmentDataHeader";
import axios from "axios";
import { useParams } from "react-router-dom";
import { HiDownload } from "react-icons/hi";
import { dropdownOptions, filterDropdownOptions } from "../../../data/Data";
import Loader from "../../../components/Loader";
import {
  IoArrowForwardCircle,
  IoCalendarOutline,
  IoFilter,
} from "react-icons/io5";
import cut from "../../../assets/images/cut.png";
import file from "../../../assets/images/file.png";
import list from "../../../assets/images/list.png";
import { AiOutlineDownload } from "react-icons/ai";
import { FaCaretDown } from "react-icons/fa";
import jobIcon from "../../../assets/images/jobIcon.png";

const ApplicantsDataTable = ({ baseUrl, token }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [post, setPost] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState("");
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("candidates");
  const [job, setJob] = useState(null);

  // fetch applicants
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // Fetching posts by id
  const fetchJob = async () => {
    try {
      const response = await axios.get(`${baseUrl}/recruitment/${id}`, {
        headers,
      });
      setPost(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  //download cv
  const downloadCV = async (cv, name) => {
    try {
      const response = await axios.get(cv, {
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "application/pdf" });

      const url = window.URL.createObjectURL(blob);

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;

      // Set the download attribute to the desired file name
      link.download = `${name}_cv.pdf`; // You can adjust the file name accordingly

      // Append the link to the document
      document.body.appendChild(link);

      // Programmatically trigger a click on the link to initiate the download
      link.click();

      // Remove the link from the document
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error fetching CV:", error);
    }
  };
  // Fetching users
  const fetchApplicants = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/candidateall/?search=${encodeURIComponent(
          `{"application_status": "${applicationStatus}", "job_id": ${id}}`
        )}`,
        {
          headers,
        }
      );
      setApplicants(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchJob();
  }, []);

  useEffect(() => {
    fetchApplicants();
  }, [id, applicationStatus]);

  // update status

  // truncate cv link
  const truncateCVLink = (cvLink, maxLength) => {
    return cvLink.length > maxLength
      ? cvLink.substring(0, maxLength) + "..."
      : cvLink;
  };

  // Function to handle row selection
  const handleRowClick = (id) => {
    setSelectedRow(selectedRow === id ? null : id);
  };

  const handleStatusFilter = async (option) => {
    setApplicationStatus(option);
  };

  const handleOptionSelect = async (option) => {
    try {
      // Find the selected row in the data array
      const selectedApplicant = applicants.find(
        (applicant) => applicant.id === selectedRow
      );

      if (selectedApplicant) {
        const response = await axios.patch(
          `${baseUrl}/candidate/${selectedApplicant.id}`,
          {
            application_status: option,
            first_name: selectedApplicant.first_name,
            last_name: selectedApplicant.last_name,
            phone_number: selectedApplicant.phone_number,
            email: selectedApplicant.email,
            cv: selectedApplicant.cv,
            job_id: selectedApplicant.job_id,
          },
          {
            headers,
          }
        );

        // Check if the request was successful
        if (response.status === 200) {
          // Update the applicationStatus for the selected row in the local state
          selectedApplicant.applicationStatus = option;

          // Update the data state with the modified row
          setApplicants((prevData) =>
            prevData.map((applicant) =>
              applicant.id === selectedRow ? selectedApplicant : applicant
            )
          );

          fetchApplicants();
        } else {
          console.error("Failed to update application status");
        }
      }

      // Close the dropdown
      setSelectedRow(null);
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  // show filter

  const handleShowFilter = () => {
    setShowFilter(!showFilter);
  };

  return (
    <div className="flex w-full flex-col bg-[#F0F1F2] h-[100vh]">
      {/* <RecruitmentDataHeader post={post} /> */}

      <div className="flex gap-x-6 p-4">
        <div className="md:w-[45%]">
          <div className="bg-white w-full h-full rounded-[10px] p-4">
            <div className="flex justify-between items-center border-b border-[#F0F1F2]">
              <div className="flex space-x-4">
                <button
                  className={`py-2 px-4 ${
                    activeTab === "candidates"
                      ? "border-b-2 border-[#35B6E9] text-baseGray font-lato text-base"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("candidates")}
                >
                  All Candidates
                </button>
                <button
                  className={`py-2 px-4 ${
                    activeTab === "jobs"
                      ? "border-b-2 border-[#35B6E9] text-baseGray font-lato text-base"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("jobs")}
                >
                  Jobs
                </button>
              </div>
              <button className="py-2 px-4 text-[#323333] font-lato text-sm flex items-center gap-x-2">
                Change Job
                <IoArrowForwardCircle className="text-xl" />
              </button>
            </div>
            <div className="mt-4">
              {activeTab === "candidates" && (
                <div>
                  {/* Candidates content here */}
                  <p>List of all candidates...</p>
                </div>
              )}
              {activeTab === "jobs" && (
                <div className="flex flex-col justify-between gap-y-10">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-x-2">
                      <img src={jobIcon} alt="" />
                      <div>
                        <p className="font-lato text-baseGray text-base">
                          {post.id}
                        </p>
                        <h3 className="font-lato text-[20px] text-baseGray font-bold">
                          {post.Job_Title}
                        </h3>
                      </div>
                    </div>
                    <div className="font-lato text-base text-baseGray flex items-center gap-x-2">
                      <IoCalendarOutline className="text-lg" />
                      {`${post.updated_at?.slice(0, 10)} to ${post.Deadline} `}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div
                      className={`flex items-center text-baseGray font-lato text-base font-normal rounded-2xl px-2 ${
                        post.status === "Live" ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      <span
                        className={`w-3 h-3 rounded-full mr-2 ${
                          post.status === "Live" ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></span>
                      {post.status}
                    </div>
                    <div
                      className="text-baseGray font-lato text-base font-normal bg-[#E6E9F0] rounded-2xl
                    px-2"
                    >
                      {post.Employee_Type}
                    </div>
                    <div
                      className="text-baseGray font-lato text-base font-normal bg-[#E6E9F0] rounded-2xl
                      px-2"
                    >
                      {post.Work_type}
                    </div>
                    <div
                      className="text-baseGray font-lato text-base font-normal bg-[#E6E9F0] rounded-2xl
                      px-2"
                    >
                      {post.location}
                    </div>
                    <div
                      className="text-baseGray font-lato text-base font-normal bg-[#E6E9F0] rounded-2xl
                      px-2"
                    >
                      {post.Job_Type}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="md:w-[55%] flex">
          <div className="flex flex-wrap md:flex-nowrap">
            <div className="md:w-1/2 w-full p-2">
              <div className="flex flex-col space-y-3">
                <div className="flex flex-col">
                  <div className="flex gap-x-3 items-center bg-[#FAFBFC] px-3 py-4 rounded-[20px] w-72">
                    <img src={file} alt="Image 1" />
                    <div>
                      <h2 className="text-lato text-[14px] text-baseGray font-normal">
                        Total applications
                      </h2>
                      <h1 className="text-lato text-2xl text-[#323333] font-normal">
                        50
                      </h1>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-3">
                  <div className="flex gap-x-3 items-center bg-[#FAFBFC] px-3 py-4 rounded-[20px] w-72">
                    <img src={file} alt="Image 1" />
                    <div>
                      <h2 className="text-lato text-[14px] text-baseGray font-normal">
                        Selected applications
                      </h2>
                      <h1 className="text-lato text-2xl text-[#323333] font-normal">
                        200
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap md:flex-nowrap">
            <div className="md:w-1/2 w-full p-2">
              <div className="flex flex-col space-y-3">
                <div className="flex flex-col">
                  <div className="flex gap-x-3 items-center bg-[#FAFBFC] px-3 py-4 rounded-[20px] w-72">
                    <img src={list} alt="Image 1" />
                    <div>
                      <h2 className="text-lato text-[14px] text-baseGray font-normal">
                        Shortlisted applications
                      </h2>
                      <h1 className="text-lato text-2xl text-[#323333] font-normal">
                        12
                      </h1>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-3">
                  <div className="flex gap-x-3 items-center bg-[#FAFBFC] px-3 py-4 rounded-[20px] w-72">
                    <img src={cut} alt="Image 1" />
                    <div>
                      <h2 className="text-lato text-[14px] text-baseGray font-normal">
                        Rejected applications
                      </h2>
                      <h1 className="text-lato text-2xl text-[#323333] font-normal">
                        07
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="px-1 py-4 md:p-3 md:py-3 lg:px-8 lg:py-5 h-[100%] overflow-x-auto overflow-y-auto max-h-[60.5vh] md:max-h-[75.5vh] lg:max-h-[70vh] xScroll">
        <table className="min-w-full">
          <thead>
            <tr className=" bg-[#EBECED] whitespace-nowrap font-lato text-base font-normal text-[#323333]">
              <th className="px-6 py-3 text-left rounded-tl-lg">
                Candidate ID
              </th>
              <th className="px-4 py-3 text-left rounded-tl-lg">Candidate</th>
              <th className="px-4 py-3 text-left">Phone no/Email</th>
              <th className="px-4 py-3 text-left">Current Salary</th>
              <th className="px-4 py-3 text-left">Expected Salary</th>
              <th className="px-4 py-3 text-left">Applied On</th>
              <th className="px-4 py-3 text-left">Resume</th>
              <th
                className="px-6 py-3 text-left rounded-tr-lg flex items-center gap-x-2 relative"
                onClick={handleShowFilter}
              >
                Status
                <span className="text-baseBlue text-xl">
                  <IoFilter />
                </span>
                {showFilter && (
                  <div className="absolute right-3 top-[34px] bg-white border border-gray-300 z-10 pt-2 pb-2 rounded-xl shadow-md">
                    {filterDropdownOptions.map((option) => (
                      <div
                        key={option.label}
                        onClick={() => handleStatusFilter(option.value)}
                        className="cursor-pointer border-b-2 pl-2 w-[100px] hover:bg-blue-100"
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </th>
            </tr>
          </thead>
          {loading ? (
            <Loader />
          ) : (
            <tbody className="bg-white text-gray-500">
              {applicants?.map((applicant) => (
                <tr
                  className={`whitespace-nowrap border-b-2 hover:bg-gray-100 ${
                    selectedRow === applicant.id ? "bg-gray-200" : ""
                  }`}
                  key={applicant?.id}
                >
                  <td className="px-4 py-2 text-left text-[#5c5e64] opacity-80">
                    {applicant?.id}
                  </td>
                  <td className="px-4 py-2 text-left flex flex-col gap-y-2">
                    <div className="font-lato text-base text-[#323333]">
                      {applicant?.first_name}
                    </div>
                    <div className="font-lato text-base text-baseGray">
                      {`Exp. ${applicant?.Year_of_Experience} years`}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-left">
                    <div className="font-lato text-base text-[#323333]">
                      {applicant?.email}
                    </div>
                    <div className="font-lato text-base text-baseGray">
                      {applicant?.phone_number}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-left">
                    {applicant?.current_salary}
                  </td>
                  <td className="px-6 py-3 text-left">
                    {applicant?.expected_salary}
                  </td>
                  <td className="px-4 py-2 text-left text-[#5c5e64] opacity-80">
                    {applicant?.updated_at.slice(0, 10)}
                  </td>
                  <td className="px-4 py-3 text-left">
                    <div className="flex gap-x-2 items-center">
                      <span
                        title={applicant?.cv}
                        className="font-lato text-base text-baseGray"
                      >
                        File
                      </span>
                      <button
                        onClick={() =>
                          downloadCV(applicant?.cv, applicant?.first_name)
                        }
                      >
                        <AiOutlineDownload />
                      </button>
                    </div>
                  </td>
                  <td
                    className="px-6 py-3 text-left relative cursor-pointer"
                    onClick={() => handleRowClick(applicant?.id)}
                  >
                    <span className="text-gray-500 flex gap-x-1 items-center justify-center">
                      {applicant?.application_status}
                      <FaCaretDown />
                    </span>

                    {selectedRow === applicant.id && (
                      <div className="absolute right-0 bg-white border border-gray-300 z-10 pt-2 pb-2 rounded-xl shadow-md">
                        {dropdownOptions.map((option) => (
                          <div
                            key={option.label}
                            onClick={() => handleOptionSelect(option.value)}
                            className={`cursor-pointer border-b-2 pl-2 w-[125px] hover:bg-blue-100`}
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    baseUrl: state.user.baseUrl,
  };
};

export default connect(mapStateToProps)(ApplicantsDataTable);
