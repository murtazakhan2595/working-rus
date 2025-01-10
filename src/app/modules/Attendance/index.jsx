import React, { useEffect, useState } from "react";
import { Card, CardContent } from "components/ui/card";
import moment from "moment";
import {
  getAttendance,
  getAttendanceSummary,
  getDepartmentPercentage,
  getWeeklySummary,
} from "app/hooks/attendance";
import { PageLoader } from "components";
import { EmployeesAttendanceColumns } from "app/utils/Types/TableColumns";
import { LeaveStatusOverview } from "./Sections/LeaveStatusOverview";
import { StatisticsChart } from "./Sections/StatisticsChart";
import DepartmentOverview from "./Sections/DepartmentOverview";
import { StatsCards } from "./Sections/StatsCards";
import TableCustom from "components/CustomTable";
import { getLeaveStatusDaily } from "app/hooks/leaveTracker";

const Attendance = () => {
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [departmentPercentage, setDepartmentPercentage] = useState([]);
  const [weeklySummary, setWeeklySummary] = useState([]);
  const [filterData, setFilterDataState] = useState({
    date: moment().format("YYYY-MM-DD"),
  });
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
    // onPageChange("page", 1);
    // if (filterName === "date_range") setSelectedDateRange(filterValue);
    // setActiveTab({ employee_id: userId, date_range: filterValue });
  };
  const getAttendanceList = async (isMounted) => {
    setIsLoading(true);
    try {
      const attendanceData = await getAttendance({ options, filterData });
      if (isMounted) {
        if (attendanceData) {
          // setAttendanceData(attendanceData);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAttendanceData = async ()=>{
    setIsLoading(true);
    try{
      const empAttedance = await getAttendanceSummary({ options, filterData })
      if(empAttedance){
        setAttendanceData(empAttedance)
      }
    } catch(error){
      console.log(error)
    } finally{
      setIsLoading(false)
    }
  }

  useEffect(()=>{
    getAttendanceData()
  },[options, filterData, ])

  useEffect(() => {
    let isMounted = true;
    getAttendanceList(isMounted);
    return () => {
      isMounted = false;
    };
  }, [filterData]);

  useEffect(() => {
    const fetchData = async () => {
      const departmentPercentage = await getDepartmentPercentage()
      if(departmentPercentage){
        console.log("departmentPercentage", departmentPercentage);
        setDepartmentPercentage(departmentPercentage)
      }
      const weeklySummary = await getWeeklySummary()
      if(weeklySummary){
        console.log("weeklySummary", weeklySummary);
        setWeeklySummary(weeklySummary)
      }

      const leaveStatus = await getLeaveStatusDaily()
      if(leaveStatus){
        console.log("leaveStatus", leaveStatus);
        setLeaveStatus(leaveStatus)
      }
    }
    fetchData()
  }, []);
  return (
    <div>
      <div
        className={`flex flex-col gap-4 ${window.location.pathname.substring(
          1
        )}`}
      >
        <div className="flex gap-4">
          <LeaveStatusOverview leaveStatus={leaveStatus}/>
          <StatisticsChart weeklySummary={weeklySummary} />
          <DepartmentOverview departmentPercentage={departmentPercentage} />
        </div>
        {/* <Header /> */}
        <StatsCards attendanceData={attendanceData.results || []} />
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
