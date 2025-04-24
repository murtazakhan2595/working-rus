import { Header } from "components";
import { Card } from "components/ui/card";
import React, { useEffect, useState } from "react";
import TableCustom from "components/CustomTable";
import OrganizationAction from "../sections/Organizations/OrganizationAction";
import AddOrganization from "../sections/Organizations/AddOrganization";
import { getWorkingHours } from "app/hooks/general";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import Departments from "./Departments";
import Branches from "./Branches";
import Designations from "./Designations";
import AddDepartment from "../sections/Departments/AddDepartment";
import AddBranch from "./Branches/AddBranch";
import { getOrganizationList } from "app/hooks/general";
import { CardContent } from "components/ui/card";
import AddDesignation from "../sections/Designations/AddDesignation";
import WorkingHours from "./WorkingHours";
import Shift from "../sections/Shift/Shift";
import { PageLoader } from "components";
import { getDepartmentList } from "app/hooks/general";
import { getDesignationList } from "app/hooks/general";
import OnboardingChecklist from "./OnboardingChecklist";
import OnboardingTab from "../sections/OnboardingChecklist/OnboardingTab";
import { getOnboardingDocument } from "app/hooks/officeSetting";
import ViewOrganization from "../sections/Organizations/ViewOrganization";
import { Button } from "components/ui/button";

const OfficeSetting = () => {
  const [data, setData] = useState(null);
  const [dataShift, setDataShift] = useState(null);
  const [edit, setEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [activeTab, setActiveTab] = useState("offices");
  const [loading, setLoading] = useState(true);
  const [depLoading, setDepLoading] = useState(true);
  const [department, setDepartments] = useState(null);
  const [reloadBranchesData, setReloadBranchesData] = useState(false);
  const [depOptions, setdepOptions] = useState({ page: 1, sizePerPage: 10 });
  const [desigOptions, setDesigOptions] = useState({
    page: 1,
    sizePerPage: 10,
  });

  
  const [designLoading, setDesignLoading] = useState(true);
  const [designation, setDesignation] = useState(null);
  const [onboardingDocs, setOnboardingDocs] = useState([]);
  const [onboardingLoading, setOnboardingLoading] = useState(true);
  const [organizationData, setOrganizationData] = useState(null);

  const getOrganization = async () => {
    try {
      console.log("Fetching organization data...");
      setLoading(true);
      const response = await getOrganizationList(true);
      console.log("Organization API response in component:", response);
      if (response) {
        setData(response);
        // Set the first organization as the active one if available
        if (response.results && response.results.length > 0) {
          setOrganizationData(response.results[0]);
          console.log("First organization set:", response.results[0]);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("ERROR", error);
    }
  };

  const fetchShifts = async () => {
    try {
      setLoading(true);
      const response = await getWorkingHours();
      if (response?.results) {
        const formattedData = response.results.map((item) => ({
          ...item,
        }));
        setDataShift(formattedData);
      }
      setLoading(false);
    } catch (error) {
      console.error(error, "ERROR");
    }
  };

  const getDepartments = async () => {
    try {
      setDepLoading(true);
      const departmentResponse = await getDepartmentList({
        options: depOptions,
      });
      setDepartments(departmentResponse);
    } catch (error) {
      console.error("Error fetching lists:", error);
    } finally {
      setDepLoading(false);
    }
  };

  const getDesignations = async () => {
    setDesignLoading(true);
    try {
      const response = await getDesignationList({
        options: desigOptions,
      });
      setDesignation(response);
    } catch (error) {
      console.error("Error fetching lists:", error);
    } finally {
      setDesignLoading(false);
    }
  };

  // Function to fetch onboarding documents
  const getOnboardingDocuments = async () => {
    setOnboardingLoading(true);
    try {
      const response = await getOnboardingDocument();

      setOnboardingDocs(response.results);
    } catch (error) {
      console.error("Error fetching onboarding documents:", error);
    } finally {
      setOnboardingLoading(false);
    }
  };

  const handleSubmit = (values) => {
    console.log(values, "FORM SUBMMTIED VALUES");
  };

  useEffect(() => {
    const fetchData = async () => {
      getOrganization();
      fetchShifts();
      getDepartments();
      getDesignations();
      getOnboardingDocuments();
    };
    fetchData();
  }, []);

  const tabsData = [
    { value: "offices", label: "Organization" },
    { value: "department", label: "Department" },
    { value: "designation", label: "Designation" },
    { value: "branches", label: "Branches" },
    { value: "working-hours", label: "Working Hours" },
    { value: "onboarding", label: "Onboarding Checklist" },
  ];

  return (
    <div>
      {loading ? (
        <PageLoader />
      ) : (
        <div className="flex flex-col gap-4 profile-management">
          <Header
            content={
              activeTab === "offices" ? (
                <AddOrganization reload={getOrganization} />
              ) : activeTab === "department" ? (
                <AddDepartment reload={getDepartments} />
              ) : activeTab === "designation" ? (
                <AddDesignation reload={getDesignations} />
              ) : activeTab === "working-hours" ? (
                <Shift reload={fetchShifts} />
              ) : activeTab === "branches" ? (
                <AddBranch reload={setReloadBranchesData} />
              ) : (
                <OnboardingTab reload={getOnboardingDocuments} />
              )
            }
          />
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            defaultValue="offices"
          >
            <div className="flex justify-start">
              <TabsList className="flex justify-center mb-4">
                {tabsData?.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="data-[state=active]:bg-primary-200 w-40  data-[state=active]:text-primary-1100 rounded-sm data-[state-active]:font-medium"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <TabsContent value="offices">
              <Card>
                <CardContent>
                  {data?.results && data.results.length > 0 ? (
                    <div className="space-y-10">
                      {data.results.map((organization, index) => (
                        <div key={organization.id || index} className="mb-8">
                          <div className="flex items-center justify-between pb-2 mb-4 border-b">
                            <h3 className="text-lg font-medium">Organization {index + 1}</h3>
                            <Button
                              variant="outline"
                              size="sm"
                              className="px-2 py-1 hover:bg-primary hover:text-white hover:border-primary"
                              onClick={() => {
                                setEdit(true);
                                setEditData(organization);
                              }}
                              title="Edit Organization"
                            >
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="16" 
                                height="16" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className="mr-1 lucide lucide-pencil"
                              >
                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                                <path d="m15 5 4 4"/>
                              </svg>
                              Edit
                            </Button>
                          </div>
                          <ViewOrganization
                            data={organization}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-gray-500">No organization data available. Please add an organization.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="department">
              <Departments
                loading={depLoading}
                options={depOptions}
                setOPtions={setdepOptions}
                getDepartments={getDepartments}
                department={department}
              />
            </TabsContent>
            <TabsContent value="branches">
              <Branches
                loading={depLoading}
                options={depOptions}
                reload={reloadBranchesData}
                setOPtions={setdepOptions}
                getDepartments={getDepartments}
                department={department}
              />
            </TabsContent>
            <TabsContent value="designation">
              <Designations
                loading={designLoading}
                options={desigOptions}
                setOptions={setDesigOptions}
                designation={designation}
                setDesignation={setDesignation}
                getDesignations={getDesignations}
              />
            </TabsContent>
            <TabsContent value="working-hours">
              <WorkingHours data={dataShift} reload={fetchShifts} />
            </TabsContent>
            <TabsContent value="onboarding">
              {onboardingLoading ? (
                <PageLoader />
              ) : (
                <OnboardingChecklist
                  data={onboardingDocs}
                  reload={getOnboardingDocuments}
                />
              )}
            </TabsContent>
          </Tabs>
          {activeTab === "offices" && edit && (
            <AddOrganization
              reload={getOrganization}
              edit={edit}
              editData={editData}
              setEdit={setEdit}
              setEditData={setEditData}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default OfficeSetting;
