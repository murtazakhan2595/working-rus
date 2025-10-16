// src/app/modules/Reports/screens/ExitAndClearanceReports/Sections/AttritionRetentionReport.jsx

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
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { getAttritionRetentionReportData } from "app/hooks/reports";
import { AttritionRetentionReportColumns } from "../TableColumns/ExitClearanceTableColumns";

const AttritionRetentionReport = ({
  filterData = {},
  onFilterChange = () => {},
  isReady = true,
}) => {
  const [loading, setLoading] = useState(false);
  const [attritionData, setAttritionData] = useState({ results: [], count: 0 });
  const [chartData, setChartData] = useState([]);

  // Chart colors
  const colors = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"];

  // Fetch attrition retention data
  const fetchAttritionData = async () => {
    setLoading(true);
    try {
      const response = await getAttritionRetentionReportData(filterData);
      if (response) {
        setAttritionData(response);

        // Prepare chart data from all results (not paginated for charts) - REMOVED N/A FILTERING
        const processedChartData = response.results
          .map((item) => ({
            ...item,
            attrition_rate: parseFloat(
              item.attrition_percent?.replace("%", "") || 0
            ),
            retention_rate: parseFloat(
              item.retention_percent?.replace("%", "") || 0
            ),
          }))
          .sort((a, b) => {
            // Handle N/A values in sorting
            const aDate = a.month === "N/A" ? new Date(0) : new Date(a.month);
            const bDate = b.month === "N/A" ? new Date(0) : new Date(b.month);
            return aDate - bDate;
          });

        setChartData(processedChartData);
      }
    } catch (error) {
      console.error("Error fetching attrition retention data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isReady) {
      fetchAttritionData();
    }
  }, [filterData, isReady]);

  // Calculate summary statistics
  const summaryStats = React.useMemo(() => {
    if (!attritionData.results || attritionData.results.length === 0) {
      return {
        totalEmployees: 0,
        totalExits: 0,
        avgAttritionRate: 0,
        avgRetentionRate: 0,
        totalDepartments: 0,
      };
    }

    // REMOVED N/A FILTERING - now includes all data
    const validData = attritionData.results;

    const totalEmployees = validData.reduce(
      (sum, item) => sum + (item.total_employees || 0),
      0
    );
    const totalExits = validData.reduce(
      (sum, item) => sum + (item.exits || 0),
      0
    );
    const totalDepartments = new Set(validData.map((item) => item.department))
      .size;

    const avgAttritionRate =
      validData.length > 0
        ? validData.reduce(
            (sum, item) =>
              sum + parseFloat(item.attrition_percent?.replace("%", "") || 0),
            0
          ) / validData.length
        : 0;

    const avgRetentionRate =
      validData.length > 0
        ? validData.reduce(
            (sum, item) =>
              sum + parseFloat(item.retention_percent?.replace("%", "") || 0),
            0
          ) / validData.length
        : 0;

    return {
      totalEmployees,
      totalExits,
      avgAttritionRate: Math.round(avgAttritionRate * 100) / 100,
      avgRetentionRate: Math.round(avgRetentionRate * 100) / 100,
      totalDepartments,
    };
  }, [attritionData.results]);

  // Prepare department-wise chart data
  const departmentChartData = React.useMemo(() => {
    if (!chartData.length) return [];

    const departmentMap = {};
    chartData.forEach((item) => {
      if (!departmentMap[item.department]) {
        departmentMap[item.department] = {
          department: item.department,
          total_employees: 0,
          total_exits: 0,
          avg_attrition: 0,
        };
      }
      departmentMap[item.department].total_employees +=
        item.total_employees || 0;
      departmentMap[item.department].total_exits += item.exits || 0;
    });

    return Object.values(departmentMap)
      .map((dept) => ({
        ...dept,
        avg_attrition:
          dept.total_employees > 0
            ? Math.round(
                (dept.total_exits / dept.total_employees) * 100 * 100
              ) / 100
            : 0,
      }))
      .slice(0, 10); // Top 10 departments
  }, [chartData]);

  // Monthly trend data
  const monthlyTrendData = React.useMemo(() => {
    if (!chartData.length) return [];

    const monthlyMap = {};
    chartData.forEach((item) => {
      if (!monthlyMap[item.month]) {
        monthlyMap[item.month] = {
          month: item.month,
          total_exits: 0,
          avg_attrition: 0,
          count: 0,
        };
      }
      monthlyMap[item.month].total_exits += item.exits || 0;
      monthlyMap[item.month].avg_attrition += item.attrition_rate || 0;
      monthlyMap[item.month].count += 1;
    });

    return Object.values(monthlyMap)
      .map((month) => ({
        ...month,
        avg_attrition:
          month.count > 0
            ? Math.round((month.avg_attrition / month.count) * 100) / 100
            : 0,
      }))
      .sort((a, b) => {
        // Handle N/A values in sorting
        const aDate = a.month === "N/A" ? new Date(0) : new Date(a.month);
        const bDate = b.month === "N/A" ? new Date(0) : new Date(b.month);
        return aDate - bDate;
      });
  }, [chartData]);

  if (!isReady) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Attrition & Retention Analysis</CardTitle>
          <CardDescription>
            API development in progress. This section will show departmental
            attrition rates and workforce trends.
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
      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            title: "Total Employees",
            value: summaryStats.totalEmployees,
            description: "Across all departments",
            color: "text-plum-900",
          },
          {
            title: "Total Exits",
            value: summaryStats.totalExits,
            description: "Employee departures",
            color: "text-red-600",
          },
          {
            title: "Avg Attrition Rate",
            value: `${summaryStats.avgAttritionRate}%`,
            description: "Organization average",
            color: "text-yellow-600",
          },
          {
            title: "Avg Retention Rate",
            value: `${summaryStats.avgRetentionRate}%`,
            description: "Organization average",
            color: "text-green-600",
          },
          {
            title: "Departments Tracked",
            value: summaryStats.totalDepartments,
            description: "Active departments",
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
      {chartData.length > 0 && (
        <>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Monthly Attrition Trends */}
            <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-plum-900">
                  Monthly Attrition Trends
                </CardTitle>
                <CardDescription>
                  Attrition rate and exit volume over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyTrendData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }} 
                      domain={[0, 'dataMax + 1']}
                      allowDataOverflow={false}
                    />
                    <Tooltip contentStyle={{ fontSize: "12px" }} />
                    <Line
                      type="monotone"
                      dataKey="avg_attrition"
                      stroke="#EF4444"
                      strokeWidth={3}
                      name="Attrition Rate (%)"
                      dot={{ fill: "#EF4444", strokeWidth: 2, r: 4 }}
                      connectNulls={true}
                    />
                    <Line
                      type="monotone"
                      dataKey="total_exits"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      name="Total Exits"
                      dot={{ fill: "#F59E0B", strokeWidth: 2, r: 3 }}
                      connectNulls={true}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Department-wise Attrition */}
            <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-plum-900">
                  Department-wise Attrition
                </CardTitle>
                <CardDescription>Attrition rates by department</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={departmentChartData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
                  >
                    <XAxis
                      dataKey="department"
                      tick={{ fontSize: 11 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }} 
                      domain={[0, 'dataMax + 1']}
                      allowDataOverflow={false}
                    />
                    <Tooltip
                      contentStyle={{ fontSize: "12px" }}
                      formatter={(value, name) => [
                        name === "avg_attrition" ? `${value}%` : value,
                        name === "avg_attrition"
                          ? "Attrition Rate"
                          : name
                              .replace("_", " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase()),
                      ]}
                    />
                    <Bar
                      dataKey="avg_attrition"
                      fill="#EF4444"
                      name="Attrition Rate (%)"
                      radius={[4, 4, 0, 0]}
                      minPointSize={2}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Attrition & Retention Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attrition & Retention Analysis</CardTitle>
          <CardDescription>
            Detailed breakdown of attrition and retention rates by department
            and time period.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={AttritionRetentionReportColumns()}
              data={attritionData.results}
              pagination={false}
              fallbackText="No attrition data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttritionRetentionReport;