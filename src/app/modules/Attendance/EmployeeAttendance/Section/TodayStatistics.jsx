import React, { useEffect, useState } from "react";
import { getAttendancebyEmployee } from "app/hooks/attendance";
import { DetailBox } from "components/SheetCardExtension";
import moment from "moment";
import { PageLoader, StatusLabel } from "components";
import { getActiveShiftData } from "app/hooks/shiftManagement";
import { renderDate } from "utils/renderValues";

const TodayStatistics = ({ userId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [attendanceData, setTodayAttendanceData] = useState({});
  const [shift_details, setShiftDetails] = useState(null);
  const getTodayAttendanceData = async (isMounted) => {
    setIsLoading(true);
    try {
      const attendanceData = await getAttendancebyEmployee(userId, moment());
      const activeShift = await getActiveShiftData(userId, moment());
      if (isMounted) {
        if (attendanceData) {
          setTodayAttendanceData(attendanceData);
        } else {
          setTodayAttendanceData(null);
        }
        if (activeShift) {
          setShiftDetails(activeShift);
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
    getTodayAttendanceData(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-4 mt-4">
      <DetailBox
        value={renderDate(moment())}
        label="Time Log"
        labelClassName="w-50"
        valueClassName="justify-end flex"
      />
      {!shift_details?.isOffToday && (
        <>
          <DetailBox
            value={
              attendanceData?.checkin
                ? renderDate(attendanceData?.checkin, "--", "time")
                : "Start working!"
            }
            valueClassName="text-end"
            label="Check-in Time"
          />
          {attendanceData?.checkin && (
            <DetailBox
              value={
                attendanceData?.checkout
                  ? renderDate(attendanceData?.checkout, "--", "time")
                  : "Still Working"
              }
              valueClassName="text-end"
              label="Check-out Time"
            />
          )}
          {shift_details?.shift_assigned ? (
            !shift_details?.isOffToday && (
              <DetailBox
                value={shift_details?.shifts.map(({ start_time, end_time }) => (
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
        </>
      )}
      <DetailBox
        value={
          shift_details?.isOffToday ? (
            <StatusLabel variant="info">{shift_details?.OffLabel}</StatusLabel>
          ) : (
            <StatusLabel status={attendanceData?.status}>
              {attendanceData?.status}
            </StatusLabel>
          )
        }
        label="Attendance Status"
        labelClassName="w-50"
        valueClassName="justify-end flex"
      />
      <DetailBox
        value={
          shift_details?.is_on_leave ? (
            <StatusLabel variant="info">{shift_details?.OffLabel}</StatusLabel>
          ) : (
            <span>Not Applicable</span>
          )
        }
        label="Leave Status"
        labelClassName="w-50"
        valueClassName="justify-end flex"
      />
    </div>
  );
};

export default TodayStatistics;
