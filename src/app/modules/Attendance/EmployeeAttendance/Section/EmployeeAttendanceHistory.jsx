import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { GetDateRange } from "utils/renderValues";
import moment from "moment";
import { PageLoader, Header, TableCustom } from "components";
import {DateRangeFilter } from "components/FormControl";
import { MyAttendanceColumn } from "app/modules/Attendance/Sections/AttendanceTableColumns";
import { Button } from "components/ui/button";
import { useNavigate } from "react-router-dom";

const EmployeeAttendanceHistory = ({
  userId,
  attendanceData,
  activeTab,
  setActiveTab,
  isLoading,
  setFilterData,
}) => {
  const navigate = useNavigate();
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });

  const downloadAttendance = () => {
    navigate(`/attendance-reports/${userId}`);
  };

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
  };

  return (
    <div>
      <div className="flex justify-between mb-5">
        <h3 className=" text-2xl font-semibold leading-none tracking-tight flex items-center space-y-1.5 px-6 text-plum-900">
          Attendance History
        </h3>
        <div className="flex gap-2">
          <DateRangeFilter
            activeDateRange={activeTab}
            setDateRange={(dateRange) => {
              setFilterData(() => {
                const updatedFilters = {
                  employee_id: userId,
                  ...(dateRange.toUpperCase() === "DAY"
                    ? { date: moment().format("YYYY-MM-DD") }
                    : { date_range: GetDateRange(dateRange) }),
                };
                setActiveTab(dateRange);
                return updatedFilters;
              });
            }}
          />

          <Button variant="outline" onClick={downloadAttendance}>
            Download
          </Button>
        </div>
      </div>
      <Card>
        <CardContent>
          {isLoading ? (
            <PageLoader />
          ) : (
            <TableCustom
              data={attendanceData.results}
              columns={MyAttendanceColumn}
              pagination={true}
              dataTotalSize={attendanceData.count || 0}
              tableOptions={tableOptions}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeAttendanceHistory;
