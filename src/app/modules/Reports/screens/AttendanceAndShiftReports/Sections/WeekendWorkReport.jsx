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
// WEEKEND WORK REPORT COMPONENT
// ============================================================================
import { getWeekendWorkReportData } from "app/hooks/reports";
import { WeekendWorkReportColumns } from "../TableColumns/AttendanceShiftTableColumns";

export const WeekendWorkReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [weekendWorkData, setWeekendWorkData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");

  // Chart colors
  const hoursRangeColors = ["#10B981", "#F59E0B", "#EF4444"];

  const fetchWeekendWorkData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getWeekendWorkReportData(payload);
      if (response) {
        setWeekendWorkData(response);
      }
    } catch (error) {
      console.error("Error fetching weekend work data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchWeekendWorkData();
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
      weekendWorkData.aggregated_stats?.total_employees ||
      weekendWorkData.count ||
      0,
    weekendWorkers: weekendWorkData.aggregated_stats?.weekend_workers || 0,
    totalWeekendHours:
      weekendWorkData.aggregated_stats?.total_weekend_hours || 0,
    highWeekendHours:
      weekendWorkData.aggregated_stats?.by_hours_range?.high_16_plus || 0,
    moderateWeekendHours:
      weekendWorkData.aggregated_stats?.by_hours_range?.moderate_8_to_16 || 0,
    lowWeekendHours:
      weekendWorkData.aggregated_stats?.by_hours_range?.low_under_8 || 0,
  };

  // Weekend hours range distribution chart data
  const hoursRangeChartData = React.useMemo(() => {
    if (!weekendWorkData.aggregated_stats?.by_hours_range) return [];

    return [
      {
        range: "Low (Under 8h)",
        count: stats.lowWeekendHours,
        percentage:
          stats.weekendWorkers > 0
            ? Math.round((stats.lowWeekendHours / stats.weekendWorkers) * 100)
            : 0,
      },
      {
        range: "Moderate (8-16h)",
        count: stats.moderateWeekendHours,
        percentage:
          stats.weekendWorkers > 0
            ? Math.round(
                (stats.moderateWeekendHours / stats.weekendWorkers) * 100
              )
            : 0,
      },
      {
        range: "High (16h+)",
        count: stats.highWeekendHours,
        percentage:
          stats.weekendWorkers > 0
            ? Math.round((stats.highWeekendHours / stats.weekendWorkers) * 100)
            : 0,
      },
    ].filter((item) => item.count > 0);
  }, [weekendWorkData.aggregated_stats, stats]);

  // Weekend work impact analysis
  const weekendImpactData = React.useMemo(() => {
    if (!weekendWorkData.aggregated_stats) return [];

    const avgHoursPerWorker =
      stats.weekendWorkers > 0
        ? (stats.totalWeekendHours / stats.weekendWorkers).toFixed(1)
        : 0;

    const weekendCoverageRate =
      stats.totalEmployees > 0
        ? ((stats.weekendWorkers / stats.totalEmployees) * 100).toFixed(1)
        : 0;

    return [
      {
        metric: "Weekend Workers",
        value: stats.weekendWorkers,
      },
      {
        metric: "Total Weekend Hours",
        value: stats.totalWeekendHours,
      },
      {
        metric: "Avg Hours per Worker",
        value: parseFloat(avgHoursPerWorker),
      },
      {
        metric: "Coverage Rate (%)",
        value: parseFloat(weekendCoverageRate),
      },
    ];
  }, [weekendWorkData.aggregated_stats, stats]);

  return (
    <div className="space-y-6">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          {
            title: "Total Employees",
            value: stats.totalEmployees.toLocaleString(),
            description: "Tracked employees",
            color: "text-plum-900",
          },
          {
            title: "Weekend Workers",
            value: stats.weekendWorkers.toLocaleString(),
            description: "Worked weekends",
            color: "text-blue-600",
          },
          {
            title: "Weekend Hours",
            value: `${stats.totalWeekendHours.toLocaleString()}h`,
            description: "Total weekend work",
            color: "text-green-600",
          },
          {
            title: "High Hours (16+)",
            value: stats.highWeekendHours.toLocaleString(),
            description: "Excessive weekend work",
            color: "text-red-600",
          },
          {
            title: "Moderate (8-16h)",
            value: stats.moderateWeekendHours.toLocaleString(),
            description: "Regular weekend work",
            color: "text-yellow-600",
          },
          {
            title: "Coverage Rate",
            value: `${
              stats.totalEmployees > 0
                ? Math.round(
                    (stats.weekendWorkers / stats.totalEmployees) * 100
                  )
                : 0
            }%`,
            description: "Weekend coverage",
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weekend Hours Range Distribution */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Weekend Hours Distribution
            </CardTitle>
            <CardDescription>
              Distribution of employees by weekend hours worked
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={hoursRangeChartData}
                  dataKey="count"
                  nameKey="range"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="none"
                >
                  {hoursRangeChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={hoursRangeColors[index % hoursRangeColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${value.toLocaleString()} employees (${
                      hoursRangeChartData.find((d) => d.range === name)
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

        {/* Weekend Work Impact Analysis */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Weekend Work Impact
            </CardTitle>
            <CardDescription>
              Key metrics for weekend work management
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weekendImpactData}
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
                  name="Metric"
                  barSize={50}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Weekend Work Table */}
      <Card>
        <CardHeader>
          <CardTitle>Weekend Work Report</CardTitle>
          <CardDescription>
            Monitor employees working outside standard workweek for proper
            compensation and work-life balance management.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={WeekendWorkReportColumns()}
              data={weekendWorkData.results}
              pagination={true}
              dataTotalSize={weekendWorkData.count}
              tableOptions={tableOptions}
              fallbackText="No weekend work data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
