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
  const departmentColors = [
    "#3B82F6",
    "#8B5CF6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
  ];

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

  // Calculate stats from aggregated data
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

  // Performance distribution chart data
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

  // Department-wise attendance analysis (from current page data)
  const departmentChartData = React.useMemo(() => {
    if (!attendanceData.results?.length) return [];

    const deptData = {};

    attendanceData.results.forEach((emp) => {
      const dept = emp.Department || "Unknown";
      const workingDays = parseInt(emp.WorkingDays) || 0;
      const presentDays = parseInt(emp.PresentDays) || 0;
      const attendanceRate =
        workingDays > 0 ? Math.round((presentDays / workingDays) * 100) : 0;

      if (!deptData[dept]) {
        deptData[dept] = {
          department: dept.length > 15 ? dept.substring(0, 15) + "..." : dept,
          fullName: dept,
          totalWorkingDays: 0,
          totalPresentDays: 0,
          employeeCount: 0,
          avgAttendance: 0,
        };
      }

      deptData[dept].totalWorkingDays += workingDays;
      deptData[dept].totalPresentDays += presentDays;
      deptData[dept].employeeCount += 1;
    });

    // Calculate average attendance for each department
    return Object.values(deptData)
      .map((dept) => ({
        ...dept,
        avgAttendance:
          dept.totalWorkingDays > 0
            ? Math.round((dept.totalPresentDays / dept.totalWorkingDays) * 100)
            : 0,
      }))
      .sort((a, b) => b.avgAttendance - a.avgAttendance)
      .slice(0, 8); // Top 8 departments
  }, [attendanceData.results]);

  // Year-over-year trend analysis using actual data
  const trendChartData = React.useMemo(() => {
    if (!attendanceData.results?.length) return [];

    // Group by year and calculate average attendance for trend
    const yearData = {};

    attendanceData.results.forEach((emp) => {
      const year = emp.Year || new Date().getFullYear();
      const attendanceRate = parseFloat(
        emp.AttendancePercentage?.replace("%", "") || 0
      );

      if (!yearData[year]) {
        yearData[year] = { totalRate: 0, count: 0 };
      }

      yearData[year].totalRate += attendanceRate;
      yearData[year].count += 1;
    });

    return Object.entries(yearData)
      .map(([year, data]) => ({
        year: year.toString(),
        attendance:
          data.count > 0 ? Math.round(data.totalRate / data.count) : 0,
      }))
      .sort((a, b) => a.year - b.year);
  }, [attendanceData.results]);

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

        {/* Department Performance */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Top Performing Departments
            </CardTitle>
            <CardDescription>
              Average attendance by department (current page)
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={departmentChartData}
                margin={{ top: 20, right: 20, left: 0, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="department"
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  contentStyle={{ fontSize: "12px" }}
                  formatter={(value) => [`${value}%`, "Attendance Rate"]}
                  labelFormatter={(label) =>
                    departmentChartData.find((d) => d.department === label)
                      ?.fullName || label
                  }
                />
                <Bar
                  dataKey="avgAttendance"
                  fill="#3B82F6"
                  name="Attendance %"
                  barSize={30}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Year-over-Year Trend */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Year-over-Year Attendance Trend
            </CardTitle>
            <CardDescription>
              Average attendance percentage by year
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={trendChartData}
                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  contentStyle={{ fontSize: "12px" }}
                  formatter={(value) => [`${value}%`, "Attendance"]}
                />
                <Line
                  type="monotone"
                  dataKey="attendance"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#10B981", strokeWidth: 2 }}
                />
              </LineChart>
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
