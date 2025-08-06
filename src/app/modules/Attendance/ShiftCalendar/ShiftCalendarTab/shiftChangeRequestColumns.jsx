import { StatusLabel } from "components";
import { EmployeeOverview } from "components";
import { renderDate } from "utils/renderValues";
import moment from "moment";
import ShiftChangeRequestActions from "./ShiftChangeRequestActions";

export const EmployeeColumns = (reload) => [
  {
    dataField: "employee",
    text: "Employee",
    formatter: (cell, row) => {
      return (
        <>
          <EmployeeOverview id={cell.id || cell} showBranchName={true} />
        </>
      );
    },
    dataSort: true,
  },
  {
    dataField: "comparison_data",
    text: "Assigned Shift Date",
    formatter: (cell, row) => {
      if (!cell || cell.length === 0) return "-";

      const MAX_DISPLAY = 3;
      const hasMore = cell.length > MAX_DISPLAY;
      const displayItems = cell.slice(0, MAX_DISPLAY);

      return (
        <div className="space-y-1">
          {displayItems.map((day, index) => (
            <div key={index} className="text-sm">
              {renderDate(day.date,'--')}
            </div>
          ))}
          {hasMore && (
            <div className="text-sm text-muted-900 italic">
              ... {cell.length - MAX_DISPLAY} more
            </div>
          )}
        </div>
      );
    },
  },
  {
    dataField: "comparison_data",
    text: "Current Shift",
    formatter: (cell) => {
      if (!cell || cell.length === 0) return "-";

      const MAX_DISPLAY = 3;
      const hasMore = cell.length > MAX_DISPLAY;
      const displayItems = cell.slice(0, MAX_DISPLAY);

      return (
        <div className="space-y-1">
          {displayItems.map((day, index) => (
            <div
              key={index}
              className={`text-sm ${
                day.current_shift === "OFF" ? "text-blue-600 font-medium" : ""
              }`}
            >
              {day.current_shift}
            </div>
          ))}
          {hasMore && <div className="text-sm text-muted-900 italic">...</div>}
        </div>
      );
    },
  },
  {
    dataField: "comparison_data",
    text: "Requested Change",
    formatter: (cell) => {
      if (!cell || cell.length === 0) return "-";

      const MAX_DISPLAY = 3;
      const hasMore = cell.length > MAX_DISPLAY;
      const displayItems = cell.slice(0, MAX_DISPLAY);

      return (
        <div className="space-y-1">
          {displayItems.map((day, index) => (
            <div
              key={index}
              className={`text-sm ${
                day.requested_shift === "OFF" ? "text-blue-600 font-medium" : ""
              }`}
            >
              {day.requested_shift}
            </div>
          ))}
          {hasMore && <div className="text-sm text-muted-900 italic">...</div>}
        </div>
      );
    },
  },
  {
    dataField: "assigned_by",
    text: "Requested By",
    formatter: (cell) => <EmployeeOverview id={cell} />,
    dataSort: true,
  },
  {
    dataField: "status",
    text: "Status",
    formatter: (cell) => {
      return (
        <span
          className={`px-3 py-1.5 text-xs font-semibold rounded-full capitalize ${
            cell?.toLowerCase() === "approved"
              ? "bg-emerald-50 text-teal-700"
              : cell === "rejected"
              ? "bg-red-50 text-red-700"
              : "bg-[#f0f0f3] text-[#7f838d]"
          }`}
        >
          {cell || "N/A"}
        </span>
      );
    },
    dataSort: true,
  },
  {
    dataField: "actions",
    text: "Actions",
    formatter: (cell, row) => (
      <ShiftChangeRequestActions data={row} reload={reload} />
    ),
  },
];
