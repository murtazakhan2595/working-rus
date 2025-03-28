import { EmployeeAttendenceActions } from "app/modules/Attendance/Sections";
import { calculatePercentage } from "utils/renderValues";
import { EmployeeOverview } from "components";
import { Progress } from "src/@/components/ui/progress"; // Assuming Shadcn provides this

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
      <EmployeeOverview id={cell} showId showPosition />
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
    formatter: (cell, row) => {
      const total =
        parseInt(cell.Present) ||
        0 + parseInt(cell.Absent) ||
        0 + parseInt(cell.Late) ||
        0;
      const present = parseInt(cell.Present) || 0 + parseInt(cell.Late) || 0;
      const percentage = calculatePercentage(present , total);
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
