import React from "react";
import { Badge } from "components/ui/badge";
import { StatusLabel } from "components";
import { renderDate } from "utils/renderValues";
import moment from "moment";

// ============================================================================
// 4️⃣ ATTENDANCE UPDATES & AUDIT REPORTS COLUMNS
// ============================================================================

// Updated Attendance Report Columns
export const UpdatedAttendanceColumns = () => [
  {
    dataField: "employee_id",
    text: "Employee ID",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-blue-600">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "employee_name",
    text: "Employee Name",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "original_in",
    text: "Original In",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="outline" className="text-xs">
        {cell ? moment(cell).format("HH:mm A") : "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "updated_in",
    text: "Updated In",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="default" className="text-xs">
        {cell ? moment(cell).format("HH:mm A") : "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "original_out",
    text: "Original Out",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="outline" className="text-xs">
        {cell ? moment(cell).format("HH:mm A") : "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "updated_out",
    text: "Updated Out",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="default" className="text-xs">
        {cell ? moment(cell).format("HH:mm A") : "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "updated_by",
    text: "Updated By",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1100">{cell || "System"}</span>
    ),
  },
  {
    dataField: "update_date",
    text: "Update Date",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-xs text-neutral-1100">
        {cell ? moment(cell).format("DD-MMM-YY HH:mm A") : "N/A"}
      </span>
    ),
  },
];

// HR/Admin Correction Report Columns
export const HRAdminCorrectionColumns = () => [
  {
    dataField: "employee_id",
    text: "Employee ID",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-blue-600">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "employee_name",
    text: "Employee Name",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "date",
    text: "Date",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="outline" className="text-xs">
        {cell ? moment(cell).format("DD-MMM-YY") : "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "field_changed",
    text: "Field Changed",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm font-medium text-purple-700">
        {cell || "N/A"}
      </span>
    ),
  },
  {
    dataField: "old_value",
    text: "Old Value",
    dataSort: false,
    formatter: (cell) => (
      <span className="text-xs text-red-600 line-through">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "new_value",
    text: "New Value",
    dataSort: false,
    formatter: (cell) => (
      <span className="text-xs text-green-600 font-medium">
        {cell || "N/A"}
      </span>
    ),
  },
  {
    dataField: "changed_by",
    text: "Changed By",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1100">{cell || "System"}</span>
    ),
  },
];

// Audit Trail Report Columns
export const AuditTrailColumns = () => [
  {
    dataField: "change_id",
    text: "Change ID",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-blue-600">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "employee_id",
    text: "Employee ID",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1100">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "employee_name",
    text: "Employee Name",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "action",
    text: "Action",
    dataSort: true,
    formatter: (cell) => {
      const variants = {
        Update: "warning",
        Delete: "destructive",
        Create: "success",
      };
      return (
        <StatusLabel status={cell} variant={variants[cell] || "neutral"}>
          {cell || "Unknown"}
        </StatusLabel>
      );
    },
  },
  {
    dataField: "field_affected",
    text: "Field Affected",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm font-medium text-purple-700">
        {cell || "N/A"}
      </span>
    ),
  },
  {
    dataField: "old_value",
    text: "Old Value",
    dataSort: false,
    formatter: (cell) => (
      <span className="text-xs text-red-600">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "new_value",
    text: "New Value",
    dataSort: false,
    formatter: (cell) => (
      <span className="text-xs text-green-600">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "performed_by",
    text: "Performed By",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1100">{cell || "System"}</span>
    ),
  },
  {
    dataField: "timestamp",
    text: "Timestamp",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-xs text-neutral-1100">
        {cell ? moment(cell).format("DD-MMM-YY HH:mm A") : "N/A"}
      </span>
    ),
  },
];

// Compliance Breach Report Columns
export const ComplianceBreachColumns = () => [
  {
    dataField: "breach_id",
    text: "Breach ID",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-red-600">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "employee_id",
    text: "Employee ID",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1100">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "employee_name",
    text: "Employee Name",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "date",
    text: "Date",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="outline" className="text-xs">
        {cell ? moment(cell).format("DD-MMM-YY") : "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "breach_type",
    text: "Breach Type",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="destructive" className="text-xs">
        {cell || "Unknown"}
      </Badge>
    ),
  },
  {
    dataField: "changed_by",
    text: "Changed By",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1100">{cell || "System"}</span>
    ),
  },
  {
    dataField: "timestamp",
    text: "Timestamp",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-xs text-neutral-1100">
        {cell ? moment(cell).format("DD-MMM-YY HH:mm A") : "N/A"}
      </span>
    ),
  },
  {
    dataField: "status",
    text: "Status",
    dataSort: true,
    formatter: (cell) => {
      const variants = {
        Approved: "success",
        UPDATED: "warning",
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

// Attendance Update History Columns
export const AttendanceUpdateHistoryColumns = () => [
  {
    dataField: "change_id",
    text: "Change ID",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-blue-600">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "employee_id",
    text: "Employee ID",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1100">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "employee_name",
    text: "Employee Name",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "date",
    text: "Date",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="outline" className="text-xs">
        {cell ? moment(cell).format("DD-MMM-YY") : "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "version_no",
    text: "Version",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="secondary" className="text-xs font-bold">
        {cell || "V1"}
      </Badge>
    ),
  },
  {
    dataField: "in_time",
    text: "In Time",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-xs text-green-600">
        {cell ? moment(cell).format("HH:mm A") : "N/A"}
      </span>
    ),
  },
  {
    dataField: "out_time",
    text: "Out Time",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-xs text-red-600">
        {cell ? moment(cell).format("HH:mm A") : "N/A"}
      </span>
    ),
  },
  {
    dataField: "modified_by",
    text: "Modified By",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1100">{cell || "System"}</span>
    ),
  },
  {
    dataField: "modified_on",
    text: "Modified On",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-xs text-neutral-1100">
        {cell ? moment(cell).format("DD-MMM-YY HH:mm A") : "N/A"}
      </span>
    ),
  },
];

// ============================================================================
// 5️⃣ EXCEPTION & SPECIAL CONDITION REPORTS COLUMNS
// ============================================================================

// Missing Punch Report Columns
export const MissingPunchColumns = () => [
  {
    dataField: "employee_id",
    text: "Employee ID",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-blue-600">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "employee_name",
    text: "Employee Name",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "date",
    text: "Date",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="outline" className="text-xs">
        {cell ? moment(cell).format("DD-MMM-YY") : "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "missing_punch_type",
    text: "Missing Punch Type",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="destructive" className="text-xs">
        {cell || "Unknown"}
      </Badge>
    ),
  },
  {
    dataField: "recorded_punches",
    text: "Recorded Punches",
    dataSort: false,
    formatter: (cell) => (
      <div className="text-xs">
        {cell?.checkin && (
          <div className="text-green-600">
            In: {moment(cell.checkin).format("HH:mm A")}
          </div>
        )}
        {cell?.checkout && (
          <div className="text-red-600">
            Out: {moment(cell.checkout).format("HH:mm A")}
          </div>
        )}
        {!cell?.checkin && !cell?.checkout && (
          <span className="text-gray-500">No punches</span>
        )}
      </div>
    ),
  },
  {
    dataField: "status",
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
];

// Multiple Punch Report Columns
export const MultiplePunchColumns = () => [
  {
    dataField: "user_no",
    text: "User No",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-blue-600">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "date",
    text: "Date",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="outline" className="text-xs">
        {cell ? moment(cell).format("DD-MMM-YY") : "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "total_punches",
    text: "Total Punches",
    dataSort: true,
    formatter: (cell) => {
      const count = parseInt(cell) || 0;
      const color =
        count > 4
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
];

// Half Day Report Columns
export const HalfDayColumns = () => [
  {
    dataField: "employee_id",
    text: "Employee ID",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-blue-600">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "employee_name",
    text: "Employee Name",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "date",
    text: "Date",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="outline" className="text-xs">
        {cell ? moment(cell).format("DD-MMM-YY") : "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "expected_hours",
    text: "Expected Hours",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-blue-600">{cell || 0}h</span>
      </div>
    ),
  },
  {
    dataField: "actual_hours",
    text: "Actual Hours",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-green-600">{cell || 0}h</span>
      </div>
    ),
  },
  {
    dataField: "status",
    text: "Status",
    dataSort: true,
    formatter: (cell) => {
      const variants = {
        Present: "success",
        Late: "warning",
        Approved: "success",
        Unapproved: "destructive",
      };
      return (
        <StatusLabel status={cell} variant={variants[cell] || "neutral"}>
          {cell || "Unknown"}
        </StatusLabel>
      );
    },
  },
  {
    dataField: "reason",
    text: "Reason",
    dataSort: false,
    formatter: (cell) => (
      <span className="text-xs text-neutral-1100">{cell || "No reason"}</span>
    ),
  },
];

// Grace Period Usage Report Columns
export const GracePeriodUsageColumns = () => [
  {
    dataField: "employee_id",
    text: "Employee ID",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-blue-600">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "employee_name",
    text: "Employee Name",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "date",
    text: "Date",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="outline" className="text-xs">
        {cell ? moment(cell).format("DD-MMM-YY") : "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "shift_start",
    text: "Shift Start",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-xs text-blue-600">
        {cell ? moment(cell).format("HH:mm A") : "N/A"}
      </span>
    ),
  },
  {
    dataField: "in_time",
    text: "In Time",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-xs text-green-600">
        {cell ? moment(cell).format("HH:mm A") : "N/A"}
      </span>
    ),
  },
  {
    dataField: "grace_period",
    text: "Grace Period",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-xs text-neutral-1100">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "used_grace",
    text: "Used Grace",
    dataSort: true,
    formatter: (cell) => {
      return cell ? (
        <Badge variant="warning" className="text-xs">
          Yes
        </Badge>
      ) : (
        <Badge variant="success" className="text-xs">
          No
        </Badge>
      );
    },
  },
  {
    dataField: "frequency_this_month",
    text: "Monthly Frequency",
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
];

// Frequent Breaks Report Columns
export const FrequentBreaksColumns = () => [
  {
    dataField: "employee_id",
    text: "Employee ID",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-blue-600">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "date",
    text: "Date",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="outline" className="text-xs">
        {cell ? moment(cell).format("DD-MMM-YY") : "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "breaks_taken",
    text: "Breaks Taken",
    dataSort: true,
    formatter: (cell) => {
      const count = parseInt(cell) || 0;
      const color =
        count > 5
          ? "text-red-600"
          : count > 3
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
    dataField: "total_break_duration",
    text: "Total Duration (hrs)",
    dataSort: true,
    formatter: (cell) => {
      const duration = parseFloat(cell) || 0;
      const color =
        duration > 2
          ? "text-red-600"
          : duration > 1
          ? "text-yellow-600"
          : "text-green-600";
      return (
        <div className="text-center">
          <span className={`text-lg font-bold ${color}`}>
            {duration.toFixed(2)}h
          </span>
        </div>
      );
    },
  },
];

// Remote Work Report Columns
export const RemoteWorkColumns = () => [
  {
    dataField: "employee_id",
    text: "Employee ID",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-blue-600">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "employee_name",
    text: "Employee Name",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "date",
    text: "Date",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="outline" className="text-xs">
        {cell ? moment(cell).format("DD-MMM-YY") : "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "punch_type",
    text: "Punch Type",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="secondary" className="text-xs">
        {cell || "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "location_logged",
    text: "Location",
    dataSort: false,
    formatter: (cell) => (
      <span className="text-xs text-neutral-1100">{cell || "Unknown"}</span>
    ),
  },
  {
    dataField: "geo_fence_compliance",
    text: "Geo-Fence",
    dataSort: true,
    formatter: (cell) => {
      return cell === "Yes" || cell === true ? (
        <Badge variant="success" className="text-xs">
          Compliant
        </Badge>
      ) : (
        <Badge variant="destructive" className="text-xs">
          Non-Compliant
        </Badge>
      );
    },
  },
  {
    dataField: "remarks",
    text: "Remarks",
    dataSort: false,
    formatter: (cell) => (
      <span className="text-xs text-neutral-1100">{cell || "N/A"}</span>
    ),
  },
];

// Business Trip Report Columns
export const BusinessTripColumns = () => [
  {
    dataField: "employee_id",
    text: "Employee ID",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-blue-600">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "employee_name",
    text: "Employee Name",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "date",
    text: "Date",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="outline" className="text-xs">
        {cell ? moment(cell).format("DD-MMM-YY") : "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "trip_location",
    text: "Trip Location",
    dataSort: false,
    formatter: (cell) => (
      <span className="text-sm font-medium text-purple-700">
        {cell || "N/A"}
      </span>
    ),
  },
  {
    dataField: "duration",
    text: "Duration",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="secondary" className="text-xs">
        {cell || "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "approved_by",
    text: "Approved By",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1100">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "status",
    text: "Status",
    dataSort: true,
    formatter: (cell) => {
      const variants = {
        Completed: "success",
        Ongoing: "warning",
        Planned: "secondary",
      };
      return (
        <StatusLabel status={cell} variant={variants[cell] || "neutral"}>
          {cell || "Unknown"}
        </StatusLabel>
      );
    },
  },
];

// ============================================================================
// 6️⃣ DEPARTMENT & MANAGERIAL REPORTS COLUMNS
// ============================================================================

// Department Attendance Report Columns
export const DepartmentAttendanceColumns = () => [
  {
    dataField: "department",
    text: "Department",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "total_employees",
    text: "Total Employees",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-blue-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "present",
    text: "Present",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-green-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "absent",
    text: "Absent",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-red-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "on_leave",
    text: "On Leave",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-yellow-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "attendance_percent",
    text: "Attendance %",
    dataSort: true,
    formatter: (cell) => {
      const percentage = parseFloat(cell) || 0;
      const color =
        percentage >= 90
          ? "text-green-600"
          : percentage >= 75
          ? "text-yellow-600"
          : "text-red-600";
      return (
        <div className="text-center">
          <span className={`text-lg font-bold ${color}`}>
            {percentage ? `${percentage.toFixed(1)}%` : "N/A"}
          </span>
        </div>
      );
    },
  },
];

// Team Attendance Report Columns
export const TeamAttendanceColumns = () => [
  {
    dataField: "team_name",
    text: "Team Name",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "total_members",
    text: "Total Members",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-blue-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "present",
    text: "Present",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-green-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "absent",
    text: "Absent",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-red-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "leave",
    text: "On Leave",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-yellow-600">{cell || 0}</span>
      </div>
    ),
  },
];

// Manager Attendance Report Columns
export const ManagerAttendanceColumns = () => [
  {
    dataField: "manager_name",
    text: "Manager Name",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "present",
    text: "Team Present",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-green-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "absent",
    text: "Team Absent",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-red-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "leave",
    text: "Team on Leave",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-yellow-600">{cell || 0}</span>
      </div>
    ),
  },
];

// Branch Attendance Report Columns
export const BranchAttendanceColumns = () => [
  {
    dataField: "branch",
    text: "Branch",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "total_employees",
    text: "Total Employees",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-blue-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "present",
    text: "Present",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-green-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "absent",
    text: "Absent",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-red-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "on_leave",
    text: "On Leave",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-yellow-600">{cell || 0}</span>
      </div>
    ),
  },
];

// Comparative Attendance Report Columns
export const ComparativeAttendanceColumns = () => [
  {
    dataField: "unit",
    text: "Unit",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "avg_attendance",
    text: "Avg Attendance %",
    dataSort: true,
    formatter: (cell) => {
      const percentage = parseFloat(cell) || 0;
      const color =
        percentage >= 90
          ? "text-green-600"
          : percentage >= 75
          ? "text-yellow-600"
          : "text-red-600";
      return (
        <div className="text-center">
          <span className={`text-lg font-bold ${color}`}>
            {percentage ? `${percentage.toFixed(1)}%` : "N/A"}
          </span>
        </div>
      );
    },
  },
  {
    dataField: "highest_attendance_day",
    text: "Best Day",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="success" className="text-xs">
        {cell ? moment(cell).format("DD-MMM-YY") : "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "lowest_attendance_day",
    text: "Worst Day",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant={cell ? "destructive" : "secondary"} className="text-xs">
        {cell ? moment(cell).format("DD-MMM-YY") : "N/A"}
      </Badge>
    ),
  },
];

// ============================================================================
// 7️⃣ ANALYTICS, TRENDS & COMPLIANCE REPORTS COLUMNS
// ============================================================================

// Attendance Trend Report Columns
export const AttendanceTrendColumns = () => [
  {
    dataField: "department",
    text: "Department",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "total_days",
    text: "Total Days",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-blue-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "present",
    text: "Present",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-green-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "absent",
    text: "Absent",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-red-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "late_arrivals",
    text: "Late Arrivals",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-yellow-600">{cell || 0}</span>
      </div>
    ),
  },
];

// Shift Utilization Report Columns
export const ShiftUtilizationColumns = () => [
  {
    dataField: "shift_name",
    text: "Shift Name",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "total_employees",
    text: "Total Employees",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-blue-600">{cell || 0}</span>
      </div>
    ),
  },
];

// Overtime Trend Report Columns
export const OvertimeTrendColumns = () => [
  {
    dataField: "department",
    text: "Department",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "total_ot_hours",
    text: "Total OT Hours",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-blue-600">{cell || 0}h</span>
      </div>
    ),
  },
  {
    dataField: "avg_ot_per_employee",
    text: "Avg OT/Employee",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-green-600">{cell || 0}h</span>
      </div>
    ),
  },
  {
    dataField: "exceeding_limit",
    text: "Exceeding Limit",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-bold text-red-600">{cell || 0}</span>
      </div>
    ),
  },
];

// Attrition Risk Report Columns
export const AttritionRiskColumns = () => [
  {
    dataField: "employee_id",
    text: "Employee ID",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-blue-600">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "employee_name",
    text: "Employee Name",
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
    dataField: "absent_days",
    text: "Absent Days (3M)",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-red-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "late_arrivals",
    text: "Late Arrivals",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-yellow-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "risk_level",
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
  {
    dataField: "remarks",
    text: "Remarks",
    dataSort: false,
    formatter: (cell) => (
      <span className="text-xs text-neutral-1100">{cell || "N/A"}</span>
    ),
  },
];

// Labor Law Compliance Report Columns
export const LaborLawComplianceColumns = () => [
  {
    dataField: "employee_id",
    text: "Employee ID",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-blue-600">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "employee_name",
    text: "Employee Name",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "total_hours",
    text: "Total Hours",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-blue-600">{cell || 0}h</span>
      </div>
    ),
  },
  {
    dataField: "overtime_hours",
    text: "Overtime Hours",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-yellow-600">
          {cell || 0}h
        </span>
      </div>
    ),
  },
  {
    dataField: "weekly_offs",
    text: "Weekly Offs",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-green-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "non_compliance",
    text: "Compliance",
    dataSort: true,
    formatter: (cell) => {
      return cell === null || cell === "No" || cell === false ? (
        <Badge variant="success" className="text-xs">
          Compliant
        </Badge>
      ) : (
        <Badge variant="destructive" className="text-xs">
          Non-Compliant
        </Badge>
      );
    },
  },
];

// Payroll Integration Report Columns
export const PayrollIntegrationColumns = () => [
  {
    dataField: "employee_id",
    text: "Employee ID",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-blue-600">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "employee_name",
    text: "Employee Name",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "total_days",
    text: "Total Days",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-blue-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "present",
    text: "Present",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-green-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "payable_days",
    text: "Payable Days",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-bold text-purple-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "leave_without_pay",
    text: "Leave Without Pay",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-red-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "adjustments",
    text: "Adjustments",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-yellow-600">{cell || 0}</span>
      </div>
    ),
  },
];

// Alerts Threshold Report Columns
export const AlertsThresholdColumns = () => [
  {
    dataField: "employee_id",
    text: "Employee ID",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-blue-600">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "employee_name",
    text: "Employee Name",
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
    dataField: "absenteeism",
    text: "Absenteeism",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-red-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "ot_limit",
    text: "OT Limit",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-yellow-600">
          {cell || 0}h
        </span>
      </div>
    ),
  },
  {
    dataField: "late_arrival",
    text: "Late Arrivals",
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
];
