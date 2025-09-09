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
import { getEmployeeReportsData, getOrgReport } from "app/hooks/reports";
import { EmployeeStatusColumns } from "../TableColumns/ReportTableColumns";

const EmployeeStatusReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [employeeData, setEmployeeData] = useState({ results: [], count: 0 });
  const [orgReportData, setOrgReportData] = useState(null);
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("name");

  // Status colors
  const statusColors = {
    Active: "#10B981",
    "On Leave": "#F59E0B",
    Probation: "#3B82F6",
    Terminated: "#EF4444",
    "Notice Period": "#8B5CF6",
    Retired: "#6B7280",
  };

  // Fetch employee data and org report
  const fetchEmployeeStatusData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };

      // Fetch table data (paginated)
      const tablePayload = {
        filterData: combinedFilters,
        options,
        ordering,
      };
      const tableResponse = await getEmployeeReportsData(tablePayload);

      // Fetch org report data (aggregated stats)
      const orgResponse = await getOrgReport(combinedFilters);

      if (tableResponse) {
        setEmployeeData(tableResponse);
      }

      if (orgResponse) {
        setOrgReportData(orgResponse);
      }
    } catch (error) {
      console.error("Error fetching employee status data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchEmployeeStatusData();
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

  // Calculate status statistics from org report data
  const statusStats = React.useMemo(() => {
    if (!orgReportData?.grandTotals) {
      return {
        Active: 0,
        "On Leave": 0,
        Probation: 0,
        Terminated: 0,
        "Notice Period": 0,
        Retired: 0,
      };
    }

    const grandTotals = orgReportData.grandTotals;

    return {
      Active: grandTotals.active || 0,
      "On Leave": grandTotals.on_leave || 0,
      Probation: grandTotals.probation || 0, // Backend will add this
      Terminated: grandTotals.terminated || 0,
      "Notice Period": grandTotals.notice_period || 0, // Backend will add this
      Retired: grandTotals.retired || 0,
    };
  }, [orgReportData]);

  // Prepare chart data
  const statusChartData = React.useMemo(() => {
    const totalEmployees = orgReportData?.grandTotals?.total || 0;

    return Object.entries(statusStats)
      .map(([status, count]) => ({
        status,
        count,
        percentage:
          totalEmployees > 0 ? Math.round((count / totalEmployees) * 100) : 0,
        fill: statusColors[status] || "#6B7280",
      }))
      .filter((item) => item.count > 0); // Only show statuses with data
  }, [statusStats, orgReportData]);

  // Department-wise status breakdown from org report
  const departmentStatusData = React.useMemo(() => {
    if (!orgReportData?.departmentWise) return [];

    return orgReportData.departmentWise
      .map((dept) => ({
        department:
          dept.department.length > 15
            ? dept.department.substring(0, 15) + "..."
            : dept.department,
        Active: dept.active || 0,
        "On Leave": dept.on_leave || 0,
        Probation: dept.probation || 0, // Backend will add this
        Terminated: dept.terminated || 0,
        "Notice Period": dept.notice_period || 0, // Backend will add this
        Retired: dept.retired || 0,
        total: dept.total || 0,
      }))
      .filter((dept) => dept.total > 0)
      .slice(0, 10); // Top 10 departments
  }, [orgReportData]);

  const totalEmployees = orgReportData?.grandTotals?.total || 0;

  return (
    <div className="space-y-6">
      {/* Status Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {Object.entries(statusStats).map(([status, count]) => (
          <Card
            key={status}
            className="flex flex-col justify-center shadow-md border rounded-lg"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-neutral-900">
                {status}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className="text-3xl font-medium"
                style={{ color: statusColors[status] }}
              >
                {count}
              </p>
              <p className="text-xs text-neutral-800 mt-1">
                {totalEmployees > 0
                  ? `${Math.round((count / totalEmployees) * 100)}%`
                  : "0%"}{" "}
                of total
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Status Distribution Pie Chart */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Employee Status Distribution
            </CardTitle>
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
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${value} employees (${
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

        {/* Department-wise Status Breakdown */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Status by Department
            </CardTitle>
            <CardDescription>
              Employee status breakdown by department
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={departmentStatusData}
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
                <Tooltip contentStyle={{ fontSize: "12px" }} />
                <Bar
                  dataKey="Active"
                  stackId="a"
                  fill={statusColors.Active}
                  name="Active"
                />
                <Bar
                  dataKey="On Leave"
                  stackId="a"
                  fill={statusColors["On Leave"]}
                  name="On Leave"
                />
                <Bar
                  dataKey="Probation"
                  stackId="a"
                  fill={statusColors.Probation}
                  name="Probation"
                />
                <Bar
                  dataKey="Terminated"
                  stackId="a"
                  fill={statusColors.Terminated}
                  name="Terminated"
                />
                <Bar
                  dataKey="Notice Period"
                  stackId="a"
                  fill={statusColors["Notice Period"]}
                  name="Notice Period"
                />
                <Bar
                  dataKey="Retired"
                  stackId="a"
                  fill={statusColors.Retired}
                  name="Retired"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Employee Status Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Status Report</CardTitle>
          <CardDescription>
            Comprehensive employee status tracking including active employees,
            those on leave, terminated, and other status categories with leave
            balance information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={EmployeeStatusColumns()}
              data={employeeData.results}
              pagination={true}
              dataTotalSize={employeeData.count}
              tableOptions={tableOptions}
              fallbackText="No employee status data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeStatusReport;
