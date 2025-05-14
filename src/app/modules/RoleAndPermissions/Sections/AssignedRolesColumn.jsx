import React from "react";
import { AssignedRoleAction } from "../AssignedRoles";

export const AssignedRolesColumn = (reload) => [
  {
    dataField: "id",
    text: "S.No",
    sort: true,
    formatter: (cell, row, rowIndex) => rowIndex + 1,
    headerStyle: { width: "5%" },
  },
  {
    dataField: "employee.employeeId",
    text: "Emp ID",
    sort: true,
    headerStyle: { width: "10%" },
  },
  {
    dataField: "employee.name",
    text: "Employee Name",
    sort: true,
    headerStyle: { width: "20%" },
  },
  {
    dataField: "employee.department",
    text: "Department",
    sort: true,
    headerStyle: { width: "15%" },
  },
  {
    dataField: "roles",
    text: "Assigned Roles",
    formatter: (cell, row) => {
      if (!cell || cell.length === 0) {
        return <span className="text-gray-500">No roles assigned</span>;
      }

      const roleNames = cell.map((role) => role.name);
      const displayRoles =
        roleNames.length > 2
          ? `${roleNames.slice(0, 2).join(", ")} +${roleNames.length - 2} more`
          : roleNames.join(", ");

      return (
        <div className="flex flex-wrap gap-1">
          {roleNames.slice(0, 2).map((roleName, index) => (
            <span
              key={index}
              className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
            >
              {roleName}
            </span>
          ))}
          {roleNames.length > 2 && (
            <span className="text-xs text-gray-500">
              +{roleNames.length - 2} more
            </span>
          )}
        </div>
      );
    },
    headerStyle: { width: "30%" },
  },
  {
    dataField: "created_at",
    text: "Assigned Date",
    sort: true,
    formatter: (cell) => {
      return cell ? new Date(cell).toLocaleDateString() : "-";
    },
    headerStyle: { width: "12%" },
  },
  {
    dataField: "actions",
    text: "Actions",
    isDummyField: true,
    formatter: (cell, row) => <AssignedRoleAction data={row} reload={reload} />,
    headerStyle: { width: "8%" },
    style: { textAlign: "center" },
  },
];
