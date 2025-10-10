import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

const RecruitmentFunnel = ({ data, loading }) => {
  // 🎨 Consistent color mapping by stage name
  const STAGE_COLORS = {
    "Requisitions Raised": "#3B82F6", // Blue - Start of funnel
    RequisitionsRaised: "#3B82F6",
    "Vacancies Published": "#F59E0B", // Orange - Job postings
    VacanciesPublished: "#F59E0B",
    "Total Applicants": "#8B5CF6", // Purple - Candidate pool
    TotalApplicants: "#8B5CF6",
    "Screened Candidates": "#EF4444", // Red - Screening stage
    ScreenedCandidates: "#EF4444",
    "Interviews Scheduled": "#06B6D4", // Cyan - Interview stage
    InterviewsScheduled: "#06B6D4",
    "Offers Generated": "#EC4899", // Pink - Offer stage
    OffersGenerated: "#EC4899",
    "Offers Accepted": "#10B981", // Green - Accepted
    OffersAccepted: "#10B981",
    "Final Hires": "#059669", // Dark Green - Final success
    FinalHires: "#059669",
  };

  // 📊 Data source mapping (from User Story 32)
  const STAGE_DATA_SOURCES = {
    "Requisitions Raised": "Requisition Planning Module",
    RequisitionsRaised: "Requisition Planning Module",
    "Vacancies Published": "Published Vacancy Tab",
    VacanciesPublished: "Published Vacancy Tab",
    "Total Applicants": "All Applicants Tab",
    TotalApplicants: "All Applicants Tab",
    "Screened Candidates": "Screened Applicants Tab",
    ScreenedCandidates: "Screened Applicants Tab",
    "Interviews Scheduled": "Interview Tracker",
    InterviewsScheduled: "Interview Tracker",
    "Offers Generated": "Offer Management Tab",
    OffersGenerated: "Offer Management Tab",
    "Offers Accepted": "Offer Tracker Tab",
    OffersAccepted: "Offer Tracker Tab",
    "Final Hires": "Hired Applicants Tab",
    FinalHires: "Hired Applicants Tab",
  };

  // Fallback colors if stage name doesn't match
  const fallbackColors = [
    "#3B82F6",
    "#F59E0B",
    "#8B5CF6",
    "#EF4444",
    "#06B6D4",
    "#EC4899",
    "#10B981",
    "#059669",
  ];

  // Get color by stage name (consistent across renders)
  const getStageColor = (stageName, index) => {
    // Try exact match first
    if (STAGE_COLORS[stageName]) {
      return STAGE_COLORS[stageName];
    }

    // Try normalized name (remove spaces)
    const normalizedName = stageName?.replace(/\s+/g, "");
    if (STAGE_COLORS[normalizedName]) {
      return STAGE_COLORS[normalizedName];
    }

    // Fallback to index-based color
    return fallbackColors[index % fallbackColors.length];
  };

  // Get data source by stage name
  const getDataSource = (stageName, displayName) => {
    // Try exact match first
    if (STAGE_DATA_SOURCES[stageName]) {
      return STAGE_DATA_SOURCES[stageName];
    }

    // Try normalized name (remove spaces)
    const normalizedName = stageName?.replace(/\s+/g, "");
    if (STAGE_DATA_SOURCES[normalizedName]) {
      return STAGE_DATA_SOURCES[normalizedName];
    }

    // Try display name
    if (STAGE_DATA_SOURCES[displayName]) {
      return STAGE_DATA_SOURCES[displayName];
    }

    return "N/A";
  };

  // Prepare data for visualization
  const chartData = React.useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return [];

    // Calculate total pipeline (first stage count)
    const totalPipeline = data[0]?.count || 0;

    return data.map((item, index) => {
      const displayName =
        item.stage?.replace(/([A-Z])/g, " $1").trim() || "Unknown";
      const percentage =
        totalPipeline > 0
          ? ((item.count / totalPipeline) * 100).toFixed(1)
          : "0.0";

      return {
        ...item,
        displayName,
        color: getStageColor(item.stage, index),
        percentage,
        dataSource: getDataSource(item.stage, displayName),
      };
    });
  }, [data]);

  // Format conversion display
  const formatConversion = (conversion) => {
    if (conversion === null || conversion === undefined) return null;

    // If conversion >= 1, it's a multiplier (expansion)
    if (conversion >= 1) {
      return `${conversion.toFixed(1)}x`;
    }
    // If conversion < 1, it's a percentage (funnel narrowing)
    else {
      return `${(conversion * 100).toFixed(0)}%`;
    }
  };

  // Get conversion explanation
  const getConversionExplanation = (conversion) => {
    if (conversion === null || conversion === undefined) return "";

    if (conversion >= 1) {
      return "per previous stage";
    } else {
      return "conversion rate";
    }
  };

  // Select key stages for bottom stats (avoid cramping)
  const keyStages = React.useMemo(() => {
    if (!chartData || chartData.length === 0) return [];

    // Show stages with conversion data, excluding first stage
    return chartData
      .filter(
        (stage) => stage.conversion !== null && stage.conversion !== undefined
      )
      .slice(0, 4); // Show only first 4 stages with conversion
  }, [chartData]);

  // Custom tooltip - BB-456 FIX: Added percentage and source
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const conversionDisplay = formatConversion(data.conversion);

      return (
        <div className="bg-white p-3 border border-neutral-300 rounded-lg shadow-lg">
          <p className="font-semibold text-sm text-neutral-900">
            {data.displayName}
          </p>
          <p className="text-xs text-neutral-700 mt-1">Count: {data.count}</p>
          <p className="text-xs text-neutral-700">
            Percentage: {data.percentage}%
          </p>
          {conversionDisplay && (
            <p className="text-xs text-neutral-700">
              Conversion: {conversionDisplay}{" "}
              {getConversionExplanation(data.conversion)}
            </p>
          )}
          <p className="text-xs text-neutral-700 mt-1 pt-1 border-t border-neutral-200">
            Source: {data.dataSource}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-plum-900">
            Recruitment Funnel
          </CardTitle>
          <CardDescription>
            Candidate flow through recruitment stages
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[500px]">
          <div className="animate-pulse flex flex-col space-y-4">
            <div className="h-8 bg-gray-300 rounded w-full"></div>
            <div className="h-8 bg-gray-300 rounded w-11/12"></div>
            <div className="h-8 bg-gray-300 rounded w-10/12"></div>
            <div className="h-8 bg-gray-300 rounded w-9/12"></div>
            <div className="h-8 bg-gray-300 rounded w-8/12"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-plum-900">
            Recruitment Funnel
          </CardTitle>
          <CardDescription>
            Candidate flow through recruitment stages
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[500px] flex items-center justify-center">
          <p className="text-neutral-500">No funnel data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-plum-900">
          Recruitment Funnel
        </CardTitle>
        <CardDescription>
          Track candidate progression through {chartData.length} recruitment
          stages
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[500px] flex flex-col">
        {/* Chart Section */}
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 140, bottom: 20 }}
            >
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="displayName"
                tick={{ fontSize: 11 }}
                width={130}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion Stats Section */}
        {keyStages.length > 0 && (
          <div className="mt-6 pt-4 border-t border-neutral-200">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {keyStages.map((stage, index) => {
                const conversionDisplay = formatConversion(stage.conversion);
                const isExpansion = stage.conversion >= 1;

                return (
                  <div
                    key={index}
                    className="p-3 bg-neutral-100 rounded-lg border border-neutral-300"
                  >
                    <p
                      className="text-xs text-neutral-1000 truncate mb-1"
                      title={stage.displayName}
                    >
                      {stage.displayName}
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        isExpansion
                          ? "text-blue-600"
                          : stage.conversion >= 0.5
                          ? "text-green-600"
                          : stage.conversion >= 0.2
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {conversionDisplay}
                    </p>
                    <p className="text-[10px] text-neutral-1000 mt-1">
                      {isExpansion ? "Multiplier" : "Conversion"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecruitmentFunnel;
