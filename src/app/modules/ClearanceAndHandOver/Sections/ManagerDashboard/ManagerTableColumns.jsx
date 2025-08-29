// src/app/modules/ClearanceAndHandOver/Sections/ManagerDashboard/ManagerTableColumns.jsx

import React from "react";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Progress } from "src/@/components/ui/progress";
import { StatusLabel } from "components";
import { renderDate } from "utils/renderValues";
import { Send, Eye } from "lucide-react";

// SLA status badge component - reuse from analytics
const SLAStatusBadge = ({ status, isOverdue, daysOverdue, slaValue }) => {
  // Handle case where SLA is not defined
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

export const ManagerTableColumns = (onViewDetails, onSendReminder) => [
  {
    dataField: "employee_full_name",
    text: "Employee",
    sort: true,
    formatter: (cell, row) => (
      <div>
        <div className="font-medium">{cell}</div>
        <div className="text-xs text-mauve-1000">
          ID: {row.employee || "N/A"}
        </div>
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
  {
    dataField: "actions",
    text: "Actions",
    isDummyField: true,
    csvExport: false,
    formatter: (cell, row) => {
      const isPending = row.status === "PENDING" || row.status === "IN_PROCESS";
      const isCompleted = row.status === "COMPLETED";
      const isOnHold = row.status === "ONHOLD";

      return (
        <div className="flex gap-2">
          {/* View Details Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(row)}
            className="text-xs"
            title="View clearance details"
          >
            <Eye className="h-3 w-3" />
          </Button>

          {/* Send Reminder Button - Only for pending/in-process items */}
          {isPending && !isOnHold && (
            <Button
              variant="default"
              size="sm"
              onClick={() => onSendReminder(row)}
              className="text-xs"
              title="Send reminder to responsible departments"
            >
              <Send className="h-3 w-3 mr-1" />
              Remind
            </Button>
          )}

          {/* Status indicators for non-actionable items */}
          {isCompleted && (
            <Badge variant="success" className="text-xs">
              Complete
            </Badge>
          )}

          {isOnHold && (
            <Badge variant="error" className="text-xs">
              On Hold
            </Badge>
          )}
        </div>
      );
    },
    style: {
      textAlign: "center",
      minWidth: "120px",
    },
  },
];
