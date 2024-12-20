import React, { useEffect, useState } from "react";
import { getAttendance, getShiftById } from "app/hooks/attendance";
import { useSelector } from "react-redux";
import moment from "moment";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "src/@/components/ui/table";
import { PageLoader } from "components";

const TodayStatistics = ({ userId, shiftId }) => {
  //  const userProfile = useSelector((state) => state.user.userProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [todayAttendanceData, setTodayAttendanceData] = useState({});
  const [shiftTime, setShiftTime] = useState(null);
  const getTodayAttendanceData = async (isMounted) => {
    setIsLoading(true);
    try {
      const attendanceData = await getAttendance({
        filterData: {
          date: moment().format("YYYY-MM-DD"),
          employee_id: userId,
        },
      });
      if (isMounted) {
        const todayAttendance =
          attendanceData &&
          attendanceData.results &&
          attendanceData.results.length > 0
            ? attendanceData.results[0]
            : null;
        if (todayAttendance) {
          setTodayAttendanceData(todayAttendance);
        } else {
          setTodayAttendanceData(null);
        }
        const shiftData = await getShiftById(shiftId);
        if (shiftData) {
          const shiftTime = shiftData
            ? `${
                shiftData.starttime
                  ? moment(shiftData.starttime).format("hh:mm A")
                  : "---"
              } - ${
                shiftData.endtime
                  ? moment(shiftData.endtime).format("hh:mm A")
                  : "---"
              }`
            : "---";
          setShiftTime(shiftTime);
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
    <div className="space-y-4">
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="pl-0">Today Check in</TableCell>
            <TableCell>
              {todayAttendanceData
                ? moment(todayAttendanceData.checkin).format("hh:mm A")
                : "---/---"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="pl-0">Shift Time</TableCell>
            <TableCell>{shiftTime ? shiftTime : "---/---"}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="pl-0">Annual Leave</TableCell>
            <TableCell>Not Applicable</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default TodayStatistics;
