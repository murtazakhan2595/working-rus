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

  const stats = React.useMemo(() => {
    const scheduleData = weeklyCalendarData.schedule || [];
    
    const totalStaff = scheduleData.reduce(
      (sum, day) => sum + (parseInt(day.Total_Staff) || 0), 0
    );
    
    const workingDays = scheduleData.filter(
      (day) => parseInt(day.Total_Staff) > 0
    ).length;
    
    const averageStaffPerDay = workingDays > 0 ? (totalStaff / workingDays).toFixed(1) : 0;

    return {
      weekPeriod: weeklyCalendarData.week_period || "N/A",
      totalStaff,
      workingDays,
      averageStaffPerDay,
    };
  }, [weeklyCalendarData]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Week Period",
            value: stats.weekPeriod,
            description: "Current week range",
            color: "text-plum-900",
          },
          {
            title: "Total Staff Days",
            value: stats.totalStaff,
            description: "Sum of all shifts",
            color: "text-blue-600",
          },
          {
            title: "Working Days",
            value: stats.workingDays,
            description: "Days with staff",
            color: "text-green-600",
          },
          {
            title: "Avg Staff/Day",
            value: stats.averageStaffPerDay,
            description: "Average per working day",
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
