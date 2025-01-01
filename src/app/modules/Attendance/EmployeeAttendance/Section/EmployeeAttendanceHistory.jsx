import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import TableCustom from "components/CustomTable";
import Avatar from "components/ui/Avatar";

import moment from "moment";
import { PageLoader, Header } from "components";
import { MyAttendanceHistoryColumns } from "app/utils/Types/TableColumns";
import { FilterInput } from "components/form-control";
import { Button } from "components/ui/button";
import { useNavigate } from "react-router-dom";

const EmployeeAttendanceHistory = ({
  userId,
  attendanceData,
  activeTab,
  setActiveTab,
  selectedDateRange,
  setSelectedDateRange,
  isLoading,
}) => {
  const navigate = useNavigate()
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [filterData, setFilterData] = useState({
    employee_id: userId,
    date: moment().format("YYYY-MM-DD"),
  });

  const downloadAttendance = ()=>{
    navigate(`/attendance-reports/${userId}`) 
  }


  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
  };

  const handleFilterChange = (name, filterValue) => {
    let filterName = "date";
    console.log(filterValue, name, "FITER VALUE");
    if (name === "day") {
      filterName = "date";
      filterValue = moment().format("YYYY-MM-DD");
    } else if (name === "week") {
      // {"date_range":"2024-12-10,2024-12-15","employee_id":327}
      filterName = "date_range";
      filterValue =
        moment().startOf("week").format("YYYY-MM-DD") +
        "," +
        moment().endOf("week").format("YYYY-MM-DD");
    } else if (name === "date_range") {
      //  setSelectedDateRange(filterValue);
      filterName = "date_range";
      filterValue = filterValue;
    }
    setFilterData({
      [filterName]: filterValue,
      employee_id: userId,
    });
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-plum-900 flex justify-between">
          <div className="text-plum-900">Attendance History</div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 text-lg font-normal text-slate-900">
              {["day", "week", "month"].map((tab) => (
                <button
                  key={tab}
                  className={`p-2 rounded-sm hover:bg-plum-400 hover:text-plum-900 ${
                    activeTab === tab ? "bg-plum-400 text-plum-900" : ""
                  }`}
                  onClick={() => {
                    setActiveTab(tab);
                    handleFilterChange(tab);
                  }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
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
          <Button variant="outline" onClick={downloadAttendance}> Download </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default EmployeeAttendanceHistory;
