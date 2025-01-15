import React, { useEffect, useState } from "react";
import { getAttendance, getShiftById } from "app/hooks/attendance";
import moment from "moment";
import { CalculateHoursWorked } from "app/modules/Attendance/Sections/CalculateWorkHours";
import { Progress } from "src/@/components/ui/progress";
import { PageLoader } from "components";
import { GetDateRange, GetShiftTotalHours } from "utils/renderValues";
import { formatDuration } from "utils/renderValues";

const HourlyStatistics = ({
  userId,
  shiftId,
  attendanceData,
  dateRange,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [todayAttendanceData, setTodayAttendanceData] = useState({});
  const [weeklyAttendanceData, setWeeklyAttendanceData] = useState({});
  const [monthlyAttendanceData, setMonthlyAttendanceData] = useState({});
  const [remainingAttendanceData, setRemainingAttendanceData] = useState({});
  const [overtimeAttendanceData, setOvertimeAttendanceData] = useState({});

  const [shiftData, setShiftData] = useState({});

  const calculateAttendanceStats = (attendance, shiftDuration, rangeType) => {
    const totalHours = CalculateHoursWorked(attendance);
    const total = GetShiftTotalHours(
      moment(shiftDuration.starttime).format("HH:mm"),
      moment(shiftDuration.endtime).format("HH:mm"),
      rangeType
    );
    return {
      value: totalHours.totalWorkedHours,
      total: total,
    };
  };

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
    setTodayAttendanceData(
      calculateAttendanceStats(todayAttendance, shiftData, "day")
    );
  };

  const getWeeklyAttendanceStats = async () => {
    const weeklyAttendance = await fetchAttendanceData(
      {
        date_range: GetDateRange("week"),
        employee_id: userId,
      },
      "week"
    );
    setWeeklyAttendanceData(
      calculateAttendanceStats(weeklyAttendance, shiftData, "week")
    );
  };

  const getMonthlyAttendanceStats = async () => {
    const monthlyAttendance = await fetchAttendanceData(
      {
        date_range: GetDateRange("month"),
        employee_id: userId,
      },
      "month"
    );
    setMonthlyAttendanceData(
      calculateAttendanceStats(monthlyAttendance, shiftData, "month")
    );
  };

  const getRemainingHoursData = () => {
    const totalHours = CalculateHoursWorked(attendanceData);
    setRemainingAttendanceData({
      value: totalHours.totalWorkedHours,
      total: dateRange ? totalHours.totalHours : todayAttendanceData.total,
    });
  };

  const getOvertimeHoursData = () => {
    const totalHours = CalculateHoursWorked(attendanceData, "overtime_hours");
    setOvertimeAttendanceData({
      value: totalHours.totalWorkedHours,
      total: dateRange ? totalHours.totalHours : todayAttendanceData.total,
    });
  };

  const loadUserData = async (isMounted) => {
    if (!isMounted) return;
    try {
      const shiftData = await getShiftById(shiftId);
      setShiftData(shiftData);

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

  const loadDynamicUserData = async (isMounted) => {
    if (!isMounted) return;
    await Promise.all([getRemainingHoursData(), getOvertimeHoursData()]);
  };

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    loadUserData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [shiftId, userId]);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    loadDynamicUserData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [attendanceData]);
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
