import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import moment from "moment";
import {
  EmployeeSelfTimesheet,
  RecentActivities,
} from "app/modules/Attendance/MyAttendance/Section";
import {
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
import { getStats, employeeData } from "app/hooks/attendance";
import TableCustom from "components/CustomTable";
import { MyAttendanceColumn } from "app/modules/Attendance/Sections/AttendanceTableColumns";
import { Button } from "components/ui/button";
import { useNavigate } from "react-router-dom";
import { HourlyStatistics } from "../EmployeeAttendance/Section";
import { DateRangeFilter } from "components/FormControl";
import { GetDateRange } from "utils/renderValues";

const Attendance = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [employeeShift, setEmployeeShift] = useState({});
  const [attendance, setAttendance] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [onBreak, setOnBreak] = useState(false);
  // const [activeTab, setActiveTab] = useState("day");
  const [reloadData, setReloadData] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [attendanceHistoryLoading, setAttendanceHistoryLoading] =
    useState(false);
  const [activeFilter, setactiveFilter] = useState("day");

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
    const attendance = await getAttendance({
      filterData: {
        employee_id: userProfile.id,
        date: moment().format("YYYY-MM-DD"),
      },
    });

    if (attendance && attendance.results.length > 0) {
      setAttendance(attendance?.results[0]);
      const breakStatus = await getBreakStatus({
        filterData: {
          employee_id: userProfile.id,
          attendance: attendance.results[0].id,
        },
      });
      setOnBreak(breakStatus);
    }
  };
  const fetchShiftData = async () => {
    debugger
    const shift = await getShiftById(user_details?.shift_assignment);
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
  };
  const endShift = async () => {
    setReloadData(true);
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
    setReloadData(true);
  };

  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetchShiftData(isMounted);
    return () => {
      isMounted = false;
    };
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
    const response = await saveAttendance(payload,user_details);
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
    setReloadData(true);
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
    setReloadData(true);
  };

  const pauseShift = async () => {
    setReloadData(true);
    const startTime = moment().format("YYYY-MM-DDTHH:mm:ss");
    // await updatePayableHours();
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
    setReloadData(true);
  };

  const handleFilterChange = (dateRange) => {
    if (dateRange?.toUpperCase() === "DAY") {
      setFilterData({
        date: moment().format("YYYY-MM-DD"),
        employee_id: userProfile.id,
      });
    } else {
      setFilterData({
        date_range: GetDateRange(dateRange),
        employee_id: userProfile.id,
      });
    }
  };

  const downloadAttendance = () => {
    navigate(`/attendance-reports/${userProfile?.id}`);
  };

  console.log("FILTERDATAAAAAAA", filterData);

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
              reloadData={() => {
                getAttendanceList();
                fetchData();
              }}
              setOnBreak={setOnBreak}
            />

            <Card>
              <CardHeader>
                <CardTitle className="text-plum-900">Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <HourlyStatistics userId={userProfile?.id} />
              </CardContent>
            </Card>
            <RecentActivities attendance={attendance} />
          </div>

          <div className="flex gap-2 justify-between items-center">
            <h3 className="text-2xl font-semibold leading-none tracking-tight flex flex-col space-y-1.5 p-6">
              {" "}
              <div className="text-plum-900">Attendance History</div>
            </h3>
            <div className="flex gap-2">
              {/* <div className="flex items-center gap-2 text-lg font-normal text-slate-900">
                {["day", "week", "month"].map((tab) => (
                  <button
                    key={tab}
                    className={`p-2 rounded-sm hover:bg-plum-400 hover:text-plum-900 ${
                      activeTab === tab ? "bg-plum-400 text-plum-900" : ""
                    }`}
                    onClick={() => {
                      setActiveTab(tab);
                      handleFilterChange(tab);
                    }}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
                <DateRangePicker
                  value={dateRange}
                  onChange={(value) => {
                    console.log("date range changed", value);
                    setDateRange(value);
                    handleFilterChange("date_range", value);
                  }}
                  placeholder="Select date range"
                />
              </div> */}
              <DateRangeFilter
                activeDateRange={activeFilter}
                setDateRange={(dateRange) => {
                  setactiveFilter(dateRange);
                  handleFilterChange(dateRange);
                }}
              />
              <Button variant="outline" onClick={downloadAttendance}>
                Download
              </Button>
            </div>
          </div>
          <Card>
            {attendanceHistoryLoading ? (
              <PageLoader />
            ) : (
              <CardContent>
                <TableCustom
                  data={attendanceData}
                  columns={MyAttendanceColumn}
                  pagination={true}
                  dataTotalSize={attendanceData.count || 0}
                  // tableOptions={tableOptions}
                />
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </>
  );
};

export default Attendance;
