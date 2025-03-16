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
import AssetRequestDetailSheet from "./AssetRequestDetailSheet";
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

  // Requests & Assignments tab state
  const [requestsData, setRequestsData] = useState([]);
  const [requestsTotalCount, setRequestsTotalCount] = useState(0);
  const [requestsFilterData, setRequestsFilterData] = useState({});
  const [openRequestDetailSheet, setOpenRequestDetailSheet] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Asset request/assignment sheet state
  const [openAssetRequestSheet, setOpenAssetRequestSheet] = useState(false);
  const [assetSheetMode, setAssetSheetMode] = useState("request"); // "request" or "assign"

  // Pagination options
  const [options, setOptions] = useState({
    page: 1,
    sizePerPage: 10,
    sortField: "created_at",
    sortOrder: "desc",
  });

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  // ASSETS TAB FUNCTIONS
  const fetchAssetsData = async (isMounted = true) => {
    setIsLoading(true);
    try {
      if (isMounted) {
        const response = await getAssetList({
          options: options,
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
          options: options,
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
    onPageChange("page", 1);
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
    onPageChange("page", 1);
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
    page: options.page,
    sizePerPage: options.sizePerPage,
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
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onRowClick: (row) => {
      // Different handling based on whether it's a request or assignment
      if (row.request_type === "Request") {
        setSelectedRequest(row);
        setOpenRequestDetailSheet(true);
      } else {
        // For assignments, you could view the asset details or display differently
        // For now, just show a toast message
        toast.info(
          `Viewing assignment for ${row.asset_name} to ${row.employee_name}`
        );
      }
    },
  };

  // Load data based on active tab
  useEffect(() => {
    let isMounted = true;

    if (activeTab === "assets") {
      fetchAssetsData(isMounted);
    } else if (activeTab === "requests") {
      fetchRequestsData(isMounted);
    }

    return () => {
      isMounted = false;
    };
  }, [activeTab, options, filterData, requestsFilterData]);

  // Tab configuration
  const tabsData = [
    { value: "assets", label: "Assets" },
    { value: "requests", label: "Requests & Assign" },
  ];

  // Enhanced columns for the combined requests and assignments tab
  const enhancedRequestColumns = [
    {
      dataField: "request_type",
      text: "Type",
      sort: true,
      formatter: (cell) => {
        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full 
            ${
              cell === "Request"
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {cell}
          </span>
        );
      },
    },
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
          },
        ]
      : [
          {
            type: "select-one",
            option: [
              { value: "Request", label: "Requests" },
              { value: "Assignment", label: "Assignments" },
            ],
            name: "request_type",
            placeholder: "Type",
          },
          {
            type: "search",
            placeholder: "Employee Name",
            name: "employee_name",
          },
          {
            type: "select-one",
            option: [
              { value: "Pending", label: "Pending" },
              { value: "Approved", label: "Approved" },
              { value: "Rejected", label: "Rejected" },
              { value: "Accepted", label: "Accepted" },
              { value: "Returned", label: "Returned" },
            ],
            name: "status",
            placeholder: "Status",
          },
          {
            type: "select-one",
            option: departments || [],
            name: "department",
            placeholder: "Department",
          },
        ];

  // Loading state
  if (
    (isLoading && activeTab === "assets" && !assetsList.length) ||
    (isLoading && activeTab === "requests" && !requestsData.length)
  )
    return <PageLoader />;

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
        onValueChange={setActiveTab}
        defaultValue="assets"
      >
        <div className="flex flex-col items-start justify-between lg:flex-row md:flex-row xl:flex-row">
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
          <FilterInput
            filters={filters}
            onChange={
              activeTab === "assets"
                ? handleAssetsFilterChange
                : handleRequestsFilterChange
            }
          />
        </div>

        <Card>
          <CardContent>
            <TabsContent value="assets">
              <CustomTable
                columns={AssetsColumns}
                data={assetsList}
                pagination={true}
                dataTotalSize={totalCount}
                tableOptions={assetsTableOptions}
                loading={isLoading && activeTab === "assets"}
              />
            </TabsContent>

            <TabsContent value="requests">
              <CustomTable
                columns={enhancedRequestColumns}
                data={requestsData}
                pagination={true}
                dataTotalSize={requestsTotalCount}
                tableOptions={requestsTableOptions}
                loading={isLoading && activeTab === "requests"}
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
      {selectedRequest && openRequestDetailSheet && (
        <AssetRequestDetailSheet
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
