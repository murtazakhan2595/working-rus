"use client";

import * as React from "react";
import { Pie, PieChart, Cell, Legend } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card";

// Define color mapping for different leave types
const colorMap = {
  "Sick Leaves": "#DDA0DD",
  "Annual Leaves": "#A020F0",
  "Personal Leaves": "#E6E6FA",
};

export function LeaveStatusOverview({ leaveStatus }) {
  // Transform API data into chart format
  const chartData =
    leaveStatus?.leave_details?.map((item) => ({
      name: item.leave_name,
      value: item.count,
      color: colorMap[item.leave_name] || "#E6E6FA", // Fallback color if type not in mapping
    })) || [];

  const totalLeaves = leaveStatus?.total_employees_on_leave || 0;

  console.log("chartData", chartData);

  return (
    <Card className="flex flex-col shadow-lg border rounded-xl bg-white p-6 min-w-[33%]">
      <CardHeader className="pb-4 text-center">
        <CardTitle className="text-xl font-bold text-plum-900">
          Leave Status Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        <PieChart width={200} height={200}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-plum-900"
            style={{ fontSize: "24px", fontWeight: "bold" }}
          >
            {totalLeaves}
          </text>
          <text
            x="50%"
            y="65%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-gray-500"
            style={{ fontSize: "14px" }}
          >
            Total on Leaves
          </text>
        </PieChart>
      </CardContent>
      <CardDescription className="mt-4 text-left text-sm">
        <ul className="space-y-2">
          {chartData.map((item, index) => (
            <li key={index} className="flex justify-between">
              <span className="flex items-center gap-2">
                <span
                  className="block w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></span>
                {item.name}
              </span>
              <span className="font-bold text-gray-700">{item.value}</span>
            </li>
          ))}
        </ul>
      </CardDescription>
    </Card>
  );
}
