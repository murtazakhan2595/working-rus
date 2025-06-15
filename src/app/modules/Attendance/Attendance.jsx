import React, { useEffect, useState } from "react";
import { Card, CardContent } from "components/ui/card";
import { Button } from "components/ui/button";
import moment from "moment";
import {
  getAttendanceSummary,
  getWeeklySummary,
  getAttendance,
} from "app/hooks/attendance";
import { PageLoader, TableCustom } from "components";
import { EmployeesAttendanceColumns } from "app/modules/Attendance/Sections/AttendanceTableColumns";
import {
  UpdateEmployeeAttendance,
  ExportAttendance,
} from "app/modules/Attendance/Sections";
import { LeaveStatusOverview } from "./Sections/LeaveStatusOverview";
import { StatisticsChart } from "./Sections/StatisticsChart";
import DepartmentOverview from "./Sections/DepartmentOverview";
import { StatsCards } from "./Sections/StatsCards";
import { FilterInput, DateRangeFilter } from "components/FormControl";
import { useSelector } from "react-redux";
import { GetDateRange, getWorkingDays } from "utils/renderValues";
import { exportRecordToExcel } from "utils/downloadUtils";
import { GetUserInfo } from "utils/getValuesFromTables";
import { HasAccess } from "utils/PermissionUtils";
import { renderDate, formatDuration } from "utils/renderValues";

const Attendance = ({ isTeamView = false }) => {
  const isUpdateBrnAttendancePermitted = HasAccess("UPDATE_BRN_EMP_ATTENDANCE");
  const isUpdateDptAttendancePermitted = HasAccess("UPDATE_DPT_EMP_ATTENDANCE");
  const isViewEmpAttendancePermitted = HasAccess("VIEW_EMPLOYEE_ATTENDANCE");
  const isViewBrnEmpAttendancePermitted = HasAccess("VIEW_BRN_EMPS_ATTENDANCE");
  const isViewDptEmpAttendancePermitted = HasAccess("VIEW_DPT_EMPS_ATTENDANCE");
  const isViewWeeklytatusPermitted = HasAccess("VIEW_WEEKLY_STATISTICS");
  const isUpdateEmpAttendancePermitted = HasAccess(
    "UPDATE_EMPLOYEE_ATTENDANCE"
  );
  const isViewDptAttendancePermitted = HasAccess(
    "VIEW_DEPARTMENT_ATTENDANCE_OVERVIEW"
  );
  const Departments = useSelector((state) => state.common.departments);
  const Branches = useSelector((state) => state.common.branches);
  const Designations = useSelector((state) => state.common.designations);
  const {
    branch_id: user_branch,
    department_name: user_department,
    id: user_id,
  } = useSelector((state) => state.emp.user_details);
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openUpdateEmployeeAttendance, setOpenUpdateEmployeeAttendance] =
    useState(false);
  const [weeklySummary, setWeeklySummary] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [activeTab, setActiveTab] = useState("Day");
  const [TotalDays, setTotalDays] = useState(1);
  const [filterData, setFilterData] = useState({});
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

  useEffect(() => {
    let isMounted = true;
    setFilterData(() => {
      if (isViewEmpAttendancePermitted) return {};
      else {
        if (isViewBrnEmpAttendancePermitted) {
          return { branch: user_branch };
        } else if (isViewDptEmpAttendancePermitted) {
          return { department: user_department };
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, [
    isViewBrnEmpAttendancePermitted,
    isViewDptEmpAttendancePermitted,
    isViewEmpAttendancePermitted,
  ]);
  const handleFilterChange = (filterName, filterValue) => {
    if (filterName === "department") setSelectedDepartment(filterValue);
    if (filterName === "branch") setSelectedBranch(filterValue);
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

  return (
    <>
      <div
        className={`flex flex-col gap-4 ${window.location.pathname.substring(
          1
        )}`}
      >
        <div className="flex gap-4">
          <LeaveStatusOverview />
          <StatisticsChart weeklySummary={weeklySummary} />
          <DepartmentOverview />
        </div>
        {(isViewEmpAttendancePermitted || isViewBrnEmpAttendancePermitted) && (
          <>
            <StatsCards
              isTeamView={isTeamView}
              isEmpView={isViewEmpAttendancePermitted}
              isBranchView={isViewBrnEmpAttendancePermitted}
            />
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
                    name: "department",
                    placeholder: "Department",
                    values: selectedDepartment,
                    width: "w-[175px]",
                  },
                  ...(isViewEmpAttendancePermitted
                    ? [
                        {
                          type: "select-two",
                          option: Branches,
                          name: "branch",
                          placeholder: "Branch",
                          values: selectedBranch,
                          width: "w-[175px]",
                        },
                      ]
                    : []),
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
              {(isUpdateEmpAttendancePermitted ||
                isUpdateBrnAttendancePermitted ||
                isUpdateDptAttendancePermitted) && (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenUpdateEmployeeAttendance(true);
                  }}
                >
                  Update Attendance
                </Button>
              )}
              <ExportAttendance activeTab={activeTab} filterData={filterData} />
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
