// src/app/modules/ClearanceAndHandOver/Sections/AnalyticsTableColumns.jsx

import React from "react";
import { Badge } from "components/ui/badge";
import { Progress } from "src/@/components/ui/progress";
import { StatusLabel } from "components";
import { renderDate } from "utils/renderValues";
import moment from "moment";

// Risk level badge component
const RiskBadge = ({ level }) => {
  const variants = {
    HIGH: "error",
    MEDIUM: "warning",
    LOW: "success",
  };

  return <Badge variant={variants[level] || "neutral"}>{level}</Badge>;
};

// SLA status badge component
const SLAStatusBadge = ({ status, isOverdue, daysOverdue }) => {
  if (isOverdue) {
    return <Badge variant="error">Overdue ({daysOverdue}d)</Badge>;
  }

  const variants = {
    WITHIN_SLA: "success",
    AT_RISK: "warning",
    BREACHED: "error",
  };

  return (
    <Badge variant={variants[status] || "neutral"}>
      {status?.replace("_", " ") || "Unknown"}
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
    dataField: "sla_due_date",
    text: "SLA Due Date",
    sort: true,
    formatter: (cell, row) => (
      <div>
        <div>{renderDate(cell)}</div>
        <SLAStatusBadge
          status={row.sla_status}
          isOverdue={row.is_overdue}
          daysOverdue={row.days_overdue}
        />
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
        <div className="text-xs text-mauve-1000">
          {row.is_overdue ? `${row.days_overdue}d overdue` : "On track"}
        </div>
      </div>
    ),
  },
  {
    dataField: "risk_level",
    text: "Risk Level",
    sort: true,
    formatter: (cell) => <RiskBadge level={cell} />,
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
