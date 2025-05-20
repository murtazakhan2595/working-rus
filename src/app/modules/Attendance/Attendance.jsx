import React, { useEffect, useState } from "react";
import { Card, CardContent } from "components/ui/card";
import { Button } from "components/ui/button";
import moment from "moment";
import { getAttendanceSummary, getWeeklySummary } from "app/hooks/attendance";
import { PageLoader, TableCustom } from "components";
import { EmployeesAttendanceColumns } from "app/modules/Attendance/Sections/AttendanceTableColumns";
import { UpdateEmployeeAttendance } from "app/modules/Attendance/Sections";
import { LeaveStatusOverview } from "./Sections/LeaveStatusOverview";
import { StatisticsChart } from "./Sections/StatisticsChart";
import DepartmentOverview from "./Sections/DepartmentOverview";
import { StatsCards } from "./Sections/StatsCards";
import { FilterInput, DateRangeFilter } from "components/FormControl";
import { useSelector } from "react-redux";
import { GetDateRange, getWorkingDays } from "utils/renderValues";
import { exportRecordToExcel } from "utils/downloadUtils";
import { getLabelByValue } from "utils/getValuesFromTables";
import { HasAccess } from "utils/PermissionUtils";

const Attendance = () => {
  const isViewLeaveStatusPermitted = HasAccess("VIEW_LEAVE_STATUS");
  const isViewEmpAttendancePermitted = HasAccess("VIEW_EMPLOYEE_ATTENDANCE");
  const isExportAttendancePermitted = HasAccess("EXPORT_ATTENDANCE");
  const isViewWeeklytatusPermitted = HasAccess("VIEW_WEEKLY_STATISTICS");
  const isUpdateEmpAttendancePermitted = HasAccess(
    "UPDATE_EMPLOYEE_ATTENDANCE"
  );
  const isViewDptAttendancePermitted = HasAccess(
    "VIEW_DEPARTMENT_ATTENDANCE_OVERVIEW"
  );
  const Departments = useSelector((state) => state.common.departments);
  const Designations = useSelector((state) => state.common.designations);
  const userProfile = useSelector((state) => state.user.userProfile);
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openUpdateEmployeeAttendance, setOpenUpdateEmployeeAttendance] =
    useState(false);
  const [weeklySummary, setWeeklySummary] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [activeTab, setActiveTab] = useState("Day");
  const [TotalDays, setTotalDays] = useState(1);
  const [filterData, setFilterData] = useState(
    userProfile.role === 2 ? { direct_report: userProfile.id } : {}
  );
  const [dateRange, setDateRange] = useState(
    `${moment().format("YYYY-MM-DD")},${moment().format("YYYY-MM-DD")}`
  );
  const [ordering, setOrdering] = useState("emp_name");
  useEffect(() => {
    if (dateRange) {
      const date_range = dateRange.split(",");
      if (date_range && date_range.length > 0) {
        setTotalDays(getWorkingDays(date_range[0], moment()));
      }
    }
  }, [dateRange]);
  const handleFilterChange = (filterName, filterValue) => {
    if (filterName === "department_name") {
      setSelectedDepartment(filterValue);
    }
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterValue === "") {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }
      return updatedFilters;
    });
  };
  const getAttendanceList = async (isMounted) => {
    setIsLoading(true);
    try {
      const attendanceData = await getAttendanceSummary({
        filterData,
        dateRange,
        ordering,
      });
      if (isMounted) {
        if (attendanceData) {
          setAttendanceData(attendanceData);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const tableOptions = {
    onSortChange: (sortName) => {
      setOrdering(sortName);
    },
  };
  useEffect(() => {
    let isMounted = true;
    getAttendanceList(isMounted);
    return () => {
      isMounted = false;
    };
  }, [filterData, dateRange, ordering]);

  useEffect(() => {
    const fetchData = async () => {
      const weeklySummary = await getWeeklySummary();
      if (weeklySummary) {
        setWeeklySummary(weeklySummary);
      }
    };
    fetchData();
  }, []);

  const exportAttendanceToExcel = async () => {
    const dataToExport = await Promise.all(
      attendanceData?.results?.map(async (row) => ({
        ID: row.employee_serial_number,
        Name: row.emp_name,
        Department: row["employee_department name"],
        Designation: await getLabelByValue(
          row.employee_designation,
          Designations,
          "-"
        ),
        ...(activeTab.toUpperCase() === "DAY"
          ? { Status: row.daily_status }
          : {
              Present: row.attendance_stats.Present,
              Absent: row.attendance_stats.Absent,
              Late: row.attendance_stats.Late,
              Leaves: row.attendance_stats["On Leave"],
            }),
      }))
    );
    exportRecordToExcel(dataToExport, "Attendance", `Attendance_${dateRange}`);
  };

  return (
    <>
      <div
        className={`flex flex-col gap-4 ${window.location.pathname.substring(
          1
        )}`}
      >
        <div className="flex gap-4">
          {isViewLeaveStatusPermitted && <LeaveStatusOverview />}
          {isViewWeeklytatusPermitted && (
            <StatisticsChart weeklySummary={weeklySummary} />
          )}
          {isViewDptAttendancePermitted && <DepartmentOverview />}
        </div>
        {isViewEmpAttendancePermitted && (
          <>
            <StatsCards />
            <div className="flex justify-end gap-3 flex-row flex-wrap">
              <FilterInput
                filters={[
                  {
                    type: "search",
                    placeholder: "Search by Name",
                    name: "emp_name",
                    width: "w-[175px]",
                  },
                  {
                    type: "select-one",
                    option: Departments,
                    name: "department_name",
                    placeholder: "Department",
                    values: selectedDepartment,
                    width: "w-[175px]",
                  },
                ]}
                onChange={handleFilterChange}
              />
              <DateRangeFilter
                activeDateRange={activeTab}
                setDateRange={(dateRange) => {
                  if (dateRange.toUpperCase() === "DAY") {
                    setDateRange(
                      `${moment().format("YYYY-MM-DD")},${moment().format(
                        "YYYY-MM-DD"
                      )}`
                    );
                  } else {
                    setDateRange(GetDateRange(dateRange));
                  }
                  setActiveTab(dateRange);
                  return;
                }}
              />
              {isUpdateEmpAttendancePermitted && (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenUpdateEmployeeAttendance(true);
                  }}
                >
                  Update Attendance
                </Button>
              )}
              {isExportAttendancePermitted && (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    exportAttendanceToExcel();
                  }}
                  variant="continue"
                >
                  Export
                </Button>
              )}
            </div>
            <Card className="mb-10">
              <CardContent>
                <TableCustom
                  data={attendanceData.results || []}
                  columns={EmployeesAttendanceColumns(TotalDays)}
                  pagination={false}
                  dataTotalSize={attendanceData.count || 0}
                  tableOptions={tableOptions}
                />
              </CardContent>
            </Card>
          </>
        )}
      </div>
      {openUpdateEmployeeAttendance && (
        <UpdateEmployeeAttendance
          isOpen={openUpdateEmployeeAttendance}
          setIsOpen={() => {
            setOpenUpdateEmployeeAttendance(false);
            getAttendanceList(true);
          }}
        />
      )}
    </>
  );
};

export default Attendance;
