import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaChevronCircleLeft } from "react-icons/fa";
import {
  getEmployeeCVDetailData,
  getEmployeeData,
  getEmployeeProfessionalExperianceData,
  getEmployeeAcademicRecordData,
} from "app/hooks/employee";
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
import Loader from "components/PageLoader";
import { getCountryFullName } from "utils/getValuesFromTables";
import moment from "moment";
import { getVisaLabel } from "../../../../../utils/getVisaLabel";
import DownloadData from "./DownloadButton";

const ViewEmployee = ({ token, baseUrl, userProfile, profileView }) => {
  const [userData, setUserData] = useState({});
  const [educations, setEducations] = useState([{}]);
  const [experiences, setExperiences] = useState([{}]);
  const [cv, setCV] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const userId = profileView ? userProfile?.id : id;
  const navigate = useNavigate();
  const getDataByHooks = async () => {
    setLoading(true);
    try {
      let empData = await getEmployeeData(userId);
      let expData = await getEmployeeProfessionalExperianceData(userId);
      let cvData = await getEmployeeCVDetailData(userId);
      let educationData = await getEmployeeAcademicRecordData(userId);

      setUserData(empData);
      setExperiences(expData);
      setCV(cvData);
      setEducations(educationData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getDataByHooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

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
        // userData?.emergency_first_name + " " + userData?.emergency_last_name,
        userData?.emergency_first_name,
    },
    { title: "Relation", sub: true, data: userData?.emergency_relation },
    { title: "Permanent Address", data: userData?.residential_address },
    { title: "Present Address", data: userData?.current_address },
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

  return (
    <div className="w-full bg-[#f0f1f2] scroll-auto overflow-auto max-h-[100vh] md:px-4 xl:px-8">
      {/******************** HEADER **************************/}
      <div className="flex justify-between px-10 pt-10 pb-7">
        <h1 className="text-[24px]">
          {profileView ? "My Profile" : "Profile Management"}
        </h1>
        <div
          onClick={() => navigate(profileView ? "/" : "/profile-management")}
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
                  {/* <DownloadData
                    userData={userData}
                    experiences={experiences}
                    visa={[]}
                    certifications={certifications}
                  /> */}
                </div>
              </div>
              <hr className="mt-2" />
            </>
          )}
          {/* ******************** BODY CONTENT *********************** */}
          <>
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
                  getDataByHooks={getDataByHooks}
                />
                <BankInformation
                  isEditable={profileView}
                  bankInformation={bankInformation}
                  employeeId={userData.id}
                  getDataByHooks={getDataByHooks}
                />
              </div>
              <WorkInformation
                isEditable={!profileView}
                userData={userData}
                employeeId={userData.id}
                getDataByHooks={getDataByHooks}
              />
              {Array.isArray(experiences) && experiences?.length > 0 && (
                <Experience
                  isEditable={profileView}
                  cv={cv}
                  experience={experiences}
                  employeeId={userData.id}
                  getDataByHooks={getDataByHooks}
                />
              )}
              {Array.isArray(educations) && educations?.length > 0 && (
                <AcademicInfo
                  isEditable={profileView}
                  educations={educations}
                  employeeId={userData.id}
                  getDataByHooks={getDataByHooks}
                />
              )}
              <Certifications
                isEditable={profileView}
                employeeId={userData.id}
              />
              <IdentificationDetails
                isEditable={profileView}
                employeeId={userData.id}
              />
            </div>
          </>
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
