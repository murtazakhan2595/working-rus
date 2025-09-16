import React from "react";
import { Badge } from "components/ui/badge";
import { StatusLabel } from "components";
import { renderDate } from "utils/renderValues";

// Transfer Report Columns
export const TransferReportColumns = () => [
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
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "current_department",
    text: "Current Department",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "new_department",
    text: "New Department",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "transfer_type",
    text: "Transfer Type",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant={cell === "Internal" ? "info" : "warning"}>
        {cell || "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "transfer_request_date",
    text: "Request Date",
    dataSort: true,
    formatter: (cell) => renderDate(cell),
  },
  {
    dataField: "effective_date",
    text: "Effective Date",
    dataSort: true,
    formatter: (cell) => renderDate(cell),
  },
  {
    dataField: "status",
    text: "Status",
    dataSort: true,
    formatter: (cell) => (
      <StatusLabel
        status={cell}
        variant={
          cell === "Approved"
            ? "success"
            : cell === "Pending"
            ? "warning"
            : cell === "Rejected"
            ? "error"
            : "neutral"
        }
      >
        {cell || "Unknown"}
      </StatusLabel>
    ),
  },
];

// Job Rotation History Columns
export const JobRotationHistoryColumns = () => [
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
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "department_history",
    text: "Department History",
    dataSort: false,
    formatter: (cell) => (
      <div className="max-w-xs">
        <span className="text-sm text-neutral-1000">{cell || "N/A"}</span>
      </div>
    ),
  },
  {
    dataField: "designation_history",
    text: "Designation History",
    dataSort: false,
    formatter: (cell) => (
      <div className="max-w-xs">
        <span className="text-sm text-neutral-1000">{cell || "N/A"}</span>
      </div>
    ),
  },
  {
    dataField: "rotation_date",
    text: "Rotation Date",
    dataSort: true,
    formatter: (cell) => renderDate(cell),
  },
  {
    dataField: "duration_in_previous_role",
    text: "Duration in Previous Role",
    dataSort: false,
    formatter: (cell) => (
      <Badge variant="outline" className="text-xs">
        {cell || "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "reason_for_rotation",
    text: "Reason",
    dataSort: true,
    formatter: (cell) => {
      const variants = {
        promotion: "success",
        "skill development": "info",
        "operational need": "warning",
        string: "secondary",
      };
      return (
        <Badge variant={variants[cell?.toLowerCase()] || "secondary"}>
          {cell || "N/A"}
        </Badge>
      );
    },
  },
];

// Pending Transfer Approvals Columns
export const PendingTransferApprovalsColumns = () => [
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
    dataField: "transfer_type",
    text: "Transfer Type",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant={cell === "INTERNAL" ? "info" : "warning"}>
        {cell || "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "request_date",
    text: "Request Date",
    dataSort: true,
    formatter: (cell) => renderDate(cell),
  },
  {
    dataField: "requested_by",
    text: "Requested By",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "approver",
    text: "Approver",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "status",
    text: "Status",
    dataSort: true,
    formatter: (cell) => (
      <StatusLabel status={cell} variant="warning">
        {cell || "Unknown"}
      </StatusLabel>
    ),
  },
];

// Transfer Cost Impact Columns
export const TransferCostImpactColumns = () => [
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
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "transfer_type",
    text: "Transfer Type",
    dataSort: true,
    formatter: (cell) => (
      <Badge
        variant={
          cell === "INTERNAL"
            ? "info"
            : cell === "EXTERNAL"
            ? "warning"
            : "secondary"
        }
      >
        {cell || "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "relocation_cost",
    text: "Relocation Cost",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-neutral-1200">
          ${cell || 0}
        </span>
      </div>
    ),
  },
  {
    dataField: "training_cost",
    text: "Training Cost",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-neutral-1200">
          ${cell || 0}
        </span>
      </div>
    ),
  },
  {
    dataField: "onboarding_cost",
    text: "Onboarding Cost",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-neutral-1200">
          ${cell || 0}
        </span>
      </div>
    ),
  },
  {
    dataField: "total_cost",
    text: "Total Cost",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-semibold text-plum-900">
          ${cell || 0}
        </span>
      </div>
    ),
  },
  {
    dataField: "notes",
    text: "Notes",
    dataSort: false,
    formatter: (cell) => (
      <div className="max-w-xs">
        <span className="text-sm text-neutral-1000">{cell || "N/A"}</span>
      </div>
    ),
  },
];

// Rotation Compliance Columns
export const RotationComplianceColumns = () => [
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
    dataField: "rotation_date",
    text: "Rotation Date",
    dataSort: true,
    formatter: (cell) => renderDate(cell),
  },
  {
    dataField: "last_rotation_date",
    text: "Last Rotation Date",
    dataSort: true,
    formatter: (cell) => renderDate(cell),
  },
  {
    dataField: "rotation_interval_months",
    text: "Rotation Interval",
    dataSort: false,
    formatter: (cell) => (
      <Badge variant="outline" className="text-xs">
        {cell || "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "compliance_status",
    text: "Compliance Status",
    dataSort: true,
    formatter: (cell) => (
      <StatusLabel
        status={cell}
        variant={
          cell === "Compliant"
            ? "success"
            : cell === "Non-Compliant"
            ? "error"
            : cell === "Overdue"
            ? "error"
            : "neutral"
        }
      >
        {cell || "Unknown"}
      </StatusLabel>
    ),
  },
  {
    dataField: "notes",
    text: "Notes",
    dataSort: false,
    formatter: (cell) => (
      <div className="max-w-xs">
        <span className="text-sm text-neutral-1000">{cell || "N/A"}</span>
      </div>
    ),
  },
];

// Transfer Rejection Columns
export const TransferRejectionColumns = () => [
  {
    dataField: "employee_id",
    text: "Employee ID",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
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
    dataField: "requested_role",
    text: "Requested Role",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="outline" className="text-xs">
        {cell || "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "transfer_type",
    text: "Transfer Type",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant={cell === "INTERNAL" ? "info" : "warning"}>
        {cell || "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "request_date",
    text: "Request Date",
    dataSort: true,
    formatter: (cell) => renderDate(cell),
  },
  {
    dataField: "rejection_date",
    text: "Rejection Date",
    dataSort: true,
    formatter: (cell) => renderDate(cell),
  },
  {
    dataField: "reason_for_rejection",
    text: "Rejection Reason",
    dataSort: true,
    formatter: (cell) => <Badge variant="destructive">{cell || "N/A"}</Badge>,
  },
  {
    dataField: "manager_hr_comments",
    text: "Comments",
    dataSort: false,
    formatter: (cell) => (
      <div className="max-w-xs">
        <span className="text-sm text-neutral-1000">{cell || "N/A"}</span>
      </div>
    ),
  },
];

// Rotation Skill Gap Columns
export const RotationSkillGapColumns = () => [
  {
    dataField: "employee_id",
    text: "Employee ID",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
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
    dataField: "current_role",
    text: "Current Role",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="outline" className="text-xs">
        {cell || "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "rotated_role",
    text: "Rotated Role",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="outline" className="text-xs">
        {cell || "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "required_skills",
    text: "Required Skills",
    dataSort: false,
    formatter: (cell) => (
      <div className="max-w-xs">
        <span className="text-sm text-neutral-1000">{cell || "N/A"}</span>
      </div>
    ),
  },
  {
    dataField: "employee_skills",
    text: "Employee Skills",
    dataSort: false,
    formatter: (cell) => (
      <div className="max-w-xs">
        <span className="text-sm text-neutral-1000">{cell || "N/A"}</span>
      </div>
    ),
  },
  {
    dataField: "skill_gap",
    text: "Skill Gap",
    dataSort: true,
    formatter: (cell) => (
      <StatusLabel
        status={cell}
        variant={cell === "No" ? "success" : "warning"}
      >
        {cell === "No" ? "No Gap" : "Gap Exists"}
      </StatusLabel>
    ),
  },
  {
    dataField: "training_required",
    text: "Training Required",
    dataSort: true,
    formatter: (cell) => (
      <StatusLabel
        status={cell}
        variant={cell === "not_required" ? "success" : "warning"}
      >
        {cell === "not_required" ? "Not Required" : "Required"}
      </StatusLabel>
    ),
  },
];

// Employee Rotation Frequency Columns
export const EmployeeRotationFrequencyColumns = () => [
  {
    dataField: "employee_id",
    text: "Employee ID",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
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
    dataField: "total_rotations",
    text: "Total Rotations",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-semibold text-plum-900">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "last_rotation_date",
    text: "Last Rotation Date",
    dataSort: true,
    formatter: (cell) => renderDate(cell),
  },
  {
    dataField: "next_rotation_planned",
    text: "Next Rotation Planned",
    dataSort: true,
    formatter: (cell) => renderDate(cell),
  },
];

// Transfer Approval Timeline Columns
export const TransferApprovalTimelineColumns = () => [
  {
    dataField: "employee_id",
    text: "Employee ID",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
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
    dataField: "requested_role",
    text: "Requested Role",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="outline" className="text-xs">
        {cell || "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "transfer_type",
    text: "Transfer Type",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant={cell === "INTERNAL" ? "info" : "warning"}>
        {cell || "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "request_date",
    text: "Request Date",
    dataSort: true,
    formatter: (cell) => renderDate(cell),
  },
  {
    dataField: "approval_date",
    text: "Approval Date",
    dataSort: true,
    formatter: (cell) => renderDate(cell),
  },
  {
    dataField: "total_days_for_approval",
    text: "Approval Days",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <Badge
          variant={
            cell > 30 ? "destructive" : cell > 15 ? "warning" : "success"
          }
        >
          {cell || "N/A"} days
        </Badge>
      </div>
    ),
  },
];

// Cross Department Transfer Columns
export const CrossDepartmentTransferColumns = () => [
  {
    dataField: "month",
    text: "Month",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "from_department",
    text: "From Department",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "to_department",
    text: "To Department",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "total_transfers",
    text: "Total Transfers",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-semibold text-plum-900">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "percentage_of_department",
    text: "Percentage of Department",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <Badge variant="info">{cell || "0%"}</Badge>
      </div>
    ),
  },
];
