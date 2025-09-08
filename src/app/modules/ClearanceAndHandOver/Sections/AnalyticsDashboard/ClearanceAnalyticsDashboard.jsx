// src/app/modules/ClearanceAndHandOver/Sections/ClearanceAnalyticsDashboard.jsx

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { PageLoader, TableCustom } from "components";
import { getClearanceAnalytics } from "app/hooks/clearanceAndHandover";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

// Import analytics components with better organization
import AnalyticsStatusCards from "./AnalyticsStatusCards";
import AnalyticsCharts from "./AnalyticsCharts";
import AnalyticsFilters from "./AnalyticsFilters";
import { AnalyticsTableColumns } from "./AnalyticsTableColumns";

// Import utility functions with enhanced error handling
import {
  applyFilters,
  enhanceClearanceData,
} from "./clearanceAnalyticsUtils";

// Constants for better maintainability and performance optimization
const ANALYTICS_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_SORT_ORDER: "-id",
  REFRESH_INTERVAL: 300000, // 5 minutes
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

const DASHBOARD_METRICS = {
  PERFORMANCE_THRESHOLDS: {
    EXCELLENT: 95,
    GOOD: 80,
    AVERAGE: 60,
    POOR: 40,
  },
  SLA_WARNING_THRESHOLD: 0.8, // 80% of SLA time elapsed
  DATA_FRESHNESS_THRESHOLD: 600000, // 10 minutes
};

// Custom hook for managing analytics data with enhanced error handling and caching
const useAnalyticsData = () => {
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState({
    status_summary: [],
    department_summary: [],
    type_summary: [],
    clearance_list: [],
  });
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Enhanced fetch function with retry logic and caching
  const fetchAnalyticsData = useCallback(
    async (filterData = {}, forceRefresh = false) => {
      const now = Date.now();
      const isDataFresh =
        lastFetchTime &&
        now - lastFetchTime < DASHBOARD_METRICS.DATA_FRESHNESS_THRESHOLD;

      // Skip fetch if data is fresh and not forced
      if (
        isDataFresh &&
        !forceRefresh &&
        Object.keys(filterData).length === 0
      ) {
        return;
      }

      setLoading(true);

      // Retry logic with exponential backoff
      const attemptFetch = async (attempt = 1) => {
        try {
          const response = await getClearanceAnalytics(filterData);

          if (response) {
            setApiData(response);
            setLastFetchTime(now);
            setRetryCount(0);

            // Log analytics metrics for performance monitoring
            console.info("Analytics data fetched successfully", {
              recordCount: response.clearance_list?.length || 0,
              fetchTime: Date.now() - now,
              attempt,
            });
          }
        } catch (error) {
          console.error(`Analytics fetch attempt ${attempt} failed:`, error);

          if (attempt < ANALYTICS_CONFIG.MAX_RETRY_ATTEMPTS) {
            const delay =
              ANALYTICS_CONFIG.RETRY_DELAY * Math.pow(2, attempt - 1);
            setTimeout(() => attemptFetch(attempt + 1), delay);
            setRetryCount(attempt);
          } else {
            toast.error(
              "Failed to load analytics data after multiple attempts"
            );
            setRetryCount(0);
          }
        } finally {
          if (
            attempt === 1 ||
            attempt === ANALYTICS_CONFIG.MAX_RETRY_ATTEMPTS
          ) {
            setLoading(false);
          }
        }
      };

      await attemptFetch();
    },
    [lastFetchTime]
  );

  return {
    loading,
    apiData,
    lastFetchTime,
    retryCount,
    fetchAnalyticsData,
  };
};

// Custom hook for managing filter state with validation and persistence
const useAnalyticsFilters = () => {
  const [filterData, setFilterData] = useState({});
  const [filterHistory, setFilterHistory] = useState([]);

  // Enhanced filter change handler with validation
  const handleFilterChange = useCallback((filterName, filterValue) => {
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };

      // Validate filter value
      if (
        filterValue === "" ||
        filterValue === null ||
        filterValue === undefined
      ) {
        delete updatedFilters[filterName];
      } else if (Array.isArray(filterValue) && filterValue.length === 0) {
        delete updatedFilters[filterName];
      } else {
        // Additional validation based on filter type
        if (filterName === "date_range" && filterValue) {
          const { startDate, endDate } = filterValue;
          if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            toast.error("Start date cannot be after end date");
            return prevFilters;
          }
        }

        updatedFilters[filterName] = filterValue;
      }

      // Store filter in history for undo functionality
      setFilterHistory((prev) => [...prev.slice(-9), prevFilters]);

      return updatedFilters;
    });
  }, []);

  // Enhanced clear filters with confirmation
  const handleClearFilters = useCallback(() => {
    if (Object.keys(filterData).length > 0) {
      setFilterHistory((prev) => [...prev.slice(-9), filterData]);
      setFilterData({});
      toast.info("Filters cleared");
    }
  }, [filterData]);

  // Undo last filter change
  const undoLastFilter = useCallback(() => {
    if (filterHistory.length > 0) {
      const lastFilter = filterHistory[filterHistory.length - 1];
      setFilterData(lastFilter);
      setFilterHistory((prev) => prev.slice(0, -1));
      toast.info("Filter change undone");
    }
  }, [filterHistory]);

  return {
    filterData,
    filterHistory,
    handleFilterChange,
    handleClearFilters,
    undoLastFilter,
  };
};

// Custom hook for enhanced data processing and analysis
const useDataProcessing = (apiData, filterData) => {
  // Enhanced data processing with memoization for performance
  const enhancedData = useMemo(() => {
    if (!apiData.clearance_list || apiData.clearance_list.length === 0) {
      return [];
    }

    try {
      const enhanced = enhanceClearanceData(apiData.clearance_list);

      // Add additional analytics calculations
      return enhanced.map((item) => ({
        ...item,
        performance_score: calculatePerformanceScore(item),
        risk_level: calculateRiskLevel(item),
        efficiency_rating: calculateEfficiencyRating(item),
      }));
    } catch (error) {
      console.error("Error enhancing clearance data:", error);
      toast.error("Error processing analytics data");
      return [];
    }
  }, [apiData.clearance_list]);

  // Enhanced filtering with performance optimization
  const filteredData = useMemo(() => {
    try {
      return applyFilters(enhancedData, filterData);
    } catch (error) {
      console.error("Error applying filters:", error);
      toast.error("Error filtering data");
      return enhancedData;
    }
  }, [enhancedData, filterData]);

  // Advanced analytics calculations
  const analyticsMetrics = useMemo(() => {
    if (filteredData.length === 0) return {};

    return {
      averageCompletionTime: calculateAverageCompletionTime(filteredData),
      slaCompliance: calculateSLACompliance(filteredData),
      departmentPerformance: calculateDepartmentPerformance(filteredData),
      trendAnalysis: calculateTrendAnalysis(filteredData),
      bottlenecks: identifyBottlenecks(filteredData),
    };
  }, [filteredData]);

  return {
    enhancedData,
    filteredData,
    analyticsMetrics,
  };
};

// Helper functions for advanced analytics calculations
const calculatePerformanceScore = (item) => {
  let score = 100;

  // Deduct points for delays
  if (item.is_overdue) {
    score -= Math.min(item.days_overdue * 5, 50);
  }

  // Bonus for early completion
  if (item.status === "COMPLETED" && item.days_pending < item.sla * 0.8) {
    score += 10;
  }

  return Math.max(score, 0);
};

const calculateRiskLevel = (item) => {
  if (item.is_overdue) return "HIGH";
  if (item.sla_status === "AT_RISK") return "MEDIUM";
  return "LOW";
};

const calculateEfficiencyRating = (item) => {
  const progress = item.progress_percentage;
  const timeElapsed = item.days_pending;
  const sla = item.sla;

  if (sla === 0) return "N/A";

  const expectedProgress = (timeElapsed / sla) * 100;
  const efficiency = (progress / expectedProgress) * 100;

  if (efficiency >= DASHBOARD_METRICS.PERFORMANCE_THRESHOLDS.EXCELLENT)
    return "EXCELLENT";
  if (efficiency >= DASHBOARD_METRICS.PERFORMANCE_THRESHOLDS.GOOD)
    return "GOOD";
  if (efficiency >= DASHBOARD_METRICS.PERFORMANCE_THRESHOLDS.AVERAGE)
    return "AVERAGE";
  return "POOR";
};

const calculateAverageCompletionTime = (data) => {
  const completedItems = data.filter((item) => item.status === "COMPLETED");
  if (completedItems.length === 0) return 0;

  const totalTime = completedItems.reduce(
    (sum, item) => sum + item.days_pending,
    0
  );
  return Math.round(totalTime / completedItems.length);
};

const calculateSLACompliance = (data) => {
  const itemsWithSLA = data.filter((item) => item.sla > 0);
  if (itemsWithSLA.length === 0) return 100;

  const compliantItems = itemsWithSLA.filter((item) => !item.is_overdue);
  return Math.round((compliantItems.length / itemsWithSLA.length) * 100);
};

const calculateDepartmentPerformance = (data) => {
  const departmentStats = {};

  data.forEach((item) => {
    const dept = item.department__name;
    if (!departmentStats[dept]) {
      departmentStats[dept] = { total: 0, completed: 0, overdue: 0 };
    }

    departmentStats[dept].total++;
    if (item.status === "COMPLETED") departmentStats[dept].completed++;
    if (item.is_overdue) departmentStats[dept].overdue++;
  });

  return Object.entries(departmentStats).map(([dept, stats]) => ({
    department: dept,
    completionRate: Math.round((stats.completed / stats.total) * 100),
    overdueRate: Math.round((stats.overdue / stats.total) * 100),
    total: stats.total,
  }));
};

const calculateTrendAnalysis = (data) => {
  // Simplified trend analysis - can be expanded
  const last30Days = data.filter((item) => {
    const startDate = new Date(item.start_date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return startDate >= thirtyDaysAgo;
  });

  return {
    recentRequests: last30Days.length,
    completionTrend: last30Days.filter((item) => item.status === "COMPLETED")
      .length,
  };
};

const identifyBottlenecks = (data) => {
  const pendingByDepartment = {};

  data
    .filter((item) => item.status === "PENDING")
    .forEach((item) => {
      const dept = item.department__name;
      pendingByDepartment[dept] = (pendingByDepartment[dept] || 0) + 1;
    });

  return Object.entries(pendingByDepartment)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([dept, count]) => ({ department: dept, pendingItems: count }));
};

// Main component with enhanced functionality and performance optimizations
const ClearanceAnalyticsDashboard = () => {
  // Use custom hooks for better code organization and reusability
  const { loading, apiData, lastFetchTime, retryCount, fetchAnalyticsData } =
    useAnalyticsData();

  const {
    filterData,
    filterHistory,
    handleFilterChange,
    handleClearFilters,
    undoLastFilter,
  } = useAnalyticsFilters();

  const { enhancedData, filteredData, analyticsMetrics } = useDataProcessing(
    apiData,
    filterData
  );

  // Options from Redux store with enhanced error handling
  const Departments = useSelector((state) => state.common.departments) || [];

  // Initial data fetch with error boundary
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        await fetchAnalyticsData();
      } catch (error) {
        console.error("Failed to initialize analytics dashboard:", error);
        toast.error("Failed to load dashboard. Please refresh the page.");
      }
    };

    initializeDashboard();
  }, [fetchAnalyticsData]);

  // Auto-refresh data with configurable interval
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading && document.visibilityState === "visible") {
        fetchAnalyticsData({}, false); // Non-forced refresh
      }
    }, ANALYTICS_CONFIG.REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [loading, fetchAnalyticsData]);

  // Handle card click with enhanced analytics tracking
  const handleCardClick = useCallback(
    (cardKey, cardTitle) => {
      const filterMap = {
        pending: { status: ["PENDING"] },
        in_process: { status: ["IN_PROCESS"] },
        completed: { status: ["COMPLETED"] },
        rejected: { status: ["REJECTED"] },
        overdue: { is_overdue: true },
        total: {}, // Show all data
      };

      const newFilter = filterMap[cardKey] || {};

      // Track analytics interaction
      console.info("Dashboard card clicked", {
        cardKey,
        cardTitle,
        currentFilters: Object.keys(filterData).length,
        resultCount: filteredData.length,
      });

      handleFilterChange("card_filter", newFilter);
    },
    [filterData, filteredData.length, handleFilterChange]
  );

  // Enhanced view details handler with analytics
  const handleViewDetails = useCallback((row) => {
    console.info("View details clicked", {
      employeeId: row.employee,
      status: row.status,
      department: row.department__name,
    });

    toast.info(`Viewing details for ${row.employee_full_name}`);
  }, []);

  // Prepare filter options with enhanced validation
  const filterOptions = useMemo(
    () => ({
      departmentOptions: Departments.map((dept) => ({
        value: dept.value,
        label: dept.label,
        count:
          apiData.clearance_list?.filter(
            (item) => item.department__name === dept.label
          ).length || 0,
      })),
      clearanceTypeOptions: Array.from(
        new Set(
          apiData.clearance_list?.map((item) => item.clearance_type__name) || []
        )
      ).map((type) => ({
        value: type,
        label: type,
        count:
          apiData.clearance_list?.filter(
            (item) => item.clearance_type__name === type
          ).length || 0,
      })),
    }),
    [Departments, apiData.clearance_list]
  );

  // Loading state with retry information
  if (loading && !apiData.clearance_list?.length) {
    return (
      <div className="space-y-4">
        <PageLoader />
        {retryCount > 0 && (
          <div className="text-center text-sm text-gray-600">
            Retrying... (Attempt {retryCount + 1} of{" "}
            {ANALYTICS_CONFIG.MAX_RETRY_ATTEMPTS})
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header with real-time information */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-plum-1100">
            Analytics Dashboard
          </h2>
          <div className="flex items-center gap-4 text-mauve-1000">
            <p>
              Monitor clearance requests, SLA compliance, and track progress
            </p>
            {lastFetchTime && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                Last updated: {new Date(lastFetchTime).toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        {/* Enhanced controls */}
        <div className="flex gap-2">
          {filterHistory.length > 0 && (
            <button
              onClick={undoLastFilter}
              className="text-xs bg-yellow-100 hover:bg-yellow-200 px-3 py-1 rounded transition-colors"
            >
              Undo Filter
            </button>
          )}
          <button
            onClick={() => fetchAnalyticsData({}, true)}
            disabled={loading}
            className="text-xs bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded transition-colors disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Enhanced Status Cards with analytics metrics */}
      <AnalyticsStatusCards
        apiData={apiData}
        loading={loading}
        onCardClick={handleCardClick}
        analyticsMetrics={analyticsMetrics}
      />

      {/* Enhanced Charts with performance data */}
      <AnalyticsCharts
        apiData={apiData}
        enhancedData={enhancedData}
        analyticsMetrics={analyticsMetrics}
      />

      {/* Performance Insights Section */}
      {analyticsMetrics.departmentPerformance && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {analyticsMetrics.slaCompliance || 0}%
                </div>
                <div className="text-sm text-gray-600">SLA Compliance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {analyticsMetrics.averageCompletionTime || 0}
                </div>
                <div className="text-sm text-gray-600">
                  Avg. Days to Complete
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {analyticsMetrics.trendAnalysis?.recentRequests || 0}
                </div>
                <div className="text-sm text-gray-600">
                  Requests (Last 30 Days)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Detailed Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Detailed Clearance Requests ({filteredData.length})</span>
            {Object.keys(filterData).length > 0 && (
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {Object.keys(filterData).length} filter(s) applied
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Enhanced Filters with usage statistics */}
          <AnalyticsFilters
            filterData={filterData}
            onFilterChange={handleFilterChange}
            departmentOptions={filterOptions.departmentOptions}
            clearanceTypeOptions={filterOptions.clearanceTypeOptions}
            onClearFilters={handleClearFilters}
            showStatistics={true}
          />

          {loading ? (
            <div className="flex justify-center py-8">
              <PageLoader />
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No clearance requests found matching current filters</p>
              {Object.keys(filterData).length > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="mt-2 text-sm text-blue-600 hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Data quality indicators */}
              {analyticsMetrics.bottlenecks?.length > 0 && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <h4 className="text-sm font-medium text-yellow-800 mb-2">
                    Identified Bottlenecks:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analyticsMetrics.bottlenecks.map((bottleneck) => (
                      <span
                        key={bottleneck.department}
                        className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded"
                      >
                        {bottleneck.department}: {bottleneck.pendingItems}{" "}
                        pending
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <TableCustom
                columns={AnalyticsTableColumns(handleViewDetails)}
                data={filteredData}
                pagination={true}
                dataTotalSize={filteredData.length}
                tableOptions={{
                  page: 1,
                  sizePerPage: ANALYTICS_CONFIG.DEFAULT_PAGE_SIZE,
                  onPageChange: () => {},
                  onSortChange: () => {},
                }}
                exportOptions={{
                  fileName: `clearance-analytics-${
                    new Date().toISOString().split("T")[0]
                  }`,
                  includeFilters: true,
                  customMetadata: analyticsMetrics,
                }}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClearanceAnalyticsDashboard;
