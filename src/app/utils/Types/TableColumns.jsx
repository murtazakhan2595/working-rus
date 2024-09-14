import {
  EmployeeID,
  ManagerName,
  LeaveType,
  LeaveTypeOfEmployee,
  UserRole,
} from "utils/getValuesFromTables";
import { RenderJobApplicationActions } from "app/modules/RecruitmentData/Applications/Sections";
import { dropdownOptions, formatNumber } from "data/Data";
import { EmployeeNameInfo, StatusLabel } from "components";
import EmployeeAction from "app/modules/Employees/Screens/Sections/EmployeeActions";
import {
  Status,
  RenderStatus,
  RenderLeaveType,
  RenderLeaveAction,
} from "app/modules/LeaveManagment/Sections";
import moment from "moment";
import RenderEmployeesLeaveAllotement from "app/modules/LeaveManagment/Screens/RenderEmployeesLeaveAllotement";
import { IoIosArrowDown } from "react-icons/io";
import { downloadCV } from "app/hooks/recruitment";
import { AiOutlineDownload } from "react-icons/ai";
import ApplicationStatus from "app/modules/EmployeesExit/sections/ApplicationStatus";
import RenderExitTableAction from "app/modules/EmployeesExit/sections/RenderExitTableAction";
import { filebase64Download } from "utils/fileUtils";
import { RenderTerminatedRow } from "app/modules/ExitAndClearance/Sections";
import { ResignationStatusView } from "app/modules/ExitAndClearance/Sections";
import { RenderResignationAction } from "app/modules/ExitAndClearance/Sections";
import { RenderResignedRow } from "app/modules/ExitAndClearance/Sections";
import { TerminationStatusView } from "app/modules/ExitAndClearance/Sections";
import { RenderTerminationAction } from "app/modules/ExitAndClearance/Sections";
import EmployeeDataInfo from "../../modules/payroll/Sections/EmployeeDataInfo";
import { DesignationName } from "utils/getValuesFromTables";
import { DepartmentName } from "utils/getValuesFromTables";

/**
 * LeaveHistoryColumns
 * 
 * Returns an array of column definitions for the Leave History table.
 * 
 * @param {function} updateLeaveType - A function to update the leave type.
 * @returns {array} An array of column definitions.
 */
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
    formatter: (cell) => <IoIosArrowDown className="cursor-pointer" />,
    roWExpandOnClick: true,
  },
];
/**
 * EmployeeColumns
 * 
 * Returns an array of column definitions for the Employee table.
 * 
 * @returns {array} An array of column definitions.
 */
export const EmployeeColumns = [
  {
    dataField: "id",
    text: "ID",
    formatter: (cell) => <EmployeeID value={cell} />,
  },
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
/**
 * MyLeavesColumns
 * 
 * Returns an array of column definitions for the My Leaves table.
 * 
 * @returns {array} An array of column definitions.
 */
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
    dataField: "leave_component_name",
    text: "Leave Type",
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
/**
 * ExitRequestColumns
 * 
 * Returns an array of column definitions for the Exit Request table.
 * 
 * @param {function} handleRowClicked - A function to handle row clicks.
 * @param {function} reload - A function to reload the table.
 * @param {boolean} hideActions - A boolean to hide actions.
 * @returns {array} An array of column definitions.
 */
export const ExitRequestColumns = (
  handleRowClicked,
  reload,
  hideActions = false
) => {
  const columns = [
    {
      dataField: "emp_name",
      text: "Employees",
      width: "25%",
      formatter: (cell, row) => (
        <EmployeeNameInfo
          name={cell}
          department={row.department_name}
          position={row.position}
        />
      ),
      onClick: (recordIndex, data, row) => {
        handleRowClicked(recordIndex, data, row);
      },
    },
    {
      dataField: "employee_id",
      text: "ID",
      formatter: (cell) => <EmployeeID value={cell} />,
    },
    {
      dataField: "report_to",
      text: "Report To",
      formatter: (cell, row) => <ManagerName value={cell} />,
    },
    {
      dataField: "notice_period",
      text: "Notice Period",
    },
    {
      dataField: "exit_date",
      text: "Exit date",
      formatter: (cell) => <>{moment(cell).format("DD-MM-YYYY")}</>,
    },
    {
      dataField: "",
      text: "Application",
      formatter: (cell, row) => (
        <>
          {row?.resignation_letter ? (
            <div className="justify-start items-center gap-2.5 inline-flex">
              <div className="text-[#5c5e64] text-base font-normal">File</div>
              <button
                onClick={() => filebase64Download(row?.resignation_letter)}
              >
                <AiOutlineDownload />
              </button>
            </div>
          ) : (
            "N/A"
          )}
        </>
      ),
    },
    {
      dataField: "status_resignation",
      text: "Status",
      formatter: (cell, row) => <TerminationStatusView row={row} />,
    },
  ];
  if (!hideActions) {
    columns.push({
      dataField: "",
      text: "Action",
      formatter: (cell, row) => (
        <RenderTerminationAction row={row} reload={reload} />
      ),
    });
  }
  return columns;
};
/**
 * EmployeeResignationsColumns
 * 
 * Returns an array of column definitions for the Employee Resignations table.
 * 
 * @param {function} handleRowClicked - A function to handle row clicks.
 * @param {function} reload - A function to reload the table.
 * @returns {array} An array of column definitions.
 */
export const EmployeeResignationsColumns = (handleRowClicked, reload) => {
  const columns = [
    {
      dataField: "emp_name",
      text: "Employees",
      formatter: (cell, row) => (
        <EmployeeNameInfo
          name={cell}
          department={row.department_name}
          position={row.position}
        />
      ),
      width: "25%",
      onClick: (recordIndex, data, row) => {
        handleRowClicked(recordIndex, data, row);
      },
    },
    {
      dataField: "employee_id",
      text: "ID",
      formatter: (cell) => <EmployeeID value={cell} />,
    },
    {
      dataField: "report_to",
      text: "Report To",
      formatter: (cell, row) => <ManagerName value={cell} />,
    },
    {
      dataField: "notice_period",
      text: "Notice Period",
    },
    {
      dataField: "exit_date",
      text: "Exit date",
      formatter: (cell) => <>{moment(cell).format("DD-MM-YYYY")}</>,
    },
    {
      dataField: "",
      text: "Application",
      formatter: (cell, row) => (
        <>
          {row?.resignation_letter ? (
            <div className="justify-start items-center gap-2.5 inline-flex">
              <div className="text-[#5c5e64] text-base font-normal">File</div>
              <button
                onClick={() =>
                  filebase64Download(row?.resignation_letter, row?.emp_name)
                }
              >
                <AiOutlineDownload />
              </button>
            </div>
          ) : (
            "N/A"
          )}
        </>
      ),
    },
    {
      dataField: "status_resignation",
      text: "Status",
      formatter: (cell, row) => <ResignationStatusView row={row} />,
    },
    {
      dataField: "",
      text: "Action",
      formatter: (cell, row) => (
        <RenderResignationAction row={row} reload={reload} />
      ),
    },
  ];
  return columns;
};
export const AllJobApplicationColumns = (
  handleOptionSelect,
  setViewApplicationDetails
) => [
  {
    dataField: "id",
    text: "Candidate ID",
    formatter: (cell, row) => <EmployeeID value={cell} />,
  },
  {
    dataField: "first_name",
    text: "Candidate",
    formatter: (cell, row) => (
      <>
        <div className="cursor-pointer">
          {cell} {row.last_name}
        </div>
        <div className="text-base text-baseGray">
          {`Exp. ${row?.Year_of_Experience} years`}
        </div>
      </>
    ),
    onClick: (index, list) => {
      setViewApplicationDetails({ index, list });
    },
  },
  {
    dataField: "phone_number",
    text: "Phone no/Email",
    formatter: (cell, row) => (
      <>
        <div className="text-base ">{cell || ""}</div>
        <div className="text-base ">{row.email || ""}</div>
      </>
    ),
  },
  {
    dataField: "current_salary",
    text: "Current Salary",
    formatter: (cell) => <>{formatNumber(cell)}</>,
  },
  {
    dataField: "expected_salary",
    text: "Expected Salary",
    formatter: (cell) => <>{formatNumber(cell)}</>,
  },
  {
    dataField: "updated_at",
    text: "Applied On",
    formatter: (cell) => <>{moment(cell).format("DD-MM-YYYY")}</>,
  },
  {
    dataField: "",
    text: "Resume",
    formatter: (cell, row) => (
      <>
        <div className="flex items-center justify-center gap-x-2">
          <span title={row?.cv} className="text-base text-baseGray">
            File
          </span>
          <button onClick={() => downloadCV(row?.cv, row?.first_name)}>
            <AiOutlineDownload />
          </button>
        </div>
      </>
    ),
  },
  {
    dataField: "application_status",
    text: "Status",
    formatter: (cell) => {
      const role = dropdownOptions.find((obj) => obj.value === cell);
      return <StatusLabel status={role?.label} />;
    },
  },
  {
    dataField: "",
    text: "",
    formatter: (cell, row) => (
      <RenderJobApplicationActions
        row={row}
        handleOptionSelect={handleOptionSelect}
      />
    ),
  },
];

export const AllLeavesApplicationColumns = (reload, userRole) => {
  const columns = [
    {
      dataField: "employee_id",
      text: "Employees",
      // formatter: (cell, row) => (
      //   <EmployeeNameInfo
      //     name={`${row.name}`}
      //     department={row.department_name}
      //     position={row.position}
      //   />
      // ),
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
      dataField: "leave_component_name",
      text: "Leave Type",
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
  if (userRole === 1 || userRole === 3) {
    columns.push({
      dataField: "action",
      text: "Action",
      formatter: (cell, row) => <RenderLeaveAction row={row} reload={reload} />,
    });
  }

  return columns;
};

export const LeaveAllotmentColumns = (reload) => [
  {
    dataField: "employee_id",
    text: "",
    formatter: (cell, row, list) => (
      <RenderEmployeesLeaveAllotement
        employee={row}
        employeeList={list}
        reload={reload}
      />
    ),
  },
];

export const ExitTerminatedColumns = [
  {
    dataField: "employee_id",
    text: "",
    formatter: (cell, row, list) => (
      <RenderTerminatedRow
        terminatedEmployee={row}
        terminatedEmployeeList={list}
      />
    ),
  },
];
export const ExitResignedColumns = [
  {
    dataField: "employee_id",
    text: "",
    formatter: (cell, row, list) => (
      <RenderResignedRow resignedEmployee={row} resignedEmployeeList={list} />
    ),
  },
];

export const EmployeePayrollColumns = [
  {
    dataField: "employee",
    text: "ID",
    formatter: (cell) => <EmployeeID value={cell} />,
  },
  {
    dataField: "name",
    text: "Employee",
    formatter: (cell, row) => (
      <EmployeeDataInfo name={cell} email={row.work_email} src={row?.profile_picture?.file}/>
    ),
  },
  {
    dataField: "department_role",
    text: "Designation",
    formatter: (cell) => <DesignationName value={cell} />,
  },
  {
    dataField: "department_name",
    text: "Department",
    // formatter: (cell) => <DepartmentName value={cell} />,
  },
  {
    dataField: "latest_effective_date",
    text: "Last Revised Date",
  },

  {
    dataField: "basic_salary",
    text: "Total cost",
    formatter: (cell) => <>{"AED " + Math.round(cell)}</>,
  },
  ,
  {
    dataField: "salary_type",
    text: "Salary Type",
    formatter: (cell) => <div className="capitalize">{cell}</div>,
  },
];
