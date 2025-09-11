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
import { getNewHireReportData } from "app/hooks/reports";
import { NewHireColumns } from "../TableColumns/HiringReportTableColumns";

const NewHireReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [newHireData, setNewHireData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");

  // Chart colors
  const statusColors = ["#10B981", "#EF4444", "#F59E0B", "#6B7280"];

  // Fetch new hire data
  const fetchNewHireData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getNewHireReportData(payload);
      if (response) {
        setNewHireData(response);
      }
    } catch (error) {
      console.error("Error fetching new hire data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchNewHireData();
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
    if (!newHireData.aggregated_stats?.status_breakdown) return [];

    return Object.entries(newHireData.aggregated_stats.status_breakdown)
      .map(([status, count]) => ({
        status,
        count,
        percentage:
          newHireData.aggregated_stats.total_new_hires > 0
            ? Math.round(
                (count / newHireData.aggregated_stats.total_new_hires) * 100
              )
            : 0,
      }))
      .filter((item) => item.count > 0);
  }, [newHireData.aggregated_stats]);

  // Department chart data
  const departmentChartData = React.useMemo(() => {
    if (!newHireData.aggregated_stats?.department_breakdown) return [];

    return Object.entries(newHireData.aggregated_stats.department_breakdown)
      .map(([department, count]) => ({
        department,
        count,
      }))
      .filter((item) => item.count > 0)
      .slice(0, 8); // Top 8 departments
  }, [newHireData.aggregated_stats]);

  // Calculate stats from aggregated data
  const stats = {
    totalNewHires:
      newHireData.aggregated_stats?.total_new_hires || newHireData.count || 0,
    activeEmployees:
      newHireData.aggregated_stats?.status_breakdown?.Active || 0,
    terminatedEmployees:
      newHireData.aggregated_stats?.status_breakdown?.Terminated || 0,
    topDepartment:
      Object.keys(
        newHireData.aggregated_stats?.department_breakdown || {}
      )[0] || "N/A",
  };

  return (
    <div className="space-y-6">
      {/* New Hire Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total New Hires",
            value: stats.totalNewHires,
            description: "All new employees",
            color: "text-plum-900",
          },
          {
            title: "Active Employees",
            value: stats.activeEmployees,
            description: "Currently active",
            color: "text-green-600",
          },
          {
            title: "Terminated",
            value: stats.terminatedEmployees,
            description: "No longer active",
            color: "text-red-600",
          },
          {
            title: "Top Department",
            value: stats.topDepartment,
            description: "Highest hiring",
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
        {/* Employee Status Distribution */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              New Hire Status Distribution
            </CardTitle>
            <CardDescription>Status breakdown of all new hires</CardDescription>
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

        {/* Department-wise Hiring */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Hiring by Department
            </CardTitle>
            <CardDescription>
              New hire distribution across departments
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
                  formatter={(value) => [`${value} hires`, "Count"]}
                />
                <Bar
                  dataKey="count"
                  fill="#10B981"
                  name="New Hires"
                  barSize={40}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* New Hire Table */}
      <Card>
        <CardHeader>
          <CardTitle>New Hire Report</CardTitle>
          <CardDescription>
            Comprehensive listing of all new employees with their core
            information including employee ID, designation, department, joining
            date, location, and current status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={NewHireColumns()}
              data={newHireData.results}
              pagination={true}
              dataTotalSize={newHireData.count}
              tableOptions={tableOptions}
              fallbackText="No new hire data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewHireReport;
