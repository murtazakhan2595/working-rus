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
  LineChart,
  Line,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { getYearlyAttendanceData } from "app/hooks/reports";
import { YearlyAttendanceColumns } from "../TableColumns/AttendanceShiftTableColumns";

const YearlyAttendanceReport = ({
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

  // Fetch yearly attendance data
  const fetchYearlyAttendanceData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getYearlyAttendanceData(payload);
      if (response) {
        setAttendanceData(response);
      }
    } catch (error) {
      console.error("Error fetching yearly attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchYearlyAttendanceData();
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
      attendanceData.aggregated_stats?.total_employees ||
      attendanceData.count ||
      0,
    totalWorkingDays: attendanceData.aggregated_stats?.total_working_days || 0,
    totalPresentDays: attendanceData.aggregated_stats?.total_present_days || 0,
    totalRemoteDays: attendanceData.aggregated_stats?.total_remote_days || 0,
    overallAttendancePercentage:
      attendanceData.aggregated_stats?.overall_attendance_percentage || 0,
    excellentPerformers:
      attendanceData.aggregated_stats?.by_attendance_range?.excellent_95_plus ||
      0,
    goodPerformers:
      attendanceData.aggregated_stats?.by_attendance_range?.good_85_to_94 || 0,
    needsImprovement:
      attendanceData.aggregated_stats?.by_attendance_range
        ?.needs_improvement_below_85 || 0,
  };

  // Performance distribution chart data from aggregated stats
  const performanceChartData = React.useMemo(() => {
    if (!attendanceData.aggregated_stats?.by_attendance_range) return [];

    return [
      {
        range: "Excellent (95%+)",
        count: stats.excellentPerformers,
        percentage:
          stats.totalEmployees > 0
            ? Math.round(
                (stats.excellentPerformers / stats.totalEmployees) * 100
              )
            : 0,
      },
      {
        range: "Good (85-94%)",
        count: stats.goodPerformers,
        percentage:
          stats.totalEmployees > 0
            ? Math.round((stats.goodPerformers / stats.totalEmployees) * 100)
            : 0,
      },
      {
        range: "Needs Improvement (<85%)",
        count: stats.needsImprovement,
        percentage:
          stats.totalEmployees > 0
            ? Math.round((stats.needsImprovement / stats.totalEmployees) * 100)
            : 0,
      },
    ].filter((item) => item.count > 0);
  }, [attendanceData.aggregated_stats, stats]);

  // Yearly overview metrics
  const yearlyOverviewData = React.useMemo(() => {
    if (!attendanceData.aggregated_stats) return [];

    return [
      {
        metric: "Working Days",
        value: stats.totalWorkingDays,
        color: "#3B82F6",
      },
      {
        metric: "Present Days",
        value: stats.totalPresentDays,
        color: "#10B981",
      },
      {
        metric: "Remote Days",
        value: stats.totalRemoteDays,
        color: "#8B5CF6",
      },
      {
        metric: "Excellent Performers",
        value: stats.excellentPerformers,
        color: "#F59E0B",
      },
    ];
  }, [attendanceData.aggregated_stats, stats]);

  // Overall attendance gauge data
  const gaugeData = [
    {
      name: "Attendance",
      value: stats.overallAttendancePercentage,
      fill:
        stats.overallAttendancePercentage >= 95
          ? "#10B981"
          : stats.overallAttendancePercentage >= 85
          ? "#F59E0B"
          : "#EF4444",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          {
            title: "Total Employees",
            value: stats.totalEmployees.toLocaleString(),
            description: "Tracked annually",
            color: "text-plum-900",
          },
          {
            title: "Working Days",
            value: stats.totalWorkingDays.toLocaleString(),
            description: "Total across all employees",
            color: "text-neutral-800",
          },
          {
            title: "Present Days",
            value: stats.totalPresentDays.toLocaleString(),
            description: "Successfully attended",
            color: "text-green-600",
          },
          {
            title: "Remote Days",
            value: stats.totalRemoteDays.toLocaleString(),
            description: "Work from home",
            color: "text-blue-600",
          },
          {
            title: "Overall Rate",
            value: `${stats.overallAttendancePercentage.toFixed(1)}%`,
            description: "Annual attendance",
            color: "text-purple-600",
          },
          {
            title: "Top Performers",
            value: stats.excellentPerformers.toLocaleString(),
            description: "95%+ attendance",
            color: "text-green-700",
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
        {/* Performance Distribution */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Performance Distribution
            </CardTitle>
            <CardDescription>
              Employee attendance performance categories
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={performanceChartData}
                  dataKey="count"
                  nameKey="range"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="none"
                >
                  {performanceChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={performanceColors[index % performanceColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${value.toLocaleString()} employees (${
                      performanceChartData.find((d) => d.range === name)
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

        {/* Overall Attendance Gauge */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Overall Attendance Rate
            </CardTitle>
            <CardDescription>
              Organization-wide annual attendance performance
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="90%"
                data={gaugeData}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  dataKey="value"
                  cornerRadius={10}
                  fill={gaugeData[0]?.fill}
                />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-3xl font-bold fill-current"
                  fill={gaugeData[0]?.fill}
                >
                  {stats.overallAttendancePercentage.toFixed(1)}%
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

        {/* Yearly Overview Metrics */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Yearly Overview Metrics
            </CardTitle>
            <CardDescription>
              Key annual attendance and performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={yearlyOverviewData}
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
                  formatter={(value) => [value.toLocaleString(), "Count"]}
                />
                <Bar
                  dataKey="value"
                  name="Value"
                  barSize={30}
                  radius={[4, 4, 0, 0]}
                  fill={(entry) => entry.color || "#3B82F6"}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Yearly Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Yearly Attendance Report</CardTitle>
          <CardDescription>
            Annual attendance overview showing working days, present days,
            absents, leave days, remote work days, and overall attendance
            percentage for performance analysis and strategic workforce
            planning.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={YearlyAttendanceColumns()}
              data={attendanceData.results}
              pagination={true}
              dataTotalSize={attendanceData.count}
              tableOptions={tableOptions}
              fallbackText="No yearly attendance data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default YearlyAttendanceReport;
