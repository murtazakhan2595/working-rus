import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { connect } from "react-redux";
import { RxCrossCircled } from "react-icons/rx";
import { IoMdDownload } from "react-icons/io";

const ViewEmployee = ({ token, baseUrl }) => {
  const [data, setData] = useState("");
  const [educations, setEducations] = useState([{}]);
  const [certifications, setCertifications] = useState([{}]);
  const [experiences, setExperiences] = useState([{}]);
  const [profileImage, setProfileImage] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  console.log(educations, "loged education");

  const fetchData = async () => {
    try {
      // Fetch employee data
      const employeeResponse = await axios.get(`${baseUrl}/emp/${id}`, {
        headers,
      });
      console.log('employee', employeeResponse)
      const employeeData = employeeResponse.data;
      setData(employeeData);
      setProfileImage(employeeResponse.data?.profile_picture.file || employeeResponse.data?.profile_picture);

      // Fetch experiences data
      const experiencesResponse = await axios.get(
        `${baseUrl}/experience/?search={"employee_id":${id}}`,
        { headers }
      );
      const experiencesData = experiencesResponse.data;
      setExperiences(experiencesData);

      // Fetch certification data
      const certificationResponse = await axios.get(
        `${baseUrl}/certification/?search={"employee_id":${id}}`,
        { headers }
      );
      const certificationData = certificationResponse.data;
      setCertifications(certificationData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    // Assuming both educationData and acadamicDocument are arrays

    // Fetch education data
    const educationResponse = await axios.get(
      `${baseUrl}/education/?search={"employee_id":${id}}`,
      { headers }
    );
    const educationData = educationResponse.data;
    // setEducations(educationData);

    // get education documents
    const docResponse = await axios.get(
      `${baseUrl}/attachment/?search={"employee_id":${id},"name":"acadmicDoc"}`,
      {
        headers,
      }
    );
    const docRes = docResponse.data[0];
    let acadamicDocument = docRes;

    // Combine educationData with acadamicDocument
    const educationAndAcadDocs = educationData.map((educationItem) => ({
      ...educationItem,
      acadamicDocument,
    }));

    // console.log(combinedData, "combine data");
    setEducations(educationAndAcadDocs);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const downloadAttachment = async (file, name) => {
    try {
      const response = await axios.get(file, {
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "application/pdf" });

      const url = window.URL.createObjectURL(blob);
      console.log("Content-Type:", response.headers["content-type"]);

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

  return (
    <div className="w-full overflow-x-auto overflow-y-auto max-h-[100vh] roundScroll md:px-4 xl:px-8">
      {/* image */}
      <div className="flex items-center gap-x-8 bg-[#f9f9f9] px-4 lg:px-10 py-4 border border-[#707070] relative">
        <div
          className="w-24 h-24 rounded-full bg-white text-[#555657] text-3xl font-semibold flex 
        justify-center items-center"
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt={`${data.first_name} ${data.last_name}'s Picture`}
              style={{ width: "100px", height: "100px", borderRadius: "50%" }}
            />
          ) : (
            <>
              {data.first_name?.toUpperCase().slice(0, 1)}
              {data.last_name?.toUpperCase().slice(0, 1)}
            </>
          )}
        </div>

          <div className="absolute top-2 right-3 bg-gray-200 rounded-full text-gray-400 cursor-pointer" onClick={() => navigate("/employees")}>
            <RxCrossCircled />
          </div>
        <div className="flex flex-col">
          <div className="text-gray-400 text-sm">
            <span>Employee ID:</span> TXB-{id.toString().padStart(4, "0")}
          </div>
          <div className="text-2xl font-black">{`${data.first_name} ${data.last_name}`}</div>
          <div className="text-2xl font-bold">{data.department_position}</div>
        </div>
      </div>
      {/* Personal Information */}
      <div className="text-baseBlue text-xl font-extrabold py-2 px-3 my-4 border border-[#707070]">
        Personal Information
      </div>
      {/* data */}
      <div className="">
        <div className="flex">
          <div className="w-[40%] xl:w-[24%] px-4 py-2 text-left font-bold border border-r-gray-400 text-[#555657]">
            First Name
          </div>
          <div className="w-[60%] xl:w-[76%] px-4 py-2 text-left border text-gray-500">
            {data.first_name}
          </div>
        </div>
        <div className="flex">
          <div className="w-[40%] xl:w-[24%] px-4 py-2 text-left font-bold border border-r-gray-400 text-[#555657]">
            Last Name
          </div>
          <div className="w-[60%] xl:w-[76%] px-4 py-2 text-left border text-gray-500">
            {data.last_name}
          </div>
        </div>
        <div className="flex">
          <div className="w-[40%] xl:w-[24%] px-4 py-2 text-left font-bold border border-r-gray-400 text-[#555657]">
            Date of Birth
          </div>
          <div className="w-[60%] xl:w-[76%] px-4 py-2 text-left border text-gray-500">
            {data.date_of_birth ? data.date_of_birth : ""}
          </div>
        </div>
        <div className="flex">
          <div className="w-[40%] xl:w-[24%] px-4 py-2 text-left font-bold border border-r-gray-400 text-[#555657]">
            Permanent Address
          </div>
          <div className="w-[60%] xl:w-[76%] px-4 py-2 text-left border text-gray-500">
            {" "}
            {data.residential_address ? data.residential_address : ""}
          </div>
        </div>
        <div className="flex">
          <div className="w-[40%] xl:w-[24%] px-4 py-2 text-left font-bold border border-r-gray-400 text-[#555657]">
            Current Address
          </div>
          <div className="w-[60%] xl:w-[76%] px-4 py-2 text-left border text-gray-500">
            {" "}
            {data.current_address ? data.current_address : ""}
            {data.current_country ? data.current_country : ""}
          </div>
        </div>
        <div className="flex lg:hidden">
          <div className="w-[40%] xl:w-[24%] px-4 py-2 text-left font-bold border border-r-gray-400 text-[#555657]">
            National
          </div>
          <div className="w-[60%] xl:w-[76%] px-4 py-2 text-left border text-gray-500">
            {" "}
            {data.place_of_birth ? data.place_of_birth : ""}
          </div>
        </div>
        <div className="flex lg:hidden">
          <div className="w-[40%] xl:w-[24%] px-4 py-2 text-left font-bold border border-r-gray-400 text-[#555657]">
            Marital Status
          </div>
          <div className="w-[60%] xl:w-[76%] px-4 py-2 text-left border text-gray-500">
            {" "}
            {data.marital_status ? data.marital_status : ""}
          </div>
        </div>
        <div className="flex">
          <div className="w-[40%] xl:w-[24%] px-4 py-2 text-left font-bold border border-r-gray-400 text-[#555657]">
            Mobile Number
          </div>
          <div className="w-[60%] xl:w-[76%] text-left border text-gray-500 flex">
            {" "}
            <div className="xl:border xl:border-r-gray-400 px-4 py-2 lg:w-[350px]">
              {" "}
              {data.mobile_no ? data.mobile_no : ""}
            </div>
            <div className="lg:block hidden">
              {" "}
              {
                <div className="flex">
                  <div className="px-4 py-2 text-left font-bold border border-r-gray-400 text-[#555657] lg:w-32">
                    Nationality
                  </div>
                  <div className="px-4 py-2 text-lef">
                    {" "}
                    {data.place_of_birth ? data.place_of_birth : ""}
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="w-[40%] xl:w-[24%] px-4 py-2 text-left font-bold border border-r-gray-400 text-[#555657]">
            Email
          </div>
          <div className="w-[60%] xl:w-[76%] text-left border text-gray-500 flex">
            {" "}
            <div className="xl:border xl:border-r-gray-400 px-4 py-2 lg:w-[350px]">
              {" "}
              {data.email ? data.email : ""}
            </div>
            <div className="hidden lg:block">
              {" "}
              {
                <div className="flex">
                  <div className="px-4 py-2 text-left font-bold border border-r-gray-400 text-[#555657] lg:w-32">
                    Marital Status
                  </div>
                  <div className="px-4 py-2 text-left">
                    {" "}
                    {data.marital_status ? data.marital_status : ""}
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="w-[40%] xl:w-[24%] px-4 py-2 text-left font-bold border border-r-gray-400 text-[#555657]">
            Emergency Contact
          </div>
          <div className="w-[60%] xl:w-[76%] text-left border text-gray-500 flex">
            {" "}
            <div className="xl:border xl:border-r-gray-400 px-4 py-2 lg:w-[350px]">
              {" "}
              {data.emergency_phone_no ? data.emergency_phone_no : ""}
            </div>
            <div className="hidden lg:block">
              {" "}
              {
                <div className="flex">
                  <div className="px-4 py-2 text-left font-bold border border-r-gray-400 text-[#555657] lg:w-32">
                    Relation
                  </div>
                  <div className="px-4 py-2 text-left">
                    {" "}
                    {data.emergency_relation ? data.emergency_relation : ""}
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="w-[40%] xl:w-[24%] px-4 py-2 text-left font-bold border border-r-gray-400 text-[#555657]">
            Emergency Contact Name
          </div>
          <div className="w-[60%] xl:w-[76%] px-4 py-2 text-left border text-gray-500">
            {" "}
            {`${data.emergency_first_name ? data.emergency_first_name : ""} ${
              data.emergency_last_name
            }`}
          </div>
        </div>
        <div className="flex lg:hidden">
          <div className="w-[40%] xl:w-[24%] px-4 py-2 text-left font-bold border border-r-gray-400 text-[#555657]">
            Relation
          </div>
          <div className="w-[60%] xl:w-[76%] px-4 py-2 text-left border text-gray-500">
            {" "}
            {data.emergency_relation ? data.emergency_relation : ""}
          </div>
        </div>
      </div>

      {/* Banking Information */}
      <div className="text-baseBlue text-xl font-extrabold  py-2 px-3 my-4 border border-gray-400">
        Banking Information
      </div>
      {/* data */}
      <div className="">
        <div className="flex">
          <div className="w-[40%] xl:w-[24%] px-4 py-2 text-left font-bold border border-r-gray-400 text-[#555657]">
            Bank Name
          </div>
          <div className="w-[60%] xl:w-[76%] px-4 py-2 text-left border text-gray-500">
            {data.bank_name ? data.bank_name : ""}
          </div>
        </div>
        <div className="flex">
          <div className="w-[40%] xl:w-[24%] px-4 py-2 text-left font-bold border border-r-gray-400 text-[#555657]">
            Account Title
          </div>
          <div className="w-[60%] xl:w-[76%] px-4 py-2 text-left border text-gray-500">
            {data.account_title ? data.account_title : ""}
          </div>
        </div>
        <div className="flex">
          <div className="w-[40%] xl:w-[24%] px-4 py-2 text-left font-bold border border-r-gray-400 text-[#555657]">
            Account Number
          </div>
          <div className="w-[60%] xl:w-[76%] px-4 py-2 text-left border text-gray-500">
            {data.account_number ? data.account_number : ""}
          </div>
        </div>
        <div className="flex">
          <div className="w-[40%] xl:w-[24%] px-4 py-2 text-left font-bold border border-r-gray-400 text-[#555657]">
            IBAN
          </div>
          <div className="w-[60%] xl:w-[76%] px-4 py-2 text-left border text-gray-500">
            {data.account_iban ? data.account_iban : ""}
          </div>
        </div>
        <div className="flex lg:hidden">
          <div className="w-[40%] xl:w-[24%] px-4 py-2 text-left font-bold border border-r-gray-400 text-[#555657]">
            Branch Code
          </div>
          <div className="w-[60%] xl:w-[76%] px-4 py-2 text-left border text-gray-500">
            {data.branch_code ? data.branch_code : ""}
          </div>
        </div>
        <div className="flex">
          <div className="w-[40%] xl:w-[24%] px-4 py-2 text-left font-bold border border-r-gray-400 text-[#555657]">
            Branch Address
          </div>
          <div className="w-[60%] xl:w-[76%] px-4 py-2 text-left border text-gray-500">
            {data.branch_address ? data.branch_address : ""}
          </div>
        </div>
        <div className="flex">
          <div className="w-[40%] xl:w-[24%] px-4 py-2 text-left font-bold border border-r-gray-400 text-[#555657]">
            Swift Code
          </div>
          <div className="w-[60%] xl:w-[76%] px-4 py-2 text-left border text-gray-500">
            {data.swift_code ? data.swift_code : ""}
          </div>
        </div>
        <div className="flex">
          <div className="w-[40%] xl:w-[24%] px-4 py-2 text-left font-bold border border-r-gray-400 text-[#555657]">
            Branch Address
          </div>
          <div className="w-[60%] xl:w-[76%] text-left border text-gray-500 flex">
            {" "}
            <div className="lg:border lg:border-r-gray-400 px-4 py-2 w-[400px]">
              {" "}
              {data.branch_address ? data.branch_address : ""}
            </div>
            <div className="hidden lg:block">
              {" "}
              {
                <div className="flex">
                  <div className="px-4 py-2 text-left font-bold border border-r-gray-400 text-[#555657]">
                    Branch Code
                  </div>
                  <div className="px-4 py-2 text-left">
                    {" "}
                    {data.branch_code ? data.branch_code : ""}
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      {/* Education */}
      <div className="text-baseBlue text-xl font-extrabold py-2 px-3 my-4 border border-gray-400">
        Academic Information
      </div>
      {/* Data */}
      <div className="lg:hidden">
        {educations?.length ? (
          educations.map((education, index) => (
            <div key={index} className="py-2">
              <div className="flex">
                <div className="w-[40%] px-4 py-2 text-left font-bold border border-r-gray-400 text-[#555657]">
                  Education Level
                </div>
                <div className="w-[60%] px-4 py-2 text-left border text-gray-500">
                  {education.education_level}
                </div>
              </div>
              <div className="flex">
                <div className="w-[40%] px-4 py-2 text-left font-bold border border-r-gray-400 text-[#555657]">
                  Program
                </div>
                <div className="w-[60%] px-4 py-2 text-left border text-gray-500">
                  {education.program}
                </div>
              </div>
              <div className="flex">
                <div className="w-[40%] px-4 py-2 text-left font-bold border border-r-gray-400 text-[#555657]">
                  Institute
                </div>
                <div className="w-[60%] px-4 py-2 text-left border text-gray-500">
                  {education.institute_name}
                </div>
              </div>
              <div className="flex">
                <div className="w-[40%] px-4 py-2 text-left font-bold border border-r-gray-400 text-[#555657]">
                  Start Date
                </div>
                <div className="w-[60%] px-4 py-2 text-left border text-gray-500">
                  {education.edu_start_date}
                </div>
              </div>
              <div className="flex">
                <div className="w-[40%] px-4 py-2 text-left font-bold border border-r-gray-400 text-[#555657]">
                  End Date
                </div>
                <div className="w-[60%] px-4 py-2 text-left border text-gray-500">
                  {education.edu_end_date}
                </div>
              </div>
              <div className="flex">
                <div className="w-[40%] px-4 py-2 text-left font-bold border border-r-gray-400 text-[#555657]">
                  File
                </div>
                <div className="w-[60%] px-4 py-2 text-left border text-gray-500">
                  {education.acadamicDocument ? (
                    <button
                      onClick={() =>
                        downloadAttachment(
                          education.acadamicDocument.document.file,
                          education.acadamicDocument.document.name
                        )
                      }
                    >
                      {education.acadamicDocument.document.name?.length > 15 ? (
                        <>
                          {education.acadamicDocument.document.name.slice(
                            0,
                            12
                          )}
                          ...
                        </>
                      ) : (
                        education.acadamicDocument.document.name
                      )}
                      <IoMdDownload className="text-xl" />
                    </button>
                  ) : (
                    "N/A"
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center opacity-50 text-sm">
            No Academic Information Added.
          </div>
        )}
      </div>

      {/* tablet and desktop */}
      <div className="hidden lg:block text-center">
        <div className="w-full flex items-center">
          <div className="w-[20%] px-4 py-7 font-bold border text-[#555657]">
            Name of Degree
          </div>
          <div className="w-[30%] border flex flex-col">
            <div className="px-4 py-2 text-center border border-b-gray-300 font-bold text-[#555657]">
              Duration
            </div>
            <div className="flex justify-between w-full">
              <div className="border-r border-gray-200 w-[50%] px-4 py-2 font-bold text-[#555657]">
                From
              </div>
              <div className="w-[50%] font-bold px-4 py-2 text-[#555657]">
                To
              </div>
            </div>
          </div>
          <div className="w-[20%] px-4 py-7 border border-gray-200 font-bold text-[#555657]">
            Name of Institution
          </div>
          <div className="w-[15%] px-4 py-7 border border-gray-200 font-bold text-[#555657]">
            Education Level
          </div>
          <div className="w-[15%] px-4 py-7 border border-gray-200 font-bold text-[#555657]">
            Attachments
          </div>
        </div>
        {educations?.length ? (
          educations.map((education, index) => (
            <div className="w-full flex text-[#555657]">
              <div className="w-[20%] px-4 py-2 border">
                {education.program}
              </div>
              <div className="w-[30%] border flex flex-col">
                {/* <div className="px-4 py-2 text-center border border-b-gray-300 font-bold">
                Duration
              </div> */}
                <div className="flex justify-between w-full">
                  <div className="border-r border-gray-200 w-[50%] px-4 py-2">
                    {education.edu_start_date}
                  </div>
                  <div className="w-[50%] px-4 py-2">
                    {" "}
                    {education.edu_end_date}
                  </div>
                </div>
              </div>
              <div className="w-[20%] px-4 py-2 border border-gray-200">
                {education.institute_name}
              </div>
              <div className="w-[15%] px-4 py-2 border border-gray-200">
                {education.education_level}
              </div>
              <div className="w-[15%] px-4 py-2 border border-gray-200">
                {education.acadamicDocument ? (
                  <button
                    className="flex items-center gap-x-2"
                    onClick={() =>
                      downloadAttachment(
                        education.acadamicDocument.document.file,
                        education.acadamicDocument.document.name
                      )
                    }
                  >
                    {education.acadamicDocument.document.name?.length > 15 ? (
                      <>
                        {education.acadamicDocument.document.name.slice(0, 12)}
                        ...
                      </>
                    ) : (
                      education.acadamicDocument.document.name
                    )}
                    <IoMdDownload className="text-xl" />
                  </button>
                ) : (
                  "N/A"
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center opacity-50 text-sm mt-3">
            No Professional Experience Added.
          </div>
        )}
      </div>
      {/* Experiences */}
      <div className="text-baseBlue text-xl font-extrabold py-2 px-3 my-4 border border-gray-400">
        Experiences
      </div>
      {/* tablet and desktop */}
      <div className="hidden lg:block text-center">
        <div className="w-full flex items-center">
          <div className="w-[20%] px-4 py-7 font-bold border text-[#555657]">
            Name of Organization
          </div>
          <div className="w-[30%] border flex flex-col">
            <div className="px-4 py-2 text-center border border-b-gray-300 font-bold text-[#555657]">
              Period of Work
            </div>
            <div className="flex justify-between w-full">
              <div className="border-r border-gray-200 w-[50%] px-4 py-2 font-bold text-[#555657]">
                From
              </div>
              <div className="w-[50%] font-bold px-4 py-2 text-[#555657]">
                To
              </div>
            </div>
          </div>
          <div className="w-[20%] px-4 py-7 border border-gray-200 font-bold text-[#555657]">
            Designation
          </div>
          <div className="w-[15%] px-4 py-7 border border-gray-200 font-bold text-[#555657]">
            Responsibilites
          </div>
          <div className="w-[15%] px-4 py-7 border border-gray-200 font-bold text-[#555657]">
            Experience Letter
          </div>
        </div>
        {experiences?.length ? (
          experiences.map((experience, index) => (
            <div className="w-full flex text-[#555657]">
              <div className="w-[20%] px-4 py-2 border">
                {experience.exp_organization}
              </div>
              <div className="w-[30%] border flex flex-col">
                {/* <div className="px-4 py-2 text-center border border-b-gray-300 font-bold">
                Duration
              </div> */}
                <div className="flex justify-between w-full">
                  <div className="border-r border-gray-200 w-[50%] px-4 py-2">
                    {experience.exp_start_date}
                  </div>
                  <div className="w-[50%] px-4 py-2">
                    {" "}
                    {experience.exp_end_date}
                  </div>
                </div>
              </div>
              <div className="w-[20%] px-4 py-2 border border-gray-200">
                {experience.exp_designation}
              </div>
              <div className="w-[15%] px-4 py-2 border border-gray-200">
                {/* {education.education_level} */}
              </div>
              <div className="w-[15%] px-4 py-2 border border-gray-200">
                {experience.exp_letter ? (
                  <button
                    className="flex items-center gap-x-2"
                    onClick={() =>
                      downloadAttachment(
                        experience.exp_letter.file,
                        experience.exp_letter.name
                      )
                    }
                  >
                    {experience.exp_letter.name?.length > 15 ? (
                      <>
                        {experience.exp_letter.name.slice(0, 12)}
                        ...
                      </>
                    ) : (
                      experience.exp_letter.name
                    )}
                    <IoMdDownload className="text-xl" />
                  </button>
                ) : (
                  "N/A"
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center opacity-50 text-sm mt-3">
            No Experience Added.
          </div>
        )}
      </div>
      {/* Experiences */}
      <table className="min-w-full lg:hidden">
        {experiences?.length !== 0 ? (
          experiences.map((experience, index) => (
            <tbody key={index} className="bg-white text-gray-500">
              {index !== 0 && (
                <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
                  <td className="w-[50%] px-6 py-2 text-center">
                    {" "}
                    ============
                  </td>
                  <td className="w-[50%] px-6 py-2 text-center">
                    {" "}
                    ============
                  </td>
                </tr>
              )}
              <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
                <td className="w-[50%] px-6 py-2 border border-gray-200 text-left font-bold text-[#555657]">
                  Organization
                </td>
                <td className="w-[50%] px-6 py-2 text-left border border-gray-200">
                  {experience.exp_organization}
                </td>
              </tr>
              <tr className="whitespace-nowrap border-b-2  hover:bg-gray-100">
                <td className="w-[50%] px-6 py-2 text-left border border-gray-200 font-bold text-[#555657]">
                  Designation
                </td>
                <td className="w-[50%] px-6 py-2 text-left border border-gray-200">
                  {experience.exp_designation}
                </td>
              </tr>
              <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
                <td className="w-[50%] px-6 py-2 text-left border border-gray-200 font-bold text-[#555657]">
                  Start Date
                </td>
                <td className="w-[50%] px-6 py-2 text-left border border-gray-200">
                  {experience.exp_start_date}
                </td>
              </tr>
              <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
                <td className="w-[50%] px-6 py-2 text-left border border-gray-200 font-bold text-[#555657]">
                  End Date
                </td>
                <td className="w-[50%] px-6 py-2 text-left border border-gray-200">
                  {experience.exp_end_date}
                </td>
              </tr>
              <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
                <td className="w-[50%] px-6 py-2 text-left border border-gray-200 font-bold text-[#555657]">
                  File
                </td>
                <td className="w-[50%] px-6 py-2 text-left border border-gray-200">
                  {experience.exp_letter ? (
                    <button
                      onClick={() =>
                        downloadAttachment(
                          experience.exp_letter.file,
                          experience.exp_letter.name
                        )
                      }
                    >
                      {experience.exp_letter.name?.length > 15 ? (
                        <>
                          {experience.exp_letter.name.slice(0, 12)}
                          ...
                        </>
                      ) : (
                        experience.exp_letter.name
                      )}
                      <IoMdDownload className="text-xl" />
                    </button>
                  ) : (
                    "N/A"
                  )}
                </td>
              </tr>
            </tbody>
          ))
        ) : (
          <div className="text-center opacity-50 text-sm mt-3">
            No Professional Experience Added.
          </div>
        )}
      </table>

      {/* Certification */}
      <div className="text-baseBlue text-xl font-extrabold py-2 px-3 my-4 border border-gray-400">
        Certifications
      </div>
      <table className="min-w-full block md:hidden">
        {certifications?.length !== 0 ? (
          certifications.map((certificate, index) => (
            <tbody key={index} className="bg-white text-gray-500">
              {index !== 0 && (
                <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
                  <td className="w-[50%] px-6 py-2 text-center">
                    {" "}
                    ============
                  </td>
                  <td className="w-[50%] px-6 py-2 text-center">
                    {" "}
                    ============
                  </td>
                </tr>
              )}
              <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
                <td className="w-[50%] px-6 py-2 text-left font-bold text-[#555657]">
                  Certification Name
                </td>
                <td className="w-[50%] px-6 py-2 text-left">
                  {certificate.certification_name}
                </td>
              </tr>
              <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
                <td className="w-[50%] px-6 py-2 text-left font-bold text-[#555657]">
                  Completion Date
                </td>
                <td className="w-[50%] px-6 py-2 text-left">
                  {certificate.completion_date}
                </td>
              </tr>
              <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
                <td className="w-[50%] px-6 py-2 text-left font-bold text-[#555657]">
                  Expiry Date
                </td>
                <td className="w-[50%] px-6 py-2 text-left">
                  {certificate.expiry_date}
                </td>
              </tr>
              <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
                <td className="w-[50%] px-6 py-2 text-left font-bold text-[#555657]">
                  File
                </td>
                <td className="w-[50%] px-6 py-2 text-left">
                  {certificate.certification_body ? (
                    <button
                      onClick={() =>
                        downloadAttachment(
                          certificate.certification_body.file,
                          certificate.certification_body.name
                        )
                      }
                    >
                      {certificate.certification_body.name?.length > 15 ? (
                        <>
                          {certificate.certification_body.name.slice(0, 12)}
                          ...
                        </>
                      ) : (
                        certificate.certification_body.name
                      )}
                      <IoMdDownload className="text-xl" />
                    </button>
                  ) : (
                    "N/A"
                  )}
                </td>
              </tr>
            </tbody>
          ))
        ) : (
          <div className="text-center opacity-50 text-sm mt-3">
            No Certifications Added.
          </div>
        )}
      </table>

      {/* tablet and desktop */}
      <div className="hidden md:block">
        <div className="w-full flex items-center">
          <div className="w-[27%] px-4 py-7 font-bold border text-[#555657]">
            Professional Cerificate
          </div>
          <div className="w-[27%] px-4 py-7 border border-gray-200 font-bold text-[#555657]">
            Completion Date
          </div>
          <div className="w-[27%] px-4 py-7 border border-gray-200 font-bold text-[#555657]">
            Expiry Date
          </div>
          <div className="w-[19%] px-4 py-7 border border-gray-200 font-bold text-[#555657]">
            Attachements
          </div>
        </div>
        {certifications?.length ? (
          certifications.map((certificate, index) => (
            <div className="w-full flex text-[#555657]" key={index}>
              <div className="w-[27%] px-4 py-2 border">
                {certificate.certification_name}
              </div>
              <div className="w-[27%] px-4 py-2 border border-gray-200">
                {certificate.completion_date}
              </div>
              <div className="w-[27%] px-4 py-2 border border-gray-200">
                {certificate.expiry_date}
              </div>
              <div className="w-[19%] px-4 py-2 border border-gray-200">
                {certificate.certification_body ? (
                  <button
                    className="flex items-center gap-x-2"
                    onClick={() =>
                      downloadAttachment(
                        certificate.certification_body.file,
                        certificate.certification_body.name
                      )
                    }
                  >
                    {certificate.certification_body.name?.length > 15 ? (
                      <>
                        {certificate.certification_body.name.slice(0, 12)}
                        ...
                      </>
                    ) : (
                      certificate.certification_body.name
                    )}
                    <IoMdDownload className="text-xl" />
                  </button>
                ) : (
                  "N/A"
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center opacity-50 text-sm mt-3">
            No Certifications Added.
          </div>
        )}
      </div>

      {/* Department */}

      <div className="text-baseBlue text-xl font-extrabold py-2 px-3 my-4 border border-gray-400">
        Department
      </div>
      <div className="mb-10">
        <div className="flex">
          <div className="w-[40%] xl:w-[24%] px-4 py-2 text-left font-bold border border-r-gray-400 text-[#555657]">
            Department Name
          </div>
          <div className="w-[60%] xl:w-[76%] px-4 py-2 text-left border text-gray-500">
            {data.department_name ? data.department_name : ""}
          </div>
        </div>
        <div className="flex">
          <div className="w-[40%]  xl:w-[24%] px-4 py-2 text-left font-bold border border-r-gray-400 text-[#555657]">
            Department Position
          </div>
          <div className="w-[60%] xl:w-[76%] px-4 py-2 text-left border text-gray-500">
            {data.department_position ? data.department_position : ""}
          </div>
        </div>
        <div className="flex">
          <div className="w-[40%] xl:w-[24%] px-4 py-2 text-left font-bold border border-r-gray-400 text-[#555657]">
            Direct Reports to
          </div>
          <div className="w-[60%] xl:w-[76%] px-4 py-2 text-left border text-gray-500">
            {data.direct_report ? data.direct_report : ""}
          </div>
        </div>
        <div className="flex">
          <div className="w-[40%] xl:w-[24%] px-4 py-2 text-left font-bold border border-r-gray-400 text-[#555657]">
            Indirect Reports to
          </div>
          <div className="w-[60%] xl:w-[76%] px-4 py-2 text-left border text-gray-500">
            {data.indirect_report ? data.indirect_report : ""}
          </div>
        </div>
        <div className="flex">
          <div className="w-[40%] xl:w-[24%] px-4 py-2 text-left font-bold border border-r-gray-400 text-[#555657]">
            Department Manager
          </div>
          <div className="w-[60%] xl:w-[76%] px-4 py-2 text-left border text-gray-500">
            {data.department_manager ? data.department_manager : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
    token: state.user.token,
    baseUrl: state.user.baseUrl,
  };
};

export default connect(mapStateToProps)(ViewEmployee);
