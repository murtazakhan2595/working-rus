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
// ============================================================================
// NO PUNCH REPORT COMPONENT
// ============================================================================
import { getNoPunchReportData } from "app/hooks/reports";
import { NoPunchReportColumns } from "../TableColumns/AttendanceShiftTableColumns";

export const NoPunchReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [noPunchData, setNoPunchData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");

  // Chart colors
  const punchTypeColors = ["#F59E0B", "#EF4444", "#8B5CF6"];
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

  const fetchNoPunchData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getNoPunchReportData(payload);
      if (response) {
        setNoPunchData(response);
      }
    } catch (error) {
      console.error("Error fetching no punch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchNoPunchData();
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

  // Calculate stats from aggregated data only
  const stats = {
    totalMissingPunches:
      noPunchData.aggregated_stats?.total_missing_punches ||
      noPunchData.count ||
      0,
    checkInMissing:
      noPunchData.aggregated_stats?.by_punch_type?.check_in_missing || 0,
    checkOutMissing:
      noPunchData.aggregated_stats?.by_punch_type?.check_out_missing || 0,
    bothMissing: noPunchData.aggregated_stats?.by_punch_type?.both_missing || 0,
  };

  // Punch type distribution chart data
  const punchTypeChartData = React.useMemo(() => {
    if (!noPunchData.aggregated_stats?.by_punch_type) return [];

    return [
      {
        type: "Check-in Missing",
        count: stats.checkInMissing,
        percentage:
          stats.totalMissingPunches > 0
            ? Math.round(
                (stats.checkInMissing / stats.totalMissingPunches) * 100
              )
            : 0,
      },
      {
        type: "Check-out Missing",
        count: stats.checkOutMissing,
        percentage:
          stats.totalMissingPunches > 0
            ? Math.round(
                (stats.checkOutMissing / stats.totalMissingPunches) * 100
              )
            : 0,
      },
      {
        type: "Both Missing",
        count: stats.bothMissing,
        percentage:
          stats.totalMissingPunches > 0
            ? Math.round((stats.bothMissing / stats.totalMissingPunches) * 100)
            : 0,
      },
    ].filter((item) => item.count > 0);
  }, [noPunchData.aggregated_stats, stats]);

  // Department-wise missing punches chart data
  const departmentChartData = React.useMemo(() => {
    if (!noPunchData.aggregated_stats?.by_department) return [];

    return Object.entries(noPunchData.aggregated_stats.by_department)
      .map(([department, count]) => ({
        department:
          department.length > 20
            ? department.substring(0, 20) + "..."
            : department,
        fullName: department,
        missingPunches: count,
      }))
      .filter((item) => item.missingPunches > 0)
      .sort((a, b) => b.missingPunches - a.missingPunches)
      .slice(0, 10); // Top 10 departments
  }, [noPunchData.aggregated_stats]);

  return (
    <div className="space-y-6">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            title: "Total Missing Punches",
            value: stats.totalMissingPunches.toLocaleString(),
            description: "Records with missing data",
            color: "text-plum-900",
          },
          {
            title: "Check-in Missing",
            value: stats.checkInMissing.toLocaleString(),
            description: "Missing arrival punches",
            color: "text-yellow-600",
          },
          {
            title: "Check-out Missing",
            value: stats.checkOutMissing.toLocaleString(),
            description: "Missing departure punches",
            color: "text-orange-600",
          },
          {
            title: "Both Missing",
            value: stats.bothMissing.toLocaleString(),
            description: "Complete punch missing",
            color: "text-red-600",
          },
          {
            title: "System Reliability",
            value: `${
              stats.checkOutMissing > stats.checkInMissing
                ? "Check-out"
                : "Check-in"
            } Issue`,
            description: "Primary concern area",
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
        {/* Punch Type Distribution */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Missing Punch Type Distribution
            </CardTitle>
            <CardDescription>
              Breakdown of missing punch types across all records
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={punchTypeChartData}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="none"
                >
                  {punchTypeChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={punchTypeColors[index % punchTypeColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${value.toLocaleString()} records (${
                      punchTypeChartData.find((d) => d.type === name)
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

        {/* Department-wise Missing Punches */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Departments with Most Missing Punches
            </CardTitle>
            <CardDescription>
              Departments requiring attention for punch system issues
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
                    `${value} missing punches`,
                    "Missing Punches",
                  ]}
                  labelFormatter={(label) =>
                    departmentChartData.find((d) => d.department === label)
                      ?.fullName || label
                  }
                />
                <Bar
                  dataKey="missingPunches"
                  name="Missing Punches"
                  barSize={30}
                  radius={[4, 4, 0, 0]}
                  fill="#EF4444"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* No Punch Table */}
      <Card>
        <CardHeader>
          <CardTitle>No Punch Report</CardTitle>
          <CardDescription>
            Identify employees who missed biometric punches to ensure accurate
            attendance tracking and resolve system issues promptly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={NoPunchReportColumns()}
              data={noPunchData.results}
              pagination={true}
              dataTotalSize={noPunchData.count}
              tableOptions={tableOptions}
              fallbackText="No missing punch data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
