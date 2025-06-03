import React, { useEffect, useState, useMemo } from "react";
import { Progress } from "src/@/components/ui/progress";
import { useSelector } from "react-redux";
import { formatDuration } from "utils/renderValues";

const HourlyStatistics = ({ userId }) => {
  const emp_attendance_detail = useSelector(
    (state) => state.attendance.attendance_details
  );
  const [workStatistics, setWorkStatistics] = useState([]);
  const [weeklyAdjHours, setWeeklyAdjHours] = useState(0);
  const [monthlyAdjHours, setMonthlyAdjHours] = useState(0);

  const loadUserData = async (isMounted, data) => {
    if (!isMounted) return;
    try {
      const weekly_ph = data.weekly_payable_hours;
      const weekly_th = data.weekly_total_hours;
      const weekly_ot = data.weekly_overtime;
      const weekly_rh = weekly_th - weekly_ph;
      const weekly_ah = formatDuration(weekly_ot - weekly_rh);
      const monthly_ph = data.monthly_payable_hours;
      const monthly_th = data.monthly_total_hours;
      const monthly_rh = monthly_th - monthly_ph;
      const monthly_ah = formatDuration(data.monthly_overtime - monthly_rh);
      setWorkStatistics([
        {
          value: weekly_ph || 0,
          label: "Weekly Hours",
          total: weekly_th || 0,
        },
        {
          value: monthly_ph || 0,
          label: "Monthly Hours",
          total: monthly_th || 0,
        },
        {
          value: weekly_rh || 0,
          label: "Weekly Remaining Hours",
          total: weekly_th || 0,
        },
        {
          value: monthly_rh || 0,
          label: "Monthly Remaining Hours",
          total: monthly_th || 0,
        },
        {
          value: data.monthly_overtime || 0,
          label: "Overtime Hours",
          total: monthly_th || 0,
        },
      ]);
      setWeeklyAdjHours(weekly_ah);
      setMonthlyAdjHours(monthly_ah);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    loadUserData(isMounted, emp_attendance_detail);
    return () => {
      isMounted = false;
    };
  }, [emp_attendance_detail]);

  return (
    <div className="space-y-4">
      {workStatistics.map(({ value, label, total }) => (
        <Statistics value={value} label={label} total={total} />
      ))}
      <div>
        Adjusted Weekly Hours:{" "}
        <span className="text-neutral-1100">{weeklyAdjHours}</span>
      </div>
      <div>
        Adjusted Monthly Hours:{" "}
        <span className="text-neutral-1100">{monthlyAdjHours}</span>
      </div>
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
