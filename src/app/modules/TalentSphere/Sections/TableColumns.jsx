import { FormatID, BranchName, DepartmentName } from "utils/getValuesFromTables";
// import { StatusLabel } from 'components';
import { ManpowerPlanningActions } from 'app/modules/TalentSphere';
import { renderDate } from "utils/renderValues";


/**
 * ManpowerPlanningColumns
 *
 * Returns an array of column definitions for the ManpowerPlanningColumns table.
 *
 * @returns {array} An array of column definitions.
 */
export const ManpowerPlanningColumns = (reloadData) => [
    {
        dataField: "id",
        text: "Sr. No.",
        formatter: (cell, row) => <FormatID value={cell} prefix={"MP-"} />,
    },
    {
        dataField: "fiscal_year",
        text: "Fiscal Year",
        dataSort: true,
    },
    {
        dataField: "branch",
        text: "Branch",
        formatter: (cell) => <BranchName value={cell} />,
        dataSort: true,
    },
    {
        dataField: "department",
        text: "Department",
        formatter: (cell) => <DepartmentName value={cell} />,
        dataSort: true,
    },
    {
        dataField: "planned_headcount",
        text: "Planned Headcount",
        dataSort: true,
    },
    {
        dataField: "existing_headcount",
        text: "Existing Headcount",
        dataSort: true,
    },
    {
        dataField: "total_allocated_budget",
        text: "Total Allocated Budget",
        dataSort: true,
    },
    {
        dataField: "consumed_budget",
        text: "Consumed Budget",
        dataSort: true,
    },
    {
        dataField: "created_by",
        text: "Created By",
        dataSort: true,
    },
    {
        dataField: "created_on",
        text: "Created On",
        formatter: (cell) => renderDate(cell),
        dataSort: true,
    },
    // {
    //     dataField: "status",
    //     text: "Status",
    //     dataSort: true,
    //     formatter: (cell, row) => (
    //         <StatusLabel status={cell || "PENDING"}>{cell?.toLowerCase()}</StatusLabel>
    //     ),
    // },
    {
        dataField: "",
        text: "",
        formatter: (_, row, data_list) => (
            <ManpowerPlanningActions data={row} reloadData={reloadData} DataList={data_list} />
        ),
    },
];