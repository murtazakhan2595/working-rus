import React from "react";
import { FormatID, BranchName, DepartmentName, EmployeeName, DesignationName } from "utils/getValuesFromTables";
import { renderRange, renderDate } from "utils/renderValues";
import { StatusLabel, SheetUI, MultiStatusLabel, DetailContent, EmployeeDetailUI } from "components";
import AttachmentUI from "components/ui/AttachmentUI";
import { RecruitmentApplicationSource } from "data/Data";
import { DetailBox, DetailCard } from "components/SheetCardExtension";

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
        key: "required_skillset_name",
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
        key: "education_name",
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
        formatter: (cell) => renderDate(cell, "--"),
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
            <div className="text-neutral-1000 text-sm">No letter attached</div>
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
      formatter: (cell) => renderDate(cell, "--"),
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
      formatter: (cell) => cell,
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
      formatter: (cell) => renderDate(cell, "--"),
    },
  ],
},
]
export const VacancyDetails = [
  {
    title: `Vacancy Details`,
    field: [
      {
        key: "job_title",
        label: "Job Title",
        // formatter: (cell) => renderDate(cell),
      },
      {
        key: "department",
        label: "Department",
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
        // formatter: (cell) => renderDate(cell),
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
        formatter: (cell) => renderDate(cell, "--"),
      },
      {
        key: "reasons",
        label: "Reasons",
        formatter: (cell) => <MultiStatusLabel statusList={cell} variant="info" displayAll={true} />
      },

      {
        key: "remarks",
        label: "Remarks",
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
        formatter: (cell) => renderDate(cell, "--"),
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
        formatter: (cell) => renderDate(cell, "--"),
      },

    ],

  },
]
export const InterviewDetails = [
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
        key: "meeting_link",
        label: "Generated Meeting Link",
        renderCondition: (_, data) => Boolean(data.generate_meeting_link),
      },
      {
        key: "interview_type_name",
        label: "Required Demographics",
        renderCondition: (_, data) => Boolean(data.require_demographics),
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
    title: "Offer Information",
    field: [
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
        formatter: (cell) => `${cell || '0'}`
      },
      {
        key: "status",
        label: "Status",
        formatter: (cell) => <StatusLabel status={cell}>{cell?.toLowerCase()}</StatusLabel>,
      },
    ],
  },
  {
    title: `Offer Letter`,
    field: [
      {
        key: 'final_letter_pdf',
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
      if (data.offer_letter && Array.isArray(data.offer_letter) && data.offer_letter.length > 0) return true;
      return false;
    },
    renderContent: ({ offer_letter }) => (offer_letter || []).map((letter, index) => {
      return <>
        <DetailContent
          fields={OfferDetails}
          currentItem={{ ...letter, index } || {}}
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
      if (data.offer_letter && Array.isArray(data.offer_letter) && data.offer_letter.length > 0) return true;
      return false;
    },
    renderContent: ({ offer_letter, }) => (offer_letter || []).map((letter, index) => {
      return <>
        <DetailContent
          fields={OfferDetails}
          currentItem={{ ...letter, index } || {}}
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


