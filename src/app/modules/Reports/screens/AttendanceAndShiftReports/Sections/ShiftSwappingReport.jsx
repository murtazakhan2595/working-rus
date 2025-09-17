import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
// ============================================================================
// SHIFT SWAPPING REPORT COMPONENT
// ============================================================================
import { getShiftSwappingReportData } from "app/hooks/reports";
import { ShiftSwappingReportColumns } from "../TableColumns/AttendanceShiftTableColumns";

export const ShiftSwappingReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [shiftSwappingData, setShiftSwappingData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");

  // Chart colors
  const statusColors = ["#10B981", "#F59E0B", "#EF4444"];
  const employeeColors = ["#3B82F6", "#8B5CF6", "#10B981"];

  const fetchShiftSwappingData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getShiftSwappingReportData(payload);
      if (response) {
        setShiftSwappingData(response);
      }
    } catch (error) {
      console.error("Error fetching shift swapping data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchShiftSwappingData();
    }
  }, [filterData, permittedViewFilterData, options, ordering]);

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onSortChange: (sortName) => {
      setOrdering(sortName);
    },
  };

  // Calculate stats from aggregated data only
  const stats = {
    totalRequests:
      shiftSwappingData.aggregated_stats?.total_requests ||
      shiftSwappingData.count ||
      0,
    approvedSwaps: shiftSwappingData.aggregated_stats?.by_status?.Approved || 0,
    pendingSwaps: shiftSwappingData.aggregated_stats?.by_status?.Pending || 0,
    rejectedSwaps: shiftSwappingData.aggregated_stats?.by_status?.Rejected || 0,
    frequentRequesters:
      shiftSwappingData.aggregated_stats?.by_employee
        ?.frequent_requesters_3_plus || 0,
    moderateRequesters:
      shiftSwappingData.aggregated_stats?.by_employee?.moderate_requesters || 0,
    occasionalRequesters:
      shiftSwappingData.aggregated_stats?.by_employee?.occasional_requesters ||
      0,
  };

  // Status distribution chart data
  const statusChartData = React.useMemo(() => {
    if (!shiftSwappingData.aggregated_stats?.by_status) return [];

    return Object.entries(shiftSwappingData.aggregated_stats.by_status)
      .map(([status, count]) => ({
        status,
        count,
        percentage:
          stats.totalRequests > 0
            ? Math.round((count / stats.totalRequests) * 100)
            : 0,
      }))
      .filter((item) => item.count > 0);
  }, [shiftSwappingData.aggregated_stats, stats.totalRequests]);

  // Employee request pattern analysis
  const employeePatternData = React.useMemo(() => {
    if (!shiftSwappingData.aggregated_stats?.by_employee) return [];

    return [
      {
        pattern: "Frequent Requesters (3+)",
        count: stats.frequentRequesters,
        percentage:
          stats.totalRequests > 0
            ? Math.round((stats.frequentRequesters / stats.totalRequests) * 100)
            : 0,
      },
      {
        pattern: "Moderate Requesters",
        count: stats.moderateRequesters,
        percentage:
          stats.totalRequests > 0
            ? Math.round((stats.moderateRequesters / stats.totalRequests) * 100)
            : 0,
      },
      {
        pattern: "Occasional Requesters",
        count: stats.occasionalRequesters,
        percentage:
          stats.totalRequests > 0
            ? Math.round(
                (stats.occasionalRequesters / stats.totalRequests) * 100
              )
            : 0,
      },
    ].filter((item) => item.count > 0);
  }, [shiftSwappingData.aggregated_stats, stats]);

  // Request processing metrics
  const processingMetricsData = React.useMemo(() => {
    if (!shiftSwappingData.aggregated_stats) return [];

    const approvalRate =
      stats.totalRequests > 0
        ? ((stats.approvedSwaps / stats.totalRequests) * 100).toFixed(1)
        : 0;

    const pendingRate =
      stats.totalRequests > 0
        ? ((stats.pendingSwaps / stats.totalRequests) * 100).toFixed(1)
        : 0;

    return [
      {
        metric: "Total Requests",
        value: stats.totalRequests,
      },
      {
        metric: "Approval Rate (%)",
        value: parseFloat(approvalRate),
      },
      {
        metric: "Pending Rate (%)",
        value: parseFloat(pendingRate),
      },
      {
        metric: "Active Requesters",
        value:
          stats.frequentRequesters +
          stats.moderateRequesters +
          stats.occasionalRequesters,
      },
    ];
  }, [shiftSwappingData.aggregated_stats, stats]);

  return (
    <div className="space-y-6">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          {
            title: "Total Requests",
            value: stats.totalRequests.toLocaleString(),
            description: "Swap requests",
            color: "text-plum-900",
          },
          {
            title: "Approved",
            value: stats.approvedSwaps.toLocaleString(),
            description: "Approved swaps",
            color: "text-green-600",
          },
          {
            title: "Pending",
            value: stats.pendingSwaps.toLocaleString(),
            description: "Awaiting approval",
            color: "text-yellow-600",
          },
          {
            title: "Rejected",
            value: stats.rejectedSwaps.toLocaleString(),
            description: "Rejected requests",
            color: "text-red-600",
          },
          {
            title: "Approval Rate",
            value: `${
              stats.totalRequests > 0
                ? Math.round((stats.approvedSwaps / stats.totalRequests) * 100)
                : 0
            }%`,
            description: "Success rate",
            color: "text-blue-600",
          },
          {
            title: "Frequent Requesters",
            value: stats.frequentRequesters.toLocaleString(),
            description: "3+ requests",
            color: "text-purple-600",
          },
        ].map((stat, index) => (
          <Card
            key={index}
            className="flex flex-col justify-center shadow-md border rounded-lg"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-neutral-900">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-3xl font-medium ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-xs text-neutral-800 mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Request Status Distribution */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Request Status Distribution
            </CardTitle>
            <CardDescription>
              Breakdown of shift swap request statuses
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusChartData}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="none"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={statusColors[index % statusColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${value.toLocaleString()} requests (${
                      statusChartData.find((d) => d.status === name)?.percentage
                    }%)`,
                    name,
                  ]}
                  contentStyle={{ fontSize: "12px" }}
                />
                <Legend
                  verticalAlign="bottom"
                  wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Employee Request Patterns */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Employee Request Patterns
            </CardTitle>
            <CardDescription>
              Categorization of employees by request frequency
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={employeePatternData}
                  dataKey="count"
                  nameKey="pattern"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="none"
                >
                  {employeePatternData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={employeeColors[index % employeeColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${value.toLocaleString()} employees`,
                    name,
                  ]}
                  contentStyle={{ fontSize: "12px" }}
                />
                <Legend
                  verticalAlign="bottom"
                  wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Processing Metrics */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Request Processing Metrics
            </CardTitle>
            <CardDescription>
              Key metrics for shift swap request management
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={processingMetricsData}
                margin={{ top: 20, right: 20, left: 0, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="metric"
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ fontSize: "12px" }}
                  formatter={(value, name) => [value, "Value"]}
                />
                <Bar
                  dataKey="value"
                  fill="#8B5CF6"
                  name="Metric"
                  barSize={50}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Shift Swapping Table */}
      <Card>
        <CardHeader>
          <CardTitle>Shift Swapping Report</CardTitle>
          <CardDescription>
            Track approved and rejected shift swap requests to manage employee
            flexibility while maintaining operational requirements.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={ShiftSwappingReportColumns()}
              data={shiftSwappingData.results}
              pagination={true}
              dataTotalSize={shiftSwappingData.count}
              tableOptions={tableOptions}
              fallbackText="No shift swapping data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
