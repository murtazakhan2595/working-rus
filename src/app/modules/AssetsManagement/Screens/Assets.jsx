import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Button } from "components/ui/button";
import { Header, PageLoader } from "components";
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
import AddUpdateAsset from "./AddUpdateAsset";
import AssetRequestSheet from "./AssetRequestSheet";
import AssetRequestViewSheet from "./AssetRequestViewSheet";
import { getAssetList, getAssetById, deleteAsset } from "app/hooks/assets";
import {
  AssetsColumns,
  AssetRequestColumns,
} from "app/utils/Types/TableColumns";
import { getEmployeeAssets } from "app/hooks/assets";

const Assets = ({ userProfile, departments }) => {
  const [activeTab, setActiveTab] = useState("assets");

  // Assets tab state
  const [isLoading, setIsLoading] = useState(false);
  const [assetsList, setAssetsList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [openAddAssetModal, setOpenAddAssetModal] = useState(false);
  const [assetToEdit, setAssetToEdit] = useState(null);
  const [filterData, setFilterData] = useState({});
  const [selectedAssetType, setSelectedAssetType] = useState("");

  // Requests & Assignments tab state
  const [requestsData, setRequestsData] = useState([]);
  const [requestsTotalCount, setRequestsTotalCount] = useState(0);
  const [requestsFilterData, setRequestsFilterData] = useState({});
  const [openRequestDetailSheet, setOpenRequestDetailSheet] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedRequestType, setSelectedRequestType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  // Asset request/assignment sheet state
  const [openAssetRequestSheet, setOpenAssetRequestSheet] = useState(false);
  const [assetSheetMode, setAssetSheetMode] = useState("request"); // "request" or "assign"

  // Separate pagination options for each tab
  const [assetsOptions, setAssetsOptions] = useState({
    page: 1,
    sizePerPage: 10,
  });

  const [requestsOptions, setRequestsOptions] = useState({
    page: 1,
    sizePerPage: 10,
  });

  // Get the current options based on active tab
  const options = activeTab === "assets" ? assetsOptions : requestsOptions;

  const onPageChange = (name, value) => {
    if (activeTab === "assets") {
      setAssetsOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
    } else {
      setRequestsOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
    }
  };

  // Reset filter states when tab changes
  useEffect(() => {
    if (activeTab === "assets") {
      setRequestsFilterData({});
      setSelectedRequestType("");
      setSelectedStatus("");
      setSelectedDepartment("");
    } else {
      setFilterData({});
      setSelectedAssetType("");
    }
  }, [activeTab]);

  // ASSETS TAB FUNCTIONS
  const fetchAssetsData = async (isMounted = true) => {
    setIsLoading(true);
    try {
      if (isMounted) {
        const response = await getAssetList({
          options: assetsOptions,
          filterData: filterData,
        });

        if (response) {
          setAssetsList(response.results || []);
          setTotalCount(response.count || 0);
        }
      }
    } catch (error) {
      console.error("Error fetching Assets", error);
      toast.error("Failed to load assets");
    } finally {
      if (isMounted) setIsLoading(false);
    }
  };

  const handleAddOrEditAsset = () => {
    setAssetToEdit(null);
    setOpenAddAssetModal(true);
  };

  const handleCloseModal = () => {
    setAssetToEdit(null);
    setOpenAddAssetModal(false);
  };

  // REQUESTS & ASSIGNMENTS TAB FUNCTIONS
  const fetchRequestsData = async (isMounted = true) => {
    setIsLoading(true);
    try {
      if (isMounted) {
        const response = await getEmployeeAssets({
          options: requestsOptions,
          filterData: requestsFilterData,
        });

        if (response) {
          setRequestsData(response.results || []);
          setRequestsTotalCount(response.count || 0);
        }
      }
    } catch (error) {
      console.error("Error fetching Requests & Assignments", error);
      toast.error("Failed to load requests and assignments");
    } finally {
      if (isMounted) setIsLoading(false);
    }
  };

  const handleAssignAsset = () => {
    setAssetSheetMode("assign");
    setOpenAssetRequestSheet(true);
  };

  // FILTER HANDLERS FOR EACH TAB
  const handleAssetsFilterChange = (filterName, filterValue) => {
    // Reset to page 1 when filter changes
    setAssetsOptions((prevOptions) => ({ ...prevOptions, page: 1 }));

    // Update selected values for UI display
    if (filterName === "asset_type") {
      setSelectedAssetType(filterValue);
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

  const handleRequestsFilterChange = (filterName, filterValue) => {
    // Reset to page 1 when filter changes
    setRequestsOptions((prevOptions) => ({ ...prevOptions, page: 1 }));

    // Update selected values for UI display
    if (filterName === "request_type") {
      setSelectedRequestType(filterValue);
    } else if (filterName === "status") {
      setSelectedStatus(filterValue);
    } else if (filterName === "department") {
      setSelectedDepartment(filterValue);
    }

    setRequestsFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterValue === "") {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }
      return updatedFilters;
    });
  };

  // TABLE OPTIONS FOR EACH TAB
  const assetsTableOptions = {
    page: assetsOptions.page,
    sizePerPage: assetsOptions.sizePerPage,
    onPageChange: onPageChange,
    onRowClick: async (row) => {
      try {
        setIsLoading(true);
        const assetDetails = await getAssetById(row.id);
        if (assetDetails) {
          setAssetToEdit(assetDetails);
          setOpenAddAssetModal(true);
        }
      } catch (error) {
        console.error("Error fetching asset details:", error);
        toast.error("Failed to load asset details");
      } finally {
        setIsLoading(false);
      }
    },
  };

  const requestsTableOptions = {
    page: requestsOptions.page,
    sizePerPage: requestsOptions.sizePerPage,
    onPageChange: onPageChange,
    onRowClick: (row) => {
      setSelectedRequest(row);
      setOpenRequestDetailSheet(true);
    },
  };

  // Load data based on active tab
  useEffect(() => {
    let isMounted = true;

    if (activeTab === "assets") {
      fetchAssetsData(isMounted);
    }

    return () => {
      isMounted = false;
    };
  }, [activeTab, assetsOptions, filterData]);

  // Separate effect for requests tab to prevent unnecessary fetches
  useEffect(() => {
    let isMounted = true;

    if (activeTab === "requests") {
      fetchRequestsData(isMounted);
    }

    return () => {
      isMounted = false;
    };
  }, [activeTab, requestsOptions, requestsFilterData]);

  // Tab configuration
  const tabsData = [
    { value: "assets", label: "Assets" },
    { value: "requests", label: "Requests & Assign" },
  ];

  const enhancedRequestColumns = [
    ...AssetRequestColumns.filter((col) => col.dataField !== "id"), // Remove the ID column as we'll have different IDs
  ];

  // Filters configuration for each tab
  const filters =
    activeTab === "assets"
      ? [
          {
            type: "search",
            placeholder: "Asset Name",
            name: "asset_name",
          },
          {
            type: "select-one",
            option: [
              { value: "Computer", label: "Computer" },
              { value: "Mobile", label: "Mobile" },
              { value: "Furniture", label: "Furniture" },
              { value: "Other", label: "Other" },
            ],
            name: "asset_type",
            placeholder: "Asset Type",
            values: selectedAssetType,
          },
        ]
      : [
          {
            type: "search",
            placeholder: "Employee Name",
            name: "employee_name",
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

  // We'll remove the full-page loader and handle loading states in the tables directly

  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <Header
        content={
          activeTab === "assets" ? (
            <Button onClick={handleAddOrEditAsset}>Add Asset</Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleAssignAsset}>Assign Asset</Button>
            </div>
          )
        }
      />

      <Tabs
        value={activeTab}
        onValueChange={(newTab) => {
          // Reset loading state when changing tabs
          setIsLoading(false);
          setActiveTab(newTab);

          // Reset pagination when switching tabs
          if (newTab === "assets") {
            setAssetsOptions({ page: 1, sizePerPage: 10 });
          } else {
            setRequestsOptions({ page: 1, sizePerPage: 10 });
          }

          // Don't reset filter selections here - this is handled in the useEffect
        }}
        defaultValue="assets"
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
            <FilterInput
              filters={filters}
              onChange={
                activeTab === "assets"
                  ? handleAssetsFilterChange
                  : handleRequestsFilterChange
              }
            />
          </div>
        </div>

        <Card>
          <CardContent>
            <TabsContent value="assets">
              <CustomTable
                columns={AssetsColumns}
                data={isLoading ? [] : assetsList}
                pagination={true}
                dataTotalSize={totalCount}
                tableOptions={assetsTableOptions}
                loading={isLoading}
              />
            </TabsContent>

            <TabsContent value="requests">
              <CustomTable
                columns={enhancedRequestColumns}
                data={isLoading ? [] : requestsData}
                pagination={true}
                dataTotalSize={requestsTotalCount}
                tableOptions={requestsTableOptions}
                loading={isLoading}
              />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>

      {/* Asset Add/Edit Modal */}
      {openAddAssetModal && (
        <AddUpdateAsset
          isOpen={openAddAssetModal}
          setIsOpen={handleCloseModal}
          assetToEdit={assetToEdit}
          viewMode={assetToEdit !== null}
          reload={() => fetchAssetsData(true)}
        />
      )}

      {/* Combined Asset Request/Assignment Sheet */}
      {openAssetRequestSheet && (
        <AssetRequestSheet
          isOpen={openAssetRequestSheet}
          setIsOpen={setOpenAssetRequestSheet}
          mode={assetSheetMode}
          reload={() => {
            fetchRequestsData(true);
            fetchAssetsData(true);
          }}
          departments={departments}
        />
      )}

      {/* Asset Request Detail Sheet */}
      {openRequestDetailSheet && (
        <AssetRequestViewSheet
          isOpen={openRequestDetailSheet}
          setIsOpen={setOpenRequestDetailSheet}
          request={selectedRequest}
          reload={() => {
            fetchRequestsData(true);
          }}
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

export default connect(mapStateToProps)(Assets);
