import { Header } from "components";
import { Card } from "components/ui/card";
import React, { useEffect, useState } from "react";
import AddOrganization from "./Organizations/AddOrganization";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import {
  Departments,
  Branches,
  GraceTime,
  Designations,
  EvaluationType,
  AddEvaluationType,
  RatingScaleSetup,
  AddRatingScaleSetup,
} from "app/modules/OfficeSetting/Screens";
import AddDepartment from "./Departments/AddDepartment";
import AddBranch from "./Branches/AddBranch";
import AddGraceTime from "./GraceTime/AddGraceTime";
import { getOrganizationList } from "app/hooks/general";
import { CardContent } from "components/ui/card";
import AddDesignation from "./Designations/AddDesignation";
import WorkingHours from "./WorkingHours";
import { Shift } from "app/modules/OfficeSetting";
import { PageLoader } from "components";
import OnboardingChecklist from "./OnboardingChecklist";
import OnboardingTab from "./OnboardingChecklist/OnboardingTab";
import ViewOrganization from "./Organizations/ViewOrganization";
import { Button } from "components/ui/button";
import { useSelector } from "react-redux";
import { CardHeader } from "components/ui/card";
import { CardTitle } from "components/ui/card";
import { CardDescription } from "components/ui/card";
import {
  getCountryById,
  getRegionById,
  getCityById,
} from "app/hooks/officeSetting";
import { OfficeSettingPermissionWrapper } from "../components/PermissionWrapper";
import { OFFICE_SETTING_PERMISSIONS } from "../permissions/constants";

import ClearanceChecklist from "./ClearanceChecklist";
import AddClearanceChecklist from "./ClearanceChecklist/AddClearanceChecklist";

const OfficeSetting = () => {
  const [edit, setEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [activeTab, setActiveTab] = useState("offices");
  const [loading, setLoading] = useState(true);
  const [reloadSettingData, setReloadSettingData] = useState({});



  // Get user details from Redux store
  const userDetails = useSelector((state) => state.emp?.user_details);
  const userOrganizationId =
    userDetails?.organization_id || userDetails?.organization;

  // Get office setting permissions
  const userPermissionsRaw = useSelector(
    (state) => state.roles_permissions?.my_permissions || []
  );

  // The permissions are already strings (permission codes), not objects
  const userPermissions = userPermissionsRaw.filter(Boolean); // Remove any undefined/null values

  console.log("User Permissions:", userPermissions);

  const [filteredOrganizations, setFilteredOrganizations] = useState([]);

  const [countryData, setCountryData] = useState({});
  const [stateData, setStateData] = useState({});
  const [cityData, setCityData] = useState({});

  const getOrganization = async () => {
    try {
      setLoading(true);
      const response = await getOrganizationList(true);
      if (response) {
        if (response.results && response.results.length > 0) {
          let orgToShow = [];

          // Find user's organization if userOrganizationId exists
          if (userOrganizationId) {
            const userOrg = response.results.find(
              (org) => String(org.id) === String(userOrganizationId)
            );

            if (userOrg) {
              orgToShow = [userOrg];
              fetchLocationDetails(userOrg);
            } else {
              orgToShow = [response.results[0]];
              fetchLocationDetails(response.results[0]);
            }
          } else {
            // No user organization ID, just show the first organization
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

  // Function to fetch location details
  const fetchLocationDetails = async (organization) => {
    try {
      // Fetch country data if available
      if (organization?.country) {
        const countryResponse = await getCountryById(organization.country);
        if (countryResponse) {
          setCountryData((prev) => ({
            ...prev,
            [organization.id]: countryResponse,
          }));
        }
      }

      // Fetch state/region data if available
      if (organization?.state) {
        const stateResponse = await getRegionById(organization.state);
        if (stateResponse) {
          setStateData((prev) => ({
            ...prev,
            [organization.id]: stateResponse,
          }));
        }
      }

      // Fetch city data if available
      if (organization?.city) {
        const cityResponse = await getCityById(organization.city);
        if (cityResponse) {
          setCityData((prev) => ({
            ...prev,
            [organization.id]: cityResponse,
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching location details:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // First get organization data
      await getOrganization();
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      country_name: getLocationName(
        "country",
        organization.country,
        organization.id
      ),
      state_name: getLocationName("state", organization.state, organization.id),
      city_name: getLocationName("city", organization.city, organization.id),
    };

    setEditData(enhancedData);
    setEdit(true);
  };

  const tabsData = [
    {
      value: "offices",
      label: "Organization",
      permission: OFFICE_SETTING_PERMISSIONS.ORGANIZATION.VIEW,
    },
    {
      value: "department",
      label: "Department",
      permission: OFFICE_SETTING_PERMISSIONS.DEPARTMENTS.VIEW,
    },
    {
      value: "designation",
      label: "Designation",
      permission: OFFICE_SETTING_PERMISSIONS.DESIGNATIONS.VIEW,
    },
    {
      value: "branches",
      label: "Branches",
      permission: OFFICE_SETTING_PERMISSIONS.BRANCHES.VIEW,
    },
    {
      value: "working-hours",
      label: "Working Hours",
      permission: OFFICE_SETTING_PERMISSIONS.WORKING_HOURS.VIEW,
    },
    {
      value: "onboarding",
      label: "Onboarding Checklist",
      permission: OFFICE_SETTING_PERMISSIONS.ONBOARDING.VIEW,
    },
    {
      value: "grace-time",
      label: "Grace Time",
      permission: OFFICE_SETTING_PERMISSIONS.GRACE_TIME.VIEW,
    },
    {
      value: "clearance-checklist",
      label: "Clearance & Handover Setup",
      permission: OFFICE_SETTING_PERMISSIONS.CLEARANCE_CHECKLIST,
    },
    {
      value: "evaluation-type",
      label: "Evaluation Type",
      permission: OFFICE_SETTING_PERMISSIONS.EVALUATION_TYPE.VIEW,
    },
    {
      value: "rating-scale-setup",
      label: "Rating Scale Setup",
      permission: OFFICE_SETTING_PERMISSIONS.EVALUATION_TYPE.VIEW,
    },
  ];

  // Filter tabs based on permissions
  const availableTabs = tabsData.filter((tab) => {
    const hasPermission = userPermissions.includes(tab.permission);
    return hasPermission;
  });

  return (
    <div>
      {loading ? (
        <PageLoader />
      ) : (
        <div className="flex flex-col gap-4 office-setting">
          <Header
            content={
              activeTab === "offices" ? (
                <OfficeSettingPermissionWrapper
                  permissions={OFFICE_SETTING_PERMISSIONS.ORGANIZATION.CREATE}
                >
                  <AddOrganization reload={getOrganization} />
                </OfficeSettingPermissionWrapper>
              ) : activeTab === "department" ? (
                <OfficeSettingPermissionWrapper
                  permissions={OFFICE_SETTING_PERMISSIONS.DEPARTMENTS.CREATE}
                >
                  <AddDepartment
                    reloadData={() => {
                      setReloadSettingData((prev) => {
                        return {
                          ...prev,
                          department: !prev["department"],
                        };
                      });
                    }}
                  />
                </OfficeSettingPermissionWrapper>
              ) : activeTab === "designation" ? (
                <OfficeSettingPermissionWrapper
                  permissions={OFFICE_SETTING_PERMISSIONS.DESIGNATIONS.CREATE}
                >
                  <AddDesignation
                    reloadData={() => {
                      setReloadSettingData((prev) => {
                        return {
                          ...prev,
                          designation: !prev["designation"],
                        };
                      });
                    }}
                  />
                </OfficeSettingPermissionWrapper>
              ) : activeTab === "working-hours" ? (
                <OfficeSettingPermissionWrapper
                  permissions={OFFICE_SETTING_PERMISSIONS.SHIFT.CREATE}
                >
                  <Shift
                    reloadData={() => {
                      setReloadSettingData((prev) => {
                        return {
                          ...prev,
                          "working-hours": !prev["working-hours"],
                        };
                      });
                    }}
                  />
                </OfficeSettingPermissionWrapper>
              ) : activeTab === "branches" ? (
                <OfficeSettingPermissionWrapper
                  permissions={OFFICE_SETTING_PERMISSIONS.BRANCHES.CREATE}
                >
                  <AddBranch
                    reloadData={() => {
                      setReloadSettingData((prev) => {
                        return {
                          ...prev,
                          branches: !prev["branches"],
                        };
                      });
                    }}
                  />
                </OfficeSettingPermissionWrapper>
              ) : activeTab === "grace-time" ? (
                <OfficeSettingPermissionWrapper
                  permissions={OFFICE_SETTING_PERMISSIONS.GRACE_TIME.CREATE}
                >
                  <AddGraceTime
                    reloadData={() => {
                      setReloadSettingData((prev) => {
                        return {
                          ...prev,
                          "grace-time": !prev["grace-time"],
                        };
                      });
                    }}
                  />
                </OfficeSettingPermissionWrapper>
              ) : activeTab === "clearance-checklist" ? (
                <OfficeSettingPermissionWrapper
                  permissions={
                    OFFICE_SETTING_PERMISSIONS.CLEARANCE_CHECKLIST
                  }
                >
                  <AddClearanceChecklist
                    reloadData={() => {
                      setReloadSettingData((prev) => {
                        return {
                          ...prev,
                          "clearance-checklist": !prev["clearance-checklist"],
                        };
                      });
                    }}
                  />
                </OfficeSettingPermissionWrapper>
              ) : activeTab === "onboarding" ? (
                <OfficeSettingPermissionWrapper
                  permissions={OFFICE_SETTING_PERMISSIONS.ONBOARDING.CREATE}
                >
                  <OnboardingTab
                    reloadData={() => {
                      setReloadSettingData((prev) => {
                        return {
                          ...prev,
                          onboarding: !prev["onboarding"],
                        };
                      });
                    }}
                  />
                </OfficeSettingPermissionWrapper>
              ) : activeTab === "evaluation-type" ? (
                <OfficeSettingPermissionWrapper
                  permissions={OFFICE_SETTING_PERMISSIONS.EVALUATION_TYPE.CREATE}
                >
                  <AddEvaluationType
                    reloadData={() => {
                      setReloadSettingData((prev) => {
                        return {
                          ...prev,
                          'evaluation-type': !prev["evaluation-type"],
                        };
                      });
                    }}
                  />
                </OfficeSettingPermissionWrapper>
              ) : activeTab === "rating-scale-setup" ? (
                <OfficeSettingPermissionWrapper
                  permissions={OFFICE_SETTING_PERMISSIONS.EVALUATION_TYPE.CREATE}
                >
                  <AddRatingScaleSetup
                    reloadData={() => {
                      setReloadSettingData((prev) => {
                        return {
                          ...prev,
                          'rating-scale-setup': !prev["rating-scale-setup"],
                        };
                      });
                    }}
                  />
                </OfficeSettingPermissionWrapper>
              ) : null
            }
          />
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            defaultValue="offices"
            className="w-full"
          >
            {/* Horizontal tabs */}
            <div className="w-full mb-6">
              <TabsList>
                {availableTabs?.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Tab content */}
            <div className="w-full">
              <TabsContent value="offices">
                {filteredOrganizations.length > 0 ? (
                  <div className="space-y-8">
                    <h2 className="mb-4 text-2xl font-medium text-primary">
                      Organization Details
                    </h2>
                    {/* Show user's organization */}
                    {filteredOrganizations.map((organization, index) => (
                      <Card key={organization.id || index} className="mb-8">
                        <CardHeader className="flex flex-col items-start justify-between pb-2 border-b">
                          <div className="flex flex-row items-start justify-between w-full">
                            <div>
                              <CardTitle className="text-2xl font-medium text-primary">
                                {organization.name}
                              </CardTitle>
                            </div>
                            <OfficeSettingPermissionWrapper
                              permissions={
                                OFFICE_SETTING_PERMISSIONS.ORGANIZATION.UPDATE
                              }
                            >
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
                            </OfficeSettingPermissionWrapper>
                          </div>
                          <CardDescription className="text-neutral-1100">
                            {organization.company_description ||
                              "Organization details and information"}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="py-4">
                          <ViewOrganization
                            data={{
                              ...organization,
                              country_name: getLocationName(
                                "country",
                                organization.country,
                                organization.id
                              ),
                              state_name: getLocationName(
                                "state",
                                organization.state,
                                organization.id
                              ),
                              city_name: getLocationName(
                                "city",
                                organization.city,
                                organization.id
                              ),
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
                        <p className="text-gray-500">
                          No organization data available. Please add an
                          organization.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              <TabsContent value="department">
                <Departments reload={reloadSettingData["department"]} />
              </TabsContent>
              <TabsContent value="branches">
                <Branches reload={reloadSettingData["branches"]} />
              </TabsContent>
              <TabsContent value="designation">
                <Designations reload={reloadSettingData["designation"]} />
              </TabsContent>
              <TabsContent value="working-hours">
                <WorkingHours reload={reloadSettingData["working-hours"]} />
              </TabsContent>
              <TabsContent value="grace-time">
                <GraceTime reload={reloadSettingData["grace-time"]} />
              </TabsContent>
              <TabsContent value="evaluation-type">
                <EvaluationType reload={reloadSettingData["evaluation-type"]} />
              </TabsContent>
              <TabsContent value="rating-scale-setup">
                <RatingScaleSetup reload={reloadSettingData["rating-scale-setup"]} />
              </TabsContent>
              <TabsContent value="onboarding">
                <OnboardingChecklist reload={reloadSettingData["onboarding"]} />
              </TabsContent>
              <TabsContent value="clearance-checklist">
                <ClearanceChecklist
                  reload={reloadSettingData["clearance-checklist"]}
                />
              </TabsContent>
            </div>
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
