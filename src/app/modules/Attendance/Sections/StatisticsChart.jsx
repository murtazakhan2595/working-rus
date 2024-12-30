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

const chartData = [
  { week: "W1", category1: 150, category2: 10, category3: 5 },
  { week: "W2", category1: 150, category2: 12, category3: 6 },
  { week: "W3", category1: 150, category2: 9, category3: 4 },
  { week: "W4", category1: 150, category2: 15, category3: 7 },
];

const barColors = {
  category1: "#7BE0AD", // Light green
  category2: "#F48FB1", // Pink
  category3: "#FBC02D", // Yellow
};

export function StatisticsChart() {
  return (
    <Card className="flex flex-col shadow-lg border rounded-xl bg-white  min-w-[33%]">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-plum-900">Statistics</CardTitle>
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
              dataKey="category1"
              fill={barColors.category1}
              name="Category 1"
              barSize={20}
            />
            <Bar
              dataKey="category2"
              fill={barColors.category2}
              name="Category 2"
              barSize={20}
            />
            <Bar
              dataKey="category3"
              fill={barColors.category3}
              name="Category 3"
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
