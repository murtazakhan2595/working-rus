// ============================================================================
// IDLE/UNDERTIME REPORT COMPONENT
// ============================================================================
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
import { getIdleUndertimeReportData } from "app/hooks/reports";
import { IdleUndertimeReportColumns } from "../TableColumns/AttendanceShiftTableColumns";

export const IdleUndertimeReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [idleUndertimeData, setIdleUndertimeData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");

  // Chart colors
  const shortfallColors = ["#10B981", "#F59E0B", "#EF4444"];

  const fetchIdleUndertimeData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getIdleUndertimeReportData(payload);
      if (response) {
        setIdleUndertimeData(response);
      }
    } catch (error) {
      console.error("Error fetching idle undertime data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchIdleUndertimeData();
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
    totalEmployees: idleUndertimeData.aggregated_stats?.total_employees || idleUndertimeData.count || 0,
    totalExpectedHours: idleUndertimeData.aggregated_stats?.total_expected_hours || 0,
    totalWorkedHours: idleUndertimeData.aggregated_stats?.total_worked_hours || 0,
    totalShortfallHours: idleUndertimeData.aggregated_stats?.total_shortfall_hours || 0,
    highShortfall: idleUndertimeData.aggregated_stats?.by_shortfall_level?.high_40_plus || 0,
    moderateShortfall: idleUndertimeData.aggregated_stats?.by_shortfall_level?.moderate_20_to_40 || 0,
    lowShortfall: idleUndertimeData.aggregated_stats?.by_shortfall_level?.low_under_20 || 0,
  };

  // Shortfall level distribution chart data
  const shortfallChartData = React.useMemo(() => {
    if (!idleUndertimeData.aggregated_stats?.by_shortfall_level) return [];

    return [
      {
        level: "Low Shortfall (Under 20h)",
        count: stats.lowShortfall,
        percentage: stats.totalEmployees > 0 ? Math.round((stats.lowShortfall / stats.totalEmployees) * 100) : 0,
      },
      {
        level: "Moderate Shortfall (20-40h)",
        count: stats.moderateShortfall,
        percentage: stats.totalEmployees > 0 ? Math.round((stats.moderateShortfall / stats.totalEmployees) * 100) : 0,
      },
      {
        level: "High Shortfall (40h+)",
        count: stats.highShortfall,
        percentage: stats.totalEmployees > 0 ? Math.round((stats.highShortfall / stats.totalEmployees) * 100) : 0,
      },
    ].filter(item => item.count > 0);
  }, [idleUndertimeData.aggregated_stats, stats]);

  // Productivity overview data
  const productivityData = React.useMemo(() => {
    if (!idleUndertimeData.aggregated_stats) return [];

    const utilizationRate = stats.totalExpectedHours > 0 ? 
      Math.round((stats.totalWorkedHours / stats.totalExpectedHours) * 100) : 0;

    return [
      {
        metric: "Expected Hours",
        value: stats.totalExpectedHours,
        color: "#3B82F6",
      },
      {
        metric: "Worked Hours",
        value: stats.totalWorkedHours,
        color: "#10B981",
      },
      {
        metric: "Shortfall Hours",
        value: stats.totalShortfallHours,
        color: "#EF4444",
      },
    ];
  }, [idleUndertimeData.aggregated_stats, stats]);

  // Efficiency trend visualization
  const efficiencyTrendData = React.useMemo(() => {
    if (!idleUndertimeData.aggregated_stats) return [];

    const utilizationRate = stats.totalExpectedHours > 0 ? 
      ((stats.totalWorkedHours / stats.totalExpectedHours) * 100).toFixed(1) : 0;

    return [
      {
        category: "Overall Utilization",
        percentage: parseFloat(utilizationRate),
        target: 85, // Assumed target
      },
    ];
  }, [idleUndertimeData.aggregated_stats, stats]);

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
            title: "Expected Hours",
            value: `${stats.totalExpectedHours.toLocaleString()}h`,
            description: "Total expected",
            color: "text-neutral-800",
          },
          {
            title: "Worked Hours",
            value: `${stats.totalWorkedHours.toLocaleString()}h`,
            description: "Total worked",
            color: "text-blue-600",
          },
          {
            title: "Total Shortfall",
            value: `${stats.totalShortfallHours.toLocaleString()}h`,
            description: "Hours deficit",
            color: "text-red-600",
          },
          {
            title: "High Shortfall (40h+)",
            value: stats.highShortfall.toLocaleString(),
            description: "Critical cases",
            color: "text-red-700",
          },
          {
            title: "Utilization Rate",
            value: `${stats.totalExpectedHours > 0 ? 
              ((stats.totalWorkedHours / stats.totalExpectedHours) * 100).toFixed(1) : 0}%`,
            description: "Overall efficiency",
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
        {/* Shortfall Level Distribution */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Shortfall Level Distribution
            </CardTitle>
            <CardDescription>
              Employee distribution by shortfall severity
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={shortfallChartData}
                  dataKey="count"
                  nameKey="level"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="none"
                >
                  {shortfallChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={shortfallColors[index % shortfallColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${value.toLocaleString()} employees (${
                      shortfallChartData.find((d) => d.level === name)?.percentage
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

        {/* Productivity Overview */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Productivity Overview
            </CardTitle>
            <CardDescription>
              Comparison of expected vs worked hours
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={productivityData}
                margin={{ top: 20, right: 20, left: 0, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="metric"
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ fontSize: "12px" }}
                  formatter={(value) => [`${value.toLocaleString()}h`, "Hours"]}
                />
                <Bar
                  dataKey="value"
                  name="Hours"
                  barSize={50}
                  radius={[4, 4, 0, 0]}
                  fill={(entry) => entry.color || "#3B82F6"}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Efficiency Gauge */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Overall Efficiency
            </CardTitle>
            <CardDescription>
              Worked hours vs expected hours ratio
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={efficiencyTrendData}
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
                  formatter={(value) => [`${value}%`, "Utilization"]}
                />
                <Area
                  type="monotone"
                  dataKey="percentage"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.3}
                  strokeWidth={3}
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  stroke="#10B981"
                  fill="transparent"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Idle/Undertime Table */}
      <Card>
        <CardHeader>
          <CardTitle>Idle/Undertime Report</CardTitle>
          <CardDescription>
            Track employees working less than scheduled hours to identify
            productivity issues and optimize workforce utilization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={IdleUndertimeReportColumns()}
              data={idleUndertimeData.results}
              pagination={true}
              dataTotalSize={idleUndertimeData.count}
              tableOptions={tableOptions}
              fallbackText="No idle/undertime data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};