// src/app/modules/PerformanceEdge/PerformanceDashboard/Sections/PerformanceTableColumns.jsx
import React from "react";
import { StatusLabel } from "components";
import { Badge } from "components/ui/badge";
import { EmployeeName } from "utils/getValuesFromTables";

export const PerformanceTableColumns = (tableType) => {
  const baseColumns = [
    {
      dataField: "employee_name",
      text: "Employee",
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
      dataField: "department",
      text: "Department",
      dataSort: true,
      formatter: (cell) => (
        <Badge variant="outline" className="text-xs">
          {cell || "N/A"}
        </Badge>
      ),
    },
  ];

  // Additional columns based on table type
  switch (tableType) {
    case "pending":
      return [
        ...baseColumns,
        {
          dataField: "status",
          text: "Status",
          dataSort: true,
          formatter: (cell) => (
            <StatusLabel status={cell || "pending"}>
              {cell || "Pending"}
            </StatusLabel>
          ),
        },
        {
          dataField: "manager",
          text: "Manager",
          formatter: (cell) => (
            <span className="text-sm text-neutral-1000">
              {<EmployeeName value={cell} /> || "Not Assigned"}
            </span>
          ),
        },
      ];

    case "completed":
      return [
        ...baseColumns,
        {
          dataField: "final_score",
          text: "Final Score",
          dataSort: true,
          formatter: (cell) => (
            <div className="text-center">
              <span className="text-lg font-semibold text-plum-900">
                {cell || "N/A"}
              </span>
            </div>
          ),
        },
        {
          dataField: "final_rating",
          text: "Rating",
          dataSort: true,
          formatter: (cell) => (
            <Badge
              variant={
                cell === "5"
                  ? "success"
                  : cell === "4"
                  ? "info"
                  : cell === "3"
                  ? "warning"
                  : cell === "2"
                  ? "error"
                  : cell === "1"
                  ? "error"
                  : "neutral"
              }
            >
              {cell ? `⭐ ${cell}` : "N/A"}
            </Badge>
          ),
        },
      ];

    case "calibrations":
      return [
        ...baseColumns,
        {
          dataField: "old_score",
          text: "Original Score",
          dataSort: true,
          formatter: (cell) => (
            <span className="text-sm font-medium text-neutral-1000">
              {cell || "N/A"}
            </span>
          ),
        },
        {
          dataField: "new_score",
          text: "Adjusted Score",
          dataSort: true,
          formatter: (cell, row) => {
            const isIncrease = (cell || 0) > (row.old_score || 0);
            const isDecrease = (cell || 0) < (row.old_score || 0);

            return (
              <span
                className={`text-sm font-medium ${
                  isIncrease
                    ? "text-green-600"
                    : isDecrease
                    ? "text-red-600"
                    : "text-neutral-1000"
                }`}
              >
                {cell || "N/A"}
                {isIncrease && " ↗"}
                {isDecrease && " ↘"}
              </span>
            );
          },
        },
        {
          dataField: "justification",
          text: "Justification",
          formatter: (cell) => (
            <div
              className="max-w-xs truncate text-sm text-neutral-900"
              title={cell || "No justification provided"}
            >
              {cell || "No justification"}
            </div>
          ),
        },
      ];

    default:
      return baseColumns;
  }
};
