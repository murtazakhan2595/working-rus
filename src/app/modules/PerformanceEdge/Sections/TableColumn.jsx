import { MultiStatusLabel, EmployeeOverview } from "components";
import { renderDate } from "utils/renderValues";
import { DepartmentName, ManagerName, BranchName } from "utils/getValuesFromTables";
import { StatusLabel } from "components";
import { EvaluationResultsActions, MyPerformanceActions, PerformanceCycleActions } from 'app/modules/PerformanceEdge';
/**
 * EvaluationResultColumns
 *
 * Returns an array of column definitions for the EvaluationResultColumns table.
 *
 * @returns {array} An array of column definitions.
 */
export const EvaluationResultColumns = (reloadData) => [
    {
        dataField: "form_name",
        text: "Evaluation Type",
        dataSort: true,
    },
    {
        dataField: "evaluation_type",
        text: "Evaluation Period",
        dataSort: true,
    },
    {
        dataField: "final_rating",
        text: "Final Rating",
        // formatter: (cell) => {
        //     return (
        //         <MultiStatusLabel
        //             statusList={cell}
        //             variant="info"
        //             fallBackText="All Nationalities"
        //         />
        //     );
        // },
    },
    {
        dataField: "resolved_on",
        text: "HR Approval Date",
        dataSort: true,
        formatter: (cell, row) => renderDate(cell),
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
            <EvaluationResultsActions DataList={dataList} data={row} reloadData={reloadData} />
        ),
    },
];


/**
 * PerformanceCycleColumns
 *
 * Returns an array of column definitions for the PerformanceCycleColumns table.
 *
 * @returns {array} An array of column definitions.
 */
export const PerformanceCycleColumns = (reloadData) => [
    {
        dataField: "name",
        text: "Name",
        dataSort: true,
    },
    {
        dataField: "issuance_date",
        text: "Issuance Date",
        dataSort: true,
        formatter: (cell, row) => renderDate(cell, '--'),
    },
    {
        dataField: "review_start",
        text: "Review Period",
        dataSort: true,
        formatter: (cell, row) => (<div><span>{renderDate(cell, '--')}</span> to <span>{renderDate(row.review_end, '--')}</span> </div>),
    },
    {
        dataField: "",
        text: "",
        formatter: (_, row, dataList) => (
            <PerformanceCycleActions DataList={dataList} data={row} reloadData={reloadData} />
        ),
    },
];


/**
 * ManagerPendingEvaluationColumns
 *
 * Returns an array of column definitions for the ManagerPendingEvaluationColumns table.
 *
 * @returns {array} An array of column definitions.
 */
export const ManagerPendingEvaluationColumns = (reloadData) => [
    {
        dataField: "employee_id",
        text: "Employee",
        formatter: (cell) => <EmployeeOverview id={cell} showId={true} showDepartment={true} showPosition={true} />,

    },
    {
        dataField: "peer_assement_status",
        text: "Peer Assessment Status",
        formatter: (cell) => <StatusLabel status={cell}>{cell?.replace('_', ' ').toLowerCase()}</StatusLabel>,
    },
    {
        dataField: "self_assement_status",
        text: "Self Assessment Status",
        formatter: (cell) => <StatusLabel status={cell}>{cell?.replace('_', ' ').toLowerCase()}</StatusLabel>,
    },
    {
        dataField: "evaluation_period",
        text: "Evaluation Period",
        formatter: (cell) => `${renderDate(cell.start_date)} to ${renderDate(cell.end_date)}`,
    },
    {
        dataField: "final_rating",
        text: "Final Rating",
    },
    {
        dataField: "",
        text: "",
        formatter: (_, row, dataList) => (
            <PerformanceCycleActions DataList={dataList} data={row} reloadData={reloadData} />
        ),
    },
];