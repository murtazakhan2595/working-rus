import React, { useEffect, useState } from "react";
import { Card, CardContent } from "components/ui/card";
import { Button } from "components/ui/button";
import moment from "moment";
import {
  getAttendanceSummary,
  getWeeklySummary,
  getUserBiometricLogsList,
} from "app/hooks/attendance";
import { PageLoader, TableCustom } from "components";
import { UserBiometricLogsColumns } from "app/modules/Attendance/Sections/AttendanceTableColumns";
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
import { CardTitle ,CardHeader} from "components/ui/card";

const UserBiometricHistory = ({ isTeamView = false }) => {
  const isViewEmpAttendancePermitted = HasAccess("VIEW_EMPLOYEE_ATTENDANCE");
  const isViewBrnEmpAttendancePermitted = HasAccess("VIEW_BRN_EMPS_ATTENDANCE");
  const isViewDptEmpAttendancePermitted = HasAccess("VIEW_DPT_EMPS_ATTENDANCE");
  const [isLoading, setIsLoading] = useState(false);
  const {
    branch_id: user_branch,
    department_name: user_department,
    id: user_id,
  } = useSelector((state) => state.emp.user_details);
  const [filterData, setFilterData] = useState({});
  const [ordering, setOrdering] = useState("emp_name");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [List, setList] = useState({ page: 1, sizePerPage: 10 });
  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

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
      const attendanceData = await getUserBiometricLogsList({
        filterData,
        ordering,
        options,
      });
      if (isMounted) {
        if (attendanceData) {
          setList(attendanceData);
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
    getAttendanceList(isMounted);
    return () => {
      isMounted = false;
    };
  }, [filterData, ordering, options]);

  

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>User Biometric Attendance History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <PageLoader />
          ) : (
            <TableCustom
              data={List.results || []}
              columns={UserBiometricLogsColumns}
              pagination={true}
              dataTotalSize={List.count || 0}
              tableOptions={tableOptions}
            />
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default UserBiometricHistory;
