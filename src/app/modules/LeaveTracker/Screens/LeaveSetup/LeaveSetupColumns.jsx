import LeaveDurationAction from "./Sections/LeaveDurationAction";
import LeaveTypeAction from "./Sections/LeaveTypeAction";

export const LeaveDurationColumn = (reload, data) => [
  {
    dataField: "duration_name",
    text: "Duration Name",
    dataSort: true,
  },
  {
    dataField: "duration_hours",
    text: "Duration Hours",
    dataSort: true,
  },
  {
    dataField: "nationalities",
    text: "Nationalities",
    formatter: (cell) => {
      if (cell === null) {
        return <span className="">All</span>;
      }
      if (!cell || cell.length === 0) {
        return <span className="">No nationalities assigned</span>;
      }
      return (
        <div className="flex flex-wrap gap-1">
          {cell.map((nationality) => (
            <span
              key={nationality}
              className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
            >
              {nationality}
            </span>
          ))}
        </div>
      );
    },
    dataSort: true,
  },
  {
    dataField: "branches",
    text: "Branches",
    formatter: (cell) => {
      if (cell === null) {
        return <span className="">All</span>;
      }
      if (!cell || cell.length === 0) {
        return <span className="">No roles assigned</span>;
      }
      return (
        <div className="flex flex-wrap gap-1">
          {cell.map((branch) => (
            <span
              key={branch.id}
              className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
            >
              {branch.branch_name}
            </span>
          ))}
        </div>
      );
    },
    dataSort: true,
  },
  {
    dataField: "departments",
    text: "Departments",
    formatter: (cell) => {
      if (cell === null) {
        return <span className="">All</span>;
      }
      if (!cell || cell.length === 0) {
        return <span className="">No roles assigned</span>;
      }
      return (
        <div className="flex flex-wrap gap-1">
          {cell.map((dep) => (
            <span
              key={dep.id}
              className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
            >
              {dep.name}
            </span>
          ))}
        </div>
      );
    },
    dataSort: true,
  },
  {
    dataField: "actions",
    text: "Actions",
    isDummyField: true,
    formatter: (cell, row) => (
      <LeaveDurationAction data={row} reload={reload} leaveDurationList={data} />
    ),
    headerStyle: { width: "8%" },
    style: { textAlign: "center" },
  },
];
export const LeaveTypesColumns = (reload, data) => [
  {
    dataField: "name",
    text: "Leave Type Name",
    dataSort: true,
  },
  {
    dataField: "short_code",
    text: "Short Code",
    dataSort: true,
  },
  {
    dataField: "leave_count",
    text: "Leave Count",
    dataSort: true,
    style: { textAlign: "center" },
  },
  {
    dataField: "day_count_type",
    text: "Day Type",
    formatter: (cell) => (
      <span
        className={`inline-block px-2 py-1 text-xs rounded-full ${
          cell === "work_days"
            ? "bg-blue-100 text-blue-800"
            : "bg-green-100 text-green-800"
        }`}
      >
        {cell === "work_days" ? "Work Days" : "Calendar Days"}
      </span>
    ),
    dataSort: true,
  },
  {
    dataField: "max_consecutive_days",
    text: "Max Days",
    dataSort: true,
  },
  {
    dataField: "is_carry_forward_allowed",
    text: "Carry Forward",
    formatter: (cell) => (
      <span
        className={`inline-block px-2 py-1 text-xs rounded-full ${
          cell ? "bg-green-100 text-green-800" : "bg-[#fee2e2] text-red-800"
        }`}
      >
        {cell ? "Yes" : "No"}
      </span>
    ),
    dataSort: true,
  },
  {
    dataField: "status",
    text: "Status",
    formatter: (cell) => (
      <span
        className={`inline-block px-2 py-1 text-xs rounded-full ${
          cell ? "bg-green-100 text-green-800" : "bg-[#fee2e2] text-red-800"
        }`}
      >
        {cell ? "Active" : "Inactive"}
      </span>
    ),
    dataSort: true,
  },
  {
    dataField: "actions",
    text: "Actions",
    isDummyField: true,
    formatter: (cell, row) => (
      <LeaveTypeAction data={row} reload={reload} leaveTypeList={data} />
    ),
    headerStyle: { width: "8%" },
  },
];
