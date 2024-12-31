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

const EmployeeAttendanceHistory = ({
  userId,
  attendanceData,
  activeTab,
  setActiveTab,
  selectedDateRange,
  setSelectedDateRange,
  isLoading,
}) => {
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const tabsData = [
    {
      value: "day",
      label: "Day",
    },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
  ];
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
    if (filterName === "date_range") setSelectedDateRange(filterValue);
    setActiveTab({ employee_id: userId, date_range: filterValue });
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
                    placeholder: "Date Range",
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
            {activeTab &&
              activeTab.date_range &&
              (isLoading ? (
                <PageLoader />
              ) : (
                <TableCustom
                  data={attendanceData.results}
                  columns={MyAttendanceHistoryColumns}
                  pagination={true}
                  dataTotalSize={attendanceData.count || 0}
                  tableOptions={tableOptions}
                />
              ))}
          </Tabs>
        </>
      </CardContent>
    </Card>
  );
};

export default EmployeeAttendanceHistory;
