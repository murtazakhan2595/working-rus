import {
  EmployeeID,
  ManagerName,
  DepartmentName,
  DesignationName,
  LeaveTypeOfEmployee,
  UserRole,
} from "utils/getValuesFromTables";
import { EmployeeNameInfo } from "components";
import EmployeeAction from "app/modules/Employees/Screens/Sections/EmployeeActions";

export const LeaveHistoryColumns = [
  {
    dataField: "name",
    text: "Employees",
    formatter: (cell, row) => (
      <EmployeeNameInfo
        name={`${row.first_name} ${row.last_name}`}
        department={row.department_name}
        position={row.department_position}
      />
    ),
  },
  {
    dataField: "id",
    text: "ID",
    formatter: (cell, row) => <EmployeeID value={cell} />,
  },
  {
    dataField: "direct_report",
    text: "Report To",
    formatter: (cell, row) => <ManagerName value={cell} />,
  },
  {
    dataField: "leaveTypes",
    text: "Leaves Type",
  },
  {
    dataField: "allotedLeaves",
    text: "Leaves Alloted",
  },
  {
    dataField: "usedLeaves",
    text: "Leaves Used",
  },
  {
    dataField: "remainingLeaves",
    text: "Remaining Leaves",
  },
];

export const EmployeeColumns = [
  {
    dataField: "id",
    text: "ID",
    formatter: (cell) => <EmployeeID value={cell} />,
  },
  {
    dataField: "name",
    text: "Employees",
    width:"25%",
    formatter: (cell, row) => (
      <EmployeeNameInfo
        name={`${row.first_name} ${row.last_name}`}
        department={row.department_name}
        position={row.department_position}
      />
    ),
  },

  {
    dataField: "user_role",
    text: "Role",
    formatter: (cell, row) => <UserRole value={cell} />,
  },
  {
    dataField: "username",
    text: "Username",
  },
  {
    dataField: "phone",
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
  },
  {
    dataField: "",
    text: "",
    formatter: (cell, row) => <EmployeeAction row={row} />,
  },
];
