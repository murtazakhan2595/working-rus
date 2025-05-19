import { FormatID, EmployeeUsername } from "utils/getValuesFromTables";
import { UserRoleAction } from "app/modules/RoleAndPermissions/UserRole";
import {
  UserRoleStatusTogle,
  RoleAssignmentHistoryLogsActions,
} from "app/modules/RoleAndPermissions/Sections";
import { renderDate } from "utils/renderValues";
import { BranchName } from "utils/getValuesFromTables";
import { UserRole } from "utils/getValuesFromTables";

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
    maxWidth: "200px",
  },
  {
    dataField: "description",
    text: "Description",
    dataSort: true,
    maxWidth: "300px",
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
    formatter: (cell, row, data_list) => (
      <UserRoleAction data={row} reload={reload} UserRoleList={data_list} />
    ),
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
    dataField: "timestamp",
    text: "Assigned Date",
    dataSort: true,
    formatter: (cell, row) => renderDate(cell, "--", "date-time"),
  },
  {
    dataField: "action",
    text: "Action",
    // formatter: (cell, row) => {
    //   return <></>;
    // },
  },
  {
    dataField: "performed_by",
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

export const RoleAssignmentEmployeesLogsColumn = [
  {
    dataField: "serial_number",
    text: "Employee ID",
    dataSort: true,
    // formatter: (cell, row) => <FormatID value={cell} prefix={"HST-"} />,
  },
  {
    dataField: "name",
    text: "Employee Name",
    dataSort: true,
  },
  {
    dataField: "user_role",
    text: "Current Role",
    dataSort: true,
    formatter: (cell, row) => {
      if (!cell || cell.length === 0) {
        return <span className="">No roles assigned</span>;
      }

      // Get the role objects first, then work with them

      return (
        <div className="flex flex-wrap gap-1">
          {cell.slice(0, 2).map((role, index) => (
            <span
              key={index}
              className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
            >
              <UserRole value={role} />
            </span>
          ))}
          {cell.length > 2 && (
            <span className="text-xs text-gray-900">
              +{cell.length - 2} more
            </span>
          )}
        </div>
      );
    },
  },
  {
    dataField: "timestamp",
    text: "Branch",
    dataSort: true,
    formatter: (cell, row) => <BranchName value={cell} />,
  },
  {
    dataField: "action",
    text: "Action",
    formatter: (_, row) => <RoleAssignmentHistoryLogsActions data={row} />,
  },
];
