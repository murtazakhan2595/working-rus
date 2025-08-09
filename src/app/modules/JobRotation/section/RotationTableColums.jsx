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
    dataField: "current_department",
  },
  {
    text: "Requested Department",
    dataField: "requested_department",
  },
  {
    text: "Rotation Start Date",
    dataField: "start_date",
  },
  {
    text: "Rotation End Date",
    dataField: "end_date",
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
        <button >Approve</button>
        <button >Reject</button>
      </>
    ),
  },
];
