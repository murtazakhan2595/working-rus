// src/app/modules/ClearanceAndHandOver/Sections/AnalyticsTableColumns.jsx

import React from "react";
import { Badge } from "components/ui/badge";
import { Progress } from "src/@/components/ui/progress";
import { StatusLabel } from "components";
import { renderDate } from "utils/renderValues";

// SLA status badge component with support for dynamic SLA
const SLAStatusBadge = ({ status, isOverdue, daysOverdue, slaValue }) => {
  // Handle case where SLA is not defined (slaValue is 0 or null)
  if (!slaValue || slaValue === 0) {
    return <Badge variant="secondary">No SLA</Badge>;
  }

  if (isOverdue) {
    return <Badge variant="error">Overdue ({daysOverdue}d)</Badge>;
  }

  const variants = {
    WITHIN_SLA: "success",
    AT_RISK: "warning",
    BREACHED: "error",
    NO_SLA: "secondary",
  };

  const displayNames = {
    WITHIN_SLA: "Within SLA",
    AT_RISK: "At Risk",
    BREACHED: "Breached",
    NO_SLA: "No SLA",
  };

  return (
    <Badge variant={variants[status] || "neutral"}>
      {displayNames[status] || status || "Unknown"}
    </Badge>
  );
};

export const AnalyticsTableColumns = (onViewDetails) => [
  {
    dataField: "employee_full_name",
    text: "Employee",
    sort: true,
    formatter: (cell, row) => (
      <div>
        <div className="font-medium">{cell}</div>
      </div>
    ),
  },
  {
    dataField: "department__name",
    text: "Department",
    sort: true,
    formatter: (cell) => <span className="text-sm">{cell}</span>,
  },
  {
    dataField: "clearance_type__name",
    text: "Clearance Type",
    sort: true,
    formatter: (cell) => <Badge variant="info">{cell}</Badge>,
  },
  {
    dataField: "status",
    text: "Status",
    sort: true,
    formatter: (cell) => {
      const variants = {
        PENDING: "warning",
        IN_PROCESS: "info",
        COMPLETED: "success",
        REJECTED: "error",
        ONHOLD: "error",
      };

      return (
        <StatusLabel status={cell} variant={variants[cell]}>
          {cell?.toLowerCase().replace("_", " ")}
        </StatusLabel>
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
    dataField: "sla",
    text: "SLA (Days)",
    sort: true,
    formatter: (cell, row) => (
      <div className="text-center">
        <div className="text-sm font-medium">
          {cell && parseFloat(cell) > 0 ? `${parseFloat(cell)} days` : "No SLA"}
        </div>
        {row.sla_due_date && (
          <div className="text-xs text-mauve-1000">
            Due: {renderDate(row.sla_due_date)}
          </div>
        )}
      </div>
    ),
  },
  {
    dataField: "days_pending",
    text: "Days Pending",
    sort: true,
    formatter: (cell, row) => (
      <div className="text-center">
        <div className="text-lg font-semibold">{cell}</div>
        <SLAStatusBadge
          status={row.sla_status}
          isOverdue={row.is_overdue}
          daysOverdue={row.days_overdue}
          slaValue={row.sla}
        />
      </div>
    ),
  },
  {
    dataField: "progress_percentage",
    text: "Progress",
    sort: true,
    formatter: (cell) => (
      <div className="w-full">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs">{cell}%</span>
        </div>
        <Progress value={cell} className="h-2" />
      </div>
    ),
  },
];
