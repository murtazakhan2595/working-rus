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
  AreaChart,
  Area,
} from "recharts";
import { getLateArrivalReportData } from "app/hooks/reports";
import { LateArrivalReportColumns } from "../TableColumns/AttendanceShiftTableColumns";

const LateArrivalReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [lateArrivalData, setLateArrivalData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");

  // Chart colors
  const frequencyColors = ["#10B981", "#F59E0B", "#EF4444"];

  // Fetch late arrival data
  const fetchLateArrivalData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getLateArrivalReportData(payload);
      if (response) {
        setLateArrivalData(response);
      }
    } catch (error) {
      console.error("Error fetching late arrival data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchLateArrivalData();
    }
  }, [filterData, permittedViewFilterData, options, ordering]);

  // Handle page changes
  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  // Table options
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
      lateArrivalData.aggregated_stats?.total_employees ||
      lateArrivalData.count ||
      0,
    totalLateIncidents:
      lateArrivalData.aggregated_stats?.total_late_incidents || 0,
    totalLateHours: lateArrivalData.aggregated_stats?.total_late_hours || 0,
    frequentOffenders:
      lateArrivalData.aggregated_stats?.by_frequency?.frequent_10_plus || 0,
    moderateIssues:
      lateArrivalData.aggregated_stats?.by_frequency?.moderate_5_to_10 || 0,
    occasionalLates:
      lateArrivalData.aggregated_stats?.by_frequency?.occasional_under_5 || 0,
  };

  // Frequency distribution chart data
  const frequencyChartData = React.useMemo(() => {
    if (!lateArrivalData.aggregated_stats?.by_frequency) return [];

    return [
      {
        range: "Occasional (Under 5)",
        count: stats.occasionalLates,
        percentage:
          stats.totalEmployees > 0
            ? Math.round((stats.occasionalLates / stats.totalEmployees) * 100)
            : 0,
      },
      {
        range: "Moderate (5-10)",
        count: stats.moderateIssues,
        percentage:
          stats.totalEmployees > 0
            ? Math.round((stats.moderateIssues / stats.totalEmployees) * 100)
            : 0,
      },
      {
        range: "Frequent (10+)",
        count: stats.frequentOffenders,
        percentage:
          stats.totalEmployees > 0
            ? Math.round((stats.frequentOffenders / stats.totalEmployees) * 100)
            : 0,
      },
    ].filter((item) => item.count > 0);
  }, [lateArrivalData.aggregated_stats, stats]);

  // Impact analysis data
  const impactAnalysisData = React.useMemo(() => {
    if (!lateArrivalData.aggregated_stats) return [];

    const avgLateHoursPerEmployee =
      stats.totalEmployees > 0
        ? (stats.totalLateHours / stats.totalEmployees).toFixed(1)
        : 0;

    const avgLateIncidentsPerEmployee =
      stats.totalEmployees > 0
        ? (stats.totalLateIncidents / stats.totalEmployees).toFixed(1)
        : 0;

    return [
      {
        metric: "Total Late Incidents",
        value: stats.totalLateIncidents,
      },
      {
        metric: "Total Late Hours",
        value: stats.totalLateHours,
      },
      {
        metric: "Avg Hours per Employee",
        value: parseFloat(avgLateHoursPerEmployee),
      },
      {
        metric: "Avg Incidents per Employee",
        value: parseFloat(avgLateIncidentsPerEmployee),
      },
    ];
  }, [lateArrivalData.aggregated_stats, stats]);

  // Trend analysis data
  const trendAnalysisData = React.useMemo(() => {
    if (!lateArrivalData.aggregated_stats) return [];

    const punctualityRate =
      stats.totalEmployees > 0 && stats.totalLateIncidents > 0
        ? Math.max(
            0,
            100 - (stats.totalLateIncidents / stats.totalEmployees) * 10
          )
        : 100;

    return [
      {
        category: "Punctuality Rate",
        percentage: punctualityRate.toFixed(1),
        target: 95, // Assumed target
      },
    ];
  }, [lateArrivalData.aggregated_stats, stats]);

  return (
    <div className="space-y-6">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          {
            title: "Total Employees",
            value: stats.totalEmployees.toLocaleString(),
            description: "Employees tracked",
            color: "text-plum-900",
          },
          {
            title: "Total Late Incidents",
            value: stats.totalLateIncidents.toLocaleString(),
            description: "Sum of late arrivals",
            color: "text-yellow-600",
          },
          {
            title: "Total Late Hours",
            value: `${stats.totalLateHours.toLocaleString()}h`,
            description: "Sum of late hours",
            color: "text-orange-600",
          },
          {
            title: "Frequent (10+)",
            value: stats.frequentOffenders.toLocaleString(),
            description: "Critical attention needed",
            color: "text-red-600",
          },
          {
            title: "Moderate (5-10)",
            value: stats.moderateIssues.toLocaleString(),
            description: "Needs improvement",
            color: "text-yellow-700",
          },
          {
            title: "Occasional (Under 5)",
            value: stats.occasionalLates.toLocaleString(),
            description: "Acceptable range",
            color: "text-green-600",
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
        {/* Frequency Distribution */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Late Arrival Frequency
            </CardTitle>
            <CardDescription>
              Employee distribution by late arrival frequency
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={frequencyChartData}
                  dataKey="count"
                  nameKey="range"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="none"
                >
                  {frequencyChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={frequencyColors[index % frequencyColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${value.toLocaleString()} employees (${
                      frequencyChartData.find((d) => d.range === name)
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

        {/* Impact Analysis */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Late Arrival Impact
            </CardTitle>
            <CardDescription>
              Overall impact of late arrivals on productivity
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={impactAnalysisData}
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
                  fill="#F59E0B"
                  name="Impact"
                  barSize={40}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Punctuality Trend */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Overall Punctuality
            </CardTitle>
            <CardDescription>Punctuality performance vs target</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trendAnalysisData}
                margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  contentStyle={{ fontSize: "12px" }}
                  formatter={(value) => [`${value}%`, "Rate"]}
                />
                <Area
                  type="monotone"
                  dataKey="percentage"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.3}
                  strokeWidth={3}
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  stroke="#3B82F6"
                  fill="transparent"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Late Arrival Table */}
      <Card>
        <CardHeader>
          <CardTitle>Late Arrival Report</CardTitle>
          <CardDescription>
            Track late arrivals by employee to identify recurring offenders and
            patterns for improving punctuality and workforce discipline.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={LateArrivalReportColumns()}
              data={lateArrivalData.results}
              pagination={true}
              dataTotalSize={lateArrivalData.count}
              tableOptions={tableOptions}
              fallbackText="No late arrival data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LateArrivalReport;
