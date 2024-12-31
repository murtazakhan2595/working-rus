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
import { EmployeeSelfTimesheet } from "app/modules/Attendance/MyAttendance/Section";
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
import { endBreak, getShiftById } from "app/hooks/attendance";
import { getLocalTime } from "app/hooks/attendance";
import { getStats, employeeData } from "app/hooks/attendance";

const Attendance = () => {
  const [loading, setLoading] = useState(false);
  const [employeeShift, setEmployeeShift] = useState({});
  const [attendance, setAttendance] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [onBreak, setOnBreak] = useState(false);
  const [activeTab, setActiveTab] = useState("day");
  const [disable, setDisable] = useState(false);
  const [attendanceHistoryLoading, setAttendanceHistoryLoading] =
    useState(false);

  const [stats, setStats] = useState([
    { label: "Today", value: "0", total: "8" },
    { label: "This Week", value: "0", total: "40" },
    { label: "This Month", value: "0", total: "160" },
    { label: "Remaining", value: "0", total: "160" },
    { label: "Overtime", value: "0", total: "160" },
  ]);
  const userProfile = useSelector((state) => state.user.userProfile);
  const user_details = useSelector((state) => state.emp.user_details);
  const [filterData, setFilterData] = useState({
    employee_id: userProfile.id,
    date: moment().format("YYYY-MM-DD"),
  });

  const getAttendanceList = async () => {
    setAttendanceHistoryLoading(true);
    const attendanceData = await getAttendance({
      filterData: filterData,
    });
    if (attendanceData) {
      setAttendanceData(attendanceData.results);
    }
    setAttendanceHistoryLoading(false);
  };

  const setAttendanceWithLocalTime = (attendance) => {
    if (attendance) {
      setAttendance({
        ...attendance,
      });
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const shift = await getShiftById(user_details?.shift_assignment || 1);
    if (shift) {
      setEmployeeShift({
        shift_start_time: moment(
          moment(shift.starttime).format("HH:mm:ss"),
          "HH:mm:ss"
        ),
        shift_end_time: moment(
          moment(shift.endtime).format("HH:mm:ss"),
          "HH:mm:ss"
        ),
      });
    }

    const attendance = await getAttendance({
      filterData: {
        employee_id: userProfile.id,
        date: moment().format("YYYY-MM-DD"),
      },
    });
    if (attendance) {
      setAttendanceWithLocalTime(attendance.results[0]);
    }

    if (attendance && attendance.results.length > 0) {
      const breakStatus = await getBreakStatus({
        filterData: {
          employee_id: userProfile.id,
          attendance: attendance.results[0].id,
        },
        options: {
          page: 1,
          sizePerPage: 1,
        },
      });
      setOnBreak(breakStatus);
    }
    let stats = await getStats(userProfile.id);
    stats = stats[0];
    if (stats) {
      // [
      //   { label: "Today", value: "4.45", total: "8" },
      //   { label: "This Week", value: "25", total: "40" },
      //   { label: "This Month", value: "48.15", total: "160" },
      //   { label: "Remaining", value: "111.85", total: "160" },
      //   { label: "Overtime", value: "5", total: "160" },
      // ];
      setStats([
        {
          label: "Today",
          value: stats.daily_hours.value,
          total: stats.daily_hours.total,
        },
        {
          label: "This Week",
          value: stats.weekly_hours.value,
          total: stats.weekly_hours.total,
        },
        {
          label: "This Month",
          value: stats.monthly_hours.value,
          total: stats.monthly_hours.total,
        },
        {
          label: "Remaining",
          value: stats.remaining_hours["total value"],
          total: stats.monthly_hours.total,
        },
        {
          label: "Overtime",
          value: stats.overtime_hours.overtimehours,
          total: 160,
        },
      ]);
    }
    setDisable(false);
    setLoading(false);
  };
  const endShift = async () => {
    setDisable(true);
    const checkout = moment().utc().format("YYYY-MM-DDTHH:mm:ss[Z]");
    await updatePayableHours();
    await endBreak(
      {
        filterData: {
          employee_id: userProfile.id,
          attendance: attendance.id,
        },
        options: {
          page: 1,
          sizePerPage: 1,
        },
      },
      checkout
    );

    const breakDuration = await calculateBreak({
      filterData: {
        employee_id: userProfile.id,
        attendance: attendance.id,
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
      await getAttendanceList();
      toast.success("Shift ended");
      setAttendanceWithLocalTime(response);
    }
    setOnBreak(false);
    setDisable(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    getAttendanceList();
  }, [filterData]);

  const initializeAttendance = async () => {
    const startTime = moment(employeeShift.shift_start_time, "h:mm a");
    const endTime = moment(employeeShift.shift_end_time, "h:mm a");
    const totalHours = endTime.diff(startTime, "hours", true);
    const is_late = moment(moment().format("HH:mm:ss"), "HH:mm:ss").isAfter(
      employeeShift.shift_start_time
    );
    const payload = {
      total_hours: totalHours,
      checkin: moment().utc().format("YYYY-MM-DDTHH:mm:ss[Z]"),
      status: is_late ? "Late" : "Present",
      is_late: is_late,
      employee_id: userProfile.id,
      shift_assignment: employeeShift.id,
      checkout: null,
      is_weekend: [0, 6].includes(moment().day()),
      is_absent: false,
      break_duration: "0",
      overtime_hours: "0",
      payable_hours: "0",
      date: moment().format("YYYY-MM-DD"),
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
        attendance: attendance.id,
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
  };

  const updatePayableHours = async () => {
    if (!attendance && attendance.results.length > 0) {
      toast.error("No attendance found");
      return;
    }
    let startTime;
    let endTime;
    const lastBreak = await getBreak({
      filterData: {
        employee_id: userProfile.id,
        attendance: attendance.id,
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
      startTime = moment(lastBreak.results[0].endtime?.replace("Z", ""));
      endTime = moment(moment().format("YYYY-MM-DDTHH:mm:ss"));
    }
    const totalHours = endTime.diff(startTime, "hours", true);
    const payableHours =
      parseFloat(attendance.payable_hours) + parseFloat(totalHours);
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
    setDisable(true);
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
            attendance: attendance.id,
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
    setDisable(false);
  };

  const pauseShift = async () => {
    setDisable(true);
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
    setDisable(false);
  };

  const handleFilterChange = (name, filterValue) => {
    let filterName = "date";
    if (name === "day") {
      filterName = "date";
      filterValue = moment().format("YYYY-MM-DD");
    } else if (name === "week") {
      // {"date_range":"2024-12-10,2024-12-15","employee_id":327}
      filterName = "date_range";
      filterValue =
        moment().startOf("week").format("YYYY-MM-DD") +
        "," +
        moment().endOf("week").format("YYYY-MM-DD");
    }
    setFilterData({
      [filterName]: filterValue,
      employee_id: userProfile.id,
    });
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
                <div className="text-plum-900">Attendance History</div>
                <div className="flex items-center gap-2 text-lg font-normal text-slate-900">
                  <button
                    className={`p-2 rounded-sm hover:bg-plum-400 hover:text-plum-900 ${
                      activeTab === "day" ? "bg-plum-400 text-plum-900" : ""
                    }`}
                    onClick={() => {
                      setActiveTab("day");
                      handleFilterChange("day");
                    }}
                  >
                    Day
                  </button>
                  <button
                    className={`p-2 rounded-sm hover:bg-plum-400 hover:text-plum-900 ${
                      activeTab === "week" ? "bg-plum-400 text-plum-900" : ""
                    }`}
                    onClick={() => {
                      setActiveTab("week");
                      handleFilterChange("week");
                    }}
                  >
                    Week
                  </button>
                  <button
                    className={`p-2 rounded-sm hover:bg-plum-400 hover:text-plum-900 ${
                      activeTab === "month" ? "bg-plum-400 text-plum-900" : ""
                    }`}
                    onClick={() => {
                      setActiveTab("month");
                      handleFilterChange("month");
                    }}
                  >
                    Month
                  </button>
                </div>
              </CardTitle>
            </CardHeader>
            {attendanceHistoryLoading ? (
              <PageLoader />
            ) : (
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
                            ? moment(row?.checkout?.replace("Z", "")).format(
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
            )}
          </Card>
        </div>
      )}
    </>
  );
};

export default Attendance;
