
import BranchAction from "../Screens/Branches/BranchAction";


export const BranchColumn = [
    {
      dataField: "serial_number",
      text: "ID",
    },
    {
      dataField: "branch_name",
      text: "Name",
    },
    {
      dataField: "branch_number",
      text: "Branch Number",
    },
    {
      dataField: "branch_status",
      text: "Status"
    },
    {
      text: "Action",
      formatter: (cell, row) => (
        <BranchAction
          //reload={getDepartments}
          data={row}
        />
      ),
    },
  ];