import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "src/@/components/ui/table";
import { Progress } from "src/@/components/ui/progress";
import Avatar from "components/ui/Avatar";
import {
  EmployeeID,
  EmployeeName,
  DepartmentName,
  DesignationName,
} from "utils/getValuesFromTables";
import moment from "moment";
import {
  TodayStatistics,
  EmployeeInfo,
  HourlyStatistics,
  MyAttendanceHistory,
  EmployeeAttendanceOverview,
} from "app/modules/Attendance/EmployeeAttendance/Section";
import {
  getShiftAssignment,
  saveShiftAssignment,
  getAttendance,
  saveAttendance,
  saveBreak,
  getBreak,
} from "app/hooks/attendance";
import { PageLoader } from "components";
import { toast } from "react-toastify";
import { calculateBreak } from "app/hooks/attendance";
import { getBreakStatus } from "app/hooks/attendance";
import { endBreak } from "app/hooks/attendance";
import { useSelector } from "react-redux";
import { getStats } from "app/hooks/attendance";
import { GetUser } from "utils/getValuesFromTables";
import { GetDateRange } from "utils/renderValues";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const EmployeeAttendance = () => {
  const { id } = useParams();
  const userProfile = GetUser(id);
  const [isLoading, setIsLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [filterData, setFilterData] = useState({
    date_range: GetDateRange("week"),
    employee_id: userProfile.id,
  });

  const getAttendanceList = async (isMounted) => {
    setIsLoading(true);
    try {
      const attendanceData = await getAttendance({
        filterData: filterData,
      });
      if (isMounted) {
        if (attendanceData) {
          setAttendanceData(attendanceData.results);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    getAttendanceList(isMounted);
    return () => {
      isMounted = false;
    };
  }, [filterData]);

  // useEffect(async () => {
  //   let isMounted = true;
  //   // const attendanceData = await saveAttendance({
  //   //   checkin: "2024-12-19T10:00:00.000Z", // 17 Dec 2024, 10:00 AM in UTC
  //   //   // checkout: "", // 17 Dec 2024, 7:00 PM in UTC
  //   //   total_hours: "8.00",
  //   //   payable_hours: "8.00",
  //   //   break_duration: "1.00",
  //   //   date: "2024-12-19",
  //   //   remarks: "Good",
  //   //   overtime_hours: "1.00",
  //   //   status: "Present",
  //   //   is_weekend: false,
  //   //   is_absent: false,
  //   //   is_late: false,
  //   //   employee_id: 88,
  //   //   shift_id: null,
  //   //   shift_name: null,
  //   //   shift_starttime: null,
  //   //   shift_endtime: null,
  //   //   shift_is_org_based: null,
  //   //   shift_organization: null,
  //   // });
  //   return () => {
  //     isMounted = false;
  //   };
  // }, []);

  if (isLoading) return <PageLoader />;
  return (
    <>
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="mt-5">
              <div className="flex justify-start flex-col">
                <EmployeeInfo />
                <TodayStatistics
                  userId={userProfile.id}
                  shiftId={userProfile.shift_assignment}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-plum-900">Hours Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <HourlyStatistics userId={userProfile.id} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-plum-900">Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <EmployeeAttendanceOverview
                userId={userProfile.id}
                attendanceData={attendanceData}
              />
            </CardContent>
          </Card>
        </div>

        <MyAttendanceHistory userId={userProfile.id} />
      </div>
    </>
  );
};

export default EmployeeAttendance;
