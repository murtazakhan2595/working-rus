import React from "react";
import { Badge } from "components/ui/badge";
import { StatusLabel } from "components";
import { renderDate } from "utils/renderValues";
import moment from "moment";


// ============================================================================
// TIME ADJUSTMENT REPORT COLUMNS
// Add these to your AttendanceShiftTableColumns.jsx file
// ============================================================================

// Time Adjustment Request Report Columns
export const TimeAdjustmentRequestColumns = () => [
  {
    dataField: "Request_ID",
    text: "Request ID",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-blue-600">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "Employee",
    text: "Employee Name",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "Dept",
    text: "Department",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "Date",
    text: "Date",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="outline" className="text-xs">
        {cell || "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "Requested_Change",
    text: "Requested Change",
    dataSort: false,
    formatter: (cell) => (
      <span className="text-xs font-medium text-blue-700">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "Reason",
    text: "Reason",
    dataSort: false,
    formatter: (cell) => (
      <span className="text-xs text-neutral-800">
        {cell || "No reason provided"}
      </span>
    ),
  },
  {
    dataField: "Status",
    text: "Status",
    dataSort: true,
    formatter: (cell) => {
      const variants = {
        Approved: "success",
        Pending: "warning",
        Rejected: "destructive",
      };
      return (
        <StatusLabel status={cell} variant={variants[cell] || "neutral"}>
          {cell || "Unknown"}
        </StatusLabel>
      );
    },
  },
];

// Time Adjustment Status Report Columns
export const TimeAdjustmentStatusColumns = () => [
  {
    dataField: "Status",
    text: "Status",
    dataSort: true,
    formatter: (cell) => {
      const variants = {
        Approved: "success",
        Pending: "warning",
        Rejected: "destructive",
        Total: "info",
      };
      return (
        <StatusLabel status={cell} variant={variants[cell] || "neutral"}>
          {cell || "Unknown"}
        </StatusLabel>
      );
    },
  },
  {
    dataField: "Count",
    text: "Count",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-bold text-plum-900">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "% of Total",
    text: "Percentage",
    dataSort: true,
    formatter: (cell) => {
      const percentage = parseFloat(cell?.replace("%", "") || 0);
      const color =
        percentage >= 50
          ? "text-green-600"
          : percentage >= 25
          ? "text-yellow-600"
          : "text-red-600";

      return (
        <div className="text-center">
          <span className={`text-lg font-bold ${color}`}>{cell || "0%"}</span>
        </div>
      );
    },
  },
];

// Reason Analysis Report Columns
export const ReasonAnalysisColumns = () => [
  {
    dataField: "Reason Type",
    text: "Reason Type",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "No. of Requests",
    text: "Number of Requests",
    dataSort: true,
    formatter: (cell) => {
      const count = parseInt(cell) || 0;
      const color =
        count > 5
          ? "text-red-600"
          : count > 2
          ? "text-yellow-600"
          : "text-green-600";

      return (
        <div className="text-center">
          <span className={`text-lg font-bold ${color}`}>{count}</span>
        </div>
      );
    },
  },
  {
    dataField: "% Share",
    text: "Share %",
    dataSort: true,
    formatter: (cell) => {
      const percentage = parseFloat(cell?.replace("%", "") || 0);
      return (
        <div className="text-center">
          <span className="text-lg font-medium text-blue-600">
            {cell || "0%"}
          </span>
        </div>
      );
    },
  },
  {
    dataField: "Example Employee",
    text: "Example Employee",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-800">{cell || "N/A"}</span>
    ),
  },
];

// Manager Approval Report Columns
export const ManagerApprovalColumns = () => [
  {
    dataField: "Manager",
    text: "Manager Name",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "Requests_Reviewed",
    text: "Requests Reviewed",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-neutral-800">
          {cell || 0}
        </span>
      </div>
    ),
  },
  {
    dataField: "Approved",
    text: "Approved",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-green-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "Rejected",
    text: "Rejected",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-red-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "Pending",
    text: "Pending",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-yellow-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "Approval_Rate",
    text: "Approval Rate",
    dataSort: true,
    formatter: (cell) => {
      const rate = parseFloat(cell?.replace("%", "") || 0);
      const color =
        rate >= 80
          ? "text-green-600"
          : rate >= 60
          ? "text-yellow-600"
          : "text-red-600";

      return (
        <div className="text-center">
          <span className={`text-lg font-bold ${color}`}>{cell || "0%"}</span>
        </div>
      );
    },
  },
];

// Repeat Adjustment Report Columns
export const RepeatAdjustmentColumns = () => [
  {
    dataField: "Employee",
    text: "Employee Name",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "Dept.",
    text: "Department",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "No. of Requests",
    text: "Number of Requests",
    dataSort: true,
    formatter: (cell) => {
      const count = parseInt(cell) || 0;
      const color =
        count > 5
          ? "text-red-600"
          : count > 2
          ? "text-yellow-600"
          : "text-green-600";

      return (
        <div className="text-center">
          <span className={`text-lg font-bold ${color}`}>{count}</span>
        </div>
      );
    },
  },
  {
    dataField: "Common Reason",
    text: "Common Reason",
    dataSort: false,
    formatter: (cell) => (
      <span className="text-xs text-neutral-800">
        {cell || "Various reasons"}
      </span>
    ),
  },
  {
    dataField: "Risk Level",
    text: "Risk Level",
    dataSort: true,
    formatter: (cell) => {
      const variants = {
        Low: "success",
        Medium: "warning",
        High: "destructive",
      };
      return (
        <StatusLabel status={cell} variant={variants[cell] || "neutral"}>
          {cell || "Unknown"}
        </StatusLabel>
      );
    },
  },
];
