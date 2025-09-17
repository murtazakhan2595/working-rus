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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
// ============================================================================
// HOLIDAY SPECIAL SHIFT REPORT COMPONENT
// ============================================================================
import { getHolidaySpecialShiftReportData } from "app/hooks/reports";
import { HolidaySpecialShiftReportColumns } from "../TableColumns/AttendanceShiftTableColumns";

export const HolidaySpecialShiftReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [holidaySpecialData, setHolidaySpecialData] = useState({
    month: "",
    results: [],
    aggregated_stats: null,
  });

  // Chart colors
  const typeColors = ["#3B82F6", "#8B5CF6"];

  const fetchHolidaySpecialData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
      };

      const response = await getHolidaySpecialShiftReportData(payload);
      if (response) {
        setHolidaySpecialData(response);
      }
    } catch (error) {
      console.error("Error fetching holiday special shift data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchHolidaySpecialData();
    }
  }, [filterData, permittedViewFilterData]);

  // Calculate stats from aggregated data only
  const stats = {
    month: holidaySpecialData.month || "N/A",
    totalSpecialShifts: holidaySpecialData.aggregated_stats?.total_special_shifts || 0,
    uniqueStaffAssigned: holidaySpecialData.aggregated_stats?.unique_staff_assigned || 0,
    holidayShifts: holidaySpecialData.aggregated_stats?.by_type?.Holiday || 0,
    specialAssignments: holidaySpecialData.aggregated_stats?.by_type?.["Special Assignment"] || 0,
    totalHolidayHours: holidaySpecialData.aggregated_stats?.total_holiday_hours || 0,
  };

  // Shift type distribution chart data
  const shiftTypeChartData = React.useMemo(() => {
    if (!holidaySpecialData.aggregated_stats?.by_type) return [];

    return Object.entries(holidaySpecialData.aggregated_stats.by_type)
      .map(([type, count]) => ({
        type,
        count,
        percentage: stats.totalSpecialShifts > 0 ? Math.round((count / stats.totalSpecialShifts) * 100) : 0,
      }))
      .filter(item => item.count > 0);
  }, [holidaySpecialData.aggregated_stats, stats.totalSpecialShifts]);

  // Staff assignment analysis
  const staffAssignmentData = React.useMemo(() => {
    if (!holidaySpecialData.aggregated_stats) return [];

    return [
      {
        metric: "Total Shifts",
        value: stats.totalSpecialShifts,
      },
      {
        metric: "Unique Staff",
        value: stats.uniqueStaffAssigned,
      },
      {
        metric: "Avg Shifts per Staff",
        value: stats.uniqueStaffAssigned > 0 ? (stats.totalSpecialShifts / stats.uniqueStaffAssigned).toFixed(1) : 0,
      },
    ];
  }, [holidaySpecialData.aggregated_stats, stats]);

  return (
    <div className="space-y-6">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          {
            title: "Report Month",
            value: stats.month,
            description: "Reporting period",
            color: "text-plum-900",
          },
          {
            title: "Total Shifts",
            value: stats.totalSpecialShifts.toLocaleString(),
            description: "Holiday/special shifts",
            color: "text-blue-600",
          },
          {
            title: "Special Assignments",
            value: stats.specialAssignments.toLocaleString(),
            description: "Special duty shifts",
            color: "text-purple-600",
          },
          {
            title: "Holiday Shifts",
            value: stats.holidayShifts.toLocaleString(),
            description: "Holiday shifts",
            color: "text-orange-600",
          },
          {
            title: "Unique Staff",
            value: stats.uniqueStaffAssigned.toLocaleString(),
            description: "Staff assigned",
            color: "text-green-600",
          },
          {
            title: "Total Hours",
            value: `${stats.totalHolidayHours.toLocaleString()}h`,
            description: "Holiday hours worked",
            color: "text-red-600",
          },
        ].map((stat, index) => (
          <Card
            key={index}
            className="flex flex-col justify-center shadow-md border rounded-lg"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-neutral-900">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-3xl font-medium ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-xs text-neutral-800 mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Shift Type Distribution */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Shift Type Distribution
            </CardTitle>
            <CardDescription>
              Breakdown of holiday and special assignment shifts
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={shiftTypeChartData}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="none"
                >
                  {shiftTypeChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={typeColors[index % typeColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${value.toLocaleString()} shifts (${
                      shiftTypeChartData.find((d) => d.type === name)?.percentage
                    }%)`,
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
          </CardContent>
        </Card>

        {/* Staff Assignment Analysis */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Staff Assignment Overview
            </CardTitle>
            <CardDescription>
              Analysis of staff allocation for special shifts
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={staffAssignmentData}
                margin={{ top: 20, right: 20, left: 0, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="metric"
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ fontSize: "12px" }}
                  formatter={(value, name) => [value, "Value"]}
                />
                <Bar
                  dataKey="value"
                  fill="#8B5CF6"
                  name="Count"
                  barSize={60}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Holiday Special Shift Table */}
      <Card>
        <CardHeader>
          <CardTitle>Holiday & Special Shift Report</CardTitle>
          <CardDescription>
            Track staff assigned to work on holidays and special occasions for
            proper compensation and workforce management.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={HolidaySpecialShiftReportColumns()}
              data={holidaySpecialData.results}
              pagination={false}
              fallbackText="No holiday/special shift data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};