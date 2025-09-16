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
  LineChart,
  Line,
} from "recharts";
import { getTransferReportData } from "app/hooks/reports";
import { TransferReportColumns } from "../TableColumns/TransferRotationTableColumns";

const TransferReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [transferData, setTransferData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");

  // Chart colors
  const statusColors = {
    Pending: "#F59E0B",
    Approved: "#10B981",
    Rejected: "#EF4444",
  };

  const typeColors = {
    Internal: "#3B82F6",
    External: "#8B5CF6",
  };

  // Fetch transfer data
  const fetchTransferData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getTransferReportData(payload);
      if (response) {
        setTransferData(response);
      }
    } catch (error) {
      console.error("Error fetching transfer data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchTransferData();
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
    totalTransfers: transferData.aggregated_stats?.total_transfers || 0,
    pendingTransfers: transferData.aggregated_stats?.by_status?.Pending || 0,
    approvedTransfers: transferData.aggregated_stats?.by_status?.Approved || 0,
    rejectedTransfers: transferData.aggregated_stats?.by_status?.Rejected || 0,
    internalTransfers: transferData.aggregated_stats?.by_type?.Internal || 0,
    externalTransfers: transferData.aggregated_stats?.by_type?.External || 0,
  };

  // Prepare chart data
  const statusChartData = React.useMemo(() => {
    if (!transferData.aggregated_stats?.by_status) return [];
    return Object.entries(transferData.aggregated_stats.by_status).map(
      ([status, count]) => ({
        status,
        count,
        fill: statusColors[status] || "#6B7280",
      })
    );
  }, [transferData.aggregated_stats]);

  const typeChartData = React.useMemo(() => {
    if (!transferData.aggregated_stats?.by_type) return [];
    return Object.entries(transferData.aggregated_stats.by_type).map(
      ([type, count]) => ({
        type,
        count,
        fill: typeColors[type] || "#6B7280",
      })
    );
  }, [transferData.aggregated_stats]);

  const monthlyTrendData = React.useMemo(() => {
    if (!transferData.aggregated_stats?.by_month) return [];
    return Object.entries(transferData.aggregated_stats.by_month).map(
      ([month, count]) => ({
        month: month.replace("2025-", ""), // Shorten month display
        count,
      })
    );
  }, [transferData.aggregated_stats]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          {
            title: "Total Transfers",
            value: stats.totalTransfers,
            description: "All transfer requests",
            color: "text-plum-900",
          },
          {
            title: "Pending",
            value: stats.pendingTransfers,
            description: "Awaiting approval",
            color: "text-yellow-600",
          },
          {
            title: "Approved",
            value: stats.approvedTransfers,
            description: "Successfully approved",
            color: "text-green-600",
          },
          {
            title: "Rejected",
            value: stats.rejectedTransfers,
            description: "Declined requests",
            color: "text-red-600",
          },
          {
            title: "Internal",
            value: stats.internalTransfers,
            description: "Within organization",
            color: "text-blue-600",
          },
          {
            title: "External",
            value: stats.externalTransfers,
            description: "Outside organization",
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Transfer Status Distribution */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Transfer Status Distribution
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
                  formatter={(value, name) => [`${value} transfers`, name]}
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

        {/* Transfer Type Distribution */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Transfer Type Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={typeChartData}
                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
              >
                <XAxis dataKey="type" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ fontSize: "12px" }}
                  formatter={(value, name) => [`${value} transfers`, "Count"]}
                />
                <Bar
                  dataKey="count"
                  fill="#3B82F6"
                  name="Transfers"
                  barSize={60}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Transfer Trends */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Monthly Transfer Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyTrendData}
                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
              >
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ fontSize: "12px" }}
                  formatter={(value, name) => [`${value} transfers`, "Count"]}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Transfer Report Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transfer Report</CardTitle>
          <CardDescription>
            Complete listing of all employee transfers including internal and
            external movements with status tracking and approval workflows.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={TransferReportColumns()}
              data={transferData.results}
              pagination={true}
              dataTotalSize={transferData.count}
              tableOptions={tableOptions}
              fallbackText="No transfer data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransferReport;
