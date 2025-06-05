import LeaveDurationAction from "./Sections/LeaveDurationAction";

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
        return <span className="">No roles assigned</span>;
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
