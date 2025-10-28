// src/app/modules/ClearanceAndHandOver/Sections/AnalyticsCharts.jsx

import React, { useState } from "react";
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
import { ChevronDown, ChevronUp } from "lucide-react";

// Color palettes
const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#00ff00",
  "#ff00ff",
];

// Updated SLA colors to include NO_SLA status
const SLA_COLORS = {
  "Within SLA": "#10b981",
  "At Risk": "#f59e0b",
  Breached: "#ef4444",
  "No SLA": "#6b7280", // Gray for items without SLA
};

const DepartmentChart = ({ data }) => {
  const [showAllLegend, setShowAllLegend] = useState(false);
  const INITIAL_LEGEND_ITEMS = 5;

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

  const hasMoreItems = chartData.length > INITIAL_LEGEND_ITEMS;
  const displayedData = showAllLegend
    ? chartData
    : chartData.slice(0, INITIAL_LEGEND_ITEMS);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={170}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [value, name]} />
          </PieChart>
        </ResponsiveContainer>

        {/* Custom Legend */}
        <div className="mt-4 space-y-2">
          <div className="grid grid-cols-1 gap-1 text-sm">
            {displayedData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: entry.fill }}
                />
                <span className="truncate flex-1" title={entry.name}>
                  {entry.name}: {entry.value}
                </span>
              </div>
            ))}
          </div>

          {hasMoreItems && (
            <button
              onClick={() => setShowAllLegend(!showAllLegend)}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium mt-2"
            >
              {showAllLegend ? (
                <>
                  <ChevronUp size={16} />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown size={16} />
                  Show {chartData.length - INITIAL_LEGEND_ITEMS} More
                </>
              )}
            </button>
          )}
        </div>
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
  // Calculate SLA status counts from enhanced data using dynamic SLA
  const slaStats =
    enhancedData?.reduce((acc, item) => {
      const status = item.sla_status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {}) || {};

  // Map status keys to display names
  const statusDisplayMap = {
    WITHIN_SLA: "Within SLA",
    AT_RISK: "At Risk",
    BREACHED: "Breached",
    NO_SLA: "No SLA", // New status for items without SLA defined
  };

  const chartData = Object.keys(slaStats).map((status) => ({
    name: statusDisplayMap[status] || status,
    value: slaStats[status],
    fill: SLA_COLORS[statusDisplayMap[status]] || "#8884d8",
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
  const withinSLACount = slaStats["WITHIN_SLA"] || 0;
  const noSLACount = slaStats["NO_SLA"] || 0;

  // Calculate compliance rate excluding items without SLA
  const requestsWithSLA = totalRequests - noSLACount;
  const complianceRate =
    requestsWithSLA > 0
      ? Math.round((withinSLACount / requestsWithSLA) * 100)
      : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          SLA Compliance {requestsWithSLA > 0 ? `(${complianceRate}%)` : ""}
        </CardTitle>
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
        {noSLACount > 0 && (
          <div className="text-xs text-gray-500 mt-2 text-center">
            * {noSLACount} items without SLA excluded from compliance
            calculation
          </div>
        )}
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