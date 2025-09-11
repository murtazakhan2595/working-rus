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

// Enhanced Exit Request Report Columns (v2) - MATCHES API EXACTLY
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

// Termination Report Columns - MATCHES v2-termination-report API
export const TerminationReportColumns = () => [
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
        {cell || "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "termination_date",
    text: "Termination Date",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000">
        {cell === "N/A" ? "N/A" : renderDate(cell)}
      </span>
    ),
  },
  {
    dataField: "termination_type",
    text: "Type",
    dataSort: true,
    formatter: (cell) => {
      const variants = {
        "Voluntary Resignation": "info",
        Involuntary: "error",
        Immediate: "error",
        "With Notice": "warning",
      };
      return (
        <Badge variant={variants[cell] || "neutral"} className="text-xs">
          {cell || "N/A"}
        </Badge>
      );
    },
  },
  {
    dataField: "notice_period",
    text: "Notice Period",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "reason_for_termination",
    text: "Reason",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000">{cell || "N/A"}</span>
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

// Notice Period Compliance Report Columns - MATCHES notice-period-compliance-report API
export const NoticePeriodComplianceColumns = () => [
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
        Voluntary: "info",
        Retirement: "secondary",
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
    dataField: "notice_start_date",
    text: "Notice Start",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000">
        {cell === "N/A" ? "N/A" : renderDate(cell)}
      </span>
    ),
  },
  {
    dataField: "notice_end_date",
    text: "Notice End",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000">
        {cell === "N/A" ? "N/A" : renderDate(cell)}
      </span>
    ),
  },
  {
    dataField: "total_notice_days",
    text: "Required Days",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-neutral-1200">
          {cell || 0}
        </span>
      </div>
    ),
  },
  {
    dataField: "served_days",
    text: "Served Days",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-blue-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "compliance_status",
    text: "Compliance",
    dataSort: true,
    formatter: (cell) => {
      const variants = {
        Compliant: "success",
        "Non-Compliant": "error",
        "N/A": "neutral",
      };
      return (
        <StatusLabel status={cell} variant={variants[cell] || "neutral"}>
          {cell || "N/A"}
        </StatusLabel>
      );
    },
  },
];

// Exit Interview Report Columns - MATCHES Exit-Interview-Report API
export const ExitInterviewReportColumns = () => [
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
    formatter: (cell) => (
      <div className="font-medium text-neutral-1200">{cell || "N/A"}</div>
    ),
  },
  {
    dataField: "exit_reason",
    text: "Exit Reason",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="secondary" className="text-xs">
        {cell === "N/A" ? "Not Specified" : cell || "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "rehire_eligible",
    text: "Rehire Eligible",
    dataSort: true,
    formatter: (cell) => {
      const variants = {
        Yes: "success",
        No: "error",
      };
      return (
        <StatusLabel status={cell} variant={variants[cell] || "neutral"}>
          {cell || "N/A"}
        </StatusLabel>
      );
    },
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

// Rehire Eligibility Report Columns - MATCHES rehire-eligibility-report API
export const RehireEligibilityReportColumns = () => [
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
    formatter: (cell) => (
      <div className="font-medium text-neutral-1200">{cell || "N/A"}</div>
    ),
  },
  {
    dataField: "exit_type",
    text: "Exit Type",
    dataSort: true,
    formatter: (cell) => {
      const variants = {
        Voluntary: "info",
        Retirement: "secondary",
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
    dataField: "exit_reason",
    text: "Exit Reason",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000">
        {cell === "N/A" ? "Not Specified" : cell || "N/A"}
      </span>
    ),
  },
  {
    dataField: "hr_decision",
    text: "HR Decision",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000">
        {cell === "N/A" ? "Pending" : cell || "N/A"}
      </span>
    ),
  },
  {
    dataField: "eligible_for_rehire",
    text: "Eligible for Rehire",
    dataSort: true,
    formatter: (cell) => {
      const variants = {
        Yes: "success",
        No: "error",
      };
      return (
        <StatusLabel status={cell} variant={variants[cell] || "neutral"}>
          {cell || "N/A"}
        </StatusLabel>
      );
    },
  },
  {
    dataField: "notes",
    text: "Notes",
    dataSort: false,
    formatter: (cell) => (
      <div className="max-w-xs">
        <span className="text-sm text-neutral-1000">
          {cell === "N/A" ? "No notes" : cell || "N/A"}
        </span>
      </div>
    ),
  },
];


// Clearance Pending Report Columns - MATCHES v2-Clearance-Pending-Report API
export const ClearancePendingReportColumns = () => [
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
    formatter: (cell) => (
      <div className="font-medium text-neutral-1200">{cell || "N/A"}</div>
    ),
  },
  {
    dataField: "payroll",
    text: "Payroll",
    dataSort: true,
    formatter: (cell) => {
      const variants = {
        "Completed": "success",
        "Pending": "warning",
        "Issues": "error",
      };
      return (
        <StatusLabel status={cell} variant={variants[cell] || "neutral"}>
          {cell || "Pending"}
        </StatusLabel>
      );
    },
  },
  {
    dataField: "assets",
    text: "Assets",
    dataSort: true,
    formatter: (cell) => {
      const variants = {
        "Completed": "success",
        "Pending": "warning",
        "Overdue": "error",
      };
      return (
        <StatusLabel status={cell} variant={variants[cell] || "neutral"}>
          {cell || "Pending"}
        </StatusLabel>
      );
    },
  },
  {
    dataField: "hr_docs",
    text: "HR Documents",
    dataSort: true,
    formatter: (cell) => {
      const variants = {
        "Completed": "success",
        "Pending": "warning",
        "Missing": "error",
      };
      return (
        <StatusLabel status={cell} variant={variants[cell] || "neutral"}>
          {cell || "Pending"}
        </StatusLabel>
      );
    },
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

// Detailed Clearance Pending Report Columns - MATCHES Clearance-Pending-Report API
export const DetailedClearancePendingReportColumns = () => [
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
    formatter: (cell) => (
      <div className="font-medium text-neutral-1200">{cell || "N/A"}</div>
    ),
  },
  {
    dataField: "assets_pending",
    text: "Assets Pending",
    dataSort: false,
    formatter: (cell) => {
      if (!Array.isArray(cell)) return <span className="text-sm text-neutral-1000">None</span>;
      
      const validAssets = cell.filter(asset => asset !== null && asset !== undefined);
      
      if (validAssets.length === 0) {
        return <span className="text-sm text-green-600 font-medium">✓ No pending assets</span>;
      }
      
      return (
        <div className="max-w-xs">
          <div className="text-sm text-red-600 font-medium mb-1">
            {validAssets.length} items pending:
          </div>
          <div className="text-xs text-neutral-800 space-y-1">
            {validAssets.slice(0, 3).map((asset, index) => (
              <div key={index} className="truncate">• {asset}</div>
            ))}
            {validAssets.length > 3 && (
              <div className="text-neutral-600">... +{validAssets.length - 3} more</div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    dataField: "payroll_pending",
    text: "Payroll Pending",
    dataSort: true,
    formatter: (cell) => {
      if (cell === "N/A") {
        return <span className="text-sm text-green-600 font-medium">✓ Cleared</span>;
      }
      return (
        <Badge variant="warning" className="text-xs">
          {cell || "Final Settlement"}
        </Badge>
      );
    },
  },
  {
    dataField: "hr_docs_pending",
    text: "HR Documents Pending",
    dataSort: true,
    formatter: (cell) => {
      if (cell === "N/A") {
        return <span className="text-sm text-green-600 font-medium">✓ Cleared</span>;
      }
      return (
        <Badge variant="warning" className="text-xs">
          {cell || "Exit Form"}
        </Badge>
      );
    },
  },
  {
    dataField: "clearance_status",
    text: "Overall Status",
    dataSort: true,
    formatter: (cell) => {
      const variants = {
        "COMPLETED": "success",
        "INITIATED": "info",
        "PENDING": "warning",
        "BLOCKED": "error",
      };
      return (
        <StatusLabel status={cell} variant={variants[cell?.toUpperCase()] || "neutral"}>
          {cell || "PENDING"}
        </StatusLabel>
      );
    },
  },
];