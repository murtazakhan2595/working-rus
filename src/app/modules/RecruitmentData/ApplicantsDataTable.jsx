import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import RecruitmentDataHeader from "./RecruitmentDataHeader";
import { useNavigate, useParams } from "react-router-dom";
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
import Blocks from "../../../components/Blocks";
import Tabs from "../../../components/Tabs";
import JobDetails from "./JobDetails";
import CandidatesList from "./CandidatesList";
import EmpDataHeader from "../../modules/Employees/Screens/Sections/Header";
import { CustomDarkButton } from "../../../components/form-control";
import {
  fetchJobById,
  fetchApplicants,
  updateApplicationStatus,
  downloadCV,
} from "../../hooks/recruitment";

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

  const navigate = useNavigate();

  useEffect(() => {
    const loadJob = async () => {
      try {
        const jobData = await fetchJobById(baseUrl, id, token);
        setPost(jobData);
      } catch (error) {
        console.error("Error fetching job:", error);
      }
    };
    loadJob();
  }, [id]);

  useEffect(() => {
    const loadApplicants = async () => {
      try {
        const applicantsData = await fetchApplicants(
          baseUrl,
          id,
          applicationStatus,
          token
        );
        setApplicants(applicantsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };
    loadApplicants();
  }, [id, applicationStatus]);

  const handleRowClick = (id) => {
    setSelectedRow(selectedRow === id ? null : id);
  };

  const handleStatusFilter = (option) => {
    setApplicationStatus(option);
  };

  const handleOptionSelect = async (option) => {
    try {
      const selectedApplicant = applicants.find(
        (applicant) => applicant.id === selectedRow
      );

      if (selectedApplicant) {
        const response = await updateApplicationStatus(
          baseUrl,
          selectedApplicant,
          option,
          token
        );

        if (response.status === 200) {
          selectedApplicant.applicationStatus = option;
          setApplicants((prevData) =>
            prevData.map((applicant) =>
              applicant.id === selectedRow ? selectedApplicant : applicant
            )
          );
          fetchApplicants(baseUrl, id, applicationStatus, token);
        } else {
          console.error("Failed to update application status");
        }
      }
      setSelectedRow(null);
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  const handleShowFilter = () => {
    setShowFilter(!showFilter);
  };

  const tabs = ["All Candidates", "Jobs"];

  const tabContents = {
    "All Candidates": <CandidatesList />,
    Jobs: <JobDetails post={post} jobIcon={jobIcon} />,
  };

  return (
    <div className="flex w-full flex-col bg-[#F0F1F2] h-[100vh]">
      <div className="flex gap-x-6 px-4 pt-4 pb">
        <div className="md:w-[45%]">
          <div className="bg-white w-full h-full rounded-[10px] p-4">
            <Tabs
              tabs={tabs}
              onTabChange={setActiveTab}
              tabContents={tabContents}
            />
          </div>
        </div>
        <div className="md:w-[55%] flex gap-2 flex-wrap">
          <Blocks
            blocks={[
              {
                label: "Total applications",
                value: "200",
                image: file,
              },
              {
                label: "Shortlisted applications",
                value: "12",
                image: list,
              },
              {
                label: "Selected applications",
                value: "12",
                image: file,
              },
              {
                label: "Rejected applications",
                value: "23",
                image: cut,
              },
            ]}
          />
        </div>
      </div>

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
