// src/app/modules/Reports/screens/ExitAndClearanceReports/Sections/ExitProcessingComplianceReport.jsx

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
  getNoticePeriodComplianceData,
  getExitInterviewReportData,
  getV2ClearancePendingReportData,
  exportExitClearanceReport,
} from "app/hooks/reports";
import {
  NoticePeriodComplianceColumns,
  ExitInterviewReportColumns,
  ClearancePendingReportColumns,
} from "../TableColumns/ExitClearanceTableColumns";
import { Button } from "components/ui/button";
import { toast } from "react-toastify";

const ExitProcessingComplianceReport = ({
  filterData = {},
  onFilterChange = () => {},
  isReady = true,
}) => {
  const [loading, setLoading] = useState(false);
  const [noticePeriodData, setNoticePeriodData] = useState({
    results: [],
    count: 0,
  });
  const [exitInterviewData, setExitInterviewData] = useState({
    results: [],
    count: 0,
  });
  const [clearanceData, setClearanceData] = useState({
    results: [],
    count: 0,
  });
  const [activeSubTab, setActiveSubTab] = useState("notice_compliance");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  // Chart colors
  const colors = ["#10B981", "#EF4444", "#F59E0B", "#3B82F6"];

  // Fetch notice period compliance data
  const fetchNoticePeriodData = async () => {
    setLoading(true);
    try {
      const payload = { filterData, options, ordering };
      const response = await getNoticePeriodComplianceData(payload);
      if (response) {
        setNoticePeriodData(response);
      }
    } catch (error) {
      console.error("Error fetching notice period data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch exit interview data
  const fetchExitInterviewData = async () => {
    setLoading(true);
    try {
      const payload = { filterData, options, ordering };
      const response = await getExitInterviewReportData(payload);
      if (response) {
        setExitInterviewData(response);
      }
    } catch (error) {
      console.error("Error fetching exit interview data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch clearance pending data
  const fetchClearanceData = async () => {
    setLoading(true);
    try {
      const payload = { filterData, options, ordering };
      const response = await getV2ClearancePendingReportData(payload);
      if (response) {
        setClearanceData(response);
      }
    } catch (error) {
      console.error("Error fetching clearance data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isReady) {
      if (activeSubTab === "notice_compliance") {
        fetchNoticePeriodData();
      } else if (activeSubTab === "exit_interviews") {
        fetchExitInterviewData();
      } else if (activeSubTab === "clearance_pending") {
        fetchClearanceData();
      }
    }
  }, [filterData, isReady, activeSubTab, options, ordering]);

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

  // Calculate notice period stats
  const noticePeriodStats = React.useMemo(() => {
    if (!noticePeriodData.results || noticePeriodData.results.length === 0) {
      return {
        totalEmployees: 0,
        compliant: 0,
        nonCompliant: 0,
        notApplicable: 0,
      };
    }

    const stats = noticePeriodData.results.reduce(
      (acc, item) => {
        if (item.compliance_status === "Compliant") acc.compliant++;
        else if (item.compliance_status === "Non-Compliant") acc.nonCompliant++;
        else acc.notApplicable++;
        return acc;
      },
      { compliant: 0, nonCompliant: 0, notApplicable: 0 }
    );

    return {
      totalEmployees: noticePeriodData.count || 0,
      ...stats,
    };
  }, [noticePeriodData]);

  // Calculate exit interview stats
  const exitInterviewStats = React.useMemo(() => {
    if (!exitInterviewData.results || exitInterviewData.results.length === 0) {
      return {
        totalInterviews: 0,
        rehireEligible: 0,
        notEligible: 0,
      };
    }

    const stats = exitInterviewData.results.reduce(
      (acc, item) => {
        if (item.rehire_eligible === "Yes") acc.rehireEligible++;
        else acc.notEligible++;
        return acc;
      },
      { rehireEligible: 0, notEligible: 0 }
    );

    return {
      totalInterviews: exitInterviewData.count || 0,
      ...stats,
    };
  }, [exitInterviewData]);

  // Calculate clearance stats
  const clearanceStats = React.useMemo(() => {
    if (!clearanceData.results || clearanceData.results.length === 0) {
      return {
        totalClearances: 0,
        payrollCompleted: 0,
        payrollPending: 0,
        assetsCompleted: 0,
        assetsPending: 0,
        hrDocsCompleted: 0,
        hrDocsPending: 0,
      };
    }

    const stats = clearanceData.results.reduce(
      (acc, item) => {
        if (item.payroll === "Completed") acc.payrollCompleted++;
        else acc.payrollPending++;

        if (item.assets === "Completed") acc.assetsCompleted++;
        else acc.assetsPending++;

        if (item.hr_docs === "Completed") acc.hrDocsCompleted++;
        else acc.hrDocsPending++;

        return acc;
      },
      {
        payrollCompleted: 0,
        payrollPending: 0,
        assetsCompleted: 0,
        assetsPending: 0,
        hrDocsCompleted: 0,
        hrDocsPending: 0,
      }
    );

    return {
      totalClearances: clearanceData.count || 0,
      ...stats,
    };
  }, [clearanceData]);

  // Prepare compliance chart data
  const complianceChartData = React.useMemo(() => {
    return [
      { status: "Compliant", count: noticePeriodStats.compliant },
      { status: "Non-Compliant", count: noticePeriodStats.nonCompliant },
      { status: "N/A", count: noticePeriodStats.notApplicable },
    ].filter((item) => item.count > 0);
  }, [noticePeriodStats]);

  // Prepare exit type distribution from notice period data
  const exitTypeData = React.useMemo(() => {
    if (!noticePeriodData.results || noticePeriodData.results.length === 0)
      return [];

    const exitTypeMap = {};
    noticePeriodData.results.forEach((item) => {
      const exitType = item.exit_type || "Unknown";
      exitTypeMap[exitType] = (exitTypeMap[exitType] || 0) + 1;
    });

    return Object.entries(exitTypeMap).map(([type, count]) => ({
      type,
      count,
    }));
  }, [noticePeriodData.results]);

  // Prepare clearance status distribution
  const clearanceStatusData = React.useMemo(() => {
    if (!clearanceData.results || clearanceData.results.length === 0) return [];

    const statusMap = { completed: 0, pending: 0 };
    clearanceData.results.forEach((item) => {
      // Check if all three areas are completed
      if (
        item.payroll === "Completed" &&
        item.assets === "Completed" &&
        item.hr_docs === "Completed"
      ) {
        statusMap.completed++;
      } else {
        statusMap.pending++;
      }
    });

    return [
      { status: "Fully Cleared", count: statusMap.completed },
      { status: "Pending Items", count: statusMap.pending },
    ].filter((item) => item.count > 0);
  }, [clearanceData.results]);

  // Prepare clearance breakdown data
  const clearanceBreakdownData = React.useMemo(() => {
    return [
      {
        category: "Payroll",
        completed: clearanceStats.payrollCompleted,
        pending: clearanceStats.payrollPending,
      },
      {
        category: "Assets",
        completed: clearanceStats.assetsCompleted,
        pending: clearanceStats.assetsPending,
      },
      {
        category: "HR Docs",
        completed: clearanceStats.hrDocsCompleted,
        pending: clearanceStats.hrDocsPending,
      },
    ];
  }, [clearanceStats]);

  // Export function
  const handleExportTable = async () => {
    setIsExporting(true);
    try {
      let exportType;
      if (activeSubTab === "notice_compliance") {
        exportType = "notice_period_compliance";
      } else if (activeSubTab === "exit_interviews") {
        exportType = "exit_interview_report";
      } else if (activeSubTab === "clearance_pending") {
        exportType = "clearance_pending_report";
      }

      const success = await exportExitClearanceReport(exportType, filterData);
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

  if (!isReady) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Exit Processing & Compliance</CardTitle>
          <CardDescription>
            API development in progress. This section will show exit processing
            and compliance tracking.
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-4">
        {[
          {
            title: "Notice Period Records",
            value: noticePeriodStats.totalEmployees,
            description: "Total tracked employees",
            color: "text-blue-600",
          },
          {
            title: "Compliant",
            value: noticePeriodStats.compliant,
            description: "Notice period compliant",
            color: "text-green-600",
          },
          {
            title: "Non-Compliant",
            value: noticePeriodStats.nonCompliant,
            description: "Notice violations",
            color: "text-red-600",
          },
          {
            title: "Exit Interviews",
            value: exitInterviewStats.totalInterviews,
            description: "Completed interviews",
            color: "text-purple-600",
          },
          {
            title: "Rehire Eligible",
            value: exitInterviewStats.rehireEligible,
            description: "Eligible for rehire",
            color: "text-green-600",
          },
          {
            title: "Not Eligible",
            value: exitInterviewStats.notEligible,
            description: "Not eligible for rehire",
            color: "text-orange-600",
          },
          {
            title: "Clearance Records",
            value: clearanceStats.totalClearances,
            description: "Total clearance tracking",
            color: "text-indigo-600",
          },
          {
            title: "Assets Pending",
            value: clearanceStats.assetsPending,
            description: "Pending asset returns",
            color: "text-yellow-600",
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
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Notice Period Compliance Distribution */}
        {complianceChartData.length > 0 && (
          <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-plum-900">
                Notice Period Compliance
              </CardTitle>
              <CardDescription>
                Distribution of compliance status
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={complianceChartData}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {complianceChartData.map((entry, index) => (
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

        {/* Exit Type Distribution */}
        {exitTypeData.length > 0 && (
          <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-plum-900">
                Exit Types Distribution
              </CardTitle>
              <CardDescription>Types of exits being tracked</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={exitTypeData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
                >
                  <XAxis
                    dataKey="type"
                    tick={{ fontSize: 11 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ fontSize: "12px" }}
                    formatter={(value, name) => [`${value} employees`, "Count"]}
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

        {/* Clearance Status Distribution */}
        {clearanceStatusData.length > 0 && (
          <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-plum-900">
                Clearance Status
              </CardTitle>
              <CardDescription>
                Overall clearance completion status
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={clearanceStatusData}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {clearanceStatusData.map((entry, index) => (
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

        {/* Clearance Breakdown */}
        {clearanceBreakdownData.length > 0 && (
          <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-plum-900">
                Clearance Breakdown
              </CardTitle>
              <CardDescription>
                Completed vs pending by category
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={clearanceBreakdownData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
                >
                  <XAxis
                    dataKey="category"
                    tick={{ fontSize: 11 }}
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ fontSize: "12px" }} />
                  <Bar
                    dataKey="completed"
                    fill="#10B981"
                    name="Completed"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="pending"
                    fill="#F59E0B"
                    name="Pending"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Multi-Table Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Exit Processing & Compliance Tracking</CardTitle>
              <CardDescription>
                Comprehensive exit process management including notice period
                compliance, exit interviews, and clearance tracking.
              </CardDescription>
            </div>
            <Button
              onClick={handleExportTable}
              disabled={isExporting}
              variant="outline"
              size="sm"
            >
              {isExporting
                ? "Exporting..."
                : `Export ${
                    activeSubTab === "notice_compliance"
                      ? "Notice Compliance"
                      : activeSubTab === "exit_interviews"
                      ? "Exit Interviews"
                      : "Clearance Report"
                  }`}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="notice_compliance">
                Notice Compliance
              </TabsTrigger>
              <TabsTrigger value="exit_interviews">Exit Interviews</TabsTrigger>
              <TabsTrigger value="clearance_pending">
                Clearance Tracking
              </TabsTrigger>
            </TabsList>

            <TabsContent value="notice_compliance">
              {loading ? (
                <PageLoader />
              ) : (
                <TableCustom
                  columns={NoticePeriodComplianceColumns()}
                  data={noticePeriodData.results}
                  pagination={true}
                  dataTotalSize={noticePeriodData.count}
                  tableOptions={tableOptions}
                  fallbackText="No notice period compliance data found"
                />
              )}
            </TabsContent>

            <TabsContent value="exit_interviews">
              {loading ? (
                <PageLoader />
              ) : (
                <TableCustom
                  columns={ExitInterviewReportColumns()}
                  data={exitInterviewData.results}
                  pagination={true}
                  dataTotalSize={exitInterviewData.count}
                  tableOptions={tableOptions}
                  fallbackText="No exit interview data found"
                />
              )}
            </TabsContent>

            <TabsContent value="clearance_pending">
              {loading ? (
                <PageLoader />
              ) : (
                <TableCustom
                  columns={ClearancePendingReportColumns()}
                  data={clearanceData.results}
                  pagination={true}
                  dataTotalSize={clearanceData.count}
                  tableOptions={tableOptions}
                  fallbackText="No clearance pending data found"
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExitProcessingComplianceReport;
