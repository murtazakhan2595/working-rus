import React from "react";
import { StatusLabel } from "components";
import ClearanceActions from "./ClearanceActions";
import { EmployeeID } from "utils/getValuesFromTables";
import { renderDate } from "utils/renderValues";

export const ClearanceColumns = (reload, clearanceList = []) => [
  {
    dataField: "employee_id",
    text: "Employee ID",
    sort: true,
    formatter: (cell) => <EmployeeID value={cell} />,
  },
  {
    dataField: "employee_name",
    text: "Employee Name",
    sort: true,
  },
  {
    dataField: "department",
    text: "Department",
    sort: true,
  },
  {
    dataField: "designation",
    text: "Designation",
    sort: true,
  },
  {
    dataField: "clearance_type",
    text: "Clearance Type",
    sort: true,
    formatter: (cell) => (
      <StatusLabel
        status={cell}
        variant={
          cell === "Leave"
            ? "success"
            : cell === "Internal Transfer"
            ? "info"
            : cell === "External Transfer"
            ? "warning"
            : cell === "Job Rotation"
            ? "purple"
            : cell === "Resignation"
            ? "danger"
            : cell === "Termination"
            ? "dark"
            : "neutral"
        }
      />
    ),
  },
  {
    dataField: "clearance_start_date",
    text: "Clearance Start Date",
    sort: true,
    formatter: (cell) => renderDate(cell),
  },
  {
    dataField: "status",
    text: "Status",
    sort: true,
    formatter: (cell) => (
      <StatusLabel
        status={cell}
        variant={
          cell === "Pending"
            ? "warning"
            : cell === "In Process"
            ? "info"
            : cell === "Completed"
            ? "success"
            : cell === "Rejected"
            ? "danger"
            : "neutral"
        }
      />
    ),
  },
  {
    dataField: "actions",
    text: "Actions",
    isDummyField: true,
    csvExport: false,
    formatter: (cell, row) => (
      <ClearanceActions
        data={row}
        reloadData={reload}
        clearanceList={clearanceList}
      />
    ),
    style: {
      textAlign: "center",
    },
  },
];
