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
import { getEmployeeCreationTATData } from "app/hooks/reports";
import { EmployeeCreationTATColumns } from "../TableColumns/HiringReportTableColumns";

const EmployeeCreationTATReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [tatData, setTatData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");

  // Chart colors
  const statusColors = ["#10B981", "#EF4444"];

  // Fetch TAT data
  const fetchTATData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getEmployeeCreationTATData(payload);
      if (response) {
        setTatData(response);
      }
    } catch (error) {
      console.error("Error fetching TAT data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchTATData();
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
  const tatStatusChartData = React.useMemo(() => {
    if (!tatData.aggregated_stats?.tat_status_breakdown) return [];

    return Object.entries(tatData.aggregated_stats.tat_status_breakdown)
      .map(([status, count]) => ({
        status,
        count,
        percentage:
          tatData.aggregated_stats.total_employees > 0
            ? Math.round(
                (count / tatData.aggregated_stats.total_employees) * 100
              )
            : 0,
      }))
      .filter((item) => item.count > 0);
  }, [tatData.aggregated_stats]);

  // Calculate stats from aggregated data
  const stats = {
    totalEmployees:
      tatData.aggregated_stats?.total_employees || tatData.count || 0,
    averageTAT: tatData.aggregated_stats?.average_tat_days || 0,
    onTimeCount:
      tatData.aggregated_stats?.tat_status_breakdown?.["On Time"] || 0,
    delayedCount: tatData.aggregated_stats?.tat_status_breakdown?.Delayed || 0,
    onTimePercentage: tatData.aggregated_stats?.on_time_percentage || 0,
  };

  return (
    <div className="space-y-6">
      {/* TAT Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Employees",
            value: stats.totalEmployees,
            description: "Processed employees",
            color: "text-plum-900",
          },
          {
            title: "Average TAT",
            value: `${stats.averageTAT.toFixed(1)} days`,
            description: "Processing time",
            color: "text-blue-600",
          },
          {
            title: "On Time",
            value: stats.onTimeCount,
            description: `${stats.onTimePercentage.toFixed(1)}% completion`,
            color: "text-green-600",
          },
          {
            title: "Delayed",
            value: stats.delayedCount,
            description: `${(100 - stats.onTimePercentage).toFixed(
              1
            )}% delayed`,
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* TAT Status Distribution */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              TAT Performance Distribution
            </CardTitle>
            <CardDescription>
              On-time vs delayed employee creation
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tatStatusChartData}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="none"
                >
                  {tatStatusChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={statusColors[index % statusColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${value} employees (${
                      tatStatusChartData.find((d) => d.status === name)
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

        {/* TAT Performance Metrics */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              TAT Performance Metrics
            </CardTitle>
            <CardDescription>
              Comparison of on-time vs delayed processing
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={tatStatusChartData}
                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
              >
                <XAxis dataKey="status" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ fontSize: "12px" }}
                  formatter={(value) => [`${value} employees`, "Count"]}
                />
                <Bar
                  dataKey="count"
                  fill="#10B981"
                  name="Employees"
                  barSize={60}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* TAT Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Creation TAT Report</CardTitle>
          <CardDescription>
            Comprehensive analysis of employee creation turnaround time (TAT)
            tracking the time between joining date and HRMS creation for
            performance monitoring and process optimization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={EmployeeCreationTATColumns()}
              data={tatData.results}
              pagination={true}
              dataTotalSize={tatData.count}
              tableOptions={tableOptions}
              fallbackText="No TAT data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeCreationTATReport;
