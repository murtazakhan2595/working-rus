import { EmployeeOverview } from "components";
import { renderDate } from "utils/renderValues";
import { DepartmentName, ManagerName, BranchName } from "utils/getValuesFromTables";
import { StatusLabel } from "components";
import { RotationAction, TransferActions } from 'app/modules/TransferAndRotation';
/**
 * JobRotationColumns
 *
 * Returns an array of column definitions for the JobRotationColumns table.
 *
 * @returns {array} An array of column definitions.
 */
export const JobRotationColumns = [
    {
        dataField: "employee",
        text: "Employee",
        formatter: (cell, row) => (
            <EmployeeOverview
                id={row.employee}
                showId={true}
                showPosition={true}
                showDepartment={true}
            />
        ),
        minWidth: "120px",
        // dataSort: true,
    },
    {
        dataField: "old_branch",
        text: "Current Branch",
        formatter: (cell, row) => <BranchName value={cell} />,
        minWidth: "120px",
        dataSort: true,
    },
    {
        dataField: "new_branch",
        text: "Requested Branch",
        formatter: (cell, row) => <BranchName value={cell} />,
        dataSort: true,
        minWidth: "110px",
    },
    {
        dataField: "created_at",
        text: "Requested Time",
        formatter: (cell, row) => renderDate(cell, '--', 'date-time'),
        dataSort: true,
        minWidth: "110px",
    },
    {
        dataField: "status",
        text: "Status",
        dataSort: true,
        formatter: (cell, row) => (
            <StatusLabel status={cell}>{cell}</StatusLabel>
        ),
    },
    {
        dataField: "",
        text: "",
        formatter: (_, row, dataList) => (
            <RotationAction DataList={dataList} data={row} />
        ),
    },
];


/**
 * TransferColumns
 *
 * Returns an array of column definitions for the InternalTransfer table.
 *
 * @returns {array} An array of column definitions.
 */
export const TransferColumns = (reloadData) => [
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
            <StatusLabel status={cell || "PENDING"}>{cell?.toLowerCase()}</StatusLabel>
        ),
    },
    {
        dataField: "",
        text: "",
        formatter: (_, row, data_list) => (
            <TransferActions data={row} reloadData={reloadData} DataList={data_list} />
        ),
    },
];
