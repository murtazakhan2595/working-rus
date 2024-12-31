import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../src/@/components/ui/table";
import { Progress } from "../../../src/@/components/ui/progress";
import { CalendarIcon, FilterIcon, PlayCircle } from "lucide-react";
import moment from "moment";
import {
  getShiftAssignment,
  getAttendance,
  saveAttendance,
  saveBreak,
  getBreak,
} from "app/hooks/attendance";
import { useSelector } from "react-redux";
import { PageLoader, Header } from "components";
import { toast } from "react-toastify";
import { EmployeesAttendanceColumns } from "app/utils/Types/TableColumns";
import { getBreakStatus } from "app/hooks/attendance";
import { endBreak } from "app/hooks/attendance";
import { getLocalTime } from "app/hooks/attendance";
import { getStats } from "app/hooks/attendance";
import { useNavigate } from "react-router-dom";
import { LeaveStatusOverview } from "./Sections/LeaveStatusOverview";
import { StatisticsChart } from "./Sections/StatisticsChart";
import DepartmentOverview from "./Sections/DepartmentOverview";
import { StatsCards } from "./Sections/StatsCards";
import EmployeesAttendence from "./Sections/EmployeesAttendence";
import Stats from "../../../components/ui/Stats";
import TableCustom from "components/CustomTable";

const Attendance = () => {
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterData, setFilterDataState] = useState({
    date: moment().format("YYYY-MM-DD"),
  });
  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
  };

  const handleFilterChange = (filterName, filterValue) => {
    // onPageChange("page", 1);
    // if (filterName === "date_range") setSelectedDateRange(filterValue);
    // setActiveTab({ employee_id: userId, date_range: filterValue });
  };
  const getAttendanceList = async (isMounted) => {
    setIsLoading(true);
    try {
      const attendanceData = await getAttendance({
        filterData: filterData,
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
  useEffect(() => {
    let isMounted = true;
    getAttendanceList(isMounted);
    return () => {
      isMounted = false;
    };
  }, [filterData]);
  return (
    <div>
      <div
        className={`flex flex-col gap-4 ${window.location.pathname.substring(
          1
        )}`}
      >
        <div className="p-6 flex  gap-4">
          <LeaveStatusOverview />
          <StatisticsChart />
          <DepartmentOverview />
        </div>
        {/* <Header /> */}
        <StatsCards />
        {/* <Stats stats={statsData} /> */}
        <div className="flex flex-col justify-between lg:flex-row md:flex-row xl:flex-row">
          {/* <FilterInput
            filters={[
              {
                type: "search",
                placeholder: "Search by ID and Name",
                name: "id_and_first_name",
              },
              {
                type: "select-one",
                option: departments,
                name: "department_name",
                placeholder: "Department",
                values: selectedDepartment,
              },
              {
                type: "select-two",
                option: designations,
                name: "department_position",
                placeholder: "Designation",
                values: selectedDesignation,
              },
              {
                type: "select-three",
                option: UserRoles,
                name: "user_role",
                placeholder: "Role",
                values: selectedRole,
              },
            ]}
            onChange={handleFilterChange}
          /> */}
        </div>
        {isLoading ? (
          <PageLoader />
        ) : (
          <Card>
            <CardContent>
              <TableCustom
                data={attendanceData.results}
                columns={EmployeesAttendanceColumns}
                pagination={true}
                dataTotalSize={attendanceData.count || 0}
                tableOptions={tableOptions}
              />
            </CardContent>
          </Card>
        )}
      </div>
      {/* 

      <div>
        <StatsCards />
      </div>

      <div>
        <EmployeesAttendence />
      </div> */}
          </div>
  );
};

export default Attendance;
