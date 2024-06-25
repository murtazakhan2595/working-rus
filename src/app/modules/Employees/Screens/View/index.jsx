import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaChevronCircleLeft } from "react-icons/fa";
import {
  getEmployeeCVDetailData,
  getEmployeeVisaDetailData,
  getEmployeeCerficationData,
  getEmployeeData,
  getEmployeeProfessionalExperianceData,
  getEmployeeAcademicRecordData,
  getEmployeeVisaDetailsFiles,
} from "../../../../hooks/employee";
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
import Loader from "../../../../../components/PageLoader";
import {getCountryFullName} from "../../../../../utils/getValuesFromTables";
import moment from "moment";
import { getVisaLabel } from "../../../../../utils/getVisaLabel";

const ViewEmployee = ({ token, baseUrl, userProfile, profileView }) => {
  const [userData, setUserData] = useState("");
  const [educations, setEducations] = useState([{}]);
  const [certifications, setCertifications] = useState([{}]);
  const [experiences, setExperiences] = useState([{}]);
  const [cv, setCV] = useState({});
  const [documents, setDocuments] = useState({});
  const [visa, setVisa] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const userId = profileView ? userProfile?.id : id;
  const navigate = useNavigate();

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const getDataByHooks = async () => {
    setLoading(true);
    let empData = await getEmployeeData(baseUrl, userId, headers);
    let expData = await getEmployeeProfessionalExperianceData(
      baseUrl,
      userId,
      token
    );
    let cvData = await getEmployeeCVDetailData(baseUrl, userId, token);
    let visaData = await getEmployeeVisaDetailData(baseUrl, userId, token);
    let educationData = await getEmployeeAcademicRecordData(
      baseUrl,
      userId,
      token
    );
    let certificationData = await getEmployeeCerficationData(
      baseUrl,
      userId,
      token
    );
    let documentsData = await getEmployeeVisaDetailsFiles(
      baseUrl,
      userId,
      token
    );
    setUserData(empData);
    setExperiences(expData);
    setCV(cvData);
    setVisa(visaData);
    setEducations(educationData);
    setCertifications(certificationData);
    setDocuments(documentsData);
    setLoading(false);
  };

  
  useEffect(() => {
    getDataByHooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const personalInfo = [
    [
      { title: "First Name", data: userData.first_name },
      { title: "ID Card No", data: userData?.nic },
      { title: "Contact No", data: userData?.mobile_no },
      { title: "Nationality", data: getCountryFullName(userData?.nationality) },
      { title: "Father Name", data: userData?.father_name },
    ],
    [
      { title: "Last Name", data: userData?.last_name },
      {
        title: "Date of Birth",
        // data: convertDateToDayMonthYear(userData?.date_of_birth),
        data: moment(userData.date_of_birth, "YYYY-MM-DD").format("DD-MM-YYYY"),
      },
      { title: "Email Address", data: userData?.other_email },
      { title: "Marital Status", data: userData?.marital_status },
      { title: "Mother Name", data: userData?.mother_name },
    ],
  ];

  const contactInformation = [
    { title: "Emergency Contact", data: userData?.emergency_phone_no },
    {
      title: "Full Name",
      sub: true,
      data:
        userData?.emergency_first_name + " " + userData?.emergency_last_name,
    },
    { title: "Relation", sub: true, data: userData?.emergency_relation },
    { title: "Permenent Address", data: userData?.residential_address },
    // { title: "Postal Code", sub : true,  data: "" },
    { title: "Present Address", data: userData?.current_address },
    // { title: "Postal Code", sub : true , data: "" },
  ];

  const bankInformation = [
    { title: "Bank Name", data: userData?.bank_name },
    { title: "Account Title", data: userData?.account_title },
    { title: "Account Number", data: userData?.account_number },
    { title: "IBAN", data: userData?.account_iban },
    { title: "Branch Address", data: userData?.branch_address },
    { title: "Branch Code", data: userData?.branch_code },
    { title: "Swift Code", data: userData?.swift_code },
  ];

  const workInformation = [
    [
      { title: "Department", data: userData?.department_name },
      { title: "Position", data: userData?.department_position },
      { title: "Work Email", data: userData?.work_email },
      { title: "Employee Type", data: userData?.employee_type },
    ],
    [
      { title: "Employee Status", data: userData?.employee_status },
      { title: "Work Type", data: userData?.employee_work_type },
      {
        title: "Work Location",
        data: getCountryFullName(userData?.employee_location),
      },
      { title: "Direct Report To", data: userData?.direct_report },
    ],
    [
      { title: "Department Head", data: userData?.department_manager },
      {
        title: "Joining Date",
        data: moment(userData?.joining_date, "YYYY-MM-DD").format("DD-MM-YYYY"),
      },
    ],
  ];

  const identificationDetails = [
    {
      title: "ID Details",
      fields: [
        { title: "Current Country ID", data: visa.living_country_id_no },
        { title: "Issuance Country", data: visa.place_of_issuance },
        {
          title: "ID Issuance Date",
          data: moment(visa.id_issuance_date, "YYYY-MM-DD").format(
            "DD-MM-YYYY"
          ),
        },
        {
          title: "ID Expiry Date",
          data: moment(visa?.id_expiry_date, "YYYY-MM-DD").format("DD-MM-YYYY"),
        },
        {
          title: "ID Front Image",
          data: documents?.id_front?.document?.file && (
            <a
              href={documents.id_front.document.file}
              download={documents.id_front.document.name}
              className="flex items-center no-underline text-black"
            >
              <FiDownload />
            </a>
          ),
        },
        {
          title: "ID Back Image",
          data: documents?.id_back?.document?.file && (
            <a
              href={documents.id_back.document.file}
              download={documents.id_back.document.name}
              className="flex items-center no-underline text-black"
            >
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
        {
          title: "Issuance Country",
          data: getCountryFullName(visa.Passport_Issuance_Country),
        },
        {
          title: "Issuance Date",
          data: moment(visa?.Passport_Issuance_Date, "YYYY-MM-DD").format(
            "DD-MM-YYYY"
          ),
        },
        {
          title: "Expiry Date",
          data: moment(visa?.Passport_Expiry_Date, "YYYY-MM-DD").format(
            "DD-MM-YYYY"
          ),
        },
        {
          title: "Passport Copy",
          data: documents?.passport_copy?.document?.file && (
            <a
              href={documents.passport_copy.document.file}
              download={documents.passport_copy.document.name}
              className="flex items-center no-underline text-black"
            >
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
        {
          title: "Active Date",
          data: moment(visa?.insurance_active_date, "YYYY-MM-DD").format(
            "DD-MM-YYYY"
          ),
        },
        {
          title: "Expiry Date",

          data: moment(visa?.insurance_expiry_date, "YYYY-MM-DD").format(
            "DD-MM-YYYY"
          ),
        },
        {
          title: "Insurance Card",
          data: documents?.insurance_card?.document?.file && (
            <a
              href={documents.insurance_card.document.file}
              download={documents.insurance_card.document.name}
              className="flex items-center no-underline text-black"
            >
              <FiDownload />
            </a>
          ),
        },
      ],
    },
    {
      title: "Visa Details",
      fields: [
        { title: "Entry Permit Number", data: visa.entry_permit_number },
        { title: "Visa Type", data: getVisaLabel(visa.visa_type) },
        {
          title: "Issuance Country",
          data: getCountryFullName(visa.country_of_visa_issuance),
        },
        {
          title: "Issuance Date",
          data: moment(visa.visa_issuance_date, "YYYY-MM-DD").format(
            "DD-MM-YYYY"
          ),
        },
        {
          title: "Expiry Date",
          data: moment(visa.visa_expiry_date, "YYYY-MM-DD").format(
            "DD-MM-YYYY"
          ),
        },
        { title: "UID Number", data: visa.uid_number },
        {
          title: "Entry Permit",
          data: documents?.enter_permit?.document?.file && (
            <a
              href={documents.enter_permit.document.file}
              download={documents.enter_permit.document.name}
              className="flex items-center no-underline text-black"
            >
              <FiDownload />
            </a>
          ),
        },
        {
          title: "Visa Page",
          data: documents?.visa_page?.document?.file && (
            <a
              href={documents.visa_page.document.file}
              download={documents.visa_page.document.name}
              className="flex items-center no-underline text-black"
            >
              <FiDownload />
            </a>
          ),
        },
        {
          title: "Medical Result",
          data: documents?.medical?.document?.file && (
            <a
              href={documents.medical.document.file}
              download={documents.medical.document.name}
              className="flex items-center no-underline text-black"
            >
              <FiDownload />
            </a>
          ),
        },
        {
          title: "ID Application",
          data: documents?.id_application?.document?.file && (
            <a
              href={documents.id_application.document.file}
              download={documents.id_application.document.name}
              className="flex items-center no-underline text-black"
            >
              <FiDownload />
            </a>
          ),
        },
      ],
    },
  ];

  return (
    <div className="w-full bg-[#f0f1f2] scroll-auto overflow-auto max-h-[100vh] md:px-4 xl:px-8">
      {/******************** HEADER **************************/}
      <div className="flex justify-between px-10 pt-10 pb-7">
        <h1 className="text-[24px]">
          {profileView ? "My Profile" : "Profile Management"}
        </h1>
        <div
          onClick={() => navigate(profileView ? "/" : "/employees")}
          className="flex cursor-pointer items-center gap-3 text-[20px]"
        >
          Go Back <FaChevronCircleLeft />
        </div>
      </div>
      {/* ************************** BODY *************************** */}
      {loading ? (
        <Loader />
      ) : (
        <div className="py-2 bg-white rounded-md">
          {/* ******************** BODY HEAD ************************** */}
          {!profileView && (
            <>
              <div className="px-10">
                <div className="opacity-60 mb-4">
                  View Employee Data{" "}
                  {`> ${userData?.first_name} ${userData?.last_name}`}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-[25px]">
                      {userData?.first_name} {userData?.last_name}
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
            </>
          )}
          {/* ******************** BODY CONTENT *********************** */}
          <div className="px-10 pt-10">
            <PersonalDetials
              isEditable={profileView}
              personalInfo={personalInfo}
              userData={userData}
              getDataByHooks={getDataByHooks}
            />
            <div className="flex gap-5 justify-between 800:flex-row flex-col">
              <ContactInformation
                isEditable={profileView}
                contactInformation={contactInformation}
                employeeId={userData.id}
              />
              <BankInformation
                isEditable={profileView}
                bankInformation={bankInformation}
                employeeId={userData.id}
              />
            </div>
            <WorkInformation
              isEditable={!profileView}
              workInformation={workInformation}
              employeeId={userData.id}
            />
            {Array.isArray(experiences) && experiences?.length > 0 && (
              <Experience
                isEditable={profileView}
                cv={cv}
                experience={experiences}
                employeeId={userData.id}
              />
            )}
            {Array.isArray(educations) && educations?.length > 0 && (
              <AcademicInfo
                isEditable={profileView}
                educations={educations}
                employeeId={userData.id}
              />
            )}
            {Array.isArray(certifications) && certifications?.length > 0 && (
              <Certifications
                isEditable={profileView}
                certifications={certifications}
                employeeId={userData.id}
              />
            )}
            <IdentificationDetails
              isEditable={profileView}
              identificationDetails={identificationDetails}
              employeeId={userData.id}
            />
          </div>
        </div>
      )}
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
