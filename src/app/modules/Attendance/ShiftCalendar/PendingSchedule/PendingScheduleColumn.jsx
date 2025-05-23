// src/app/modules/Attendance/ShiftCalendar/Section/PendingScheduleColumn.jsx
import React from "react";
import moment from "moment";
import { EmployeeOverview } from "components";
import PendingScheduleAction from "./PendingScheduleAction";
import { EmployeeID } from "utils/getValuesFromTables";

export const pendingScheduleColumns = (reload) => [
  {
    dataField: "employee_id",
    text: "ID",
    formatter: (cell) => <EmployeeID value={cell} />,
    dataSort: true,
  },
  {
    dataField: "employee_id",
    text: "Employee",
    formatter: (cell, row) => (
      <EmployeeOverview
        id={cell}
        showEmail={true}
        showDepartment={true}
        showPosition={true}
      />
    ),
  },
  {
    dataField: "start_date",
    text: "Schedule Period",
    formatter: (cell, row) => (
      <div className="flex flex-col">
        <span>
          {`${moment(row.start_date).format("MMM D")} - ${moment(
            row.end_date
          ).format("MMM D")}`}
        </span>
        <span className="text-sm text-muted-1100">
          {moment(row.start_date).diff(moment(row.end_date), "days") === 0
            ? "1 Day"
            : `${
                Math.abs(
                  moment(row.end_date).diff(moment(row.start_date), "days")
                ) + 1
              } Days`}
        </span>
      </div>
    ),
    dataSort: true,
  },
  {
    dataField: "is_off_day",
    text: "Shift Type",
    formatter: (cell, row) => {
      const type = row.is_off_day
        ? "OFF Day"
        : row.is_split_shift
        ? "Split Shift"
        : "Regular Shift";
      const colorClass = row.is_off_day
        ? "bg-blue-50 text-blue-700"
        : row.is_split_shift
        ? "bg-purple-50 text-purple-700"
        : "bg-green-50 text-green-700";

      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
        >
          {type}
        </span>
      );
    },
  },
  {
    dataField: "assigned_by",
    text: "Submitted By",
    formatter: (cell, row) => (
      <EmployeeOverview id={cell} showDepartment={true} showPosition={true} />
    ),
    dataSort: true,
  },
  {
    dataField: "status",
    text: "Status",
    formatter: (cell) => (
      <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-yellow-50 text-yellow-700">
        {cell}
      </span>
    ),
    dataSort: true,
  },
  {
    text: "Action",
    formatter: (cell, row) => (
      <PendingScheduleAction data={row} reload={reload} />
    ),
    classes: "text-center",
    headerClasses: "text-center",
  },
];
