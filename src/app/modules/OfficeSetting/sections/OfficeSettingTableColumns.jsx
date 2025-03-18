import BranchAction from "../Screens/Branches/BranchAction";

export const BranchColumn = (reload) => [
  {
    dataField: "serial_number",
    text: "ID",
    dataSort:true,
  },
  {
    dataField: "branch_name",
    dataSort:true,
    text: "Name",
  },
  {
    dataField: "branch_number",
    dataSort:true,
    text: "Branch Number",
  },
  {
    dataField: "branch_status",
    text: "Status",
  },

  {
    text: "Action",
    formatter: (cell, row) => <BranchAction reload={reload} data={row} />,
    width:'90px'
  },
];
