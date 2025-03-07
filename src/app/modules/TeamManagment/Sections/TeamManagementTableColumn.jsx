import { EmployeeID, UserRole } from "utils/getValuesFromTables";
import { EmployeeOverview } from "components";
import EmployeeAction from "app/modules/Employees/Screens/Sections/EmployeeActions";

/**
 * TeamColumns
 *
 * Returns an array of column definitions for the Employee table.
 *
 * @returns {array} An array of column definitions.
 */
export const TeamColumns = [
  {
    dataField: "serial_number",
    text: "ID",
    formatter: (cell, row) => <EmployeeID value={cell || row?.id} />,
    dataSort: true,
    minWidth: "101px",
  },
  {
    dataField: "first_name",
    text: "Employees",
    formatter: (cell, row) => (
      <EmployeeOverview id={row.id} showPosition={true} />
    ),
    minWidth: "120px",
    dataSort: true,
  },

  {
    dataField: "user_role",
    text: "Role",
    formatter: (cell, row) => <UserRole value={cell} />,
    dataSort: true,
  },
  {
    dataField: "username",
    text: "Username",
    minWidth: "105px",
    dataSort: true,
  },
  {
    dataField: "work_email",
    text: "Phone no/Email",
    formatter: (cell, row) => (
      <>
        <div className="text-base">{row.mobile_no || ""}</div>
        <div className="text-base">{row.work_email || ""}</div>
      </>
    ),
  },
  {
    dataField: "employee_status",
    text: "Status",
    dataSort: true,
  },
  {
    dataField: "",
    text: "Actions",
    formatter: (cell, row) => <EmployeeAction row={row} />,
  },
];
