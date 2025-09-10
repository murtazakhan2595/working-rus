import { MultiStatusLabel } from "components";
import { renderDate } from "utils/renderValues";
import { DepartmentName, ManagerName, BranchName } from "utils/getValuesFromTables";
import { StatusLabel } from "components";
import { EvaluationFormActions, MyPerformanceActions, SelfAssessmentFormActions } from 'app/modules/PerformanceEdge';
/**
 * EmployeeEvaluationFormColumns
 *
 * Returns an array of column definitions for the EmployeeEvaluationFormColumns table.
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
        dataField: "evaluation_type_name",
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
            <EvaluationFormActions DataList={dataList} data={row} reloadData={reloadData} />
        ),
    },
];

/**
 * SelfAssessmentFormColumns
 *
 * Returns an array of column definitions for the SelfAssessmentFormColumns table.
 *
 * @returns {array} An array of column definitions.
 */
export const SelfAssessmentFormColumns = (reloadData) => [
    {
        dataField: "form_name",
        text: "Form Name",
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
        dataField: "branches",
        text: "Branches",
        formatter: (cell) => {
            return (
                <MultiStatusLabel
                    statusList={cell}
                    variant="info"
                    fallBackText="All Branches"
                />
            );
        },
    },
    {
        dataField: "departments",
        text: "Departments",
        formatter: (cell) => {
            return (
                <MultiStatusLabel
                    statusList={cell}
                    variant="info"
                    fallBackText="All Departments"
                />
            );
        },
    },
    {
        dataField: "designation",
        text: "Designations",
        formatter: (cell) => {
            return (
                <MultiStatusLabel
                    statusList={cell}
                    variant="info"
                    fallBackText="All Designations"
                />
            );
        },
    },
    {
        dataField: "status",
        text: "Status",
        dataSort: true,
        formatter: (cell) => (
            <StatusLabel status={cell}>{cell === 'Active' ? 'published' : 'draft'}</StatusLabel>
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
            <SelfAssessmentFormActions DataList={dataList} data={row} reloadData={reloadData} />
        ),
    },
];


