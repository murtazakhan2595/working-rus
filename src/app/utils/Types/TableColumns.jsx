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
import { Switch } from "../../../src/@/components/ui/switch";
import { getExpenseType } from "utils/getValuesFromTables";
import { Download } from "lucide-react";
import ClaimRequestStatus from "app/modules/claims/Sections/ClaimRequestStatus";
import { calculateTotalMonthlyEarningsAndDeductions } from "app/modules/payroll/Sections/CalculationsHelperFunctions";

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
        <RenderTerminationAction row={row} reload={reload} viewMode={false}/>
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

export const SalaryComponentColumns = (onCheckedChange) => [
  {
    dataField: "name",
    text: "Component Name",
  },
  {
    dataField: "income_type",
    text: "Component Type",
    formatter: (cell) => <div className="capitalize">{cell}</div>,
  },
  {
    dataField: "amounts_types",
    text: "Amount Type",
    formatter: (cell) => <div className="capitalize">{cell}</div>,
  },
  {
    dataField: "amounts",
    text: "Amount",
  },
  {
    dataField: "is_active",
    text: "Active",
    formatter: (cell, row) => {
      return (
        <div
          onClick={(event) => {
            // Stop the event propagation to prevent onRowClick from being triggered
            event.stopPropagation();
          }}
        >
          <Switch
            id="activate"
            checked={cell}
            onCheckedChange={(value) => {
              // The event is handled by the div, so no need to stop it here
              onCheckedChange(value, row);
            }}
          />
        </div>
      );
    },
  },
];

export const SalarySetupColumns = [
  {
    dataField: "id",
    text: "ID",
    formatter: (cell) => <EmployeeID value={cell} />,
  },
  {
    dataField: "",
    text: "Employees",
    formatter: (cell, row) => (
      <>
        {row.first_name} {row.last_name}
      </>
    ),
  },
  {
    dataField: "department_name",
    text: "Department",
    formatter: (cell) => <DepartmentName value={cell} />,
  },
  {
    dataField: "salary",
    text: "Salary",
  },
  {
    dataField: "salary_type",
    text: "Salary Type",
  },
  {
    dataField: "is_new",
    text: "",
    formatter: (cell, row) => {
       const showNewBadge = cell === null || cell === true;
       const showEosBadge = row.is_eos_applicable === true;
      if (cell === null || cell === true) {
        return (
          <div class="flex gap-2">
            {showNewBadge && (
              <div class="h-[22px] px-3 py-[3px] rounded-full border border-[#f1d1f3] justify-end items-center gap-1.5 inline-flex">
                <div class="text-[#ab4aba] text-xs font-semibold">New</div>
              </div>
            )}
            {showEosBadge && (
              <div class="h-[22px] px-3 py-[3px] rounded-full border border-[#f49fb4] justify-end items-center gap-1.5 inline-flex">
                <div class="text-[#ce1644] text-xs font-semibold">EOS</div>
              </div>
            )}
          </div>
        );
      }
    },
  },
];


export const ClaimRequestColumns = [
  {
    dataField: "employeeid",
    text: "ID",
    formatter: (cell) => <EmployeeID value={cell} />,
  },
  {
    dataField: "full_name",
    text: "Employees",
    formatter: (cell, row) => (
      <EmployeeDataInfo name={cell} email={`${row?.work_email}`} />
    ),
  },
  {
    dataField: "expense_type",
    text: "Expense type",
    formatter: (cell) => <>{getExpenseType(cell)}</>,
  },
  {
    dataField: "payment_date",
    text: "Date of Expense",
  },
  {
    dataField: "amount",
    text: "Amount",
    formatter: (cell) => <>{`AED ${cell}`}</>,
  },
  {
    dataField: "attachment",
    text: "Receipt",
    formatter: (cell, row) => (
      console.log("cell", cell),
      cell?.file ? (
        <div
          onClick={(e) => {
            e.stopPropagation();
            filebase64Download(cell);
          }}
        >
          <div className="items-center gap-2 inline-flex cursor-pointer">
            <Download size={16} color="#ab4aba" />
            <div className="text-[#ab4aba] text-sm font-medium">Receipt</div>
          </div>
        </div>
      ) : (
        "No Attachment"
      )
    ),
  },

  {
    dataField: "status",
    text: "Status",
    formatter: (cell) => <ClaimRequestStatus status={cell} />,
  },
];


export const createPayrunColumns = (components) => [
  {
    dataField: "employee",
    text: "ID",
  },
  {
    dataField: "employee",
    text: "Employee",
    formatter: (cell, row) => (
      <>
        <EmployeeDataInfo
          name={row.name}
          email={row.work_email}
          src={row?.profile_picture?.file}
        />
      </>
    ),
  },
  {
    dataField: "department_name",
    text: "Department",
  },
  {
    dataField: "total_earnings_types",
    text: "Gross Pay",
    formatter: (cell, row) => (
      <>
        {"AED " +
          Math.round(
            cell +
              row.total_earnings * 1 +
              row.basic_salary * 1 +
              row.total_reimbursements * 1
          )}
      </>
    ),
  },
  {
    dataField: "",
    text: "Earnings",
    formatter: (cell, row) => {
      const total =  (Number(row.basic_salary) +
          Number(row.total_earnings) +
          Number(row.total_earnings_types) +
          Number(row.total_reimbursements)).toFixed(2);
      return (
        <>
          {"AED " + total}
        </>
      );
    },
  },
  {
    dataField: "",
    text: "Deductions",
    formatter: (cell, row) => {
      const total = (Number(row.total_deductions) + Number(row.total_deductions_types)).toFixed(2);
      return <>{total > 0 ? "AED " + total : "0.00"} </>;
    },
  },
  {
    dataField: "total_reimbursements",
    text: "Claims",
    formatter: (cell, ) => {
      return (
        <>
          { "AED " + cell}
        </>
      );
    },
  },
];


export const MyClaimsRequestColumns = [
  {
    dataField: "expense_type",
    text: "Expense Type",
    formatter: (cell) => <>{getExpenseType(cell)}</>,
  },
  {
    dataField: "payment_date",
    text: "date of Expense",
  },
  {
    dataField: "amount",
    text: "Amount",
    formatter: (cell) => <>{`AED ${cell}`}</>,
  },
  {
    dataField: "attachment",
    text: "Receipt",
    formatter: (cell, row) => (
      console.log("cell", cell),
      cell?.file ? (
        <div
          onClick={(e) => {
            e.stopPropagation();
            filebase64Download(cell);
          }}
        >
          <div className="items-center gap-2 inline-flex cursor-pointer">
            <Download size={16} color="#ab4aba" />
            <div className="text-[#ab4aba] text-sm font-medium">Receipt</div>
          </div>
        </div>
      ) : (
        "No Attachment"
      )
    ),
  },
  {
    dataField: "status",
    text: "Status",
    formatter: (cell) => <ClaimRequestStatus status={cell} />,
  },
];



export const downloadPayslipColumns = (components) => [
  {
    dataField: "employeeid",
    text: "ID",
  },
  {
    dataField: "employee",
    text: "Name",
    formatter: (cell, row) => (
      <>
        <EmployeeDataInfo
          name={row.full_name}
          email={row.work_email}
          src={row?.profile_picture?.file}
        />
      </>
    ),
  },
  {
    dataField: "department_name",
    text: "Department",
  },
  {
    dataField: "gross_salary",
    text: "Salary",
    formatter: (cell) => <>{"AED " + Math.round(cell)}</>,
  },
  {
    dataField: "gross_salary",
    text: "Total Deductions",
    formatter: (cell, row) => {
      return <>{"AED " + (cell - row.net_salary)}</>;
    },
  },
  {
    dataField: "",
    text: "Total Earnings",
    formatter: (cell, row) => {
      return <>{row.net_salary > 0 ? "AED " + row.net_salary : "0.00"} </>;
    },
  },
];