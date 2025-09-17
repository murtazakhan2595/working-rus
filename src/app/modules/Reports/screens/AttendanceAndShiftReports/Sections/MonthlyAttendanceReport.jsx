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

  // Calculate comprehensive stats from aggregated data
  const stats = React.useMemo(() => {
    const aggregated = attendanceData.aggregated_stats;

    return {
      totalEmployees: aggregated?.total_employees || attendanceData.count || 0,
      totalPresents: aggregated?.total_presents || 0,
      totalAbsents: aggregated?.total_absents || 0,
      totalLates: aggregated?.total_lates || 0,
      totalOvertimeHours: aggregated?.total_overtime_hours || 0,
      avgAttendancePercentage: aggregated?.avg_attendance_percentage || 0,
    };
  }, [attendanceData.aggregated_stats, attendanceData.count]);

  // Performance distribution data
  const performanceChartData = React.useMemo(() => {
    if (!attendanceData.results?.length) return [];

    const currentPageData = attendanceData.results;
    let excellent = 0,
      good = 0,
      needsImprovement = 0;

    currentPageData.forEach((emp) => {
      const totalDays = parseInt(emp.TotalDays) || 0;
      const presents = parseInt(emp.Presents) || 0;
      const percentage = totalDays > 0 ? (presents / totalDays) * 100 : 0;

      if (percentage >= 95) excellent++;
      else if (percentage >= 85) good++;
      else needsImprovement++;
    });

    return [
      {
        name: "Excellent (95%+)",
        count: excellent,
        percentage: Math.round((excellent / currentPageData.length) * 100),
      },
      {
        name: "Good (85-94%)",
        count: good,
        percentage: Math.round((good / currentPageData.length) * 100),
      },
      {
        name: "Needs Improvement (<85%)",
        count: needsImprovement,
        percentage: Math.round(
          (needsImprovement / currentPageData.length) * 100
        ),
      },
    ].filter((item) => item.count > 0);
  }, [attendanceData.results]);

  // Department-wise performance (from current page data for demo)
  const departmentChartData = React.useMemo(() => {
    if (!attendanceData.results?.length) return [];

    const deptData = {};

    attendanceData.results.forEach((emp) => {
      const dept = emp.Dept || "Unknown";
      const presents = parseInt(emp.Presents) || 0;
      const absents = parseInt(emp.Absents) || 0;
      const lates = parseInt(emp.Lates) || 0;

      if (!deptData[dept]) {
        deptData[dept] = {
          department: dept,
          presents: 0,
          absents: 0,
          lates: 0,
        };
      }

      deptData[dept].presents += presents;
      deptData[dept].absents += absents;
      deptData[dept].lates += lates;
    });

    return Object.values(deptData)
      .sort((a, b) => b.presents - a.presents)
      .slice(0, 8); // Top 8 departments
  }, [attendanceData.results]);

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Performance Distribution */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Employee Performance Distribution
            </CardTitle>
            <CardDescription>
              Attendance performance categories (current page view)
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={performanceChartData}
                  dataKey="count"
                  nameKey="name"
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
                    `${value} employees (${
                      performanceChartData.find((d) => d.name === name)
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

        {/* Department-wise Performance */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Top Departments by Attendance
            </CardTitle>
            <CardDescription>
              Present days by department (current page view)
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
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ fontSize: "12px" }}
                  formatter={(value, name) => [`${value} days`, name]}
                />
                <Legend />
                <Bar
                  dataKey="presents"
                  fill="#10B981"
                  name="Present"
                  barSize={20}
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="lates"
                  fill="#F59E0B"
                  name="Late"
                  barSize={20}
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="absents"
                  fill="#EF4444"
                  name="Absent"
                  barSize={20}
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
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
