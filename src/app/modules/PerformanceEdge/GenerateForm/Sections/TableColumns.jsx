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
export const EmployeeEvaluationFormColumns = (reloadData) => [
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
        dataField: "initiated_by",
        text: "Requestor",
        formatter: (cell) => (
            <EmployeeOverview
                id={cell}
                showId={true}
                showPosition={true}
                showDepartment={true}
            />
        ),
        minWidth: "120px",
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
        formatter: (cell, row) => renderDate(cell, '--'),
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