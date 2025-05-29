import { Button } from "components/ui/button";
import { useNavigate } from "react-router-dom";
import { DesignationName } from "utils/getValuesFromTables";
import { BranchName } from "utils/getValuesFromTables";
import { DepartmentName } from "utils/getValuesFromTables";
import { EmployeeID } from "utils/getValuesFromTables";


export const HistoryColumns = (navigate)=> [
  {
    dataField: "id",
    text: "ID",
    formatter: (cell, row) =>
      row.serial_number ?? <EmployeeID value={cell} />,
    dataSort: true,
  },
  {
    dataField: "first_name",
    text: "Employees",
    formatter: (cell, row) => <>{row?.first_name + " " + row.last_name}</>,
    dataSort: true,
  },
  {
    dataField: "department_name",
    text: "Department",
    formatter: (cell, row) => <DepartmentName value={cell} />,
  },
  {
    dataField: "branch_id",
    text: "Branch",
    formatter: (cell, row) => <BranchName value={cell} fallbackText="" />,
  },
  {
    dataField: "",
    text: "",
    formatter: (cell, row) => {
      const handleClick = (e) => {
        e.preventDefault();
        navigate(`/shift-calendar/history-logs`, {
          state: { employee_id: row.id },
        });
      };
      return <Button onClick={handleClick}>View Logs</Button>;
    },
  },
];