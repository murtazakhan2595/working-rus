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
import { FilterInput, DateRangeInput } from "components/form-control";
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
import { GetDateRange } from "utils/renderValues";
import { useSelector } from "react-redux";
import { getStats } from "app/hooks/attendance";
import { use } from "react";

const MyAttendanceHistory = () => {
  const userProfile = useSelector((state) => state.user.userProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [filterData, setFilterData] = useState({
    employee_id: userProfile.id,
  });
  const [activeTab, setActiveTab] = useState("week");

  const tabsData = [
    {
      value: "day",
      label: "Day",
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

  useEffect(() => {
    if (activeTab === "day") {
      setFilterData({
        employee_id: userProfile.id,
        date: moment().format("YYYY-MM-DD"),
      });
    } else if (activeTab === "week") {
      setFilterData({
        employee_id: userProfile.id,
        date_range: GetDateRange("week"),
      });
    } else if (activeTab === "month") {
      setFilterData({
        employee_id: userProfile.id,
        date_range: GetDateRange("month"),
      });
    }
  }, [activeTab]);

  const getAttendanceList = async (isMounted) => {
    setIsLoading(true);
    try {
      const attendanceData = await getAttendance({
        filterData: filterData,
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
  }, [filterData]);

  const handleFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1);
    if (filterName === "date_range") setSelectedDateRange(filterValue);

    setFilterData({ employee_id: userProfile.id, date_range: filterValue });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-plum-900">Attendance History</CardTitle>
      </CardHeader>
      <CardContent>
        <>
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
              <FilterInput
                filters={[
                  {
                    type: "date-range",
                    name: "date_range",
                    value: selectedDateRange,
                    placeholder:'Date Range'
                  },
                ]}
                onChange={handleFilterChange}
              />
            </div>
            <TabsContent value="day">
              {isLoading ? (
                <PageLoader />
              ) : (
                <TableCustom
                  data={attendanceData.results}
                  columns={MyAttendanceHistoryColumns}
                  pagination={true}
                  dataTotalSize={attendanceData.count || 0}
                  tableOptions={tableOptions}
                />
              )}
            </TabsContent>
            <TabsContent value="week">
              {isLoading ? (
                <PageLoader />
              ) : (
                <TableCustom
                  data={attendanceData.results}
                  columns={MyAttendanceHistoryColumns}
                  pagination={true}
                  dataTotalSize={attendanceData.count || 0}
                  tableOptions={tableOptions}
                />
              )}
            </TabsContent>
            <TabsContent value="month">
              {isLoading ? (
                <PageLoader />
              ) : (
                <TableCustom
                  data={attendanceData.results}
                  columns={MyAttendanceHistoryColumns}
                  pagination={true}
                  dataTotalSize={attendanceData.count || 0}
                  tableOptions={tableOptions}
                />
              )}
            </TabsContent>
          </Tabs>
        </>
      </CardContent>
    </Card>
  );
};

export default MyAttendanceHistory;
