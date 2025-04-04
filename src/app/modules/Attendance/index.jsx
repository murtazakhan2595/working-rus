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
import { GetDateRange } from "utils/renderValues";
import { exportRecordToExcel } from "utils/downloadUtils";
import { getLabelByValue } from "utils/getValuesFromTables";

const Attendance = () => {
  const Departments = useSelector((state) => state.common.departments);
  const Designations = useSelector((state) => state.common.designations);
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openUpdateEmployeeAttendance, setOpenUpdateEmployeeAttendance] =
    useState(false);
  const [weeklySummary, setWeeklySummary] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [activeTab, setActiveTab] = useState("Day");
  const [filterData, setFilterData] = useState({});
  const [dateRange, setDateRange] = useState(
    `${moment().format("YYYY-MM-DD")},${moment().format("YYYY-MM-DD")}`
  );
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
          Designations,'-'
        ),
        Status: row.daily_status,
      }))
    );
    exportRecordToExcel(dataToExport, "Attendance", `Attendance_${dateRange}`);
  };

  return (
    <div>
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
        <StatsCards />
        <div className="flex flex-col justify-end gap-3 lg:flex-row md:flex-row xl:flex-row">
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
          <Button
            onClick={(e) => {
              e.preventDefault();
              setOpenUpdateEmployeeAttendance(true);
            }}
          >
            Update Attendance
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              exportAttendanceToExcel();
            }}
            variant="continue"
          >
            Export
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
