import React, { useState, useEffect } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { formatDuration } from "utils/renderValues";
import { renderDate } from "utils/renderValues";
import { TimeAdjustmentRequest } from "app/modules/Attendance";
import {
  endBreak,
  saveAttendance,
  saveBreak,
  calculateBreak,
} from "app/hooks/attendance";
import { Button } from "components/ui/button";
import AlertDialogue from "components/ui/AlertDialogue";
import { StatusLabel } from "components";
import { DetailBox } from "components/SheetCardExtension";
import { TriangleAlert } from "lucide-react";

export default function EmployeeSelfTimesheet({
  attendance,
  OnBreak,
}) {
  const { today_shift } = useSelector(
    (state) => state.attendance.attendance_details
  );
  const [payableHours, setPayableHours] = useState(
    parseFloat(attendance?.payable_hours) || 0
  );
  const updateTimer = () => {
    const isSplitShit = today_shift?.is_split_shift;
    const checkInDate =
      isSplitShit && attendance?.second_checkin
        ? moment(attendance?.second_checkin)
        : moment(attendance?.checkin); // Check-in time
    const now = moment().utc(); // Current time
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
    if (!OnBreak && attendance) {
      if (attendance?.checkin && !attendance.checkout) {
        updateTimer(); // Initial update
        const interval = setInterval(updateTimer, 1000); // Update every second
        return () => clearInterval(interval); // Cleanup on unmount
      } else if (attendance?.second_checkin && !attendance.second_checkout) {
        updateTimer(); // Initial update
        const interval = setInterval(updateTimer, 1000); // Update every second
        return () => clearInterval(interval); // Cleanup on unmount
      } else {
        setPayableHours(parseFloat(attendance?.payable_hours) || 0);
      }
    } else if (OnBreak) {
      updateTimer();
    }
  }, [attendance, OnBreak, today_shift]);

  return (
    <div className="flex flex-row flex-wrap items-center justify-center mt-4">
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
                ? 365 * (1 - payableHours / parseFloat(attendance?.total_hours))
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
        <div className="absolute text-xl font-semibold text-center align-middle transform -translate-x-1/2 -translate-y-1/2 text-plum-900 top-1/2 left-1/2">
          {formatDuration(payableHours, true)}
        </div>
      </div>
    </div>
  );
}
