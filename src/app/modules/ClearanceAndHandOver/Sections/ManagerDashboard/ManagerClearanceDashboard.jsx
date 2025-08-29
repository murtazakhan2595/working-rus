// src/app/modules/ClearanceAndHandOver/Sections/ManagerDashboard/ManagerClearanceDashboard.jsx

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { PageLoader, TableCustom } from "components";
import { getClearanceAnalytics } from "app/hooks/clearanceAndHandover";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { HasAccess } from "utils/PermissionUtils";

// Reuse existing components from analytics
import AnalyticsStatusCards from "../AnalyticsDashboard/AnalyticsStatusCards";
import AnalyticsCharts from "../AnalyticsDashboard/AnalyticsCharts";
import AnalyticsFilters from "../AnalyticsDashboard/AnalyticsFilters";
import { ManagerTableColumns } from "./ManagerTableColumns";
import ManagerClearanceDetailsModal from "./ManagerClearanceDetailsModal";

// Reuse existing utils
import {
  applyFilters,
  enhanceClearanceData,
} from "../AnalyticsDashboard/clearanceAnalyticsUtils";

const ManagerClearanceDashboard = () => {
  // State management - same as analytics dashboard
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState({
    status_summary: [],
    department_summary: [],
    type_summary: [],
    clearance_list: [],
  });
  const [filterData, setFilterData] = useState({});
  const [enhancedData, setEnhancedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // Modal state
  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedClearanceRequest, setSelectedClearanceRequest] =
    useState(null);

  // Get current user for manager filtering
  const userProfile = useSelector((state) => state.user.userProfile);
  const currentUserId = userProfile?.id;

  // Options from Redux store
  const Departments = useSelector((state) => state.common.departments);

  // Permission check
  const isManager = HasAccess("VIEW_MANAGER_CLEARANCE_DASHBOARD") || true; // TODO: Replace with actual permission

  // Fetch data on component mount and filter changes
  useEffect(() => {
    if (isManager && currentUserId) {
      fetchManagerAnalyticsData();
    }
  }, [isManager, currentUserId]);

  // Enhanced data when API data changes
  useEffect(() => {
    if (apiData.clearance_list && apiData.clearance_list.length > 0) {
      const enhanced = enhanceClearanceData(apiData.clearance_list);
      setEnhancedData(enhanced);
    } else {
      setEnhancedData([]);
    }
  }, [apiData]);

  // Apply filters when filter data or enhanced data changes
  useEffect(() => {
    const filtered = applyFilters(enhancedData, filterData);
    setFilteredData(filtered);
  }, [enhancedData, filterData]);

  const fetchManagerAnalyticsData = async () => {
    setLoading(true);
    try {
      const managerFilterData = {
        ...filterData,
        // TODO: Add manager filter when backend implements it
        // manager: currentUserId,
      };

      const response = await getClearanceAnalytics(managerFilterData);
      if (response) {
        setApiData(response);
      }
    } catch (error) {
      console.error("Error fetching manager analytics data:", error);
      toast.error("Failed to load manager dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName, filterValue) => {
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };

      if (
        filterValue === "" ||
        filterValue === null ||
        filterValue === undefined
      ) {
        delete updatedFilters[filterName];
      } else if (Array.isArray(filterValue) && filterValue.length === 0) {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }

      return updatedFilters;
    });
  };

  const handleClearFilters = () => {
    setFilterData({});
  };

  const handleCardClick = (cardKey, cardTitle) => {
    // Filter data based on card clicked
    const filterMap = {
      pending: { status: ["PENDING"] },
      in_process: { status: ["IN_PROCESS"] },
      completed: { status: ["COMPLETED"] },
      rejected: { status: ["REJECTED"] },
      overdue: { is_overdue: true },
      total: {}, // Show all data
    };

    const newFilter = filterMap[cardKey] || {};
    setFilterData((prevFilters) => ({ ...prevFilters, ...newFilter }));
  };

  const handleSendReminder = async (row) => {
    // TODO: Implement when backend provides reminder API
    try {
      // Placeholder for reminder API call
      // const response = await sendClearanceReminder(row.id);
      toast.success(`Reminder sent for ${row.employee_full_name}'s clearance`);
    } catch (error) {
      console.error("Error sending reminder:", error);
      toast.error("Failed to send reminder");
    }
  };

  const handleViewDetails = (row) => {
    // Open details modal for selected clearance request
    setSelectedClearanceRequest(row);
    setDetailsModal(true);
  };

  // Prepare options for filters
  const departmentOptions = Departments || [];
  const clearanceTypeOptions = Array.from(
    new Set(
      apiData.clearance_list?.map((item) => item.clearance_type__name) || []
    )
  ).map((type) => ({ value: type, label: type }));

  // Check access
  if (!isManager) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-neutral-1100">
            You don't have permission to view the manager dashboard.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading && !apiData.clearance_list?.length) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-plum-1100">
            Manager Clearance Dashboard
          </h2>
          <p className="text-mauve-1000">
            Monitor your team's pending clearance items, track progress, and
            send reminders for timely completion
          </p>
        </div>
      </div>

      {/* Status Cards - Reuse existing component */}
      <AnalyticsStatusCards
        apiData={apiData}
        loading={loading}
        onCardClick={handleCardClick}
      />

      {/* Charts Row - Reuse existing component */}
      <AnalyticsCharts apiData={apiData} enhancedData={enhancedData} />

      {/* Team Clearance Overview Table */}
      <Card>
        <CardHeader>
          <CardTitle>Team Clearance Overview ({filteredData.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters - Reuse existing component */}
          <AnalyticsFilters
            filterData={filterData}
            onFilterChange={handleFilterChange}
            departmentOptions={departmentOptions}
            clearanceTypeOptions={clearanceTypeOptions}
            onClearFilters={handleClearFilters}
          />

          {loading ? (
            <div className="flex justify-center py-8">
              <PageLoader />
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No team clearance requests found matching current filters</p>
              {apiData.clearance_list?.length === 0 && (
                <p className="text-sm mt-2">
                  No clearance activity for your team at this time.
                </p>
              )}
            </div>
          ) : (
            <TableCustom
              columns={ManagerTableColumns(
                handleViewDetails,
                handleSendReminder
              )}
              data={filteredData}
              pagination={true}
              dataTotalSize={filteredData.length}
              tableOptions={{
                page: 1,
                sizePerPage: 10,
                onPageChange: () => {},
                onSortChange: () => {},
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* Details Modal */}
      {detailsModal && selectedClearanceRequest && (
        <ManagerClearanceDetailsModal
          isOpen={detailsModal}
          setIsOpen={setDetailsModal}
          clearanceRequest={selectedClearanceRequest}
          reload={fetchManagerAnalyticsData}
          clearanceTypes={clearanceTypeOptions}
          clearanceList={filteredData}
        />
      )}
    </div>
  );
};

export default ManagerClearanceDashboard;
