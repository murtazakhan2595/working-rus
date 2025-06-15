import React, { useEffect, useState } from "react";
import { getEmployeeData } from "app/hooks/employee";
import Avatar from "components/ui/Avatar";
import { Button } from "components/ui/button";
import { Card, CardContent } from "components/ui/card";
import { ArrowLeft, ShieldX } from "lucide-react";
import { HasAccess } from "utils/PermissionUtils";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { DesignationName, EmployeeID } from "utils/getValuesFromTables";
import { PageLoader } from "components";
import { connect } from "react-redux";
import PersonalDetials from "./PersonalDetials";
import ContactInformation from "./ContactInformation";
import WorkInformation from "./WorkInformation";
import BankInformation from "./BankInformation";
import Experience from "./Experience";
import AcademicInfo from "./AcademicDetials";
import Certifications from "./Certifications";
import IdentificationDetails from "./IdentificationDetails";
import { DepartmentName } from "utils/getValuesFromTables";
import { Header } from "components";
import ReadOnlyOnboardingChecklist from "./OnboardingChecklist";
import moment from "moment";
import ProfileCompletionBar from "./ProfileCompletionBar";

// Unauthorized component for tabs
const UnauthorizedTabContent = ({ tabName }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
    <div className="bg-red-50 rounded-full p-4 mb-4">
      <ShieldX className="w-12 h-12 text-red-500" />
    </div>
    <h3 className="text-xl font-semibold text-red-700 mb-2">
      Access Denied
    </h3>
    <p className="text-red-600 text-center max-w-md">
      You don't have permission to view {tabName} information. 
      Please contact your administrator to request access.
    </p>
  </div>
);

const ViewEmployee = ({ userProfile, profileView }) => {
  // Permission checks for different profile sections
  const canViewPersonalInfo = HasAccess("VIEW_PERSONAL_INFORMATION");
  const canEditPersonalInfo = HasAccess("EDIT_PERSONAL_INFORMATION");
  const canViewJobInfo = HasAccess("VIEW_JOB_INFORMATION");
  const canViewAcademicInfo = HasAccess("VIEW_ACADEMIC_INFORMATION");
  const canEditAcademicInfo = HasAccess("EDIT_ACADEMIC_INFORMATION");
  const canViewExperienceInfo = HasAccess("VIEW_EXPERIENCE_INFORMATION");
  const canEditExperienceInfo = HasAccess("EDIT_EXPERIENCE_INFORMATION");
  const canViewCertificationInfo = HasAccess("VIEW_CERTIFICATION_INFORMATION");
  const canEditCertificationInfo = HasAccess("EDIT_CERTIFICATION_INFORMATION");
  const canViewIdentificationInfo = HasAccess("VIEW_IDENTIFICATION_INFORMATION");
  const canEditIdentificationInfo = HasAccess("EDIT_IDENTIFICATION_INFORMATION");

  const [employeeData, setEmployeeData] = React.useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal");
  const { id } = useParams();
  const userId = profileView ? userProfile?.id : id;
  const navigate = useNavigate();
  const location = useLocation();

  const getDataByHooks = async () => {
    setLoading(true);
    try {

      let empData = await getEmployeeData(userId);
      setEmployeeData(empData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getDataByHooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Always show all tabs, but show 401 for unauthorized access
  const tabsData = [
    { value: "personal", label: "Personal", hasAccess: canViewPersonalInfo },
    { value: "job", label: "Job", hasAccess: canViewJobInfo },
    { value: "bankDetails", label: "Bank Details", hasAccess: canViewJobInfo },
    { value: "security", label: "Security", hasAccess: canViewIdentificationInfo },
    { 
      value: "qualification", 
      label: "Qualification", 
      hasAccess: canViewAcademicInfo || canViewExperienceInfo || canViewCertificationInfo 
    },
    { value: "onboardingChecklist", label: "Onboarding Checklist", hasAccess: true }, // Always accessible for HR/Admin
  ];

  // Set default tab to first accessible tab
  useEffect(() => {
    const firstAccessibleTab = tabsData.find(tab => tab.hasAccess);
    if (firstAccessibleTab && activeTab === "personal" && !canViewPersonalInfo) {
      setActiveTab(firstAccessibleTab.value);
    }
  }, []);

  // If user has no permissions to view any profile information
  if (!canViewPersonalInfo && !canViewJobInfo && !canViewIdentificationInfo && !canViewAcademicInfo && !canViewExperienceInfo && !canViewCertificationInfo) {
    return (
      <div className="container p-4 mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <div className="bg-red-50 rounded-full p-4 mb-4">
            <ShieldX className="w-16 h-16 text-red-500" />
          </div>
          <h2 className="text-2xl font-semibold text-red-700 mb-2">
            Unauthorized Access
          </h2>
          <p className="text-red-600 text-center max-w-md">
            You don't have permission to view any profile information. 
            Please contact your administrator to request access.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {loading ? (
        <PageLoader />
      ) : (
        <div className="container p-4 mx-auto">
          {/* if the pathname starts with /user/ then show the go back button */}
          {location.pathname.startsWith("/user/") && (
            <div className="mb-4">
              <Button
                variant="ghost"
                onClick={() => {
                  navigate(-1);
                }}
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
              <CardContent className="flex items-center justify-between pt-6 ">
                <div className="flex items-center space-x-4">
                  <Avatar
                    src={employeeData?.profile_picture}
                    alt={`${employeeData?.first_name} ${employeeData?.last_name}`}
                    fallbackText={employeeData?.first_name?.[0]}
                  />
                  <div>
                    <p className="text-base text-black">
                      <EmployeeID value={employeeData?.serial_number} />
                    </p>
                    <h2 className="text-2xl font-bold text-black">
                      {employeeData?.first_name} {employeeData?.last_name}
                    </h2>
                    <p className="text-base text-muted-foreground">
                      <DesignationName
                        value={employeeData?.department_position}
                      />{" "}
                      | <DepartmentName value={employeeData.department_name} />
                    </p>
                    <p className="text-base text-muted-foreground">
                      {employeeData?.employee_status === "Active"
                        ? "Permanent"
                        : employeeData?.employee_status === "Probation"
                        ? "Probation"
                        : ""}
                    </p>
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>
          <Card className="mb-4">
            <CardContent className="py-4">
              <ProfileCompletionBar employeeData={employeeData} />
            </CardContent>
          </Card>
          <div>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              defaultValue={tabsData.find(tab => tab.hasAccess)?.value || "personal"}
            >
              <div className="flex flex-col justify-between lg:flex-row md:flex-row xl:flex-row">
                <TabsList className="flex justify-center mb-4">
                  {tabsData?.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className={`data-[state=active]:bg-primary-200 w-fit data-[state=active]:text-primary-1100 rounded-sm data-[state-active]:font-medium ${
                        !tab.hasAccess ? 'opacity-50 text-red-600' : ''
                      }`}
                      title={!tab.hasAccess ? "You don't have permission to access this section" : ""}
                    >
                      {tab.label}
                      {!tab.hasAccess && (
                        <ShieldX className="w-3 h-3 ml-1 text-red-500" />
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              {/* Personal Tab */}
              <TabsContent value="personal">
                {canViewPersonalInfo ? (
                  <div className="grid w-full grid-cols-1 gap-4 my-2 mb-4 ">
                    <PersonalDetials
                      isEditable={profileView && canEditPersonalInfo}
                      userId={userId}
                      getDataByHooks={getDataByHooks}
                    />
                    <ContactInformation
                      userData={employeeData}
                      isEditable={profileView && canEditPersonalInfo}
                      employeeId={employeeData.id}
                      getDataByHooks={getDataByHooks}
                    />
                  </div>
                ) : (
                  <UnauthorizedTabContent tabName="Personal" />
                )}
              </TabsContent>
              
              {/* Bank Tab */}
              <TabsContent value="bankDetails">
                {canViewPersonalInfo ? (
                  <BankInformation
                      isEditable={profileView && canEditPersonalInfo}
                    userData={employeeData}
                    userId={userId}
                    getDataByHooks={getDataByHooks}
                  />
                ) : (
                  <UnauthorizedTabContent tabName="Job" />
                )}
              </TabsContent>

              {/* Bank Tab */}
              <TabsContent value="job">
                {canViewJobInfo ? (
                  <WorkInformation
                    isEditable={!profileView}
                    userData={employeeData}
                    employeeId={employeeData.id}
                    getDataByHooks={getDataByHooks}
                  />
                ) : (
                  <UnauthorizedTabContent tabName="Job" />
                )}
              </TabsContent>
              
              {/* Security Tab */}
              <TabsContent value="security">
                {canViewIdentificationInfo ? (
                  <IdentificationDetails
                    isEditable={profileView && canEditIdentificationInfo}
                    employeeId={employeeData.id}
                  />
                ) : (
                  <UnauthorizedTabContent tabName="Security" />
                )}
              </TabsContent>
              
              {/* Qualification Tab */}
              <TabsContent value="qualification">
                {(canViewAcademicInfo || canViewExperienceInfo || canViewCertificationInfo) ? (
                  <div className="grid w-full grid-cols-1 gap-4 my-2 mb-4">
                    {canViewAcademicInfo ? (
                      <AcademicInfo 
                        isEditable={profileView && canEditAcademicInfo} 
                        employeeId={userId} 
                      />
                    ) : (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-center">
                          <ShieldX className="w-4 h-4 inline mr-2" />
                          You don't have permission to view Academic Information
                        </p>
                      </div>
                    )}
                    {canViewExperienceInfo ? (
                      <Experience 
                        isEditable={profileView && canEditExperienceInfo} 
                        employeeId={userId} 
                      />
                    ) : (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-center">
                          <ShieldX className="w-4 h-4 inline mr-2" />
                          You don't have permission to view Experience Information
                        </p>
                      </div>
                    )}
                    {canViewCertificationInfo ? (
                      <Certifications
                        isEditable={profileView && canEditCertificationInfo}
                        employeeId={employeeData.id}
                      />
                    ) : (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-center">
                          <ShieldX className="w-4 h-4 inline mr-2" />
                          You don't have permission to view Certification Information
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <UnauthorizedTabContent tabName="Qualification" />
                )}
              </TabsContent>
              
              <TabsContent value="onboardingChecklist">
                {/* Using the read-only version of the checklist component */}
                <ReadOnlyOnboardingChecklist employeeId={employeeData.id} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
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
