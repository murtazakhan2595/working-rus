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
  getAttendanceData,
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
  const [attendance, setAttendance] = useState(null);
  const navigate = useNavigate();
  const [attendanceData, setAttendanceData] = useState([]);
  const [onBreak, setOnBreak] = useState(false);
  const [activeFilter, setactiveFilter] = useState("Day");
  const EmployeeShiftData = useSelector(
    (state) => state.attendance.assignedShiftData
  );
  const userProfile = useSelector((state) => state.user.userProfile);
  const [filterData, setFilterData] = useState({
    employee_id: userProfile.id,
    date: moment().format("YYYY-MM-DD"),
  });

  const getAttendanceList = async () => {
    const attendanceData = await getAttendance({
      filterData: filterData,
    });
    if (attendanceData) {
      setAttendanceData(attendanceData.results);
    }
  };

  const fetchBreakStatusData = async (isMounted, attendance) => {
    if (attendance && attendance?.id && isMounted) {
      const breakStatus = await getBreakStatus({
        filterData: {
          employee_id: userProfile.id,
          attendance: attendance?.id,
        },
      });
      setOnBreak(breakStatus);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchBreakStatusData(isMounted, attendance);
    return () => {
      isMounted = false;
    };
  }, [attendance]);

  const fetchTodayAttandanceData = async (isMounted) => {
    if (isMounted)
      if (attendance?.id) {
        const attendanceData = await getAttendanceData(attendance?.id);
        setAttendance(attendanceData);
      } else {
        const attendanceList = await getAttendance({
          filterData: {
            employee_id: userProfile.id,
            date: moment().format("YYYY-MM-DD"),
          },
        });
        if (attendanceList && attendanceList?.results?.length > 0) {
          const todayAttendance = attendanceList?.results[0];
          setAttendance(todayAttendance);
        }
      }
  };

  useEffect(() => {
    let isMounted = true;
    fetchTodayAttandanceData(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    getAttendanceList(isMounted);
    return () => {
      isMounted = false;
    };
  }, [filterData]);

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
            employeeShift={EmployeeShiftData}
            attendance={attendance}
            OnBreak={onBreak}
            reloadData={() => {
              getAttendanceList();
              fetchTodayAttandanceData(true);
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
              pagination={false}
              dataTotalSize={attendanceData.count || 0}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Attendance;
