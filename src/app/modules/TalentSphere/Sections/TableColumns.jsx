import { FormatID, BranchName, DepartmentName } from "utils/getValuesFromTables";
// import { StatusLabel } from 'components';



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
        minWidth: "120px",
        // dataSort: true,
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
        minWidth: "110px",
    },
    {
        dataField: "department",
        text: "Department",
        formatter: (cell) => <DepartmentName value={cell} />,
        dataSort: true,
        minWidth: "110px",
    },
    {
        dataField: "planned_headcount",
        text: "Planned Headcount",
        dataSort: true,
        minWidth: "110px",
    },
    // {
    //     dataField: "status",
    //     text: "Status",
    //     dataSort: true,
    //     formatter: (cell, row) => (
    //         <StatusLabel status={cell || "PENDING"}>{cell?.toLowerCase()}</StatusLabel>
    //     ),
    // },
    // {
    //     dataField: "",
    //     text: "",
    //     formatter: (_, row, data_list) => (
    //         <TransferActions data={row} reloadData={reloadData} DataList={data_list} />
    //     ),
    // },
];