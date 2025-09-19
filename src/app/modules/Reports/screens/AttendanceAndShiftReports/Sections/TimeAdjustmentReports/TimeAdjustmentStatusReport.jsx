import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getTimeAdjustmentStatusReportData } from "app/hooks/reports";
import { TimeAdjustmentStatusColumns } from "../../TableColumns/TimeAdjustmentColumns";


const TimeAdjustmentStatusReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState({
    results: [],
    count: 0,
  });

  const statusColors = ["#10B981", "#F59E0B", "#EF4444", "#3B82F6"];

  const fetchStatusData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = { filterData: combinedFilters };
      const response = await getTimeAdjustmentStatusReportData(payload);
      if (response) {
        setStatusData(response);
      }
    } catch (error) {
      console.error("Error fetching status data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchStatusData();
    }
  }, [filterData, permittedViewFilterData]);

  const chartData = statusData.results.filter(
    (item) => item.Status !== "Total"
  );

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statusData.results.map((stat, index) => (
          <Card
            key={index}
            className="flex flex-col justify-center shadow-md border rounded-lg"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-neutral-900">
                {stat.Status}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={`text-3xl font-medium ${
                  stat.Status === "Approved"
                    ? "text-green-600"
                    : stat.Status === "Pending"
                    ? "text-yellow-600"
                    : stat.Status === "Rejected"
                    ? "text-red-600"
                    : "text-blue-600"
                }`}
              >
                {stat.Count?.toLocaleString() || 0}
              </p>
              <p className="text-xs text-neutral-800 mt-1">
                {stat["% of Total"]} of all requests
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Status Chart */}
      <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-plum-900">
            Time Adjustment Status Overview
          </CardTitle>
          <CardDescription>
            Visual breakdown of request statuses
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-80">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="Count"
                  nameKey="Status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={statusColors[index % statusColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${value?.toLocaleString()} requests`,
                    name,
                  ]}
                  contentStyle={{ fontSize: "12px" }}
                />
                <Legend
                  verticalAlign="bottom"
                  wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-gray-500">
              <p>No status data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Table */}
      <Card>
        <CardHeader>
          <CardTitle>Adjustment Status Breakdown</CardTitle>
          <CardDescription>
            Summary of time adjustment request statuses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={TimeAdjustmentStatusColumns()}
              data={statusData.results}
              pagination={false}
              fallbackText="No status data available"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeAdjustmentStatusReport;