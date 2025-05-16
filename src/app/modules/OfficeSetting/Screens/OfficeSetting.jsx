import { Header } from "components";
import { Card } from "components/ui/card";
import React, { useEffect, useState } from "react";
import AddOrganization from "./Organizations/AddOrganization";
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
import AddDepartment from "./Departments/AddDepartment";
import AddBranch from "./Branches/AddBranch";
import { getOrganizationList } from "app/hooks/general";
import { CardContent } from "components/ui/card";
import AddDesignation from "./Designations/AddDesignation";
import WorkingHours from "./WorkingHours";
import Shift from "../sections/Shift/Shift";
import { PageLoader } from "components";
import { getDepartmentList } from "app/hooks/general";
import { getDesignationList } from "app/hooks/general";
import OnboardingChecklist from "./OnboardingChecklist";
import OnboardingTab from "./OnboardingChecklist/OnboardingTab";
import { getOnboardingDocument } from "app/hooks/officeSetting";
import ViewOrganization from "./Organizations/ViewOrganization";
import { Button } from "components/ui/button";
import { useSelector } from "react-redux";
import { CardHeader } from "components/ui/card";
import { CardTitle } from "components/ui/card";
import { CardDescription } from "components/ui/card";
import { getCountryById, getRegionById, getCityById } from "app/hooks/officeSetting";

const OfficeSetting = () => {
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

  // Get user details from Redux store
  const userDetails = useSelector((state) => state.emp?.user_details);
  console.log("User details Or:", userDetails);
  const userOrganizationId = userDetails?.organization_id || userDetails?.organization;
  
  console.log("User organization ID:", userOrganizationId);
  console.log("Full organization field from user:", userDetails?.organization);
  
  const [filteredOrganizations, setFilteredOrganizations] = useState([]);
  
  const [designLoading, setDesignLoading] = useState(true);
  const [designation, setDesignation] = useState(null);
  const [onboardingDocs, setOnboardingDocs] = useState([]);
  const [onboardingLoading, setOnboardingLoading] = useState(true);
  
  const [countryData, setCountryData] = useState({});
  const [stateData, setStateData] = useState({});
  const [cityData, setCityData] = useState({});


  const getOrganization = async () => {
    try {
      console.log("Fetching organization data...");
      console.log("Current user organization ID from Redux:", userOrganizationId);
      setLoading(true);
      const response = await getOrganizationList(true);
      console.log("Organization API response in component:", response);
      if (response) {
        if (response.results && response.results.length > 0) {
          console.log("All organizations:", response.results.map(org => ({ id: org.id, name: org.name })));
          
          let orgToShow = [];
          
          // Find user's organization if userOrganizationId exists
          if (userOrganizationId) {
            const userOrg = response.results.find(
              org => String(org.id) === String(userOrganizationId)
            );
            
            if (userOrg) {
              console.log("Found user's organization:", userOrg);
              orgToShow = [userOrg];
              fetchLocationDetails(userOrg);
            } else {
              console.log("User organization not found. Showing first organization.");
              orgToShow = [response.results[0]];
              fetchLocationDetails(response.results[0]);
            }
          } else {
            // No user organization ID, just show the first organization
            console.log("No user organization ID. Showing first organization.");
            orgToShow = [response.results[0]];
            fetchLocationDetails(response.results[0]);
          }
          
          // Set filtered organizations to only show user's organization
          setFilteredOrganizations(orgToShow);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("ERROR", error);
      setLoading(false);
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
      // Create filter data with organization ID if available
      const filterData = {};
      
      // When showing all organizations, use the user's organization ID if available
      if (userOrganizationId) {
        console.log("Filtering departments by user's organization ID:", userOrganizationId);
        filterData.organization = userOrganizationId;
      }
      
      const departmentResponse = await getDepartmentList({
        options: depOptions,
        filterData: filterData
      });
      
      console.log("Department data retrieved:", departmentResponse);
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
      // Create filter data with organization ID if available
      const filterData = {};
      
      // When showing all organizations, use the user's organization ID if available
      if (userOrganizationId) {
        console.log("Filtering designations by user's organization ID:", userOrganizationId);
        filterData.organization = userOrganizationId;
      }
      
      // Merge with any existing filter data from desigOptions
      const mergedFilterData = {
        ...filterData,
        ...(desigOptions.filterData || {})
      };
      
      const response = await getDesignationList({
        options: desigOptions,
        filterData: mergedFilterData
      });
      setDesignation(response);
    } catch (error) {
      console.error("Error fetching designations:", error);
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

  // Function to fetch location details
  const fetchLocationDetails = async (organization) => {
    try {
      // Fetch country data if available
      if (organization?.country) {
        const countryResponse = await getCountryById(organization.country);
        if (countryResponse) {
          setCountryData(prev => ({
            ...prev,
            [organization.id]: countryResponse
          }));
        }
      }
      
      // Fetch state/region data if available
      if (organization?.state) {
        const stateResponse = await getRegionById(organization.state);
        if (stateResponse) {
          setStateData(prev => ({
            ...prev,
            [organization.id]: stateResponse
          }));
        }
      }
      
      // Fetch city data if available
      if (organization?.city) {
        const cityResponse = await getCityById(organization.city);
        if (cityResponse) {
          setCityData(prev => ({
            ...prev,
            [organization.id]: cityResponse
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching location details:", error);
    }
  };

  // Function to check if an organization is the user's organization
  const isUserOrganization = (organizationId) => {
    if (!userOrganizationId) return false;
    return String(organizationId) === String(userOrganizationId);
  };

  useEffect(() => {
    const fetchData = async () => {
      console.log("Initial component load - User details:", userDetails);
      console.log("User organization ID before fetching:", userOrganizationId);
      console.log("Organization property:", userDetails?.organization);
      
      // First get organization data
      await getOrganization();
      
      // Log after fetching
      console.log("After fetching - filtered organizations:", filteredOrganizations);
      
      // Then fetch the rest of the data that depends on organization
      await fetchShifts();
      await getDepartments();
      await getDesignations();
      await getOnboardingDocuments();
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add another useEffect to update departments when filteredOrganizations changes
  useEffect(() => {
    if (filteredOrganizations.length > 0) {
      console.log("Organization changed, updating departments...");
      getDepartments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredOrganizations]);

  // Helper function to get location names
  const getLocationName = (type, id, orgId) => {
    if (!id) return "N/A";
    
    if (type === "country") {
      return countryData[orgId]?.name || "Loading...";
    } else if (type === "state") {
      return stateData[orgId]?.name || "Loading...";
    } else if (type === "city") {
      return cityData[orgId]?.name || "Loading...";
    }
    
    return "N/A";
  };

  // Helper function to handle edit button click
  const handleEditClick = (organization) => {
    // Enhance organization data with location names before setting to edit
    const enhancedData = {
      ...organization,
      country_name: getLocationName("country", organization.country, organization.id),
      state_name: getLocationName("state", organization.state, organization.id),
      city_name: getLocationName("city", organization.city, organization.id)
    };
    
    setEditData(enhancedData);
    setEdit(true);
  };

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
              {filteredOrganizations.length > 0 ? (
                <div className="space-y-8">
                  <h2 className="mb-4 text-2xl font-medium text-primary">Organization Details</h2>
                  {/* Show user's organization */}
                  {filteredOrganizations.map((organization, index) => (
                    <Card 
                      key={organization.id || index} 
                      className="mb-8"
                    >
                      <CardHeader className="flex flex-col items-start justify-between pb-2 border-b">
                        <div className="flex flex-row items-start justify-between w-full">
                          <div>
                            <CardTitle className="text-2xl font-medium text-primary">
                              {organization.name}
                            </CardTitle>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="px-2 py-1 hover:bg-primary hover:text-white hover:border-primary"
                            onClick={() => handleEditClick(organization)}
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
                              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                              <path d="m15 5 4 4" />
                            </svg>
                            Edit
                          </Button>
                        </div>
                        <CardDescription className="text-neutral-1100">
                          {organization.company_description || "Organization details and information"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="py-4">
                        <ViewOrganization 
                          data={{
                            ...organization,
                            country_name: getLocationName("country", organization.country, organization.id),
                            state_name: getLocationName("state", organization.state, organization.id),
                            city_name: getLocationName("city", organization.city, organization.id)
                          }} 
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent>
                    <div className="py-8 text-center">
                      <p className="text-gray-500">No organization data available. Please add an organization.</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="department">
              <Departments
                loading={depLoading}
                options={depOptions}
                reload={getDepartments}
                organizationId={userOrganizationId}
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
                organizationId={userOrganizationId}
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
                reload={getDesignations}
                organizationId={userOrganizationId}
                designation={designation}
                setDesignation={setDesignation}
                getDesignations={getDesignations}
              />
            </TabsContent>
            <TabsContent value="working-hours">
              <WorkingHours
               data={dataShift}
               reload={fetchShifts}
               organizationId={userOrganizationId}
               />
            </TabsContent>
            <TabsContent value="onboarding">
              {onboardingLoading ? (
                <PageLoader />
              ) : (
                <OnboardingChecklist
                  data={onboardingDocs}
                  reload={getOnboardingDocuments}
                  organizationId={userOrganizationId}
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
              countryData={countryData}
              stateData={stateData}
              cityData={cityData}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default OfficeSetting;
