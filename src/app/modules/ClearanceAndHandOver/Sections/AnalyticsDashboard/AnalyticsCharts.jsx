// src/app/modules/ClearanceAndHandOver/Sections/AnalyticsCharts.jsx

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

// Color palettes
const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#00ff00",
  "#ff00ff",
];
const SLA_COLORS = {
  "Within SLA": "#10b981",
  "At Risk": "#f59e0b",
  Breached: "#ef4444",
};

const DepartmentChart = ({ data }) => {
  const chartData =
    data?.map((item, index) => ({
      name: item.department__name,
      value: item.count,
      fill: COLORS[index % COLORS.length],
    })) || [];

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Department Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-gray-500">No data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const ClearanceTypeChart = ({ data }) => {
  const chartData =
    data?.map((item) => ({
      name: item.clearance_type__name,
      count: item.count,
    })) || [];

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Clearance Type Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-gray-500">No data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clearance Type Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const SLAComplianceChart = ({ enhancedData }) => {
  // Calculate SLA status counts from enhanced data
  const slaStats =
    enhancedData?.reduce((acc, item) => {
      const status = item.sla_status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {}) || {};

  const chartData = Object.keys(slaStats).map((status) => ({
    name: status.replace("_", " "),
    value: slaStats[status],
    fill: SLA_COLORS[status.replace("_", " ")] || "#8884d8",
  }));

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>SLA Compliance</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-gray-500">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const totalRequests = enhancedData?.length || 0;
  const complianceRate =
    totalRequests > 0
      ? Math.round(((slaStats["WITHIN_SLA"] || 0) / totalRequests) * 100)
      : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>SLA Compliance ({complianceRate}%)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const AnalyticsCharts = ({ apiData, enhancedData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <DepartmentChart data={apiData.department_summary} />
      <ClearanceTypeChart data={apiData.type_summary} />
      <SLAComplianceChart enhancedData={enhancedData} />
    </div>
  );
};

export default AnalyticsCharts;
