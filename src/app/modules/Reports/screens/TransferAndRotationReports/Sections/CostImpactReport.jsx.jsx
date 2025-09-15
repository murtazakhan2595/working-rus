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
import { getTransferCostImpactData } from "app/hooks/reports";
import { TransferCostImpactColumns } from "../TableColumns/TransferRotationTableColumns";

const CostImpactReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [costData, setCostData] = useState({
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
    Rotation: "#10B981",
  };

  const costBreakdownColors = ["#10B981", "#3B82F6", "#F59E0B"];

  // Fetch cost impact data
  const fetchCostData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getTransferCostImpactData(payload);
      if (response) {
        setCostData(response);
      }
    } catch (error) {
      console.error("Error fetching cost impact data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchCostData();
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
    totalCost: costData.aggregated_stats?.total_cost || 0,
    avgCost: costData.aggregated_stats?.avg_cost || 0,
    relocationCost:
      costData.aggregated_stats?.cost_breakdown?.relocation_cost || 0,
    trainingCost: costData.aggregated_stats?.cost_breakdown?.training_cost || 0,
    onboardingCost:
      costData.aggregated_stats?.cost_breakdown?.onboarding_cost || 0,
    transferCount: costData.count || 0,
  };

  // Prepare chart data
  const typeChartData = React.useMemo(() => {
    if (!costData.aggregated_stats?.by_transfer_type) return [];
    return Object.entries(costData.aggregated_stats.by_transfer_type).map(
      ([type, cost]) => ({
        type:
          type === "INTERNAL"
            ? "Internal"
            : type === "EXTERNAL"
            ? "External"
            : type,
        cost,
        fill: typeColors[type] || "#6B7280",
      })
    );
  }, [costData.aggregated_stats]);

  const costBreakdownData = React.useMemo(() => {
    if (!costData.aggregated_stats?.cost_breakdown) return [];

    const breakdown = costData.aggregated_stats.cost_breakdown;
    return [
      {
        category: "Relocation",
        cost: breakdown.relocation_cost || 0,
        fill: costBreakdownColors[0],
      },
      {
        category: "Training",
        cost: breakdown.training_cost || 0,
        fill: costBreakdownColors[1],
      },
      {
        category: "Onboarding",
        cost: breakdown.onboarding_cost || 0,
        fill: costBreakdownColors[2],
      },
    ].filter((item) => item.cost > 0); // Only show categories with costs
  }, [costData.aggregated_stats]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          {
            title: "Total Cost",
            value: `$${stats.totalCost.toLocaleString()}`,
            description: "All transfer costs",
            color: "text-plum-900",
          },
          {
            title: "Average Cost",
            value: `$${stats.avgCost.toLocaleString()}`,
            description: "Per transfer",
            color: "text-blue-600",
          },
          {
            title: "Relocation Cost",
            value: `$${stats.relocationCost.toLocaleString()}`,
            description: "Moving expenses",
            color: "text-green-600",
          },
          {
            title: "Training Cost",
            value: `$${stats.trainingCost.toLocaleString()}`,
            description: "Skill development",
            color: "text-orange-600",
          },
          {
            title: "Onboarding Cost",
            value: `$${stats.onboardingCost.toLocaleString()}`,
            description: "Setup and orientation",
            color: "text-purple-600",
          },
          {
            title: "Transfers",
            value: stats.transferCount,
            description: "Total transfers",
            color: "text-neutral-600",
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
        {/* Cost by Transfer Type */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Cost by Transfer Type
            </CardTitle>
            <CardDescription>Transfer costs breakdown by type</CardDescription>
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
                  formatter={(value, name) => [
                    `$${value.toLocaleString()}`,
                    "Cost",
                  ]}
                />
                <Bar
                  dataKey="cost"
                  fill="#3B82F6"
                  name="Cost"
                  barSize={60}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cost Breakdown */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Cost Breakdown
            </CardTitle>
            <CardDescription>
              Distribution of transfer costs by category
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-80">
            {costBreakdownData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={costBreakdownData}
                    dataKey="cost"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {costBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      `$${value.toLocaleString()}`,
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
            ) : (
              <div className="flex items-center justify-center h-full text-neutral-500">
                <div className="text-center">
                  <p className="text-lg font-medium">No Cost Data Available</p>
                  <p className="text-sm">
                    Cost information will appear when transfers have associated
                    costs
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Transfer Cost Impact Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transfer Cost Impact Report</CardTitle>
          <CardDescription>
            Detailed analysis of transfer costs including relocation, training,
            and onboarding expenses for budgeting and financial planning
            purposes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={TransferCostImpactColumns()}
              data={costData.results}
              pagination={true}
              dataTotalSize={costData.count}
              tableOptions={tableOptions}
              fallbackText="No cost impact data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CostImpactReport;
