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
// SHIFT ALLOCATION REPORT COMPONENT
// ============================================================================
import { getShiftAllocationReportData } from "app/hooks/reports";
import { ShiftAllocationReportColumns } from "../TableColumns/AttendanceShiftTableColumns";

export const ShiftAllocationReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [shiftAllocationData, setShiftAllocationData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");

  // Chart colors
  const patternColors = ["#3B82F6", "#8B5CF6"];

  const fetchShiftAllocationData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getShiftAllocationReportData(payload);
      if (response) {
        setShiftAllocationData(response);
      }
    } catch (error) {
      console.error("Error fetching shift allocation data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchShiftAllocationData();
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
    totalEmployees:
      shiftAllocationData.aggregated_stats?.total_employees ||
      shiftAllocationData.count ||
      0,
    weekendWorkers: shiftAllocationData.aggregated_stats?.weekend_workers || 0,
    totalWeeklyAssignments:
      shiftAllocationData.aggregated_stats?.total_weekly_assignments || 0,
    avgWorkingDays: shiftAllocationData.aggregated_stats?.avg_working_days || 0,
    mondayToFriday:
      shiftAllocationData.aggregated_stats?.by_shift_pattern
        ?.monday_to_friday || 0,
    includesWeekends:
      shiftAllocationData.aggregated_stats?.by_shift_pattern
        ?.includes_weekends || 0,
  };

  // Shift pattern distribution chart data
  const shiftPatternChartData = React.useMemo(() => {
    if (!shiftAllocationData.aggregated_stats?.by_shift_pattern) return [];

    return [
      {
        pattern: "Monday to Friday",
        count: stats.mondayToFriday,
        percentage:
          stats.totalEmployees > 0
            ? Math.round((stats.mondayToFriday / stats.totalEmployees) * 100)
            : 0,
      },
      {
        pattern: "Includes Weekends",
        count: stats.includesWeekends,
        percentage:
          stats.totalEmployees > 0
            ? Math.round((stats.includesWeekends / stats.totalEmployees) * 100)
            : 0,
      },
    ].filter((item) => item.count > 0);
  }, [shiftAllocationData.aggregated_stats, stats]);

  // Work distribution analysis
  const workDistributionData = React.useMemo(() => {
    if (!shiftAllocationData.aggregated_stats) return [];

    return [
      {
        metric: "Total Employees",
        value: stats.totalEmployees,
      },
      {
        metric: "Weekend Workers",
        value: stats.weekendWorkers,
      },
      {
        metric: "Weekly Assignments",
        value: stats.totalWeeklyAssignments,
      },
      {
        metric: "Avg Working Days",
        value: parseFloat(stats.avgWorkingDays) || 0,
      },
    ];
  }, [shiftAllocationData.aggregated_stats, stats]);

  return (
    <div className="space-y-6">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          {
            title: "Total Employees",
            value: stats.totalEmployees.toLocaleString(),
            description: "With shift assignments",
            color: "text-plum-900",
          },
          {
            title: "Weekend Workers",
            value: stats.weekendWorkers.toLocaleString(),
            description: "Working weekends",
            color: "text-blue-600",
          },
          {
            title: "Total Assignments",
            value: stats.totalWeeklyAssignments.toLocaleString(),
            description: "Weekly assignments",
            color: "text-green-600",
          },
          {
            title: "Avg Working Days",
            value: stats.avgWorkingDays.toFixed(1),
            description: "Days per employee",
            color: "text-purple-600",
          },
          {
            title: "Mon-Fri Workers",
            value: stats.mondayToFriday.toLocaleString(),
            description: "Standard schedule",
            color: "text-indigo-600",
          },
          {
            title: "Weekend Coverage",
            value: `${
              stats.totalEmployees > 0
                ? Math.round(
                    (stats.weekendWorkers / stats.totalEmployees) * 100
                  )
                : 0
            }%`,
            description: "Weekend coverage ratio",
            color: "text-orange-600",
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Shift Pattern Distribution */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Shift Pattern Distribution
            </CardTitle>
            <CardDescription>
              Employee distribution by shift schedule pattern
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={shiftPatternChartData}
                  dataKey="count"
                  nameKey="pattern"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="none"
                >
                  {shiftPatternChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={patternColors[index % patternColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${value.toLocaleString()} employees (${
                      shiftPatternChartData.find((d) => d.pattern === name)
                        ?.percentage
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

        {/* Work Distribution Analysis */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Work Distribution Overview
            </CardTitle>
            <CardDescription>
              Overall shift allocation and coverage metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={workDistributionData}
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
                  fill="#3B82F6"
                  name="Count"
                  barSize={60}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Shift Allocation Table */}
      <Card>
        <CardHeader>
          <CardTitle>Shift Allocation Report</CardTitle>
          <CardDescription>
            View planned shift schedules by day, week, and month for effective
            workforce planning and resource allocation management.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={ShiftAllocationReportColumns()}
              data={shiftAllocationData.results}
              pagination={true}
              dataTotalSize={shiftAllocationData.count}
              tableOptions={tableOptions}
              fallbackText="No shift allocation data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
