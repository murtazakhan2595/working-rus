import { FormatID, BranchName, DepartmentName, EmployeeName } from "utils/getValuesFromTables";
import AttachmentUI from "components/ui/AttachmentUI";
import {
    ManpowerPlanningActions,
    BenefitStatusTogle,
    BenefitActions,
    CareerLevelActions,
    EducationActions,
    JobTypeActions,
    RemoteWorkChecklistStatusTogle,
    RemoteWorkChecklistActions,
    HeadCountRequestsActions,
    RequisitionActions,
    PublishVacancyActions,
} from 'app/modules/TalentSphere';
import { renderDate } from "utils/renderValues";
import { StatusLabel, TextUI, MultiStatusLabel } from "components";


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
    },
    {
        dataField: "department",
        text: "Department",
        formatter: (cell) => <DepartmentName value={cell} />,
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
        width: '50px'
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
        width: '50px'
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
        width: '50px'
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
        width: '50px'
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
        width: '50px'
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
        width: '50px'
    },
];


/**
 * HeadcountRequestColumns
 *
 * Returns an array of column definitions for the HeadcountRequestColumns table.
 *
 * @returns {array} An array of column definitions.
 */
export const HeadcountRequestColumns = (reloadData, isView) => [
    {
        dataField: "id",
        text: "ID",
        formatter: (cell) => <FormatID value={cell} prefix={"HCR-"} />,
    },
    {
        dataField: "branch",
        text: "Branch",
        formatter: (cell) => <BranchName value={cell} />,
    },
    {
        dataField: "department_name",
        text: "Department",
    },
    {
        dataField: "allocated_headcount",
        text: "Current Allocated Headcount",
    },
    {
        dataField: "consumed_headcount",
        text: "Consumed Headcount",
    },
    {
        dataField: "remaining_headcount",
        text: "Remaining Headcount",
    },
    {
        dataField: "requested_headcount",
        text: "Requested Additional Headcount",
    },
    {
        dataField: "reason",
        text: "Reason for Request",
        formatter: (cell) => <TextUI text={cell} maxLength={30} />
    },
    {
        dataField: "attachment_url",
        text: "Attachment",
        formatter: (cell) => (
            <>
                <AttachmentUI
                    attachment={cell}
                    viewOnly={true}
                    variant={'preview-only'}
                    fallBackText='--'
                />
            </>
        ),
    },
    {
        dataField: "requested_by",
        text: "Requested By",
        formatter: (cell) => <EmployeeName value={cell} />,
    },
    {
        dataField: "requested_on",
        text: "Requested Date",
        formatter: (cell) => renderDate(cell, '--', 'date-time'),
    },
    ...(isView ?
        [{
            dataField: "approved_by",
            text: "Approved By",
            formatter: (cell) => <EmployeeName value={cell} />,
        },
        {
            dataField: "approved_on",
            text: "Approved On",
            formatter: (cell) => renderDate(cell, '--', 'date-time'),
        }] : []),
    {
        dataField: "status",
        text: "Status",
        formatter: (cell) => <StatusLabel>{cell?.toLowerCase()}</StatusLabel>
    },
    {
        dataField: "",
        text: "",
        formatter: (_, row, data_list) => (
            <HeadCountRequestsActions data={row} reloadData={reloadData} DataList={data_list} ViewMode={isView} />
        ),
        width: '50px'
    },
];


/**
 * RequisitionRequestColumns
 *
 * Returns an array of column definitions for the RequisitionRequestColumns table.
 *
 * @returns {array} An array of column definitions.
 */
export const RequisitionRequestColumns = (reloadData, viewMode, isTeamView) => [
    {
        dataField: "id",
        text: "ID",
        formatter: (cell) => <FormatID value={cell} prefix={"RR-"} />,
    },
    {
        dataField: "department",
        text: "Department",
        formatter: (cell) => <DepartmentName value={cell} />,
    },
    {
        dataField: "job_title",
        text: "Job Title",
    },
    {
        dataField: "job_type_name",
        text: "Employment Type",
    },
    {
        dataField: "number_of_positions",
        text: "Required Headcount",
    },
    {
        dataField: "salary_min",
        text: "Budget/Salary Range",
        formatter: (cell, row) => `${cell}-${row.salary_max}`,
    },
    {
        dataField: "requested_by",
        text: "Requested By",
        formatter: (cell) => <EmployeeName value={cell} />,
    },
    {
        dataField: "created_at",
        text: "Created Date",
        formatter: (cell) => renderDate(cell, '--', 'date-time'),
    },
    {
        dataField: "status",
        text: "Status",
        formatter: (cell) => <StatusLabel status={cell}>{cell?.toLowerCase()}</StatusLabel>
    },
    {
        dataField: "is_emiratization_role",
        text: "Emiratization Role",
        formatter: (cell) => <StatusLabel variant={cell ? 'info-secondary' : 'info'}>{cell ? 'Required' : 'Not Required'}</StatusLabel>
    },
    ...(!isTeamView ? [{
        dataField: "approval_requied",
        text: "Approval Requied",
        formatter: (cell) => <StatusLabel status={cell ? 'yes' : 'no'}>{cell ? 'yes' : 'no'}</StatusLabel>
    },] : []),
    {
        dataField: "",
        text: "",
        formatter: (_, row, data_list) => (
            <RequisitionActions data={row} reloadData={reloadData} DataList={data_list} isTeamView={isTeamView} />
        ),
        width: '50px'
    },
];



/**
 * ManpowerHeadcountOverviewColumns
 *
 * Returns an array of column definitions for the ManpowerHeadcountOverviewColumns table.
 *
 * @returns {array} An array of column definitions.
 */
export const ManpowerHeadcountOverviewColumns = [
    {
        dataField: "department",
        text: "Department",
        formatter: (cell) => <DepartmentName value={cell} />,
    },
    {
        dataField: "planned_headcount",
        text: "Allocated Headcount",
        dataSort: true,
    },
    {
        dataField: "existing_headcount",
        text: "Consumed Headcount",
        dataSort: true,
    },

    {
        dataField: "planned_headcount",
        text: "Remaining Headcount",
        formatter: (cell, row) => ((cell || 0) - (row.existing_headcount || 0)),
        dataSort: true,
    },
];


/**
 * PublishedVacancyColumns
 *
 * Returns an array of column definitions for the PublishedVacancyColumns table.
 *
 * @returns {array} An array of column definitions.
 */
export const PublishedVacancyColumns = (reloadData) => [
    {
        dataField: "requisition",
        text: "Requisition",
        formatter: (cell, row) => (
            <div>
                <div><span className="font-bold">ID: </span><FormatID value={cell} prefix={"RR-"} /></div>
                <div><span className="font-bold">Job Title: </span>{row.job_title}</div>
                <div><span className="font-bold">Department: </span>{row.department}</div>
                <div><span className="font-bold">Branch: </span>{row.branch}</div>
            </div>
        ),
    },
    {
        dataField: "publish_date",
        text: "Publish Date",
        formatter: (cell) => renderDate(cell, '--', 'date'),
    },
    {
        dataField: "due_date",
        text: "Due Date",
        formatter: (cell) => renderDate(cell, '--', 'date'),
    },
    {
        dataField: "requisition_type",
        text: "Requisition Type",
        formatter: (cell) => <div className="text-capitalize">{cell}</div>,
    },
    {
        dataField: "posted_portals",
        text: "Posted On",
        formatter: (cell) => <MultiStatusLabel statusList={cell} variant="info" displayAll={true} />

    },
    {
        dataField: "total_applications",
        text: "Total Applications",
    },
    {
        dataField: "status",
        text: "Status",
        formatter: (cell) => <StatusLabel status={cell}>{cell?.toLowerCase()}</StatusLabel>
    },

    {
        dataField: "",
        text: "",
        formatter: (_, row, data_list) => (
            <PublishVacancyActions data={row} reloadData={reloadData} DataList={data_list} />
        ),
        width: '50px'
    },
];