// ============================================================================
// WEEKLY SHIFT CALENDAR REPORT COMPONENT
// ============================================================================
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { getWeeklyShiftCalendarData } from "app/hooks/reports";
import { WeeklyShiftCalendarColumns } from "../TableColumns/AttendanceShiftTableColumns";

export const WeeklyShiftCalendarReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [weeklyCalendarData, setWeeklyCalendarData] = useState({
    week_period: "",
    schedule: [],
    aggregated_stats: null,
  });

  const fetchWeeklyCalendarData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
      };

      const response = await getWeeklyShiftCalendarData(payload);
      if (response) {
        setWeeklyCalendarData(response);
      }
    } catch (error) {
      console.error("Error fetching weekly calendar data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchWeeklyCalendarData();
    }
  }, [filterData, permittedViewFilterData]);

  // Calculate stats from aggregated data only
  const stats = {
    weekPeriod: weeklyCalendarData.week_period || "N/A",
    totalStaffAssignments:
      weeklyCalendarData.aggregated_stats?.total_staff_assignments || 0,
    workingDays: weeklyCalendarData.aggregated_stats?.working_days || 0,
    morningShift: weeklyCalendarData.aggregated_stats?.by_shift?.Morning || 0,
    eveningShift: weeklyCalendarData.aggregated_stats?.by_shift?.Evening || 0,
    nightShift: weeklyCalendarData.aggregated_stats?.by_shift?.Night || 0,
    avgStaffPerDay: weeklyCalendarData.aggregated_stats?.avg_staff_per_day || 0,
  };

  // Daily staff distribution chart data (using schedule data - this is correct as it's not paginated)
  const dailyStaffChartData = React.useMemo(() => {
    if (!weeklyCalendarData.schedule?.length) return [];

    return weeklyCalendarData.schedule.map((day) => ({
      day: day.Day,
      date: day.Date,
      morning: parseInt(day.Morning_09_18?.replace("-", "0")) || 0,
      evening: parseInt(day.Evening_14_23?.replace("-", "0")) || 0,
      night: parseInt(day.Night_22_07?.replace("-", "0")) || 0,
      total: parseInt(day.Total_Staff) || 0,
    }));
  }, [weeklyCalendarData.schedule]);

  // Shift distribution chart data from aggregated stats
  const shiftDistributionData = React.useMemo(() => {
    if (!weeklyCalendarData.aggregated_stats?.by_shift) return [];

    return [
      {
        shift: "Morning (09-18)",
        count: stats.morningShift,
        percentage:
          stats.totalStaffAssignments > 0
            ? Math.round(
                (stats.morningShift / stats.totalStaffAssignments) * 100
              )
            : 0,
      },
      {
        shift: "Evening (14-23)",
        count: stats.eveningShift,
        percentage:
          stats.totalStaffAssignments > 0
            ? Math.round(
                (stats.eveningShift / stats.totalStaffAssignments) * 100
              )
            : 0,
      },
      {
        shift: "Night (22-07)",
        count: stats.nightShift,
        percentage:
          stats.totalStaffAssignments > 0
            ? Math.round((stats.nightShift / stats.totalStaffAssignments) * 100)
            : 0,
      },
    ].filter((item) => item.count > 0);
  }, [weeklyCalendarData.aggregated_stats, stats]);

  return (
    <div className="space-y-6">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          {
            title: "Week Period",
            value: stats.weekPeriod,
            description: "Current week range",
            color: "text-plum-900",
          },
          {
            title: "Total Staff Assignments",
            value: stats.totalStaffAssignments.toLocaleString(),
            description: "Sum of all shifts",
            color: "text-blue-600",
          },
          {
            title: "Working Days",
            value: stats.workingDays.toLocaleString(),
            description: "Days with staff",
            color: "text-green-600",
          },
          {
            title: "Morning Shifts",
            value: stats.morningShift.toLocaleString(),
            description: "09:00-18:00",
            color: "text-yellow-600",
          },
          {
            title: "Evening Shifts",
            value: stats.eveningShift.toLocaleString(),
            description: "14:00-23:00",
            color: "text-orange-600",
          },
          {
            title: "Night Shifts",
            value: stats.nightShift.toLocaleString(),
            description: "22:00-07:00",
            color: "text-purple-600",
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
        {/* Daily Staff Distribution */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Daily Staff Distribution
            </CardTitle>
            <CardDescription>
              Staff allocation across the week by day
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dailyStaffChartData}
                margin={{ top: 20, right: 20, left: 0, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ fontSize: "12px" }}
                  formatter={(value, name) => [`${value} staff`, name]}
                />
                <Bar
                  dataKey="morning"
                  fill="#F59E0B"
                  name="Morning"
                  stackId="shifts"
                />
                <Bar
                  dataKey="evening"
                  fill="#EF4444"
                  name="Evening"
                  stackId="shifts"
                />
                <Bar
                  dataKey="night"
                  fill="#8B5CF6"
                  name="Night"
                  stackId="shifts"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Staff Trend */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Weekly Staff Trend
            </CardTitle>
            <CardDescription>
              Total staff allocation trend throughout the week
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dailyStaffChartData}
                margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ fontSize: "12px" }}
                  formatter={(value) => [`${value} staff`, "Total Staff"]}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: "#3B82F6", strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: "#3B82F6", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Calendar Table */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Shift Calendar</CardTitle>
          <CardDescription>
            Visual calendar view showing shift assignments across morning,
            evening, and night shifts for effective weekly planning.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={WeeklyShiftCalendarColumns()}
              data={weeklyCalendarData.schedule}
              pagination={false}
              fallbackText="No weekly shift calendar data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
