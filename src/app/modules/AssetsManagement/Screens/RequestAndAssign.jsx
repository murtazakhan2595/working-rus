import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button } from "components/ui/button";
import { Header, UnauthorizedAccess } from "components";
import CustomTable from "components/CustomTable";
import { FilterInput } from "components/FormControl";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
} from "components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import { toast } from "react-toastify";
import AssetRequestSheet from "./AssetRequestSheet";
import AssetRequestViewSheet from "./AssetRequestViewSheet";
import ViewAssetRequest from "./ViewAssetRequest";
import { AssetRequestColumns } from "app/utils/Types/TableColumns";
import { getEmployeeAssets } from "app/hooks/assets";
import { HasAccess } from "utils/PermissionUtils";

// Sub-tab styling to match Time Adjustments
const innerTabClassName =
  "shadow-none border-transparent mr-4 border-b data-[state=active]:border-plum-1100 w-28 data-[state=active]:text-primary-1100 rounded-none data-[state-active]:font-medium";

const AssetRequests = ({ userProfile, departments, employees }) => {
  // Permission checks for asset request management features
  const canViewAssetRequests = HasAccess("VIEW_ASSETS_REQUEST");
  const canApproveAssetRequests = HasAccess("MANAGE_ASSET_REQUEST");
  const canAssignAssets = HasAccess("ASSIGN_ASSETS_TO_EMPLOYEE");

  const [activeTab, setActiveTab] = useState("requests"); // "requests" or "assignments"
  const [activeSubTab, setActiveSubTab] = useState("Requests"); // "Requests" or "Records" for requests tab

  // Common state
  const [isLoading, setIsLoading] = useState(false);
  const [requestsData, setRequestsData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [filterData, setFilterData] = useState({ asset_status: "Pending" });
  const [openRequestDetailSheet, setOpenRequestDetailSheet] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("Pending");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [editRequest, setEditRequest] = useState(null);

  // Asset request/assignment sheet state
  const [openAssetRequestSheet, setOpenAssetRequestSheet] = useState(false);
  const [assetSheetMode, setAssetSheetMode] = useState("request"); // "request" or "assign"

  // Pagination options
  const [options, setOptions] = useState({
    page: 1,
    sizePerPage: 10,
  });

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  // UPDATED: Reset filter states when tab changes
  useEffect(() => {
    if (activeTab === "requests") {
      // Set default filters for requests tab
      if (activeSubTab === "Requests") {
        setFilterData({ asset_status: "Pending" });
        setSelectedStatus("Pending");
      }
    } else {
      // Reset filters for assignments tab
      setFilterData({});
      setSelectedStatus("");
    }
    setSelectedDepartment("");
    setOptions({ page: 1, sizePerPage: 10 });
  }, [activeTab]);
  useEffect(() => {
    if (activeTab === "requests" && activeSubTab === "Requests") {
      setFilterData({ asset_status: "Pending" });
      setSelectedStatus("Pending");
    }
  }, []); // Run only on component mount

  // Handle sub-tab changes and set appropriate filters
  const handleSubTabChange = (subTab) => {
    setActiveSubTab(subTab);
    setOptions({ page: 1, sizePerPage: 10 });

    if (subTab === "Requests") {
      setFilterData({ asset_status: "Pending" });
      setSelectedStatus("Pending");
    } else if (subTab === "Records") {
      setFilterData({ asset_status: ["Accepted", "Rejected", "Withdrawal"] });
      setSelectedStatus("");
    }
  };

  const fetchRequestsData = async (isMounted = true) => {
    setIsLoading(true);
    try {
      if (isMounted) {
        let requestStatus = "Requested";

        // Determine request status based on active tab
        if (activeTab === "assignments") {
          requestStatus = "Assigned";
        }

        const response = await getEmployeeAssets({
          options,
          filterData: {
            ...filterData,
            asset_request_status: requestStatus,
          },
        });

        if (response) {
          setRequestsData(response.results || []);
          setTotalCount(response.count || 0);
        }
      }
    } catch (error) {
      console.error("Error fetching Requests & Assignments", error);
      toast.error(`Failed to load ${activeTab}`);
    } finally {
      if (isMounted) setIsLoading(false);
    }
  };

  const handleRequestAsset = () => {
    setAssetSheetMode("request");
    setOpenAssetRequestSheet(true);
  };

  const handleAssignAsset = () => {
    setAssetSheetMode("assign");
    setOpenAssetRequestSheet(true);
  };

  const handleFilterChange = (filterName, filterValue) => {
    setOptions((prevOptions) => ({ ...prevOptions, page: 1 }));

    if (filterName === "asset_status") {
      setSelectedStatus(filterValue);
    } else if (filterName === "department_name") {
      setSelectedDepartment(filterValue);
    }

    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterValue === "" || filterValue === null) {
        if (filterName === "asset_status") {
          // Handle status filter reset based on active sub-tab
          if (activeTab === "requests") {
            if (activeSubTab === "Requests") {
              updatedFilters[filterName] = "Pending";
            } else if (activeSubTab === "Records") {
              updatedFilters[filterName] = "Accepted,Rejected,Withdrawal";
            }
          } else {
            delete updatedFilters[filterName];
          }
        } else {
          delete updatedFilters[filterName];
        }
      } else {
        updatedFilters[filterName] = filterValue;
      }
      return updatedFilters;
    });
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
  };

  // Load data based on active tab and sub-tab
  useEffect(() => {
    let isMounted = true;
    fetchRequestsData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [activeTab, activeSubTab, options, filterData]);

  // Action handlers for the dropdown menu
  const handleViewRequest = (row) => {
    console.log("View asset request:", row);
    setSelectedRequest(row);
    setOpenRequestDetailSheet(true);
  };

 const handleEditRequest = (row) => {
   console.log("Edit asset request:", row);

   // ✅ Check if any approver has approved
   const hasAnyApproval = row.approval_details?.some(
     (approval) =>
       approval.status === "APPROVED" || approval.status === "ACCEPTED"
   );

   if (hasAnyApproval) {
     toast.info(
       "Cannot edit request: Request has been approved by at least one approver"
     );
     return;
   }

   // ✅ Allow edit if no approvals yet and request is active
   if (row.asset_request_status === "Requested") {
     setOpenRequestDetailSheet(false);
     setSelectedRequest(null);
     setEditRequest(row);
   } else {
     toast.info("Request cannot be edited in current status");
   }
 };

  const handleRejectRequest = (row) => {
    console.log("Reject asset request:", row);
    // Open the assign sheet in reject mode
    setSelectedRequest(row);
    setEditRequest(row);
  };

  // Tab configuration
  const tabsData = [
    { value: "requests", label: "Requested By Employee" },
    { value: "assignments", label: "Direct Assignments" },
  ];

  const enhancedRequestColumns = [
    ...AssetRequestColumns(
      handleViewRequest,
      handleEditRequest,
      handleRejectRequest
    ).filter((col) => col.dataField !== "id"),
  ];

  // Get filter options based on active tab and sub-tab
  const getFilters = () => {
    const baseFilters = [
      {
        type: "search",
        placeholder: "Employee Name or ID",
        name: "emp_name",
      },
    ];

    if (activeTab === "requests") {
      if (activeSubTab === "Records") {
        // For Records sub-tab, show status filter
        baseFilters.push({
          type: "select-one",
          option: [
            { value: "Accepted", label: "Accepted" },
            { value: "Rejected", label: "Rejected" },
            { value: "Withdrawal", label: "Withdrawal" },
          ],
          name: "asset_status",
          placeholder: "Status",
          values: selectedStatus,
        });
      }
      // For Requests sub-tab, we don't show status filter as it's fixed to "Pending"
    } else {
      // For assignments tab, show all statuses
      baseFilters.push({
        type: "select-one",
        option: [
          { value: "Pending", label: "Pending" },
          { value: "Rejected", label: "Rejected" },
          { value: "Accepted", label: "Accepted" },
        ],
        name: "asset_status",
        placeholder: "Status",
        values: selectedStatus,
      });
    }

    // Add department filter
    baseFilters.push({
      type: "select-two",
      option: departments || [],
      name: "department_name",
      placeholder: "Department",
      values: selectedDepartment,
    });

    return baseFilters;
  };

  const getActionButton = () => {
    if (activeTab === "assignments" && canAssignAssets) {
      return <Button onClick={handleAssignAsset}>Assign Asset</Button>;
    }
    return null;
  };

  // Get title and description based on active tab and sub-tab
  const getTabContent = () => {
    if (activeTab === "requests") {
      return {
        title:
          activeSubTab === "Requests" ? "Asset Requests" : "Request Records",
        description:
          activeSubTab === "Requests"
            ? "Here you can manage pending asset requests from employees."
            : "Here you can view the history of processed asset requests.",
      };
    } else {
      return {
        title: "Direct Assignments",
        description:
          "Here you can manage direct asset assignments. Add, edit, or delete assignments as needed.",
      };
    }
  };

  // If user has no asset request management permissions at all
  if (!canViewAssetRequests) {
    return (
      <UnauthorizedAccess
        title="Asset Request Management Access Denied"
        featureName="asset request management"
        message="You don't have permission to view or manage asset requests. Please contact your administrator to request access."
        showButtons={true}
        size="lg"
      />
    );
  }

  const tabContent = getTabContent();

  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <Header content={getActionButton()} />

      <Tabs
        value={activeTab}
        onValueChange={(newTab) => {
          setIsLoading(false);
          setActiveTab(newTab);
        }}
        defaultValue="requests"
      >
        <div className="flex flex-col items-start justify-between mb-4 lg:flex-row md:flex-row xl:flex-row">
          <TabsList className="flex justify-center mb-4">
            {tabsData?.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-primary-200 w-44 data-[state=active]:text-primary-1100 rounded-sm data-[state-active]:font-medium"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <Card>
          <TabsContent value="requests">
            {canViewAssetRequests ? (
              <Tabs
                className="w-full"
                onValueChange={handleSubTabChange}
                value={activeSubTab}
              >
                <div className="flex flex-col items-start justify-between lg:flex-row md:flex-row xl:flex-row">
                  <TabsList className="flex items-center justify-center ">
                    {["Requests", "Records"].map((tab) => (
                      <TabsTrigger
                        key={tab}
                        value={tab}
                        className={innerTabClassName}
                      >
                        {tab}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                <div className="flex flex-col gap-4 px-6">
                  <CardTitle className="text-primary ">
                    {tabContent.title}
                  </CardTitle>
                  <CardDescription className="text-neutral-1100">
                    {tabContent.description}
                  </CardDescription>
                  <FilterInput
                    filters={getFilters()}
                    onChange={handleFilterChange}
                    className="justify-end"
                  />
                  <CardContent className="px-0">
                    <CustomTable
                      columns={enhancedRequestColumns}
                      data={isLoading ? [] : requestsData}
                      pagination={true}
                      dataTotalSize={totalCount}
                      tableOptions={tableOptions}
                      loading={isLoading}
                    />
                  </CardContent>
                </div>
              </Tabs>
            ) : (
              <UnauthorizedAccess
                title="Asset Requests Access Denied"
                featureName="asset requests"
                message="You don't have permission to view asset requests."
                size="md"
              />
            )}
          </TabsContent>
          <TabsContent value="assignments">
            {canViewAssetRequests ? (
              // REMOVE this div wrapper: <div className="flex flex-col gap-4 px-6">
              <>
                <CardHeader>
                  <CardTitle className="text-primary-1100">
                    {tabContent.title}
                  </CardTitle>
                  <CardDescription className="text-neutral-1100">
                    {tabContent.description}
                  </CardDescription>
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex justify-end mt-2 lg:mt-0 md:mt-0 xl:mt-0"
                  >
                    <FilterInput
                      filters={getFilters()}
                      onChange={handleFilterChange}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <CustomTable
                    columns={enhancedRequestColumns}
                    data={isLoading ? [] : requestsData}
                    pagination={true}
                    dataTotalSize={totalCount}
                    tableOptions={tableOptions}
                    loading={isLoading}
                  />
                </CardContent>
              </>
            ) : (
              // REMOVE this closing div: </div>
              <UnauthorizedAccess
                title="Asset Assignments Access Denied"
                featureName="asset assignments"
                message="You don't have permission to view asset assignments."
                size="md"
              />
            )}
          </TabsContent>
        </Card>
      </Tabs>

      {/* Combined Asset Request/Assignment Sheet */}
      {openAssetRequestSheet && canAssignAssets && (
        <AssetRequestSheet
          isOpen={openAssetRequestSheet}
          setIsOpen={setOpenAssetRequestSheet}
          mode={assetSheetMode}
          reload={() => fetchRequestsData(true)}
          departments={departments}
          employees={employees}
        />
      )}
      {editRequest && canApproveAssetRequests && (
        <AssetRequestSheet
          isOpen={!!editRequest}
          setIsOpen={() => {
            setEditRequest(null);
          }}
          mode={"assign"}
          reload={() => fetchRequestsData(true)}
          departments={departments}
          employees={employees}
          editData={editRequest}
        />
      )}

      {/* Asset Request Detail Sheet */}
      {openRequestDetailSheet && (
        <ViewAssetRequest
          isOpen={openRequestDetailSheet}
          setIsOpen={setOpenRequestDetailSheet}
          data={selectedRequest}
          reload={() => fetchRequestsData(true)}
          AssetRequestList={requestsData}
          isMyRequest={false}
          onEdit={handleEditRequest}
        />
      )}
    </div>
  );
};

// Connect to Redux to get departments, employees and user profile
const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
    departments: state.common.departments,
    employees: state.emp.employees,
  };
};

export default connect(mapStateToProps)(AssetRequests);
