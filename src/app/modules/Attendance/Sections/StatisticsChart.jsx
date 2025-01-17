"use client";

import React from "react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "components/ui/card"; // Adjust import path if needed


const barColors = {
  Present: "#7BE0AD", // Light green
  Absent: "#F48FB1", // Pink
  Late: "#FBC02D", // Yellow
};

export function StatisticsChart({ weeklySummary }) {
  const chartData = React.useMemo(() => {
    return [
      {
        week: `W1`,
        Present:
          weeklySummary && weeklySummary[0] ? weeklySummary[0].Present : 0,
        Absent: weeklySummary && weeklySummary[0] ? weeklySummary[0].Absent : 0,
        Late: weeklySummary && weeklySummary[0] ? weeklySummary[0].Late : 0,
      },
      {
        week: `W2`,
        Present:
          weeklySummary && weeklySummary[1] ? weeklySummary[1].Present : 0,
        Absent: weeklySummary && weeklySummary[1] ? weeklySummary[1].Absent : 0,
        Late: weeklySummary && weeklySummary[1] ? weeklySummary[1].Late : 0,
      },
      {
        week: `W3`,
        Present:
          weeklySummary && weeklySummary[2] ? weeklySummary[2].Present : 0,
        Absent: weeklySummary && weeklySummary[2] ? weeklySummary[2].Absent : 0,
        Late: weeklySummary && weeklySummary[2] ? weeklySummary[2].Late : 0,
      },
      {
        week: `W4`,
        Present:
          weeklySummary && weeklySummary[3] ? weeklySummary[3].Present : 0,
        Absent: weeklySummary && weeklySummary[3] ? weeklySummary[3].Absent : 0,
        Late: weeklySummary && weeklySummary[3] ? weeklySummary[3].Late : 0,
      },
    ];
  }, [weeklySummary]);

  return (
    <Card className="flex flex-col shadow-lg border rounded-xl bg-white  min-w-[33%]">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-plum-900">
          Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
          >
            <XAxis
              dataKey="week"
              tick={{ fontSize: 12 }}
              label={{ value: "Weeks", position: "insideBottom", offset: -10 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{ fontSize: "12px" }}
              formatter={(value, name) => [`${value}`, name]}
            />
            <Legend
              verticalAlign="top"
              wrapperStyle={{ fontSize: "12px", top: 10 }}
            />
            <Bar
              dataKey="Present"
              fill={barColors.Present}
              name="Present"
              barSize={20}
            />
            <Bar
              dataKey="Absent"
              fill={barColors.Absent}
              name="Absent"
              barSize={20}
            />
            <Bar
              dataKey="Late"
              fill={barColors.Late}
              name="Late"
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
