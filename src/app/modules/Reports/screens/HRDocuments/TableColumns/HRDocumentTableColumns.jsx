import React from "react";
import { Badge } from "components/ui/badge";
import { StatusLabel } from "components";
import { renderDate } from "utils/renderValues";
import { DepartmentName } from "utils/getValuesFromTables";

// Document Expiry Report Columns
export const DocumentExpiryColumns = () => [
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
    formatter: (cell, row) => (
      <div>
        <div className="font-medium text-neutral-1200">{cell || "N/A"}</div>
        <div className="text-xs text-neutral-800">
          {row?.department || "N/A"}
        </div>
      </div>
    ),
  },
  {
    dataField: "document_type",
    text: "Document Type",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="outline" className="text-xs">
        {cell || "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "document_number",
    text: "Document Number",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000 font-mono">
        {cell || "N/A"}
      </span>
    ),
  },
  {
    dataField: "expiry_date",
    text: "Expiry Date",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000">{cell || "N/A"}</span>
    ),
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
        Valid: "success",
        "Expiring Soon": "warning",
        Expired: "destructive",
      };
      return (
        <StatusLabel status={cell} variant={variants[cell] || "neutral"}>
          {cell || "Unknown"}
        </StatusLabel>
      );
    },
  },
];

// Missing Documents Report Columns
export const MissingDocumentsColumns = () => [
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
    formatter: (cell, row) => (
      <div>
        <div className="font-medium text-neutral-1200">{cell || "N/A"}</div>
        <div className="text-xs text-neutral-800">
          {row?.department || "N/A"}
        </div>
      </div>
    ),
  },
  {
    dataField: "missing_documents",
    text: "Missing Documents",
    dataSort: false,
    formatter: (cell) => {
      const documents = cell ? cell.split(", ") : [];
      return (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {documents.length > 0 ? (
            documents.slice(0, 3).map((doc, index) => (
              <Badge key={index} variant="destructive" className="text-xs">
                {doc.trim()}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-neutral-600">None</span>
          )}
          {documents.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{documents.length - 3} more
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    dataField: "status",
    text: "Status",
    dataSort: true,
    formatter: (cell) => {
      const variants = {
        Pending: "warning",
        Submitted: "info",
        Approved: "success",
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

// Document Access Report Columns
export const DocumentAccessColumns = () => [
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
      <div className="font-medium text-neutral-1200">{cell || "N/A"}</div>
    ),
  },
  {
    dataField: "document_name",
    text: "Document Name",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="outline" className="text-xs">
        {cell || "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "expiry_date",
    text: "Expiry Date",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000">{cell ? cell : "N/A"}</span>
    ),
  },
  {
    dataField: "has_expiry_date",
    text: "Has Expiry",
    dataSort: true,
    formatter: (cell) => (
      <StatusLabel variant={cell ? "success" : "secondary"}>
        {cell ? "Yes" : "No"}
      </StatusLabel>
    ),
  },
  {
    dataField: "is_active",
    text: "Active Status",
    dataSort: true,
    formatter: (cell) => (
      <StatusLabel variant={cell ? "success" : "destructive"}>
        {cell ? "Active" : "Inactive"}
      </StatusLabel>
    ),
  },
];

// Visa & Work Permit Expiry Columns
export const VisaPermitExpiryColumns = () => [
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
    formatter: (cell, row) => (
      <div>
        <div className="font-medium text-neutral-1200">{cell || "N/A"}</div>
        <div className="text-xs text-neutral-800">{row.country || "N/A"}</div>
      </div>
    ),
  },
  {
    dataField: "visa_type",
    text: "Visa Type",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="secondary" className="text-xs">
        {cell || "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "visa_number",
    text: "Visa Number",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000 font-mono">
        {cell || "N/A"}
      </span>
    ),
  },
  {
    dataField: "expiry_date",
    text: "Expiry Date",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "days_remaining",
    text: "Days Remaining",
    dataSort: true,
    formatter: (cell) => {
      if (cell === null || cell === undefined) {
        return <span className="text-neutral-900">N/A</span>;
      }
      return (
        <div className="text-center">
          <span
            className={`text-lg font-medium ${
              cell > 90
                ? "text-green-600"
                : cell > 30
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {cell}
          </span>
        </div>
      );
    },
  },
  {
    dataField: "status",
    text: "Status",
    dataSort: true,
    formatter: (cell) => {
      const variants = {
        Valid: "success",
        "Expiring Soon": "warning",
        Expired: "destructive",
        Unknown: "secondary",
      };
      return (
        <StatusLabel status={cell} variant={variants[cell] || "neutral"}>
          {cell || "Unknown"}
        </StatusLabel>
      );
    },
  },
];

// Contract Renewal Report Columns
export const ContractRenewalColumns = () => [
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
    formatter: (cell, row) => (
      <div>
        <div className="font-medium text-neutral-1200">{cell || "N/A"}</div>
        <div className="text-xs text-neutral-800">
          {row?.department || "N/A"}
        </div>
      </div>
    ),
  },
  {
    dataField: "contract_type",
    text: "Contract Type",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="outline" className="text-xs">
        {cell || "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "start_date",
    text: "Start Date",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "end_date",
    text: "End Date",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "days_remaining",
    text: "Days Remaining",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span
          className={`text-lg font-medium ${
            cell > 90
              ? "text-green-600"
              : cell > 30
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
  {
    dataField: "renewal_status",
    text: "Renewal Status",
    dataSort: true,
    formatter: (cell) => {
      const variants = {
        Active: "success",
        Expired: "destructive",
        Upcoming: "warning",
      };
      return (
        <StatusLabel status={cell} variant={variants[cell] || "neutral"}>
          {cell || "Unknown"}
        </StatusLabel>
      );
    },
  },
];

// Policy Acknowledgement Report Columns
export const PolicyAcknowledgementColumns = () => [
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
      <div className="font-medium text-neutral-1200">{cell || "N/A"}</div>
    ),
  },
  {
    dataField: "policy_name",
    text: "Policy Name",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="outline" className="text-xs">
        {cell || "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "acknowledged",
    text: "Acknowledged",
    dataSort: true,
    formatter: (cell) => (
      <StatusLabel variant={cell === "Yes" ? "success" : "destructive"}>
        {cell || "No"}
      </StatusLabel>
    ),
  },
  {
    dataField: "acknowledgement_date",
    text: "Acknowledgement Date",
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
        Completed: "success",
        Pending: "warning",
      };
      return (
        <StatusLabel status={cell} variant={variants[cell] || "neutral"}>
          {cell || "Unknown"}
        </StatusLabel>
      );
    },
  },
];
