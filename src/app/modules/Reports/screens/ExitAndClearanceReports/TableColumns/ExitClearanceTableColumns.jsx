// src/app/modules/Reports/screens/ExitAndClearanceReports/TableColumns/ExitClearanceTableColumns.jsx

import React from "react";
import { Badge } from "components/ui/badge";
import { StatusLabel, EmployeeOverview } from "components";
import { renderDate } from "utils/renderValues";
import { Progress } from "src/@/components/ui/progress";
import { DesignationName } from "utils/getValuesFromTables";

// Resignation Report Columns
export const ResignationReportColumns = () => [
  {
    dataField: "employee_id",
    text: "Employee ID",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "name",
    text: "Employee Name",
    dataSort: true,
    formatter: (cell, row) => (
      <div>
        <div className="font-medium text-neutral-1200">{cell || "N/A"}</div>
        <div className="text-xs text-neutral-800">
          {row.department || "N/A"}
        </div>
      </div>
    ),
  },
  {
    dataField: "designation",
    text: "Designation",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="outline" className="text-xs">
        {<DesignationName value={cell} />}
      </Badge>
    ),
  },
  {
    dataField: "resignation_date",
    text: "Resignation Date",
    dataSort: true,
    formatter: (cell) => renderDate(cell),
  },
  {
    dataField: "notice_start_date",
    text: "Notice Start",
    dataSort: true,
    formatter: (cell) => renderDate(cell),
  },
  {
    dataField: "notice_end_date",
    text: "Notice End",
    dataSort: true,
    formatter: (cell) => renderDate(cell),
  },
  {
    dataField: "reason_for_leaving",
    text: "Reason",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="secondary" className="text-xs">
        {cell || "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "status",
    text: "Status",
    dataSort: true,
    formatter: (cell) => {
      const variants = {
        APPROVED: "success",
        PENDING: "warning",
        REJECTED: "error",
        COMPLETED: "success",
        "IN PROGRESS": "info",
      };
      return (
        <StatusLabel
          status={cell}
          variant={variants[cell?.toUpperCase()] || "neutral"}
        >
          {cell || "N/A"}
        </StatusLabel>
      );
    },
  },
];

// Exit Request Report Columns (v1)
export const ExitRequestReportColumns = () => [
  {
    dataField: "employee_id",
    text: "Employee ID",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "name",
    text: "Employee Name",
    dataSort: true,
    formatter: (cell, row) => (
      <div>
        <div className="font-medium text-neutral-1200">{cell || "N/A"}</div>
        <div className="text-xs text-neutral-800">
          {row.department || "N/A"}
        </div>
      </div>
    ),
  },
  {
    dataField: "designation",
    text: "Designation",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="outline" className="text-xs">
        {<DesignationName value={cell} />}
      </Badge>
    ),
  },
  {
    dataField: "exit_request_date",
    text: "Request Date",
    dataSort: true,
    formatter: (cell) => renderDate(cell),
  },
  {
    dataField: "last_working_day",
    text: "Last Working Day",
    dataSort: true,
    formatter: (cell) => renderDate(cell),
  },
  {
    dataField: "reason_for_exit",
    text: "Exit Reason",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="secondary" className="text-xs">
        {cell || "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "status",
    text: "Status",
    dataSort: true,
    formatter: (cell) => {
      const variants = {
        APPROVED: "success",
        PENDING: "warning",
        REJECTED: "error",
      };
      return (
        <StatusLabel
          status={cell}
          variant={variants[cell?.toUpperCase()] || "neutral"}
        >
          {cell || "N/A"}
        </StatusLabel>
      );
    },
  },
];

// Enhanced Exit Request Report Columns (v2)
export const V2ExitRequestReportColumns = () => [
  {
    dataField: "employee_id",
    text: "Employee ID",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "name",
    text: "Employee Name",
    dataSort: true,
    formatter: (cell, row) => (
      <div>
        <div className="font-medium text-neutral-1200">{cell || "N/A"}</div>
        <div className="text-xs text-neutral-800">
          {row.department || "N/A"}
        </div>
      </div>
    ),
  },
  {
    dataField: "exit_type",
    text: "Exit Type",
    dataSort: true,
    formatter: (cell) => {
      const variants = {
        "Voluntary Resignation": "info",
        Retirement: "secondary",
        Termination: "error",
        Others: "neutral",
      };
      return (
        <Badge variant={variants[cell] || "neutral"} className="text-xs">
          {cell || "N/A"}
        </Badge>
      );
    },
  },
  {
    dataField: "notice_start",
    text: "Notice Start",
    dataSort: true,
    formatter: (cell) => renderDate(cell),
  },
  {
    dataField: "notice_end",
    text: "Notice End",
    dataSort: true,
    formatter: (cell) => renderDate(cell),
  },
  {
    dataField: "nationality",
    text: "Nationality",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000">{cell || "N/A"}</span>
    ),
  },
];

// Attrition & Retention Report Columns
export const AttritionRetentionReportColumns = () => [
  {
    dataField: "month",
    text: "Period",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "department",
    text: "Department",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "total_employees",
    text: "Total Employees",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-semibold text-plum-900">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "exits",
    text: "Exits",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-red-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "attrition_percent",
    text: "Attrition Rate",
    dataSort: true,
    formatter: (cell) => {
      const percentage = parseFloat(cell?.replace("%", "") || 0);
      const color =
        percentage > 10
          ? "text-red-600"
          : percentage > 5
          ? "text-yellow-600"
          : "text-green-600";
      return (
        <div className="w-full">
          <div className="flex justify-between items-center mb-1">
            <span className={`text-sm font-medium ${color}`}>
              {cell || "0%"}
            </span>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>
      );
    },
  },
  {
    dataField: "retention_percent",
    text: "Retention Rate",
    dataSort: true,
    formatter: (cell) => {
      const percentage = parseFloat(cell?.replace("%", "") || 0);
      const color =
        percentage > 95
          ? "text-green-600"
          : percentage > 90
          ? "text-yellow-600"
          : "text-red-600";
      return (
        <div className="w-full">
          <div className="flex justify-between items-center mb-1">
            <span className={`text-sm font-medium ${color}`}>
              {cell || "0%"}
            </span>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>
      );
    },
  },
];

// Placeholder columns for missing APIs

// Termination Report Columns (Placeholder)
export const TerminationReportColumns = () => [
  {
    dataField: "employee_id",
    text: "Employee ID",
    dataSort: true,
  },
  {
    dataField: "name",
    text: "Employee Name",
    dataSort: true,
  },
  {
    dataField: "department",
    text: "Department",
    dataSort: true,
  },
  {
    dataField: "termination_date",
    text: "Termination Date",
    dataSort: true,
  },
  {
    dataField: "termination_type",
    text: "Type",
    dataSort: true,
  },
  {
    dataField: "reason_for_termination",
    text: "Reason",
    dataSort: true,
  },
  {
    dataField: "status",
    text: "Status",
    dataSort: true,
  },
];

// Clearance Pending Report Columns (Placeholder)
export const ClearancePendingReportColumns = () => [
  {
    dataField: "employee_id",
    text: "Employee ID",
    dataSort: true,
  },
  {
    dataField: "name",
    text: "Employee Name",
    dataSort: true,
  },
  {
    dataField: "assets_pending",
    text: "Assets Pending",
    dataSort: false,
  },
  {
    dataField: "payroll_pending",
    text: "Payroll Pending",
    dataSort: false,
  },
  {
    dataField: "hr_docs_pending",
    text: "HR Docs Pending",
    dataSort: false,
  },
  {
    dataField: "clearance_status",
    text: "Clearance Status",
    dataSort: true,
  },
];

// Exit Interview Report Columns (Placeholder)
export const ExitInterviewReportColumns = () => [
  {
    dataField: "employee_id",
    text: "Employee ID",
    dataSort: true,
  },
  {
    dataField: "name",
    text: "Employee Name",
    dataSort: true,
  },
  {
    dataField: "exit_date",
    text: "Exit Date",
    dataSort: true,
  },
  {
    dataField: "exit_reason",
    text: "Exit Reason",
    dataSort: true,
  },
  {
    dataField: "interviewer",
    text: "Interviewer",
    dataSort: true,
  },
  {
    dataField: "rating",
    text: "Rating (1-5)",
    dataSort: true,
  },
  {
    dataField: "feedback_summary",
    text: "Feedback Summary",
    dataSort: false,
  },
];

// Notice Period Compliance Report Columns (Placeholder)
export const NoticePeriodComplianceColumns = () => [
  {
    dataField: "employee_id",
    text: "Employee ID",
    dataSort: true,
  },
  {
    dataField: "name",
    text: "Employee Name",
    dataSort: true,
  },
  {
    dataField: "department",
    text: "Department",
    dataSort: true,
  },
  {
    dataField: "notice_start_date",
    text: "Notice Start",
    dataSort: true,
  },
  {
    dataField: "notice_end_date",
    text: "Notice End",
    dataSort: true,
  },
  {
    dataField: "total_notice_days",
    text: "Required Days",
    dataSort: true,
  },
  {
    dataField: "served_days",
    text: "Served Days",
    dataSort: true,
  },
  {
    dataField: "compliance_status",
    text: "Compliance",
    dataSort: true,
  },
];

// Rehire Eligibility Report Columns (Placeholder)
export const RehireEligibilityReportColumns = () => [
  {
    dataField: "employee_id",
    text: "Employee ID",
    dataSort: true,
  },
  {
    dataField: "name",
    text: "Employee Name",
    dataSort: true,
  },
  {
    dataField: "exit_type",
    text: "Exit Type",
    dataSort: true,
  },
  {
    dataField: "exit_reason",
    text: "Exit Reason",
    dataSort: true,
  },
  {
    dataField: "hr_decision",
    text: "HR Decision",
    dataSort: true,
  },
  {
    dataField: "eligible_for_rehire",
    text: "Eligible for Rehire",
    dataSort: true,
  },
  {
    dataField: "notes",
    text: "Notes",
    dataSort: false,
  },
];
