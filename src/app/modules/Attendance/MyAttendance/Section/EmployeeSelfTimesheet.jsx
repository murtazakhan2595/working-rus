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
  getBreak,
  calculateBreak,
} from "app/hooks/attendance";

export default function EmployeeSelfTimesheet({
  employeeShift,
  attendance,
  startShift,
  endShift,
  OnBreak,
  disable,
  reloadData,
}) {
 
  const updatePaybleHours = async () => {
    if (!OnBreak && attendance?.checkin) {
      const checkInDate = moment(attendance.checkin);
      const now = moment(moment().format("YYYY-MM-DDTHH:mm:ss"));
      const totalHours = parseFloat(
        now.diff(checkInDate, "hours", true)
      ).toFixed(2);
      // Convert break hours to milliseconds
      const breakMs = parseFloat(attendance?.break_duration || 0);
      // Calculate elapsed time minus break
      const payableHours = totalHours - breakMs;

      const payload = {
        id: attendance.id,
        payable_hours: payableHours.toFixed(2),
      };
      const response = await saveAttendance(payload);
      if (response) {
        await reloadData();
      }
    }
  };

  useEffect(() => {
    if (!OnBreak && attendance?.checkin && !attendance.checkout) {
      updatePaybleHours(); // Initial update
      const interval = setInterval(updatePaybleHours, 60000); // Update every second

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [attendance?.checkin, OnBreak, attendance.checkout]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-plum-900">Time Log</span>
          <span className="text-sm text-slate-1200">
            {moment().format("MMM/D/YYYY")}
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
            {employeeShift?.shift_start_time &&
            employeeShift?.shift_end_time ? (
              <span>
                {moment(employeeShift.shift_start_time).format("hh:mm A") +
                  " - " +
                  moment(employeeShift.shift_end_time).format("hh:mm A")}
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
                {formatDuration(attendance?.payable_hours)}
              </div>
            </div>

            <RenderShiftControlIcons
              disable={disable}
              attendance={attendance}
              employeeShift={employeeShift}
              startShift={startShift}
              endShift={endShift}
              OnBreak={OnBreak}
              reloadData={reloadData}
            />
          </div>
          <div className="flex justify-between mt-4">
            <div>
              <div className="text-slate-1200">Break</div>
              <div>{formatDuration(attendance?.break_duration)} </div>
            </div>
            <div>
              <div className="text-slate-1200">Overtime</div>
              <div>{formatDuration(attendance?.overtime_hours) ?? "0"}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const RenderShiftControlIcons = ({
  disable,
  attendance,
  employeeShift,
  startShift,
  endShift,
  OnBreak,
  reloadData = () => {},
}) => {
  const userProfile = useSelector((state) => state.user.userProfile);

  if (attendance && attendance.checkout) {
    return  null;
  }
  if (!employeeShift?.shift_start_time || !employeeShift?.shift_end_time)
    return null;

  const startBreak = async () => {
    const startTime = moment().utc().format("YYYY-MM-DDTHH:mm:ss[Z]");
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

  if (!attendance?.checkin) {
    // If no attendance, show only Play
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <PlayCircle
              className="w-8 h-8 mx-2 text-plum-900 cursor-pointer"
              onClick={() => {
                if (!disable) {
                  startShift();
                }
              }}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Start Shift</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (OnBreak) {
    // If on break, show Play and Stop
    return (
      <>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <PlayCircle
                className="w-8 h-8 mx-2 text-plum-900 cursor-pointer"
                onClick={() => {
                  if (!disable) {
                    endBreakResumeShift();
                  }
                }}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Resume Shift</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <StopCircle
                className="w-8 h-8 mx-2 text-plum-900 cursor-pointer"
                onClick={() => {
                  if (!disable) {
                    endShift();
                  }
                }}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>End Shift</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </>
    );
  }

  // If attendance exists and not on break, show Pause and Stop
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <PauseCircle
              className="w-8 h-8 mx-2 text-plum-900 cursor-pointer"
              onClick={startBreak}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Pause Shift</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <StopCircle
              className="w-8 h-8 mx-2 text-plum-900 cursor-pointer"
              onClick={endShift}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>End Shift</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
};
