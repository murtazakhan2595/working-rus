import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import moment from "moment";
import {
  CalendarIcon,
  FilterIcon,
  PlayCircle,
  StopCircle,
  PauseCircle,
} from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { formatDuration } from "utils/renderValues";
import { renderDate } from "utils/renderValues";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/@/components/ui/tooltip";
import {
  endBreak,
  saveAttendance,
  saveBreak,
  calculateBreak,
} from "app/hooks/attendance";
import { Button } from "components/ui/button";

export default function EmployeeSelfTimesheet({
  employeeShift,
  attendance,
  OnBreak,
  disable,
  reloadData,
}) {
  const [payableHours, setPayableHours] = useState(
    formatDuration(attendance?.payable_hours, true)
  );

  const updateTimer = () => {
    const checkInDate = moment(attendance.checkin); // Check-in time
    const now = moment(); // Current time

    // Parse break duration (in hours) and convert to milliseconds
    const breakMs = parseFloat(attendance?.break_duration || 0) * 3600 * 1000;

    // Calculate total worked time (excluding break)
    const durationMs = now.diff(checkInDate) - breakMs;

    // Convert to hours
    const durationInHours = durationMs / (1000 * 60 * 60);

    // You can set this to state if you want to display it
    setPayableHours(durationInHours); // Assuming you have a useState hook for this
  };

  useEffect(() => {
    if (!OnBreak && attendance?.checkin && !attendance?.checkout) {
      updateTimer(); // Initial update

      const interval = setInterval(updateTimer, 1000); // Update every second

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [attendance, OnBreak]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-plum-900">Time Log</span>
          <span className="text-sm text-slate-1200">
            {renderDate(moment())}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-1200">Checkin Time</span>
            {attendance?.checkin
              ? moment(attendance.checkin).format("h:mm A")
              : "Start working!"}
          </div>
          <div className="flex justify-between">
            <span className="text-slate-1200">Shift Time</span>
            {employeeShift?.shiftStartTime && employeeShift?.shiftEndTime ? (
              <span>
                {employeeShift.shiftStartTime} -{employeeShift.shiftEndTime}
              </span>
            ) : (
              "No shift assigned"
            )}
          </div>
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
                    payableHours > 0 && parseFloat(attendance?.total_hours) > 0
                      ? 365 *
                        (1 - payableHours / parseFloat(attendance.total_hours))
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
                {formatDuration(payableHours,true)}
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <div>
              {/* <div className="text-slate-1200">
                Break ({formatDuration(attendance?.break_duration)})
              </div> */}
              <div>
                <RenderBreakButton
                  disable={disable}
                  attendance={attendance}
                  employeeShift={employeeShift}
                  OnBreak={OnBreak}
                  reloadData={reloadData}
                />
              </div>
            </div>
            <div>
              {/* <div className="text-slate-1200">Overtime</div>
              <div>{formatDuration(attendance?.overtime_hours) ?? "0"}</div> */}
              <div>
                <RenderLogInButton
                  disable={disable}
                  attendance={attendance}
                  employeeShift={employeeShift}
                  OnBreak={OnBreak}
                  reloadData={reloadData}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const RenderBreakButton = ({
  disable,
  attendance,
  employeeShift,
  OnBreak,
  reloadData = () => {},
}) => {
  const userProfile = useSelector((state) => state.user.userProfile);
  if (attendance && attendance.checkout) {
    return null;
  }
  if (!employeeShift?.shiftStartTime || !employeeShift?.shiftEndTime)
    return null;

  const disableBreakButton = disable || !attendance?.checkin;

  const startBreak = async () => {
    const startTime = moment().utc().toISOString();
    const payload = {
      break_type: "Lunch",
      starttime: startTime,
      employee_id: userProfile.id,
      attendance: attendance.id,
    };
    const response = await saveBreak(payload);
    if (response) {
      toast.success("Break started");
      reloadData();
    }
  };

  const endBreakResumeShift = async () => {
    const endTime = moment().utc().format("YYYY-MM-DDTHH:mm:ss[Z]");
    if (OnBreak) {
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
        toast.success("Break ended");
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
          reloadData();
        }
      }
    }
  };

  if (OnBreak) {
    // If on break, show Play and Stop
    return (
      <Button
        variant="destructiveOutline"
        disabled={disableBreakButton}
        size="sm"
        onClick={endBreakResumeShift}
      >
        End Break
      </Button>
    );
  }

  // If attendance exists and not on break, show Pause and Stop
  return (
    <Button
      variant="successOutline"
      disabled={disableBreakButton}
      size="sm"
      onClick={startBreak}
    >
      Start Break
    </Button>
  );
};

const RenderLogInButton = ({
  disable,
  attendance,
  employeeShift,
  OnBreak,
  reloadData = () => {},
}) => {
  const userProfile = useSelector((state) => state.user.userProfile);
  const user_details = useSelector((state) => state.emp.user_details);

  if (attendance && attendance.checkout) {
    return null;
  }
  if (!employeeShift?.shiftStartTime || !employeeShift?.shiftEndTime)
    return null;
  const startShift = async () => {
    if (attendance && attendance.checkout) {
      toast.success("Shift already ended");
      return;
    }
    if (!attendance) {
      const checkInTime = moment().utc().toISOString();
      const checkInMoment = moment(checkInTime);
      const shiftStartMoment = moment(employeeShift.starttime);
      // Extract only hours and minutes for both times
      const checkInTimeOnly = moment.utc(
        `${checkInMoment.format("HH:mm")}`,
        "HH:mm"
      );
      const shiftStartTimeOnly = moment.utc(
        `${shiftStartMoment.format("HH:mm")}`,
        "HH:mm"
      );

      // Compare time only
      const is_late = checkInTimeOnly.isAfter(shiftStartTimeOnly);
      const payload = {
        checkin: checkInTime,
        status: is_late ? "Late" : "Present",
        is_late: is_late,
        employee_id: userProfile.id,
        date: moment().format("YYYY-MM-DD"),
      };
      const response = await saveAttendance(payload, user_details);
      if (response) {
        toast.success("Shift started");
        reloadData(true);
      }
      return;
    }
  };

  const endShift = async () => {
    const checkout = moment().utc().toISOString();
    const payload = {
      ...attendance,
      id: attendance.id,
      checkout: checkout,
    };
    const response = await saveAttendance(payload, user_details);
    if (response) {
      toast.success("Shift ended");
      reloadData(true);
    }
  };
  const disableCheckOutButton = OnBreak || disable;
  const disableCheckInButton = disable;
  // If attendance exists and not on break, show Pause and Stop
  return (
    <>
      {!attendance?.checkin ? (
        <Button
          variant="default"
          size="sm"
          disabled={disableCheckInButton}
          onClick={startShift}
        >
          Check In
        </Button>
      ) : (
        <Button
          variant="default"
          size="sm"
          disabled={disableCheckOutButton}
          onClick={endShift}
        >
          Check Out
        </Button>
      )}
    </>
  );
};
