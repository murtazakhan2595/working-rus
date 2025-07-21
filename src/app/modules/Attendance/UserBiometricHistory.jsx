import React, { useEffect, useState } from "react";
import { Card, CardContent } from "components/ui/card";
import { Button } from "components/ui/button";
import moment from "moment";
import {
  saveUserBiometricAttendanceLog,
  getWeeklySummary,
  getUserBiometricLogsList,
} from "app/hooks/attendance";
import { PageLoader, TableCustom } from "components";
import { UserBiometricLogsColumns } from "app/modules/Attendance/Sections/AttendanceTableColumns";
import {
  UpdateEmployeeAttendance,
  ExportAttendance,
} from "app/modules/Attendance/Sections";
import _ from "lodash";
import { StatisticsChart } from "./Sections/StatisticsChart";
import DepartmentOverview from "./Sections/DepartmentOverview";
import { StatsCards } from "./Sections/StatsCards";
import { FilterInput, DateRangeFilter } from "components/FormControl";
import { useSelector } from "react-redux";
import { GetDateRange, getWorkingDays } from "utils/renderValues";
import { GetEmployeeFilteredList, GetCommonFilteredList } from "utils/Lists";
import { GetUserInfo } from "utils/getValuesFromTables";
import { HasAccess } from "utils/PermissionUtils";
import { renderDate, formatDuration } from "utils/renderValues";
import { CardTitle, CardHeader } from "components/ui/card";

const UserBiometricHistory = ({ isTeamView = false }) => {
  const adminView = HasAccess("VIEW_EMPLOYEE_ATTENDANCE");
  const isBranchView = HasAccess("VIEW_BRN_EMPS_ATTENDANCE");
  const isDepartmentView = HasAccess("VIEW_DPT_EMPS_ATTENDANCE");
  const Employees = GetEmployeeFilteredList(
    isTeamView,
    adminView,
    isBranchView,
    isDepartmentView
  );
  const [isLoading, setIsLoading] = useState(false);
  const [filterData, setFilterData] = useState({
    range_date: `${moment().format("YYYY-MM-DD")},${moment().format(
      "YYYY-MM-DD"
    )}`,
  });
  const [ordering, setOrdering] = useState("-timestamp");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 25 });
  const [List, setList] = useState({});
  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const handleFilterChange = (filterName, filterValue) => {
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterValue === "" || filterValue === null) {
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

  useEffect(() => {
    let isMounted = true;
    const saveRecords = async (isMounted) => {
      try {
        const attendanceData = await getUserBiometricLogsList({
          filterData: {
            range_date: `${moment().format("YYYY-MM-DD")},${moment().format(
              "YYYY-MM-DD"
            )}`,
          },
          ordering: "id",
        });
        if (isMounted) {
          if (attendanceData) {
            UpdateMissingAttanceRecords(attendanceData.results);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    saveRecords(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>User Biometric Attendance History</CardTitle>
        </CardHeader>
        <CardContent>
          <FilterInput
            filters={[
              {
                type: "select",
                placeholder: "Employee",
                name: "emp_id",
                options: Employees,
              },
              {
                type: "date-range",
                placeholder: "Date",
                name: "range_date",
              },
              {
                type: "select",
                placeholder: "Status",
                name: "status",
                options: [{ label: 'Break', value: 'break' }, { label: 'Check-In', value: 'check-in' }, { label: 'Check-Out', value: 'check-out' }],
              },
            ]}
            onChange={handleFilterChange}
            className="justify-end mb-4"
          />
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

const UpdateMissingAttanceRecords = async (dataList) => {
  const user_attendance_updated = [];
  if (!dataList || !Array.isArray(dataList) || dataList.length === 0)
    return null;
  const usersList = _.uniq(dataList.map((data) => data.user_no));
  for (const user of usersList) {
    if (!user_attendance_updated.includes(user)) {
      const userRecord = dataList.filter((obj) => obj.user_no === user);

      for (const data of userRecord) {
        const date = moment(data.timestamp).format("YYYY-MM-DD");

        if (data.emp_id) {
          try {
            await saveUserBiometricAttendanceLog(
              data.emp_id,
              data,
              date
            );
          } catch (error) {
            console.error("Error saving attendance for:", data, error);
          }
        }
      }

      user_attendance_updated.push(user); // mark as processed only after all data is handled
    }
  }
};

export default UserBiometricHistory;
