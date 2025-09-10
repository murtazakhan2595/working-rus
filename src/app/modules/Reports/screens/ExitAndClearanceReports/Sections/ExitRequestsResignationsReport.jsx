// src/app/modules/Reports/screens/ExitAndClearanceReports/Sections/ExitRequestsResignationsReport.jsx

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
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
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
import {
  getResignationReportData,
  getV2ExitRequestReportData,
  exportExitClearanceReport,
} from "app/hooks/reports";
import {
  ResignationReportColumns,
  V2ExitRequestReportColumns,
} from "../TableColumns/ExitClearanceTableColumns";
import { Button } from "components/ui/button";
import { toast } from "react-toastify";

const ExitRequestsResignationsReport = ({
  filterData = {},
  onFilterChange = () => {},
  isReady = true,
}) => {
  const [loading, setLoading] = useState(false);
  const [resignationData, setResignationData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [exitRequestData, setExitRequestData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [activeSubTab, setActiveSubTab] = useState("resignations");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-resignation_date");
  const [isExporting, setIsExporting] = useState(false);

  // Chart colors
  const colors = [
    "#10B981",
    "#3B82F6",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
    "#14B8A6",
  ];

  // Fetch resignation data
  const fetchResignationData = async () => {
    setLoading(true);
    try {
      const payload = { filterData, options, ordering };
      const response = await getResignationReportData(payload);
      if (response) {
        setResignationData(response);
      }
    } catch (error) {
      console.error("Error fetching resignation data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch exit request data
  const fetchExitRequestData = async () => {
    setLoading(true);
    try {
      const payload = { filterData, options, ordering: "-notice_start" };
      const response = await getV2ExitRequestReportData(payload);
      if (response) {
        setExitRequestData(response);
      }
    } catch (error) {
      console.error("Error fetching exit request data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isReady) {
      // Always fetch both datasets so we have complete data for all charts and stats
      fetchResignationData();
      fetchExitRequestData();
    }
  }, [filterData, isReady]);

  // Separate effect for pagination/ordering changes - only affects the active tab's table
  useEffect(() => {
    if (isReady) {
      if (activeSubTab === "resignations") {
        fetchResignationData();
      } else {
        fetchExitRequestData();
      }
    }
  }, [options, ordering, activeSubTab]);

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

  // Calculate resignation statistics from aggregated_stats
  const resignationStats = React.useMemo(() => {
    if (!resignationData.aggregated_stats) {
      return {
        totalResignations: resignationData.count || 0,
        approved: 0,
        pending: 0,
        completed: 0,
        inProgress: 0,
      };
    }

    const stats = resignationData.aggregated_stats;
    const result = {
      totalResignations: stats.total_resignations || 0,
      approved: stats.status_breakdown?.APPROVED || 0,
      pending: stats.status_breakdown?.PENDING || 0,
      completed: stats.status_breakdown?.COMPLETED || 0,
      inProgress: stats.status_breakdown?.["IN PROGRESS"] || 0,
    };
    return result;
  }, [resignationData]);

  // Calculate exit request statistics from aggregated_stats
  const exitRequestStats = React.useMemo(() => {
    if (!exitRequestData.aggregated_stats) {
      return {
        totalExitRequests: exitRequestData.count || 0,
        voluntaryResignation: 0,
        retirement: 0,
        termination: 0,
        others: 0,
      };
    }

    const stats = exitRequestData.aggregated_stats;
    const result = {
      totalExitRequests: stats.total_exits || 0,
      voluntaryResignation: stats.exit_type_breakdown?.voluntary || 0,
      retirement: stats.exit_type_breakdown?.retirement || 0,
      termination: stats.exit_type_breakdown?.termination || 0,
      others: stats.exit_type_breakdown?.others || 0,
    };
    return result;
  }, [exitRequestData]);

  // Prepare resignation reasons chart data from aggregated_stats
  const resignationReasonsData = React.useMemo(() => {
    if (!resignationData.aggregated_stats?.reason_breakdown) {
      return [];
    }

    const result = Object.entries(
      resignationData.aggregated_stats.reason_breakdown
    ).map(([reason, count]) => ({
      reason,
      count,
      percentage: Math.round(
        (count / resignationStats.totalResignations) * 100
      ),
    }));
    return result;
  }, [resignationData.aggregated_stats, resignationStats.totalResignations]);

  // Prepare exit types chart data from aggregated_stats
  const exitTypesData = React.useMemo(() => {
    if (!exitRequestData.aggregated_stats?.exit_type_breakdown) {
      return [];
    }

    const typeMapping = {
      voluntary: "Voluntary Resignation",
      retirement: "Retirement",
      termination: "Termination",
      others: "Others",
    };

    const result = Object.entries(
      exitRequestData.aggregated_stats.exit_type_breakdown
    )
      .map(([type, count]) => ({
        type: typeMapping[type] || type,
        count,
      }))
      .filter((item) => item.count > 0);
    return result;
  }, [exitRequestData.aggregated_stats]);

  // Prepare nationality distribution from aggregated_stats
  const nationalityData = React.useMemo(() => {
    if (!exitRequestData.aggregated_stats?.nationality_breakdown) {
      return [];
    }

    const result = Object.entries(
      exitRequestData.aggregated_stats.nationality_breakdown
    )
      .map(([nationality, count]) => ({
        nationality,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8); // Top 8 nationalities
    return result;
  }, [exitRequestData.aggregated_stats]);

  // Export specific table
  const handleExportTable = async (type) => {
    setIsExporting(true);
    try {
      const success = await exportExitClearanceReport(type, filterData);
      if (success) {
        toast.success("Report exported successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export report", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Get stats config based on active tab
  const getStatsConfig = () => {
    if (activeSubTab === "resignations") {
      return [
        {
          title: "Total Resignations",
          value: resignationStats.totalResignations,
          description: "Resignation requests",
          color: "text-blue-600",
        },
        {
          title: "Approved Resignations",
          value: resignationStats.approved,
          description: "Approval status",
          color: "text-green-600",
        },
        {
          title: "Pending Resignations",
          value: resignationStats.pending,
          description: "Awaiting approval",
          color: "text-yellow-600",
        },
        {
          title: "Completed Resignations",
          value: resignationStats.completed,
          description: "Process completed",
          color: "text-purple-600",
        },
      ];
    } else {
      return [
        {
          title: "Total Exit Requests",
          value: exitRequestStats.totalExitRequests,
          description: "All exit requests",
          color: "text-purple-600",
        },
        {
          title: "Voluntary Resignations",
          value: exitRequestStats.voluntaryResignation,
          description: "Employee initiated",
          color: "text-blue-600",
        },
        {
          title: "Retirements",
          value: exitRequestStats.retirement,
          description: "Retirement exits",
          color: "text-green-600",
        },
        {
          title: "Others",
          value: exitRequestStats.others,
          description: "Other exit types",
          color: "text-yellow-600",
        },
      ];
    }
  };

  if (!isReady) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Exit Requests & Resignations</CardTitle>
          <CardDescription>
            API development in progress. This section will show employee exit
            requests and resignation tracking.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10">
            <p className="text-gray-500">API implementation in progress...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats Cards - Fixed mapping issue */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {getStatsConfig().map((stat, index) => (
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

      {/* Charts Row - Dynamic based on active tab */}
      {activeSubTab === "resignations" ? (
        // Resignation Charts
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Resignation Reasons */}
          {resignationReasonsData.length > 0 && (
            <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-plum-900">
                  Resignation Reasons
                </CardTitle>
                <CardDescription>
                  Distribution of resignation reasons
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center items-center h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={resignationReasonsData}
                      dataKey="count"
                      nameKey="reason"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      paddingAngle={2}
                      stroke="none"
                    >
                      {resignationReasonsData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={colors[index % colors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${value} employees`, name]}
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
          )}

          {/* Resignation Department Distribution */}
          {resignationData.aggregated_stats?.department_breakdown && (
            <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-plum-900">
                  Resignations by Department
                </CardTitle>
                <CardDescription>
                  Department-wise resignation distribution
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={Object.entries(
                      resignationData.aggregated_stats.department_breakdown
                    ).map(([dept, count]) => ({
                      department: dept,
                      count,
                    }))}
                    margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
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
                      formatter={(value, name) => [
                        `${value} resignations`,
                        "Count",
                      ]}
                    />
                    <Bar
                      dataKey="count"
                      fill="#3B82F6"
                      name="Resignations"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        // Exit Request Charts
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Exit Types Distribution */}
          {exitTypesData.length > 0 && (
            <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-plum-900">
                  Exit Types Distribution
                </CardTitle>
                <CardDescription>Types of employee exits</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center items-center h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={exitTypesData}
                      dataKey="count"
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      paddingAngle={2}
                      stroke="none"
                    >
                      {exitTypesData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={colors[index % colors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${value} employees`, name]}
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
          )}

          {/* Nationality Distribution */}
          {nationalityData.length > 0 && (
            <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-plum-900">
                  Exit by Nationality
                </CardTitle>
                <CardDescription>
                  Top nationalities in exit requests
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={nationalityData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
                  >
                    <XAxis
                      dataKey="nationality"
                      tick={{ fontSize: 11 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ fontSize: "12px" }}
                      formatter={(value, name) => [
                        `${value} employees`,
                        "Count",
                      ]}
                    />
                    <Bar
                      dataKey="count"
                      fill="#3B82F6"
                      name="Employees"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Exit Request Department Distribution */}
          {exitRequestData.aggregated_stats?.department_breakdown && (
            <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-plum-900">
                  Exits by Department
                </CardTitle>
                <CardDescription>
                  Department-wise exit distribution
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={Object.entries(
                      exitRequestData.aggregated_stats.department_breakdown
                    ).map(([dept, count]) => ({
                      department: dept,
                      count,
                    }))}
                    margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
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
                      formatter={(value, name) => [`${value} exits`, "Count"]}
                    />
                    <Bar
                      dataKey="count"
                      fill="#10B981"
                      name="Exit Requests"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Tables Section */}
      <Card>
        <CardHeader>
          <CardTitle>Exit Requests & Resignations Data</CardTitle>
          <CardDescription>
            Detailed tracking of employee resignations and exit requests with
            individual export options.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
            <div className="flex justify-between items-center mb-6">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="resignations">Resignations</TabsTrigger>
                <TabsTrigger value="exit_requests">Exit Requests</TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                <Button
                  onClick={() =>
                    handleExportTable(
                      activeSubTab === "resignations"
                        ? "resignation_report"
                        : "v2_exit_request_report"
                    )
                  }
                  disabled={isExporting}
                  variant="outline"
                  size="sm"
                >
                  {isExporting
                    ? "Exporting..."
                    : `Export ${
                        activeSubTab === "resignations"
                          ? "Resignations"
                          : "Exit Requests"
                      }`}
                </Button>
              </div>
            </div>

            <TabsContent value="resignations">
              {loading ? (
                <PageLoader />
              ) : (
                <TableCustom
                  columns={ResignationReportColumns()}
                  data={resignationData.results}
                  pagination={true}
                  dataTotalSize={resignationData.count}
                  tableOptions={tableOptions}
                  fallbackText="No resignation data found matching the current filters"
                />
              )}
            </TabsContent>

            <TabsContent value="exit_requests">
              {loading ? (
                <PageLoader />
              ) : (
                <TableCustom
                  columns={V2ExitRequestReportColumns()}
                  data={exitRequestData.results}
                  pagination={true}
                  dataTotalSize={exitRequestData.count}
                  tableOptions={tableOptions}
                  fallbackText="No exit request data found matching the current filters"
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExitRequestsResignationsReport;
