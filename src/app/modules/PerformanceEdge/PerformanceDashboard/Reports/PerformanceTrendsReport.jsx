// src/app/modules/PerformanceEdge/PerformanceDashboard/Reports/PerformanceTrendsReport.jsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export function PerformanceTrendsReport({ dashboardData = {} }) {
  const { performance_trend = {} } = dashboardData;

  const trendsData = React.useMemo(() => {
    return (
      performance_trend.monthly_averages?.map((trend) => ({
        month: new Date(trend.month).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
        }),
        average: Number(trend.average_rating).toFixed(1),
      })) || []
    );
  }, [performance_trend.monthly_averages]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Trends Over Time</CardTitle>
      </CardHeader>
      <CardContent className="h-96">
        {trendsData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-neutral-800">
            <p>No trend data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendsData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}`, "Average Rating"]} />
              <Line
                type="monotone"
                dataKey="average"
                stroke="#A78BFA"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
