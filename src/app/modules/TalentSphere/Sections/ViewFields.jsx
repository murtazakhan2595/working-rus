import React from "react";
import { FormatID, BranchName, DepartmentName } from "utils/getValuesFromTables";
import { renderRange } from "utils/renderValues";
import { StatusLabel, SheetUI, MultiStatusLabel, StatusButtons, EmployeeDetailUI } from "components";
import AttachmentUI from "components/ui/AttachmentUI";

export const RequisitionViewFields = [
    {
        title: "Requisition Details",
        footerTitle: "Request At",
        footerField: "created_at",
        field: [
            {
                key: "requisition_id",
                label: "Id",
                formatter: (cell, row) => <FormatID value={cell} prefix={"RR-"} />,
            },
            {
                key: "branch",
                label: "Branch",
                formatter: (cell) => <BranchName value={cell} />,
            },
            {
                key: "department",
                label: "Department",
                formatter: (cell) => <DepartmentName value={cell} />,
            },

            {
                key: "job_title",
                label: "Job Title",
            },
            {
                key: "job_description",
                label: "Job Description",
            },
            {
                key: "required_skills",
                label: "Required Skills",
            },
        ],
    },
    {
        title: "Work Mode Details",
        field: [
            {
                key: "work_mode",
                label: "Work Mode",
                formatter: (cell) => <div className="text-capitalize">{cell}</div>,
            },
            {
                key: "remote_work_checklist_name",
                label: "Remote Work Checklist",
                renderCondition: (_, data) => {
                    if (data.work_mode === 'remote') return true;
                    return false;
                },
                formatter: (cell) => <MultiStatusLabel statusList={cell} variant="info" displayAll={true} />
            },
            {
                key: "country",
                label: "Country",
                renderCondition: (_, data) => {
                    if (data.work_mode === 'hybrid' || data.work_mode === 'onsite') return true;
                    return false;
                }

            },
            {
                key: "city",
                label: "City",
                renderCondition: (_, data) => {
                    if (data.work_mode === 'hybrid' || data.work_mode === 'onsite') return true;
                    return false;
                }
            },
            {
                key: "is_emiratization_role",
                label: "Emiratization Role",
                formatter: (cell) => cell ? 'Required' : 'Not Required',
            },
        ],
    },
    {
        title: "Compensation & Benefits",
        field: [
            {
                key: "benefit_names",
                label: "Benefits",
                formatter: (cell) => <MultiStatusLabel statusList={cell} variant="info" displayAll={true} fallBackText={'Not enabled'} />,
            },
        ],
    },
    {
        title: "Job Specification Details",
        field: [
            {
                key: "number_of_positions",
                label: "Number of Positions",
            },
            {
                key: "job_type_name",
                label: "Job Type",
            },
            {
                key: "gender_preference",
                label: "Gender Preference",
                formatter: (cell) => <div className="text-capitalize">{cell}</div>,
            },
            {
                key: "min_age",
                label: "Age Limit",
                formatter: (cell, row) => renderRange(cell, row.max_age, 'Not Defined', 'Years'),
            },
            {
                key: "education",
                label: "Education Requirement",
            },
            {
                key: "career_level_name",
                label: "Career Level",
            },
            {
                key: "experience_min",
                label: "Experiance",
                formatter: (cell, row) => renderRange(cell, row.experience_max, 'Not Defined', 'Years'),
            },
            {
                key: "salary_min",
                label: "Salary Range",
                formatter: (cell, row) => renderRange(cell, row.salary_max, 'Not Defined'),
            },
            {
                key: "justification",
                formatter: (cell) => <MultiStatusLabel statusList={cell} variant="info" displayAll={true} />,
                label: "Justification",
            },
        ],
    },
    {
        title: `Attachment`,
        field: [
            {
                key: 'attachment',
                formatter: (cell, data) =>
                    cell ? (
                        <AttachmentUI
                            attachment={cell}
                            name={`Requisition Request Document`}
                            viewOnly={true}
                        />
                    ) : (
                        <div className="text-neutral-1000 text-sm">No document attached</div>
                    ),
            },
        ],
    },
];