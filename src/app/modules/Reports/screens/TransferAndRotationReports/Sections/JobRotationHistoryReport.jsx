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
import { getJobRotationHistoryData } from "app/hooks/reports";
import { JobRotationHistoryColumns } from "../TableColumns/TransferRotationTableColumns";

const JobRotationHistoryReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [rotationData, setRotationData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");

  // Chart colors
  const reasonColors = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"];
  const departmentColors = [
    "#10B981",
    "#3B82F6",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
  ];

  // Fetch rotation history data
  const fetchRotationData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getJobRotationHistoryData(payload);
      if (response) {
        setRotationData(response);
      }
    } catch (error) {
      console.error("Error fetching rotation history data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchRotationData();
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
    totalRotations: rotationData.aggregated_stats?.total_rotations || 0,
    avgDurationMonths: rotationData.aggregated_stats?.avg_duration_months || 0,
    uniqueDepartments: Object.keys(
      rotationData.aggregated_stats?.by_department_from || {}
    ).length,
    reasonsCount: Object.keys(rotationData.aggregated_stats?.by_reason || {})
      .length,
  };

  // Prepare chart data
  const reasonChartData = React.useMemo(() => {
    if (!rotationData.aggregated_stats?.by_reason) return [];
    return Object.entries(rotationData.aggregated_stats.by_reason).map(
      ([reason, count], index) => ({
        reason: reason === "Other" ? "General" : reason,
        count,
        fill: reasonColors[index % reasonColors.length],
      })
    );
  }, [rotationData.aggregated_stats]);

  const departmentChartData = React.useMemo(() => {
    if (!rotationData.aggregated_stats?.by_department_from) return [];
    return Object.entries(rotationData.aggregated_stats.by_department_from)
      .sort(([, a], [, b]) => b - a) // Sort by count descending
      .slice(0, 6) // Top 6 departments
      .map(([department, count]) => ({
        department:
          department === "N/A"
            ? "Other"
            : department.length > 15
            ? department.substring(0, 15) + "..."
            : department,
        count,
      }));
  }, [rotationData.aggregated_stats]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Rotations",
            value: stats.totalRotations,
            description: "All job rotations",
            color: "text-plum-900",
          },
          {
            title: "Avg Duration",
            value: `${Math.round(stats.avgDurationMonths)}M`,
            description: "Average role duration",
            color: "text-blue-600",
          },
          {
            title: "Departments",
            value: stats.uniqueDepartments,
            description: "Departments involved",
            color: "text-green-600",
          },
          {
            title: "Rotation Types",
            value: stats.reasonsCount,
            description: "Distinct reasons",
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
        {/* Rotation Reasons Distribution */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Rotation Reasons
            </CardTitle>
            <CardDescription>Distribution of rotation reasons</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reasonChartData}
                  dataKey="count"
                  nameKey="reason"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="none"
                >
                  {reasonChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} rotations`, name]}
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

        {/* Department Movement */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Movement by Department
            </CardTitle>
            <CardDescription>
              Top departments with employee movements
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
                  formatter={(value, name) => [`${value} rotations`, "Count"]}
                />
                <Bar
                  dataKey="count"
                  fill="#10B981"
                  name="Rotations"
                  barSize={40}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Job Rotation History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Job Rotation History</CardTitle>
          <CardDescription>
            Complete history of employee job rotations including department
            changes, designation transitions, and rotation reasons with duration
            tracking.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={JobRotationHistoryColumns()}
              data={rotationData.results}
              pagination={true}
              dataTotalSize={rotationData.count}
              tableOptions={tableOptions}
              fallbackText="No rotation history data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JobRotationHistoryReport;
