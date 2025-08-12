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
  saveUserBiometricAttendance,
  getAttendancebyEmployee,
} from "app/hooks/attendance";
import { Button } from "components/ui/button";
import AlertDialogue from "components/ui/AlertDialogue";
import { StatusLabel } from "components";
import { DetailBox } from "components/SheetCardExtension";
import { TriangleAlert } from "lucide-react";
import {
  mapAttendanceCheckInPayload,
  mapAttendanceCheckOutPayload,
} from "app/utils/MappingObjects/mapAttendanceData";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { getActiveShiftData } from "app/hooks/shiftManagement";

export default function EmployeeSelfTimesheet({
  OnBreak,
  disable,
}) {
  const { id: user_id, biometric_id: user_biometric_id, employee_status } = useSelector((state) => state.emp.user_details) || {};

  const [payableHours, setPayableHours] = useState(0);
  const [ShiftData, setShiftData] = useState({});
  const [attendance, setAttendance] = useState(null);
  const updateTimer = (ShiftData) => {
    const isSplitShit = ShiftData?.is_split_shift;
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
        updateTimer(ShiftData); // Initial update
        const interval = setInterval(updateTimer, 1000); // Update every second
        return () => clearInterval(interval); // Cleanup on unmount
      } else if (attendance?.second_checkin && !attendance.second_checkout) {
        updateTimer(ShiftData); // Initial update
        const interval = setInterval(updateTimer, 1000); // Update every second
        return () => clearInterval(interval); // Cleanup on unmount
      } else {
        setPayableHours(parseFloat(attendance?.payable_hours) || 0);
      }
    } else if (OnBreak) {
      updateTimer(ShiftData);
    }
  }, [attendance, OnBreak, ShiftData]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await saveUserBiometricAttendance(user_biometric_id);
        if (isMounted && response) {
          await fetchAttendanceData(true);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    if (user_biometric_id) {
      fetchData(); // Initial call

      const interval = setInterval(() => {
        fetchData();
      }, 300000); // 5 minutes

      return () => {
        clearInterval(interval); // Cleanup
        isMounted = false;
      };
    }

    return () => {
      isMounted = false;
    };
  }, [user_id, attendance]); // Add attendance if it's used inside

  const fetchAttendanceData = async (isMounted) => {
    try {
      const attendanceResponse = await getAttendancebyEmployee(
        user_id,
        moment()
      );
      if (isMounted) {
        if (attendanceResponse) {
          setAttendance(attendanceResponse);
          setPayableHours(parseFloat(attendanceResponse?.payable_hours) || 0);
        }
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (user_id) fetchAttendanceData(isMounted, user_id);
    return () => {
      isMounted = false;
    };
  }, [user_id]);

  useEffect(() => {
    let isMounted = true;
    const fetchShiftData = async (isMounted) => {
      try {
        const today_shift = await getActiveShiftData(user_id, moment());
        if (isMounted) {
          if (today_shift) {
            setShiftData(today_shift);
          }
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    if (user_id) fetchShiftData(isMounted, user_id);
    return () => {
      isMounted = false;
    };
  }, [user_id]);

  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-plum-900">Attendance Log</span>
          <span className="text-sm text-slate-1200">
            {renderDate(moment())}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {['Terminated', 'Exit', 'Resigned', 'Resigned', 'Absconded'].includes(employee_status) ?
          (
            <div className="text-red-800 flex flex-wrap justify-center items-center">
              <TriangleAlert size={36} /> You are no longer an active employee of the organization. Your status has been updated to "{employee_status}". Please contact your manager or admin if you believe this is an error or system glitch.
            </div>
          ) : (
            <div className="space-y-2">
              {!ShiftData?.isOffToday && (
                <>
                  {" "}
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
                  {ShiftData?.shift_assigned ? (
                    !ShiftData?.isOffToday && (
                      <DetailBox
                        value={ShiftData?.shifts.map(
                          ({ start_time, end_time }) => (
                            <span>
                              {start_time} - {end_time}
                            </span>
                          )
                        )}
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
                        ShiftData?.isOffToday ? (
                          <StatusLabel variant="info">
                            {ShiftData?.OffLabel}
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
                </>
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
              {ShiftData?.isOffToday && (
                <div className="text-red-800 flex flex-wrap justify-center items-center">
                  <TriangleAlert size={14} /> You are on{" "}
                  {ShiftData?.OffLabel?.toLowerCase()} today
                </div>
              )}

              <div className="flex justify-between mt-4">
                <div>
                  <div>
                    <RenderBreakButton
                      disable={disable}
                      attendance={attendance}
                      Shift={ShiftData}
                      OnBreak={OnBreak}
                      reloadData={fetchAttendanceData}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex flex-col gap-2">
                    <RenderLogInButton
                      disable={disable}
                      attendance={attendance}
                      Shift={ShiftData}
                      OnBreak={OnBreak}
                      reloadData={fetchAttendanceData}
                    />
                    {attendance?.status === "Late" && (
                      <TimeAdjustmentRequest attendance={attendance} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        }
      </CardContent>
    </Card>
  );
}

const RenderBreakButton = ({
  disable,
  attendance,
  Shift,
  OnBreak,
  reloadData = () => { },
}) => {
  const isSplitShift = Shift?.is_split_shift;
  const userProfile = useSelector((state) => state.user.userProfile);
  if (isSplitShift && attendance && attendance?.second_checkout) return null;
  if (!isSplitShift && attendance && attendance?.checkout) return null;

  if (!Shift?.shifts || Shift?.shifts?.length === 0) return null;

  const disableBreakButton =
    disable ||
    !attendance?.checkin ||
    (isSplitShift && !attendance?.second_checkin);

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
      reloadData(true);
    }
  };

  const endBreakResumeShift = async () => {
    const endTime = moment().utc().toISOString();
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
          reloadData(true);
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
  reloadData = () => { },
}) => {
  const isSplitShift = Shift?.is_split_shift;
  const userProfile = useSelector((state) => state.user.userProfile);
  const [showCheckoutAlert, setShowCheckoutAlert] = useState(false);
  const handleCheckoutClick = () => {
    setShowCheckoutAlert(true);
  };
  if (isSplitShift && attendance && attendance?.second_checkout) return null;
  if (!isSplitShift && attendance && attendance?.checkout) return null;

  if (!Shift?.shifts || Shift?.shifts?.length === 0) return null;
  const startShift = async () => {
    const payload = mapAttendanceCheckInPayload(
      moment(),
      attendance,
      isSplitShift,
      userProfile?.id
    );
    if (payload) {
      const response = await saveAttendance(payload, Shift, attendance?.id);
      if (response) {
        toast.success("Shift started");
        reloadData(true);
      }
    }
    return;
  };

  const endShift = async () => {
    const payload = mapAttendanceCheckOutPayload(
      moment(),
      attendance,
      isSplitShift
    );
    if (payload) {
      const response = await saveAttendance(payload, Shift, attendance?.id);
      if (response) {
        toast.success("Shift ended");
        reloadData(true);
        setShowCheckoutAlert(false);
      }
    }
  };
  const disableCheckOutButton = OnBreak || disable;
  const disableCheckInButton = disable;
  // If attendance exists and not on break, show Pause and Stop

  const showCheckInButton =
    !attendance?.checkin || (isSplitShift && !attendance?.second_checkin);
  return (
    <div className="flex flex-col gap-3">
      {showCheckInButton ? (
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
