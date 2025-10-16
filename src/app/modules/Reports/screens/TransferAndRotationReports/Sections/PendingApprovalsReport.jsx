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
import { getPendingTransferApprovalsData } from "app/hooks/reports";
import { PendingTransferApprovalsColumns } from "../TableColumns/TransferRotationTableColumns";

const PendingApprovalsReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [pendingData, setPendingData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");

  // Chart colors
  const typeColors = {
    INTERNAL: "#3B82F6",
    EXTERNAL: "#8B5CF6",
  };

  const approverColors = [
    "#10B981",
    "#3B82F6",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
  ];

  // Fetch pending approvals data
  const fetchPendingData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getPendingTransferApprovalsData(payload);
      if (response) {
        setPendingData(response);
      }
    } catch (error) {
      console.error("Error fetching pending approvals data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchPendingData();
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
    totalPending: pendingData.aggregated_stats?.total_pending || 0,
    internalPending:
      pendingData.aggregated_stats?.by_transfer_type?.INTERNAL || 0,
    externalPending:
      pendingData.aggregated_stats?.by_transfer_type?.EXTERNAL || 0,
    avgPendingDays: pendingData.aggregated_stats?.avg_pending_days || 0,
    uniqueApprovers: Object.keys(
      pendingData.aggregated_stats?.by_approver || {}
    ).length,
  };

  // Prepare chart data
  const typeChartData = React.useMemo(() => {
    if (!pendingData.aggregated_stats?.by_transfer_type) return [];
    return Object.entries(pendingData.aggregated_stats.by_transfer_type).map(
      ([type, count]) => ({
        type,
        count,
        fill: typeColors[type] || "#6B7280",
      })
    );
  }, [pendingData.aggregated_stats]);

  const approverChartData = React.useMemo(() => {
    if (!pendingData.aggregated_stats?.by_approver) return [];
    return Object.entries(pendingData.aggregated_stats.by_approver)
      .sort(([, a], [, b]) => b - a) // Sort by count descending
      .slice(0, 6) // Top 6 approvers
      .map(([approver, count]) => ({
        approver:
          approver === "N/A"
            ? "Not Assigned"
            : approver.length > 15
            ? approver.substring(0, 15) + "..."
            : approver,
        count,
      }));
  }, [pendingData.aggregated_stats]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            title: "Total Pending",
            value: stats.totalPending,
            description: "Awaiting approval",
            color: "text-plum-900",
          },
          {
            title: "Internal Transfers",
            value: stats.internalPending,
            description: "Internal requests",
            color: "text-blue-600",
          },
          {
            title: "External Transfers",
            value: stats.externalPending,
            description: "External requests",
            color: "text-purple-600",
          },
          {
            title: "Avg Pending Days",
            value: Math.round(stats.avgPendingDays),
            description: "Average wait time",
            color: "text-yellow-600",
          },
          {
            title: "Approvers",
            value: stats.uniqueApprovers,
            description: "Unique approvers",
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
        {/* Transfer Type Distribution */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Pending Transfer Types
            </CardTitle>
            <CardDescription>
              Distribution of pending transfer requests by type
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeChartData}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="none"
                >
                  {typeChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} requests`, name]}
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

        {/* Pending Requests by Approver */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Pending Requests by Approver
            </CardTitle>
            <CardDescription>
              Workload distribution among approvers
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={approverChartData}
                margin={{ top: 20, right: 20, left: 0, bottom: 60 }}
              >
                <XAxis
                  dataKey="approver"
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ fontSize: "12px" }}
                  formatter={(value, name) => [`${value} requests`, "Count"]}
                />
                <Bar
                  dataKey="count"
                  fill="#F59E0B"
                  name="Pending Requests"
                  barSize={40}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Pending Transfer Approvals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Transfer Approvals</CardTitle>
          <CardDescription>
            All transfer requests currently awaiting approval with assignee
            details, request dates, and approval workflow status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={PendingTransferApprovalsColumns()}
              data={pendingData.results}
              pagination={true}
              dataTotalSize={pendingData.count}
              tableOptions={tableOptions}
              fallbackText="No pending transfer approvals found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PendingApprovalsReport;
