export const JobRotationColumns = [
  {
    text: "Request ID",
    dataField: "id",
  },
  {
    text: "Employee Name",
    dataField: "employee_name",
  },
  {
    text: "Current Department",
    dataField: "old_department",
  },
  {
    text: "Requested Department",
    dataField: "new_department",
  },
  {
    text: "Rotation Start Date",
    dataField: "rotation_cap_time",
  },
  {
    text: "Rotation End Date",
    dataField: "rotation_expiry_date",
  },
  {
    text: "Status",
    dataField: "status",
    formatter: (cell) => {
      let color =
        cell === "Approved"
          ? "green"
          : cell === "Pending"
          ? "orange"
          : "red";
      return <span style={{ color }}>{cell}</span>;
    },
  },
  {
    text: "Actions",
    dataField: "actions",
    formatter: (cell, row) => (
      <>
        <button >View</button>
      </>
    ),
  },
];
