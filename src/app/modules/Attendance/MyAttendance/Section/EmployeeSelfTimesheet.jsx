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
import { convertUTCToLocal } from "app/hooks/attendance";
import { formatTimeWithAMPM } from "app/hooks/attendance";
import { formatDuration } from "utils/renderValues";
import { renderDate } from "utils/renderValues";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/@/components/ui/tooltip";

export default function EmployeeSelfTimesheet({
  employeeShift,
  attendance,
  startShift,
  pauseShift,
  endShift,
  OnBreak,
  disable,
}) {
  const [elapsedTime, setElapsedTime] = useState("");
  console.log("BREAK STAUS", OnBreak);
  // Determine which icons to show
  const renderShiftControlIcons = (disable) => {
    if (attendance && attendance.checkout) {
      return null;
    }

    if (!attendance?.checkin) {
      // If no attendance, show only Play
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <PlayCircle
                className="w-8 h-8 ml-4 text-plum-900 cursor-pointer"
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
                  className="w-8 h-8 ml-4 text-plum-900 cursor-pointer"
                  onClick={() => {
                    if (!disable) {
                      startShift();
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
                  className="w-8 h-8 ml-4 text-plum-900 cursor-pointer"
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
                className="w-8 h-8 ml-4 text-plum-900 cursor-pointer"
                onClick={pauseShift}
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
                className="w-8 h-8 ml-4 text-plum-900 cursor-pointer"
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

  useEffect(() => {
    const updateElapsedTime = () => {
      const checkInDate = new Date(attendance?.checkin);
      const now = new Date();
      // Convert break hours to milliseconds
      const breakMs = parseFloat(attendance?.break_duration || 0) * 60 * 60 * 1000;
      // Calculate elapsed time minus break
      let workDurationMs = now - checkInDate - breakMs;

      const hours = Math.floor(workDurationMs / (1000 * 60 * 60));
      const minutes = Math.floor((workDurationMs % (1000 * 60 * 60)) / (1000 * 60));
      // const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setElapsedTime(`${hours}h ${minutes}m`);
    };

    updateElapsedTime(); // Initial update
    const interval = setInterval(updateElapsedTime, 60000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, [attendance?.checkin]);

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
          <div className="flex items-center justify-center mt-4">
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
                {/* {formatDuration(attendance?.payable_hours)} */}
                {elapsedTime}
              </div>
            </div>
            {employeeShift?.shift_start_time &&
              employeeShift?.shift_end_time &&
              renderShiftControlIcons(disable)}
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
