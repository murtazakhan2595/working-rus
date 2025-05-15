import React from "react";
import { AssignedRoleAction } from "../AssignedRoles";
import { DepartmentName } from "utils/getValuesFromTables";

export const AssignedRolesColumn = (reload,roles) => [
  {
    dataField: "serial_number",
    text: "Emp ID",
    dataSort: true,
  },
  {
    dataField: "first_name",
    text: "Employee Name",
    dataSort: true,
    formatter: (cell, row) => `${row.first_name} ${row.last_name}`,
  },
  {
    dataField: "department_name",
    text: "Department",
    dataSort: true,
    formatter: (cell) => <DepartmentName value={cell} />,
  },
  {
    dataField: "user_role",
    text: "Assigned Roles",
    formatter: (cell, row) => {
      if (!cell || cell.length === 0) {
        return <span className="">No roles assigned</span>;
      }
      
      // Get the role objects first, then work with them
      const roleObjects = cell
        .map((roleId) => {
          const role = roles.find((r) => r.id === roleId);
          return role ? role : null;
        })
        .filter((role) => role !== null);
  
      return (
        <div className="flex flex-wrap gap-1">
          {roleObjects.slice(0, 2).map((role, index) => (
            <span
              key={role.id}
              className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
            >
              {role.name} 
            </span>
          ))}
          {roleObjects.length > 2 && (
            <span className="text-xs text-gray-900">
              +{roleObjects.length - 2} more
            </span>
          )}
        </div>
      );
    },
    headerStyle: { width: "30%" },
  },
  {
    dataField: "actions",
    text: "Actions",
    isDummyField: true,
    formatter: (cell, row) => <AssignedRoleAction data={row} reload={reload} roles={roles} />,
    headerStyle: { width: "8%" },
    style: { textAlign: "center" },
  },
];
