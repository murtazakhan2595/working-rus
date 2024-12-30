import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from 'components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "src/@/components/ui/table";
  import moment from 'moment';
  import { PageLoader } from 'components';
import { getAttendance } from 'app/hooks/attendance';

const EmployeesAttendence = () => {
    const [activeTab, setActiveTab] = useState("day");
    const [disable, setDisable] = useState(false);
    const [attendanceData, setAttendanceData] = useState([]);
    const [filterData, setFilterData] = useState({
        date: moment().format("YYYY-MM-DD"),
      });
    const [attendanceHistoryLoading, setAttendanceHistoryLoading] =
      useState(false);

      const getAttendanceList = async () => {
        setAttendanceHistoryLoading(true);
        const attendanceData = await getAttendance({
          filterData: filterData,
        });
        if (attendanceData) {
          setAttendanceData(attendanceData.results);
        }
        setAttendanceHistoryLoading(false);
      };

      const handleFilterChange = (name, filterValue) => {
        let filterName = "date";
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
        }
        setFilterData({
          [filterName]: filterValue,
        //   employee_id: userProfile.id,
        });
      };
    

      useEffect(() => {
        getAttendanceList();
      }, [filterData]);

  return (
    <Card>
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <div className="text-plum-900">Attendance History</div>
        <div className="flex items-center gap-2 text-lg font-normal text-slate-900">
          <button
            className={`p-2 rounded-sm hover:bg-plum-400 hover:text-plum-900 ${
              activeTab === "day" ? "bg-plum-400 text-plum-900" : ""
            }`}
            onClick={() => {
              setActiveTab("day");
              handleFilterChange("day");
            }}
          >
            Day
          </button>
          <button
            className={`p-2 rounded-sm hover:bg-plum-400 hover:text-plum-900 ${
              activeTab === "week" ? "bg-plum-400 text-plum-900" : ""
            }`}
            onClick={() => {
              setActiveTab("week");
              handleFilterChange("week");
            }}
          >
            Week
          </button>
          <button
            className={`p-2 rounded-sm hover:bg-plum-400 hover:text-plum-900 ${
              activeTab === "month" ? "bg-plum-400 text-plum-900" : ""
            }`}
            onClick={() => {
              setActiveTab("month");
              handleFilterChange("month");
            }}
          >
            Month
          </button>
        </div>
      </CardTitle>
    </CardHeader>
    {attendanceHistoryLoading ? (
      <PageLoader />
    ) : (
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S. No</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Punch In</TableHead>
              <TableHead>Punch Out</TableHead>
              <TableHead>Break</TableHead>
              <TableHead>Overtime</TableHead>
              <TableHead>Productivity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendanceData.map((row, index) => (
              <TableRow
                key={index}
                className={index % 2 === 1 ? "bg-purple-50" : ""}
              >
                <TableCell>
                  {(index + 1).toString().padStart(2, "0")}
                </TableCell>
                <TableCell>
                  {row.date
                    ? new Date(row.date).toLocaleDateString("en-GB") // or 'en-US' based on your preference
                    : "No Date"}
                </TableCell>
                <TableCell>
                  {moment(attendanceData?.checkin).format("h:mm A")}
                </TableCell>
                <TableCell>
                  {row.checkout
                    ? moment(row?.checkout).format(
                        "h:mm A"
                      )
                    : "Not Checked Out"}
                </TableCell>
                <TableCell>{row.break_duration || 0.0} hrs</TableCell>
                <TableCell>{row.overtime_hours || 0.0} hrs</TableCell>
                <TableCell>{row.payable_hours || 0.0} hrs</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    )}
  </Card>
  )
}

export default EmployeesAttendence
