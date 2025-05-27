import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button } from "components/ui/button";
import { Header, UnauthorizedAccess } from "components";
import CustomTable from "components/CustomTable";
import { FilterInput } from "components/FormControl";
import { Card, CardContent, CardDescription, CardTitle, CardHeader } from "components/ui/card";
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

const AssetRequests = ({ userProfile, departments, employees }) => {
  // Permission checks for asset request management features
  const canViewAssetRequests = HasAccess("VIEW_ASSETS_REQUEST");
  const canApproveAssetRequests = HasAccess("MANAGE_ASSET_REQUEST");
  const canAssignAssets = HasAccess("ASSIGN_ASSETS_TO_EMPLOYEE");

  const [activeTab, setActiveTab] = useState("requests"); // "requests" or "assignments"

  // Common state
  const [isLoading, setIsLoading] = useState(false);
  const [requestsData, setRequestsData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [filterData, setFilterData] = useState({});
  const [openRequestDetailSheet, setOpenRequestDetailSheet] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
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

  // Reset filter states when tab changes
  useEffect(() => {
    setFilterData({});
    setSelectedStatus("");
    setSelectedDepartment("");
    setOptions({ page: 1, sizePerPage: 10 });
  }, [activeTab]);

  const fetchRequestsData = async (isMounted = true) => {
    setIsLoading(true);
    try {
      if (isMounted) {
        const response = await getEmployeeAssets({
          options,
          filterData: {
            ...filterData,
            asset_request_status:
              activeTab === "requests" ? "Requested" : "Assigned",
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
      if (filterValue === "") {
        delete updatedFilters[filterName];
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

  // Load data based on active tab
  useEffect(() => {
    let isMounted = true;
    fetchRequestsData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [activeTab, options, filterData]);

  // Action handlers for the dropdown menu
  const handleViewRequest = (row) => {
    console.log("View asset request:", row);
    setSelectedRequest(row);
    setOpenRequestDetailSheet(true);
  };

  const handleEditRequest = (row) => {
    console.log("Edit asset request:", row);
    
    // Allow edit for Pending and Rejected requests
    if ((row.asset_status === "Pending" || row.asset_status === "Rejected") && row.asset_request_status === "Requested") {
      // Close the view sheet if it's open
      setOpenRequestDetailSheet(false);
      setSelectedRequest(null);
      // Open the edit sheet
      setEditRequest(row);
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
    { value: "assignments", label: "Assign By HR" },
  ];

  const enhancedRequestColumns = [
    ...AssetRequestColumns(
      handleViewRequest,
      handleEditRequest,
      handleRejectRequest
    ).filter((col) => col.dataField !== "id"), 
  ];

  const filters = [
    {
      type: "search",
      placeholder: "Employee Name",
      name: "emp_name",
    },
    {
      type: "select-one",
      option: [
        { value: "Pending", label: "Pending" },
        { value: "Rejected", label: "Rejected" },
        { value: "Accepted", label: "Accepted" },
      ],
      name: "asset_status",
      placeholder: "Status",
      values: selectedStatus,
    },
    {
      type: "select-two",
      option: departments || [],
      name: "department_name",
      placeholder: "Department",
      values: selectedDepartment,
    },
  ];

  const getActionButton = () => {
    if (activeTab === "assignments" && canAssignAssets) {
      return <Button onClick={handleAssignAsset}>Assign Asset</Button>;
    }
    return null;
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
        <CardHeader>
        <CardTitle className="text-primary-1100">
          
            {activeTab === "requests" ? "Requested By Employee" : "Assign By HR"}
          
        </CardTitle>
        <CardDescription className="text-neutral-1100">
        {activeTab === "requests" ? "Here you can manage your requests. Add, edit, or delete requests as needed." : "Here you can manage your assignments. Add, edit, or delete assignments as needed."}
        </CardDescription>
        <div
            onClick={(e) => e.stopPropagation()}
            className="flex justify-end mt-2 lg:mt-0 md:mt-0 xl:mt-0"
          >
            <FilterInput filters={filters} onChange={handleFilterChange} />
          </div>
        </CardHeader>
          <CardContent>
            <TabsContent value="requests">
              {canViewAssetRequests ? (
                <CustomTable
                  columns={enhancedRequestColumns}
                  data={isLoading ? [] : requestsData}
                  pagination={true}
                  dataTotalSize={totalCount}
                  tableOptions={tableOptions}
                  loading={isLoading}
                />
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
                <CustomTable
                  columns={enhancedRequestColumns}
                  data={isLoading ? [] : requestsData}
                  pagination={true}
                  dataTotalSize={totalCount}
                  tableOptions={tableOptions}
                  loading={isLoading}
                />
              ) : (
                <UnauthorizedAccess
                  title="Asset Assignments Access Denied"
                  featureName="asset assignments"
                  message="You don't have permission to view asset assignments."
                  size="md"
                />
              )}
            </TabsContent>
          </CardContent>
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
