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
import { getProbationCompletionReportData } from "app/hooks/reports";
import { ProbationCompletionColumns } from "../TableColumns/HiringReportTableColumns";

const ProbationCompletionReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [probationData, setProbationData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");

  // Chart colors
  const statusColors = ["#10B981", "#F59E0B", "#3B82F6"];

  // Fetch probation completion data
  const fetchProbationData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getProbationCompletionReportData(payload);
      if (response) {
        setProbationData(response);
      }
    } catch (error) {
      console.error("Error fetching probation completion data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchProbationData();
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
  const confirmationStatusChartData = React.useMemo(() => {
    if (!probationData.aggregated_stats?.confirmation_status_breakdown)
      return [];

    return Object.entries(
      probationData.aggregated_stats.confirmation_status_breakdown
    )
      .map(([status, count]) => ({
        status,
        count,
        percentage:
          probationData.aggregated_stats.total_employees > 0
            ? Math.round(
                (count / probationData.aggregated_stats.total_employees) * 100
              )
            : 0,
      }))
      .filter((item) => item.count > 0);
  }, [probationData.aggregated_stats]);

  // Calculate stats from aggregated data
  const stats = {
    totalEmployees:
      probationData.aggregated_stats?.total_employees ||
      probationData.count ||
      0,
    confirmedEmployees:
      probationData.aggregated_stats?.confirmation_status_breakdown
        ?.Confirmed || 0,
    pendingEmployees:
      probationData.aggregated_stats?.confirmation_status_breakdown?.Pending ||
      0,
    underReviewEmployees:
      probationData.aggregated_stats?.confirmation_status_breakdown?.[
        "Under Review"
      ] || 0,
    upcomingConfirmations:
      probationData.aggregated_stats?.upcoming_confirmations_30_days || 0,
  };

  return (
    <div className="space-y-6">
      {/* Probation Completion Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Employees",
            value: stats.totalEmployees,
            description: "In probation tracking",
            color: "text-plum-900",
          },
          {
            title: "Confirmed",
            value: stats.confirmedEmployees,
            description: "Probation completed",
            color: "text-green-600",
          },
          {
            title: "Pending Review",
            value: stats.pendingEmployees,
            description: "Awaiting confirmation",
            color: "text-yellow-600",
          },
          {
            title: "Upcoming (30 days)",
            value: stats.upcomingConfirmations,
            description: "Need action soon",
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
        {/* Confirmation Status Distribution */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Confirmation Status Distribution
            </CardTitle>
            <CardDescription>
              Current probation confirmation status breakdown
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={confirmationStatusChartData}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="none"
                >
                  {confirmationStatusChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={statusColors[index % statusColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${value} employees (${
                      confirmationStatusChartData.find((d) => d.status === name)
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

        {/* Probation Status Analysis */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Probation Status Analysis
            </CardTitle>
            <CardDescription>
              Employee count by confirmation status
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={confirmationStatusChartData}
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
                  fill="#A78BFA"
                  name="Employees"
                  barSize={60}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Probation Completion Table */}
      <Card>
        <CardHeader>
          <CardTitle>Probation Completion Report</CardTitle>
          <CardDescription>
            Comprehensive tracking of employee probation periods, confirmation
            status, and upcoming action requirements for HR management and
            performance evaluation processes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={ProbationCompletionColumns()}
              data={probationData.results}
              pagination={true}
              dataTotalSize={probationData.count}
              tableOptions={tableOptions}
              fallbackText="No probation completion data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProbationCompletionReport;
