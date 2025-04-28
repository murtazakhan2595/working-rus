import React, { useState, useEffect } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  CalendarIcon,
  Timer,
  Coffee,
  PlayCircle,
  StopCircle,
} from "lucide-react";

import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
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
import { StatusLabelAttendance } from "components/StatusLabel";

const AttendanceSummaryWidget = () => {
  const userProfile = useSelector((state) => state.user.userProfile);
  const user_details = useSelector((state) => state.emp.user_details);
  const EmployeeShiftData = useSelector(
    (state) => state.attendance.assignedShiftData
  );

  const [attendance, setAttendance] = useState(null);
  const [onBreak, setOnBreak] = useState(false);
  const [payableHours, setPayableHours] = useState("0h 0min");
  const [currentTime, setCurrentTime] = useState(moment().format("h:mm A"));
  const [isLoading, setIsLoading] = useState(true);

  // Calculate total shift hours (shift end - shift start)
  const getTotalShiftHours = () => {
    if (EmployeeShiftData?.shiftStartTime && EmployeeShiftData?.shiftEndTime) {
      const startTime = moment(EmployeeShiftData.shiftStartTime, "h:mm A");
      const endTime = moment(EmployeeShiftData.shiftEndTime, "h:mm A");

      // Handle case where end time is next day
      let diffHours = endTime.diff(startTime, "hours", true);
      if (diffHours < 0) {
        diffHours += 24;
      }

      return formatDuration(diffHours, true);
    }
    return "Not assigned";
  };

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

  // Update timer for working hours
  const updateTimer = () => {
    if (!attendance?.checkin) return;

    const checkInDate = moment(attendance.checkin);
    const now = moment();
    setCurrentTime(now.format("h:mm A"));

    // Parse break duration (in hours) and convert to milliseconds
    const breakMs = parseFloat(attendance?.break_duration || 0) * 3600 * 1000;

    // Calculate total worked time (excluding break)
    const durationMs = now.diff(checkInDate) - breakMs;

    // Convert to hours
    const durationInHours = durationMs / (1000 * 60 * 60);

    // Format duration
    const formattedDuration = formatDuration(durationInHours, true);
    setPayableHours(formattedDuration);
  };

  // Check-in function
  const handleCheckIn = async () => {
    if (attendance && attendance.checkout) {
      toast.info("Shift already ended for today");
      return;
    }

    if (!attendance) {
      const checkInTime = moment().utc().toISOString();
      const is_late =
        EmployeeShiftData?.shiftStartTime &&
        moment(checkInTime).isAfter(EmployeeShiftData.starttime);

      const payload = {
        checkin: checkInTime,
        status: is_late ? "Late" : "Present",
        is_late: is_late,
        employee_id: userProfile.id,
        date: moment().format("YYYY-MM-DD"),
      };

      try {
        const response = await saveAttendance(payload, user_details);
        if (response) {
          toast.success("Check-in recorded successfully");
          fetchTodayAttendanceData();
        }
      } catch (error) {
        toast.error("Failed to record check-in");
        console.error(error);
      }
    }
  };

  // Check-out function
  const handleCheckOut = async () => {
    if (!attendance || !attendance.id) {
      toast.error("No active attendance record found");
      return;
    }

    if (onBreak) {
      toast.warning("Please end your break before checking out");
      return;
    }

    const checkout = moment().utc().toISOString();
    const payload = {
      ...attendance,
      id: attendance.id,
      checkout: checkout,
    };

    try {
      const response = await saveAttendance(payload, user_details);
      if (response) {
        toast.success("Check-out recorded successfully");
        fetchTodayAttendanceData();
      }
    } catch (error) {
      toast.error("Failed to record check-out");
      console.error(error);
    }
  };

  // Start break function
  const handleStartBreak = async () => {
    if (!attendance || !attendance.id) {
      toast.error("No active attendance record found");
      return;
    }

    const startTime = moment().utc().toISOString();
    const payload = {
      break_type: "Lunch",
      starttime: startTime,
      employee_id: userProfile.id,
      attendance: attendance.id,
    };

    try {
      const response = await saveBreak(payload);
      if (response) {
        toast.success("Break started successfully");
        setOnBreak(true);
        fetchTodayAttendanceData();
      }
    } catch (error) {
      toast.error("Failed to start break");
      console.error(error);
    }
  };

  // End break function
  const handleEndBreak = async () => {
    if (!attendance || !attendance.id) {
      toast.error("No active attendance record found");
      return;
    }

    const endTime = moment().utc().format("YYYY-MM-DDTHH:mm:ss[Z]");

    try {
      const result = await endBreak(
        {
          filterData: {
            employee_id: userProfile.id,
            attendance: attendance.id,
          },
        },
        endTime
      );

      if (result) {
        toast.success("Break ended successfully");

        const breakDuration = await calculateBreak({
          filterData: {
            employee_id: userProfile.id,
            attendance: attendance.id,
          },
        });

        const payload = {
          id: attendance.id,
          break_duration: breakDuration,
        };

        const response = await saveAttendance(payload);
        if (response) {
          setOnBreak(false);
          fetchTodayAttendanceData();
        }
      }
    } catch (error) {
      toast.error("Failed to end break");
      console.error(error);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchTodayAttendanceData();
  }, []);

  // Update break status when attendance changes
  useEffect(() => {
    fetchBreakStatus();
  }, [attendance]);

  // Timer effect for updating working hours
  useEffect(() => {
    if (!onBreak && attendance?.checkin && !attendance?.checkout) {
      updateTimer(); // Initial update
      const interval = setInterval(updateTimer, 1000); // Update every second
      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [attendance, onBreak]);

  return (
    <section className="bg-white rounded-md shadow-sm p-6">
      {/* Header with status */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-base font-semibold text-plum-1100 xl:text-2xl lg:text-xl md:text-lg">
          My Attendance
        </div>
        <StatusLabelAttendance status={attendance?.status} />
      </div>

      {/* Two-column layout for better space usage */}
      <div className="">
        {/* Left column: Circle timer */}
        <div className="flex items-center flex-row flex-wrap justify-center mt-4">
          <div className="relative">
            <svg className="w-32 h-32">
              <circle
                className="text-gray-200"
                strokeWidth="5"
                stroke="currentColor"
                fill="transparent"
                r="58"
                cx="64"
                cy="64"
              />
              <circle
                className="text-plum-900"
                strokeWidth="5"
                strokeDasharray={365}
                strokeDashoffset={
                  attendance?.payable_hours > 0 && attendance?.total_hours > 0
                    ? 365 *
                      (1 - attendance.payable_hours / attendance.total_hours)
                    : 365 // Full offset for 0 hours or invalid state
                }
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="58"
                cx="64"
                cy="64"
              />
            </svg>
            <div className="absolute text-xl font-semibold transform -translate-x-1/2 -translate-y-1/2 text-plum-900 top-1/2 left-1/2 align-middle text-center">
              {payableHours}
            </div>
          </div>
        </div>

        {/* Right column: Time information */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-slate-1200">Check-In Time</span>
              <span className="text-base font-medium">
                {attendance?.checkin
                  ? moment(attendance.checkin).format("h:mm A")
                  : "Not checked in"}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-slate-1200">Check-Out Time</span>
              <span className="text-base font-medium">
                {attendance?.checkout
                  ? moment(attendance.checkout).format("h:mm A")
                  : "Not checked out"}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-slate-1200">Current Time</span>
              <span className="text-base font-medium">{currentTime}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-slate-1200">Total Shift Hours</span>
              <span className="text-base font-medium">
                {getTotalShiftHours()}
              </span>
            </div>
          </div>

          {/* Break duration info if applicable */}
          {attendance?.break_duration > 0 && (
            <div className="mt-2">
              <span className="text-sm text-slate-1200">Break Duration:</span>
              <span className="text-base font-medium ml-2">
                {formatDuration(attendance.break_duration)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap justify-center gap-3 mt-6">
        {/* Check-in button */}
        {!attendance?.checkin && (
          <Button onClick={handleCheckIn} variant="default" size="sm">
            <PlayCircle className="mr-2 h-4 w-4" />
            Mark Check-In
          </Button>
        )}

        {/* Check-out button */}
        {attendance?.checkin && !attendance?.checkout && (
          <Button
            onClick={handleCheckOut}
            variant="default"
            size="sm"
            disabled={onBreak}
          >
            <StopCircle className="mr-2 h-4 w-4" />
            Mark Check-Out
          </Button>
        )}

        {/* Break buttons */}
        {attendance?.checkin && !attendance?.checkout && !onBreak && (
          <Button onClick={handleStartBreak} variant="successOutline" size="sm">
            <Coffee className="mr-2 h-4 w-4" />
            Mark Break
          </Button>
        )}

        {attendance?.checkin && !attendance?.checkout && onBreak && (
          <Button
            onClick={handleEndBreak}
            variant="destructiveOutline"
            size="sm"
          >
            <Timer className="mr-2 h-4 w-4" />
            Back from Break
          </Button>
        )}
      </div>
    </section>
  );
};

export default AttendanceSummaryWidget;
