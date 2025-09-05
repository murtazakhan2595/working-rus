// src/app/modules/PerformanceEdge/PerformanceDashboard/Reports/PerformanceDistributionReport.jsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

const ratingColors = ["#F87171", "#FBBF24", "#FBC02D", "#34D399", "#10B981"];

export function PerformanceDistributionReport({ dashboardData = {} }) {
  const { rating_distribution = {}, total_evaluations = {} } = dashboardData;

  // Prepare rating distribution data with percentages
  const distributionData = React.useMemo(() => {
    const total = Object.values(rating_distribution).reduce(
      (sum, count) => sum + count,
      0
    );
    return Object.entries(rating_distribution).map(
      ([rating, count], index) => ({
        rating: `Rating ${rating}`,
        count: count || 0,
        percentage: total > 0 ? ((count / total) * 100).toFixed(1) : 0,
        color: ratingColors[index] || "#E5E7EB",
      })
    );
  }, [rating_distribution]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Performance Distribution (Pie Chart)</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distributionData}
                dataKey="count"
                nameKey="rating"
                cx="50%"
                cy="50%"
                outerRadius={100}
                paddingAngle={2}
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [
                  `${value} employees (${
                    distributionData.find((d) => d.rating === name)?.percentage
                  }%)`,
                  name,
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Distribution (Bar Chart)</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distributionData}>
              <XAxis dataKey="rating" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [
                  `${value} employees (${
                    distributionData.find((d) => d.rating === name)?.percentage
                  }%)`,
                  "Count",
                ]}
              />
              <Bar dataKey="count" fill="#A78BFA" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
