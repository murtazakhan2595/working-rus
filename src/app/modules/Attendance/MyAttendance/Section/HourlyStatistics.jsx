import React, { useEffect, useState } from "react";
import { getAttendance, getShiftById } from "app/hooks/attendance";
import { useSelector } from "react-redux";
import moment from "moment";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "src/@/components/ui/table";
import { Progress } from "src/@/components/ui/progress";
import { PageLoader } from "components";

const HourlyStatistics = ({ userId }) => {
  //  const userProfile = useSelector((state) => state.user.userProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [todayAttendanceData, setTodayAttendanceData] = useState({});
  const [todayShiftData, setTodayShiftData] = useState({});
  const [stats, setStats] = useState([
    { label: "Today", value: "0", total: "0" },
    { label: "This Week", value: "0", total: "0" },
    { label: "This Month", value: "0", total: "0" },
    { label: "Remaining", value: "0", total: "0" },
    { label: "Overtime", value: "0", total: "0" },
  ]);
  const getTodayAttendanceData = async () => {
    try {
      const todayAttendanceData = await getAttendance({
        filterData: {
          date_range: "2024-12-18,2024-12-18",
          employee_id: userId,
        },
      });
      const todayAttendance =
        todayAttendanceData &&
        todayAttendanceData.results &&
        todayAttendanceData.results.length > 0
          ? todayAttendanceData.results[0]
          : {};
      if (todayAttendance) {
        return {
          totalhours: todayAttendance.total_hours,
          spentHours: todayAttendance.total_hours,
        };
      }
    } catch (error) {
      console.error(error);
    } finally {
      return {};
    }
  };

  const getWeeklyAttendanceData = async () => {
    debugger;
    try {
      const todayAttendanceData = await getAttendance({
        filterData: {
          date_range: "2024-12-15,2024-12-22",
          employee_id: userId,
        },
      });
      const todayAttendance =
        todayAttendanceData &&
        todayAttendanceData.results &&
        todayAttendanceData.results.length > 0
          ? todayAttendanceData.results
          : {};
      if (todayAttendance) {
        return todayAttendance;
      }
    } catch (error) {
      console.error(error);
    } finally {
      return {};
    }
  };

  const getUserStatistics = async (isMounted) => {
    setIsLoading(true);
    try {
      debugger;
      if (isMounted) {
        const todayStatistics = await getTodayAttendanceData();
        const weeklyStatistics = await getWeeklyAttendanceData();
      }
    } catch (error) {
      console.error(error);
    } finally {
      if (isMounted) {
        setIsLoading(false); // Stop loading spinner
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    getUserStatistics(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);
  console.log("poiu");

  if (isLoading) return <PageLoader />;
  return (
    <div className="space-y-4">
      {stats.map((item) => (
        <div key={item.label}>
          <div className="flex justify-between mb-1">
            <span className="text-slate-900">{item.label}</span>
            <span>
              <span className="text-slate-1200">{item.value}</span>/{item.total}{" "}
              hrs
            </span>
          </div>
          <Progress
            value={(parseFloat(item.value) / parseFloat(item.total)) * 100}
            className="h-2"
          />
        </div>
      ))}
    </div>
  );
};

export default HourlyStatistics;
