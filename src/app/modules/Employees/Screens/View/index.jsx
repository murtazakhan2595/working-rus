import React, { useEffect, useState } from "react";
import { FaChevronCircleLeft } from "react-icons/fa";
import {
  getEmployeeCVDetailData,
  getEmployeeData,
  getEmployeeProfessionalExperianceData,
  getEmployeeAcademicRecordData,
} from "app/hooks/employee";
import Avatar from "components/ui/Avatar";
import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  ArrowLeft,
  CalendarIcon,
  Filter,
} from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";

import { format } from "date-fns";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  getEmployeePayrollById,
  getSalaryRevisionByPayrollId,
  getSalaryRevision,
  getEmployeeEarnAndDeduction,
} from "app/hooks/payroll";
import {
  DesignationName,
  EmployeeID,
  getExperience,
} from "utils/getValuesFromTables";
import { numberToWords } from "utils/renderValues.js";
import { PageLoader } from "components";
import { revisionLetterOptions, revisionStatusOptions } from "data/Data";
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
import { DepartmentName } from "utils/getValuesFromTables";
import { Header } from "components";
const ViewEmployee = ({ userProfile, profileView }) => {
  const [employeeData, setEmployeeData] = React.useState({});
  const [educations, setEducations] = useState([{}]);
  const [experiences, setExperiences] = useState([{}]);
  const [cv, setCV] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal");
  const { id } = useParams();
  const userId = profileView ? userProfile?.id : id;
  const navigate = useNavigate();
  const location = useLocation();

  console.log("Current path:", location.pathname);

  const getDataByHooks = async () => {
    setLoading(true);
    try {
      let empData = await getEmployeeData(userId);
      let expData = await getEmployeeProfessionalExperianceData(userId);
      let cvData = await getEmployeeCVDetailData(userId);
      let educationData = await getEmployeeAcademicRecordData(userId);
      setEmployeeData(empData);
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

  const tabsData = [
    { value: "personal", label: "Personal" },
    { value: "job", label: "Job" },
    { value: "security", label: "Security" },
    { value: "qualification", label: "Qualification" },
  ];

  return (
    <>
      {loading? <PageLoader/> : <div className="container p-4 mx-auto">
      {/* if the pathname starts with /user/ then show the go back button */}
        {location.pathname.startsWith("/user/") && (
          <div className="mb-4">
            <Button
              variant="ghost"
              onClick={() => {navigate(-1)}}
              className="p-4 text-xl text-balance"
            >
              <ArrowLeft className="w-6 h-6 mr-2 bg-white rounded-lg shadow-sm" />
              Go Back
            </Button>
          </div>
        )}
        {/* if the pathname is /my-profile then show the header */}
        {location.pathname === "/my-profile" && <Header />}
        <div className="my-5">
          <Card>
            <CardContent className="flex items-center pt-6 space-x-4">
              <Avatar
                src={
                  employeeData?.profile_picture?.file ||
                  employeeData?.profile_picture
                }
                alt={`${employeeData?.first_name} ${employeeData?.last_name}`}
                fallbackText={employeeData?.first_name[0]}
              />
              <div>
                <p className="text-base text-black">
                  <EmployeeID value={userId} />
                </p>
                <h2 className="text-2xl font-bold text-black">
                  {employeeData?.first_name} {employeeData?.last_name}
                </h2>
                <p className="text-base text-muted-foreground">
                  <DesignationName value={employeeData?.department_position} />{" "}
                  | <DepartmentName value={employeeData.department_name} />
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            defaultValue="salary"
          >
            <div className="flex flex-col justify-between lg:flex-row md:flex-row xl:flex-row">
              <TabsList className="flex justify-center mb-4">
                {tabsData?.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="data-[state=active]:bg-plum-500 w-28 data-[state=active]:text-plum-900 rounded-full data-[state-active]:font-medium"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <TabsContent value="personal">
              <div className="grid grid-cols-2 gap-4 my-2 mb-4">
                <PersonalDetials
                  isEditable={profileView}
                  userData={employeeData}
                  getDataByHooks={getDataByHooks}
                />
                <ContactInformation
                  userData={employeeData}
                  isEditable={profileView}
                  employeeId={employeeData.id}
                  getDataByHooks={getDataByHooks}
                />
              </div>
            </TabsContent>
            <TabsContent value="job">
              <WorkInformation
                isEditable={!profileView}
                userData={employeeData}
                employeeId={employeeData.id}
                getDataByHooks={getDataByHooks}
              />
            </TabsContent>
            <TabsContent value="security">
              <IdentificationDetails
                isEditable={profileView}
                employeeId={employeeData.id}
              />
            </TabsContent>
            <TabsContent value="qualification">
              <div className="grid grid-cols-1 gap-4 my-2 mb-4">
                {Array.isArray(educations) && educations?.length > 0 && (
                  <AcademicInfo
                    isEditable={profileView}
                    educations={educations}
                    employeeId={employeeData.id}
                    getDataByHooks={getDataByHooks}
                  />
                )}
                {Array.isArray(experiences) && experiences?.length > 0 && (
                  <Experience
                    isEditable={profileView}
                    cv={cv}
                    experience={experiences}
                    employeeId={employeeData.id}
                    getDataByHooks={getDataByHooks}
                  />
                )}
                <Certifications
                  isEditable={profileView}
                  employeeId={employeeData.id}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>}
    </>
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
