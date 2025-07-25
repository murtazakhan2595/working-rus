import React, { useEffect, useState } from "react";
import { Card, CardContent, CardTitle, CardDescription, CardHeader } from "components/ui/card";
import { Button } from "components/ui/button";
import moment from "moment";
import {
  getAttendanceSummary,
  getWeeklySummary,
  getAttendance,
} from "app/hooks/attendance";
import { PageLoader, TableCustom } from "components";
import { EmployeesAttendanceColumns } from "app/modules/Attendance/Sections/AttendanceTableColumns";
import { UserBiometricHistory } from "app/modules/Attendance";
import {
  UpdateEmployeeAttendance,
  ExportAttendance,
  ImportAttendance,
} from "app/modules/Attendance/Sections";
import { LeaveStatusOverview } from "./Sections/LeaveStatusOverview";
import { StatisticsChart } from "./Sections/StatisticsChart";
import DepartmentOverview from "./Sections/DepartmentOverview";
import { StatsCards } from "./Sections/StatsCards";
import { FilterInput, DateRangeFilter } from "components/FormControl";
import { useSelector } from "react-redux";
import { GetDateRange, getWorkingDays } from "utils/renderValues";
import { HasAccess } from "utils/PermissionUtils";

const Attendance = ({ isTeamView = false }) => {
  const isUpdateBrnAttendancePermitted = HasAccess("UPDATE_BRN_EMP_ATTENDANCE");
  const isUpdateDptAttendancePermitted = HasAccess("UPDATE_DPT_EMP_ATTENDANCE");
  const isAdminView = HasAccess("VIEW_EMPLOYEE_ATTENDANCE");
  const isBranchView = HasAccess("VIEW_BRN_EMPS_ATTENDANCE");
  const isDepartmentView = HasAccess("VIEW_DPT_EMPS_ATTENDANCE");
  const isUpdateEmpAttendancePermitted = HasAccess(
    "UPDATE_EMPLOYEE_ATTENDANCE"
  );
  const Branches = useSelector((state) => state.common.branches);
  const Departments = useSelector((state) => state.common.departments);
  const {
    branch_id: user_branch,
    department_name: user_department,
    id: user_id,
  } = useSelector((state) => state.emp.user_details);
  const previousFilters = React.useMemo(() => {
    const stored = window.localStorage.getItem("attendance-filters");
    return stored ? JSON.parse(stored) : null;
  }, []);

  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openUpdateAttendance, setOpenUpdateAttendance] = useState(false);
  const [weeklySummary, setWeeklySummary] = useState([]);
  const [permittedViewFilterData, setPermittedViewFilterData] = useState(null);
  const [TotalDays, setTotalDays] = useState(1);
  const [filterData, setFilterData] = useState(previousFilters ? previousFilters : { start_date: moment().format("YYYY-MM-DD"), end_date: moment().format("YYYY-MM-DD"), });
  const [ordering, setOrdering] = useState("emp_name");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted)
      setPermittedViewFilterData(() => {
        if (isTeamView) return { reporting_employees: user_id };
        else if (isAdminView) return {};
        else if (isBranchView) return { branch: user_branch };
        else if (isDepartmentView) return { department: user_department };
      });
    return () => {
      isMounted = false;
    };
  }, [isTeamView, isAdminView, isBranchView, isDepartmentView]);

  const handleFilterChange = (filterName, filterValue) => {
    onPageChange('page', 1);
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterName === 'range_date') {
        const date_range =
          GetDateRange(filterValue)?.split(",") || [];
        const end_date =
          date_range[1] && date_range[1] !== "null"
            ? date_range[1]
            : "";
        const start_date =
          date_range[0] && date_range[0] !== "null"
            ? date_range[0]
            : "";
        updatedFilters['start_date'] = start_date;
        updatedFilters['end_date'] = end_date;
        setTotalDays(getWorkingDays(start_date, end_date));
      } else if (filterValue === "") {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }
      window.localStorage.setItem("attendance-filters", JSON.stringify(updatedFilters));
      return updatedFilters;
    });
  };
  const getAttendanceList = async (isMounted) => {
    setIsLoading(true);
    const filter = {
      ...filterData,
      ...permittedViewFilterData,
    };

    try {
      const attendanceData = await getAttendanceSummary({
        filterData: filter,
        ordering,
        options,
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
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onSortChange: (sortName) => {
      setOrdering(sortName);
    },
  };
  useEffect(() => {
    let isMounted = true;
    if (permittedViewFilterData) getAttendanceList(isMounted);
    return () => {
      isMounted = false;
    };
  }, [filterData, permittedViewFilterData, ordering, options]);

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
        className={`flex flex-col gap-4 mb-10 ${window.location.pathname.substring(
          1
        )}`}
      >
        <div className="flex gap-4">
          <LeaveStatusOverview />
          <StatisticsChart weeklySummary={weeklySummary} />
          <DepartmentOverview />
        </div>
        {(isAdminView || isBranchView) && (
          <>
            <StatsCards permittedViewFilterData={permittedViewFilterData} />

            <Card>
              <CardHeader className='flex flex-row flex-wrap gap-4 justify-between'>
                <div>
                  <CardTitle>Employee Attendance</CardTitle>
                  <CardDescription>Here you can view the attendance record of the employee.</CardDescription>
                </div>
                <div className="flex-row flex flex-wrap gap-2">
                  {(isUpdateEmpAttendancePermitted ||
                    isUpdateBrnAttendancePermitted ||
                    isUpdateDptAttendancePermitted) && (
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          setOpenUpdateAttendance(true);
                        }}
                      >
                        Update Attendance
                      </Button>
                    )}
                  <ImportAttendance filterData={filterData} />
                  <ExportAttendance filterData={filterData} />
                </div>
              </CardHeader>
              <CardContent>
                <FilterInput
                  filters={[
                    {
                      type: "search",
                      placeholder: "Search by Name",
                      name: "emp_name",
                    },
                    {
                      type: "select",
                      options: Departments,
                      name: "department",
                      placeholder: "Department",
                    },
                    ...(isAdminView
                      ? [
                        {
                          type: "select",
                          options: Branches,
                          name: "branch",
                          placeholder: "Branch",
                        },
                      ]
                      : []),
                    {
                      type: "date-range-filter",
                      name: "range_date",
                    },
                  ]}
                  filterValues={filterData}
                  onChange={handleFilterChange}
                  className='justify-end mb-4'
                />
                {isLoading ? (
                  <PageLoader />
                ) : (
                  <TableCustom
                    data={attendanceData.results || []}
                    columns={EmployeesAttendanceColumns(TotalDays)}
                    pagination={true}
                    dataTotalSize={attendanceData.count || 0}
                    tableOptions={tableOptions}
                  />
                )}
              </CardContent>
            </Card>
            <UserBiometricHistory />
          </>
        )}
      </div>
      {openUpdateAttendance && (
        <UpdateEmployeeAttendance
          isOpen={openUpdateAttendance}
          setIsOpen={() => {
            setOpenUpdateAttendance(false);
            getAttendanceList(true);
          }}
        />
      )}
    </>
  );
};

export default Attendance;
