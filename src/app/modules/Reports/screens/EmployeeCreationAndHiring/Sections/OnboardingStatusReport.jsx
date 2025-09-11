import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import { Progress } from "src/@/components/ui/progress";
import { getOfferLetterComplianceData } from "app/hooks/reports";
import { OfferLetterComplianceColumns } from "../TableColumns/HiringReportTableColumns";

const OnboardingStatusReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");

  // Fetch onboarding data
  const fetchOnboardingData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getOfferLetterComplianceData(payload);
      if (response) {
        setOnboardingData(response);
      }
    } catch (error) {
      console.error("Error fetching onboarding data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchOnboardingData();
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

  // Calculate stats from aggregated data
  const stats = {
    totalEmployees:
      onboardingData.aggregated_stats?.total_employees ||
      onboardingData.count ||
      0,
    backgroundCheckRate:
      onboardingData.aggregated_stats?.compliance_rates
        ?.background_check_completed || 0,
    medicalCheckRate:
      onboardingData.aggregated_stats?.compliance_rates
        ?.medical_done_completed || 0,
    overallComplianceRate:
      onboardingData.aggregated_stats?.compliance_rates?.overall_compliance ||
      0,
  };

  // Compliance progress data
  const complianceData = [
    {
      title: "Background Check",
      completion: stats.backgroundCheckRate,
      color: "bg-blue-500",
    },
    {
      title: "Medical Examination",
      completion: stats.medicalCheckRate,
      color: "bg-green-500",
    },
    {
      title: "Offer Acceptance",
      completion:
        onboardingData.aggregated_stats?.compliance_rates
          ?.offer_status_accepted || 0,
      color: "bg-purple-500",
    },
    {
      title: "Overall Compliance",
      completion: stats.overallComplianceRate,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Onboarding Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Employees",
            value: stats.totalEmployees,
            description: "In onboarding process",
            color: "text-plum-900",
          },
          {
            title: "Background Check",
            value: `${stats.backgroundCheckRate.toFixed(1)}%`,
            description: "Completion rate",
            color: "text-blue-600",
          },
          {
            title: "Medical Check",
            value: `${stats.medicalCheckRate.toFixed(1)}%`,
            description: "Completion rate",
            color: "text-green-600",
          },
          {
            title: "Overall Compliance",
            value: `${stats.overallComplianceRate.toFixed(1)}%`,
            description: "Average completion",
            color: "text-orange-600",
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

      {/* Compliance Progress Chart */}
      <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-plum-900">
            Onboarding Compliance Progress
          </CardTitle>
          <CardDescription>
            Completion rates for different onboarding requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {complianceData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-neutral-900">
                  {item.title}
                </span>
                <span className="text-sm text-neutral-600">
                  {item.completion.toFixed(1)}%
                </span>
              </div>
              <Progress
                value={item.completion}
                className="h-3"
                style={{
                  "--progress-background": item.color.replace("bg-", ""),
                }}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Onboarding Status Table */}
      <Card>
        <CardHeader>
          <CardTitle>Onboarding Status Report</CardTitle>
          <CardDescription>
            Detailed onboarding progress tracking including offer status,
            background verification, medical examinations, and visa processing
            for all employees in the hiring pipeline.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={OfferLetterComplianceColumns()}
              data={onboardingData.results}
              pagination={true}
              dataTotalSize={onboardingData.count}
              tableOptions={tableOptions}
              fallbackText="No onboarding data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingStatusReport;
