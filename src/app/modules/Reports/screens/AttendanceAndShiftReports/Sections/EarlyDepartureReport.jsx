// ============================================================================
// EARLY DEPARTURE REPORT COMPONENT
// ============================================================================
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
import { getEarlyDepartureReportData } from "app/hooks/reports";
import { EarlyDepartureReportColumns } from "../TableColumns/AttendanceShiftTableColumns";

export const EarlyDepartureReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [earlyDepartureData, setEarlyDepartureData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");

  // Chart colors
  const frequencyColors = ["#10B981", "#F59E0B", "#EF4444"];

  const fetchEarlyDepartureData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getEarlyDepartureReportData(payload);
      if (response) {
        setEarlyDepartureData(response);
      }
    } catch (error) {
      console.error("Error fetching early departure data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchEarlyDepartureData();
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
    totalEmployees:
      earlyDepartureData.aggregated_stats?.total_employees ||
      earlyDepartureData.count ||
      0,
    totalEarlyExits:
      earlyDepartureData.aggregated_stats?.total_early_exits || 0,
    totalTimeLostHours:
      earlyDepartureData.aggregated_stats?.total_time_lost_hours || 0,
    frequentExits:
      earlyDepartureData.aggregated_stats?.by_frequency?.frequent_5_plus || 0,
    moderateExits:
      earlyDepartureData.aggregated_stats?.by_frequency?.moderate_2_to_5 || 0,
    occasionalExits:
      earlyDepartureData.aggregated_stats?.by_frequency?.occasional_under_2 ||
      0,
  };

  // Frequency distribution chart data
  const frequencyChartData = React.useMemo(() => {
    if (!earlyDepartureData.aggregated_stats?.by_frequency) return [];

    return [
      {
        range: "Occasional (Under 2)",
        count: stats.occasionalExits,
        percentage:
          stats.totalEmployees > 0
            ? Math.round((stats.occasionalExits / stats.totalEmployees) * 100)
            : 0,
      },
      {
        range: "Moderate (2-5)",
        count: stats.moderateExits,
        percentage:
          stats.totalEmployees > 0
            ? Math.round((stats.moderateExits / stats.totalEmployees) * 100)
            : 0,
      },
      {
        range: "Frequent (5+)",
        count: stats.frequentExits,
        percentage:
          stats.totalEmployees > 0
            ? Math.round((stats.frequentExits / stats.totalEmployees) * 100)
            : 0,
      },
    ].filter((item) => item.count > 0);
  }, [earlyDepartureData.aggregated_stats, stats]);

  // Time impact visualization
  const timeImpactData = React.useMemo(() => {
    if (!earlyDepartureData.aggregated_stats) return [];

    return [
      {
        metric: "Total Early Exits",
        value: stats.totalEarlyExits,
      },
      {
        metric: "Total Time Lost (Hours)",
        value: stats.totalTimeLostHours,
      },
      {
        metric: "Avg Time Lost per Employee",
        value:
          stats.totalEmployees > 0
            ? (stats.totalTimeLostHours / stats.totalEmployees).toFixed(1)
            : 0,
      },
    ];
  }, [earlyDepartureData.aggregated_stats, stats]);

  return (
    <div className="space-y-6">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          {
            title: "Total Employees",
            value: stats.totalEmployees.toLocaleString(),
            description: "Employees tracked",
            color: "text-plum-900",
          },
          {
            title: "Total Early Exits",
            value: stats.totalEarlyExits.toLocaleString(),
            description: "Sum of early exits",
            color: "text-orange-600",
          },
          {
            title: "Total Time Lost",
            value: `${stats.totalTimeLostHours.toLocaleString()}h`,
            description: "Hours lost",
            color: "text-red-600",
          },
          {
            title: "Frequent Exits (5+)",
            value: stats.frequentExits.toLocaleString(),
            description: "High-risk employees",
            color: "text-red-700",
          },
          {
            title: "Moderate Exits (2-5)",
            value: stats.moderateExits.toLocaleString(),
            description: "Medium concern",
            color: "text-yellow-600",
          },
          {
            title: "Occasional (Under 2)",
            value: stats.occasionalExits.toLocaleString(),
            description: "Low concern",
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
        {/* Early Exit Frequency Distribution */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Early Exit Frequency Distribution
            </CardTitle>
            <CardDescription>
              Employee distribution by early departure frequency
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={frequencyChartData}
                  dataKey="count"
                  nameKey="range"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="none"
                >
                  {frequencyChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={frequencyColors[index % frequencyColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${value.toLocaleString()} employees (${
                      frequencyChartData.find((d) => d.range === name)
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

        {/* Time Impact Analysis */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Time Impact Analysis
            </CardTitle>
            <CardDescription>
              Overall impact of early departures on productivity
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={timeImpactData}
                margin={{ top: 20, right: 20, left: 0, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="metric"
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ fontSize: "12px" }}
                  formatter={(value, name) => [value, "Value"]}
                />
                <Bar
                  dataKey="value"
                  fill="#EF4444"
                  name="Impact"
                  barSize={60}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Early Departure Table */}
      <Card>
        <CardHeader>
          <CardTitle>Early Departure Report</CardTitle>
          <CardDescription>
            Track early departures to identify patterns and calculate time lost
            for better workforce planning and productivity management.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={EarlyDepartureReportColumns()}
              data={earlyDepartureData.results}
              pagination={true}
              dataTotalSize={earlyDepartureData.count}
              tableOptions={tableOptions}
              fallbackText="No early departure data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
