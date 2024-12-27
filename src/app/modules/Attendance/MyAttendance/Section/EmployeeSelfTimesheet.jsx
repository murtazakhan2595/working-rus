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

export default function EmployeeSelfTimesheet({
  employeeShift,
  attendance,
  startShift,
  pauseShift,
  endShift,
  OnBreak,
  disable,
}) {
  console.log("BREAK STAUS", OnBreak);
  // Determine which icons to show
  const renderShiftControlIcons = (disable) => {
    if (attendance && attendance.checkout) {
      return null;
    }
    if (!attendance?.checkin) {
      // If no attendance, show only Play
      return (
        <PlayCircle
          className="w-8 h-8 ml-4 text-plum-900 cursor-pointer"
          onClick={() => {
            if (!disable) {
              startShift();
            }
          }}
        />
      );
    }

    if (OnBreak) {
      // If on break, show Play and Stop
      return (
        <>
          <PlayCircle
            className="w-8 h-8 ml-4 text-plum-900 cursor-pointer"
            onClick={()=>{
              if (!disable) {
                startShift();
              }
            }}
          />
          <StopCircle
            className="w-8 h-8 ml-4 text-plum-900 cursor-pointer"
            onClick={()=>{
              if (!disable) {
                endShift();
              }
            }}
          />
        </>
      );
    }

    // If attendance exists and not on break, show Pause and Stop
    return (
      <>
        <PauseCircle
          className="w-8 h-8 ml-4 text-plum-900 cursor-pointer"
          onClick={pauseShift}
        />
        <StopCircle
          className="w-8 h-8 ml-4 text-plum-900 cursor-pointer"
          onClick={endShift}
        />
      </>
    );
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-plum-900">Timesheet</span>
          <span className="text-sm text-slate-1200">
            {moment().format("MMM/D/YYYY")}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-1200">Punch in at</span>
            {attendance?.checkin
              ? moment(attendance.checkin).format("h:mm A")
              : "Start working!"}
          </div>
          <div className="flex justify-between">
            <span className="text-slate-1200">Shift Time</span>
            {employeeShift?.shift_start_time &&
            employeeShift?.shift_end_time ? (
              <span>
                {employeeShift.shift_start_time +
                  " - " +
                  employeeShift.shift_end_time}
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
              <div className="absolute text-2xl font-bold transform -translate-x-1/2 -translate-y-1/2 text-plum-900 top-1/2 left-1/2">
                {attendance?.payable_hours ?? "0"} hrs
              </div>
            </div>
            {employeeShift?.shift_start_time &&
              employeeShift?.shift_end_time &&
              renderShiftControlIcons(disable)}
          </div>
          <div className="flex justify-between mt-4">
            <div>
              <div className="text-slate-1200">Break</div>
              <div>{attendance?.break_duration ?? "0"} hrs</div>
            </div>
            <div>
              <div className="text-slate-1200">Overtime</div>
              <div>{attendance?.overtime_hours ?? "0"} hrs</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
