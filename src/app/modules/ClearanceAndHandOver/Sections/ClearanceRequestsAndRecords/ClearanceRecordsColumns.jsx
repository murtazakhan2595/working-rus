import React from "react";
import { StatusLabel } from "components";
import ClearanceRecordsActions from "./ClearanceRecordsActions";
import { EmployeeID } from "utils/getValuesFromTables";
import { renderDate } from "utils/renderValues";
import { Badge } from "components/ui/badge";
import { EmployeeUsername } from "utils/getValuesFromTables";
import { getStatusVariant } from "components";
import { DepartmentName } from "utils/getValuesFromTables";
import { DesignationName } from "utils/getValuesFromTables";
import { EmployeeInfo } from "utils/getValuesFromTables";
export const ClearanceRecordsColumns = (
  reload,
  clearanceRecords = [],
  clearanceTypes = []
) => [
  {
    dataField: "employee", // API returns employee ID
    text: "Employee ID",
    sort: true,
    formatter: (cell, row) => {
      // Handle different possible data structures from API
      const employeeId = cell || row.employee_id || row.id;
      return <EmployeeID value={employeeId} />;
    },
  },
  {
    dataField: "employee_name", // This might need to be fetched from employee relation
    text: "Employee Name",
    sort: true,
    formatter: (cell, row) => {
      // If API doesn't return employee_name directly, you might need to get it from employee relation
      return cell || "N/A";
    },
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
    dataField: "clearance_type", // API returns clearance_type ID
    text: "Clearance Type",
    sort: true,
    formatter: (cell, row) => {

      // Safety check: ensure clearanceTypes is an array
      if (!Array.isArray(clearanceTypes) || clearanceTypes.length === 0) {
        return cell || "N/A";
      }

      // Find clearance type name from clearanceTypes array
      const clearanceType = clearanceTypes.find((type) => type?.id === cell);
      return clearanceType?.name || cell || "N/A";
    },
  },
  {
    dataField: "start_date", // API field name
    text: "Clearance Start Date",
    sort: true,
    formatter: (cell) => renderDate(cell),
  },
  {
    dataField: "completion_date", // API field name
    text: "Clearance Completion Date",
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
        REJECTED: { label: "Rejected", variant: "error" }, // use "error" not "danger"
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
    text: "Action",
    isDummyField: true,
    csvExport: false,
    formatter: (cell, row) => (
      <ClearanceRecordsActions
        data={row}
        reloadData={reload}
        clearanceTypes={clearanceTypes}
      />
    ),
    style: {
      textAlign: "center",
    },
  },
];


export const ActionLogsColumns = (checklistItems = []) => {
  // Helper function to get checklist item name by ID
  const getChecklistItemName = (itemId) => {
    console.log("Looking for checklist item:", itemId, "in:", checklistItems);
    if (!itemId) return "N/A";
    // The checklist item has 'id' field, not 'checklist_item'
    const item = checklistItems.find((item) => item.id === itemId);
    console.log("Found item:", item);
    return item?.checklist_name || `#${itemId}`;
  };

  return [
    {
      dataField: "checklist_item",
      text: "Item",
      sort: true,
      formatter: (cell) => `#${cell || "N/A"}`,
      width: "80px",
    },
    {
      dataField: "checklist_item",
      text: "Clearance Item Title",
      sort: true,
      formatter: (cell, row) => {
        console.log("----------", cell, row);
        const name = getChecklistItemName(cell);
        return (
          <div className="max-w-xs">
            <div className="font-medium text-neutral-1200 capitalize">
              {name}
            </div>
          </div>
        );
      },
    },
  {
    dataField: "action",
    text: "Status",
    sort: true,
    formatter: (cell) => (
      <Badge
        variant={
          cell === "CLEAR" ? "success" : cell === "REJECT" ? "danger" : "info"
        }
      >
        {cell || "N/A"}
      </Badge>
    ),
    width: "100px",
  },
  {
    dataField: "actor",
    text: "Assigned Department",
    formatter: (cell, row) => {
      return <EmployeeInfo value={cell} label="department_name" />;
    },
  },
  {
    dataField: "e_signature_status",
    text: "E-Signature",
    sort: true,
    formatter: (cell) => (
      <Badge variant={getStatusVariant(cell)}>
        {cell?.replace("_", " ") || "N/A"}
      </Badge>
    ),
    width: "120px",
  },
  {
    dataField: "actor",
    text: "Updated By",
    sort: true,
    formatter: (cell) => (
      <EmployeeUsername value={cell} fallBackText="System" />
    ),
    width: "120px",
  },
  {
    dataField: "timestamp",
    text: "Date & Time",
    sort: true,
    formatter: (cell) => renderDate(cell, "--", "date-time") || "N/A",
    width: "150px",
  },
  {
    dataField: "notes",
    text: "Remarks",
    sort: false,
    formatter: (cell) => (
      <div className="max-w-xs truncate" title={cell}>
        {cell || "-"}
      </div>
    ),
  },
  ];
};