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
  CartesianGrid,
  RadialBarChart,
  RadialBar,
} from "recharts";
// ============================================================================
// SHIFT COVERAGE REPORT COMPONENT
// ============================================================================
import { getShiftCoverageReportData } from "app/hooks/reports";
import { ShiftCoverageReportColumns } from "../TableColumns/AttendanceShiftTableColumns";

export const ShiftCoverageReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [shiftCoverageData, setShiftCoverageData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");

  // Chart colors
  const coverageColors = ["#10B981", "#EF4444"];
  const shiftTypeColors = ["#3B82F6", "#8B5CF6", "#10B981"];

  const fetchShiftCoverageData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getShiftCoverageReportData(payload);
      if (response) {
        setShiftCoverageData(response);
      }
    } catch (error) {
      console.error("Error fetching shift coverage data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchShiftCoverageData();
    }
  }, [filterData, permittedViewFilterData, options, ordering]);

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onSortChange: (sortName) => {
      setOrdering(sortName);
    },
  };

  // Calculate stats from aggregated data only
  const stats = {
    totalEmployees:
      shiftCoverageData.aggregated_stats?.total_employees ||
      shiftCoverageData.count ||
      0,
    adequateCoverage:
      shiftCoverageData.aggregated_stats?.adequate_coverage_90_plus || 0,
    poorCoverage:
      shiftCoverageData.aggregated_stats?.poor_coverage_under_70 || 0,
    totalCoverageGaps:
      shiftCoverageData.aggregated_stats?.total_coverage_gaps || 0,
  };

  // Coverage level distribution chart data
  const coverageChartData = React.useMemo(() => {
    if (!shiftCoverageData.aggregated_stats) return [];

    const moderateCoverage =
      stats.totalEmployees - stats.adequateCoverage - stats.poorCoverage;

    return [
      {
        level: "Adequate Coverage (90%+)",
        count: stats.adequateCoverage,
        percentage:
          stats.totalEmployees > 0
            ? Math.round((stats.adequateCoverage / stats.totalEmployees) * 100)
            : 0,
      },
      {
        level: "Moderate Coverage (70-90%)",
        count: moderateCoverage > 0 ? moderateCoverage : 0,
        percentage:
          stats.totalEmployees > 0 && moderateCoverage > 0
            ? Math.round((moderateCoverage / stats.totalEmployees) * 100)
            : 0,
      },
      {
        level: "Poor Coverage (Under 70%)",
        count: stats.poorCoverage,
        percentage:
          stats.totalEmployees > 0
            ? Math.round((stats.poorCoverage / stats.totalEmployees) * 100)
            : 0,
      },
    ].filter((item) => item.count > 0);
  }, [shiftCoverageData.aggregated_stats, stats]);

  // Shift type coverage data
  const shiftTypeCoverageData = React.useMemo(() => {
    if (!shiftCoverageData.aggregated_stats?.by_shift_type) return [];

    return Object.entries(shiftCoverageData.aggregated_stats.by_shift_type)
      .map(([shiftType, gaps]) => ({
        shiftType: shiftType || "Unspecified",
        coverageGaps: gaps,
      }))
      .filter((item) => item.coverageGaps > 0)
      .sort((a, b) => b.coverageGaps - a.coverageGaps);
  }, [shiftCoverageData.aggregated_stats]);

  // Overall coverage efficiency gauge
  const overallCoverageRate = React.useMemo(() => {
    if (!shiftCoverageData.aggregated_stats || stats.totalEmployees === 0)
      return 0;

    return Math.round((stats.adequateCoverage / stats.totalEmployees) * 100);
  }, [shiftCoverageData.aggregated_stats, stats]);

  const gaugeData = [
    {
      name: "Coverage",
      value: overallCoverageRate,
      fill:
        overallCoverageRate >= 90
          ? "#10B981"
          : overallCoverageRate >= 70
          ? "#F59E0B"
          : "#EF4444",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          {
            title: "Total Employees",
            value: stats.totalEmployees.toLocaleString(),
            description: "Coverage tracked",
            color: "text-plum-900",
          },
          {
            title: "Adequate Coverage",
            value: stats.adequateCoverage.toLocaleString(),
            description: "90%+ coverage rate",
            color: "text-green-600",
          },
          {
            title: "Poor Coverage",
            value: stats.poorCoverage.toLocaleString(),
            description: "Under 70% coverage",
            color: "text-red-600",
          },
          {
            title: "Coverage Gaps",
            value: stats.totalCoverageGaps.toLocaleString(),
            description: "Total gaps identified",
            color: "text-orange-600",
          },
          {
            title: "Coverage Rate",
            value: `${overallCoverageRate}%`,
            description: "Overall coverage",
            color:
              overallCoverageRate >= 90
                ? "text-green-600"
                : overallCoverageRate >= 70
                ? "text-yellow-600"
                : "text-red-600",
          },
          {
            title: "Needs Attention",
            value: (
              stats.totalEmployees - stats.adequateCoverage
            ).toLocaleString(),
            description: "Below 90% coverage",
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
        {/* Coverage Level Distribution */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Coverage Level Distribution
            </CardTitle>
            <CardDescription>
              Employee distribution by shift coverage adequacy
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={coverageChartData}
                  dataKey="count"
                  nameKey="level"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="none"
                >
                  {coverageChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        index === 0
                          ? "#10B981"
                          : index === 1
                          ? "#F59E0B"
                          : "#EF4444"
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${value.toLocaleString()} employees (${
                      coverageChartData.find((d) => d.level === name)
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

        {/* Overall Coverage Gauge */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Overall Coverage Rate
            </CardTitle>
            <CardDescription>
              Organization-wide shift coverage performance
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="90%"
                data={gaugeData}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  dataKey="value"
                  cornerRadius={10}
                  fill={gaugeData[0]?.fill}
                />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-3xl font-bold fill-current"
                  fill={gaugeData[0]?.fill}
                >
                  {overallCoverageRate}%
                </text>
                <Tooltip
                  formatter={(value) => [`${value}%`, "Coverage Rate"]}
                  contentStyle={{ fontSize: "12px" }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Shift Type Coverage Gaps */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Coverage Gaps by Shift Type
            </CardTitle>
            <CardDescription>
              Coverage gaps identified across different shift types
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={shiftTypeCoverageData}
                margin={{ top: 20, right: 20, left: 0, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="shiftType"
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ fontSize: "12px" }}
                  formatter={(value) => [`${value} gaps`, "Coverage Gaps"]}
                />
                <Bar
                  dataKey="coverageGaps"
                  fill="#EF4444"
                  name="Coverage Gaps"
                  barSize={50}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Shift Coverage Table */}
      <Card>
        <CardHeader>
          <CardTitle>Shift Coverage Report</CardTitle>
          <CardDescription>
            Analyze shift coverage gaps and excess manpower to optimize
            workforce distribution and ensure adequate staffing levels.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={ShiftCoverageReportColumns()}
              data={shiftCoverageData.results}
              pagination={true}
              dataTotalSize={shiftCoverageData.count}
              tableOptions={tableOptions}
              fallbackText="No shift coverage data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
