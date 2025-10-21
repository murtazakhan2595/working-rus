import React, { useState, useCallback } from "react";
import moment from "moment";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { Button } from "components/ui/button";
import { FilterInput } from "components/FormControl";
import { useSelector } from "react-redux";
import { PageLoader } from "components";

// Import section components
import KPICards from "./KPICards";
import RecruitmentFunnel from "./RecruitmentFunnel";
import AIInsightsWidget from "./AIInsightsWidget";
import UpcomingInterviews from "./UpcomingInterviews";
import OfferTrackerWidget from "./OfferTrackerWidget";
import ApplicantSources from "./ApplicantSources";
import EmiratizationWidget from "./EmiratizationWidget";
import OpenRequisitions from "./OpenRequisitions";
import HiringPredictionWidget from "./HiringPredictionWidget";
import HiringTrendsWidget from "./HiringTrendsWidget";
import SkillsGapWidget from "./SkillsGapWidget";
import { useTalentSphereDashboard } from "./useTalentSphereDashboard";

const TalentSphereDashboard = () => {
  const Departments = useSelector((state) => state.common.departments);
  const [filterData, setFilterData] = useState({});

  // Use our custom hook
  const {
    loading,
    summaryData,
    funnelData,
    interviewData,
    offerData,
    sourceData,
    emiratizationData,
    budgetWarnings,
    hiringPredictions,
    aiFlaggedData,
    aiSuggestedCandidates,
    requisitionsData,
    fetchAISuggestedCandidates,
    refetch,
    // Predictive Analytics
    hiringPredictionData,
    hiringTrendsData,
    skillsGapData,
  } = useTalentSphereDashboard(filterData);

  // Handle filter changes
  const handleFilterChange = useCallback((filterName, filterValue) => {
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (
        filterValue === "" ||
        filterValue === null ||
        filterValue === undefined ||
        (Array.isArray(filterValue) && filterValue.length === 0)
      ) {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }
      return updatedFilters;
    });
  }, []);

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setFilterData({});
  }, []);

  // Dashboard filters (linked to filterData for hook)
  const dashboardFilters = [
    {
      type: "date-range-filter",
      name: "date_range",
      placeholder: "Select Date Range",
      values: filterData.date_range,
    },
    {
      type: "select-one",
      option: Departments,
      name: "department",
      placeholder: "Department",
      values: filterData.department,
    },
    {
      type: "search",
      name: "job_title",
      placeholder: "Job Title",
      values: filterData.job_title,
      width: "w-[220px]",
    },
    {
      type: "select-two",
      option: [
        { value: "pending", label: "Pending" },
        { value: "approved", label: "Approved" },
        { value: "rejected", label: "Rejected" },
      ],
      name: "requisition_status",
      placeholder: "Requisition Status",
      values: filterData.requisition_status,
    },
    {
      type: "select-three",
      option: [
        { value: "screened", label: "Screened" },
        { value: "interviewed", label: "Interviewed" },
        { value: "offered", label: "Offered" },
        { value: "hired", label: "Hired" },
        { value: "rejected", label: "Rejected" },
      ],
      name: "applicant_status",
      placeholder: "Applicant Status",
      values: filterData.applicant_status,
    },
    {
      type: "select-four",
      option: [
        { value: true, label: "Emiratization" },
        { value: false, label: "Non-Emiratization" },
      ],
      name: "is_emiratization",
      placeholder: "Emiratization",
      values: filterData.is_emiratization,
    },
  ];

  return (
    <div className="flex flex-col gap-4 mb-10">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold text-plum-1100">
                Talent Sphere Dashboard
              </CardTitle>
              <CardDescription className="mt-2">
                Comprehensive recruitment analytics and insights
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <FilterInput
            filters={dashboardFilters}
            filterValues={filterData}
            onChange={handleFilterChange}
            defaultDateRangeTab="None"
            className="justify-end"
          />
        </CardContent>
      </Card>

      {loading && !summaryData ? (
        <PageLoader />
      ) : (
        <>
          {/* KPI Cards */}
          <KPICards data={summaryData} loading={loading} />

          {/* Charts Row 1: Funnel + AI Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <RecruitmentFunnel data={funnelData} loading={loading} />
            </div>
            <div className="lg:col-span-1">
              <AIInsightsWidget
                budgetWarnings={budgetWarnings}
                hiringPredictions={hiringPredictions}
                aiFlaggedData={aiFlaggedData}
                aiSuggestedCandidates={aiSuggestedCandidates}
                fetchAISuggestedCandidates={fetchAISuggestedCandidates}
                loading={loading}
              />
            </div>
          </div>

          {/* Charts Row 2: Interviews + Offers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <UpcomingInterviews data={interviewData} loading={loading} />
            <OfferTrackerWidget data={offerData} loading={loading} />
          </div>

          {/* Charts Row 3: Open Requisitions */}
          <OpenRequisitions data={requisitionsData} loading={loading} />

          {/* Charts Row 4: Sources + Emiratization */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ApplicantSources data={sourceData} loading={loading} />
            <EmiratizationWidget data={emiratizationData} loading={loading} />
          </div>

          {/* Charts Row 5: Predictive Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1">
              <HiringPredictionWidget
                data={hiringPredictionData}
                loading={loading}
              />
            </div>
            <div className="lg:col-span-1">
              <HiringTrendsWidget
                data={hiringTrendsData}
                loading={loading}
              />
            </div>
            <div className="lg:col-span-1">
              <SkillsGapWidget data={skillsGapData} loading={loading} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TalentSphereDashboard;
