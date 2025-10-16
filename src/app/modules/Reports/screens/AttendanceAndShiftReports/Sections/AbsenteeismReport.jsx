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
import { getAbsenteeismReportData } from "app/hooks/reports";
import { AbsenteeismReportColumns } from "../TableColumns/AttendanceShiftTableColumns";

const AbsenteeismReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [absenteeismData, setAbsenteeismData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");

  // Chart colors
  const riskColors = ["#10B981", "#F59E0B", "#EF4444"];
  const departmentColors = [
    "#3B82F6",
    "#8B5CF6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#06B6D4",
    "#84CC16",
    "#F97316",
    "#EC4899",
    "#6B7280",
  ];

  // Fetch absenteeism data
  const fetchAbsenteeismData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getAbsenteeismReportData(payload);
      if (response) {
        setAbsenteeismData(response);
      }
    } catch (error) {
      console.error("Error fetching absenteeism data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchAbsenteeismData();
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
      absenteeismData.aggregated_stats?.total_employees ||
      absenteeismData.count ||
      0,
    totalAbsentDays: absenteeismData.aggregated_stats?.total_absent_days || 0,
    highRiskEmployees:
      absenteeismData.aggregated_stats?.by_absenteeism_level
        ?.high_risk_5_plus || 0,
    moderateRiskEmployees:
      absenteeismData.aggregated_stats?.by_absenteeism_level?.moderate_3_to_5 ||
      0,
    lowRiskEmployees:
      absenteeismData.aggregated_stats?.by_absenteeism_level?.low_under_3 || 0,
    avgAbsentDays:
      absenteeismData.aggregated_stats?.total_employees > 0
        ? (
            absenteeismData.aggregated_stats.total_absent_days /
            absenteeismData.aggregated_stats.total_employees
          ).toFixed(1)
        : 0,
  };

  // Risk level distribution chart data
  const riskChartData = React.useMemo(() => {
    if (!absenteeismData.aggregated_stats?.by_absenteeism_level) return [];

    return [
      {
        level: "Low Risk (<3 days)",
        count: stats.lowRiskEmployees,
        percentage:
          stats.totalEmployees > 0
            ? Math.round((stats.lowRiskEmployees / stats.totalEmployees) * 100)
            : 0,
      },
      {
        level: "Moderate Risk (3-5 days)",
        count: stats.moderateRiskEmployees,
        percentage:
          stats.totalEmployees > 0
            ? Math.round(
                (stats.moderateRiskEmployees / stats.totalEmployees) * 100
              )
            : 0,
      },
      {
        level: "High Risk (5+ days)",
        count: stats.highRiskEmployees,
        percentage:
          stats.totalEmployees > 0
            ? Math.round((stats.highRiskEmployees / stats.totalEmployees) * 100)
            : 0,
      },
    ].filter((item) => item.count > 0);
  }, [absenteeismData.aggregated_stats, stats]);

  // Department-wise absenteeism chart data
  const departmentChartData = React.useMemo(() => {
    if (!absenteeismData.aggregated_stats?.by_department) return [];

    return Object.entries(absenteeismData.aggregated_stats.by_department)
      .map(([department, count]) => ({
        department:
          department.length > 20
            ? department.substring(0, 20) + "..."
            : department,
        fullName: department,
        employees: count,
      }))
      .filter((item) => item.employees > 0)
      .sort((a, b) => b.employees - a.employees)
      .slice(0, 10); // Top 10 departments
  }, [absenteeismData.aggregated_stats]);

  return (
    <div className="space-y-6">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          {
            title: "Total Employees",
            value: stats.totalEmployees.toLocaleString(),
            description: "Tracked for absenteeism",
            color: "text-plum-900",
          },
          {
            title: "Total Absent Days",
            value: stats.totalAbsentDays.toLocaleString(),
            description: "Across all employees",
            color: "text-red-600",
          },
          {
            title: "Avg Days/Employee",
            value: stats.avgAbsentDays,
            description: "Average absent days",
            color: "text-neutral-800",
          },
          {
            title: "High Risk",
            value: stats.highRiskEmployees.toLocaleString(),
            description: "5+ absent days",
            color: "text-red-700",
          },
          {
            title: "Moderate Risk",
            value: stats.moderateRiskEmployees.toLocaleString(),
            description: "3-5 absent days",
            color: "text-yellow-600",
          },
          {
            title: "Low Risk",
            value: stats.lowRiskEmployees.toLocaleString(),
            description: "Under 3 days",
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Risk Level Distribution */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Absenteeism Risk Levels
            </CardTitle>
            <CardDescription>
              Employee distribution by absenteeism risk category
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskChartData}
                  dataKey="count"
                  nameKey="level"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="none"
                >
                  {riskChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={riskColors[index % riskColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${value.toLocaleString()} employees (${
                      riskChartData.find((d) => d.level === name)?.percentage
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

        {/* Department-wise Absenteeism */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Most Affected Departments
            </CardTitle>
            <CardDescription>
              Departments with highest number of absentee employees
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
                  formatter={(value, name) => [
                    `${value} employees`,
                    "Employees with Absences",
                  ]}
                  labelFormatter={(label) =>
                    departmentChartData.find((d) => d.department === label)
                      ?.fullName || label
                  }
                />
                <Bar
                  dataKey="employees"
                  fill="#EF4444"
                  name="Employees"
                  barSize={30}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Absenteeism Table */}
      <Card>
        <CardHeader>
          <CardTitle>Absenteeism Report</CardTitle>
          <CardDescription>
            Track frequent absentees by employee and department to identify
            patterns and take corrective action for improved workforce
            reliability and employee engagement.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={AbsenteeismReportColumns()}
              data={absenteeismData.results}
              pagination={true}
              dataTotalSize={absenteeismData.count}
              tableOptions={tableOptions}
              fallbackText="No absenteeism data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AbsenteeismReport;
