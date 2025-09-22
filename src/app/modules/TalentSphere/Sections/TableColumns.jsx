import { FormatID, BranchName, DepartmentName, EmployeeName } from "utils/getValuesFromTables";
// import { StatusLabel } from 'components';
import {
    ManpowerPlanningActions,
    BenefitStatusTogle,
    BenefitActions,
    CareerLevelActions,
    EducationActions,
    JobTypeActions,
    RemoteWorkChecklistStatusTogle,
    RemoteWorkChecklistActions
} from 'app/modules/TalentSphere';
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
    {
        dataField: "",
        text: "",
        formatter: (_, row, data_list) => (
            <ManpowerPlanningActions data={row} reloadData={reloadData} DataList={data_list} />
        ),
    },
];


/**
 * BenefitsColumns
 *
 * Returns an array of column definitions for the BenefitsColumns table.
 *
 * @returns {array} An array of column definitions.
 */
export const BenefitsColumns = (reloadData) => [
    {
        dataField: "id",
        text: "ID",
        formatter: (cell, row) => <FormatID value={cell} prefix={"TSB-"} />,
    },
    {
        dataField: "name",
        text: "Name",
        dataSort: true,
    },
    {
        dataField: "description",
        text: "Description",
        dataSort: true,
    },
    {
        dataField: "created_at",
        text: "Created On",
        formatter: (cell) => renderDate(cell),
    },
    {
        dataField: "created_by",
        text: "Created By",
        formatter: (cell) => <EmployeeName value={cell} />,
        dataSort: true,
    },

    {
        dataField: "updated_at",
        text: "Last Updated On",
        formatter: (cell) => renderDate(cell),
    },
    {
        dataField: "updated_by",
        text: "Last Updated By",
        formatter: (cell) => <EmployeeName value={cell} />,
    },
    {
        dataField: "status",
        text: "Status",
        formatter: (cell, row) => {
            return (
                <BenefitStatusTogle data={row} status={cell} reloadData={reloadData} />
            );
        },
    },
    {
        dataField: "",
        text: "",
        formatter: (_, row, data_list) => (
            <BenefitActions data={row} reloadData={reloadData} DataList={data_list} />
        ),
    },
];

/**
 * RemoteWorkChecklistsColumns
 *
 * Returns an array of column definitions for the RemoteWorkChecklistsColumns table.
 *
 * @returns {array} An array of column definitions.
 */
export const RemoteWorkChecklistsColumns = (reloadData) => [
    {
        dataField: "id",
        text: "ID",
        formatter: (cell, row) => <FormatID value={cell} prefix={"RWC-"} />,
    },
    {
        dataField: "item_name",
        text: "Name",
        dataSort: true,
    },
    {
        dataField: "created_at",
        text: "Created On",
        formatter: (cell) => renderDate(cell),
    },
    {
        dataField: "created_by",
        text: "Created By",
        formatter: (cell) => <EmployeeName value={cell} />,
        dataSort: true,
    },
    {
        dataField: "status",
        text: "Status",
        formatter: (cell, row) => {
            return (
                <RemoteWorkChecklistStatusTogle data={row} status={cell} reloadData={reloadData} />
            );
        },
    },
    {
        dataField: "",
        text: "",
        formatter: (_, row, data_list) => (
            <RemoteWorkChecklistActions data={row} reloadData={reloadData} DataList={data_list} />
        ),
    },
];

/**
 * JobTypesColumns
 *
 * Returns an array of column definitions for the JobTypesColumns table.
 *
 * @returns {array} An array of column definitions.
 */
export const JobTypesColumns = (reloadData) => [
    {
        dataField: "id",
        text: "ID",
        formatter: (cell, row) => <FormatID value={cell} prefix={"JT-"} />,
    },
    {
        dataField: "name",
        text: "Name",
        dataSort: true,
    },
    {
        dataField: "description",
        text: "Description",
        dataSort: true,
    },
    {
        dataField: "created_at",
        text: "Created On",
        formatter: (cell) => renderDate(cell),
    },
    {
        dataField: "created_by",
        text: "Created By",
        formatter: (cell) => <EmployeeName value={cell} />,
        dataSort: true,
    },
    {
        dataField: "",
        text: "",
        formatter: (_, row, data_list) => (
            <JobTypeActions data={row} reloadData={reloadData} DataList={data_list} />
        ),
    },
];

/**
 * EducationsColumns
 *
 * Returns an array of column definitions for the EducationsColumns table.
 *
 * @returns {array} An array of column definitions.
 */
export const EducationsColumns = (reloadData) => [
    {
        dataField: "id",
        text: "ID",
        formatter: (cell, row) => <FormatID value={cell} prefix={"TSB-"} />,
    },
    {
        dataField: "name",
        text: "Name",
        dataSort: true,
    },
    {
        dataField: "description",
        text: "Description",
        dataSort: true,
    },
    {
        dataField: "created_at",
        text: "Created On",
        formatter: (cell) => renderDate(cell),
    },
    {
        dataField: "created_by",
        text: "Created By",
        formatter: (cell) => <EmployeeName value={cell} />,
        dataSort: true,
    },
    {
        dataField: "",
        text: "",
        formatter: (_, row, data_list) => (
            <EducationActions data={row} reloadData={reloadData} DataList={data_list} />
        ),
    },
];

/**
 * CareerLevelsColumns
 *
 * Returns an array of column definitions for the CareerLevelsColumns table.
 *
 * @returns {array} An array of column definitions.
 */
export const CareerLevelsColumns = (reloadData) => [
    {
        dataField: "id",
        text: "ID",
        formatter: (cell, row) => <FormatID value={cell} prefix={"TSB-"} />,
    },
    {
        dataField: "name",
        text: "Name",
        dataSort: true,
    },
    {
        dataField: "description",
        text: "Description",
        dataSort: true,
    },
    {
        dataField: "created_at",
        text: "Created On",
        formatter: (cell) => renderDate(cell),
    },
    {
        dataField: "created_by",
        text: "Created By",
        formatter: (cell) => <EmployeeName value={cell} />,
        dataSort: true,
    },
    {
        dataField: "",
        text: "",
        formatter: (_, row, data_list) => (
            <CareerLevelActions data={row} reloadData={reloadData} DataList={data_list} />
        ),
    },
];