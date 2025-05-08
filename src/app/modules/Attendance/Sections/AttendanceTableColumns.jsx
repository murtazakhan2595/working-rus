import { EmployeeAttendenceActions } from "app/modules/Attendance/Sections";
import { MyAttendenceActions } from "app/modules/Attendance/MyAttendance/Section";
import { calculatePercentage } from "utils/renderValues";
import { EmployeeOverview } from "components";
import { Progress } from "src/@/components/ui/progress"; // Assuming Shadcn provides this
import { formatDuration } from "utils/renderValues";
import moment from "moment";
import { StatusLabelAttendance } from "components/StatusLabel";
import { renderDate, formatNumber } from "utils/renderValues";

/**
 * AttendanceColumns
 *
 * Returns an array of column definitions for the Employee table.
 *
 * @returns {array} An array of column definitions.
 */

const getCheckoutTime = (checkIn) => {
  if (!checkIn) return "--";
  const checkInTime = moment(checkIn);
  const now = moment();

  // If 14 hours have passed since check-in, return check-in + 14 hours
  const fourteenHoursLater = moment(checkInTime).add(14, "hours");

  if (now.isAfter(fourteenHoursLater)) {
    return (
      <div>
        {fourteenHoursLater.format("h:mm A")}
        <br />
        (Check-out missing)
      </div>
    );
  }

  // If 14 hours not yet passed, return "Pending"
  return "Working";
};

export const EmployeesAttendanceColumns = (
  TotalDays = 5,
  reload = () => {}
) => [
  {
    dataField: "emp_name",
    text: "Employees",
    formatter: (cell, row) => (
      <EmployeeOverview id={row.employee_id} showId showPosition />
    ),
    dataSort: true,
  },

  {
    dataField: "attendance_stats",
    text: "Present Days",
    formatter: (cell, row) => <span>{parseInt(cell?.Present)}</span>,
  },
  {
    dataField: "attendance_stats",
    text: "Absent Days",
    formatter: (cell) => (
      <span>{Math.max(0, parseInt(TotalDays) - parseInt(cell?.Present))}</span>
    ),
  },
  {
    dataField: "attendance_stats",
    text: "Late Days",
    formatter: (cell) => <span>{cell?.Late}</span>,
  },
  {
    dataField: "attendance_stats",
    text: "Attendance %",
    formatter: (cell, row) => {
      const present = parseInt(cell.Present) || 0;
      const percentage = calculatePercentage(present, TotalDays);
      return (
        <div className="flex justify-between gap-1">
          {`${percentage.toFixed(0)}%`}
          <Progress value={percentage} className="mt-1 h-2 bg-gray-400" />
        </div>
      );
    },
  },
  {
    dataField: "",
    text: "Actions",
    formatter: (cell, row) => <EmployeeAttendenceActions row={row} />,
  },
];

export const MyAttendanceColumn = (reload) => [
  {
    text: "Date",
    dataField: "date",
    formatter: (cell) => <>{`${renderDate(cell)}`} </>,
  },
  {
    text: "Check In",
    dataField: "checkin",
    formatter: (cell) => <span>{moment(cell).format("h:mm A")}</span>,
  },
  {
    text: "Check Out",
    dataField: "checkout",
    formatter: (cell, row) => {
      return cell ? (
        <span>{moment(cell).format("h:mm A")}</span>
      ) : (
        getCheckoutTime(row.checkin, cell)
      );
    },
  },
  {
    text: "Break",
    dataField: "break_duration",
    formatter: (cell) => <>{formatDuration(cell)}</>,
  },
  {
    text: "Overtime",
    dataField: "overtime_hours",
    formatter: (cell, row) => <>{row.checkout ? formatDuration(cell) : "--"}</>,
  },
  {
    text: "Productivity",
    dataField: "payable_hours",
    formatter: (cell, row) => <>{row.checkout ? formatDuration(cell) : "--"}</>,
  },
  {
    text: "Total Hours",
    dataField: "total_hours",
    formatter: (cell) => <>{formatDuration(cell)}</>,
  },
  {
    dataField: "status",
    text: "Status",
    formatter: (cell) => <StatusLabelAttendance status={cell} />,
  },
  // {
  //   dataField: "",
  //   text: "Actions",
  //   formatter: (cell, row) => (
  //     <MyAttendenceActions data={row} reload={reload} />
  //   ),
  // },
];

export const AttendanceReportColumns = [
  {
    text: "Date",
    dataField: "date",
    formatter: (cell) => <>{`${renderDate(cell)}`}</>,
  },
  {
    text: "Check In",
    dataField: "checkin",
    formatter: (cell) => <span>{moment(cell).format("h:mm A")}</span>,
  },
  {
    text: "Check Out",
    dataField: "checkout",
    formatter: (cell, row) => {
      return cell ? (
        <span>{moment(cell).format("h:mm A")}</span>
      ) : (
        getCheckoutTime(row.checkin, cell)
      );
    },
  },
  {
    text: "Break",
    dataField: "break_duration",
    formatter: (cell) => <>{formatDuration(cell)}</>,
  },
  {
    text: "Overtime",
    dataField: "overtime_hours",
    formatter: (cell, row) => <>{row.checkout ? formatDuration(cell) : "--"}</>,
  },
  {
    text: "Productivity",
    dataField: "payable_hours",
    formatter: (cell, row) => <>{row.checkout ? formatDuration(cell) : "--"}</>,
  },
  {
    text: "Total Hours",
    dataField: "total_hours",
    formatter: (cell) => <>{formatDuration(cell)}</>,
  },
  { text: "Status", dataField: "status" },
];
