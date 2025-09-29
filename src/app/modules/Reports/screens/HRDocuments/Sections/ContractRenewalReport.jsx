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
import { getContractRenewalData } from "app/hooks/reports";
import { ContractRenewalColumns } from "../TableColumns/HRDocumentTableColumns";

const ContractRenewalReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [contractData, setContractData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");

  // Chart colors
  const statusColors = ["#10B981", "#EF4444", "#F59E0B"];
  const contractColors = [
    "#3B82F6",
    "#8B5CF6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
  ];

  // Fetch contract renewal data
  const fetchContractData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getContractRenewalData(payload);
      if (response) {
        setContractData(response);
      }
    } catch (error) {
      console.error("Error fetching contract renewal data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchContractData();
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
  const renewalStatusChartData = React.useMemo(() => {
    if (!contractData.aggregated_stats?.renewal_status_breakdown) return [];

    return Object.entries(
      contractData.aggregated_stats.renewal_status_breakdown
    )
      .map(([status, count]) => ({
        status,
        count,
        percentage:
          contractData.aggregated_stats.total_contracts > 0
            ? Math.round(
                (count / contractData.aggregated_stats.total_contracts) * 100
              )
            : 0,
      }))
      .filter((item) => item.count > 0);
  }, [contractData.aggregated_stats]);

  // Contract type chart data
  const contractTypeChartData = React.useMemo(() => {
    if (!contractData.aggregated_stats?.contract_type_breakdown) return [];

    return Object.entries(contractData.aggregated_stats.contract_type_breakdown)
      .map(([type, count]) => ({
        type,
        count,
      }))
      .filter((item) => item.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 6); // Top 6 contract types
  }, [contractData.aggregated_stats]);

  // Calculate stats from aggregated data
  const stats = {
    totalContracts:
      contractData.aggregated_stats?.total_contracts || contractData.count || 0,
    activeContracts:
      contractData.aggregated_stats?.renewal_status_breakdown?.Active || 0,
    expiredContracts:
      contractData.aggregated_stats?.renewal_status_breakdown?.Expired || 0,
    upcomingRenewals:
      contractData.aggregated_stats?.renewal_status_breakdown?.Upcoming || 0,
    expiringIn30Days:
      contractData.aggregated_stats?.renewal_timeline?.expiring_in_30_days || 0,
  };

  return (
    <div className="space-y-6">
      {/* Contract Renewal Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            title: "Total Contracts",
            value: stats.totalContracts,
            description: "All tracked contracts",
            color: "text-plum-900",
          },
          {
            title: "Active Contracts",
            value: stats.activeContracts,
            description: "Currently valid",
            color: "text-green-600",
          },
          {
            title: "Expired Contracts",
            value: stats.expiredContracts,
            description: "Need renewal",
            color: "text-red-600",
          },
          {
            title: "Upcoming Renewals",
            value: stats.upcomingRenewals,
            description: "Require attention",
            color: "text-yellow-600",
          },
          {
            title: "Critical (30 days)",
            value: stats.expiringIn30Days,
            description: "Urgent action needed",
            color: "text-red-800",
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
        {/* Renewal Status Distribution */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Contract Renewal Status
            </CardTitle>
            <CardDescription>
              Current renewal status of all contracts
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={renewalStatusChartData}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="none"
                >
                  {renewalStatusChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={statusColors[index % statusColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${value} contracts (${
                      renewalStatusChartData.find((d) => d.status === name)
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

        {/* Contract Type Breakdown */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Contract Type Distribution
            </CardTitle>
            <CardDescription>Distribution of contracts by type</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={contractTypeChartData}
                margin={{ top: 20, right: 20, left: 0, bottom: 40 }}
              >
                <XAxis
                  dataKey="type"
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={40}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ fontSize: "12px" }}
                  formatter={(value) => [`${value} contracts`, "Count"]}
                />
                <Bar
                  dataKey="count"
                  fill="#8B5CF6"
                  name="Contracts"
                  barSize={40}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Contract Renewal Table */}
      <Card>
        <CardHeader>
          <CardTitle>Contract Renewal Report</CardTitle>
          <CardDescription>
            Comprehensive tracking of employee contract renewals including
            upcoming renewal dates, expired contracts, and contract types for
            proactive HR management and compliance with employment regulations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={ContractRenewalColumns()}
              data={contractData.results}
              pagination={true}
              dataTotalSize={contractData.count}
              tableOptions={tableOptions}
              fallbackText="No contract renewal data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractRenewalReport;
