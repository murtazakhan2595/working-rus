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
  const [employeeShift, setEmployeeShift] = useState({});
  const [attendance, setAttendance] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [onBreak, setOnBreak] = useState(false);
  // const [activeTab, setActiveTab] = useState("day");
  const [reloadData, setReloadData] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [activeFilter, setactiveFilter] = useState("Month");

  const userProfile = useSelector((state) => state.user.userProfile);
  const user_details = useSelector((state) => state.emp.user_details);
  const [filterData, setFilterData] = useState({
    employee_id: userProfile.id,
    date_range: GetDateRange(activeFilter),
  });

  const getAttendanceList = async () => {
    const attendanceData = await getAttendance({
      filterData: filterData,
    });
    if (attendanceData) {
      setAttendanceData(attendanceData.results);
    }
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
      const todayAttendance = attendance?.results[0];
      setAttendance(todayAttendance);
      const breakStatus = await getBreakStatus({
        filterData: {
          employee_id: userProfile.id,
          attendance: todayAttendance.id,
        },
      });
      setOnBreak(breakStatus);
    }
  };
  const fetchShiftData = async (isMounted, shiftAssigned) => {
    const shift = await getShiftById(shiftAssigned);
    if (shift && isMounted) {
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
    const checkout = moment().utc().toISOString() ;
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
    fetchShiftData(isMounted, user_details?.shift_assignment);
    return () => {
      isMounted = false;
    };
  }, [user_details]);

  useEffect(() => {
    getAttendanceList();
  }, [filterData]);

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

  return (
    <>
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <EmployeeSelfTimesheet
            employeeShift={employeeShift}
            attendance={attendance}
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
          <CardContent>
            <TableCustom
              data={attendanceData}
              columns={MyAttendanceColumn(getAttendanceList)}
              pagination={true}
              dataTotalSize={attendanceData.count || 0}
             // tableOptions={tableOptions}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Attendance;
