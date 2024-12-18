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

const TodayStatistics = ({ userId }) => {
  //  const userProfile = useSelector((state) => state.user.userProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [todayAttendanceData, setTodayAttendanceData] = useState({});
  const [todayShiftData, setTodayShiftData] = useState({});
  const getTodayAttendanceData = async (isMounted) => {
    setIsLoading(true);
    try {
      const attendanceData = await getAttendance({
        filterData: {
          date_range: "2024-12-18,2024-12-18",
          employee_id: userId,
        },
      });
      if (isMounted) {
        const todayAttendance =
          attendanceData &&
          attendanceData.results &&
          attendanceData.results.length > 0
            ? attendanceData.results[0]
            : {};
        if (todayAttendance) {
          setTodayAttendanceData(todayAttendance);
          const shiftData = await getShiftById(todayAttendance.shift_id ?? 11);
          setTodayShiftData(shiftData);
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
                : "---"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="pl-0">Shift Time</TableCell>
            <TableCell>
              {todayShiftData
                ? `${
                    todayShiftData.starttime
                      ? moment(todayShiftData.starttime).format("hh:mm A")
                      : "---"
                  } - ${
                    todayShiftData.endtime
                      ? moment(todayShiftData.endtime).format("hh:mm A")
                      : "---"
                  }`
                : "---"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="pl-0">Allowance</TableCell>
            <TableCell>Enable</TableCell>
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
