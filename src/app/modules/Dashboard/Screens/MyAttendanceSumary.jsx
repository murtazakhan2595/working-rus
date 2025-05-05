import React, { useState, useEffect } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { formatDuration } from "utils/renderValues";
import {
  endBreak,
  saveAttendance,
  saveBreak,
  calculateBreak,
  getBreakStatus,
  getAttendanceData,
  getAttendance,
} from "app/hooks/attendance";
import { Button } from "components/ui/button";
import { StatusLabelAttendance } from "components/StatusLabel";
import { EmployeeSelfTimesheet } from "app/modules/Attendance/MyAttendance/Section";

export default function AttendanceSummaryWidget() {
  const userProfile = useSelector((state) => state.user.userProfile);
  const user_details = useSelector((state) => state.emp.user_details);
  const EmployeeShiftData = useSelector(
    (state) => state.attendance.assignedShiftData
  );

  const [attendance, setAttendance] = useState(null);
  const [onBreak, setOnBreak] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current attendance data for today
  const fetchTodayAttendanceData = async () => {
    try {
      if (attendance?.id) {
        const attendanceData = await getAttendanceData(attendance?.id);
        setAttendance(attendanceData);
      } else {
        const attendanceList = await getAttendance({
          filterData: {
            employee_id: userProfile.id,
            date: moment().format("YYYY-MM-DD"),
          },
        });
        if (attendanceList && attendanceList?.results?.length > 0) {
          const todayAttendance = attendanceList?.results[0];
          setAttendance(todayAttendance);
        }
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch break status
  const fetchBreakStatus = async () => {
    if (attendance && attendance?.id) {
      const breakStatus = await getBreakStatus({
        filterData: {
          employee_id: userProfile.id,
          attendance: attendance?.id,
        },
      });
      setOnBreak(breakStatus);
    }
  };

  // Function to reload data
  const reloadData = (refreshAll = false) => {
    fetchTodayAttendanceData();
    fetchBreakStatus();
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchTodayAttendanceData();
  }, []);

  // Update break status when attendance changes
  useEffect(() => {
    fetchBreakStatus();
  }, [attendance]);

  return (
    <section className="bg-white ">
      <div className="flex items-center justify-between p-4">
        <div className="text-base font-semibold text-plum-1100 xl:text-2xl lg:text-xl md:text-lg">
          My Attendance
        </div>
        <StatusLabelAttendance status={attendance?.status} />
      </div>

      {/* Using EmployeeSelfTimesheet component */}
      <div className="p-4">
        <EmployeeSelfTimesheet
          employeeShift={EmployeeShiftData}
          attendance={attendance}
          OnBreak={onBreak}
          disable={isLoading}
          reloadData={reloadData}
        />
      </div>
    </section>
  );
}
