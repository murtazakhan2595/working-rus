import React from "react";
import { FormatID, BranchName, DepartmentName, EmployeeName, DesignationName } from "utils/getValuesFromTables";
import { renderRange, renderDate } from "utils/renderValues";
import { StatusLabel, SheetUI, MultiStatusLabel, StatusButtons, EmployeeDetailUI } from "components";
import AttachmentUI from "components/ui/AttachmentUI";
import { RecruitmentApplicationSource } from "data/Data";

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


export const ApplicantDetails = [
  {
    customContent: true,
    renderContent: (data) => {
      return (
        <div className="flex flex-wrap justify-end gap-2 items-center">
          <div className="flex justify-end gap-2 flex-wrap">
            <StatusLabel status={data.status}>
              {data?.status?.toLowerCase()}
            </StatusLabel>
          </div>
        </div>
      );
    },
  },
  {
    title: "Candidate Information",
    field: [
      {
        key: "candidate_name",
        label: "Candidate Name",
      },
      {
        key: "candidate_id",
        label: "Candidate ID",
      },
      {
        key: "email",
        label: "Email Address",
      },
      {
        key: "contact_number",
        label: "Contact Number",
      },
      {
        key: "emiratization_flag",
        label: "Emiration Eligibity",
        formatter: (cell) => cell ? 'Yes' : 'No',
      },
    ],
  },
  {
    title: `Application Details`,
    footerTitle: "Request At",
    footerField: "created_at",
    field: [
      {
        key: "id",
        label: "Id",
        formatter: (cell, row) => <FormatID value={cell} prefix={"APP-"} />,
      },
      {
        key: "job_title",
        label: "Job Title",
        // formatter: (cell) => renderDate(cell),
      },
      {
        key: "job_description",
        label: "Job Description",
        // formatter: (cell) => renderDate(cell),
      },

      {
        key: "department",
        label: "Department",
        formatter: (cell) => renderDate(cell, "--"),
      },
      {
        key: "location",
        label: "Location",
      },
      {
        key: "job_type_name",
        label: "Job Type",
      },
      {
        key: "career_level_name",
        label: "Career Level",
      },
      {
        key: "education",
        label: "Education Requirement",
      },
      {
        key: "notice_period",
        label: "Experience Requirement",
      },
      {
        key: "application_source",
        label: "Application Source",
        formatter: (cell) => {
          return (RecruitmentApplicationSource.find(obj => obj.value === cell) || {}).label || '--';
        },
      },
      {
        key: "application_date",
        label: "Application Date",
        formatter: (cell) => renderDate(cell, "--"),
      },
    ],
  },
  {
    title: `Resume/Attachment`,
    field: [
      {
        key: "attachment",
        formatter: (cell, data) =>
          cell ? (
            <AttachmentUI
              attachment={cell}
              name={`${data.candidate_name} Resume`}
              viewOnly={true}
            />
          ) : (
            <div className="text-neutral-1000 text-sm">No letter attached</div>
          ),
      },
    ],
  },
  {
    title: "Rejection Information",
    renderSectionCondition: (data) => {
      if (data.status === 'rejected') return true;
      return false;
    },
    field: [
      {
        key: "rejected_by",
        label: "Rejected By",
        formatter: (cell) => <EmployeeName value={cell} />
      },

      {
        key: "rejected_on",
        label: "Date",
        formatter: (cell) => renderDate(cell, "--"),
      },
      {
        key: "rejection_reason",
        label: "Reason",
      },
    ],
  },
  {
    title: "Resume Bank Information",
    renderSectionCondition: (data) => {
      if (data.status === 'Resume Bank') return true;
      return false;
    },
    field: [
      {
        key: "recommended_department",
        label: "Recommended Department",
        formatter: (cell) => <DepartmentName value={cell} />
      },
      {
        key: "recommended_designation",
        label: "Recommended Designation",
        formatter: (cell) => <DesignationName value={cell} />
      },
      {
        key: "added_by",
        label: "Added By",
        formatter: (cell) => <EmployeeName value={cell} />
      },
      {
        key: "added_on",
        label: "Added Date",
        formatter: (cell) => renderDate(cell, "--"),
      },

    ],
  },
];


export const InterviewDetails = [
  {
    customContent: true,
    renderContent: (data) => {
      return (
        <div className="flex flex-wrap justify-end gap-2 items-center">
          <div className="flex justify-end gap-2 flex-wrap">
            <StatusLabel status={data.status}>
              {data?.status?.toLowerCase()}
            </StatusLabel>
          </div>
        </div>
      );
    },
  },
  {
    title: "Candidate Information",
    field: [
      {
        key: "candidate_name",
        label: "Candidate Name",
      },
      {
        key: "candidate_id",
        label: "Candidate ID",
      },
      {
        key: "email",
        label: "Email Address",
      },
      {
        key: "contact_number",
        label: "Contact Number",
      },
      {
        key: "emiratization_flag",
        label: "AI Suggested Label",
      },
      {
        key: "emiratization_flag",
        label: "AI Matched Score",
      },
    ],
  },
  {
    title: `Resume/Attachment`,
    field: [
      {
        key: "attachment",
        formatter: (cell, data) =>
          cell ? (
            <AttachmentUI
              attachment={cell}
              name={`${data.candidate_name} Resume`}
              viewOnly={true}
            />
          ) : (
            <div className="text-neutral-1000 text-sm">No letter attached</div>
          ),
      },
    ],
  },
  {
    title: `Vacancy Details`,
    field: [
      {
        key: "job_title",
        label: "Job Title",
        // formatter: (cell) => renderDate(cell),
      },
    ],
  },
  {
    title: "Interview Information",
    field: [
      {
        key: "interview_type_name",
        label: "Interview Type",
        formatter: (cell) => <EmployeeName value={cell} />
      },
      {
        key: "scheduled_datetime",
        label: "Date & Time",
        formatter: (cell) => renderDate(cell, "--", 'date-time'),
      },
      {
        key: "panel_name",
        label: "Panel Members",
        formatter: (cell) => <MultiStatusLabel statusList={cell} variant="info" displayAll={true} />
      },
      {
        key: "interview_type_name",
        label: "Generated Meeting Link",
        renderCondition: (_,data) => Boolean(data.generate_meeting_link),
      },
      {
        key: "interview_type_name",
        label: "Required Demographics",
        renderCondition: (_,data) => Boolean(data.require_demographics),
      },
    ],
  },
];