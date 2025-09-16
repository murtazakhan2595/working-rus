import React from "react";
import { Badge } from "components/ui/badge";
import { StatusLabel } from "components";
import { renderDate } from "utils/renderValues";
import moment from "moment";

// ============================================================================
// CORE ATTENDANCE REPORT COLUMNS
// ============================================================================

// Daily Attendance Report Columns
export const DailyAttendanceColumns = () => [
  {
    dataField: "EmployeeID",
    text: "Employee ID",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "Name",
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
    dataField: "Shift",
    text: "Shift",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="outline" className="text-xs">
        {cell || "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "CheckIn",
    text: "Check In",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-green-600">
        {cell ? moment(cell).format("hh:mm A") : "N/A"}
      </span>
    ),
  },
  {
    dataField: "CheckOut",
    text: "Check Out",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-red-600">
        {cell ? moment(cell).format("hh:mm A") : "N/A"}
      </span>
    ),
  },
  {
    dataField: "date",
    text: "Date",
    dataSort: true,
    formatter: (cell) => renderDate(cell),
  },
  {
    dataField: "Status",
    text: "Status",
    dataSort: true,
    formatter: (cell) => {
      const variants = {
        Present: "success",
        Late: "warning",
        Absent: "destructive",
        "On Leave": "info",
        Remote: "secondary",
      };
      return (
        <StatusLabel status={cell} variant={variants[cell] || "neutral"}>
          {cell || "Unknown"}
        </StatusLabel>
      );
    },
  },
  {
    dataField: "Remarks",
    text: "Remarks",
    dataSort: false,
    formatter: (cell) => (
      <span className="text-xs text-neutral-800">{cell || "-"}</span>
    ),
  },
];

// Monthly Attendance Report Columns
export const MonthlyAttendanceColumns = () => [
  {
    dataField: "EmployeeID",
    text: "Employee ID",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "Name",
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
    dataField: "TotalDays",
    text: "Total Days",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-plum-900">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "Presents",
    text: "Presents",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-green-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "Absents",
    text: "Absents",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-red-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "Lates",
    text: "Lates",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-yellow-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "EarlyExits",
    text: "Early Exits",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-orange-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "OvertimeHrs",
    text: "Overtime Hours",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-blue-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "Remarks",
    text: "Remarks",
    dataSort: false,
    formatter: (cell) => (
      <Badge variant="outline" className="text-xs">
        {cell || "N/A"}
      </Badge>
    ),
  },
];

// Yearly Attendance Report Columns
export const YearlyAttendanceColumns = () => [
  {
    dataField: "EmployeeID",
    text: "Employee ID",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
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
    dataField: "Department",
    text: "Department",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "Year",
    text: "Year",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-bold text-plum-900">{cell || "N/A"}</span>
      </div>
    ),
  },
  {
    dataField: "WorkingDays",
    text: "Working Days",
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
    dataField: "PresentDays",
    text: "Present Days",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-green-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "Absents",
    text: "Absents",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-red-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "OnLeave",
    text: "On Leave",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-yellow-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "RemoteDays",
    text: "Remote Days",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-blue-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "AttendancePercentage",
    text: "Attendance %",
    dataSort: true,
    formatter: (cell) => {
      const percentage = parseFloat(cell?.replace("%", "") || 0);
      const color =
        percentage >= 95
          ? "text-green-600"
          : percentage >= 85
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

// ============================================================================
// ATTENDANCE ISSUES & EXCEPTIONS COLUMNS
// ============================================================================

// Absenteeism Report Columns
export const AbsenteeismReportColumns = () => [
  {
    dataField: "Employee",
    text: "Employee Name",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "Department",
    text: "Department",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "Period",
    text: "Period",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="outline" className="text-xs">
        {cell || "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "Year",
    text: "Year",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-bold text-plum-900">{cell || "N/A"}</span>
      </div>
    ),
  },
  {
    dataField: "Absents",
    text: "Absents",
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
    dataField: "ReasonTrend",
    text: "Reason Trend",
    dataSort: false,
    formatter: (cell) => (
      <span className="text-xs text-neutral-800">
        {cell || "No specific reason"}
      </span>
    ),
  },
];

// Late Arrival Report Columns
export const LateArrivalReportColumns = () => [
  {
    dataField: "Employee",
    text: "Employee Name",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "Month",
    text: "Month",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="outline" className="text-xs">
        {cell || "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "Lates",
    text: "Lates Count",
    dataSort: true,
    formatter: (cell) => {
      const count = parseInt(cell) || 0;
      const color =
        count > 10
          ? "text-red-600"
          : count > 5
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
    dataField: "TotalLateHours",
    text: "Total Late Hours",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-orange-600">
          {cell || "0.0 hrs"}
        </span>
      </div>
    ),
  },
  {
    dataField: "Pattern",
    text: "Pattern",
    dataSort: false,
    formatter: (cell) => (
      <span className="text-xs text-neutral-800">{cell || "No pattern"}</span>
    ),
  },
];

// Early Departure Report Columns
export const EarlyDepartureReportColumns = () => [
  {
    dataField: "Employee",
    text: "Employee Name",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "Month",
    text: "Month",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="outline" className="text-xs">
        {cell || "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "EarlyExits",
    text: "Early Exits",
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
    dataField: "TimeLost",
    text: "Time Lost (hrs)",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-orange-600">
          {cell || "0.0"}
        </span>
      </div>
    ),
  },
  {
    dataField: "Reason",
    text: "Reason",
    dataSort: false,
    formatter: (cell) => (
      <span className="text-xs text-neutral-800">
        {cell || "No reason specified"}
      </span>
    ),
  },
];

// No Punch Report Columns
export const NoPunchReportColumns = () => [
  {
    dataField: "Employee",
    text: "Employee Name",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "Department",
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
    dataField: "DatesMissing",
    text: "Missing Punch Type",
    dataSort: true,
    formatter: (cell) => {
      const variants = {
        "Check-in": "warning",
        "Check-out": "destructive",
        "Both Missing": "error",
      };
      return (
        <StatusLabel status={cell} variant={variants[cell] || "neutral"}>
          {cell || "Unknown"}
        </StatusLabel>
      );
    },
  },
  {
    dataField: "Remarks",
    text: "Remarks",
    dataSort: false,
    formatter: (cell) => (
      <span className="text-xs text-neutral-800">{cell || "-"}</span>
    ),
  },
];

// ============================================================================
// TIME MANAGEMENT REPORT COLUMNS
// ============================================================================

// Overtime Report Columns
export const OvertimeReportColumns = () => [
  {
    dataField: "Employee",
    text: "Employee Name",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "Department",
    text: "Department",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "OvertimeHours",
    text: "Overtime Hours",
    dataSort: true,
    formatter: (cell) => {
      const hours = parseFloat(cell) || 0;
      const color =
        hours > 20
          ? "text-red-600"
          : hours > 10
          ? "text-yellow-600"
          : "text-green-600";

      return (
        <div className="text-center">
          <span className={`text-lg font-bold ${color}`}>{hours}</span>
        </div>
      );
    },
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
  {
    dataField: "DateRange",
    text: "Date Range",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="outline" className="text-xs">
        {cell || "N/A"}
      </Badge>
    ),
  },
];

// Idle/Undertime Report Columns
export const IdleUndertimeReportColumns = () => [
  {
    dataField: "Employee",
    text: "Employee Name",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "Period",
    text: "Period",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="outline" className="text-xs">
        {cell || "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "ExpectedHours",
    text: "Expected Hours",
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
    dataField: "WorkedHours",
    text: "Worked Hours",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-blue-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "Shortfall",
    text: "Shortfall",
    dataSort: true,
    formatter: (cell) => {
      const shortfall = parseInt(cell) || 0;
      const color =
        shortfall > 40
          ? "text-red-600"
          : shortfall > 20
          ? "text-yellow-600"
          : "text-green-600";

      return (
        <div className="text-center">
          <span className={`text-lg font-bold ${color}`}>{shortfall}</span>
        </div>
      );
    },
  },
  {
    dataField: "Remarks",
    text: "Remarks",
    dataSort: false,
    formatter: (cell) => (
      <Badge variant="outline" className="text-xs">
        {cell || "N/A"}
      </Badge>
    ),
  },
];

// Attendance vs Leave Report Columns
export const AttendanceVsLeaveReportColumns = () => [
  {
    dataField: "Employee",
    text: "Employee Name",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "Department",
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
    dataField: "LeaveType",
    text: "Leave Type",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="secondary" className="text-xs">
        {cell || "None"}
      </Badge>
    ),
  },
  {
    dataField: "AttendanceStatus",
    text: "Attendance Status",
    dataSort: true,
    formatter: (cell) => {
      const variants = {
        Present: "success",
        Late: "warning",
        Absent: "destructive",
      };
      return (
        <StatusLabel status={cell} variant={variants[cell] || "neutral"}>
          {cell || "Unknown"}
        </StatusLabel>
      );
    },
  },
  {
    dataField: "Conflict",
    text: "Conflict",
    dataSort: true,
    formatter: (cell) => {
      const isConflict = cell === "Yes";
      return (
        <div className="text-center">
          <span
            className={`text-lg font-bold ${
              isConflict ? "text-red-600" : "text-green-600"
            }`}
          >
            {isConflict ? "⚠️ Yes" : "✅ No"}
          </span>
        </div>
      );
    },
  },
];

// ============================================================================
// SHIFT MANAGEMENT REPORT COLUMNS
// ============================================================================

// Shift Allocation Report Columns
export const ShiftAllocationReportColumns = () => [
  {
    dataField: "Employee_ID",
    text: "Employee ID",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "Name",
    text: "Employee Name",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "Department",
    text: "Department",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "Mon",
    text: "Mon",
    dataSort: false,
    formatter: (cell) => (
      <Badge variant={cell === "M" ? "info" : "secondary"} className="text-xs">
        {cell || "-"}
      </Badge>
    ),
  },
  {
    dataField: "Tue",
    text: "Tue",
    dataSort: false,
    formatter: (cell) => (
      <Badge variant={cell === "M" ? "info" : "secondary"} className="text-xs">
        {cell || "-"}
      </Badge>
    ),
  },
  {
    dataField: "Wed",
    text: "Wed",
    dataSort: false,
    formatter: (cell) => (
      <Badge variant={cell === "M" ? "info" : "secondary"} className="text-xs">
        {cell || "-"}
      </Badge>
    ),
  },
  {
    dataField: "Thu",
    text: "Thu",
    dataSort: false,
    formatter: (cell) => (
      <Badge variant={cell === "M" ? "info" : "secondary"} className="text-xs">
        {cell || "-"}
      </Badge>
    ),
  },
  {
    dataField: "Fri",
    text: "Fri",
    dataSort: false,
    formatter: (cell) => (
      <Badge variant={cell === "M" ? "info" : "secondary"} className="text-xs">
        {cell || "-"}
      </Badge>
    ),
  },
  {
    dataField: "Sat",
    text: "Sat",
    dataSort: false,
    formatter: (cell) => (
      <Badge variant="outline" className="text-xs">
        {cell || "-"}
      </Badge>
    ),
  },
  {
    dataField: "Sun",
    text: "Sun",
    dataSort: false,
    formatter: (cell) => (
      <Badge variant="outline" className="text-xs">
        {cell || "-"}
      </Badge>
    ),
  },
];

// Shift vs Actual Attendance Columns
export const ShiftVsActualAttendanceColumns = () => [
  {
    dataField: "Employee",
    text: "Employee Name",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
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
    dataField: "Planned_Shift",
    text: "Planned Shift",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="secondary" className="text-xs">
        {cell || "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "Scheduled_Time",
    text: "Scheduled Time",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-xs text-neutral-800">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "Actual_In",
    text: "Actual In",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-green-600">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "Actual_Out",
    text: "Actual Out",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-red-600">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "Compliance",
    text: "Compliance",
    dataSort: true,
    formatter: (cell) => {
      const isCompliant = cell === "Yes";
      return (
        <StatusLabel
          status={cell}
          variant={isCompliant ? "success" : "destructive"}
        >
          {isCompliant ? "✅ Yes" : "❌ No"}
        </StatusLabel>
      );
    },
  },
  {
    dataField: "Status",
    text: "Status",
    dataSort: true,
    formatter: (cell) => {
      const variants = {
        Present: "success",
        Late: "warning",
        Absent: "destructive",
      };
      return (
        <StatusLabel status={cell} variant={variants[cell] || "neutral"}>
          {cell || "Unknown"}
        </StatusLabel>
      );
    },
  },
  {
    dataField: "Remarks",
    text: "Remarks",
    dataSort: false,
    formatter: (cell) => (
      <span className="text-xs text-neutral-800">{cell || "-"}</span>
    ),
  },
];

// Shift Compliance Report Columns
export const ShiftComplianceReportColumns = () => [
  {
    dataField: "Employee",
    text: "Employee Name",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "Department",
    text: "Department",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "Assigned_Shifts",
    text: "Assigned Shifts",
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
    dataField: "Deviations",
    text: "Deviations",
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
    dataField: "Compliance_Rate",
    text: "Compliance Rate",
    dataSort: true,
    formatter: (cell) => {
      const rate = parseFloat(cell?.replace("%", "") || 0);
      const color =
        rate >= 95
          ? "text-green-600"
          : rate >= 80
          ? "text-yellow-600"
          : "text-red-600";

      return (
        <div className="text-center">
          <span className={`text-lg font-bold ${color}`}>{cell || "0%"}</span>
        </div>
      );
    },
  },
  {
    dataField: "Remarks",
    text: "Remarks",
    dataSort: false,
    formatter: (cell) => (
      <Badge variant="outline" className="text-xs">
        {cell || "N/A"}
      </Badge>
    ),
  },
];

// Shift Coverage Report Columns (reuses ShiftComplianceReportColumns structure)
export const ShiftCoverageReportColumns = () => ShiftComplianceReportColumns();

// Shift Swapping Report Columns
export const ShiftSwappingReportColumns = () => [
  {
    dataField: "Request_ID",
    text: "Request ID",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-blue-600">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "Requested_By",
    text: "Requested By",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
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
    dataField: "Swap_Details",
    text: "Swap Details",
    dataSort: false,
    formatter: (cell) => (
      <span className="text-xs text-neutral-800">{cell || "N/A"}</span>
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
  {
    dataField: "Requested_Date",
    text: "Requested Date",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="outline" className="text-xs">
        {cell || "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "Reviewed_By",
    text: "Reviewed By",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000">{cell || "Pending"}</span>
    ),
  },
  {
    dataField: "Remarks",
    text: "Remarks",
    dataSort: false,
    formatter: (cell) => (
      <span className="text-xs text-neutral-800">{cell || "-"}</span>
    ),
  },
];

// Weekly Shift Calendar Columns
export const WeeklyShiftCalendarColumns = () => [
  {
    dataField: "Day",
    text: "Day",
    dataSort: false,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "Date",
    text: "Date",
    dataSort: false,
    formatter: (cell) => (
      <Badge variant="outline" className="text-xs">
        {cell || "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "Morning_09_18",
    text: "Morning (09-18)",
    dataSort: false,
    formatter: (cell) => (
      <Badge variant={cell !== "-" ? "info" : "outline"} className="text-xs">
        {cell || "-"}
      </Badge>
    ),
  },
  {
    dataField: "Evening_14_23",
    text: "Evening (14-23)",
    dataSort: false,
    formatter: (cell) => (
      <Badge variant={cell !== "-" ? "warning" : "outline"} className="text-xs">
        {cell || "-"}
      </Badge>
    ),
  },
  {
    dataField: "Night_22_07",
    text: "Night (22-07)",
    dataSort: false,
    formatter: (cell) => (
      <Badge
        variant={cell !== "-" ? "secondary" : "outline"}
        className="text-xs"
      >
        {cell || "-"}
      </Badge>
    ),
  },
  {
    dataField: "Total_Staff",
    text: "Total Staff",
    dataSort: false,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-plum-900">{cell || 0}</span>
      </div>
    ),
  },
];

// Holiday Special Shift Report Columns
export const HolidaySpecialShiftReportColumns = () => [
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
    dataField: "Holiday/Special",
    text: "Holiday/Special",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="warning" className="text-xs">
        {cell || "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "Assigned_Staff",
    text: "Assigned Staff",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "Remarks",
    text: "Remarks",
    dataSort: false,
    formatter: (cell) => (
      <span className="text-xs text-neutral-800">{cell || "-"}</span>
    ),
  },
];

// Weekend Work Report Columns
export const WeekendWorkReportColumns = () => [
  {
    dataField: "Employee",
    text: "Employee Name",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "Weekend Dates Worked",
    text: "Weekend Dates Worked",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant={cell !== "-" ? "info" : "outline"} className="text-xs">
        {cell || "-"}
      </Badge>
    ),
  },
  {
    dataField: "Hours",
    text: "Hours",
    dataSort: true,
    formatter: (cell) => {
      const hours = parseInt(cell) || 0;
      const color =
        hours > 16
          ? "text-red-600"
          : hours > 8
          ? "text-yellow-600"
          : "text-green-600";

      return (
        <div className="text-center">
          <span className={`text-lg font-medium ${color}`}>{hours}</span>
        </div>
      );
    },
  },
  {
    dataField: "Reason",
    text: "Reason",
    dataSort: false,
    formatter: (cell) => (
      <span className="text-xs text-neutral-800">{cell || "-"}</span>
    ),
  },
];
