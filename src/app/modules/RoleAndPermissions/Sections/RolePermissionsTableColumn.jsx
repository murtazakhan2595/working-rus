
import { FormatID } from "utils/getValuesFromTables";
import {UserRoleAction} from "app/modules/RoleAndPermissions/UserRole";


// Role Column
export const UserRoleColumn = (reload) => [
  {
    dataField: "id",
    text: "ID",
    dataSort: true,
    formatter: (cell, row) => <FormatID value={cell} prefix={'USR-'} />,
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
    text: "Action",
    formatter: (cell, row) => <UserRoleAction data={row} reload={reload} />,
    classes: "text-center",
    headerClasses: "text-center",
  },
];