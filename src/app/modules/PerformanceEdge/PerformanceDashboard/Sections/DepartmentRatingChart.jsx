// src/app/modules/PerformanceEdge/PerformanceDashboard/Sections/DepartmentRatingChart.jsx
import React from "react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "components/ui/card";
import { ScrollArea } from "src/@/components/ui/scroll-area";

export function DepartmentRatingChart({ dashboardData = {} }) {
  const { average_ratings = {} } = dashboardData;

  // Prepare department ratings data
  const departmentRatingsData = React.useMemo(() => {
    const deptRatings = average_ratings.by_department || [];
    return deptRatings.map((dept) => ({
      department:
        dept.dept_name?.substring(0, 12) +
          (dept.dept_name?.length > 12 ? "..." : "") || "Unknown",
      fullName: dept.dept_name || "Unknown Department",
      average: Number(dept.average).toFixed(1) || 0,
      count: dept.count || 0,
    }));
  }, [average_ratings.by_department]);

  const overallAverage =
    Number(average_ratings.overall_average).toFixed(1) || "0.0";

  return (
    <Card className="flex flex-col shadow-lg border rounded-xl bg-white min-w-[400px]">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-plum-900">
          Average Rating by Department
        </CardTitle>
        <div className="text-sm text-neutral-800">
          Organization Average:{" "}
          <span className="font-semibold text-plum-900">{overallAverage}</span>
        </div>
      </CardHeader>
      <CardContent>
        {departmentRatingsData.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-neutral-800">
            <p>No department rating data available</p>
          </div>
        ) : (
          <>
            {/* Chart */}
            <div className="h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={departmentRatingsData}
                  margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
                >
                  <XAxis
                    dataKey="department"
                    tick={{ fontSize: 11 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 12 }} domain={[0, "dataMax + 1"]} />
                  <Tooltip
                    contentStyle={{ fontSize: "12px" }}
                    formatter={(value, name, props) => [
                      `${value}`,
                      `Avg Rating (${props.payload.count} evaluations)`,
                    ]}
                    labelFormatter={(label, payload) =>
                      payload?.[0]?.payload?.fullName || label
                    }
                  />
                  <Bar
                    dataKey="average"
                    fill="#A78BFA"
                    name="Average Rating"
                    barSize={40}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Department List */}
            <ScrollArea className="[&>div>div[style]]:!block">
              <div className="space-y-2 max-h-32">
                {departmentRatingsData.map((dept, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded"
                  >
                    <div className="flex-1">
                      <p
                        className="text-sm font-medium text-neutral-1000 truncate"
                        title={dept.fullName}
                      >
                        {dept.fullName}
                      </p>
                      <p className="text-xs text-neutral-800">
                        {dept.count} evaluations
                      </p>
                    </div>
                    <div className="ml-2">
                      <span className="text-lg font-semibold text-plum-900">
                        {dept.average}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </>
        )}
      </CardContent>
    </Card>
  );
}
