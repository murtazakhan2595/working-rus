import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import TableCustom from "components/CustomTable";
import Avatar from "components/ui/Avatar";
import {
  EmployeeID,
  EmployeeName,
  DepartmentName,
  DesignationName,
} from "utils/getValuesFromTables";
import moment from "moment";
import {
  TodayStatistics,
  EmployeeInfo,
  HourlyStatistics,
} from "app/modules/Attendance/MyAttendance/Section";
import { FilterInput, SelectComponent } from "components/form-control";
import {
  getShiftAssignment,
  getAttendance,
  saveAttendance,
  saveBreak,
  getBreak,
} from "app/hooks/attendance";
import { PageLoader, Header } from "components";
import { toast } from "react-toastify";
import { MyAttendanceHistoryColumns } from "app/utils/Types/TableColumns";
import { getBreakStatus } from "app/hooks/attendance";
import { endBreak } from "app/hooks/attendance";
import { useSelector } from "react-redux";
import { getStats } from "app/hooks/attendance";
import { use } from "react";

const MyAttendanceHistory = () => {
  const userProfile = useSelector((state) => state.user.userProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [filterData, setFilterData] = useState({
    // date_range: "2024-12-10,2024-12-20",
    employee_id: userProfile.id,
  });
  const [activeTab, setActiveTab] = useState("week");

  const tabsData = [
    {
      value: "day",
      label: "Day",
      filter: { data: moment().format("YYYY-MM-DD") },
    },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
  ];
  const onPageChange = (name, value) => {
    console.log(name, value, "NAME");
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
  };
  const tabFilter = [
    { day: { data: moment().format("YYYY-MM-DD") } },
    { week: { data: moment().format("YYYY-MM-DD") } },
    { month: { data: moment().format("YYYY-MM-DD") } },
  ];
  const getAttendanceList = async (isMounted) => {
    setIsLoading(true);

    try {
      const attendanceData = await getAttendance({
        filterData: { ...filterData },
      });

      if (attendanceData && isMounted) {
        setAttendanceData(attendanceData);
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
  }, [activeTab]);

  const handleFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1);
    // if (filterName === "department_name") setSelectedDepartment(filterValue);
    // if (filterName === "department_position") setSelectedDesignation(filterValue);
    // if (filterName === "user_role") setSelectedRole(filterValue);

    // setFilterData((prevFilters) => {
    //   const updatedFilters = { ...prevFilters };
    //   if (filterValue === "") {
    //     delete updatedFilters[filterName];
    //   } else {
    //     updatedFilters[filterName] = filterValue;
    //   }
    //   return updatedFilters;
    // });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-plum-900">Attendance History</CardTitle>
      </CardHeader>
      <CardContent>
        <>
          <div className="flex flex-col justify-between lg:flex-row md:flex-row xl:flex-row">
            <FilterInput
              filters={[
                {
                  type: "search",
                  placeholder: "Search by ID and Name",
                  name: "id_and_first_name",
                },
                {
                  type: "select-one",
                  option: [],
                  name: "department_name",
                  placeholder: "Department",
                  values: "",
                },
                {
                  type: "select-two",
                  option: [],
                  name: "department_position",
                  placeholder: "Designation",
                  values: "",
                },
                {
                  type: "select-three",
                  option: [],
                  name: "user_role",
                  placeholder: "Role",
                  values: "",
                },
              ]}
              onChange={handleFilterChange}
            />
          </div>
          {isLoading ? (
            <PageLoader />
          ) : (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              defaultValue="week"
            >
              <div className="flex justify-start">
                <TabsList className="flex justify-center mb-4">
                  {tabsData?.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="data-[state=active]:bg-primary-200 w-28 data-[state=active]:text-primary-1100 rounded-sm data-[state-active]:font-medium"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              <TabsContent value="day">
                <TableCustom
                  data={attendanceData.results}
                  columns={MyAttendanceHistoryColumns}
                  pagination={true}
                  dataTotalSize={attendanceData.count || 0}
                  tableOptions={tableOptions}
                />
              </TabsContent>
              <TabsContent value="week">
                <TableCustom
                  data={attendanceData.results}
                  columns={MyAttendanceHistoryColumns}
                  pagination={true}
                  dataTotalSize={attendanceData.count || 0}
                  tableOptions={tableOptions}
                />
              </TabsContent>
              <TabsContent value="month">
                <TableCustom
                  data={attendanceData.results}
                  columns={MyAttendanceHistoryColumns}
                  pagination={true}
                  dataTotalSize={attendanceData.count || 0}
                  tableOptions={tableOptions}
                />
              </TabsContent>
            </Tabs>
          )}
        </>
      </CardContent>
    </Card>
  );
};

export default MyAttendanceHistory;
