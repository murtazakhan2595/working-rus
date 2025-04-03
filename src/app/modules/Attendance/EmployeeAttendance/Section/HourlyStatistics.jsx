import React, { useEffect, useState } from "react";
import { getAttendance, getShiftById } from "app/hooks/attendance";
import moment from "moment";
import { CalculateHoursWorked } from "app/modules/Attendance/Sections/CalculateWorkHours";
import { Progress } from "src/@/components/ui/progress";
import { PageLoader } from "components";
import { GetDateRange, GetShiftTotalHours } from "utils/renderValues";
import { formatDuration, calculateTotal } from "utils/renderValues";

const calculateAttendanceStats = (attendance) => {
  const totalHours = CalculateHoursWorked(attendance);
  const total = calculateTotal(attendance, "total_hours");
  return {
    value: totalHours.totalWorkedHours,
    total: total,
  };
};

const HourlyStatistics = ({ userId}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [todayAttendanceData, setTodayAttendanceData] = useState({});
  const [weeklyAttendanceData, setWeeklyAttendanceData] = useState({});
  const [monthlyAttendanceData, setMonthlyAttendanceData] = useState({});
  const [remainingAttendanceData, setRemainingAttendanceData] = useState({});
  const [overtimeAttendanceData, setOvertimeAttendanceData] = useState({});

  const fetchAttendanceData = async (filterData, rangeType) => {
    try {
      const attendanceData = await getAttendance({ filterData });
      return attendanceData?.results || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const getTodayAttendanceStats = async () => {
    const todayAttendance = await fetchAttendanceData(
      {
        date: moment().format("YYYY-MM-DD"),
        employee_id: userId,
      },
      "day"
    );
    setTodayAttendanceData(calculateAttendanceStats(todayAttendance));
  };

  const getWeeklyAttendanceStats = async () => {
    const weeklyAttendance = await fetchAttendanceData(
      {
        date_range: GetDateRange("week"),
        employee_id: userId,
      },
      "week"
    );
    setWeeklyAttendanceData(calculateAttendanceStats(weeklyAttendance));
  };

  const getMonthlyAttendanceStats = async () => {
    const monthlyAttendance = await fetchAttendanceData(
      {
        date_range: GetDateRange("month"),
        employee_id: userId,
      },
      "month"
    );

    const monthlytAttendanceStats = calculateAttendanceStats(monthlyAttendance);
    setMonthlyAttendanceData(monthlytAttendanceStats);
    setRemainingAttendanceData({
      value: monthlytAttendanceStats.total - monthlytAttendanceStats.value,
      total: monthlytAttendanceStats.total,
    });
    setOvertimeAttendanceData({
      value: calculateTotal(monthlyAttendance, "overtime_hours"),
      total: monthlytAttendanceStats.total,
    });
  };

  const loadUserData = async (isMounted) => {
    if (!isMounted) return;
    try {
      await Promise.all([
        await getTodayAttendanceStats(),
        await getWeeklyAttendanceStats(),
        await getMonthlyAttendanceStats(),
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      if (isMounted) setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    loadUserData(isMounted);
  
    // Refresh data every 1 minute
    const interval = setInterval(() => {
      loadUserData(isMounted);
    }, 60000); // 60,000 ms = 1 min
  
    return () => {
      isMounted = false;
      clearInterval(interval); // Cleanup on unmount
    };
  }, [userId]);

  return (
    <div className="space-y-4">
      <Statistics
        value={todayAttendanceData.value || 0}
        label={"Today"}
        total={todayAttendanceData.total || 0}
      />
      <Statistics
        value={weeklyAttendanceData.value || 0}
        label={"This Week"}
        total={weeklyAttendanceData.total || 0}
      />
      <Statistics
        value={monthlyAttendanceData.value || 0}
        label={"This Month"}
        total={monthlyAttendanceData.total || 0}
      />
      <Statistics
        value={remainingAttendanceData.value || 0}
        label={"Remaining"}
        total={remainingAttendanceData.total || 0}
      />
      <Statistics
        value={overtimeAttendanceData.value || 0}
        label={"Overtime"}
        total={overtimeAttendanceData.total || 0}
      />
    </div>
  );
};

const Statistics = ({ value, total, label }) => (
  <div>
    <div className="flex justify-between mb-1">
      <span className="text-slate-900">{label}</span>
      <span>
        <span className="text-slate-1200">{formatDuration(value)}</span>/{total}
        hrs
      </span>
    </div>
    <Progress
      value={(parseFloat(value) / parseFloat(total)) * 100}
      className="h-2"
    />
  </div>
);

export default HourlyStatistics;
