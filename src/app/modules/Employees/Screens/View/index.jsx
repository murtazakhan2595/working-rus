import React, { useEffect, useState } from "react";
import { getEmployeeData } from "app/hooks/employee";
import Avatar from "components/ui/Avatar";
import { Button } from "components/ui/button";
import { Card, CardContent } from "components/ui/card";
import { ArrowLeft } from "lucide-react";

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
import Experience from "./Experience";
import AcademicInfo from "./AcademicDetials";
import Certifications from "./Certifications";
import IdentificationDetails from "./IdentificationDetails";
import { DepartmentName } from "utils/getValuesFromTables";
import { Header } from "components";
import ReadOnlyOnboardingChecklist from "./OnboardingChecklist";
import moment from "moment";

const ViewEmployee = ({ userProfile, profileView }) => {
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

  const tabsData = [
    { value: "personal", label: "Personal" },
    { value: "job", label: "Job" },
    { value: "security", label: "Security" },
    { value: "qualification", label: "Qualification" },
    ...(userProfile?.role === 3 || userProfile?.role === 1
      ? [{ value: "onboardingChecklist", label: "Onboarding Checklist" }]
      : []),
  ];

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
                  </div>
                </div>

                {/* Probation Information */}
                {(employeeData?.probation_start_date ||
                  employeeData?.probation_end_date ||
                  employeeData?.probation_period) && (
                  <div className="text-right">
                    <h3 className="text-sm font-semibold  mb-1">
                      Probation Details
                    </h3>
                    <div className="flex flex-col gap-1">
                      {employeeData?.probation_start_date && (
                        <p className="text-sm">
                          <span className="font-medium text-black">
                            Start:
                          </span>{" "}
                          {moment(employeeData.probation_start_date).format(
                            "MMMM Do, YYYY"
                          )}
                        </p>
                      )}
                      {employeeData?.probation_end_date && (
                        <p className="text-sm">
                          <span className="font-medium text-black">
                            End:
                          </span>{" "}
                          {moment(employeeData.probation_end_date).format(
                            "MMMM Do, YYYY"
                          )}
                        </p>
                      )}
                      {employeeData?.probation_period && (
                        <p className="text-sm">
                          <span className="font-medium text-black">
                            Period:
                          </span>{" "}
                          {employeeData.probation_period}
                        </p>
                      )}
                    </div>
                  </div>
                )}
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
                      className="data-[state=active]:bg-primary-200 w-40 data-[state=active]:text-primary-1100 rounded-sm data-[state-active]:font-medium"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              <TabsContent value="personal">
                <div className="grid w-full grid-cols-1 gap-4 my-2 mb-4 ">
                  <PersonalDetials
                    isEditable={profileView}
                    userId={userId}
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
                <div className="grid w-full grid-cols-1 gap-4 my-2 mb-4">
                  <AcademicInfo isEditable={profileView} employeeId={userId} />
                  <Experience isEditable={profileView} employeeId={userId} />
                  <Certifications
                    isEditable={profileView}
                    employeeId={employeeData.id}
                  />
                </div>
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
