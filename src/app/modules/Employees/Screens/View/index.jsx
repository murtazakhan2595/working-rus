import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaChevronCircleLeft } from "react-icons/fa";
import {getEmployeeCVDetailData ,getEmployeeVisaDetailData , getEmployeeCerficationData ,getEmployeeData,getEmployeeProfessionalExperianceData,getEmployeeAcademicRecordData,getEmployeeVisaDetailsFiles} from '../../../../hooks/employee'
import { connect } from "react-redux";
import { FiDownload } from "react-icons/fi";
import PersonalDetials from "./PersonalDetials";
import ContactInformation from "./ContactInformation";
import BankInformation from "./BankInformation";
import WorkInformation from "./WorkInformation";
import Experience from "./Experience";
import AcademicInfo from "./AcademicDetials";
import Certifications from "./Certifications";
import IdentificationDetails from "./IdentificationDetails";
import Loader  from '../../../../../components/PageLoader'


const ViewEmployee = ({ token, baseUrl }) => {
  const [userData, setUserData] = useState("");
  const [educations, setEducations] = useState([{}]);
  const [certifications, setCertifications] = useState([{}]);
  const [experiences, setExperiences] = useState([{}]);
  const [cv, setCV] = useState({});
  const [documents, setDocuments] = useState({});
  const [visa, setVisa] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  let getDataByHooks = async()=> {
    setLoading(true)
    let empData = await getEmployeeData(baseUrl,id,headers)
    let expData = await getEmployeeProfessionalExperianceData(baseUrl,id,token)
    let cvData = await getEmployeeCVDetailData(baseUrl,id,token)
    let visaData = await getEmployeeVisaDetailData(baseUrl,id,token)
    let educationData = await getEmployeeAcademicRecordData(baseUrl,id,token)
    let certificationData = await getEmployeeCerficationData(baseUrl,id,token)
    let documentsData = await getEmployeeVisaDetailsFiles(baseUrl,id,token)
    setUserData(empData)
    console.log("asdssdsadad",empData)
    setExperiences(expData)
    setCV(cvData)
    setVisa(visaData)
    setEducations(educationData)
    setCertifications(certificationData);
    setDocuments(documentsData);
    setLoading(false)
  }
  useEffect(() => {
    getDataByHooks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const personalInfo = [
    [
      { title: "First Name", data: userData.personalInformation?.first_name },
      { title: "ID Card No", data: userData.personalInformation?.nic },
      { title: "Contact Number", data: userData.personalInformation?.mobile_no },
      { title: "Nationality", data: userData.personalInformation?.nationality },
    ],
    [
      { title: "Last Name", data: userData.personalInformation?.last_name },
      { title: "Date of Birth", data: userData.personalInformation?.date_of_birth },
      { title: "Email Address", data: userData.personalInformation?.email }, // Changed from current_address to email
      { title: "Marital Status", data: userData.personalInformation?.marital_status },
    ],
  ];

  const contactInformation = [
    { title: "Emergency Contact", data: userData.personalInformation?.emergency_phone_no },
    { title: "Full Name", sub : true , data: userData.personalInformation?.emergency_first_name + " " + userData.personalInformation?.emergency_last_name },
    { title: "Relation", sub : true , data: userData.personalInformation?.emergency_relation },
    { title: "Permenent Address", data: userData.personalInformation?.residential_address },
    { title: "Postal Code", sub : true,  data: "" },
    { title: "Present Address", data: userData.personalInformation?.current_address },
    { title: "Postal Code", sub : true , data: "" },
  ];

  const bankInformation = [
    { title: "Bank Name", data: userData.bankDetails?.bank_name },
    { title: "Account Title", data: userData.bankDetails?.account_title },
    { title: "Account Number", data: userData.bankDetails?.account_number },
    { title: "IBAN", data: userData.bankDetails?.account_iban },
    { title: "Branch Address", data: userData.bankDetails?.branch_address },
    { title: "Branch Code", data: userData.bankDetails?.branch_code },
    { title: "Swift Code", data: userData.bankDetails?.swift_code },
  ];

  const workInformation = [
    [
      { title: "Department", data: userData.department?.department_name },
      { title: "Position", data: userData.department?.department_position },
      { title: "Work Email", data: userData.personalInformation?.work_email },
      { title: "Employee Type", data: userData.department?.employee_type },
    ],
    [
      { title: "Employee Status", data: userData.department?.employee_status },
      { title: "Work Type", data: userData.department?.employee_work_type },
      { title: "Work Location", data: userData.department?.employee_location },
      { title: "Direct Report To", data: userData.department?.direct_report },
    ],
    [
      { title: "Department Head", data: userData.department?.department_manager },
      { title: "Joining Date", data: userData.department?.joining_date },
    ],
  ];

  const identificationDetails = [
    {
      title: "ID Details",
      fields: [
        { title: "Current Country ID", data: visa.living_country_id_no },
        { title: "Issuance Country", data: visa.place_of_issuance },
        { title: "ID Issuance Date", data: visa.id_issuance_date },
        { title: "ID Expiry Date", data: visa.id_expiry_date },
        {
          title: "ID Front Image",
          data: documents?.id_front?.document?.data && (
            <a href={documents.id_front.document.data} download={documents.id_front.document.name} className="flex items-center no-underline text-black">
              <FiDownload />
            </a>
          ),
        },
        {
          title: "ID Back Image",
          data: documents?.id_back?.document?.data && (
            <a href={documents.id_back.document.data} download={documents.id_back.document.name} className="flex items-center no-underline text-black">
              <FiDownload />
            </a>
          ),
        },
      ],
    },
    {
      title: "Passport Details",
      fields: [
        { title: "Passport Number", data: visa.passport_number },
        { title: "Issuance Country", data: visa.Passport_Issuance_Country },
        { title: "Issuance Date", data: visa.Passport_Issuance_Date },
        { title: "Expiry Date", data: visa.Passport_Expiry_Date },
        {
          title: "Passport Copy",
          data: documents?.passport_copy?.document?.data && (
            <a href={documents.passport_copy.document.data} download={documents.passport_copy.document.name} className="flex items-center no-underline text-black">
              <FiDownload />
            </a>
          ),
        },
      ],
    },
    {
      title: "Insurance Details",
      fields: [
        { title: "DHA ID", data: visa.dha_id },
        { title: "Card Number", data: visa.card_number },
        { title: "Insurance Policy", data: visa.insurance_policy },
        { title: "Insurance Company", data: visa.insurance_company },
        { title: "Active Date", data: visa.insurance_active_date },
        { title: "Expiry Date", data: visa.insurance_expiry_date },
      ],
    },
    {
      title: "Visa Details",
      fields: [
        { title: "Entry Permit Number", data: visa.entry_permit_number },
        { title: "Issuance Country", data: visa.country_of_visa_issuance },
        { title: "Issuance Date", data: visa.visa_issuance_date },
        { title: "Expiry Date", data: visa.visa_expiry_date },
        { title: "UID Number", data: visa.uid_number },
      ],
    },
  ];
  
  return (
    <div className="w-full bg-[#f0f1f2] scroll-auto overflow-auto max-h-[100vh] md:px-4 xl:px-8">
      {/******************** HEADER **************************/}
      <div className="flex justify-between px-10 pt-10 pb-7">
        <h1 className="text-[24px]">Profile</h1>
        <div onClick={() => navigate("/employees")} className="flex cursor-pointer items-center gap-3 text-[20px]">
          Go Back <FaChevronCircleLeft/>
        </div>
      </div>
      {/* ************************** BODY *************************** */}
      {loading ? <Loader/> : 
      <div className="py-2 bg-white rounded-md">
        {/* ******************** BODY HEAD ************************** */}
        <div className="px-10">
          <div className="opacity-60 mb-4">
            View Employee Data {`> ${userData.personalInformation?.first_name} ${userData.personalInformation?.last_name}`}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[25px]">
                {userData.personalInformation?.first_name} {userData.personalInformation?.last_name}
              </h2>
              <div className="opacity-60">
                ID: TXB-{id.toString().padStart(4, "0")}
              </div>
            </div>
            <button className="flex items-center gap-x-2 py-2 opacity-50 text-base font-semibold leading-6 border-2 border-black rounded-lg font-opensans px-4">
              <div>Download</div>
              <FiDownload />
            </button>
          </div>
        </div>
        <hr className="mt-2" />
        {/* ******************** BODY CONTENT *********************** */}
        <div className="px-10 pt-10">
          <PersonalDetials  personalInfo={personalInfo} userData={userData}/>
          <div className="flex gap-5 justify-between 800:flex-row flex-col">
          <ContactInformation  contactInformation={contactInformation}/>
          <BankInformation  bankInformation={bankInformation}/>
          </div>
          <WorkInformation  workInformation={workInformation}/>
          {(Array.isArray(experiences) && experiences?.length > 0) &&
            <Experience cv={cv} experience={experiences}/>
          }
          {(Array.isArray(educations) && educations?.length > 0) &&
            <AcademicInfo educations={educations}/>
          }
          {(Array.isArray(certifications) && certifications?.length > 0) &&
            <Certifications certifications={certifications}/>
          }
          <IdentificationDetails identificationDetails={identificationDetails}/>
        </div>
      </div>
}
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
