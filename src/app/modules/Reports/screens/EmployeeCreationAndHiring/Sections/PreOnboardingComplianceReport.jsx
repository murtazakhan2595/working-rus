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
import { getPreOnboardingComplianceReportData } from "app/hooks/reports";
import { PreOnboardingComplianceColumns } from "../TableColumns/HiringReportTableColumns";

const PreOnboardingComplianceReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [complianceData, setComplianceData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");

  // Chart colors
  const complianceColors = ["#10B981", "#3B82F6", "#F59E0B", "#A78BFA"];

  // Fetch pre-onboarding compliance data
  const fetchComplianceData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getPreOnboardingComplianceReportData(payload);
      if (response) {
        setComplianceData(response);
      }
    } catch (error) {
      console.error("Error fetching pre-onboarding compliance data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchComplianceData();
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
  const complianceCompletionData = React.useMemo(() => {
    if (!complianceData.aggregated_stats?.completion_counts) return [];

    return Object.entries(
      complianceData.aggregated_stats.completion_counts
    ).map(([type, count]) => ({
      type: type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      count,
      completion_rate:
        complianceData.aggregated_stats.total_employees > 0
          ? Math.round(
              (count / complianceData.aggregated_stats.total_employees) * 100
            )
          : 0,
    }));
  }, [complianceData.aggregated_stats]);

  // Calculate stats from aggregated data
  const stats = {
    totalEmployees:
      complianceData.aggregated_stats?.total_employees ||
      complianceData.count ||
      0,
    backgroundCompleted:
      complianceData.aggregated_stats?.completion_counts
        ?.background_check_completed || 0,
    medicalCompleted:
      complianceData.aggregated_stats?.completion_counts
        ?.medical_check_completed || 0,
    visaCompleted:
      complianceData.aggregated_stats?.completion_counts
        ?.visa_processing_completed || 0,
    fullyCompliant:
      complianceData.aggregated_stats?.completion_counts?.fully_compliant || 0,
    overallComplianceRate:
      complianceData.aggregated_stats?.overall_compliance_rate || 0,
  };

  return (
    <div className="space-y-6">
      {/* Pre-Onboarding Compliance Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            title: "Total Employees",
            value: stats.totalEmployees,
            description: "In compliance process",
            color: "text-plum-900",
          },
          {
            title: "Background Check",
            value: stats.backgroundCompleted,
            description: "Completed verifications",
            color: "text-blue-600",
          },
          {
            title: "Medical Check",
            value: stats.medicalCompleted,
            description: "Completed examinations",
            color: "text-green-600",
          },
          {
            title: "Visa Processing",
            value: stats.visaCompleted,
            description: "Completed processing",
            color: "text-orange-600",
          },
          {
            title: "Fully Compliant",
            value: stats.fullyCompliant,
            description: `${stats.overallComplianceRate.toFixed(1)}% overall`,
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Compliance Completion Breakdown */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Compliance Completion Breakdown
            </CardTitle>
            <CardDescription>
              Number of completed compliance checks by type
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={complianceCompletionData}
                margin={{ top: 20, right: 20, left: 0, bottom: 60 }}
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
                  formatter={(value, name) => [`${value} completed`, "Count"]}
                />
                <Bar
                  dataKey="count"
                  fill="#10B981"
                  name="Completed"
                  barSize={40}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Compliance Completion Rates */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Compliance Completion Rates
            </CardTitle>
            <CardDescription>
              Percentage completion rates by compliance type
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={complianceCompletionData}
                  dataKey="completion_rate"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="none"
                >
                  {complianceCompletionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={complianceColors[index % complianceColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value}%`, name]}
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
      </div>

      {/* Pre-Onboarding Compliance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pre-Onboarding Compliance Report</CardTitle>
          <CardDescription>
            Detailed tracking of pre-onboarding compliance requirements
            including background verification, medical examinations, visa
            processing, and other mandatory checks for all new hires.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={PreOnboardingComplianceColumns()}
              data={complianceData.results}
              pagination={true}
              dataTotalSize={complianceData.count}
              tableOptions={tableOptions}
              fallbackText="No pre-onboarding compliance data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PreOnboardingComplianceReport;
