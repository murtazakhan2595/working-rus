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
  RadialBarChart,
  RadialBar,
} from "recharts";
import { getShiftComplianceReportData } from "app/hooks/reports";
import { ShiftComplianceReportColumns } from "../TableColumns/AttendanceShiftTableColumns";

export const ShiftComplianceReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [shiftComplianceData, setShiftComplianceData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");

  // Chart colors
  const complianceColors = ["#10B981", "#F59E0B", "#EF4444"];
  const performanceColors = ["#3B82F6", "#8B5CF6", "#10B981"];

  const fetchShiftComplianceData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getShiftComplianceReportData(payload);
      if (response) {
        setShiftComplianceData(response);
      }
    } catch (error) {
      console.error("Error fetching shift compliance data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchShiftComplianceData();
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
      shiftComplianceData.aggregated_stats?.total_employees ||
      shiftComplianceData.count ||
      0,
    totalAssignedShifts:
      shiftComplianceData.aggregated_stats?.total_assigned_shifts || 0,
    totalDeviations:
      shiftComplianceData.aggregated_stats?.total_deviations || 0,
    excellentCompliance:
      shiftComplianceData.aggregated_stats?.by_compliance_level
        ?.excellent_95_plus || 0,
    goodCompliance:
      shiftComplianceData.aggregated_stats?.by_compliance_level
        ?.good_80_to_94 || 0,
    poorCompliance:
      shiftComplianceData.aggregated_stats?.by_compliance_level
        ?.poor_under_80 || 0,
    overallComplianceRate:
      shiftComplianceData.aggregated_stats?.total_assigned_shifts > 0
        ? Math.round(
            ((shiftComplianceData.aggregated_stats.total_assigned_shifts -
              shiftComplianceData.aggregated_stats.total_deviations) /
              shiftComplianceData.aggregated_stats.total_assigned_shifts) *
              100
          )
        : 0,
  };

  // Compliance level distribution chart data
  const complianceChartData = React.useMemo(() => {
    if (!shiftComplianceData.aggregated_stats?.by_compliance_level) return [];

    return [
      {
        level: "Excellent (95%+)",
        count: stats.excellentCompliance,
        percentage:
          stats.totalEmployees > 0
            ? Math.round(
                (stats.excellentCompliance / stats.totalEmployees) * 100
              )
            : 0,
      },
      {
        level: "Good (80-94%)",
        count: stats.goodCompliance,
        percentage:
          stats.totalEmployees > 0
            ? Math.round((stats.goodCompliance / stats.totalEmployees) * 100)
            : 0,
      },
      {
        level: "Poor (Under 80%)",
        count: stats.poorCompliance,
        percentage:
          stats.totalEmployees > 0
            ? Math.round((stats.poorCompliance / stats.totalEmployees) * 100)
            : 0,
      },
    ].filter((item) => item.count > 0);
  }, [shiftComplianceData.aggregated_stats, stats]);

  // Employee compliance analysis (from current page data)
  const employeeComplianceData = React.useMemo(() => {
    if (!shiftComplianceData.results?.length) return [];

    return shiftComplianceData.results
      .map((emp) => ({
        employee:
          emp.Employee?.length > 15
            ? emp.Employee.substring(0, 15) + "..."
            : emp.Employee,
        fullName: emp.Employee,
        department: emp.Department,
        assignedShifts: parseInt(emp.Assigned_Shifts) || 0,
        deviations: parseInt(emp.Deviations) || 0,
        complianceRate: parseFloat(emp.Compliance_Rate?.replace("%", "") || 0),
      }))
      .sort((a, b) => a.complianceRate - b.complianceRate)
      .slice(0, 10); // Bottom 10 for improvement focus
  }, [shiftComplianceData.results]);

  // Overall compliance gauge data
  const gaugeData = [
    {
      name: "Compliance",
      value: stats.overallComplianceRate,
      fill:
        stats.overallComplianceRate >= 95
          ? "#10B981"
          : stats.overallComplianceRate >= 80
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
            description: "Tracked for compliance",
            color: "text-plum-900",
          },
          {
            title: "Assigned Shifts",
            value: stats.totalAssignedShifts.toLocaleString(),
            description: "Total shifts scheduled",
            color: "text-neutral-800",
          },
          {
            title: "Total Deviations",
            value: stats.totalDeviations.toLocaleString(),
            description: "Compliance violations",
            color: "text-red-600",
          },
          {
            title: "Compliance Rate",
            value: `${stats.overallComplianceRate}%`,
            description: "Overall compliance",
            color:
              stats.overallComplianceRate >= 95
                ? "text-green-600"
                : stats.overallComplianceRate >= 80
                ? "text-yellow-600"
                : "text-red-600",
          },
          {
            title: "Excellent",
            value: stats.excellentCompliance.toLocaleString(),
            description: "95%+ compliance",
            color: "text-green-600",
          },
          {
            title: "Needs Improvement",
            value: stats.poorCompliance.toLocaleString(),
            description: "Under 80% compliance",
            color: "text-red-600",
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
        {/* Compliance Level Distribution */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Compliance Performance Levels
            </CardTitle>
            <CardDescription>
              Employee distribution by shift compliance performance
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={complianceChartData}
                  dataKey="count"
                  nameKey="level"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="none"
                >
                  {complianceChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={complianceColors[index % complianceColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${value.toLocaleString()} employees (${
                      complianceChartData.find((d) => d.level === name)
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

        {/* Overall Compliance Gauge */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Overall Compliance Rate
            </CardTitle>
            <CardDescription>
              Organization-wide shift compliance performance
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
                  {stats.overallComplianceRate}%
                </text>
                <Tooltip
                  formatter={(value) => [`${value}%`, "Compliance Rate"]}
                  contentStyle={{ fontSize: "12px" }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Employees Needing Improvement */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Focus Areas for Improvement
            </CardTitle>
            <CardDescription>
              Employees with lowest compliance rates (current page)
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={employeeComplianceData}
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
                <YAxis
                  tick={{ fontSize: 12 }}
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  contentStyle={{ fontSize: "12px" }}
                  formatter={(value) => [`${value}%`, "Compliance Rate"]}
                  labelFormatter={(label) =>
                    employeeComplianceData.find((d) => d.employee === label)
                      ?.fullName || label
                  }
                />
                <Bar
                  dataKey="complianceRate"
                  name="Compliance %"
                  barSize={25}
                  radius={[4, 4, 0, 0]}
                  fill={(entry) =>
                    entry >= 95
                      ? "#10B981"
                      : entry >= 80
                      ? "#F59E0B"
                      : "#EF4444"
                  }
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Shift Compliance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Shift Compliance Report</CardTitle>
          <CardDescription>
            Monitor deviations from allocated shifts to ensure workforce
            discipline, maintain operational efficiency, and identify employees
            who require additional support or training for shift adherence.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={ShiftComplianceReportColumns()}
              data={shiftComplianceData.results}
              pagination={true}
              dataTotalSize={shiftComplianceData.count}
              tableOptions={tableOptions}
              fallbackText="No shift compliance data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
