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
import { PageLoader, UnauthorizedAccess } from "components";
import { UpdateEmployeeAttendance } from "app/modules/Attendance/Sections";
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
import { HasAccess } from "utils/PermissionUtils";
import DailyShiftDetailsCard from '../../../../components/DailyShiftDetailsCard';

const Attendance = () => {
  // Permission checks for attendance features
  const canMarkAttendance = HasAccess("MARK_ATTENDANCE");
  const canMarkBreak = HasAccess("MARK_BREAK");
  const canViewAttendance = HasAccess("VIEW_ATTENDANCE");
  const canUpdateAttendance = HasAccess("UPDATE_ATTENDANCE_REQUEST");
  const canDownloadReport = HasAccess("VIEW_ATTENDANCE"); // Using same permission for download
  const [openUpdateAttendance, setOpenUpdateAttendance] = useState(false);
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

  // If user has no attendance permissions at all
  if (!canMarkAttendance && !canViewAttendance) {
    return (
      <UnauthorizedAccess
        title="Attendance Access Denied"
        featureName="attendance features"
        message="You don't have permission to view or manage attendance. Please contact your administrator to request access."
        showButtons={true}
        size="lg"
      />
    );
  }

  return (
    <>
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Timesheet Section */}
          {canMarkAttendance ? (
            <EmployeeSelfTimesheet
              employeeShift={EmployeeShiftData}
              attendance={attendance}
              OnBreak={onBreak}
              canMarkBreak={canMarkBreak}
              reloadData={() => {
                getAttendanceList();
                fetchTodayAttandanceData(true);
              }}
              setOnBreak={setOnBreak}
            />
          ) : (
            <Card>
              <CardContent className="p-4">
                <UnauthorizedAccess
                  title="Timesheet Access Denied"
                  featureName="attendance marking"
                  size="sm"
                />
              </CardContent>
            </Card>
          )}

          {/* Statistics Card */}
          {canViewAttendance ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-plum-900">Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <HourlyStatistics userId={userProfile?.id} />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-plum-900">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <UnauthorizedAccess
                  title="Statistics Access Denied"
                  featureName="attendance statistics"
                  size="sm"
                />
              </CardContent>
            </Card>
          )}

          {/* Recent Activities */}
          {canViewAttendance ? (
            <RecentActivities attendance={attendance} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-plum-900">
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <UnauthorizedAccess
                  title="Activities Access Denied"
                  featureName="attendance activities"
                  size="sm"
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Attendance History Section */}
        <div className="flex gap-2 justify-between items-center">
          <h3 className="text-2xl font-semibold leading-none tracking-tight flex flex-col space-y-1.5 p-6">
            <div className="text-plum-900">Attendance History</div>
          </h3>
          <div className="flex gap-2">
            {canViewAttendance && (
              <DateRangeFilter
                activeDateRange={activeFilter}
                setDateRange={(dateRange) => {
                  setactiveFilter(dateRange);
                  handleFilterChange(dateRange);
                }}
              />
            )}
            {canUpdateAttendance && (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  setOpenUpdateAttendance(true);
                }}
              >
                Update Attendance
              </Button>
            )}
            {canDownloadReport && canViewAttendance && (
              <Button variant="outline" onClick={downloadAttendance}>
                Monthly Report
              </Button>
            )}
          </div>
        </div>
        <Card>
          <CardContent>
            {canViewAttendance ? (
              <TableCustom
                data={attendanceData}
                columns={MyAttendanceColumn(getAttendanceList)}
                pagination={false}
                dataTotalSize={attendanceData.count || 0}
              />
            ) : (
              <UnauthorizedAccess
                title="Attendance History Access Denied"
                featureName="attendance history"
                message="You don't have permission to view attendance history. Please contact your administrator to request access."
                size="md"
              />
            )}
          </CardContent>
        </Card>
      </div>
      {openUpdateAttendance && (
        <UpdateEmployeeAttendance
          isOpen={openUpdateAttendance}
          isEmployee={true}
          setIsOpen={() => {
            setOpenUpdateAttendance(false);
            getAttendanceList(true);
          }}
        />
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <DailyShiftDetailsCard userId={userProfile.id} isDashboard={false} />
        </div>
      </div>
    </>
  );
};

export default Attendance;
