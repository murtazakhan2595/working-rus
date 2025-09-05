// src/app/modules/PerformanceEdge/PerformanceDashboard/Reports/DepartmentComparisonReport.jsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export function DepartmentComparisonReport({ dashboardData = {} }) {
  const { average_ratings = {} } = dashboardData;

  const departmentData = React.useMemo(() => {
    return (
      average_ratings.by_department?.map((dept) => ({
        department: dept.dept_name,
        average: Number(dept.average).toFixed(1),
        count: dept.count,
      })) || []
    );
  }, [average_ratings.by_department]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Departmental Performance Comparison</CardTitle>
      </CardHeader>
      <CardContent className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={departmentData}>
            <XAxis
              dataKey="department"
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis />
            <Tooltip
              formatter={(value, name) => [`${value}`, "Average Rating"]}
            />
            <Bar dataKey="average" fill="#7BE0AD" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
