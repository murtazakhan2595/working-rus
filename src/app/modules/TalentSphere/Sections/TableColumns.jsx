import { FormatID, BranchName, DepartmentName, EmployeeName, Currency } from "utils/getValuesFromTables";
import AttachmentUI from "components/ui/AttachmentUI";
import {
    ManpowerPlanningActions,
    BenefitStatusTogle,
    BenefitActions,
    SkillActions,
    BlacklistReasonStatusTogle,
    BlacklistReasonActions,
    OfferLetterTemplateStatusTogle,
    OfferLetterTemplateActions,
    EmailTemplateStatusTogle,
    EmailTemplateActions,
    FeedBackFormStatusTogle,
    FeedBackFormActions,
    InterviewTypeStatusTogle,
    InterviewTypeActions,
    CareerLevelActions,
    EducationActions,
    JobTypeActions,
    RemoteWorkChecklistStatusTogle,
    RemoteWorkChecklistActions,
    HeadCountRequestsActions,
    RequisitionActions,
    PublishVacancyActions,
    ApplicationActions,
    InterviewActions,
    OfferRequestActions,
    ApplicantProfileActions
} from 'app/modules/TalentSphere';
import { renderDate, renderRange } from "utils/renderValues";
import { StatusLabel, TextUI } from "components";
import { BudgetStatusOptions, RecruitmentApplicationSource, RecruitmentEmailTemplateType } from "data/Data";
import { MultiStatusLabel } from "components";
import { DemographicsFormActions } from "app/modules/TalentSphere/DemographicsFormActions";
import { DesignationName } from "utils/getValuesFromTables";


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
        dataField: "consumed_budget_status",
        text: "Consumed Budget Status",
        formatter: (cell) => {
            return (BudgetStatusOptions.find(obj => obj.value === cell) || {}).label || '--';
        },

    },
    {
        dataField: "justification",
        text: "Justification",
        formatter: (cell) => <TextUI text={cell} maxLength={100} />
    },
    {
        dataField: "created_by",
        text: "Created By",
        formatter: (cell) => <EmployeeName value={cell} />,
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
        formatter: (cell) => <TextUI text={cell} maxLength={500} />,
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
 * SkillsColumns
 *
 * Returns an array of column definitions for the SkillsColumns table.
 *
 * @returns {array} An array of column definitions.
 */
export const SkillsColumns = (reloadData) => [
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
        formatter: (cell) => <TextUI text={cell} maxLength={500} />,
    },
    {
        dataField: "created_at",
        text: "Created On",
        formatter: (cell) => renderDate(cell),
    },
    {
        dataField: "",
        text: "",
        formatter: (_, row, data_list) => (
            <SkillActions data={row} reloadData={reloadData} DataList={data_list} />
        ),
        width: '50px'
    },
];

/**
 * BlacklistReasonsColumns
 *
 * Returns an array of column definitions for the BlacklistReasonsColumns table.
 *
 * @returns {array} An array of column definitions.
 */
export const BlacklistReasonsColumns = (reloadData) => [
    {
        dataField: "id",
        text: "ID",
        formatter: (cell, row) => <FormatID value={cell} prefix={"BLR-"} />,
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
        formatter: (cell) => <TextUI text={cell} maxLength={500} />,
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
        dataField: "is_active",
        text: "Status",
        formatter: (cell, row) => {
            return (
                <BlacklistReasonStatusTogle data={row} status={cell} reloadData={reloadData} />
            );
        },
    },
    {
        dataField: "",
        text: "",
        formatter: (_, row, data_list) => (
            <BlacklistReasonActions data={row} reloadData={reloadData} DataList={data_list} />
        ),
        width: '50px'
    },
];

/**
 * OfferLetterTemplatesColumns
 *
 * Returns an array of column definitions for the OfferLetterTemplatesColumns table.
 *
 * @returns {array} An array of column definitions.
 */
export const OfferLetterTemplatesColumns = (reloadData) => [
    {
        dataField: "id",
        text: "ID",
        formatter: (cell, row) => <FormatID value={cell} prefix={"OLT-"} />,
    },
    {
        dataField: "name",
        text: "Template Name",
        dataSort: true,
    },
    {
        dataField: "letterhead",
        text: "Letter Head",
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
        dataField: "updated_on",
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
        dataField: "updated_on",
        text: "Last Updated On",
        formatter: (cell) => renderDate(cell),
    },
    {
        dataField: "is_active",
        text: "Status",
        formatter: (cell, row) => {
            return (
                <OfferLetterTemplateStatusTogle data={row} is_active={cell} reloadData={reloadData} />
            );
        },
    },
    {
        dataField: "",
        text: "",
        formatter: (_, row, data_list) => (
            <OfferLetterTemplateActions data={row} reloadData={reloadData} DataList={data_list} />
        ),
        width: '50px'
    },
];

/**
 * EmailTemplatesColumns
 *
 * Returns an array of column definitions for the EmailTemplatesColumns table.
 *
 * @returns {array} An array of column definitions.
 */
export const EmailTemplatesColumns = (reloadData) => [
    {
        dataField: "id",
        text: "ID",
        formatter: (cell, row) => <FormatID value={cell} prefix={"ET-"} />,
    },
    {
        dataField: "name",
        text: "Template Name",
        dataSort: true,
    },
    {
        dataField: "subject",
        text: "Email Subject",
        dataSort: true,
        formatter: (cell) => <TextUI text={cell} maxLength={500} />,
    },
    {
        dataField: "template_type",
        text: "Template Type",
        formatter: (cell) => {
            return (RecruitmentEmailTemplateType.find(obj => obj.value === cell) || {}).label || '--';
        },
    },
    {
        dataField: "created_on",
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
        dataField: "updated_on",
        text: "Last Modified",
        formatter: (cell) => renderDate(cell),
    },
    {
        dataField: "is_active",
        text: "Status",
        formatter: (cell, row) => {
            return (
                <EmailTemplateStatusTogle data={row} is_active={cell} reloadData={reloadData} />
            );
        },
    },
    {
        dataField: "",
        text: "",
        formatter: (_, row, data_list) => (
            <EmailTemplateActions data={row} reloadData={reloadData} DataList={data_list} />
        ),
        width: '50px'
    },
];


/**
 * FeedBackFormsColumns
 *
 * Returns an array of column definitions for the FeedBackFormsColumns table.
 *
 * @returns {array} An array of column definitions.
 */
export const FeedBackFormsColumns = (reloadData) => [
    {
        dataField: "id",
        text: "ID",
        formatter: (cell, row) => <FormatID value={cell} prefix={"FBF-"} />,
    },
    {
        dataField: "name",
        text: "Name",
        dataSort: true,
    },
    {
        dataField: "total_sections",
        text: "Section Count",
    },
    {
        dataField: "total_fields",
        text: "Total Field",
    },
    {
        dataField: "created_on",
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
                <FeedBackFormStatusTogle data={row} status={cell} reloadData={reloadData} />
            );
        },
    },
    {
        dataField: "",
        text: "",
        formatter: (_, row, data_list) => (
            <FeedBackFormActions data={row} reloadData={reloadData} DataList={data_list} />
        ),
        width: '50px'
    },
];


/**
 * InterviewTypesColumns
 *
 * Returns an array of column definitions for the InterviewTypesColumns table.
 *
 * @returns {array} An array of column definitions.
 */
export const InterviewTypesColumns = (reloadData) => [
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
        formatter: (cell) => <TextUI text={cell} maxLength={500} />,
    },
    {
        dataField: "created_at",
        text: "Created On",
        formatter: (cell) => renderDate(cell),
    },
    {
        dataField: "created_by_name",
        text: "Created By",
        // formatter: (cell) => <EmployeeName value={cell} />,
        dataSort: true,
    },

    {
        dataField: "updated_at",
        text: "Last Updated On",
        formatter: (cell) => renderDate(cell),
    },
    {
        dataField: "updated_by_name",
        text: "Last Updated By",
        // formatter: (cell) => <EmployeeName value={cell} />,
    },
    {
        dataField: "status",
        text: "Status",
        formatter: (cell, row) => {
            return (
                <InterviewTypeStatusTogle data={row} status={cell} reloadData={reloadData} />
            );
        },
    },
    {
        dataField: "",
        text: "",
        formatter: (_, row, data_list) => (
            <InterviewTypeActions data={row} reloadData={reloadData} DataList={data_list} />
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
        formatter: (cell) => <TextUI text={cell} maxLength={500} />,
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
        dataField: "level",
        text: "Name",
        dataSort: true,
    },
    {
        dataField: "description",
        text: "Description",
        dataSort: true,
        formatter: (cell) => <TextUI text={cell} maxLength={500} />,
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
        formatter: (cell) => <TextUI text={cell} maxLength={500} />,
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
export const HeadcountRequestColumns = (reloadData, isView, isTeamView) => [
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
        formatter: (cell) => <TextUI text={cell} maxLength={100} />
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
        formatter: (cell) => <StatusLabel status={cell}>{cell?.toLowerCase()}</StatusLabel>
    },
    {
        dataField: "",
        text: "",
        formatter: (_, row, data_list) => (
            <HeadCountRequestsActions data={row} reloadData={reloadData} DataList={data_list} ViewMode={isView} isTeamView={isTeamView} />
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
        dataSort: true,
    },
    {
        dataField: "job_title",
        text: "Requisition Details",
        formatter: (_, row) => (
            <div>
                <div><span className="font-bold">Job Title: </span>{row?.job_title}</div>
                <div><span className="font-bold">Job Type: </span>{row?.job_type_name}</div>
                <div><span className="font-bold">Department: </span><DepartmentName value={row?.department} /></div>
                <div><span className="font-bold capitalize">Budget/Salary Range: </span>{renderRange(row?.salary_min, row?.salary_max, 'Not Defined')} <Currency value={row.currency} /> ({row?.payment_frequency || ''})</div>
            </div>
        ),
        minWidth:'250px',
    },
    {
        dataField: "number_of_positions",
        text: "Vacancy Count",
        dataSort: true,
    },
    {
        dataField: "created_at",
        text: "Request Info",
        formatter: (cell, row) => (
            <div>
                <div><span className="font-bold">Requested By: </span><EmployeeName value={row?.requested_by} /></div>
                <div><span className="font-bold">Requested Date: </span>{renderDate(cell, '--', 'date-time')}</div>
            </div>
        ),
    },
    {
        dataField: "is_emiratization_role",
        text: "Emiratization Role",
        formatter: (cell) => <StatusLabel variant={cell ? 'info-secondary' : 'info'}>{cell ? 'Required' : 'Not Required'}</StatusLabel>,
        dataSort: true,
    },
    ...(!isTeamView ? [{
        dataField: "approval_required",
        text: "Approval Requied",
        formatter: (cell) => <StatusLabel status={cell ? 'yes' : 'no'}>{cell ? 'yes' : 'no'}</StatusLabel>,
        dataSort: true,
    },] : []),
    {
        dataField: "status",
        text: "Status",
        formatter: (cell) => <StatusLabel status={cell}>{cell?.toLowerCase()}</StatusLabel>,
        dataSort: true,
    },
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
 * DemographicsFormColumns
 *
 * Returns an array of column definitions for the Demographics Form table.
 *
 * @returns {array} An array of column definitions.
 */
export const DemographicsFormColumns = (reloadData) => [
    {
        dataField: "id",
        text: "Sr. No.",
        formatter: (cell) => <span>DF-{cell}</span>,
    },
    {
        dataField: "name",
        text: "Form Name",
        dataSort: true,
    },
    {
        dataField: "is_active",
        text: "Status",
        formatter: (cell) => <StatusLabel status={cell ? 'Active' : 'Inactive'}>{cell ? 'Active' : 'Inactive'}</StatusLabel>
    },
    {
        dataField: "description",
        text: "Description",
        dataSort: true,
    },
    {
        dataField: "sections",
        text: "Total Sections",
        formatter: (cell) => (cell ? cell?.length : 0),
    },
    {
        dataField: "sections",
        text: "Total Fields",
        formatter: (cell) =>
            cell
                ? cell?.reduce((acc, section) => acc + (section.fields?.length || 0), 0)
                : 0,
    },
    {
        dataField: "created_by",
        text: "Created By",
        formatter: (cell) => <EmployeeName value={cell} />,
    },
    {
        dataField: "updated_by",
        text: "Updated By",
        formatter: (cell) => <EmployeeName value={cell} />,
    },
    {
        dataField: "created_at",
        text: "Created Date",
        formatter: (cell) => renderDate(cell),
        dataSort: true,
    }, {
        dataField: "updated_at",
        text: "Updated Date",
        formatter: (cell) => renderDate(cell),
        dataSort: true,
    },
    {
        dataField: "",
        text: "",
        formatter: (_, row, data_list) => (
            <DemographicsFormActions
                data={row}
                reloadData={reloadData}
                DataList={data_list}
            />
        ),
        headerStyle: { width: "80px" },
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
        formatter: (cell, row) => ((cell || 0) - (row?.existing_headcount || 0)),
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
                <div><span className="font-bold">Job Title: </span>{row?.job_title}</div>
                <div><span className="font-bold">Department: </span>{row?.department}</div>
                <div><span className="font-bold">Branch: </span>{row?.branch}</div>
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
        text: "Platform",
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

/**
 * ApplicantsColumns
 *
 * Returns an array of column definitions for the Applicants table.
 *
 * @returns {array} An array of column definitions.
 */
export const ApplicantsColumns = (reloadData) => [
    {
        dataField: "id",
        text: "Sr. No.",
        formatter: (cell, row) => <FormatID value={cell} prefix={"APP-"} />,
    },
    {
        dataField: "candidate_id",
        text: "Candidate",
        formatter: (cell, row) => (
            <div>
                <div><span className="font-bold">ID: </span>{row?.candidate_id}</div>
                <div><span className="font-bold">Name: </span>{row?.candidate_name}</div>
                <div><span className="font-bold">Email: </span>{row?.email}</div>
                <div><span className="font-bold">Contact No.: </span>{row?.contact_number}</div>
            </div>
        ),
        minWidth: '250px',
    },
    {
        dataField: "vacancy_department",
        text: "Department",
        // formatter: (cell) => <DepartmentName value={cell} />,
    },
    {
        dataField: "application_source",
        text: "Application Source",
        dataSort: true,
    },
    {
        dataField: "emiratization_flag",
        text: "Emiratization",
        formatter: (cell) => (cell ? "Yes" : "No"),
    },
    {
        dataField: "application_date",
        text: "Application Date",
        formatter: (cell) => renderDate(cell),
        dataSort: true,
    },
    {
        dataField: "status",
        text: "Status",
        formatter: (cell) => <StatusLabel status={cell}>{cell?.toLowerCase()}</StatusLabel>
    },
    // {
    //     dataField: "created_by",
    //     text: "Created By",
    //     formatter: (cell) => <EmployeeName value={cell} />,
    // },
    // {
    //     dataField: "created_at",
    //     text: "Created On",
    //     formatter: (cell) => renderDate(cell),
    //     dataSort: true,
    // },
    {
        dataField: "",
        text: "",
        formatter: (_, row, data_list) => (
            <ApplicantProfileActions data={row} reloadData={reloadData} DataList={data_list} />
        ),

        width: "50px",
    },
];

/**
 * ApplicationColumns
 *
 * Returns an array of column definitions for the ApplicationColumns table.
 *
 * @returns {array} An array of column definitions.
 */
export const ApplicationColumns = (reloadData, variant) => [
    {
        dataField: "candidate_id",
        text: "Candidate",
        formatter: (cell, row) => (
            <div>
                <div><span className="font-bold">ID: </span>{row?.candidate_id}</div>
                <div><span className="font-bold">Name: </span>{row?.candidate_name}</div>
                <div><span className="font-bold">Email: </span>{row?.email}</div>
                <div><span className="font-bold">Contact No.: </span>{row?.contact_number}</div>
            </div>
        ),
        minWidth: '250px',
    },
    {
        dataField: "application_source",
        text: "Application",
        formatter: (cell, row) => {
            const source = (RecruitmentApplicationSource.find(obj => obj.value === cell) || {}).label || '--';
            return (<div>
                <div><span className="font-bold">ID: </span><FormatID value={row?.id} prefix={"APP-"} /></div>
                <div><span className="font-bold">Source: </span>{source}</div>
                <div><span className="font-bold">Date: </span>{renderDate(row?.application_date, '--', 'date')}</div>
                <div><span className="font-bold">Job Title: </span>{row?.job_title}</div>
                <div><span className="font-bold">Department: </span>{row?.vacancy_department}</div>
                <div><span className="font-bold">Location: </span>{row?.location}</div>
                <div><span className="font-bold">Emiratization Flag: </span>{row?.emiratization_flag ? 'Yes' : 'No'}</div>
            </div>
            );
        },
        minWidth: '250px',
    },
    ...(variant === 'resume_bank' ? [
        {
            dataField: "resume_bank",
            text: "Resum Bank Info",
            formatter: (cell) => {
                return (
                    <div>
                        <div><span className="font-bold">Recommended Designation: </span><DesignationName value={cell?.recommended_designation} /></div>
                        <div><span className="font-bold">Recommended Department: </span><DepartmentName value={cell?.recommended_department} /></div>
                        <div><span className="font-bold">Blacklisted By: </span><EmployeeName value={cell?.added_by} /></div>
                        <div><span className="font-bold">Date: </span>{renderDate(cell?.added_on, "--")}</div>
                    </div>
                );
            },
        },
    ] : []),
    ...(variant === 'blacklisted' ? [
        {
            dataField: "blacklist",
            text: "Blacklist Information",
            formatter: (cell) => {
                return (
                    <div>
                        <div><span className="font-bold">Blacklisted By: </span><EmployeeName value={cell?.blacklisted_by} /></div>
                        <div><span className="font-bold">Date: </span>{renderDate(cell?.blacklisted_on, "--")}</div>
                        <div className="flex gap-1"><span className="font-bold">Reasons: </span><MultiStatusLabel statusList={cell?.reasons} variant="info" /></div>
                    </div>
                );
            },
        },
    ] : []),
    ...(variant === 'shortlisted' ? [
        {
            dataField: "recruitment_shortlist",
            text: "Shortlisting Info",
            minWidth: '300px',
            formatter: (cell) => {
                // const source = (RecruitmentApplicationSource.find(obj => obj.value === cell) || {}).label || '--';
                return (<div>
                    <div><span className="font-bold">Desired Salary: </span>{cell?.desired_salary}</div>
                    <div><span className="font-bold">Expected Joining Date: </span>{renderDate(cell?.expected_joining_date, '--', 'date')}</div>
                    <div><span className="font-bold">Shortlisted By: </span><EmployeeName value={cell?.shortlisted_by} /></div>
                    <div><span className="font-bold">Date: </span>{renderDate(cell?.shortlisted_on, "--")}</div>
                </div>
                );
            },
        },
    ] : []),
    ...(variant === 'screened' ? [
        {
            dataField: "screened_by",
            text: "Screening Info",
            formatter: (cell, row) => {
                return (<div>
                    <div><span className="font-bold">Screened By: </span><EmployeeName value={cell} /></div>
                    <div><span className="font-bold">Date: </span>{renderDate(row?.screened_date, "--")}</div>
                </div>
                );
            },
        },
    ] : []),
    ...(variant === 'hired' ? [
        {
            dataField: "offers_tracking",
            text: "Offer Details",
            minWidth: '300px',
            formatter: (cell) => {
                // const source = (RecruitmentApplicationSource.find(obj => obj.value === cell) || {}).label || '--';
                return (<div>
                    <div><span className="font-bold">Joining Date: </span>{renderDate(cell?.joining_date, '--', 'date')}</div>
                    <div><span className="font-bold">Sent By: </span><EmployeeName value={cell?.sent_by} /></div>
                    <div><span className="font-bold">Sent Date: </span>{renderDate(cell?.sent_on, "--")}</div>
                </div>
                );
            },
        },
    ] : []),
    ...(variant === 'in_progress' ? [
        {
            dataField: "latest_interview",
            text: "Interview Info",
            minWidth: '300px',
            formatter: (cell) => {
                return (<div>
                    <div><span className="font-bold">Interview Type: </span>{cell?.interview_type_name}</div>
                    <div><span className="font-bold">Date & Time: </span>{renderDate(cell?.scheduled_datetime, '--', 'date-time')}</div>
                    <div className='flex gap-1'><span className="font-bold">Panel: </span><MultiStatusLabel statusList={cell?.panel_name} variant="info" /></div>
                </div>
                );
            },
        },
    ] : []),
    ...(variant === 'rejected' ? [
        {
            dataField: "recruitment_rejected",
            text: "Rejection Detail",
            minWidth: '300px',
            formatter: (cell) => {
                return (<div>
                    <div><span className="font-bold">Rejected By: </span><EmployeeName value={cell?.rejected_by} /></div>
                    <div><span className="font-bold">Date: </span>{renderDate(cell?.rejected_on, '--', 'date')}</div>
                    <div className='flex gap-1'><span className="font-bold">Reason: </span><TextUI text={cell?.rejection_reason} maxLength={50} /></div>
                </div>
                );
            },
        },
    ] : []),
    ...(variant === 'in_progress' ? [
        {
            dataField: "ai_feedback_summary",
            text: "AI Feedback",
            formatter: (cell, row) => {
                return (<div>
                    {row?.ai_feedback_summary && <div><span className="font-bold">Summary: </span>{row?.ai_feedback_summary}</div>}
                </div>
                );
            },
        },
    ] : []),
    ...(variant !== 'resume_bank' ? [{
        dataField: "ai_suggested",
        text: "AI Suggestion",
        formatter: (cell, row) => <StatusLabel status={cell ? 'yes' : 'no'} topLabel={row?.ai_feedback_confidence}>{cell ? 'AI Suggested' : 'AI Not Suggested'}</StatusLabel>,
    }] : []),
    {
        dataField: "status",
        text: "Status",
        formatter: (cell) => <StatusLabel status={cell}>{cell?.toLowerCase()}</StatusLabel>
    },

    {
        dataField: "",
        text: "",
        formatter: (_, row, data_list) => (
            <ApplicationActions data={row} reloadData={reloadData} DataList={data_list} />
        ),
        width: '50px'
    },
];

/**
 * ResumeBankColumns
 *
 * Returns an array of column definitions for the ResumeBankColumns table.
 *
 * @returns {array} An array of column definitions.
 */
export const ResumeBankColumns = (reloadData) => [
    {
        dataField: "id",
        text: "Resume ID",
        formatter: (cell, row) => <FormatID value={cell} prefix={"RBA-"} />,
    },
    {
        dataField: "candidate_name",
        text: "Candidate",
        formatter: (_, row) => (
            <div>
                <div><span className="font-bold">Name: </span>{row?.candidate_name}</div>
                <div><span className="font-bold">Email: </span>{row?.email}</div>
                <div><span className="font-bold">Contact No.: </span>{row?.contact_number}</div>
            </div>
        ),
        minWidth: '250px',
    },
    {
        dataField: "application_source",
        text: "Application",
        formatter: (cell, row) => {
            const source = (RecruitmentApplicationSource.find(obj => obj.value === cell) || {}).label || '--';
            return (<div>
                <div><span className="font-bold">ID: </span><FormatID value={row?.applicant} prefix={"APP-"} /></div>
                <div><span className="font-bold">Source: </span>{source}</div>
                <div><span className="font-bold">Date: </span>{renderDate(row?.application_date, '--', 'date')}</div>
                <div><span className="font-bold">Job Title: </span>{row?.job_title_applied_for}</div>
                <div><span className="font-bold">Emiratization Flag: </span>{cell ? 'Yes' : 'No'}</div>
            </div>
            );
        },
        minWidth: '250px',
    },
    {
        dataField: "recommended_department",
        text: "Recommended Department",
        formatter: (cell) => <DepartmentName value={cell} />
    },
    {
        dataField: "recommended_designation",
        text: "Recommended Designation",
        formatter: (cell) => <DesignationName value={cell} />
    },
    {
        dataField: "added_on",
        text: "Added On",
        formatter: (cell) => renderDate(cell, '--', 'date'),
    },
    {
        dataField: "",
        text: "",
        formatter: (_, row, data_list) => (
            <ApplicationActions data={row} reloadData={reloadData} DataList={data_list} />
        ),
        width: '50px'
    },
];


/**
 * InProgressInterviewColumns
 *
 * Returns an array of column definitions for the InProgressInterviewColumns table.
 *
 * @returns {array} An array of column definitions.
 */
export const InProgressInterviewColumns = (reloadData) => [
    {
        dataField: "candidate_name",
        text: "Candidate Name",
    },
    {
        dataField: "job_title",
        text: "Applied Job Title",
    },
    {
        dataField: "interview_type_name",
        text: "Interview Type",
    },
    {
        dataField: "scheduled_datetime",
        text: "Scheduled Date & Time",
        formatter: (cell) => renderDate(cell, '--', 'date-time'),
    },
    {
        dataField: "panel_name",
        text: "Interview Panel",
        formatter: (cell) => <MultiStatusLabel statusList={cell} variant="info" />
    },
    {
        dataField: "ai_match_score",
        text: "AI Match Score",
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
            <InterviewActions data={row} reloadData={reloadData} DataList={data_list} />
        ),
        width: '50px'
    },
];

/**
 * OfferLetterRequestColumns
 *
 * Returns an array of column definitions for OfferLetterRequestColumns the table.
 *
 * @returns {array} An array of column definitions.
 */
export const OfferLetterRequestColumns = (reloadData, isRecord = false) => [
    {
        dataField: "candidate_name",
        text: "Applicant Name",
    },
    {
        dataField: "designation",
        text: "Job Title",
    },
    {
        dataField: "offered_salary",
        text: "Offered Salary",
    },
    {
        dataField: "expected_joining_date",
        text: "Joining Date",
        formatter: (cell) => renderDate(cell, '--', 'date'),
    },
    ...(isRecord ? [
        {
            dataField: "status",
            text: "Decision Info",
            formatter: (cell, row) => cell === 'approved' ? (
                <div>
                    <div><span className="font-bold">Approved By: </span><EmployeeName value={row?.approved_by} /></div>
                    <div><span className="font-bold">Approved On: </span>{renderDate(row?.approved_on)}</div>
                </div>
            ) : (
                <div>
                    <div><span className="font-bold">Rejected By: </span><EmployeeName value={row?.rejected_by} /></div>
                    <div><span className="font-bold">Rejected On: </span>{renderDate(row?.rejected_on)}</div>
                    <div><span className="font-bold">Reason: </span>{row?.rejection_remarks}</div>
                </div>
            ),
        },
    ] : [
        {
            dataField: "generated_by",
            text: "Generated By",
            formatter: (cell) => <EmployeeName value={cell} />
        },
        {
            dataField: "generated_on",
            text: "Generated On",
            formatter: (cell) => renderDate(cell, '--', 'date'),
        }
    ]),
    {
        dataField: "status",
        text: "Status",
        formatter: (cell) => <StatusLabel status={cell}>{cell?.toLowerCase()}</StatusLabel>
    },
    {
        dataField: "",
        text: "",
        formatter: (_, row, data_list) => (
            <OfferRequestActions data={row} reloadData={reloadData} DataList={data_list} />
        ),
        width: '50px'
    },
];

/**
 * OfferTrackingColumns
 *
 * Returns an array of column definitions for OfferTrackingColumns the table.
 *
 * @returns {array} An array of column definitions.
 */
export const OfferTrackingColumns = (reloadData, isRecord = false) => [
    {
        dataField: "id",
        text: "Offer ID",
        formatter: (cell, row) => <FormatID value={cell} prefix={"AOL-"} />,
    },
    {
        dataField: "applicant_name",
        text: "Applicant Name",
    },
    {
        dataField: "job_title",
        text: "Job Title",
    },
    {
        dataField: "department",
        text: "Department",
    },
    {
        dataField: "validity_date",
        text: "Offer Validity",
        formatter: (cell) => renderDate(cell, '--', 'date'),
    },
    {
        dataField: "joining_date",
        text: "Joining Date",
        formatter: (cell) => renderDate(cell, '--', 'date'),
    },
    {
        dataField: "sent_by",
        text: "Send By",
        formatter: (cell) => <EmployeeName value={cell} />
    },
    {
        dataField: "sent_on",
        text: "Send Date",
        formatter: (cell) => renderDate(cell, '--', 'date'),
    },
    {
        dataField: "updated_on",
        text: "Last Updated Date",
        formatter: (cell) => renderDate(cell, '--', 'date'),
    },
    {
        dataField: "updated_by",
        text: "Last Updated By",
        formatter: (cell) => <EmployeeName value={cell} />
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
            <OfferRequestActions data={row} reloadData={reloadData} DataList={data_list} isOfferSent={true} />
        ),
        width: '50px'
    },
];