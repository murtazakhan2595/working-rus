import { MultiStatusLabel, EmployeeOverview } from "components";
import { renderDate } from "utils/renderValues";
import { DepartmentName, ManagerName, BranchName } from "utils/getValuesFromTables";
import { StatusLabel } from "components";
import {
    PerformanceResultsActions, MyPerformanceActions, PerformanceCycleActions, MyGoalsActions,
    TeamGoalsActions,
    PeerAssessmentActions,
} from 'app/modules/PerformanceEdge';
/**
 * PerformanceResultColumns
 *
 * Returns an array of column definitions for the PerformanceResultColumns table.
 *
 * @returns {array} An array of column definitions.
 */
export const PerformanceResultColumns = (reloadData) => [
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
            <PerformanceResultsActions DataList={dataList} data={row} reloadData={reloadData} />
        ),
    },
];

/**
 * MyPerformanceCycleColumns
 *
 * Returns an array of column definitions for the MyPerformanceCycleColumns table.
 *
 * @returns {array} An array of column definitions.
 */
export const MyPerformanceCycleColumns = (reloadData) => [
    {
        dataField: "name",
        text: "Name",
        dataSort: true,
    },
    {
        dataField: "review_start",
        text: "Review Period",
        dataSort: true,
        formatter: (cell, row) => (<div><span>{renderDate(cell, '--')}</span> to <span>{renderDate(row.review_end, '--')}</span> </div>),
    },
    {
        dataField: "self_assessment_enabled",
        text: "Self Assessment",
        formatter: (cell, row) => (
            <StatusLabel status={`${cell ? 'Yes' : 'No'}`}>{cell ? 'Yes' : 'No'}</StatusLabel>
        ),
    },
    {
        dataField: "peer_assessment_enabled",
        text: "Peer Assessment",
        formatter: (cell, row) => (
            <StatusLabel status={`${cell ? 'Yes' : 'No'}`}>{cell ? 'Yes' : 'No'}</StatusLabel>
        ),
    },


    {
        dataField: "",
        text: "",
        formatter: (_, row, dataList) => (
            <MyPerformanceActions DataList={dataList} data={row} reloadData={reloadData} />
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
        dataField: "self_assessment_enabled",
        text: "Self Assessment",
        formatter: (cell, row) => (
            <StatusLabel status={`${cell ? 'Yes' : 'No'}`}>{cell ? 'Yes' : 'No'}</StatusLabel>
        ),
    },
    {
        dataField: "peer_assessment_enabled",
        text: "Peer Assessment",
        formatter: (cell, row) => (
            <StatusLabel status={`${cell ? 'Yes' : 'No'}`}>{cell ? 'Yes' : 'No'}</StatusLabel>
        ),
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

/**
 * ManagerFinalEvaluationColumns
 *
 * Returns an array of column definitions for the ManagerFinalEvaluationColumns table.
 *
 * @returns {array} An array of column definitions.
 */
export const ManagerFinalEvaluationColumns = (reloadData) => [
    {
        dataField: "employee",
        text: "Employee ID",
        formatter: (cell) => <EmployeeOverview id={cell} showId={true} showDepartment={true} showPosition={true} />,
    },
    {
        dataField: "",
        text: "Self-Evaluation Score",
    },
    {
        dataField: "",
        text: "Peer-Evaluation Score",
    },
    {
        dataField: "final_score",
        text: "HR Evaluation Score",
        dataSort: true,
        formatter: (cell, row) => renderDate(cell),
    },
    {
        dataField: "final_rating",
        text: "Final Rating (in %)",
        dataSort: true,
        formatter: (cell, row) => renderDate(cell),
    },
    {
        dataField: "status",
        text: "Evaluation Status",
        dataSort: true,
        formatter: (cell, row) => (
            <StatusLabel status={cell}>{cell}</StatusLabel>
        ),
    },
    {
        dataField: "",
        text: "",
        formatter: (_, row, dataList) => (
            <PerformanceResultsActions DataList={dataList} data={row} reloadData={reloadData} />
        ),
    },
];
/**
 * MyGoalsColumn
 *
 * Returns an array of column definitions for the MyGoalsColumn table.
 *
 * @returns {array} An array of column definitions.
 */
export const MyGoalsColumns = (reloadData) => [
    {
        dataField: "title",
        text: "Goal Title",
    },
    {
        dataField: "due_date",
        text: "Due Date",
        formatter: (cell) => renderDate(cell),
    },
    {
        dataField: "alignment",
        text: "Alignment",
        formatter: (cell) => <div className="text-capitalize">{cell}</div>,
    },
    {
        dataField: "aprroval_status",
        text: "Approval Status",
        dataSort: true,
        formatter: (cell) => (
            <StatusLabel status={cell}>{cell?.replace('_', ' ')?.toLowerCase()}</StatusLabel>
        ),
    },
    {
        dataField: "status",
        text: "Status",
        dataSort: true,
        formatter: (cell) => (
            <StatusLabel status={cell}>{cell?.replace('_', ' ')?.toLowerCase()}</StatusLabel>
        ),
    },
    {
        dataField: "",
        text: "",
        formatter: (_, row, dataList) => (
            <MyGoalsActions DataList={dataList} data={row} reloadData={reloadData} />
        ),
    },
];

export const TeamGoalsColumns = (reloadData) => [
    {
        dataField: "employee",
        text: "Employee",
        formatter: (cell) => <EmployeeOverview id={cell} showId={true} showDepartment={true} showPosition={true} />,
    },
    {
        dataField: "title",
        text: "Goal Title",
    },
    {
        dataField: "due_date",
        text: "Due Date",
        formatter: (cell) => renderDate(cell),
    },
    {
        dataField: "alignment",
        text: "Alignment",
        formatter: (cell) => <div className="text-capitalize">{cell}</div>,
    },
    {
        dataField: "status",
        text: "Status",
        dataSort: true,
        formatter: (cell) => (
            <StatusLabel status={cell}>{cell?.replace('_', ' ')?.toLowerCase()}</StatusLabel>
        ),
    },
    {
        dataField: "",
        text: "",
        formatter: (_, row, dataList) => (
            <TeamGoalsActions DataList={dataList} data={row} reloadData={reloadData} />
        ),
    },
];

/**
 * PeerAssessmentFormColumns
 *
 * Returns an array of column definitions for the PeerAssessmentFormColumns table.
 *
 * @returns {array} An array of column definitions.
 */
export const PeerAssessmentFormColumns = (reloadData) => [
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
            <PeerAssessmentActions DataList={dataList} data={row} reloadData={reloadData} />
        ),
    },
];


/**
 * PendingEvaluationColumns
 *
 * Returns an array of column definitions for the PendingEvaluationColumns table.
 *
 * @returns {array} An array of column definitions.
 */
export const PendingEvaluationColumns = (reloadData) => [
    {
        dataField: "emp_id",
        text: "Employee",
        // formatter: (cell) => <EmployeeOverview id={cell} showId={true} showDepartment={true} showPosition={true} />,
    },
    {
        dataField: "Evaluation_Period",
        text: "Evaluation Period",
        // formatter: (cell) => `${renderDate(cell.start_date)} to ${renderDate(cell.end_date)}`,
    },
    {
        dataField: "Peer_Evaluation_Status",
        text: "Peer Assessment Status",
        formatter: (cell) => <StatusLabel status={cell}>{cell?.replace('_', ' ').toLowerCase()}</StatusLabel>,
    },
    {
        dataField: "Self_Assessment_Status",
        text: "Self Assessment Status",
        formatter: (cell) => <StatusLabel status={cell}>{cell?.replace('_', ' ').toLowerCase()}</StatusLabel>,
    },
    {
        dataField: "Manager_Evaluation_Status",
        text: "Manager Evaluation Status",
        formatter: (cell) => <StatusLabel status={cell}>{cell?.replace('_', ' ').toLowerCase()}</StatusLabel>,
    },
    {
        dataField: "Evaluation_Status",
        text: "Evaluation Status",
        formatter: (cell) => <StatusLabel status={cell}>{cell?.replace('_', ' ').toLowerCase()}</StatusLabel>,
    },
    {
        dataField: "HR_Final_Remarks",
        text: "HR Final Remarks",
    },
    {
        dataField: "Final_Submission_Date",
        text: "Final Submission Date",
    },
    {
        dataField: "",
        text: "",
        formatter: (_, row, dataList) => (
            <PerformanceCycleActions DataList={dataList} data={row} reloadData={reloadData} />
        ),
    },
];