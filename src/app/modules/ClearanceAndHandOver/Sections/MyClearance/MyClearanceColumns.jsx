import React from "react";
import { StatusLabel } from "components";
import { renderDate } from "utils/renderValues";
import { Badge } from "components/ui/badge";
import { MyClearanceActions } from "./MyClearanceActions";

export const MyClearanceColumns = (
  reload,
  clearanceList = [],
  clearanceTypes = []
) => [
  {
    dataField: "clearance_type_name",
    text: "Clearance Type",
    sort: true,
    formatter: (cell, row) => {
      // Find clearance type name from clearanceTypes array if not directly available
      const clearanceType = clearanceTypes.find(
        (type) => type?.id === row.clearance_type
      );
      const displayName = cell || clearanceType?.name || "N/A";

      return (
        <Badge variant="info" className="text-sm">
          {displayName}
        </Badge>
      );
    },
  },
  {
    dataField: "start_date",
    text: "Start Date",
    sort: true,
    formatter: (cell) => renderDate(cell),
  },
  {
    dataField: "status",
    text: "Current Status",
    sort: true,
    formatter: (cell) => {
      const statusMap = {
        PENDING: { label: "Pending", variant: "warning" },
        IN_PROCESS: { label: "In Process", variant: "info" },
        COMPLETED: { label: "Completed", variant: "success" },
        REJECTED: { label: "Rejected", variant: "error" },
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
    dataField: "completion_date",
    text: "Completion Date",
    sort: true,
    formatter: (cell) => {
      return cell ? (
        renderDate(cell)
      ) : (
        <span className="text-neutral-1100">-</span>
      );
    },
  },
  {
    dataField: "actions",
    text: "Actions",
    isDummyField: true,
    csvExport: false,
    formatter: (cell, row) => (
      <MyClearanceActions
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
