import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

const Profile = ({ token , userProfile , baseUrl }) => {
  const [data, setData] = useState("");
  const [educations, setEducations] = useState([{}]);
  const [certifications, setCertifications] = useState([{}]);
  const [experiences, setExperiences] = useState([{}]);
  const id = userProfile.id

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };


  const fetchData = async () => {
    try {
      // Fetch employee data
      const employeeResponse = await axios.get(`${baseUrl}/emp/${id}`, { headers });
      const employeeData = employeeResponse.data;
      setData(employeeData);
  
      // Fetch education data
      const educationResponse = await axios.get(`${baseUrl}/education/?search={"employee_id":${id}}`, { headers });
      const educationData = educationResponse.data.results;
      setEducations(educationData);
  
      // Fetch experiences data
      const experiencesResponse = await axios.get(`${baseUrl}/experience/?search={"employee_id":${id}}`, { headers });
      const experiencesData = experiencesResponse.data.results;
      setExperiences(experiencesData);
  
      // Fetch certification data
      const certificationResponse = await axios.get(`${baseUrl}/certification/?search={"employee_id":${id}}`, { headers });
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
    <div className="px-4 lg:px-10 py-4 w-full overflow-x-auto overflow-y-auto max-h-[100vh] xScroll">
      {/* image */}
      <div className="flex items-center gap-x-8">
        <div
          className="w-20 h-20 rounded-full bg-blue-900 text-white text-3xl font-semibold flex 
        justify-center items-center"
        >
          {data.first_name?.toUpperCase().slice(0, 1)}
          {data.last_name?.toUpperCase().slice(0, 1)}
        </div>
        <div className="flex flex-col gap-y-2">
          <div className="bg-blue-100 py-1 px-4 rounded text-xl font-bold">{`${data.first_name} ${data.last_name}`}</div>
          <div className="bg-blue-100 py-1 px-4 rounded text-lg font-bold">
            {data.department_position}
          </div>
        </div>
      </div>
      {/* Personal Information */}
      <div className="bg-blue-900 py-2 px-4 text-white rounded my-4">
        1. Personal Information
      </div>
      <table className="min-w-full">
        <tbody className="bg-white text-gray-500">
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="w-[50%] px-6 py-2 text-left font-bold text-black">
              First Name
            </td>
            <td className="w-[50%] px-6 py-2 text-left">{data.first_name}</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="w-[50%] px-6 py-2 text-left font-bold text-black">
              Last Name
            </td>
            <td className="w-[50%] px-6 py-2 text-left">{data.last_name}</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="w-[50%] px-6 py-2 text-left font-bold text-black">
              Date of Birth
            </td>
            <td className="w-[50%] px-6 py-2 text-left">{data.date_of_birth ? data.date_of_birth : "Undefined" }</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="w-[50%] px-6 py-2 text-left font-bold text-black">
              Permanent Address
            </td>
            <td className="w-[50%] px-6 py-2 text-left">{data.residential_address ? data.residential_address : "Undefined" }</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="w-[50%] px-6 py-2 text-left font-bold text-black">
              Mobile Number
            </td>
            <td className="w-[50%] px-6 py-2 text-left">{data.mobile_no ? data.mobile_no : "Undefined" }</td>
          </tr>
          {/* <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="w-[50%] px-6 py-2 text-left font-bold text-black">
              Nationality
            </td>
            <td className="w-[50%] px-6 py-2 text-left">{data.place_of_birth ? data.place_of_birth : "Undefined" }</td>
          </tr> */}
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="w-[50%] px-6 py-2 text-left font-bold text-black">
              Email ID
            </td>
            <td className="w-[50%] px-6 py-2 text-left">{data.email ? data.email : "Undefined" }</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="w-[50%] px-6 py-2 text-left font-bold text-black">
              Emergency Contact
            </td>
            <td className="w-[50%] px-6 py-2 text-left">{data.emergency_phone_no ? data.emergency_phone_no : "Undefined" }</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="w-[50%] px-6 py-2 text-left font-bold text-black">
              Relation
            </td>
            <td className="w-[50%] px-6 py-2 text-left">{data.emergency_relation ? data.emergency_relation : "Undefined" }</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="w-[50%] px-6 py-2 text-left font-bold text-black">Name</td>
            <td className="w-[50%] px-6 py-2 text-left">{`${data.emergency_first_name ? data.emergency_first_name : "Undefined" } ${data.emergency_last_name}`}</td>
          </tr>
        </tbody>
      </table>

      {/* Banking Information */}
      <div className="bg-blue-900 py-2 px-2 text-white rounded my-6">
        2. Banking Information
      </div>
      <table className="min-w-full">
        <tbody className="bg-white text-gray-500">
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="w-[50%] px-6 py-2 text-left font-bold text-black">
              Bank Name
            </td>
            <td className="w-[50%] px-6 py-2 text-left">{data.bank_name ? data.bank_name : "Undefined" }</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="w-[50%] px-6 py-2 text-left font-bold text-black">
              Account Title
            </td>
            <td className="w-[50%] px-6 py-2 text-left">{data.account_title ? data.account_title : "Undefined" }</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="w-[50%] px-6 py-2 text-left font-bold text-black">
              Account Number
            </td>
            <td className="w-[50%] px-6 py-2 text-left">{data.account_number ? data.account_number : "Undefined" }</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="w-[50%] px-6 py-2 text-left font-bold text-black">IBAN</td>
            <td className="w-[50%] px-6 py-2 text-left">{data.account_iban ? data.account_iban : "Undefined" }</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="w-[50%] px-6 py-2 text-left font-bold text-black">Branch Address</td>
            <td className="w-[50%] px-6 py-2 text-left">{data.branch_address ? data.branch_address : "Undefined" }</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="w-[50%] px-6 py-2 text-left font-bold text-black">Branch Code</td>
            <td className="w-[50%] px-6 py-2 text-left">{data.branch_code ? data.branch_code : "Undefined" }</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="w-[50%] px-6 py-2 text-left font-bold text-black">Swift Code</td>
            <td className="w-[50%] px-6 py-2 text-left">{data.swift_code ? data.swift_code : "Undefined" }</td>
          </tr>
        </tbody>
      </table>

       {/* Department */}
       <div className="bg-blue-900 py-2 px-4 text-white rounded my-4">
        3. Department
      </div>
      <table className="min-w-full">
        <tbody className="bg-white text-gray-500">
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="w-[50%] px-6 py-2 text-left font-bold text-black">
              Department Name
            </td>
            <td className="w-[50%] px-6 py-2 text-left">{data.department_name ? data.department_name : "Undefined" }</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="w-[50%] px-6 py-2 text-left font-bold text-black">
              Position
            </td>
            <td className="w-[50%] px-6 py-2 text-left">{data.department_position ? data.department_position : "Undefined" }</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="w-[50%] px-6 py-2 text-left font-bold text-black">
              Direct Reports to
            </td>
            <td className="w-[50%] px-6 py-2 text-left">{data.direct_report ? data.direct_report : "Undefined" }</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="w-[50%] px-6 py-2 text-left font-bold text-black">
              Indirect Reports to
            </td>
            <td className="w-[50%] px-6 py-2 text-left">{data.indirect_report ? data.indirect_report : "Undefined" }</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="w-[50%] px-6 py-2 text-left font-bold text-black">Manager</td>
            <td className="w-[50%] px-6 py-2 text-left">{data.department_manager ? data.department_manager : "Undefined" }</td>
          </tr>
    
        </tbody>
      </table>

      {/* Education */}
      <div className="bg-blue-900 py-2 px-4 text-white rounded my-4">
        4. Academic Information
      </div>
      <table className="min-w-full">
            {educations.map((education , index)=>(
        <tbody key={index} className="bg-white text-gray-500">
         {index !== 0 &&    
        <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="w-[50%] px-6 py-2 text-center"> ============</td>
            <td className="w-[50%] px-6 py-2 text-center"> ============</td>
          </tr>
}
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="w-[50%] px-6 py-2 text-left font-bold text-black">
              Education Level
            </td>
            <td className="w-[50%] px-6 py-2 text-left">{education.education_level}</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="w-[50%] px-6 py-2 text-left font-bold text-black">
              Program
            </td>
            <td className="w-[50%] px-6 py-2 text-left">{education.program}</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="w-[50%] px-6 py-2 text-left font-bold text-black">
              Institue
            </td>
            <td className="w-[50%] px-6 py-2 text-left">{education.institute_name}</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="w-[50%] px-6 py-2 text-left font-bold text-black">Education start Date</td>
            <td className="w-[50%] px-6 py-2 text-left">{education.edu_start_date}</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="w-[50%] px-6 py-2 text-left font-bold text-black">Education End Date</td>
            <td className="w-[50%] px-6 py-2 text-left">{education.edu_end_date}</td>
          </tr>
        </tbody>
          ))}
      </table>

      {/* Experiences */}
      <div className="bg-blue-900 py-2 px-4 text-white rounded my-4">
        6. Experiences
      </div>
      <table className="min-w-full">
            {experiences.map((experience , index)=>(
        <tbody key={index} className="bg-white text-gray-500">
         {index !== 0 &&    
        <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="w-[50%] px-6 py-2 text-center"> ============</td>
            <td className="w-[50%] px-6 py-2 text-center"> ============</td>
          </tr>
}
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="w-[50%] px-6 py-2 text-left font-bold text-black">
            Organization
            </td>
            <td className="w-[50%] px-6 py-2 text-left">{experience.exp_organization}</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="w-[50%] px-6 py-2 text-left font-bold text-black">
            Designation
            </td>
            <td className="w-[50%] px-6 py-2 text-left">{experience.exp_designation}</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="w-[50%] px-6 py-2 text-left font-bold text-black">
            Start Date
            </td>
            <td className="w-[50%] px-6 py-2 text-left">{experience.exp_start_date}</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="w-[50%] px-6 py-2 text-left font-bold text-black">
            End Date
            </td>
            <td className="w-[50%] px-6 py-2 text-left">{experience.exp_end_date}</td>
          </tr>
        </tbody>
          ))}
      </table>

      {/* Certification */}
      <div className="bg-blue-900 py-2 px-4 text-white rounded my-4">
        6. Certifications
      </div>
      <table className="min-w-full">
            {certifications.map((certification , index)=>(
        <tbody key={index} className="bg-white text-gray-500">
         {index !== 0 &&    
        <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="w-[50%] px-6 py-2 text-center"> ============</td>
            <td className="w-[50%] px-6 py-2 text-center"> ============</td>
          </tr>
}
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="w-[50%] px-6 py-2 text-left font-bold text-black">
            Certification Name
            </td>
            <td className="w-[50%] px-6 py-2 text-left">{certification.certification_name}</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="w-[50%] px-6 py-2 text-left font-bold text-black">
            Completion Date
            </td>
            <td className="w-[50%] px-6 py-2 text-left">{certification.completion_date}</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="w-[50%] px-6 py-2 text-left font-bold text-black">
            Expiry Date
            </td>
            <td className="w-[50%] px-6 py-2 text-left">{certification.expiry_date}</td>
          </tr>
        </tbody>
          ))}
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

export default connect(mapStateToProps)(Profile);
