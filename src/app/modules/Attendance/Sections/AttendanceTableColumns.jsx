import {
  EmployeeAttendenceActions,
} from "app/modules/Attendance/Sections";
import { calculatePercentage } from "utils/renderValues";
import { EmployeeNameInfo } from "components";

/**
 * AttendanceColumns
 *
 * Returns an array of column definitions for the Employee table.
 *
 * @returns {array} An array of column definitions.
 */
export const EmployeesAttendanceColumns = [
  {
    dataField: "employee_id",
    text: "Employees",
    formatter: (cell, row) => (
      <EmployeeNameInfo id={cell} showId showPosition />
    ),
  },

  {
    dataField: "attendance_stats",
    text: "Present Days",
    formatter: (cell) => <span>{cell?.Present}</span>,
  },
  {
    dataField: "attendance_stats",
    text: "Absent Days",
    formatter: (cell) => <span>{cell?.Absent}</span>,
  },
  {
    dataField: "attendance_stats",
    text: "Late Days",
    formatter: (cell) => <span>{cell?.Late}</span>,
  },
  {
    dataField: "attendance_stats",
    text: "Attendance %",
    formatter: (cell, row) => calculatePercentage(cell),
  },
  {
    dataField: "",
    text: "Actions",
    formatter: (cell, row) => <EmployeeAttendenceActions row={row} />,
  },
];
