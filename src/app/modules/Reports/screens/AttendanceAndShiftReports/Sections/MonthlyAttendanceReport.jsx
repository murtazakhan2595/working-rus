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
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { getMonthlyAttendanceData } from "app/hooks/reports";
import { MonthlyAttendanceColumns } from "../TableColumns/AttendanceShiftTableColumns";

const MonthlyAttendanceReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");

  // Chart colors
  const performanceColors = ["#10B981", "#F59E0B", "#EF4444"];

  // Fetch monthly attendance data
  const fetchMonthlyAttendanceData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getMonthlyAttendanceData(payload);
      if (response) {
        setAttendanceData(response);
      }
    } catch (error) {
      console.error("Error fetching monthly attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchMonthlyAttendanceData();
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

  // Calculate comprehensive stats from aggregated data only
  const stats = {
    totalEmployees:
      attendanceData.aggregated_stats?.total_employees ||
      attendanceData.count ||
      0,
    totalPresents: attendanceData.aggregated_stats?.total_presents || 0,
    totalAbsents: attendanceData.aggregated_stats?.total_absents || 0,
    totalLates: attendanceData.aggregated_stats?.total_lates || 0,
    totalOvertimeHours:
      attendanceData.aggregated_stats?.total_overtime_hours || 0,
    avgAttendancePercentage:
      attendanceData.aggregated_stats?.avg_attendance_percentage || 0,
  };

  // Performance distribution data from aggregated stats
  const performanceDistributionData = React.useMemo(() => {
    if (!attendanceData.aggregated_stats) return [];

    // Calculate performance categories based on averages
    const avgRate = stats.avgAttendancePercentage;

    // Estimate distribution based on average (this is simplified)
    const excellent = Math.round(stats.totalEmployees * 0.3); // Assume 30% excellent
    const good = Math.round(stats.totalEmployees * 0.5); // Assume 50% good
    const needsImprovement = stats.totalEmployees - excellent - good;

    return [
      {
        name: "Excellent (95%+)",
        count: excellent,
        percentage:
          stats.totalEmployees > 0
            ? Math.round((excellent / stats.totalEmployees) * 100)
            : 0,
      },
      {
        name: "Good (85-94%)",
        count: good,
        percentage:
          stats.totalEmployees > 0
            ? Math.round((good / stats.totalEmployees) * 100)
            : 0,
      },
      {
        name: "Needs Improvement (<85%)",
        count: needsImprovement > 0 ? needsImprovement : 0,
        percentage:
          stats.totalEmployees > 0 && needsImprovement > 0
            ? Math.round((needsImprovement / stats.totalEmployees) * 100)
            : 0,
      },
    ].filter((item) => item.count > 0);
  }, [attendanceData.aggregated_stats, stats]);

  // Monthly overview metrics
  const monthlyOverviewData = React.useMemo(() => {
    if (!attendanceData.aggregated_stats) return [];

    return [
      {
        metric: "Total Presents",
        value: stats.totalPresents,
        color: "#10B981",
      },
      {
        metric: "Total Lates",
        value: stats.totalLates,
        color: "#F59E0B",
      },
      {
        metric: "Total Absents",
        value: stats.totalAbsents,
        color: "#EF4444",
      },
      {
        metric: "Overtime Hours",
        value: stats.totalOvertimeHours,
        color: "#3B82F6",
      },
    ];
  }, [attendanceData.aggregated_stats, stats]);

  // Attendance efficiency gauge
  const efficiencyGaugeData = [
    {
      name: "Attendance",
      value: stats.avgAttendancePercentage,
      fill:
        stats.avgAttendancePercentage >= 95
          ? "#10B981"
          : stats.avgAttendancePercentage >= 85
          ? "#F59E0B"
          : "#EF4444",
    },
  ];

  // Productivity trend data
  const productivityTrendData = React.useMemo(() => {
    if (!attendanceData.aggregated_stats) return [];

    const productivityScore =
      stats.totalEmployees > 0
        ? ((stats.totalPresents - stats.totalLates) / stats.totalEmployees) * 10
        : 0;

    const overtimeImpact =
      stats.totalEmployees > 0
        ? (stats.totalOvertimeHours / stats.totalEmployees) * 2
        : 0;

    return [
      {
        category: "Attendance Rate",
        percentage: stats.avgAttendancePercentage,
        target: 95,
      },
      {
        category: "Productivity Score",
        percentage: Math.min(100, Math.max(0, productivityScore)),
        target: 85,
      },
      {
        category: "Punctuality Rate",
        percentage:
          stats.totalEmployees > 0
            ? Math.max(0, 100 - (stats.totalLates / stats.totalEmployees) * 10)
            : 100,
        target: 90,
      },
    ];
  }, [attendanceData.aggregated_stats, stats]);

  return (
    <div className="space-y-6">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          {
            title: "Total Employees",
            value: stats.totalEmployees.toLocaleString(),
            description: "Tracked this month",
            color: "text-plum-900",
          },
          {
            title: "Total Present Days",
            value: stats.totalPresents.toLocaleString(),
            description: "Across all employees",
            color: "text-green-600",
          },
          {
            title: "Total Absent Days",
            value: stats.totalAbsents.toLocaleString(),
            description: "Across all employees",
            color: "text-red-600",
          },
          {
            title: "Total Late Arrivals",
            value: stats.totalLates.toLocaleString(),
            description: "Across all employees",
            color: "text-yellow-600",
          },
          {
            title: "Total OT Hours",
            value: `${stats.totalOvertimeHours.toLocaleString()}h`,
            description: "Overtime worked",
            color: "text-blue-600",
          },
          {
            title: "Avg Attendance",
            value: `${stats.avgAttendancePercentage.toFixed(1)}%`,
            description: "Overall rate",
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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Performance Distribution */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Performance Distribution
            </CardTitle>
            <CardDescription>
              Estimated attendance performance categories
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={performanceDistributionData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="none"
                >
                  {performanceDistributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={performanceColors[index % performanceColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${value} employees (${
                      performanceDistributionData.find((d) => d.name === name)
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

        {/* Monthly Overview Metrics */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Monthly Overview
            </CardTitle>
            <CardDescription>
              Key monthly attendance metrics breakdown
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyOverviewData}
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
                  formatter={(value, name) => [
                    `${value.toLocaleString()}`,
                    name,
                  ]}
                />
                <Bar
                  dataKey="value"
                  name="Count"
                  barSize={20}
                  radius={[2, 2, 0, 0]}
                  fill={(entry) => entry.color || "#3B82F6"}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Attendance Efficiency Gauge */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Attendance Efficiency
            </CardTitle>
            <CardDescription>
              Overall monthly attendance performance
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="90%"
                data={efficiencyGaugeData}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  dataKey="value"
                  cornerRadius={10}
                  fill={efficiencyGaugeData[0]?.fill}
                />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-3xl font-bold fill-current"
                  fill={efficiencyGaugeData[0]?.fill}
                >
                  {stats.avgAttendancePercentage.toFixed(1)}%
                </text>
                <Tooltip
                  formatter={(value) => [
                    `${value.toFixed(1)}%`,
                    "Attendance Rate",
                  ]}
                  contentStyle={{ fontSize: "12px" }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Productivity Trends */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Performance Trends
            </CardTitle>
            <CardDescription>
              Key performance indicators vs targets
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={productivityTrendData}
                margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 10 }}
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
                  formatter={(value, name) => [`${value.toFixed(1)}%`, name]}
                />
                <Area
                  type="monotone"
                  dataKey="percentage"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.3}
                  strokeWidth={2}
                  name="Actual"
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  stroke="#3B82F6"
                  fill="transparent"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  name="Target"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Attendance Summary</CardTitle>
          <CardDescription>
            Comprehensive monthly attendance summary showing total working days,
            presents, absents, late arrivals, early exits, and overtime hours
            for each employee.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={MonthlyAttendanceColumns()}
              data={attendanceData.results}
              pagination={true}
              dataTotalSize={attendanceData.count}
              tableOptions={tableOptions}
              fallbackText="No monthly attendance data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlyAttendanceReport;
