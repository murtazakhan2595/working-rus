import React, { useState } from "react";
import { connect } from "react-redux";
import RecruitmentDataHeader from "./RecruitmentDataHeader";

const dropdownOptions = [
  "Selected",
  "Shortlisted",
  "Offer-made",
  "Onboard",
  "Declined",
  "Contacted",
  "Rejected",
];

const ApplicantsDataTable = ({ baseUrl, token }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [data, setData] = useState([
    {
      id: 1,
      name: "Moattar Ali",
      email: "moattar@example.com",
      contact: "1234567890",
      fileName: "Resume_Moattar.pdf",
      applicationStatus: "Application status",
    },
    {
      id: 2,
      name: "John Doe",
      email: "john@example.com",
      contact: "9876543210",
      fileName: "Resume_John.pdf",
      applicationStatus: "Application status",
    },
    {
      id: 3,
      name: "Alice Johnson",
      email: "alice@example.com",
      contact: "5551234567",
      fileName: "Resume_Alice.pdf",
      applicationStatus: "Application status",
    },
    {
      id: 4,
      name: "Bob Smith",
      email: "bob@example.com",
      contact: "7778889999",
      fileName: "Resume_Bob.pdf",
      applicationStatus: "Application status",
    },
    {
      id: 5,
      name: "Eva Davis",
      email: "eva@example.com",
      contact: "4445556666",
      fileName: "Resume_Eva.pdf",
      applicationStatus: "Application status",
    },
    {
      id: 6,
      name: "Charlie Brown",
      email: "charlie@example.com",
      contact: "1112223333",
      fileName: "Resume_Charlie.pdf",
      applicationStatus: "Application status",
    },
    {
      id: 7,
      name: "Grace Lee",
      email: "grace@example.com",
      contact: "9990001111",
      fileName: "Resume_Grace.pdf",
      applicationStatus: "Application status",
    },
    /* {
      id: 8,
      name: "Samuel Wilson",
      email: "samuel@example.com",
      contact: "6667778888",
      fileName: "Resume_Samuel.pdf",
      applicationStatus: "Application status",
    }, */
  ]);

  // Function to handle row selection
  const handleRowClick = (id) => {
    setSelectedRow(selectedRow === id ? null : id);
  };

  // Function to handle dropdown option selection
  const handleOptionSelect = (option) => {
    // Find the selected row in the data array
    const selectedApplicant = data.find((applicant) => applicant.id === selectedRow);

    // Update the applicationStatus for the selected row
    if (selectedApplicant) {
      selectedApplicant.applicationStatus = option;

      // Update the data state with the modified row
      setData((prevData) => {
        return prevData.map((applicant) =>
          applicant.id === selectedRow ? selectedApplicant : applicant
        );
      });
    }

    // Close the dropdown
    setSelectedRow(null);
  };

  return (
    <div className="flex w-full flex-col bg-[#F9F9F9] h-[100vh]">
      <RecruitmentDataHeader title="Senior Project Manager" />

      {/* Table */}
      <div className="px-1 py-4 md:p-3 md:py-3 lg:px-8 lg:py-5 h-[100%] overflow-x-auto overflow-y-auto max-h-[60.5vh] md:max-h-[75.5vh] lg:max-h-[70vh] xScroll">
        <table className="min-w-full">
          <thead>
            <tr className="text-baseBlue bg-[#F2F2F2] whitespace-nowrap">
              <th className="px-6 py-3 text-left rounded-tl-lg">
                Candidate Name
              </th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Contact No</th>
              <th className="px-6 py-3 text-left">Resume</th>
              <th className="px-6 py-3 text-left rounded-tr-lg">
                Application Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white text-gray-500">
            {data.map((applicant) => (
              <tr
                className={`whitespace-nowrap border-b-2 hover:bg-gray-100 ${
                  selectedRow === applicant.id ? "bg-gray-200" : ""
                }`}
                key={applicant.id}
                onClick={() => handleRowClick(applicant.id)}
              >
                <td className="px-6 py-3 text-left">{applicant.name}</td>
                <td className="px-6 py-3 text-left">{applicant.email}</td>
                <td className="px-6 py-3 text-left">{applicant.contact}</td>
                <td className="px-6 py-3 text-left">{applicant.fileName}</td>
                <td className="px-6 py-3 text-left relative cursor-pointer">
                  <span className="mr-2">{applicant.applicationStatus}</span>
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
