import React, { useState, useEffect } from "react";
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

export default function EmployeeSelfTimesheet({
  attendance,
  OnBreak,
  disable,
  reloadData,
  isDashboard = false,
}) {
  const { today_shift } = useSelector(
    (state) => state.attendance.attendance_details
  );
  const [payableHours, setPayableHours] = useState(
    parseFloat(attendance?.payable_hours) || 0
  );
  const updateTimer = () => {
    const checkInDate = moment(attendance?.checkin); // Check-in time
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
    } else if (OnBreak) {
      updateTimer();
    } else {
      setPayableHours(parseFloat(attendance?.payable_hours) || 0);
    }
  }, [attendance, OnBreak]);

  return (
    // if isDashboard is false, then the div will  have border and shadow
    <div className={isDashboard ? "" : " rounded-lg shadow-sm bg-white h-full"}>
      {/* if isDashboard is true, then the div will not have border and shadow */}
      <div className={isDashboard ? "" : "p-4 "}>
        <div className="flex items-center justify-between text-lg font-semibold">
          <span className="text-plum-900">Time Log</span>
          <span className="text-sm text-slate-1200">
            {renderDate(moment())}
          </span>
        </div>
      </div>
      <div className={isDashboard ? "" : "p-4"}>
        <div className="space-y-2">
          <DetailBox
            value={
              attendance?.checkin
                ? renderDate(attendance?.checkin, "--", "time")
                : "Start working!"
            }
            valueClassName="text-end"
            label="Check-in Time"
          />
          {attendance?.checkin && (
            <DetailBox
              value={
                attendance?.checkout
                  ? renderDate(attendance?.checkout, "--", "time")
                  : "Still Working"
              }
              valueClassName="text-end"
              label="Check-out Time"
            />
          )}
          {today_shift?.assigned ? (
            !today_shift?.isOffToday && (
              <DetailBox
                value={today_shift?.shifts.map(({ start_time, end_time }) => (
                  <span>
                    {start_time} - {end_time}
                  </span>
                ))}
                valueClassName="text-end flex flex-col w-fil min-w-[165px]"
                label="Shift Time"
              />
            )
          ) : (
            <DetailBox
              value={"No shift assigned"}
              valueClassName="text-end"
              label="Shift Time"
            />
          )}
          {attendance?.status && (
            <DetailBox
              value={
                today_shift?.isOffToday ? (
                  <StatusLabel variant="info">
                    {today_shift?.OffLabel}
                  </StatusLabel>
                ) : (
                  <StatusLabel status={attendance?.status}>
                    {attendance?.status}
                  </StatusLabel>
                )
              }
              label="Attendance Status"
              labelClassName="w-50"
              valueClassName="justify-end flex"
            />
          )}
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
                      ? 365 *
                        (1 - payableHours / parseFloat(attendance?.total_hours))
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
          <div className="flex justify-between mt-4">
            <div>
              <div>
                <RenderBreakButton
                  disable={disable}
                  attendance={attendance}
                  Shift={today_shift}
                  OnBreak={OnBreak}
                  reloadData={reloadData}
                />
              </div>
            </div>
            <div>
              <div className="flex flex-col gap-2">
                <RenderLogInButton
                  disable={disable}
                  attendance={attendance}
                  Shift={today_shift}
                  OnBreak={OnBreak}
                  reloadData={reloadData}
                />
                {attendance?.status === "Late" && (
                  <TimeAdjustmentRequest attendance={attendance} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const RenderBreakButton = ({
  disable,
  attendance,
  Shift,
  OnBreak,
  reloadData = () => {},
}) => {
  const userProfile = useSelector((state) => state.user.userProfile);
  if (attendance && attendance?.checkout) {
    return null;
  }
  if (!Shift?.shifts || Shift?.shifts?.length === 0) return null;

  const disableBreakButton = disable || !attendance?.checkin;

  const startBreak = async () => {
    const startTime = moment().utc().toISOString();
    const payload = {
      break_type: "Lunch",
      starttime: startTime,
      employee_id: userProfile.id,
      attendance: attendance?.id,
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
            attendance: attendance?.id,
          },
        },
        endTime
      );

      if (result) {
        toast.success("Break ended");
        const breakDuration = await calculateBreak({
          filterData: {
            employee_id: userProfile.id,
            attendance: attendance?.id,
          },
        });
        const payload = {
          id: attendance?.id,
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
  Shift,
  OnBreak,
  reloadData = () => {},
}) => {
  const userProfile = useSelector((state) => state.user.userProfile);
  const user_details = useSelector((state) => state.emp.user_details);
  const [showCheckoutAlert, setShowCheckoutAlert] = useState(false);
  const handleCheckoutClick = () => {
    setShowCheckoutAlert(true);
  };
  if (attendance && attendance?.checkout) {
    return null;
  }
  if (!Shift?.shifts || Shift?.shifts?.length === 0) return null;
  const startShift = async () => {
    if (attendance && attendance?.checkout) {
      toast.success("Shift already ended");
      return;
    }
    if (!attendance) {
      const checkInTime = moment().utc().toISOString();
      // Compare time only
      const payload = {
        checkin: checkInTime,
        employee_id: userProfile.id,
        date: moment().format("YYYY-MM-DD"),
      };
      const response = await saveAttendance(payload, Shift, attendance?.id);
      if (response) {
        toast.success("Shift started");
        reloadData(true);
      }
      return;
    }
  };

  const endShift = async () => {
    debugger;
    const checkout = moment().utc().toISOString();
    const payload = {
      break_duration: attendance?.break_duration,
      checkin: attendance?.checkin,
      id: attendance?.id,
      checkout: checkout,
    };
    const response = await saveAttendance(payload, user_details);
    if (response) {
      toast.success("Shift ended");
      reloadData(true);
      setShowCheckoutAlert(false);
    }
  };
  const disableCheckOutButton = OnBreak || disable;
  const disableCheckInButton = disable;
  // If attendance exists and not on break, show Pause and Stop
  return (
    <div className="flex flex-col gap-3">
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
        <>
          <Button
            variant="default"
            size="sm"
            disabled={disableCheckOutButton}
            onClick={handleCheckoutClick}
          >
            Check Out
          </Button>

          {showCheckoutAlert && (
            <AlertDialogue
              title="Confirm Checkout"
              description="Are you sure you want to checkout?"
              isOpen={showCheckoutAlert}
              setIsOpen={setShowCheckoutAlert}
              handleContinue={() => {
                endShift();
              }}
              continueText="Yes, Checkout"
              cancelText="Cancel"
            />
          )}
        </>
      )}
    </div>
  );
};
