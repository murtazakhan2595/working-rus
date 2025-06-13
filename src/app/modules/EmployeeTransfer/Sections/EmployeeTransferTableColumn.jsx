import { EmployeeTransferStatusView } from "app/modules/EmployeeTransfer/Sections";
import { EmployeeOverview } from "components";
import { renderDate } from "utils/renderValues";
import { DepartmentName, ManagerName } from "utils/getValuesFromTables";
/**
 * InternalTransferColumns
 *
 * Returns an array of column definitions for the InternalTransfer table.
 *
 * @returns {array} An array of column definitions.
 */
export const InternalTransferColumns = [
  {
    dataField: "employee_id",
    text: "Employees",
    formatter: (cell, row) => (
      <EmployeeOverview
        id={row.employee_id}
        showId={true}
        showPosition={true}
        showDepartment={true}
        showBranchName={true}
      />
    ),
    minWidth: "120px",
    // dataSort: true,
  },
  {
    dataField: "transfer_type",
    text: "Transfer Type",
    formatter: (cell, row) => (cell === "INTERNAL" ? "Internal" : "External"),
    minWidth: "120px",
    dataSort: true,
  },
  {
    dataField: "new_department",
    text: "New Department",
    formatter: (cell, row) => <DepartmentName value={cell} />,
    dataSort: true,
    minWidth: "110px",
  },
  {
    dataField: "new_reporting_manager",
    text: "New Reporting Manager",
    formatter: (cell, row) => <ManagerName value={cell} />,
    dataSort: true,
    minWidth: "110px",
  },
  {
    dataField: "effective_transfer_date",
    text: "Effective Transfer Date",
    formatter: (cell, row) => renderDate(cell),

    dataSort: true,
    minWidth: "110px",
  },
  {
    dataField: "status",
    text: "Status",
    dataSort: true,
    formatter: (cell, row) => (
      <EmployeeTransferStatusView status={cell || "PENDING"} />
    ),
  },
];

/**
 * MyTransfersColumns
 *
 * Returns an array of column definitions for the MyTransfers table.
 *
 * @returns {array} An array of column definitions.
 */
export const MyTransfersColumns = [
  {
    dataField: "transfer_type",
    text: "Transfer Type",
    formatter: (cell, row) => (cell === "INTERNAL" ? "Internal" : "External"),
    minWidth: "120px",
    dataSort: true,
  },
  {
    dataField: "new_department",
    text: "New Department",
    formatter: (cell, row) => (
      <DepartmentName value={cell} fallBackText={"-"} />
    ),
    dataSort: true,
    minWidth: "110px",
  },
  {
    dataField: "new_reporting_manager",
    text: "New Reporting Manager",
    formatter: (cell, row) => <ManagerName value={cell} fallBackText="-" />,
    dataSort: true,
    minWidth: "110px",
  },
  {
    dataField: "new_location",
    text: "New Location",
    dataSort: true,
    minWidth: "110px",
  },
  {
    dataField: "effective_transfer_date",
    text: "Effective Transfer Date",
    formatter: (cell, row) => renderDate(cell),

    dataSort: true,
    minWidth: "110px",
  },
  {
    dataField: "status",
    text: "Status",
    dataSort: true,
    formatter: (cell, row) => (
      <EmployeeTransferStatusView status={cell || "PENDING"} />
    ),
  },
];
