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
import { getOvertimeReportData } from "app/hooks/reports";
import { OvertimeReportColumns } from "../TableColumns/AttendanceShiftTableColumns";

export const OvertimeReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [overtimeData, setOvertimeData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");

  // Chart colors
  const statusColors = ["#10B981", "#F59E0B", "#EF4444"];
  const hoursRangeColors = ["#10B981", "#F59E0B", "#EF4444"];
  const departmentColors = [
    "#3B82F6",
    "#8B5CF6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
  ];

  // Fetch overtime data
  const fetchOvertimeData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getOvertimeReportData(payload);
      if (response) {
        setOvertimeData(response);
      }
    } catch (error) {
      console.error("Error fetching overtime data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchOvertimeData();
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

  // Calculate stats from aggregated data
  const stats = {
    totalEmployees:
      overtimeData.aggregated_stats?.total_employees || overtimeData.count || 0,
    totalOvertimeHours:
      overtimeData.aggregated_stats?.total_overtime_hours || 0,
    presentStatus: overtimeData.aggregated_stats?.by_status?.Present || 0,
    lateStatus: overtimeData.aggregated_stats?.by_status?.Late || 0,
    highOTEmployees:
      overtimeData.aggregated_stats?.by_hours_range?.high_20_plus || 0,
    moderateOTEmployees:
      overtimeData.aggregated_stats?.by_hours_range?.moderate_10_to_20 || 0,
    lowOTEmployees:
      overtimeData.aggregated_stats?.by_hours_range?.low_under_10 || 0,
    avgOTHours:
      overtimeData.aggregated_stats?.total_employees > 0
        ? (
            overtimeData.aggregated_stats.total_overtime_hours /
            overtimeData.aggregated_stats.total_employees
          ).toFixed(1)
        : 0,
  };

  // Status distribution chart data
  const statusChartData = React.useMemo(() => {
    if (!overtimeData.aggregated_stats?.by_status) return [];

    return Object.entries(overtimeData.aggregated_stats.by_status)
      .map(([status, count]) => ({
        status,
        count,
        percentage:
          stats.totalEmployees > 0
            ? Math.round((count / stats.totalEmployees) * 100)
            : 0,
      }))
      .filter((item) => item.count > 0);
  }, [overtimeData.aggregated_stats, stats.totalEmployees]);

  // Overtime hours range chart data
  const hoursRangeChartData = React.useMemo(() => {
    if (!overtimeData.aggregated_stats?.by_hours_range) return [];

    return [
      {
        range: "Low (Under 10h)",
        count: stats.lowOTEmployees,
        percentage:
          stats.totalEmployees > 0
            ? Math.round((stats.lowOTEmployees / stats.totalEmployees) * 100)
            : 0,
      },
      {
        range: "Moderate (10-20h)",
        count: stats.moderateOTEmployees,
        percentage:
          stats.totalEmployees > 0
            ? Math.round(
                (stats.moderateOTEmployees / stats.totalEmployees) * 100
              )
            : 0,
      },
      {
        range: "High (20h+)",
        count: stats.highOTEmployees,
        percentage:
          stats.totalEmployees > 0
            ? Math.round((stats.highOTEmployees / stats.totalEmployees) * 100)
            : 0,
      },
    ].filter((item) => item.count > 0);
  }, [overtimeData.aggregated_stats, stats]);

  // Top overtime employees (from current page data)
  const topOvertimeEmployeesData = React.useMemo(() => {
    if (!overtimeData.results?.length) return [];

    return overtimeData.results
      .map((emp) => ({
        employee:
          emp.Employee?.length > 20
            ? emp.Employee.substring(0, 20) + "..."
            : emp.Employee,
        fullName: emp.Employee,
        department: emp.Department,
        hours: parseFloat(emp.OvertimeHours) || 0,
        status: emp.Status,
      }))
      .filter((emp) => emp.hours > 0)
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 10); // Top 10 employees
  }, [overtimeData.results]);

  // Department-wise overtime analysis (from current page data)
  const departmentOvertimeData = React.useMemo(() => {
    if (!overtimeData.results?.length) return [];

    const deptData = {};

    overtimeData.results.forEach((emp) => {
      const dept = emp.Department || "Unknown";
      const hours = parseFloat(emp.OvertimeHours) || 0;

      if (!deptData[dept]) {
        deptData[dept] = {
          department: dept.length > 15 ? dept.substring(0, 15) + "..." : dept,
          fullName: dept,
          totalHours: 0,
          employeeCount: 0,
        };
      }

      deptData[dept].totalHours += hours;
      deptData[dept].employeeCount += 1;
    });

    return Object.values(deptData)
      .filter((dept) => dept.totalHours > 0)
      .sort((a, b) => b.totalHours - a.totalHours)
      .slice(0, 8); // Top 8 departments
  }, [overtimeData.results]);

  return (
    <div className="space-y-6">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          {
            title: "Total Employees",
            value: stats.totalEmployees.toLocaleString(),
            description: "With overtime",
            color: "text-plum-900",
          },
          {
            title: "Total OT Hours",
            value: `${stats.totalOvertimeHours.toLocaleString()}h`,
            description: "Sum of overtime",
            color: "text-blue-600",
          },
          {
            title: "Avg Hours/Employee",
            value: `${stats.avgOTHours}h`,
            description: "Average overtime",
            color: "text-neutral-800",
          },
          {
            title: "High OT (20h+)",
            value: stats.highOTEmployees.toLocaleString(),
            description: "Excessive overtime",
            color: "text-red-600",
          },
          {
            title: "Present Status",
            value: stats.presentStatus.toLocaleString(),
            description: "Regular attendance",
            color: "text-green-600",
          },
          {
            title: "Late with OT",
            value: stats.lateStatus.toLocaleString(),
            description: "Late + overtime",
            color: "text-yellow-600",
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
        {/* Overtime Hours Range Distribution */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Overtime Hours Distribution
            </CardTitle>
            <CardDescription>
              Employee distribution by overtime hours range
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

        {/* Top Overtime Employees */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Top Overtime Employees
            </CardTitle>
            <CardDescription>
              Employees with highest overtime hours (current page)
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topOvertimeEmployeesData}
                margin={{ top: 20, right: 20, left: 0, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="employee"
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ fontSize: "12px" }}
                  formatter={(value) => [`${value}h`, "Overtime Hours"]}
                  labelFormatter={(label) =>
                    topOvertimeEmployeesData.find((d) => d.employee === label)
                      ?.fullName || label
                  }
                />
                <Bar
                  dataKey="hours"
                  fill="#3B82F6"
                  name="Hours"
                  barSize={25}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department-wise Overtime */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Department Overtime Analysis
            </CardTitle>
            <CardDescription>
              Total overtime hours by department (current page)
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={departmentOvertimeData}
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
                  formatter={(value) => [`${value}h`, "Total Overtime"]}
                  labelFormatter={(label) =>
                    departmentOvertimeData.find((d) => d.department === label)
                      ?.fullName || label
                  }
                />
                <Area
                  type="monotone"
                  dataKey="totalHours"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Overtime Table */}
      <Card>
        <CardHeader>
          <CardTitle>Overtime Report</CardTitle>
          <CardDescription>
            Track overtime hours by employee and status for payroll processing,
            cost management, and workforce optimization to ensure compliance
            with labor regulations and budget controls.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={OvertimeReportColumns()}
              data={overtimeData.results}
              pagination={true}
              dataTotalSize={overtimeData.count}
              tableOptions={tableOptions}
              fallbackText="No overtime data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
