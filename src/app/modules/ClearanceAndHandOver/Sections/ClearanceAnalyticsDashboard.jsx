// src/app/modules/ClearanceAndHandOver/Sections/ClearanceAnalyticsDashboard.jsx

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { PageLoader, TableCustom } from "components";
import { getClearanceAnalytics } from "app/hooks/clearanceAndHandover";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

// Import our new components
import AnalyticsStatusCards from "./AnalyticsDashboard/AnalyticsStatusCards";
import AnalyticsCharts from "./AnalyticsDashboard/AnalyticsCharts";
import AnalyticsFilters from "./AnalyticsDashboard/AnalyticsFilters";
import AnalyticsAlerts from "./AnalyticsDashboard/AnalyticsAlerts";
import { AnalyticsTableColumns } from "./AnalyticsDashboard/AnalyticsTableColumns";

// Import utils
import {
  applyFilters,
  enhanceClearanceData,
} from "./AnalyticsDashboard/clearanceAnalyticsUtils";

const ClearanceAnalyticsDashboard = () => {
  // State management
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

  // Options from Redux store
  const Departments = useSelector((state) => state.common.departments);

  // Fetch data on component mount and filter changes
  useEffect(() => {
    fetchAnalyticsData();
  }, []);

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

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const response = await getClearanceAnalytics(filterData);
      if (response) {
        setApiData(response);
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      toast.error("Failed to load analytics data");
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

  const handleViewDetails = (row) => {
    // Navigate to detailed view - you can implement this based on your routing
    console.log("View details for:", row);
    // You could open a modal or navigate to a detailed page
    // For now, let's just show a toast
    toast.info(`Viewing details for ${row.employee_full_name}`);
  };

  // Prepare options for filters
  const departmentOptions = Departments || [];
  const clearanceTypeOptions = Array.from(
    new Set(
      apiData.clearance_list?.map((item) => item.clearance_type__name) || []
    )
  ).map((type) => ({ value: type, label: type }));

  if (loading && !apiData.clearance_list?.length) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-plum-1100">
            Analytics Dashboard
          </h2>
          <p className="text-mauve-1000">
            Monitor clearance requests, SLA compliance, and identify bottlenecks
          </p>
        </div>
      </div>

      {/* Status Cards */}
      <AnalyticsStatusCards
        apiData={apiData}
        loading={loading} // Add this prop
        onCardClick={handleCardClick}
      />

      {/* Charts Row */}
      <AnalyticsCharts apiData={apiData} enhancedData={enhancedData} />

      {/* Alert Panels */}
      <AnalyticsAlerts enhancedData={enhancedData} />

      {/* Detailed Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Detailed Clearance Requests ({filteredData.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
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
              <p>No clearance requests found matching current filters</p>
            </div>
          ) : (
            <TableCustom
              columns={AnalyticsTableColumns(handleViewDetails)}
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
    </div>
  );
};

export default ClearanceAnalyticsDashboard;
