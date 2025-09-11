import React from "react";
import { Badge } from "components/ui/badge";
import { StatusLabel, EmployeeOverview } from "components";
import { renderDate } from "utils/renderValues";
import { Progress } from "src/@/components/ui/progress";
import { DesignationName } from "utils/getValuesFromTables";
import { DepartmentName } from "utils/getValuesFromTables";

// New Hire Report Columns
export const NewHireColumns = () => [
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
          <DesignationName value={row.designation_id} />
        </div>
      </div>
    ),
  },
  {
    dataField: "department",
    text: "Department",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000">
        <DepartmentName value={cell} />
      </span>
    ),
  },
  {
    dataField: "joining_date",
    text: "Joining Date",
    dataSort: true,
    formatter: (cell) => renderDate(cell),
  },
  {
    dataField: "location",
    text: "Location",
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
      <StatusLabel status={cell}>{cell || "Unknown"}</StatusLabel>
    ),
  },
];

// Offer Letter Compliance Columns (Onboarding Status)
export const OfferLetterComplianceColumns = () => [
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
          {row.nationality || "N/A"}
        </div>
      </div>
    ),
  },
  {
    dataField: "offer_status",
    text: "Offer Status",
    dataSort: true,
    formatter: (cell) => {
      const variants = {
        Accepted: "success",
        Pending: "warning",
        Rejected: "destructive",
      };
      return (
        <StatusLabel status={cell} variant={variants[cell] || "neutral"}>
          {cell || "N/A"}
        </StatusLabel>
      );
    },
  },
  {
    dataField: "background_check",
    text: "Background Check",
    dataSort: true,
    formatter: (cell) => {
      const variants = {
        Completed: "success",
        Pending: "warning",
        Failed: "destructive",
      };
      return (
        <StatusLabel status={cell} variant={variants[cell] || "neutral"}>
          {cell || "N/A"}
        </StatusLabel>
      );
    },
  },
  {
    dataField: "medical_done",
    text: "Medical Check",
    dataSort: true,
    formatter: (cell) => {
      const variants = {
        Completed: "success",
        Pending: "warning",
        Failed: "destructive",
      };
      return (
        <StatusLabel status={cell} variant={variants[cell] || "neutral"}>
          {cell || "N/A"}
        </StatusLabel>
      );
    },
  },
  {
    dataField: "visa_processing",
    text: "Visa Processing",
    dataSort: true,
    formatter: (cell) => {
      // Handle N/A case specifically
      if (cell === "N/A" || !cell) {
        return (
          <StatusLabel variant="ghost" status="N/A">
            N/A
          </StatusLabel>
        );
      }

      const variants = {
        Completed: "success",
        "In Process": "warning",
        Pending: "warning",
      };

      return (
        <StatusLabel status={cell} variant={variants[cell] || "neutral"}>
          {cell}
        </StatusLabel>
      );
    },
  },
];

// Employee Creation TAT Columns
export const EmployeeCreationTATColumns = () => [
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
          <DepartmentName value={row.department} />
        </div>
      </div>
    ),
  },
  {
    dataField: "date_of_joining",
    text: "Date of Joining",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "employee_created_on_hrms",
    text: "HRMS Creation Date",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "tat_days",
    text: "TAT (Days)",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span
          className={`text-lg font-medium ${
            cell <= 3
              ? "text-green-600"
              : cell <= 7
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {cell || 0}
        </span>
      </div>
    ),
  },
  {
    dataField: "status",
    text: "Status",
    dataSort: true,
    formatter: (cell) => {
      const variants = {
        "On Time": "success",
        Delayed: "destructive",
      };
      return (
        <StatusLabel status={cell} variant={variants[cell] || "neutral"}>
          {cell || "Unknown"}
        </StatusLabel>
      );
    },
  },
];

// Offer Letter Report Columns
export const OfferLetterReportColumns = () => [
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
          <DesignationName value={row.designation_id} />
        </div>
      </div>
    ),
  },
  {
    dataField: "offer_date",
    text: "Offer Date",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000">
        {cell === "N/A" || !cell ? "N/A" : renderDate(cell)}
      </span>
    ),
  },
  {
    dataField: "status",
    text: "Status",
    dataSort: true,
    formatter: (cell) => {
      const variants = {
        Accepted: "success",
        Pending: "warning",
        Rejected: "destructive",
        Withdrawn: "outline",
      };
      return (
        <StatusLabel status={cell} variant={variants[cell] || "neutral"}>
          {cell || "Unknown"}
        </StatusLabel>
      );
    },
  },
  {
    dataField: "acceptance_date",
    text: "Acceptance Date",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000">
        {cell === "N/A" || !cell ? "N/A" : renderDate(cell)}
      </span>
    ),
  },
  {
    dataField: "remarks",
    text: "Remarks",
    dataSort: false,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000 max-w-xs">
        {cell === "—" || !cell ? "N/A" : cell}
      </span>
    ),
  },
];

// Pre-Onboarding Compliance Columns
export const PreOnboardingComplianceColumns = () => [
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
    dataField: "background_check",
    text: "Background Check",
    dataSort: true,
    formatter: (cell) => {
      const variants = {
        Completed: "success",
        Pending: "warning",
        Failed: "destructive",
        "N/A": "outline",
      };
      return (
        <StatusLabel status={cell} variant={variants[cell] || "neutral"}>
          {cell || "N/A"}
        </StatusLabel>
      );
    },
  },
  {
    dataField: "medical_check",
    text: "Medical Check",
    dataSort: true,
    formatter: (cell) => {
      const variants = {
        Completed: "success",
        Pending: "warning",
        Failed: "destructive",
        "N/A": "outline",
      };
      return (
        <StatusLabel status={cell} variant={variants[cell] || "neutral"}>
          {cell || "N/A"}
        </StatusLabel>
      );
    },
  },
  {
    dataField: "visa_processing",
    text: "Visa Processing",
    dataSort: true,
    formatter: (cell) => {
      const variants = {
        Completed: "success",
        Pending: "warning",
        Failed: "destructive",
        "N/A": "ghost",
      };
      return (
        <StatusLabel status={cell} variant={variants[cell] || "neutral"}>
          {cell || "N/A"}
        </StatusLabel>
      );
    },
  },
  {
    dataField: "other_compliance",
    text: "Other Compliance",
    dataSort: true,
    formatter: (cell) => {
      const variants = {
        Completed: "success",
        Pending: "warning",
        Failed: "destructive",
        "N/A": "ghost",
      };
      return (
        <StatusLabel status={cell} variant={variants[cell] || "neutral"}>
          {cell || "N/A"}
        </StatusLabel>
      );
    },
  },
  {
    dataField: "status",
    text: "Overall Status",
    dataSort: true,
    formatter: (cell) => {
      const variants = {
        Completed: "success",
        "Partially Completed": "warning",
        Pending: "destructive",
      };
      return (
        <StatusLabel status={cell} variant={variants[cell] || "neutral"}>
          {cell || "Unknown"}
        </StatusLabel>
      );
    },
  },
];

// Probation Completion Columns
export const ProbationCompletionColumns = () => [
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
          <DepartmentName value={row.department} />
        </div>
      </div>
    ),
  },
  {
    dataField: "joining_date",
    text: "Joining Date",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000">
        {cell === "N/A" || !cell ? "N/A" : cell}
      </span>
    ),
  },
  {
    dataField: "probation_end_date",
    text: "Probation End Date",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "confirmation_status",
    text: "Confirmation Status",
    dataSort: true,
    formatter: (cell) => {
      const variants = {
        Confirmed: "success",
        Pending: "warning",
        "Under Review": "info",
        Extended: "warning",
      };
      return (
        <StatusLabel status={cell} variant={variants[cell] || "neutral"}>
          {cell || "Unknown"}
        </StatusLabel>
      );
    },
  },
  {
    dataField: "action_required",
    text: "Action Required",
    dataSort: true,
    formatter: (cell) => {
      const variants = {
        Completed: "success",
        "Review Pending": "warning",
        "Documentation Pending": "warning",
        "Manager Approval": "info",
      };
      return (
        <StatusLabel status={cell} variant={variants[cell] || "neutral"}>
          {cell || "Unknown"}
        </StatusLabel>
      );
    },
  },
  {
    dataField: "days_remaining",
    text: "Days Remaining",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span
          className={`text-lg font-medium ${
            cell > 30
              ? "text-green-600"
              : cell > 7
              ? "text-yellow-600"
              : cell >= 0
              ? "text-red-600"
              : "text-neutral-800"
          }`}
        >
          {cell || 0}
        </span>
      </div>
    ),
  },
];
