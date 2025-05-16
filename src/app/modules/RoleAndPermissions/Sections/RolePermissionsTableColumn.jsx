import { FormatID, EmployeeUsername } from "utils/getValuesFromTables";
import { UserRoleAction } from "app/modules/RoleAndPermissions/UserRole";
import { UserRoleStatusTogle } from "app/modules/RoleAndPermissions/Sections";
import { renderDate } from "utils/renderValues";

// Role Column
export const UserRoleColumn = (reload = () => {}) => [
  {
    dataField: "id",
    text: "ID",
    dataSort: true,
    formatter: (cell, row) => <FormatID value={cell} prefix={"USR-"} />,
  },
  {
    dataField: "name",
    text: "Role Name",
    dataSort: true,
  },
  {
    dataField: "description",
    text: "Description",
    dataSort: true,
  },
  {
    dataField: "status",
    text: "Status",
    formatter: (cell, row) => {
      return (
        <UserRoleStatusTogle data={row} status={cell} reloadData={reload} />
      );
    },
  },
  {
    text: "Action",
    formatter: (cell, row) => <UserRoleAction data={row} reload={reload} />,
    classes: "text-center",
    headerClasses: "text-center",
  },
];

//Role Permission History
export const RoleAssignmentHistoryLogsColumn = [
  {
    dataField: "id",
    text: "ID",
    dataSort: true,
    formatter: (cell, row) => <FormatID value={cell} prefix={"HST-"} />,
  },
  {
    dataField: "role",
    text: "Role Name",
    dataSort: true,
  },
  {
    dataField: "assigned_date",
    text: "Assigned Date",
    dataSort: true,
    formatter: (cell, row) => renderDate(cell),
  },
  {
    dataField: "action",
    text: "Action",
    // formatter: (cell, row) => {
    //   return <></>;
    // },
  },
  {
    dataField: "assigned_by",
    text: "Assigned By",
    formatter: (cell) => <EmployeeUsername value={cell} />,
  },
  {
    text: "Summary",
    formatter: (cell, row) => <></>,
    classes: "text-center",
    headerClasses: "text-center",
  },
];
