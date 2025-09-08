import { MultiStatusLabel } from "components";
import { renderDate } from "utils/renderValues";
import { DepartmentName, ManagerName, BranchName } from "utils/getValuesFromTables";
import { StatusLabel } from "components";
import { EvaluationResultsActions, MyPerformanceActions } from 'app/modules/PerformanceEdge';
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