import React from "react";
import { StatusLabel } from "components";
import ClearanceActions from "./ClearanceActions";
import { EmployeeID } from "utils/getValuesFromTables";
import { renderDate } from "utils/renderValues";
import { DepartmentName } from "utils/getValuesFromTables";
import { DesignationName } from "utils/getValuesFromTables";

export const ClearanceColumns = (reload, clearanceList = [], clearanceTypes) => [
  {
    dataField: "employee",
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
    formatter: (cell, row) => <DepartmentName value={cell} />,
  },
  {
    dataField: "designation",
    text: "Designation",
    sort: true,
    formatter: (cell, row) => <DesignationName value={cell} />,
  },
  {
    dataField: "clearance_type",
    text: "Clearance Type",
    sort: true,
    formatter: (cell) => {
      const clearanceType = clearanceTypes.find((type) => type.id === cell);
      return clearanceType ? clearanceType.name : cell;
    },
  },
  {
    dataField: "start_date",
    text: "Clearance Start Date",
    sort: true,
    formatter: (cell) => renderDate(cell),
  },
  {
    dataField: "status", // API returns status
    text: "Status",
    sort: true,
    formatter: (cell) => {
      const statusMap = {
        PENDING: { label: "Pending", variant: "warning" },
        IN_PROCESS: { label: "In Process", variant: "info" },
        COMPLETED: { label: "Completed", variant: "success" },
        REJECTED: { label: "Rejected", variant: "error" },
        ONHOLD: { label: "On Hold", variant: "error" },
      };

      const status = statusMap[cell] || {
        label: cell || "Unknown",
        variant: "neutral",
      };

      return (
        <StatusLabel status={status.label} variant={status.variant}>
          {status.label}
        </StatusLabel>
      );
    },
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
        clearanceTypes={clearanceTypes}
      />
    ),
    style: {
      textAlign: "center",
    },
  },
];
