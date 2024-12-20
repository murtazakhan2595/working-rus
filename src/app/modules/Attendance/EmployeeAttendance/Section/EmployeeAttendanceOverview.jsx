import React, { useEffect, useState } from "react";
import { getAttendance, getShiftById } from "app/hooks/attendance";
import { useSelector } from "react-redux";
import moment from "moment";
import { CalculateHoursWorked } from "app/modules/Attendance/Sections/CalculateWorkHours";
import { LuTimerReset } from "react-icons/lu";
import { PageLoader } from "components";
import {
  FaArrowRightToBracket,
  FaArrowRightFromBracket,
  FaArrowTrendUp,
} from "react-icons/fa6";

const EmployeeAttendanceOverview = ({ userId, attendanceData }) => {
  //  const userProfile = useSelector((state) => state.user.userProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [lateAttendanceCount, setLateAttendanceCount] = useState(0);
  const [absentAttendanceCount, setAbsentAttendanceCount] = useState(0);
  const [onTimeArrivalPercentage, setOnTimeArrivalPercentage] = useState(0.0);
  const [averageHours, setAverageHours] = useState("0h 0min");

  const getAbsentAttendanceCount = async () => {
    try {
      const absentCount = attendanceData.filter(
        (record) => record.is_absent
      ).length;
      setAbsentAttendanceCount(absentCount);
      return absentCount;
    } catch (error) {
      console.error(error);
      return 0; // Return 0 in case of an error
    }
  };
  const getOnTimeArrivalPercentage = async () => {
    try {
      const lateCount = attendanceData.filter(
        (record) => record.is_late
      ).length;
      const onTimeArrivalPercentage = (
        (1 - lateCount / attendanceData.length) *
        100
      ).toFixed(2);
      setOnTimeArrivalPercentage(onTimeArrivalPercentage);
      return lateCount;
    } catch (error) {
      console.error(error);
      return 0;
    }
  };

  const getLateAttendanceCount = async () => {
    try {
      const lateCount = attendanceData.filter(
        (record) => record.is_late
      ).length;
      setLateAttendanceCount(lateCount);
      return lateCount;
    } catch (error) {
      console.error(error);
      return 0; // Return 0 in case of an error
    }
  };
  const getAverageHours = async () => {
    try {
      const totalMinutes = attendanceData.reduce((sum, record) => {
        const payable = parseFloat(record.payable_hours) || 0;
        const overtime = parseFloat(record.overtime_hours) || 0;
        const totalHours = payable + overtime;
        return sum + totalHours * 60; // Convert hours to minutes
      }, 0);

      const averageMinutes = totalMinutes / attendanceData.length;
      const hours = Math.floor(averageMinutes / 60); // Extract hours
      const minutes = Math.round(averageMinutes % 60); // Extract remaining minutes
      const averageHours = `${hours}h ${minutes}min`;
      setAverageHours(averageHours);
      return averageHours;
    } catch (error) {
      console.error(error);
      return "0h 0min"; // Return 0 hours and 0 minutes in case of an error
    }
  };

  const getUserStatisticsData = async (isMounted) => {
    setIsLoading(true);
    try {
      if (isMounted) {
        if (!attendanceData || attendanceData.length === 0) {
          setLateAttendanceCount(0);
          setAbsentAttendanceCount(0);
          setAverageHours("0h 0min");
          setOnTimeArrivalPercentage("0.00");
        } else {
          getLateAttendanceCount();
          getAbsentAttendanceCount();
          getOnTimeArrivalPercentage();
          getAverageHours();
        }
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
    getUserStatisticsData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [attendanceData]);

  if (isLoading) return <PageLoader />;
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-5">
        <RecordDetailBox
          icon={<FaArrowRightToBracket className="w-5 h-5" />}
          value={lateAttendanceCount}
          label={"Late Days"}
        />
        <RecordDetailBox
          icon={<FaArrowRightFromBracket className="w-5 h-5" />}
          value={absentAttendanceCount}
          label={"Absent Days"}
        />
        <RecordDetailBox
          icon={<FaArrowTrendUp className="w-5 h-5" />}
          value={`${onTimeArrivalPercentage}%`}
          label={"On-time Arrival"}
        />
        <RecordDetailBox
          icon={<LuTimerReset className="w-6 h-6" />}
          value={averageHours}
          label={"Average Hours"}
        />
      </div>
    </div>
  );
};

const RecordDetailBox = ({ icon, label, value }) => {
  return (
    <div className="flex flex-row gap-5 items-center">
      <div className="text-plum-900">{icon}</div>
      <div style={{ minWidth: "60%" }}>
        <div>{label}</div>
        <div className="font-bold text-xl text-slate-1200 border-b">
          {value}
        </div>
      </div>
    </div>
  );
};

export default EmployeeAttendanceOverview;
