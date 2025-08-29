import { MultiStatusLabel } from "components";
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
        dataField: "form_name",
        text: "Form Name",
        dataSort: true,
    },
    {
        dataField: "evaluation_type",
        text: "Evaluation Type",
        dataSort: true,
    },
    {
        dataField: "nationalities",
        text: "Nationalities",
        formatter: (cell) => {
            return (
                <MultiStatusLabel
                    statusList={cell}
                    variant="info"
                    fallBackText="All Nationalities"
                />
            );
        },
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
        dataField: "status",
        text: "Created On",
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