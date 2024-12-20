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
import { CalendarIcon, FilterIcon, PlayCircle } from "lucide-react";
import moment from "moment";
import {EmployeeSelfTimesheet} from "app/modules/Attendance/MyAttendance/Section";
import {
  getShiftAssignment,
  getAttendance,
  saveAttendance,
  saveBreak,
  getBreak,
} from "app/hooks/attendance";
import { useSelector } from "react-redux";
import { PageLoader } from "components";
import { toast } from "react-toastify";
import { calculateBreak } from "app/hooks/attendance";
import { getBreakStatus } from "app/hooks/attendance";
import { endBreak } from "app/hooks/attendance";
import { getLocalTime } from "app/hooks/attendance";
import { getStats } from "app/hooks/attendance";



const Attendance = () => {
  const [loading, setLoading] = useState(false);
  const [employeeShift, setEmployeeShift] = useState({});
  const [attendance, setAttendance] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [onBreak, setOnBreak] = useState(false);

  const [stats, setStats] = useState([
    { label: "Today", value: "4.45", total: "8" },
    { label: "This Week", value: "25", total: "40" },
    { label: "This Month", value: "48.15", total: "160" },
    { label: "Remaining", value: "111.85", total: "160" },
    { label: "Overtime", value: "5", total: "160" },
  ]);
  const userProfile = useSelector((state) => state.user.userProfile);
  const [filterData, setFilterData] = useState({
    date_range: "2024-12-10,2024-12-20",
    employee_id: userProfile.id,
  });
  console.log("ATTENDANCE -",attendance)
  console.log("ON BREAK -",onBreak)

  const getAttendanceList = async () => {
    const attendanceData = await getAttendance({
      filterData: filterData
    });
    if (attendanceData) {
      setAttendanceData(attendanceData.results);
    }
  };

  const setAttendanceWithLocalTime = (attendance) => {
    if (attendance) {
      setAttendance({
        ...attendance,
        checkin: attendance.checkin.replace("Z","")
      });
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const shift = await getShiftAssignment({
      filterData: { employee_id: userProfile.id },
    });
    if (shift) {
      const formattedShift = {
        ...shift.results[0],
        shift_start_time: moment(shift.results[0].shift_start_time).format(
          "h:mm a"
        ),
        shift_end_time: moment(shift.results[0].shift_end_time).format(
          "h:mm a"
        ),
      };
    }
    setEmployeeShift({
      shift_start_time: moment("2024-12-11T19:50:00").format("h:mm a"),
      shift_end_time: moment("2024-12-11T20:50:00").format("h:mm a"),
    });

    const attendance = await getAttendance({
      filterData: {
        employee_id: userProfile.id,
        date: moment().format("YYYY-MM-DD"),
        // date: "2024-12-15",
      },
    });
    if (attendance) {
      setAttendanceWithLocalTime(attendance.results[0]);
    }
    await getAttendanceList();
    if (attendance && attendance.results.length > 0) {
      const breakStatus = await getBreakStatus({
        filterData: {
          employee_id: userProfile.id,
          attendance_id: attendance.id,
        },
        options: {
          page: 1,
          sizePerPage: 1,
        },
      });
      setOnBreak(breakStatus);
    }
        // const stats = await getStats();

    setLoading(false);
  };
  const endShift = async () => {
    const checkout = moment().format("YYYY-MM-DDTHH:mm:ss");
    await updatePayableHours()
    await endBreak({
      filterData: {
        employee_id: userProfile.id,
        attendance_id: attendance.id,
      },
      options: {
        page: 1,
        sizePerPage: 1,
      },
    }, checkout);

    const breakDuration = await calculateBreak({
      filterData: {
        employee_id: userProfile.id,
        attendance_id: attendance.id,
      },
    });

    let overTime = 0;
    if (attendance.payable_hours > attendance.total_hours) {
      overTime = attendance.payable_hours - attendance.total_hours;
    }
    const payload = {
      id: attendance.id,
      checkout: checkout,
      break_duration: breakDuration,
      overtime_hours: overTime,
    };
    const response = await saveAttendance(payload);
    if (response) {
      await getAttendanceList()
      toast.success("Shift ended");
      setAttendanceWithLocalTime(response);
    }
    setOnBreak(false);
  };

  useEffect(() => {
    fetchData();
  }, []);
  const initializeAttendance = async () => {
    const startTime = moment(employeeShift.shift_start_time, "h:mm a");
    const endTime = moment(employeeShift.shift_end_time, "h:mm a");
    const totalHours = endTime.diff(startTime, "hours", true);
    const payload = {
      total_hours: totalHours,
      checkin: moment().format("YYYY-MM-DDTHH:mm:ss"),
      status: moment().isAfter(moment(employeeShift.shift_start_time, "h:mm a"))
        ? "Late"
        : "Present",
      is_late: moment().isAfter(
        moment(employeeShift.shift_start_time, "h:mm a")
      ),
      employee_id: userProfile.id,
      shift_assignment: employeeShift.id,
      checkout: null,
      is_weekend: [0, 6].includes(moment().day()),
      is_absent: false,
      break_duration: "0",
      overtime_hours: "0",
      payable_hours: "0",
      date: moment().format("YYYY-MM-DDTHH:mm:ss"),
    };
    const response = await saveAttendance(payload);
    if (response) {
      toast.success("Shift started");
      setAttendanceWithLocalTime(response);
    }
  };

  const updateAttendanceAttributes1 = async () => {

    let overTime = 0;
    if (parseFloat(attendance.payable_hours) > attendance.total_hours) {
      overTime = parseFloat(attendance.payable_hours) - attendance.total_hours;
    }
    const payload = {
      id: attendance.id,
      overtime_hours: overTime,
    };
    const response = await saveAttendance(payload);
    if (response) {
      setAttendanceWithLocalTime(response);
      await getAttendanceList();
    }
  };
  const updateAttendanceAttributes2 = async () => {
    const breakDuration = await calculateBreak({
      filterData: {
        employee_id: userProfile.id,
        attendance_id: attendance.id,
      },
    });
    let overTime = 0;
    if (parseFloat(attendance.payable_hours) > attendance.total_hours) {
      overTime = parseFloat(attendance.payable_hours) - attendance.total_hours;
    }
    const payload = {
      id: attendance.id,
      overtime_hours: overTime,
      break_duration: breakDuration,
    };
    const response = await saveAttendance(payload);
    if (response) {
      setAttendanceWithLocalTime(response);
      await getAttendanceList();
    }
  }

  const updatePayableHours = async () => {
    let startTime;
    let endTime;
    const lastBreak = await getBreak({
      filterData: {
        employee_id: userProfile.id,
        attendance_id: attendance.id,
      },
      options: {
        page: 1,
        sizePerPage: 3,
      },
    });
    if (lastBreak && lastBreak.results.length === 0) {
      startTime = moment(attendance.checkin);
      endTime = moment(moment().format("YYYY-MM-DDTHH:mm:ss"));
    } else {
      startTime = moment(lastBreak.results[0].endtime.replace("Z", ""));
      endTime = moment(moment().format("YYYY-MM-DDTHH:mm:ss"));
    }
    console.log("startTime", startTime, "endTime", endTime);
    const totalHours = endTime.diff(startTime, "hours", true);
    const payableHours =
      parseFloat(attendance.payable_hours) + parseFloat(totalHours);
    console.log("payableHours", payableHours);
    const payload = {
      id: attendance.id,
      payable_hours: payableHours.toFixed(2),
    };
    const response = await saveAttendance(payload);
    if (response) {
      setAttendanceWithLocalTime(response);
      await getAttendanceList();
    }
  };
  const startShift = async () => {
    console.log("SHIFT START FUNCTION")
    if (attendance && attendance.checkout) {
      toast.success("Shift already ended");
      return;
    }
    if (!attendance) {
      await initializeAttendance();
      await getAttendanceList();
      return;
    }
    if (onBreak) {
      const result = await endBreak(
        {
          filterData: {
            employee_id: userProfile.id,
            attendance_id: attendance.id,
          },
          options: {
            page: 1,
            sizePerPage: 1,
          },
        },
        moment().format("YYYY-MM-DDTHH:mm:ss")
      );

      if (result) {
        await updateAttendanceAttributes2();
        setOnBreak(false);
        toast.success("Break ended");
      }
    }
    await getAttendanceList();
  };

  const pauseShift = async () => {
    const startTime = moment().format("YYYY-MM-DDTHH:mm:ss");
    await updatePayableHours();
    const payload = {
      break_type: "Lunch",
      starttime: startTime,
      employee_id: userProfile.id,
      attendance: attendance.id,
    };
    const response = await saveBreak(payload);
    if (response) {
      setOnBreak(true);

      toast.success("Break started");
    }
    await updateAttendanceAttributes1();
    await getAttendanceList();
  };


  return (
    <>
      {loading ? (
        <PageLoader />
      ) : (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <EmployeeSelfTimesheet
              employeeShift={employeeShift}
              attendance={attendance}
              startShift={startShift}
              pauseShift={pauseShift}
              endShift={endShift}
              OnBreak={onBreak}
            />

            <Card>
              <CardHeader>
                <CardTitle className="text-plum-900">Statistics</CardTitle>
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
                <CardTitle className="text-plum-900">
                  Recent Activities
                </CardTitle>
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
                          ? moment(row?.checkout.replace("Z","")).format("h:mm A")
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

export default Attendance;
