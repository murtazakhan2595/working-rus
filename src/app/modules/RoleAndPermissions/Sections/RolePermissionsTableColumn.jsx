import { FormatID } from "utils/getValuesFromTables";
import { UserRoleAction } from "app/modules/RoleAndPermissions/UserRole";
import { UserRoleStatusTogle } from "app/modules/RoleAndPermissions/Sections";

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
