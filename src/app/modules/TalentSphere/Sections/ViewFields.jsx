import React from "react";
import { FormatID, BranchName, DepartmentName, EmployeeName, DesignationName, Currency } from "utils/getValuesFromTables";
import { renderRange, renderDate } from "utils/renderValues";
import { StatusLabel, TextUI, MultiStatusLabel, DetailContent, EmployeeDetailUI } from "components";
import AttachmentUI from "components/ui/AttachmentUI";
import { RecruitmentApplicationSource } from "data/Data";
import { RequisitionGenderOptions } from 'data/Data';

export const RequisitionViewFields = [
  {
    title: "Job Details",
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
        formatter: (cell) => <TextUI text={cell} maxLength={100} showReadmore={true} />
      },
      {
        key: "required_skillset_name",
        label: "Required Skills",
        formatter: (cell) => <MultiStatusLabel statusList={cell} variant="info" displayAll={true} />
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
        key: "countries",
        label: "Country",
        renderCondition: (_, data) => {
          if (data.work_mode === 'hybrid' || data.work_mode === 'onsite') return true;
          return false;
        }

      },
      {
        key: "cities",
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
        formatter: (cell) => {
          return (RequisitionGenderOptions.find(obj => obj.value === cell) || {}).label || '--';
        },
      },
      {
        key: "min_age",
        label: "Age Limit",
        formatter: (cell, row) => renderRange(cell, row.max_age, 'Not Defined', 'Years'),
      },
      {
        key: "education_name",
        label: "Education",
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
        formatter: (cell, row) => `${renderRange(cell, row.salary_max, 'Not Defined', Currency({ value: row.currency }))} (${row?.payment_frequency || ''})`,
      },
      {
        key: "recommended_posting_date",
        label: "Recommended Posting Date",
        formatter: (cell) => renderDate(cell),
      },
      {
        key: "justification",
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

export const ApplicantInformation = [
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
    title: "Application Details",
    footerTitle: "Request At",
    footerField: "created_at",
    field: [
      {
        key: "id",
        label: "Id",
        formatter: (cell, row) => <FormatID value={cell} prefix={"APP-"} />,
      },
      {
        key: "location",
        label: "Location",
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
        formatter: (cell) => renderDate(cell, "--", "date-time"),
      },
    ],
  },
  {
    title: `Resume/Attachment`,
    field: [
      {
        key: "resume",
        formatter: (cell, data) =>
          cell ? (
            <AttachmentUI
              attachment={cell}
              name={`${data.candidate_name} Resume`}
              viewOnly={true}
            />
          ) : (
            <div className="text-neutral-1000 text-sm">Resume not uploaded</div>
          ),
      },
    ],
  },
]
export const ShortlistingInfomation = [{
  title: "Shortlisting Info",
  field: [
    {
      key: "shortlisted_by",
      label: "Shortlisted By",
      formatter: (cell) => <EmployeeName value={cell} />
    },
    {
      key: "shortlisted_on",
      label: "Date",
      formatter: (cell) => renderDate(cell, "--", "date-time"),
    },
    {
      key: "desired_salary",
      label: "Desired Salary",
      formatter: (cell) => cell,
    },
    {
      key: "expected_joining_date",
      label: "Expected Joining Date",
      formatter: (cell) => renderDate(cell, "--"),
    },
    {
      key: "remarks",
      label: "Remarks",
      formatter: (cell) => <TextUI text={cell} maxLength={100} showReadmore={true} />

    },
  ],
},
]
export const ScreeningInfomation = [{
  title: "Screening Info",
  renderSectionCondition: (data) => {
    if (data.screened_by) return true;
    return false;
  },
  field: [
    {
      key: "screened_by",
      label: "Screened By",
      formatter: (cell) => <EmployeeName value={cell} />
    },
    {
      key: "screened_date",
      label: "Date",
      formatter: (cell) => renderDate(cell, "--", "date-time"),
    },
  ],
},
]
export const HiringInfomation = [{
  title: "Hiring Info",
  renderSectionCondition: (data) => {
    if (data.hired_by) return true;
    return false;
  },
  field: [
    {
      key: "hired_by",
      label: "Hiring By",
      formatter: (cell) => <EmployeeName value={cell} />
    },
    {
      key: "hired_at",
      label: "Date",
      formatter: (cell) => renderDate(cell, "--", "date-time"),
    },
  ],
},
]
export const VacancyDetails = [
  {
    title: `Vacancy Details`,
    footerTitle: "Request At",
    footerField: "created_at",
    field: [
      {
        key: "requisition_id",
        label: "Requisition ID",
        formatter: (cell) => <FormatID value={cell} prefix={"RR-"} />,
      },
      {
        key: "job_title",
        label: "Job Title",
      },
      {
        key: "department",
        label: "Department",
        formatter: (cell) => <DepartmentName value={cell} />,
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
        key: "education_name",
        label: "Education Requirement",
      },
      {
        key: "experience_min",
        label: "Experience Requirement",
        formatter: (cell, row) => renderRange(cell, row.experience_max, 'Not Defined', 'Years'),
      },
      {
        key: "job_description",
        label: "Job Description",
        formatter: (cell) => <TextUI text={cell} maxLength={100} showReadmore={true} />
      },
      {
        key: "approved_on",
        label: "Approval Date",
        renderCondition: (cell) => Boolean(cell),
        formatter: (cell,) => renderDate(cell, '--', 'date-time'),
      },
    ],
  },
]
export const BlacklistedInformation = [
  {
    title: "Blacklisted Info",

    field: [
      {
        key: "blacklisted_by",
        label: "Blacklisted By",
        formatter: (cell) => <EmployeeName value={cell} />
      },
      {
        key: "blacklisted_on",
        label: "Date",
        formatter: (cell) => renderDate(cell, "--", "date-time"),
      },
      {
        key: "reasons",
        label: "Reasons",
        formatter: (cell) => <MultiStatusLabel statusList={cell} variant="info" displayAll={true} />
      },

      {
        key: "remarks",
        label: "Remarks",
        formatter: (cell) => <TextUI text={cell} maxLength={100} showReadmore={true} />

      },
    ],
  },
]
export const RejectedInformation = [
  {
    title: "Rejection Information",

    field: [
      {
        key: "rejected_by",
        label: "Rejected By",
        formatter: (cell) => <EmployeeName value={cell} />
      },

      {
        key: "rejected_on",
        label: "Date",
        formatter: (cell) => renderDate(cell, "--", "date-time"),
      },
      {
        key: "rejection_reason",
        label: "Reason",
      },
    ],
  },
]
export const ResumeBankInformation = [
  {
    title: "Resume Bank Information",
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
        formatter: (cell) => renderDate(cell, "--", "date-time"),
      },

    ],

  },
]
export const InterviewDetails = [
  {
    title: (data) => `${data.index ? `${data.index + 1} - ` : ''}Interview Information`,
    field: [
      {
        key: "id",
        label: "Interview ID",
        formatter: (cell,) => <FormatID value={cell} prefix={"INT-"} />,
      },
      {
        key: "interview_type_name",
        label: "Interview Type",
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
        key: "meeting_link",
        label: "Generated Meeting Link",
        renderCondition: (_, data) => Boolean(data.generate_meeting_link),
      },
      {
        key: "require_demographics",
        label: "Required Demographics",
        formatter: (cell) => cell ? 'Yes' : 'No',
      },
      {
        key: "status",
        label: "Status",
        formatter: (cell) => <StatusLabel status={cell}>{cell?.toLowerCase()}</StatusLabel>,
      },
    ],
  },
];
export const OfferDetails = [
  {
    title: (data) => `${data.index + 1} - Offer Information`,
    field: [
      {
        key: "status",
        label: "Status",
        formatter: (cell) => <StatusLabel status={cell}>{cell?.toLowerCase()}</StatusLabel>,
      },
      {
        key: "generated_on",
        label: "Generated Date",
        formatter: (cell) => renderDate(cell, "--", 'date-time'),
      },
      {
        key: "generated_by",
        label: "Generated By",
        formatter: (cell) => <EmployeeName value={cell} />
      },
      {
        key: "offered_salary",
        label: "Offered Salary",
        formatter: (cell, row) => `${cell || '0'} ${row.currency || ''}`
      },

      {
        key: "approved_by",
        label: "Approved By",
        formatter: (cell) => <EmployeeName value={cell} />,
        renderCondition: (cell) => Boolean(cell),
      },
      {
        key: "approved_on",
        label: "Approved Date",
        renderCondition: (cell) => Boolean(cell),
        formatter: (cell) => renderDate(cell, "--", 'date-time'),
      },
      {
        key: "rejected_by",
        label: "Rejected By",
        formatter: (cell) => <EmployeeName value={cell} />,
        renderCondition: (cell) => Boolean(cell),
      },
      {
        key: "rejected_on",
        label: "Rejected Date",
        renderCondition: (cell) => Boolean(cell),
        formatter: (cell) => renderDate(cell, "--", 'date-time'),
      },
      {
        key: "template_name",
        label: "Template Used",
      },
      {
        key: "final_letter_pdf",
        label: "Offer Letter",
        formatter: (cell, data) =>
          cell ? (
            <AttachmentUI
              attachment={cell}
              name={`Offer Letter`}
              viewOnly={true}
            />
          ) : (
            <div className="text-neutral-1000 text-sm">No offer PDF</div>
          ),
      },


    ],
  },
];

export const FinalOfferLetterDetails = [
  {
    title: "Final Offer Information",
    field: [
      {
        key: "validity_date",
        label: "Validity Date",
        formatter: (cell) => renderDate(cell, "--", 'date'),
      },
      {
        key: "joining_date",
        label: "Joining Date",
        formatter: (cell) => renderDate(cell, "--", 'date'),
      },
      {
        key: "sent_by",
        label: "Sent By",
        formatter: (cell) => <EmployeeName value={cell} />
      },
      {
        key: "sent_on",
        label: "Sent Date",
        formatter: (cell) => renderDate(cell, "--", 'date-time'),
      },
      {
        key: "accepted_at",
        label: "Accepted Date",
        renderCondition: (cell) => Boolean(cell),
        formatter: (cell) => renderDate(cell, "--", 'date-time'),
      },
      {
        key: "rejected_at",
        label: "Rejected Date",
        renderCondition: (cell) => Boolean(cell),
        formatter: (cell) => renderDate(cell, "--", 'date-time'),
      },
      {
        key: "status",
        label: "Status",
        formatter: (cell) => <StatusLabel status={cell}>{cell?.toLowerCase()}</StatusLabel>,
      },
    ],
  },
];
export const FeebackDetails = [
  {
    title: "Feedback Information",
    footerTitle: "Submitted At",
    footerField: "submitted_at",
    field: [
      {
        key: "panel_member",
        formatter: (cell) => (
          <EmployeeDetailUI
            id={cell}
            InformationKeys={["name", "department", "position", "branch"]}
            ViewVariant="vertical"
            className="w-full"
          />
        ),
      },
      {
        key: "comments",
        label: "Comments / Observations",
        formatter: (cell) => <TextUI text={cell} maxLength={100} showReadmore={true} />
      },
      {
        key: "rating",
        label: "Rating",
      },
      {
        key: "recommendation",
        label: "Recommendation",
        formatter: (cell) => <div className="text-capitalize">{cell || '--'}</div>,
      },
      {
        key: "responses",
        label: "Feedback Responses",
        formatter: (cell) =>
          cell && cell.length > 0 ? (
            <ul className="list-disc pl-4 space-y-1">
              {cell.map(({ field_label, response_numeric, response_text }, idx) => (
                <li key={idx}>
                  {field_label}:{" "}
                  <strong> {response_numeric ?? response_text ?? "—"}</strong>
                </li>
              ))}
            </ul>
          ) : (
            "No responses"
          ),
      },
    ],
  },
];
export const AIGeneratedDetails = [
  {
    title: "AI Generated Feedback",
    field: [
      {
        key: "ai_match_score",
        label: "Match Score",
      },
      {
        key: "ai_matched_skills",
        label: "Matching Skills",
      },
      {
        key: "ai_missing_skills",
        label: "Missing Skills",
      },
      {
        key: "ai_suggested",
        label: "AI Suggested",
        formatter: (cell) => cell ? 'Yes' : 'No',
      },
      {
        key: "ai_feedback_confidence",
        label: "Feedback Confidence",
      },
      {
        key: "ai_feedback_recommendation",
        label: "Feedback Recommendation",
      },
      {
        key: "ai_feedback_summary",
        label: "Feedback Summary",
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
  ...(ApplicantInformation),
  {
    customContent: true,
    renderContent: (data) => {
      return (
        <DetailContent
          fields={VacancyDetails}
          currentItem={data?.publish_vacancy || {}}
        />
      );
    },
  },
  {
    customContent: true,
    renderSectionCondition: (data) => {
      if (data.resume_bank) return true;
      return false;
    },
    renderContent: (data) => {
      return (
        <DetailContent
          fields={ResumeBankInformation}
          currentItem={data?.resume_bank || {}}
        />
      );
    },
  },
  ...(ScreeningInfomation),
  {
    customContent: true,
    renderSectionCondition: (data) => {
      if (data.interviews && Array.isArray(data.interviews) && data.interviews.length > 0) return true;
      return false;
    },
    renderContent: ({ interviews }) => (interviews || []).map((interview, index) => {
      return <>
        <DetailContent
          fields={InterviewDetails}
          currentItem={{ ...interview, index } || {}}
        />
      </>
    }),
  },
  ...(AIGeneratedDetails),
  {
    customContent: true,
    renderSectionCondition: (data) => {
      if (data.recruitment_shortlist) return true;
      return false;
    },
    renderContent: (data) => {
      return (
        <DetailContent
          fields={ShortlistingInfomation}
          currentItem={data?.recruitment_shortlist || {}}
        />
      );
    },
  },
  {
    customContent: true,
    renderSectionCondition: (data) => {
      if (data.offer_letters && Array.isArray(data.offer_letters) && data.offer_letters.length > 0) return true;
      return false;
    },
    renderContent: ({ offer_letters, publish_vacancy }) => (offer_letters || []).map((letter, index) => {
      return <>
        <DetailContent
          fields={OfferDetails}
          currentItem={{ ...letter, index, currency: Currency({ value: publish_vacancy?.currency }) } || {}}
        />
      </>
    }),
  },
  {
    customContent: true,
    renderSectionCondition: (data) => {
      if (data.blacklist) return true;
      return false;
    },
    renderContent: (data) => {
      return (
        <DetailContent
          fields={BlacklistedInformation}
          currentItem={data?.blacklist || {}}
        />
      );
    },
  },
  {
    customContent: true,
    renderSectionCondition: (data) => {
      if (data.recruitment_rejected) return true;
      return false;
    },
    renderContent: (data) => {
      return (
        <DetailContent
          fields={RejectedInformation}
          currentItem={data?.recruitment_rejected || {}}
        />
      );
    },
  },
  {
    customContent: true,
    renderSectionCondition: (data) => {
      if (data.offers_tracking) return true;
      return false;
    },
    renderContent: (data) => {
      return (
        <DetailContent
          fields={FinalOfferLetterDetails}
          currentItem={data?.offers_tracking || {}}
        />
      );
    },
  },
  ...(HiringInfomation),
];


export const AllInterviewDetails = [{
  customContent: true,
  renderSectionCondition: (data) => {
    if (data.interviews && Array.isArray(data.interviews) && data.interviews.length > 0) return true;
    return false;
  },
  renderContent: ({ interviews }) => (interviews || []).map((interview, index) => {
    return <>
      <DetailContent
        fields={InterviewDetails}
        currentItem={{ ...interview, index } || {}}
      />
    </>
  }),
},
{
  customContent: true,
  renderSectionCondition: (data) => {
    if (data.interview_feedbacks && Array.isArray(data.interview_feedbacks) && data.interview_feedbacks.length > 0) return true;
    return false;
  },
  renderContent: ({ interview_feedbacks }) => (interview_feedbacks || []).map((interview_feedback, index) => {
    return <>
      <DetailContent
        fields={FeebackDetails}
        currentItem={{ ...interview_feedback, index } || {}}
      />
    </>
  }),
},
...(AIGeneratedDetails),
];
export const AllOfferDetails = [
  {
    customContent: true,
    renderSectionCondition: (data) => {
      if (data.offer_letters && Array.isArray(data.offer_letters) && data.offer_letters.length > 0) return true;
      return false;
    },
    renderContent: ({ offer_letters, publish_vacancy }) => (offer_letters || []).map((letter, index) => {
      return <>
        <DetailContent
          fields={OfferDetails}
          currentItem={{ ...letter, index, currency: Currency({ value: publish_vacancy?.currency }) } || {}}
        />
      </>
    }),
  },
  {
    customContent: true,
    renderSectionCondition: (data) => {
      if (data?.offers_tracking) return true;
      return false;
    },
    renderContent: ({ offers_tracking }) => (
      <DetailContent
        fields={FinalOfferLetterDetails}
        currentItem={offers_tracking || {}}
      />
    ),
  },
];

export const ExportApplicantsRecord = (row, Currencies) => {
  console.log(row);
  const currency = ((Currencies || []).find((option) => option.value === parseInt(row?.publish_vacancy?.currency)))?.code;
  return {
    ID: row.serial_id,
    'Candidate Name': row.candidate_id,
    'Candidate Name': row.candidate_name,
    Status: row.status,
    Email: row.email,
    'Contact Number': row.contact_number,
    'Application Source': row.application_source,
    'Emiratization Flag': row.emiratization_flag,
    'Job Position': row.job_title,
    Department: row.vacancy_department,
    'Application Date': renderDate(row.application_date, '--', "date-time"),
    Location: row.location,
    'Screened By': row.screened_by,
    'Screened Date': renderDate(row.screened_date, '--', "date-time"),
    'AI Match Score': row.ai_match_score,
    'AI Match Skills': row.ai_matched_skills,
    'AI Missing Skills': row.ai_missing_skills,
    'AI Suggested': row.ai_suggested ? 'Yes' : 'No',
    'Joining Date': renderDate(row.offers_tracking?.joining_date),
    'Offered Salary': row?.offer_letters && row?.offer_letters.length > 0 ? `${row?.offer_letters[row?.offer_letters.length - 1]?.offered_salary} ${currency || ''} (${row?.publish_vacancy?.payment_frequency || ""})` : "",
  };
}


export const InterviewDetailsForPenalist = [
  ...(ApplicantInformation),
  ...(InterviewDetails),
]


