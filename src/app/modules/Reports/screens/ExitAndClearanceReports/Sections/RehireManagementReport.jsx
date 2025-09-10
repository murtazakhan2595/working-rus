// src/app/modules/Reports/screens/ExitAndClearanceReports/Sections/RehireManagementReport.jsx

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
  getRehireEligibilityReportData,
  getV2AttritionRehireEligibilityData,
  exportExitClearanceReport,
} from "app/hooks/reports";
import { RehireEligibilityReportColumns } from "../TableColumns/ExitClearanceTableColumns";
import { Button } from "components/ui/button";
import { toast } from "react-toastify";

const RehireManagementReport = ({
  filterData = {},
  onFilterChange = () => {},
  isReady = true,
}) => {
  const [loading, setLoading] = useState(false);
  const [rehireData, setRehireData] = useState({ results: [], count: 0 });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  // Chart colors
  const colors = ["#10B981", "#EF4444", "#F59E0B", "#3B82F6"];

  // Fetch rehire eligibility data
  const fetchRehireData = async () => {
    setLoading(true);
    try {
      const payload = { filterData, options, ordering };
      const response = await getRehireEligibilityReportData(payload);
      if (response) {
        setRehireData(response);
      }
    } catch (error) {
      console.error("Error fetching rehire eligibility data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isReady) {
      fetchRehireData();
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

  // Calculate rehire statistics
  const rehireStats = React.useMemo(() => {
    if (!rehireData.results || rehireData.results.length === 0) {
      return {
        totalEmployees: 0,
        eligible: 0,
        notEligible: 0,
        underReview: 0,
        voluntary: 0,
        retirement: 0,
        others: 0,
      };
    }

    const stats = rehireData.results.reduce(
      (acc, item) => {
        if (item.eligible_for_rehire === "Yes") acc.eligible++;
        else if (item.eligible_for_rehire === "No") acc.notEligible++;
        else acc.underReview++;

        if (item.exit_type === "Voluntary") acc.voluntary++;
        else if (item.exit_type === "Retirement") acc.retirement++;
        else acc.others++;
        return acc;
      },
      {
        eligible: 0,
        notEligible: 0,
        underReview: 0,
        voluntary: 0,
        retirement: 0,
        others: 0,
      }
    );

    return {
      totalEmployees: rehireData.count || 0,
      ...stats,
    };
  }, [rehireData]);

  // Prepare eligibility chart data
  const eligibilityData = React.useMemo(() => {
    return [
      { status: "Eligible", count: rehireStats.eligible },
      { status: "Not Eligible", count: rehireStats.notEligible },
      { status: "Under Review", count: rehireStats.underReview },
    ].filter((item) => item.count > 0);
  }, [rehireStats]);

  // Prepare exit type distribution
  const exitTypeData = React.useMemo(() => {
    if (!rehireData.results || rehireData.results.length === 0) return [];

    const exitTypeMap = {};
    rehireData.results.forEach((item) => {
      const exitType = item.exit_type || "Unknown";
      exitTypeMap[exitType] = (exitTypeMap[exitType] || 0) + 1;
    });

    return Object.entries(exitTypeMap).map(([type, count]) => ({
      type,
      count,
    }));
  }, [rehireData.results]);

  // Prepare HR decision distribution
  const hrDecisionData = React.useMemo(() => {
    if (!rehireData.results || rehireData.results.length === 0) return [];

    const decisionMap = {};
    rehireData.results.forEach((item) => {
      const decision =
        item.hr_decision === "N/A" ? "Pending" : item.hr_decision || "Pending";
      decisionMap[decision] = (decisionMap[decision] || 0) + 1;
    });

    return Object.entries(decisionMap).map(([decision, count]) => ({
      decision,
      count,
    }));
  }, [rehireData.results]);

  // Export function
  const handleExportTable = async () => {
    setIsExporting(true);
    try {
      const success = await exportExitClearanceReport(
        "rehire_eligibility_report",
        filterData
      );
      if (success) {
        toast.success("Rehire eligibility report exported successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export rehire report", {
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
          <CardTitle>Rehire Management</CardTitle>
          <CardDescription>
            API development in progress. This section will show employee rehire
            eligibility tracking.
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
      {/* Rehire Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Employees",
            value: rehireStats.totalEmployees,
            description: "Exit records tracked",
            color: "text-blue-600",
          },
          {
            title: "Eligible for Rehire",
            value: rehireStats.eligible,
            description: "Rehire approved",
            color: "text-green-600",
          },
          {
            title: "Not Eligible",
            value: rehireStats.notEligible,
            description: "Rehire declined",
            color: "text-red-600",
          },
          {
            title: "Voluntary Exits",
            value: rehireStats.voluntary,
            description: "Voluntary departures",
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
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Rehire Eligibility Distribution */}
        {eligibilityData.length > 0 && (
          <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-plum-900">
                Rehire Eligibility Status
              </CardTitle>
              <CardDescription>
                Distribution of rehire eligibility decisions
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={eligibilityData}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {eligibilityData.map((entry, index) => (
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
                Exit Types for Rehire Tracking
              </CardTitle>
              <CardDescription>
                Types of exits being tracked for rehire
              </CardDescription>
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

        {/* HR Decision Distribution */}
        {hrDecisionData.length > 0 && (
          <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-plum-900">
                HR Decision Status
              </CardTitle>
              <CardDescription>HR decision distribution</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={hrDecisionData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
                >
                  <XAxis
                    dataKey="decision"
                    tick={{ fontSize: 11 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ fontSize: "12px" }}
                    formatter={(value, name) => [`${value} cases`, "Count"]}
                  />
                  <Bar
                    dataKey="count"
                    fill="#8B5CF6"
                    name="Decisions"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>


      {/* Rehire Eligibility Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Rehire Eligibility Management</CardTitle>
              <CardDescription>
                Track employee rehire eligibility based on exit reasons,
                performance history, and HR decisions.
              </CardDescription>
            </div>
            <Button
              onClick={handleExportTable}
              disabled={isExporting}
              variant="outline"
              size="sm"
            >
              {isExporting ? "Exporting..." : "Export Rehire Report"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={RehireEligibilityReportColumns()}
              data={rehireData.results}
              pagination={true}
              dataTotalSize={rehireData.count}
              tableOptions={tableOptions}
              fallbackText="No rehire eligibility data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RehireManagementReport;
