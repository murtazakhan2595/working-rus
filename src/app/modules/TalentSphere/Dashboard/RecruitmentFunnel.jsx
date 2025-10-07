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
  // Colors for funnel stages (gradient)
  const colors = [
    "#3B82F6", // Blue
    "#60A5FA", // Light Blue
    "#8B5CF6", // Purple
    "#A78BFA", // Light Purple
    "#EC4899", // Pink
    "#F472B6", // Light Pink
    "#10B981", // Green
    "#34D399", // Light Green
  ];

  // Prepare data for visualization
  const chartData = React.useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return [];

    return data.map((item, index) => ({
      ...item,
      displayName: item.stage?.replace(/([A-Z])/g, " $1").trim() || "Unknown",
      color: colors[index % colors.length],
    }));
  }, [data]);

  // Format conversion display
  const formatConversion = (conversion, stageName) => {
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

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const conversionDisplay = formatConversion(data.conversion);

      return (
        <div className="bg-white p-3 border border-neutral-300 rounded-lg shadow-lg">
          <p className="font-semibold text-neutral-900">{data.displayName}</p>
          <p className="text-sm text-neutral-700">Count: {data.count}</p>
          {conversionDisplay && (
            <p className="text-sm text-neutral-700">
              Conversion: {conversionDisplay}{" "}
              {getConversionExplanation(data.conversion)}
            </p>
          )}
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

        {/* Conversion Stats Section - FIXED LAYOUT */}
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
