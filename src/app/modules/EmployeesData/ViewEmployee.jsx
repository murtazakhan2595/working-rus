import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";

const ViewEmployee = ({ token, baseUrl }) => {
  const [data, setData] = useState("");
  const [education, setEducation] = useState("");
  const { id } = useParams();

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

//   Fetch Personal Info
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/emp/${id}`, { headers });
        const employeeData = response.data;
        setData(employeeData);
        return employeeData;
      } catch (error) {
        console.error("Error fetching employee data:", error);
        throw error; // You can handle the error as per your application's needs
      }
    };

    // Call the function
    fetchEmployeeData();
  }, [id]);

//   Fetch Education
//   useEffect(() => {
//     const fetchEmployeeData = async () => {
//       try {
//         const response = await axios.get(`${baseUrl}/education/${id}`, { headers });
//         const educationData = response.data;
//         setEducation(educationData);
//         return educationData;
//       } catch (error) {
//         console.error("Error fetching employee data:", error);
//         throw error; // You can handle the error as per your application's needs
//       }
//     };

//     // Call the function
//     fetchEmployeeData();
//   }, [id]);


  return (
    <div className="px-4 lg:px-10 py-4 w-full overflow-x-auto overflow-y-auto max-h-[100vh] xScroll">
      {/* image */}
      <div className="flex items-center gap-x-8">
        <div
          className="w-20 h-20 rounded-full bg-blue-900 text-white text-3xl font-semibold flex 
        justify-center items-center"
        >
          IU
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
            <td className="px-6 py-2 text-left font-bold text-black">
              First Name
            </td>
            <td className="px-6 py-2 text-left">{data.first_name}</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="px-6 py-2 text-left font-bold text-black">
              Last Name
            </td>
            <td className="px-6 py-2 text-left">{data.last_name}</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="px-6 py-2 text-left font-bold text-black">
              Date of Birth
            </td>
            <td className="px-6 py-2 text-left">{data.date_of_birth}</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="px-6 py-2 text-left font-bold text-black">
              Permanent Address
            </td>
            <td className="px-6 py-2 text-left">{data.residential_address}</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="px-6 py-2 text-left font-bold text-black">
              Mobile Number
            </td>
            <td className="px-6 py-2 text-left">{data.mobile_no}</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="px-6 py-2 text-left font-bold text-black">
              Nationality
            </td>
            <td className="px-6 py-2 text-left">{data.place_of_birth}</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="px-6 py-2 text-left font-bold text-black">
              Email ID
            </td>
            <td className="px-6 py-2 text-left">{data.email}</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="px-6 py-2 text-left font-bold text-black">
              Emergency Contact
            </td>
            <td className="px-6 py-2 text-left">{data.emergency_phone_no}</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="px-6 py-2 text-left font-bold text-black">
              Relation
            </td>
            <td className="px-6 py-2 text-left">{data.emergency_relation}</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="px-6 py-2 text-left font-bold text-black">Name</td>
            <td className="px-6 py-2 text-left">{`${data.emergency_first_name} ${data.emergency_last_name}`}</td>
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
            <td className="px-6 py-2 text-left font-bold text-black">
              Bank Name
            </td>
            <td className="px-6 py-2 text-left">{data.bank_name}</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="px-6 py-2 text-left font-bold text-black">
              Account Title
            </td>
            <td className="px-6 py-2 text-left">{data.account_title}</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="px-6 py-2 text-left font-bold text-black">
              Account Number
            </td>
            <td className="px-6 py-2 text-left">{data.account_number}</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="px-6 py-2 text-left font-bold text-black">IBAN</td>
            <td className="px-6 py-2 text-left">{data.account_iban}</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="px-6 py-2 text-left font-bold text-black">Branch Address</td>
            <td className="px-6 py-2 text-left">{data.branch_address}</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="px-6 py-2 text-left font-bold text-black">Branch Code</td>
            <td className="px-6 py-2 text-left">{data.branch_code}</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="px-6 py-2 text-left font-bold text-black">Swift Code</td>
            <td className="px-6 py-2 text-left">{data.swift_code}</td>
          </tr>
        </tbody>
      </table>

      {/* Education */}
      <div className="bg-blue-900 py-2 px-4 text-white rounded my-4">
        3. Academic Information
      </div>
      <table className="min-w-full">
        <tbody className="bg-white text-gray-500">
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="px-6 py-2 text-left font-bold text-black">
              Education Level
            </td>
            <td className="px-6 py-2 text-left">{education.education_level}</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="px-6 py-2 text-left font-bold text-black">
              Program
            </td>
            <td className="px-6 py-2 text-left">{education.program}</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="px-6 py-2 text-left font-bold text-black">
              Institute
            </td>
            <td className="px-6 py-2 text-left">{education.institute_name}</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="px-6 py-2 text-left font-bold text-black">Education Start Date</td>
            <td className="px-6 py-2 text-left">{education.edu_start_date}</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="px-6 py-2 text-left font-bold text-black">Education End Date</td>
            <td className="px-6 py-2 text-left">{education.edu_end_date}</td>
          </tr>
    
        </tbody>
      </table>

      {/* Department */}
      <div className="bg-blue-900 py-2 px-4 text-white rounded my-4">
        4. Department
      </div>
      <table className="min-w-full">
        <tbody className="bg-white text-gray-500">
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="px-6 py-2 text-left font-bold text-black">
              Department Name
            </td>
            <td className="px-6 py-2 text-left">{data.department_name}</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="px-6 py-2 text-left font-bold text-black">
              Position
            </td>
            <td className="px-6 py-2 text-left">{data.department_position}</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="px-6 py-2 text-left font-bold text-black">
              Direct Reports to
            </td>
            <td className="px-6 py-2 text-left">{data.direct_report}</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="px-6 py-2 text-left font-bold text-black">
              Indirect Reports to
            </td>
            <td className="px-6 py-2 text-left">{data.indirect_report}</td>
          </tr>
          <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
            <td className="px-6 py-2 text-left font-bold text-black">Manager</td>
            <td className="px-6 py-2 text-left">{data.department_manager}</td>
          </tr>
    
        </tbody>
      </table>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    baseUrl: state.user.baseUrl,
  };
};

export default connect(mapStateToProps)(ViewEmployee);
