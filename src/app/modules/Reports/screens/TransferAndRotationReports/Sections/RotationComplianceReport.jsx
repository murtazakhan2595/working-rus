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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { getRotationComplianceData } from "app/hooks/reports";
import { RotationComplianceColumns } from "../TableColumns/TransferRotationTableColumns";

const RotationComplianceReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [complianceData, setComplianceData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");

  // Chart colors
  const complianceColors = {
    Compliant: "#10B981",
    "Non-Compliant": "#EF4444",
    Overdue: "#F59E0B",
  };

  const departmentColors = [
    "#10B981",
    "#3B82F6",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
  ];

  // Fetch compliance data
  const fetchComplianceData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getRotationComplianceData(payload);
      if (response) {
        setComplianceData(response);
      }
    } catch (error) {
      console.error("Error fetching rotation compliance data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchComplianceData();
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

  // Calculate stats from aggregated_stats
  const stats = {
    totalEmployees: complianceData.aggregated_stats?.total_employees || 0,
    compliantEmployees:
      complianceData.aggregated_stats?.compliance_status?.Compliant || 0,
    nonCompliantEmployees:
      complianceData.aggregated_stats?.compliance_status?.["Non-Compliant"] ||
      0,
    overdueEmployees:
      complianceData.aggregated_stats?.compliance_status?.Overdue || 0,
    avgRotationInterval:
      complianceData.aggregated_stats?.avg_rotation_interval_months || 0,
    departmentCount: Object.keys(
      complianceData.aggregated_stats?.by_department || {}
    ).length,
  };

  // Calculate compliance percentage
  const compliancePercentage =
    stats.totalEmployees > 0
      ? Math.round((stats.compliantEmployees / stats.totalEmployees) * 100)
      : 0;

  // Prepare chart data
  const complianceChartData = React.useMemo(() => {
    if (!complianceData.aggregated_stats?.compliance_status) return [];
    return Object.entries(
      complianceData.aggregated_stats.compliance_status
    ).map(([status, count]) => ({
      status,
      count,
      fill: complianceColors[status] || "#6B7280",
    }));
  }, [complianceData.aggregated_stats]);

  const departmentChartData = React.useMemo(() => {
    if (!complianceData.aggregated_stats?.by_department) return [];
    return Object.entries(complianceData.aggregated_stats.by_department).map(
      ([department, count]) => ({
        department:
          department.length > 15
            ? department.substring(0, 15) + "..."
            : department,
        count,
      })
    );
  }, [complianceData.aggregated_stats]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          {
            title: "Total Employees",
            value: stats.totalEmployees,
            description: "Under compliance tracking",
            color: "text-plum-900",
          },
          {
            title: "Compliant",
            value: stats.compliantEmployees,
            description: "Meeting requirements",
            color: "text-green-600",
          },
          {
            title: "Non-Compliant",
            value: stats.nonCompliantEmployees,
            description: "Compliance issues",
            color: "text-red-600",
          },
          {
            title: "Overdue",
            value: stats.overdueEmployees,
            description: "Past due rotation",
            color: "text-orange-600",
          },
          {
            title: "Compliance Rate",
            value: `${compliancePercentage}%`,
            description: "Overall compliance",
            color:
              compliancePercentage >= 90
                ? "text-green-600"
                : compliancePercentage >= 70
                ? "text-yellow-600"
                : "text-red-600",
          },
          {
            title: "Departments",
            value: stats.departmentCount,
            description: "Tracked departments",
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
        {/* Compliance Status Distribution */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Compliance Status Distribution
            </CardTitle>
            <CardDescription>
              Employee compliance status breakdown
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={complianceChartData}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="none"
                >
                  {complianceChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} employees`, name]}
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

        {/* Compliance by Department */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Compliance by Department
            </CardTitle>
            <CardDescription>
              Department-wise compliance tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={departmentChartData}
                margin={{ top: 20, right: 20, left: 0, bottom: 60 }}
              >
                <XAxis
                  dataKey="department"
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ fontSize: "12px" }}
                  formatter={(value, name) => [`${value} employees`, "Count"]}
                />
                <Bar
                  dataKey="count"
                  fill="#10B981"
                  name="Employees"
                  barSize={40}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Rotation Compliance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Rotation Compliance Report</CardTitle>
          <CardDescription>
            Regulatory compliance tracking for job rotations, especially for
            banking and financial sectors where CB UAE requires rotation
            compliance monitoring.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={RotationComplianceColumns()}
              data={complianceData.results}
              pagination={true}
              dataTotalSize={complianceData.count}
              tableOptions={tableOptions}
              fallbackText="No rotation compliance data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RotationComplianceReport;
