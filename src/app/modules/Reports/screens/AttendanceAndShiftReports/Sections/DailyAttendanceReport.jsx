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
} from "recharts";
import { getDailyAttendanceData } from "app/hooks/reports";
import { DailyAttendanceColumns } from "../TableColumns/AttendanceShiftTableColumns";

const DailyAttendanceReport = ({
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
  const statusColors = ["#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#8B5CF6"];
  const shiftColors = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444"];

  // Fetch daily attendance data
  const fetchDailyAttendanceData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getDailyAttendanceData(payload);
      if (response) {
        setAttendanceData(response);
      }
    } catch (error) {
      console.error("Error fetching daily attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchDailyAttendanceData();
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

  // Prepare chart data from aggregated stats
  const statusChartData = React.useMemo(() => {
    if (!attendanceData.aggregated_stats?.by_status) return [];

    return Object.entries(attendanceData.aggregated_stats.by_status)
      .map(([status, count]) => ({
        status,
        count,
        percentage:
          attendanceData.aggregated_stats.total_records > 0
            ? Math.round(
                (count / attendanceData.aggregated_stats.total_records) * 100
              )
            : 0,
      }))
      .filter((item) => item.count > 0);
  }, [attendanceData.aggregated_stats]);

  // Shift distribution chart data
  const shiftChartData = React.useMemo(() => {
    if (!attendanceData.aggregated_stats?.by_shift) return [];

    return Object.entries(attendanceData.aggregated_stats.by_shift)
      .map(([shift, count]) => ({
        shift: shift === "null" ? "Unassigned" : shift,
        count,
      }))
      .filter((item) => item.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 8); // Top 8 shifts
  }, [attendanceData.aggregated_stats]);

  // Calculate stats from aggregated data
  const stats = {
    totalRecords:
      attendanceData.aggregated_stats?.total_records ||
      attendanceData.count ||
      0,
    presentCount: attendanceData.aggregated_stats?.by_status?.Present || 0,
    lateCount: attendanceData.aggregated_stats?.by_status?.Late || 0,
    absentCount: attendanceData.aggregated_stats?.by_status?.Absent || 0,
    attendanceRate:
      attendanceData.aggregated_stats?.total_records > 0
        ? Math.round(
            ((attendanceData.aggregated_stats?.by_status?.Present || 0) /
              attendanceData.aggregated_stats.total_records) *
              100
          )
        : 0,
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            title: "Total Records",
            value: stats.totalRecords.toLocaleString(),
            description: "All attendance records",
            color: "text-plum-900",
          },
          {
            title: "Present",
            value: stats.presentCount.toLocaleString(),
            description: "Employees present",
            color: "text-green-600",
          },
          {
            title: "Late Arrivals",
            value: stats.lateCount.toLocaleString(),
            description: "Late employees",
            color: "text-yellow-600",
          },
          {
            title: "Absent",
            value: stats.absentCount.toLocaleString(),
            description: "Absent employees",
            color: "text-red-600",
          },
          {
            title: "Attendance Rate",
            value: `${stats.attendanceRate}%`,
            description: "Overall presence rate",
            color: "text-blue-600",
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
        {/* Attendance Status Distribution */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Attendance Status Distribution
            </CardTitle>
            <CardDescription>
              Current attendance status breakdown across all employees
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
                    `${value.toLocaleString()} employees (${
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

        {/* Shift-wise Distribution */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Shift-wise Attendance
            </CardTitle>
            <CardDescription>
              Employee distribution across different shifts
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={shiftChartData}
                margin={{ top: 20, right: 20, left: 0, bottom: 60 }}
              >
                <XAxis
                  dataKey="shift"
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ fontSize: "12px" }}
                  formatter={(value) => [
                    `${value.toLocaleString()} employees`,
                    "Count",
                  ]}
                />
                <Bar
                  dataKey="count"
                  fill="#3B82F6"
                  name="Employees"
                  barSize={40}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Daily Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Attendance Report</CardTitle>
          <CardDescription>
            Detailed daily attendance records showing employee
            check-in/check-out times, shift information, and attendance status
            for tracking daily workforce presence.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={DailyAttendanceColumns()}
              data={attendanceData.results}
              pagination={true}
              dataTotalSize={attendanceData.count}
              tableOptions={tableOptions}
              fallbackText="No daily attendance data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyAttendanceReport;
