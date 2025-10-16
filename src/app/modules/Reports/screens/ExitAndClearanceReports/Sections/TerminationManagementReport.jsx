// src/app/modules/Reports/screens/ExitAndClearanceReports/Sections/TerminationManagementReport.jsx

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
import {
  getTerminationReportData,
  exportExitClearanceReport,
} from "app/hooks/reports";
import { TerminationReportColumns } from "../TableColumns/ExitClearanceTableColumns";
import { Button } from "components/ui/button";
import { toast } from "react-toastify";

const TerminationManagementReport = ({
  filterData = {},
  onFilterChange = () => {},
  isReady = true,
}) => {
  const [loading, setLoading] = useState(false);
  const [terminationData, setTerminationData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  // Chart colors
  const colors = ["#EF4444", "#F59E0B", "#8B5CF6", "#10B981", "#3B82F6"];

  // Fetch termination data
  const fetchTerminationData = async () => {
    setLoading(true);
    try {
      const payload = { filterData, options, ordering };
      const response = await getTerminationReportData(payload);
      if (response) {
        setTerminationData(response);
      }
    } catch (error) {
      console.error("Error fetching termination data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isReady) {
      fetchTerminationData();
    }
  }, [filterData, isReady, options, ordering]);

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

  // Calculate termination statistics from aggregated_stats
  const terminationStats = React.useMemo(() => {
    if (!terminationData.aggregated_stats) {
      return {
        totalTerminations: terminationData.count || 0,
        approved: 0,
        pending: 0,
        rejected: 0,
        voluntary: 0,
        involuntary: 0,
      };
    }

    const stats = terminationData.aggregated_stats;
    return {
      totalTerminations: stats.total_terminations || 0,
      approved: stats.status_breakdown?.APPROVED || 0,
      pending: stats.status_breakdown?.PENDING || 0,
      rejected: stats.status_breakdown?.REJECTED || 0,
      voluntary: stats.termination_type_breakdown?.voluntary || 0,
      involuntary: stats.termination_type_breakdown?.involuntary || 0,
    };
  }, [terminationData]);

  // Prepare termination types chart data
  const terminationTypesData = React.useMemo(() => {
    if (!terminationData.aggregated_stats?.termination_type_breakdown)
      return [];

    return Object.entries(
      terminationData.aggregated_stats.termination_type_breakdown
    )
      .map(([type, count]) => ({
        type: type === "voluntary" ? "Voluntary" : "Involuntary",
        count,
      }))
      .filter((item) => item.count > 0);
  }, [terminationData.aggregated_stats]);

  // Prepare department distribution chart data
  const departmentData = React.useMemo(() => {
    if (!terminationData.aggregated_stats?.department_breakdown) return [];

    return Object.entries(
      terminationData.aggregated_stats.department_breakdown
    ).map(([department, count]) => ({
      department,
      count,
    }));
  }, [terminationData.aggregated_stats]);

  // Export function
  const handleExportTable = async () => {
    setIsExporting(true);
    try {
      const success = await exportExitClearanceReport(
        "termination_report",
        filterData
      );
      if (success) {
        toast.success("Termination report exported successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export termination report", {
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
          <CardTitle>Termination Management</CardTitle>
          <CardDescription>
            API development in progress. This section will show employee
            termination tracking.
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
      {/* Termination Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Terminations",
            value: terminationStats.totalTerminations,
            description: "All termination records",
            color: "text-red-600",
          },
          {
            title: "Approved Terminations",
            value: terminationStats.approved,
            description: "Processed terminations",
            color: "text-green-600",
          },
          {
            title: "Voluntary Terminations",
            value: terminationStats.voluntary,
            description: "Employee initiated",
            color: "text-blue-600",
          },
          {
            title: "Pending Terminations",
            value: terminationStats.pending,
            description: "Awaiting approval",
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Termination Types Distribution */}
        {terminationTypesData.length > 0 && (
          <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-plum-900">
                Termination Types
              </CardTitle>
              <CardDescription>
                Voluntary vs Involuntary terminations
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={terminationTypesData}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {terminationTypesData.map((entry, index) => (
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

        {/* Department-wise Terminations */}
        {departmentData.length > 0 && (
          <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-plum-900">
                Terminations by Department
              </CardTitle>
              <CardDescription>
                Department-wise termination distribution
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={departmentData}
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
                      `${value} terminations`,
                      "Count",
                    ]}
                  />
                  <Bar
                    dataKey="count"
                    fill="#EF4444"
                    name="Terminations"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Termination Records Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Employee Termination Records</CardTitle>
              <CardDescription>
                Comprehensive termination tracking including termination types,
                reasons, and compliance status.
              </CardDescription>
            </div>
            <Button
              onClick={handleExportTable}
              disabled={isExporting}
              variant="outline"
              size="sm"
            >
              {isExporting ? "Exporting..." : "Export Terminations"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={TerminationReportColumns()}
              data={terminationData.results}
              pagination={true}
              dataTotalSize={terminationData.count}
              tableOptions={tableOptions}
              fallbackText="No termination data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TerminationManagementReport;
