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
  ComposedChart,
} from "recharts";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import {
  getTransferRotationDashboardData,
  getCrossDepartmentTransferData,
  getTransferRejectionData,
  getTransferApprovalTimelineData,
} from "app/hooks/reports";
import {
  CrossDepartmentTransferColumns,
  TransferRejectionColumns,
  TransferApprovalTimelineColumns,
} from "../TableColumns/TransferRotationTableColumns";

const TransferAnalyticsReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState([]);
  const [crossDeptData, setCrossDeptData] = useState({ results: [], count: 0 });
  const [rejectionData, setRejectionData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [timelineData, setTimelineData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [activeSubTab, setActiveSubTab] = useState("overview");

  // Chart colors
  const statusColors = [
    "#10B981",
    "#3B82F6",
    "#EF4444",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
  ];

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };

      const [
        dashboardResponse,
        crossDeptResponse,
        rejectionResponse,
        timelineResponse,
      ] = await Promise.all([
        getTransferRotationDashboardData(combinedFilters),
        getCrossDepartmentTransferData({ filterData: combinedFilters }),
        getTransferRejectionData({ filterData: combinedFilters }),
        getTransferApprovalTimelineData({ filterData: combinedFilters }),
      ]);

      if (dashboardResponse) {
        setDashboardData(dashboardResponse);
      }

      if (crossDeptResponse) {
        setCrossDeptData(crossDeptResponse);
      }

      if (rejectionResponse) {
        setRejectionData(rejectionResponse);
      }

      if (timelineResponse) {
        setTimelineData(timelineResponse);
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchAnalyticsData();
    }
  }, [filterData, permittedViewFilterData]);

  // Transform dashboard data for display
  const dashboardStats = React.useMemo(() => {
    const statsMap = {};
    dashboardData.forEach((item) => {
      statsMap[item.metric] = item.value;
    });
    return statsMap;
  }, [dashboardData]);

  // Prepare chart data for dashboard metrics
  const dashboardChartData = React.useMemo(() => {
    return dashboardData.map((item, index) => ({
      metric: item.metric.replace(" ", "\n"), // Break long labels
      value: item.value,
      fill: statusColors[index % statusColors.length],
    }));
  }, [dashboardData]);

  // Prepare cross-department flow data
  const departmentFlowData = React.useMemo(() => {
    const flowMap = {};
    crossDeptData.results.forEach((item) => {
      const key = `${item.from_department} → ${item.to_department}`;
      flowMap[key] = (flowMap[key] || 0) + item.total_transfers;
    });

    return Object.entries(flowMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8) // Top 8 flows
      .map(([flow, count]) => ({
        flow: flow.length > 25 ? flow.substring(0, 25) + "..." : flow,
        count,
      }));
  }, [crossDeptData.results]);

  // Prepare rejection reasons data
  const rejectionReasonsData = React.useMemo(() => {
    if (!rejectionData.aggregated_stats?.by_reason) return [];
    return Object.entries(rejectionData.aggregated_stats.by_reason).map(
      ([reason, count], index) => ({
        reason: reason === "N/A" ? "Not Specified" : reason,
        count,
        fill: statusColors[index % statusColors.length],
      })
    );
  }, [rejectionData.aggregated_stats]);

  // Prepare approval timeline data
  const approvalTimelineData = React.useMemo(() => {
    if (!timelineData.aggregated_stats?.by_month) return [];
    return Object.entries(timelineData.aggregated_stats.by_month).map(
      ([month, count]) => ({
        month: month.replace("2025-", ""), // Shorten month display
        approvals: count,
        avgDays: timelineData.aggregated_stats?.avg_approval_days || 0,
      })
    );
  }, [timelineData.aggregated_stats]);

  return (
    <div className="space-y-6">
      {/* Dashboard Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
        {[
          {
            title: "Transfer Requests",
            value: dashboardStats["Total Transfer Requests"] || 0,
            description: "All requests",
            color: "text-plum-900",
          },
          {
            title: "Approved",
            value: dashboardStats["Approved Transfers"] || 0,
            description: "Successfully approved",
            color: "text-green-600",
          },
          {
            title: "Rejected",
            value: dashboardStats["Rejected Transfers"] || 0,
            description: "Declined requests",
            color: "text-red-600",
          },
          {
            title: "Pending",
            value: dashboardStats["Pending Transfers"] || 0,
            description: "Awaiting decision",
            color: "text-yellow-600",
          },
          {
            title: "Job Rotations",
            value: dashboardStats["Total Job Rotations"] || 0,
            description: "Role rotations",
            color: "text-blue-600",
          },
          {
            title: "Skill Gaps",
            value: dashboardStats["Rotation Skill Gaps"] || 0,
            description: "Training needed",
            color: "text-orange-600",
          },
          {
            title: "Compliance Issues",
            value: dashboardStats["Compliance Issues Reported"] || 0,
            description: "Policy violations",
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

      {/* Main Dashboard Chart */}
      <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-plum-900">
            Transfer & Rotation Dashboard Overview
          </CardTitle>
          <CardDescription>
            Key metrics for transfer and rotation management
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dashboardChartData}
              margin={{ top: 20, right: 20, left: 0, bottom: 60 }}
            >
              <XAxis
                dataKey="metric"
                tick={{ fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ fontSize: "12px" }}
                formatter={(value, name) => [`${value}`, "Count"]}
              />
              <Bar
                dataKey="value"
                fill="#3B82F6"
                name="Count"
                barSize={40}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Secondary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Department Transfer Flow */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Cross-Department Transfer Flow
            </CardTitle>
            <CardDescription>
              Top department-to-department movements
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={departmentFlowData}
                margin={{ top: 20, right: 20, left: 0, bottom: 100 }}
              >
                <XAxis
                  dataKey="flow"
                  tick={{ fontSize: 9 }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ fontSize: "12px" }}
                  formatter={(value, name) => [`${value} transfers`, "Count"]}
                />
                <Bar
                  dataKey="count"
                  fill="#10B981"
                  name="Transfers"
                  barSize={30}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Rejection Reasons */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Transfer Rejection Reasons
            </CardTitle>
            <CardDescription>
              Analysis of why transfers are rejected
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-80">
            {rejectionReasonsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={rejectionReasonsData}
                    dataKey="count"
                    nameKey="reason"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {rejectionReasonsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} rejections`, name]}
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
                  <p className="text-lg font-medium">No Rejection Data</p>
                  <p className="text-sm">
                    Rejection analysis will appear when rejections are recorded
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Analytics</CardTitle>
          <CardDescription>
            In-depth analysis of transfer patterns, timelines, and
            organizational movement trends.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="overview">Cross-Department Flow</TabsTrigger>
              <TabsTrigger value="rejections">Rejection Analysis</TabsTrigger>
              <TabsTrigger value="timeline">Approval Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="space-y-4">
                <div className="text-sm text-neutral-600 mb-4">
                  Department-to-department transfer patterns and movement trends
                  across the organization.
                </div>
                {loading ? (
                  <PageLoader />
                ) : (
                  <TableCustom
                    columns={CrossDepartmentTransferColumns()}
                    data={crossDeptData.results}
                    pagination={false}
                    fallbackText="No cross-department transfer data available"
                  />
                )}
              </div>
            </TabsContent>

            <TabsContent value="rejections">
              <div className="space-y-4">
                <div className="text-sm text-neutral-600 mb-4">
                  Analysis of rejected transfer requests including reasons and
                  patterns for process improvement.
                </div>
                {loading ? (
                  <PageLoader />
                ) : (
                  <TableCustom
                    columns={TransferRejectionColumns()}
                    data={rejectionData.results}
                    pagination={false}
                    fallbackText="No rejection data found - this indicates good approval rates!"
                  />
                )}
              </div>
            </TabsContent>

            <TabsContent value="timeline">
              <div className="space-y-4">
                <div className="text-sm text-neutral-600 mb-4">
                  Transfer approval timeline analysis showing processing
                  efficiency and bottlenecks.
                </div>

                {/* Approval Timeline Chart */}
                {approvalTimelineData.length > 0 && (
                  <Card className="mb-4">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Monthly Approval Trends
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={approvalTimelineData}>
                          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip contentStyle={{ fontSize: "12px" }} />
                          <Bar
                            dataKey="approvals"
                            fill="#10B981"
                            name="Approvals"
                          />
                          <Line
                            type="monotone"
                            dataKey="avgDays"
                            stroke="#EF4444"
                            strokeWidth={2}
                            name="Avg Days"
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}

                {loading ? (
                  <PageLoader />
                ) : (
                  <TableCustom
                    columns={TransferApprovalTimelineColumns()}
                    data={timelineData.results}
                    pagination={false}
                    fallbackText="No approval timeline data available"
                  />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransferAnalyticsReport;
