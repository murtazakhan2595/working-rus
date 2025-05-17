import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button } from "components/ui/button";
import { Header } from "components";
import CustomTable from "components/CustomTable";
import { FilterInput } from "components/FormControl";
import { Card, CardContent } from "components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import { toast } from "react-toastify";
import AssetRequestSheet from "./AssetRequestSheet";
import AssetRequestViewSheet from "./AssetRequestViewSheet";
import { AssetRequestColumns } from "app/utils/Types/TableColumns";
import { getEmployeeAssets } from "app/hooks/assets";

const AssetRequests = ({ userProfile, departments }) => {
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
    // Reset to page 1 when filter changes
    setOptions((prevOptions) => ({ ...prevOptions, page: 1 }));

    // Update selected values for UI display
    if (filterName === "status") {
      setSelectedStatus(filterValue);
    } else if (filterName === "department") {
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

  // TABLE OPTIONS
  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onRowClick: (row) => {
      console.log("Row clicked:", row);
      if (row.asset_status === "Pending" && row.asset_request_status ==="Requested"){
        setEditRequest(row);
      }
      else{
        setSelectedRequest(row);
        setOpenRequestDetailSheet(true);

      }
    },
  };

  // Load data based on active tab
  useEffect(() => {
    let isMounted = true;
    fetchRequestsData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [activeTab, options, filterData]);

  // Tab configuration
  const tabsData = [
    { value: "requests", label: "Request Assets" },
    { value: "assignments", label: "Assign Assets" },
  ];

  const enhancedRequestColumns = [
    ...AssetRequestColumns.filter((col) => col.dataField !== "id"), 
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
    if (activeTab === "assignments") {
      return <Button onClick={handleAssignAsset}>Assign Asset</Button>;
    }
  };

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
        <div className="flex flex-col items-start justify-between lg:flex-row md:flex-row xl:flex-row mb-4">
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
          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-2 lg:mt-0 md:mt-0 xl:mt-0"
          >
            <FilterInput filters={filters} onChange={handleFilterChange} />
          </div>
        </div>

        <Card>
          <CardContent>
            <TabsContent value="requests">
              <CustomTable
                columns={enhancedRequestColumns}
                data={isLoading ? [] : requestsData}
                pagination={true}
                dataTotalSize={totalCount}
                tableOptions={tableOptions}
                loading={isLoading}
              />
            </TabsContent>

            <TabsContent value="assignments">
              <CustomTable
                columns={enhancedRequestColumns}
                data={isLoading ? [] : requestsData}
                pagination={true}
                dataTotalSize={totalCount}
                tableOptions={tableOptions}
                loading={isLoading}
              />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>

      {/* Combined Asset Request/Assignment Sheet */}
      {openAssetRequestSheet && (
        <AssetRequestSheet
          isOpen={openAssetRequestSheet}
          setIsOpen={setOpenAssetRequestSheet}
          mode={assetSheetMode}
          reload={() => fetchRequestsData(true)}
          departments={departments}
        />
      )}
      {editRequest && (
        <AssetRequestSheet
          isOpen={!!editRequest}
          setIsOpen={() => {
            setEditRequest(null);
          }}
          mode={"assign"}
          reload={() => fetchRequestsData(true)}
          departments={departments}
          editData={editRequest}
        />
      )}

      {/* Asset Request Detail Sheet */}
      {openRequestDetailSheet && (
        <AssetRequestViewSheet
          isOpen={openRequestDetailSheet}
          setIsOpen={setOpenRequestDetailSheet}
          request={selectedRequest}
          reload={() => fetchRequestsData(true)}
        />
      )}
    </div>
  );
};

// Connect to Redux to get departments and user profile
const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
    departments: state.common.departments,
  };
};

export default connect(mapStateToProps)(AssetRequests);
