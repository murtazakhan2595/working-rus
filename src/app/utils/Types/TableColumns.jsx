import { EmployeeID, UserRole } from "utils/getValuesFromTables";
import { RenderJobApplicationActions } from "app/modules/RecruitmentData/Applications/Sections";
import { dropdownOptions } from "data/Data";
import { EmployeeOverview, StatusLabel, OverviewCard } from "components";
import EmployeeAction from "app/modules/Employees/Screens/Sections/EmployeeActions";
import moment from "moment";
import { formatNumber } from "utils/renderValues";
import { AiOutlineDownload } from "react-icons/ai";
import { RenderTerminatedRow } from "app/modules/ExitAndClearance/Sections";
import { RenderResignedRow } from "app/modules/ExitAndClearance/Sections";
import { DepartmentName } from "utils/getValuesFromTables";
import { Switch } from "src/@/components/ui/switch";
import { getExpenseType } from "utils/getValuesFromTables";
import { Clock, MapPin, Tag } from "lucide-react";
import ClaimRequestStatus from "app/modules/claims/Sections/ClaimRequestStatus";
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
    formatter: (cell, row) => row.serial_number ?? <EmployeeID value={cell} />,
    dataSort: true,
    minWidth: "105px",
  },
  {
    dataField: "first_name",
    text: "Employees",
    formatter: (cell, row) => (
      <EmployeeOverview id={row.id} showPosition={true} showDepartment={true} />
    ),
    minWidth: "120px",
    dataSort: true,
  },

  {
    dataField: "user_role",
    text: "Role",
    formatter: (cell, row) => <UserRole value={cell} />,
    dataSort: true,
    maxWidth:'120px'
  },
  {
    dataField: "username",
    text: "Username",
    minWidth: "105px",
    maxWidth:'120px',
    dataSort: true,
    formatter: (cell) => (
      <div className="overflow-hidden text-ellipsis">{cell}</div>
    ),
  },
  {
    dataField: "work_email",
    text: "Phone no/Email",
    formatter: (cell, row) => (
      <>
        <div className="text-base">{`+${row.country_code || ""}${
          row.mobile_no || ""
        }`}</div>
        <div className="text-base">{row.work_email || ""}</div>
      </>
    ),
  },
  {
    dataField: "employee_status",
    text: "Status",
    dataSort: true,
  },
  {
    dataField: "",
    text: "Actions",
    formatter: (cell, row) => <EmployeeAction row={row} />,
  },
];

export const AllJobApplicationColumns = (
  handleOptionSelect,
  setViewApplicationDetails,
  setIsViewApplicationDetailOpen
) => [
  {
    dataField: "id",
    text: "Candidate ID",
    formatter: (cell, row) => <EmployeeID value={cell} />,
  },
  {
    dataField: "first_name",
    text: "Candidate",
    formatter: (cell, row) => {
      const name = `${cell} ${row?.last_name}`.replace(/[^a-zA-Z0-9\s]/g, "");
      return (
        <OverviewCard
          avatarProps={{
            fallbackText: name.charAt(0),
            text: name,
          }}
          title={name}
          additionalInfo={[row?.email]}
        />
      );
    },
    onClick: (index, list) => {
      setViewApplicationDetails({ index, list });
      setIsViewApplicationDetailOpen(true);
    },
  },
  {
    dataField: "updated_at",
    text: "Applied On",
    formatter: (cell) => <>{moment(cell).format("MMM D, YYYY")}</>,
  },
  {
    dataField: "Year_of_Experience",
    text: "Experience",
    formatter: (cell) => <p>{cell} Years</p>,
  },
  {
    dataField: "expected_salary",
    text: "Expected Salary",
    formatter: (cell) => <>{formatNumber(cell)}</>,
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
          <a href={row?.cv} target="_blank" rel="noopener noreferrer">
            <button>
              <AiOutlineDownload />
            </button>
          </a>
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
    text: "Actions",
    formatter: (cell, row) => (
      <RenderJobApplicationActions
        row={row}
        handleOptionSelect={handleOptionSelect}
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

export const MyClaimsRequestColumns = (expenseTypeOptions) => [
  {
    dataField: "expense_type",
    text: "Expense type",
    formatter: (cell) => <>{getExpenseType(cell, expenseTypeOptions)}</>,
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
    formatter: (cell) => (
      <>
        {cell ? (
          <a href={cell} target="_blank" rel="noopener noreferrer">
            View Receipt
          </a>
        ) : (
          "No Attachment"
        )}
      </>
    ),
  },
  {
    dataField: "status",
    text: "Status",
    formatter: (cell) => <ClaimRequestStatus status={cell} />,
  },
];

export const ClaimRequestColumns = (expenseTypeOptions) => [
  {
    dataField: "id",
    text: "ID",
    formatter: (cell, row) => {
      return (
        <div
          onClick={(event) => {
            // Stop the event propagation to prevent onRowClick from being triggered
            event.stopPropagation();
            event.preventDefault();
            return false;
          }}
        >
          <>{cell}</>
        </div>
      );
    },
  },
  {
    dataField: "employeeid",
    text: "Employees",
    formatter: (cell, row) => <EmployeeOverview id={cell} showEmail={true} />,
  },
  {
    dataField: "expense_type",
    text: "Expense type",
    formatter: (cell) => <>{getExpenseType(cell, expenseTypeOptions)}</>,
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
    formatter: (cell) => (
      <>
        {cell ? (
          <a href={cell} target="_blank" rel="noopener noreferrer">
            View Receipt
          </a>
        ) : (
          "No Attachment"
        )}
      </>
    ),
  },
  {
    dataField: "approval_date",
    text: "Approval Date",
    formatter: (cell, row) => {
      return cell
        ? new Date(cell).toLocaleDateString()
        : row?.rejection_date
        ? new Date(row.rejection_date).toLocaleDateString()
        : "N/A";
    },
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
        <EmployeeOverview id={cell} showEmail={row.work_email} />
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
      const total = (
        Number(row.basic_salary) +
        Number(row.total_earnings) +
        Number(row.total_earnings_types) +
        Number(row.total_reimbursements)
      ).toFixed(2);
      return <>{"AED " + total}</>;
    },
  },
  {
    dataField: "",
    text: "Deductions",
    formatter: (cell, row) => {
      const total = (
        Number(row.total_deductions) + Number(row.total_deductions_types)
      ).toFixed(2);
      return <>{total > 0 ? "AED " + total : "0.00"} </>;
    },
  },
  {
    dataField: "total_reimbursements",
    text: "Claims",
    formatter: (cell) => {
      return <>{"AED " + cell}</>;
    },
  },
];

export const downloadPayslipColumns = (components) => [
  {
    dataField: "serial_number",
    text: "ID",
  },
  {
    dataField: "employeeid",
    text: "Name",
    formatter: (cell, row) => (
      <>
        <EmployeeOverview id={cell} showEmail={true} />
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

export const tasksColumns = () => [
  {
    text: "Tasks",
    dataField: "description",
  },
  {
    text: "List",
    dataField: "",
  },
  {
    text: "Priority",
  },
  {
    text: "Labels",
  },
  {
    text: "Members",
  },
  {
    text: "Due Date",
  },
];

export const LeaveRecordColumns = [
  {
    dataField: "id",
    text: "ID",
    formatter: (cell) => <EmployeeID value={cell} />,
  },
  {
    dataField: "id",
    text: "Employee",
    formatter: (cell, row) => (
      <>
        <EmployeeOverview id={cell} showEmail={true} />
      </>
    ),
  },
  {
    dataField: "department_name",
    text: "Department",
    formatter: (cell) => <DepartmentName value={cell} />,
  },
  // {
  //   dataField: "used_leaves",
  //   text: "Total Used",
  // },
  // {
  //   dataField: "total_balance_after",
  //   text: "Total Remaining",
  // },
];

export const LeaveTypesColumns = (onCheckedChange) => [
  {
    dataField: "name",
    text: "Leave Type",
  },
  {
    dataField: "max_days",
    text: "Number of Days",
  },
  {
    dataField: "status",
    text: "Status",
    formatter: (cell, row) => {
      return (
        <div
          onClick={(event) => {
            // Stop the event propagation to prevent onRowClick from being triggered
            event.stopPropagation();
          }}
        >
          <Switch
            id="Status"
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

export const LeaveAplicationColumns = [
  {
    dataField: "employee_id",
    text: "ID",
    formatter: (cell) => <EmployeeID value={cell} />,
  },
  {
    dataField: "employee_id",
    text: "Employees",
    formatter: (cell, row) => (
      <>
        <EmployeeOverview id={cell} showEmail={true} showDepartment={true} />
      </>
    ),
  },
  // {
  //   dataField: "",
  //   text: "Department",
  //   formatter: (cell, row) => (
  //     <>
  //       <DepartmentName
  //         value={row?.leave_request?.employee_info?.department_name}
  //       />
  //     </>
  //   ),
  // },
  {
    dataField: "",
    text: "Leave Period",
    formatter: (cell, row) => (
      <div className="flex flex-col">
        <span>
          {`${moment(row?.leave_request?.start_date).format(
            "MMM D"
          )} - ${moment(row?.leave_request?.end_date).format("MMM D")}`}
        </span>
        <span>{row?.leave_request?.no_of_days} Days</span>
      </div>
    ),
  },
  // {
  //   dataField: "",
  //   text: "Days",
  //   formatter: (cell, row) => <>{row?.leave_request?.no_of_days}</>,
  // },
  {
    dataField: "component_name",
    text: "Leave Type",
  },
  {
    dataField: "status",
    text: "Status",
    formatter: (cell, row) => (
      <span
        className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
          row?.action_hr === "Approved" && row?.action_manager === "Approved"
            ? "bg-emerald-50 text-teal-700"
            : row?.action_hr === "Declined" ||
              row?.action_manager === "Declined"
            ? "bg-red-50 text-red-700"
            : "bg-[#f0f0f3] text-[#7f838d]"
        }`}
      >
        {row?.action_hr === "Approved" && row?.action_manager === "Approved"
          ? "Approved"
          : row?.action_hr === "Declined" || row?.action_manager === "Declined"
          ? "Declined"
          : "Pending"}
      </span>
    ),
  },
];

export const MyDtrTasksColumns = [
  {
    dataField: "",
    text: "Task",
    formatter: (cell, row) => (
      <div>
        <div>{row?.name}</div>
        <div>{row?.id}</div>
      </div>
    ),
  },
  {
    dataField: "dueDate",
    text: "Due Date",
  },
  {
    dataField: "priority",
    text: "Priority",
    formatter: (cell) => (
      <span
        className={`
                      px-2 py-1 rounded-full text-sm
                      ${
                        cell === "High"
                          ? "text-[#60646c] "
                          : cell === "Medium"
                          ? "text-[#825312]"
                          : "text-[#911030]"
                      }
                    `}
      >
        {cell}
      </span>
    ),
  },
  {
    dataField: "timeEst",
    text: "Time Est",
    formatter: (cell) => (
      <div className="flex items-center gap-2">
        {" "}
        <Clock size={16} /> {cell}
      </div>
    ),
  },
  {
    dataField: "timeSpent",
    text: "Time Spent",
    formatter: (cell) => (
      <div className="flex items-center gap-2">
        {" "}
        <Clock size={16} /> {cell}
      </div>
    ),
  },
  {
    dataField: "status",
    text: "Status",
    formatter: (cell) => (
      <span
        className={`
                      px-2 py-1 rounded-full text-xs
                      ${
                        cell === "Completed"
                          ? "bg-green-100 text-green-800"
                          : cell === "In-Progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    `}
      >
        {cell}
      </span>
    ),
  },
];

export const AssetsColumns = [
  {
    dataField: "id",
    text: "Asset ID",
    minWidth: "105px",
    formatter: (cell) => <span>AST-{String(cell).padStart(4, "0")}</span>,
  },
  {
    dataField: "asset_name",
    text: "Asset Name",
    formatter: (cell, row) => (
      <div className="flex flex-col">
        <div className="text-base font-medium">{cell}</div>
        <div className="text-sm text-muted-foreground">
          {row.asset_description || row.asset_model}
        </div>
      </div>
    ),
  },
  {
    dataField: "asset_type",
    text: "Category",
    formatter: (cell) => (
      <div className="flex items-center gap-2">
        <Tag size={16} className="text-muted-foreground" />
        <span>{cell}</span>
      </div>
    ),
  },
  {
    dataField: "asset_location_name",
    text: "Location",
    formatter: (cell, row) => (
      <div className="flex items-center gap-2">
        <MapPin size={16} className="text-muted-foreground" />
        <span>{cell}</span>
      </div>
    ),
  },
];

export const MyAssetRequestColumns = [
  {
    dataField: "id",
    text: "Request ID",
    formatter: (cell) => <span>ASR-{String(cell).padStart(4, "0")}</span>,
  },
  {
    dataField: "asset",
    text: "Asset",
    formatter: (cell) => {
      return (
        <div className="flex flex-col">
          <span className="font-medium">{cell?.asset_name}</span>
          <span className="text-sm text-muted-foreground">
            {cell?.asset_type}
          </span>
        </div>
      );
    },
  },
  {
    dataField: "asset",
    text: "Serial Number",
    formatter: (cell) => {
      return cell?.asset_serial_number || "N/A";
    },
  },
  {
    dataField: "asset_assigned_date",
    text: "Assigned Date",
    formatter: (cell) => {
      return cell ? new Date(cell).toLocaleDateString() : "N/A";
    },
  },
  {
    dataField: "asset_returned_date",
    text: "Return Date",
    formatter: (cell) => {
      return cell ? new Date(cell).toLocaleDateString() : "N/A";
    },
  },
  {
    dataField: "reason",
    text: "Reason",
    formatter: (cell) => {
      return cell || "N/A";
    },
    maxWidth: "200px",
  },
  {
    dataField: "asset_status",
    text: "Status",
    formatter: (cell) => {
      return (
        <span
          className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
            cell === "Accepted" || cell === "Approved"
              ? "bg-emerald-50 text-teal-700"
              : cell === "Rejected" || cell === "Declined"
              ? "bg-red-50 text-red-700"
              : cell === "Returned"
              ? "bg-blue-50 text-blue-700"
              : cell === "Withdrawal"
              ? "bg-yellow-50 text-yellow-700"

              : "bg-[#f0f0f3] text-[#7f838d]" 
          }`}
        >
          {cell || "N/A"}
        </span>
      );
    },
  },
];

export const AssignedAssetsColumns = [
  {
    dataField: "id",
    text: "Assignment ID",
    headerStyle: () => {
      return { width: "120px" };
    },
  },
  {
    dataField: "employee_name",
    text: "Employee Name",
  },
  {
    dataField: "employee_id",
    text: "Employee ID",
    headerStyle: () => {
      return { width: "100px" };
    },
  },
  {
    dataField: "department",
    text: "Department",
  },
  {
    dataField: "asset_name",
    text: "Asset Name",
  },
  {
    dataField: "asset_assigned_date",
    text: "Assigned Date",
    formatter: (cell) => {
      return cell ? new Date(cell).toLocaleDateString() : "N/A";
    },
  },
  {
    dataField: "asset_return_date",
    text: "Return Date",
    formatter: (cell) => {
      return cell ? new Date(cell).toLocaleDateString() : "N/A";
    },
  },
  {
    dataField: "asset_status",
    text: "Status",
    formatter: (cell) => {
      return (
        <span
          className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
            cell === "Accepted"
              ? "bg-emerald-50 text-teal-700"
              : cell === "Rejected"
              ? "bg-red-50 text-red-700"
              : "bg-[#f0f0f3] text-[#7f838d]" // Default for Pending or any other status
          }`}
        >
          {cell || "N/A"}
        </span>
      );
    },
  },
];

export const AssetRequestColumns = [
  {
    dataField: "asset_employee_id",
    text: "ID",
    formatter: (cell) => <EmployeeID value={cell} />,
  },
  {
    dataField: "employee",
    text: "Employees",
    formatter: (cell, row) => (
      <>
        <EmployeeOverview
          id={row.asset_employee_id}
          showEmail={true}
          showDepartment={true}
          showPosition={true}
        />
      </>
    ),
  },
  {
    dataField: "asset",
    text: "Asset Name",
    formatter: (cell) => <>{cell?.asset_name}</>,
  },
  {
    dataField: "asset",
    text: "Asset Type",
    formatter: (cell) => <>{cell?.asset_type}</>,
  },
  {
    dataField: "reason",
    text: "Reason",
    formatter: (cell) => (
      <span className="max-w-[200px] truncate block overflow-hidden text-ellipsis whitespace-nowrap">
        {cell}
      </span>
    ),
  },

  {
    dataField: "created_at",
    text: "Request Date",
    formatter: (cell) => {
      return cell ? new Date(cell).toLocaleDateString() : "N/A";
    },
  },
  {
    dataField: "assigned_dept",
    text: "Approver",
    formatter: (cell) => <>{cell?.full_name || "N/A"}</>,
  },
  {
    dataField: "asset_status",
    text: "Status",
    formatter: (cell) => {
      return (
        <span
          className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
            cell === "Accepted"
              ? "bg-emerald-50 text-teal-700"
              : cell === "Rejected"
              ? "bg-red-50 text-red-700"
              : cell === "Withdrawal"
              ? "bg-yellow-50 text-yellow-700"
              : "bg-[#f0f0f3] text-[#7f838d]" // Default for Pending or any other status
          }`}
        >
          {cell || "N/A"}
        </span>
      );
    },
  },
];
