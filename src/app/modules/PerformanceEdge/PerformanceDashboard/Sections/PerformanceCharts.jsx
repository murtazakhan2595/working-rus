// src/app/modules/PerformanceEdge/PerformanceDashboard/Sections/PerformanceCharts.jsx
import React from "react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "components/ui/card";

const barColors = {
  completed: "#7BE0AD",
  pending: "#FBC02D",
  total: "#A78BFA",
};

const ratingColors = ["#F87171", "#FBBF24", "#FBC02D", "#34D399", "#10B981"];

export function PerformanceCharts({ dashboardData = {} }) {
  const {
    completion_rates = {},
    rating_distribution = {},
    total_evaluations = {},
  } = dashboardData;

  // Prepare completion rates chart data
  const completionChartData = React.useMemo(() => {
    const departmentData = completion_rates.by_department || [];
    return departmentData.map((dept) => ({
      department:
        dept.dept_name?.substring(0, 15) +
          (dept.dept_name?.length > 15 ? "..." : "") || "Unknown",
      completed: dept.completed || 0,
      pending: dept.pending || 0,
      percentage: dept.percentage || 0,
    }));
  }, [completion_rates.by_department]);

  // Prepare rating distribution chart data
  const ratingChartData = React.useMemo(() => {
    const distribution = rating_distribution || {};
    return Object.entries(distribution).map(([rating, count], index) => ({
      rating: `Rating ${rating}`,
      count: count || 0,
      color: ratingColors[index] || "#E5E7EB",
    }));
  }, [rating_distribution]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
      {/* Completion Rates by Department */}
      <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-plum-900">
            Completion Rates by Department
          </CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={completionChartData}
              margin={{ top: 20, right: 20, left: 0, bottom: 60 }}
            >
              <XAxis
                dataKey="department"
                tick={{ fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ fontSize: "12px" }}
                formatter={(value, name) => [
                  `${value}`,
                  name === "completed" ? "Completed" : "Pending",
                ]}
              />
              <Legend
                verticalAlign="top"
                wrapperStyle={{ fontSize: "12px", top: 10 }}
              />
              <Bar
                dataKey="completed"
                fill={barColors.completed}
                name="Completed"
                barSize={30}
              />
              <Bar
                dataKey="pending"
                fill={barColors.pending}
                name="Pending"
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Rating Distribution */}
      <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-plum-900">
            Rating Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ratingChartData}
                dataKey="count"
                nameKey="rating"
                cx="50%"
                cy="50%"
                outerRadius={80}
                paddingAngle={2}
                stroke="none"
              >
                {ratingChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value}`, name]}
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
  );
}
