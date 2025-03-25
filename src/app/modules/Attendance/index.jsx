import React, { useEffect, useState } from "react";
import { Card, CardContent } from "components/ui/card";
import { Button } from "components/ui/button";
import moment from "moment";
import {
  getAttendanceSummary,
  getDepartmentPercentage,
  getWeeklySummary,
} from "app/hooks/attendance";
import { PageLoader, TableCustom } from "components";
import { EmployeesAttendanceColumns } from "app/modules/Attendance/Sections/AttendanceTableColumns";
import { UpdateEmployeeAttendance } from "app/modules/Attendance/Sections";
import { LeaveStatusOverview } from "./Sections/LeaveStatusOverview";
import { StatisticsChart } from "./Sections/StatisticsChart";
import DepartmentOverview from "./Sections/DepartmentOverview";
import { StatsCards } from "./Sections/StatsCards";
import { getLeaveStatusDaily } from "app/hooks/leaveTracker";
import { FilterInput, DateRangeFilter } from "components/FormControl";
import { useSelector } from "react-redux";
import { GetDateRange } from "utils/renderValues";

const Attendance = () => {
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [departmentPercentage, setDepartmentPercentage] = useState([]);
  const [openUpdateEmployeeAttendance, setOpenUpdateEmployeeAttendance] =
    useState(false);
  const [weeklySummary, setWeeklySummary] = useState([]);
  const departments = useSelector((state) => state.common.departments);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [activeTab, setActiveTab] = useState("day");
  const [filterData, setFilterData] = useState({});
  const [dateRange, setDateRange] = useState(
    `${moment().format("YYYY-MM-DD")},${moment().format("YYYY-MM-DD")}`
  );
  const [leaveStatus, setLeaveStatus] = useState({});
  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
  };

  const handleFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1);
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
    // if (filterName === "date_range") setSelectedDateRange(filterValue);
    // setActiveTab({ employee_id: userId, date_range: filterValue });
  };
  const getAttendanceList = async (isMounted) => {
    setIsLoading(true);
    try {
      const attendanceData = await getAttendanceSummary({
        options,
        filterData,
        dateRange,
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
  }, [options, filterData, dateRange]);

  useEffect(() => {
    const fetchData = async () => {
      const departmentPercentage = await getDepartmentPercentage();
      if (departmentPercentage) {
        console.log("departmentPercentage", departmentPercentage);
        setDepartmentPercentage(departmentPercentage);
      }
      const weeklySummary = await getWeeklySummary();
      if (weeklySummary) {
        setWeeklySummary(weeklySummary);
      }

      const leaveStatus = await getLeaveStatusDaily();
      if (leaveStatus) {
        setLeaveStatus(leaveStatus);
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      <div
        className={`flex flex-col gap-4 ${window.location.pathname.substring(
          1
        )}`}
      >
        <div className="flex gap-4">
          <LeaveStatusOverview leaveStatus={leaveStatus} />
          <StatisticsChart weeklySummary={weeklySummary} />
          <DepartmentOverview departmentPercentage={departmentPercentage} />
        </div>
        {/* <Header /> */}
        <StatsCards attendanceData={attendanceData.results || []} />
        {/* <Stats stats={statsData} /> */}
        <div className="flex flex-col justify-start gap-3 lg:flex-row md:flex-row xl:flex-row">
          <FilterInput
            filters={[
              {
                type: "search",
                placeholder: "Search by ID and Name",
                name: "emp_id",
              },
              {
                type: "select-one",
                option: departments,
                name: "department_name",
                placeholder: "Department",
                values: selectedDepartment,
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
          <Button
            onClick={(e) => {
              e.preventDefault();
              setOpenUpdateEmployeeAttendance(true);
            }}
          >
            Update Attendance
          </Button>
        </div>
        {isLoading ? (
          <PageLoader />
        ) : (
          <Card>
            <CardContent>
              <TableCustom
                data={attendanceData.results || []}
                columns={EmployeesAttendanceColumns}
                pagination={true}
                dataTotalSize={attendanceData.count || 0}
                tableOptions={tableOptions}
              />
            </CardContent>
          </Card>
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
    </div>
  );
};

export default Attendance;
