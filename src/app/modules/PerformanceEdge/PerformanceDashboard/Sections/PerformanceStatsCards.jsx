// src/app/modules/PerformanceEdge/PerformanceDashboard/Sections/PerformanceStatsCards.jsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "components/ui/card";

export function PerformanceStatsCards({
  dashboardData = {},
  loading = false,
  onCardClick = () => {},
}) {
  const {
    total_evaluations = {},
    completion_rates = {},
    average_ratings = {},
    calibration_summary = {},
    top_performers = [],
  } = dashboardData;

  const handleCardClicked = (event, cardType) => {
    event.preventDefault();
    event.stopPropagation();
    onCardClick(cardType);
  };

  const statsData = [
    {
      title: "Total Evaluations",
      value: total_evaluations.count || 0,
      type: "total",
      description: "All evaluation instances",
    },
    {
      title: "Completed",
      value: completion_rates.overall?.completed || 0,
      type: "completed",
      description: `${
        completion_rates.overall?.percentage || 0
      }% completion rate`,
    },
    {
      title: "Pending",
      value: completion_rates.overall?.pending || 0,
      type: "pending",
      description: "Evaluations in progress",
    },
    {
      title: "Average Rating",
      value: average_ratings.overall_average
        ? Number(average_ratings.overall_average).toFixed(1)
        : "0.0",
      type: "rating",
      description: "Organization wide",
    },
    {
      title: "Top Performers",
      value: new Set(top_performers?.map((p) => p.employee_id)).size || 0,
      type: "performers",
      description: "High achievers",
    },
    {
      title: "Calibrations",
      value: calibration_summary.total_calibrations || 0,
      type: "calibrations",
      description: `Avg adjustment: ${calibration_summary.avg_adjustment || 0}`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 w-full">
      {statsData.map((stat, index) => (
        <Card
          key={index}
          className="flex flex-col justify-center shadow-md border rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
          onClick={(event) => handleCardClicked(event, stat.type)}
        >
          {loading ? (
            <div className="animate-pulse">
              <CardHeader className="pb-2">
                <CardTitle className="h-4 bg-gray-300 rounded w-2/3"></CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-300 rounded w-1/2"></div>
              </CardContent>
            </div>
          ) : (
            <>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-neutral-900">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-medium text-plum-900">
                  {stat.value}
                </p>
                <p className="text-xs text-neutral-800 mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </>
          )}
        </Card>
      ))}
    </div>
  );
}
