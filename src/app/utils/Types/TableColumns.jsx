import {
  EmployeeID,
  ManagerName,
  LeaveType,
  LeaveTypeOfEmployee,
  UserRole,
} from "utils/getValuesFromTables";
import { EmployeeNameInfo, StatusLabel } from "components";
import EmployeeAction from "app/modules/Employees/Screens/Sections/EmployeeActions";
import {
  Status,
  RenderStatus,
  RenderLeaveType,
} from "app/modules/LeaveManagment/Sections";
import moment from "moment";
import RenderEmployeesLeaveAllotement from "app/modules/LeaveManagment/Screens/RenderEmployeesLeaveAllotement";
import { IoIosArrowDown } from "react-icons/io";

export const LeaveHistoryColumns = (updateLeaveType) => [
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
    formatter: (cell, row) => (
      <RenderLeaveType row={row} updateLeaveType={updateLeaveType} />
    ),
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
  {
    dataField: "",
    text: "",
    formatter: (cell) =>  <IoIosArrowDown className="cursor-pointer" />,
    roWExpandOnClick: true,
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
    width: "25%",
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

export const MyLeavesColumns = [
  {
    dataField: "start_date",
    text: "Start Date",
    formatter: (cell) => <>{moment(cell).format("DD-MM-YYYY")}</>,
  },
  {
    dataField: "end_date",
    text: "End Date",
    formatter: (cell) => <>{moment(cell).format("DD-MM-YYYY")}</>,
  },
  {
    dataField: "leave_type",
    text: "Leave Type",
    formatter: (cell, row) => <LeaveTypeOfEmployee value={cell} list={[]} />,
  },

  {
    dataField: "total_leave",
    text: "Total Days",
  },
  {
    dataField: "status_hr",
    text: "Status",
    formatter: (cell) => <StatusLabel status={Status(cell)} />,
  },
  {
    dataField: "",
    text: "",
    formatter: (cell, row) => <RenderStatus row={row} />,
  },
];

export const AllLeavesApplicationColumns = [
  {
    dataField: "employee_id",
    text: "Employees",
    formatter: (cell, row) => (
      <EmployeeNameInfo
        name={`${row.name}`}
        department={row.department_name}
        position={row.position}
      />
    ),
  },
  {
    dataField: "employee_id",
    text: "ID",
    formatter: (cell, row) => <EmployeeID value={cell} />,
  },
  {
    dataField: "report_to",
    text: "Report To",
    formatter: (cell, row) => <ManagerName value={cell} />,
  },
  {
    dataField: "leave_type",
    text: "Leave Type",
    formatter: (cell, row) => <LeaveType value={cell} list={[]} />,
  },
  {
    dataField: "total_leave",
    text: "No. of Leaves",
  },
  {
    dataField: "start_date",
    text: "Start Date",
    formatter: (cell) => <>{moment(cell).format("DD-MM-YYYY")}</>,
  },
  {
    dataField: "end_date",
    text: "End Date",
    formatter: (cell) => <>{moment(cell).format("DD-MM-YYYY")}</>,
  },
  {
    dataField: "status_hr",
    text: "Status",
    formatter: (cell) => <StatusLabel status={Status(cell)} />,
  },
  {
    dataField: "",
    text: "",
    formatter: (cell, row) => <RenderStatus row={row} />,
  },
];

export const LeaveAllotmentColumns = [
  {
    dataField: "employee_id",
    text: "",
    formatter: (cell, row, list) => (
      <RenderEmployeesLeaveAllotement employee={row} employeeList={list} />
    ),
  },
];
