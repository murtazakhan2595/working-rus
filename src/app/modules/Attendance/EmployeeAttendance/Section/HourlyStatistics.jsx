import React, { useEffect, useState, useMemo } from "react";
import { getAttendance, getShiftById } from "app/hooks/attendance";
import moment from "moment";
import { CalculateHoursWorked } from "app/modules/Attendance/Sections/CalculateWorkHours";
import { Progress } from "src/@/components/ui/progress";
import { useSelector } from "react-redux";
import {
  GetDateRange,
  getWorkingDays,
  CalculateTotalWorkingHours,
} from "utils/renderValues";
import { formatDuration, calculateTotal } from "utils/renderValues";

const calculateAttendanceStats = (attendance) => {
  const totalHours = calculateTotal(attendance,'total_hours');
  return totalHours.totalWorkedHours;
};

const HourlyStatistics = ({ userId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [weeklyAttendanceData, setWeeklyAttendanceData] = useState(0);
  const [monthlyAttendanceData, setMonthlyAttendanceData] = useState(0);
  const [monthlyRemainingAttendanceData, setMonthlyRemainingAttendanceData] =
    useState(0);
  const [overtimeAttendanceData, setOvertimeAttendanceData] = useState(0);
  const EmployeeShiftData = useSelector(
    (state) => state.attendance.assignedShiftData
  );
  const TotalWorkingHours = useMemo(() => {
    return CalculateTotalWorkingHours(
      EmployeeShiftData.starttime,
      EmployeeShiftData.endtime
    );
  }, [EmployeeShiftData.starttime, EmployeeShiftData.endtime]);

  const WeeklyWorkingHours = useMemo(() => {
    return (
      getWorkingDays(moment().startOf("isoWeek"), moment().endOf("isoWeek")) *
      TotalWorkingHours
    );
  }, [TotalWorkingHours]);

  const MonthlyWorkingHours = useMemo(() => {
    return (
      getWorkingDays(moment().startOf("month"), moment().endOf("month")) *
      TotalWorkingHours
    );
  }, [TotalWorkingHours]);

  const fetchAttendanceData = async (filterData, rangeType) => {
    try {
      const attendanceData = await getAttendance({ filterData });
      return attendanceData?.results || [];
    } catch (error) {
      console.error(error);
      return [];
    }
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
    setMonthlyRemainingAttendanceData(
      MonthlyWorkingHours - monthlytAttendanceStats
    );
    setOvertimeAttendanceData(
      calculateTotal(monthlyAttendance, "overtime_hours")
    );
  };

  const loadUserData = async (isMounted) => {
    if (!isMounted) return;
    try {
      await Promise.all([
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
    }, 360000); // 60,000 ms = 1 min

    return () => {
      isMounted = false;
      clearInterval(interval); // Cleanup on unmount
    };
  }, [userId]);

  return (
    <div className="space-y-4">
      <Statistics
        value={weeklyAttendanceData || 0}
        label={"Weekly Hours"}
        total={WeeklyWorkingHours || 0}
      />
      <Statistics
        value={monthlyAttendanceData || 0}
        label={"Monthly Hours"}
        total={MonthlyWorkingHours || 0}
      />
      <Statistics
        value={monthlyRemainingAttendanceData || 0}
        label={"Weekly Remaining Hours"}
        total={MonthlyWorkingHours || 0}
      />
      <Statistics
        value={monthlyRemainingAttendanceData || 0}
        label={"Monthly Remaining Hours"}
        total={TotalWorkingHours || 0}
      />
      <Statistics
        value={overtimeAttendanceData || 0}
        label={"Overtime  Hours"}
        total={WeeklyWorkingHours || 0}
        showTotal={false}
      />
      <Statistics
        value={overtimeAttendanceData || 0}
        label={"Adjusted Weekly Hours"}
        total={WeeklyWorkingHours || 0}
        showTotal={false}
      />
      <Statistics
        value={overtimeAttendanceData || 0}
        label={"Adjusted Monthly Hours"}
        total={WeeklyWorkingHours || 0}
        showTotal={false}
      />
    </div>
  );
};

const Statistics = ({ value, total, label, showTotal = true }) => (
  <div>
    <div className="flex justify-between mb-1">
      <span className="text-slate-900">{label}</span>
      <span>
        <span>{formatDuration(value)}</span>
        {/* {showTotal ? ` / ${formatDuration(total)}` : ""} */}
      </span>
    </div>
    <Progress
      value={(parseFloat(value) / parseFloat(total)) * 100}
      className="h-2"
    />
  </div>
);

export default HourlyStatistics;
