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
  TodayStatic,
  EmployeeInfo,
} from "app/modules/Attendance/MyAttendance/Section";
import EmployeeSelfTimesheet from "app/modules/Attendance/Sections/EmployeeSelfTimesheet";
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
import { use } from "react";

const MyAttendance = () => {
  const userProfile = useSelector((state) => state.user.userProfile);
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendance, setAttendance] = useState(null);
  const [filterData, setFilterData] = useState({
    date_range: "2024-12-10,2024-12-20",
    employee_id: userProfile.id,
  });
  const [stats, setStats] = useState([
    { label: "Today", value: "4.45", total: "8" },
    { label: "This Week", value: "25", total: "40" },
    { label: "This Month", value: "48.15", total: "160" },
    { label: "Remaining", value: "111.85", total: "160" },
    { label: "Overtime", value: "5", total: "160" },
  ]);
  const getAttendanceList = async () => {
    const attendanceData = await getAttendance({
      filterData: filterData,
    });
    if (attendanceData) {
      setAttendanceData(attendanceData.results);
    }
  };

  useEffect(() => {
    let isMounted = true;
    getAttendanceList(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(async () => {
    let isMounted = true;
    const attendanceData = await saveAttendance({
        // checkin: "2024-12-18T07:18:51.419Z",
        // checkout: "2024-12-18T07:18:51.419Z",
        // total_hours: 8,
        // payable_hours: 8,
        // break_duration: 1,
        // date: "2024-12-19",
        // remarks: "Good",
        // overtime_hours: 1,
        // status: "Present",
        // is_weekend: false,
        // is_absent: false,
        // is_late: false,
        // employee_id: 88,
        shift_id:11,

        id:62,
    //   employee_id: [88],
    //   id: 11,
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      {loading ? (
        <PageLoader />
      ) : (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="mt-5">
                <div className="flex justify-start flex-col">
                  <EmployeeInfo />
                  <TodayStatic userId={userProfile.id} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-plum-900">
                  Hours Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-900">{item.label}</span>
                        <span>
                          <span className="text-slate-1200">{item.value}</span>/
                          {item.total} hrs
                        </span>
                      </div>
                      <Progress
                        value={
                          (parseFloat(item.value) / parseFloat(item.total)) *
                          100
                        }
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-plum-900">Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      time: "10:30 am",
                      activity: "Check in",
                      description: "Back",
                    },
                    {
                      time: "10:10 am",
                      activity: "Check out",
                      description: "Away for Bank",
                    },
                    {
                      time: "09:10 am",
                      activity: "Check In",
                      description: "Start Working",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <div>{item.time}</div>
                        <div className="text-slate-900">{item.description}</div>
                      </div>
                      <div className="text-slate-900">{item.activity}</div>
                      <hr />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-plum-900">Attendance History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>S. No</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Punch In</TableHead>
                    <TableHead>Punch Out</TableHead>
                    <TableHead>Break</TableHead>
                    <TableHead>Overtime</TableHead>
                    <TableHead>Productivity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceData.map((row, index) => (
                    <TableRow
                      key={index}
                      className={index % 2 === 1 ? "bg-purple-50" : ""}
                    >
                      <TableCell>
                        {(index + 1).toString().padStart(2, "0")}
                      </TableCell>
                      <TableCell>
                        {row.date
                          ? new Date(row.date).toLocaleDateString("en-GB") // or 'en-US' based on your preference
                          : "No Date"}
                      </TableCell>
                      <TableCell>
                        {moment(attendance?.checkin).format("h:mm A")}
                      </TableCell>
                      <TableCell>
                        {row.checkout
                          ? moment(row?.checkout.replace("Z", "")).format(
                              "h:mm A"
                            )
                          : "Not Checked Out"}
                      </TableCell>
                      <TableCell>{row.break_duration || 0.0} hrs</TableCell>
                      <TableCell>{row.overtime_hours || 0.0} hrs</TableCell>
                      <TableCell>{row.payable_hours || 0.0} hrs</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default MyAttendance;
