import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";

const ViewEmployee = ({ token, baseUrl }) => {
  const [data, setData] = useState("");
  const [educations, setEducations] = useState([{}]);
  const [certifications, setCertifications] = useState([{}]);
  const [experiences, setExperiences] = useState([{}]);
  const { id } = useParams();

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const fetchData = async () => {
    try {
      // Fetch employee data
      const employeeResponse = await axios.get(`${baseUrl}/emp/${id}`, {
        headers,
      });
      const employeeData = employeeResponse.data;
      setData(employeeData);

      // Fetch education data
      const educationResponse = await axios.get(
        `${baseUrl}/education/?search={"employee_id":${id}}`,
        { headers }
      );
      const educationData = educationResponse.data.results;
      setEducations(educationData);

      // Fetch experiences data
      const experiencesResponse = await axios.get(
        `${baseUrl}/experience/?search={"employee_id":${id}}`,
        { headers }
      );
      const experiencesData = experiencesResponse.data.results;
      setExperiences(experiencesData);

      // Fetch certification data
      const certificationResponse = await axios.get(
        `${baseUrl}/certification/?search={"employee_id":${id}}`,
        { headers }
      );
      const certificationData = certificationResponse.data.results;
      setCertifications(certificationData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full overflow-x-auto overflow-y-auto max-h-[100vh] xScroll md:px-4 xl:px-8">
      {/* image */}
      <div className="flex items-center gap-x-8 bg-[#f9f9f9] px-4 lg:px-10 py-4">
        <div
          className="w-24 h-24 rounded-full bg-white text-black text-3xl font-semibold flex 
        justify-center items-center"
        >
          {data.first_name?.toUpperCase().slice(0, 1)}
          {data.last_name?.toUpperCase().slice(0, 1)}
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
      <div className="text-baseBlue text-xl font-extrabold py-2 px-3 my-4 border border-black">
        Personal Information
      </div>
      {/* data */}
      <div className="">
        <div className="flex">
          <div className="w-[30%] px-4 py-2 text-left font-bold border border-r-black text-black">
            First Name
          </div>
          <div className="w-[70%] px-4 py-2 text-left border text-gray-500">
            {data.first_name}
          </div>
        </div>
        <div className="flex">
          <div className="w-[30%] px-4 py-2 text-left font-bold border border-r-black text-black">
            Last Name
          </div>
          <div className="w-[70%] px-4 py-2 text-left border text-gray-500">
            {data.last_name}
          </div>
        </div>
        <div className="flex">
          <div className="w-[30%] px-4 py-2 text-left font-bold border border-r-black text-black">
            Date of Birth
          </div>
          <div className="w-[70%] px-4 py-2 text-left border text-gray-500">
            {data.date_of_birth ? data.date_of_birth : "Undefined"}
          </div>
        </div>
        <div className="flex">
          <div className="w-[30%] px-4 py-2 text-left font-bold border border-r-black text-black">
            Permanent Address
          </div>
          <div className="w-[70%] px-4 py-2 text-left border text-gray-500">
            {" "}
            {data.residential_address ? data.residential_address : "Undefined"}
          </div>
        </div>
        <div className="flex">
          <div className="w-[30%] px-4 py-2 text-left font-bold border border-r-black text-black">
            Current Address
          </div>
          <div className="w-[70%] px-4 py-2 text-left border text-gray-500">
            {" "}
            {data.current_address ? data.current_address : "Undefined"}
            {data.current_country ? data.current_country : "Undefined"}
          </div>
        </div>
        <div className="flex">
          <div className="w-[30%] px-4 py-2 text-left font-bold border border-r-black text-black">
            Mobile NO
          </div>
          <div className="w-[70%] px-4 py-2 text-left border text-gray-500">
            {" "}
            {data.mobile_no ? data.mobile_no : "Undefined"}
          </div>
        </div>
        <div className="flex">
          <div className="w-[30%] px-4 py-2 text-left font-bold border border-r-black text-black">
            Email
          </div>
          <div className="w-[70%] px-4 py-2 text-left border text-gray-500">
            {" "}
            {data.email ? data.email : "Undefined"}
          </div>
        </div>
        <div className="flex">
          <div className="w-[30%] px-4 py-2 text-left font-bold border border-r-black text-black">
            Nationality
          </div>
          <div className="w-[70%] px-4 py-2 text-left border text-gray-500">
            {" "}
            {data.place_of_birth ? data.place_of_birth : "Undefined"}
          </div>
        </div>
        <div className="flex">
          <div className="w-[30%] px-4 py-2 text-left font-bold border border-r-black text-black">
            Emergency Contact
          </div>
          <div className="w-[70%] px-4 py-2 text-left border text-gray-500">
            {" "}
            {data.emergency_phone_no ? data.emergency_phone_no : "Undefined"}
          </div>
        </div>
        <div className="flex">
          <div className="w-[30%] px-4 py-2 text-left font-bold border border-r-black text-black">
            Relation
          </div>
          <div className="w-[70%] px-4 py-2 text-left border text-gray-500">
            {" "}
            {data.emergency_relation ? data.emergency_relation : "Undefined"}
          </div>
        </div>
        <div className="flex">
          <div className="w-[30%] px-4 py-2 text-left font-bold border border-r-black text-black">
            Name
          </div>
          <div className="w-[70%] px-4 py-2 text-left border text-gray-500">
            {" "}
            {`${
              data.emergency_first_name
                ? data.emergency_first_name
                : "Undefined"
            } ${data.emergency_last_name}`}
          </div>
        </div>
      </div>

      {/* Banking Information */}
      <div className="text-baseBlue text-xl font-extrabold py-2 px-3 my-4 border border-black">
        Banking Information
      </div>
      {/* data */}
      <div className="">
        <div className="flex">
          <div className="w-[30%] px-4 py-2 text-left font-bold border border-r-black text-black">
            Bank Name
          </div>
          <div className="w-[70%] px-4 py-2 text-left border text-gray-500">
            {data.bank_name ? data.bank_name : "Undefined"}
          </div>
        </div>
        <div className="flex">
          <div className="w-[30%] px-4 py-2 text-left font-bold border border-r-black text-black">
            Account Title
          </div>
          <div className="w-[70%] px-4 py-2 text-left border text-gray-500">
            {data.account_title ? data.account_title : "Undefined"}
          </div>
        </div>
        <div className="flex">
          <div className="w-[30%] px-4 py-2 text-left font-bold border border-r-black text-black">
            Account Number
          </div>
          <div className="w-[70%] px-4 py-2 text-left border text-gray-500">
            {data.account_number ? data.account_number : "Undefined"}
          </div>
        </div>
        <div className="flex">
          <div className="w-[30%] px-4 py-2 text-left font-bold border border-r-black text-black">
            IBAN
          </div>
          <div className="w-[70%] px-4 py-2 text-left border text-gray-500">
            {data.account_iban ? data.account_iban : "Undefined"}
          </div>
        </div>
        <div className="flex">
          <div className="w-[30%] px-4 py-2 text-left font-bold border border-r-black text-black">
            Branch Code
          </div>
          <div className="w-[70%] px-4 py-2 text-left border text-gray-500">
            {data.branch_code ? data.branch_code : "Undefined"}
          </div>
        </div>
        <div className="flex">
          <div className="w-[30%] px-4 py-2 text-left font-bold border border-r-black text-black">
            Swift Code
          </div>
          <div className="w-[70%] px-4 py-2 text-left border text-gray-500">
            {data.swift_code ? data.swift_code : "Undefined"}
          </div>
        </div>
      </div>

      {/* Department */}
      <div className="text-baseBlue text-xl font-extrabold py-2 px-3 my-4 border border-black">
        Department
      </div>
      <div className="">
        <div className="flex">
          <div className="w-[35%] px-4 py-2 text-left font-bold border border-r-black text-black">
            Department Name
          </div>
          <div className="w-[65%] px-4 py-2 text-left border text-gray-500">
            {data.department_name ? data.department_name : "Undefined"}
          </div>
        </div>
        <div className="flex">
          <div className="w-[35%] px-4 py-2 text-left font-bold border border-r-black text-black">
            Department Position
          </div>
          <div className="w-[65%] px-4 py-2 text-left border text-gray-500">
            {data.department_position ? data.department_position : "Undefined"}
          </div>
        </div>
        <div className="flex">
          <div className="w-[35%] px-4 py-2 text-left font-bold border border-r-black text-black">
            Direct Reports to
          </div>
          <div className="w-[65%] px-4 py-2 text-left border text-gray-500">
            {data.direct_report ? data.direct_report : "Undefined"}
          </div>
        </div>
        <div className="flex">
          <div className="w-[35%] px-4 py-2 text-left font-bold border border-r-black text-black">
            Indirect Reports to
          </div>
          <div className="w-[65%] px-4 py-2 text-left border text-gray-500">
            {data.indirect_report ? data.indirect_report : "Undefined"}
          </div>
        </div>
        <div className="flex">
          <div className="w-[35%] px-4 py-2 text-left font-bold border border-r-black text-black">
            Department Manager
          </div>
          <div className="w-[65%] px-4 py-2 text-left border text-gray-500">
            {data.department_manager ? data.department_manager : "Undefined"}
          </div>
        </div>
      </div>
      

      {/* Education */}
      <div className="bg-blue-900 py-2 px-4 text-white rounded my-4">
        4. Academic Information
      </div>
      <table className="min-w-full">
        {educations.length !== 0 ? (
          educations.map((education, index) => (
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
                <td className="w-[50%] px-6 py-2 text-left font-bold text-black">
                  Education Level
                </td>
                <td className="w-[50%] px-6 py-2 text-left">
                  {education.education_level}
                </td>
              </tr>
              <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
                <td className="w-[50%] px-6 py-2 text-left font-bold text-black">
                  Program
                </td>
                <td className="w-[50%] px-6 py-2 text-left">
                  {education.program}
                </td>
              </tr>
              <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
                <td className="w-[50%] px-6 py-2 text-left font-bold text-black">
                  Institue
                </td>
                <td className="w-[50%] px-6 py-2 text-left">
                  {education.institute_name}
                </td>
              </tr>
              <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
                <td className="w-[50%] px-6 py-2 text-left font-bold text-black">
                  Start Date
                </td>
                <td className="w-[50%] px-6 py-2 text-left">
                  {education.edu_start_date}
                </td>
              </tr>
              <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
                <td className="w-[50%] px-6 py-2 text-left font-bold text-black">
                  End Date
                </td>
                <td className="w-[50%] px-6 py-2 text-left">
                  {education.edu_end_date}
                </td>
              </tr>
            </tbody>
          ))
        ) : (
          <div className="text-center opacity-50 text-sm">
            No Academic Information Added.
          </div>
        )}
      </table>

      {/* Experiences */}
      <div className="bg-blue-900 py-2 px-4 text-white rounded my-4">
        6. Experiences
      </div>
      <table className="min-w-full">
        {experiences.length !== 0 ? (
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
                <td className="w-[50%] px-6 py-2 text-left font-bold text-black">
                  Organization
                </td>
                <td className="w-[50%] px-6 py-2 text-left">
                  {experience.exp_organization}
                </td>
              </tr>
              <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
                <td className="w-[50%] px-6 py-2 text-left font-bold text-black">
                  Designation
                </td>
                <td className="w-[50%] px-6 py-2 text-left">
                  {experience.exp_designation}
                </td>
              </tr>
              <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
                <td className="w-[50%] px-6 py-2 text-left font-bold text-black">
                  Start Date
                </td>
                <td className="w-[50%] px-6 py-2 text-left">
                  {experience.exp_start_date}
                </td>
              </tr>
              <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
                <td className="w-[50%] px-6 py-2 text-left font-bold text-black">
                  End Date
                </td>
                <td className="w-[50%] px-6 py-2 text-left">
                  {experience.exp_end_date}
                </td>
              </tr>
            </tbody>
          ))
        ) : (
          <div className="text-center opacity-50 text-sm">
            No Professional Experience Added.
          </div>
        )}
      </table>

      {/* Certification */}
      <div className="bg-blue-900 py-2 px-4 text-white rounded my-4">
        6. Certifications
      </div>
      <table className="min-w-full">
        {certifications.length !== 0 ? (
          certifications.map((certification, index) => (
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
                <td className="w-[50%] px-6 py-2 text-left font-bold text-black">
                  Certification Name
                </td>
                <td className="w-[50%] px-6 py-2 text-left">
                  {certification.certification_name}
                </td>
              </tr>
              <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
                <td className="w-[50%] px-6 py-2 text-left font-bold text-black">
                  Completion Date
                </td>
                <td className="w-[50%] px-6 py-2 text-left">
                  {certification.completion_date}
                </td>
              </tr>
              <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
                <td className="w-[50%] px-6 py-2 text-left font-bold text-black">
                  Expiry Date
                </td>
                <td className="w-[50%] px-6 py-2 text-left">
                  {certification.expiry_date}
                </td>
              </tr>
            </tbody>
          ))
        ) : (
          <div className="text-center opacity-50 text-sm">
            No Certifications Added.
          </div>
        )}
      </table>
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
