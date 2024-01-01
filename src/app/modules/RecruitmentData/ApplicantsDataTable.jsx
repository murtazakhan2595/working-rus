import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import RecruitmentDataHeader from "./RecruitmentDataHeader";
import axios from "axios";
import { useParams } from "react-router-dom";
import { HiDownload } from "react-icons/hi";
import { dropdownOptions } from "../../../data/Data";


const ApplicantsDataTable = ({ baseUrl, token }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [post, setPost] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState("");
  const { id } = useParams();

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
      setPost(response.data.Job_Title);
    } catch (error) {
      console.error("Error fetching users:", error);
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
      setApplicants(response.data.results);
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

  const handleOptionSelect = async (option) => {
    setApplicationStatus(option);
    try {
      // Find the selected row in the data array
      const selectedApplicant = applicants.find(
        (applicant) => applicant.id === selectedRow
      );

      if (selectedApplicant) {
        console.log(selectedApplicant);
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
    <div className="flex w-full flex-col bg-[#F9F9F9] h-[100vh]">
      <RecruitmentDataHeader post={post} />

      {/* Table */}
      <div className="px-1 py-4 md:p-3 md:py-3 lg:px-8 lg:py-5 h-[100%] overflow-x-auto overflow-y-auto max-h-[60.5vh] md:max-h-[75.5vh] lg:max-h-[70vh] xScroll">
        {loading ? (
          <table className="min-w-full">
            <thead>
              <tr className="text-baseBlue bg-[#F2F2F2] whitespace-nowrap">
                <th className="px-6 py-3 text-left rounded-tl-lg">
                  <div className="w-16 h-6 bg-gray-300 rounded-md animate-pulse"></div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="w-20 h-6 bg-gray-300 rounded-md animate-pulse"></div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="w-40 h-6 bg-gray-300 rounded-md animate-pulse"></div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="w-32 h-6 bg-gray-300 rounded-md animate-pulse"></div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="w-16 h-6 bg-gray-300 rounded-md animate-pulse"></div>
                </th>
                <th className="px-6 py-3 text-left rounded-tr-lg">
                  <div className="w-16 h-6 bg-gray-300 rounded-md animate-pulse"></div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white text-gray-500">
              <tr className="whitespace-nowrap border-b-2">
                <td className="px-6 py-2">
                  <div className="w-16 h-6 bg-gray-300 rounded-md animate-pulse"></div>
                </td>
                <td className="px-6 py-2">
                  <div className="w-20 h-6 bg-gray-300 rounded-md animate-pulse"></div>
                </td>
                <td className="px-6 py-2">
                  <div className="w-40 h-6 bg-gray-300 rounded-md animate-pulse"></div>
                </td>
                <td className="px-6 py-2">
                  <div className="w-32 h-6 bg-gray-300 rounded-md animate-pulse"></div>
                </td>
                <td className="px-6 py-2">
                  <div className="w-16 h-6 bg-gray-300 rounded-md animate-pulse"></div>
                </td>
                <td className="px-6 py-2">
                  <div className="w-16 h-6 bg-gray-300 rounded-md animate-pulse"></div>
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr className="text-baseBlue bg-[#F2F2F2] whitespace-nowrap">
                <th className="px-6 py-3 text-left rounded-tl-lg">ID</th>
                <th className="px-6 py-3 text-left rounded-tl-lg">
                  Candidate Name
                </th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Contact No</th>
                <th className="px-6 py-3 text-left">Resume</th>
                <th
                  className="px-6 py-3 text-left rounded-tr-lg flex gap-x-2"
                  onClick={handleShowFilter}
                >
                  Application Status
                  <span className="text-baseBlue text-xl">&#9662;</span>
                  {showFilter && (
                    <div className="absolute right-6 top-[5px] bg-white border border-gray-300 z-10 pt-2 pb-2 rounded-xl shadow-md">
                      {dropdownOptions.map((option) => (
                        <div
                          key={option}
                          onClick={() => handleOptionSelect(option)}
                          className="cursor-pointer border-b-2 pl-2 w-[100px] hover:bg-blue-100"
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white text-gray-500">
              {applicants?.map((applicant) => (
                <tr
                  className={`whitespace-nowrap border-b-2 hover:bg-gray-100 ${
                    selectedRow === applicant.id ? "bg-gray-200" : ""
                  }`}
                  key={applicant?.id}
                >
                  <td className="px-6 py-3 text-left">{applicant?.id}</td>
                  <td className="px-6 py-3 text-left">
                    {applicant?.first_name}
                  </td>
                  <td className="px-6 py-3 text-left">{applicant?.email}</td>
                  <td className="px-6 py-3 text-left">
                    {applicant?.phone_number}
                  </td>
                  <td className="px-6 py-3 text-left">
                    <div className="flex items-center">
                      <span title={applicant?.cv}>
                        {truncateCVLink(applicant?.cv, 10)}
                      </span>
                      <a href={applicant?.cv} download>
                        <HiDownload />
                      </a>
                    </div>
                  </td>
                  <td
                    className="px-6 py-3 text-left relative cursor-pointer"
                    onClick={() => handleRowClick(applicant?.id)}
                  >
                    <span className="mr-2">
                      {applicant?.application_status}
                    </span>
                    <span className="text-gray-500">&#9662;</span>
                    {selectedRow === applicant.id && (
                      <div className="absolute left-28 bg-white border border-gray-300 z-10 pt-2 pb-2 rounded-xl shadow-md">
                        {dropdownOptions.map((option) => (
                          <div
                            key={option}
                            onClick={() => handleOptionSelect(option)}
                            className={`cursor-pointer border-b-2 pl-2 w-[125px] hover:bg-blue-100`}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
