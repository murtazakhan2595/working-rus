// ✅ Tab configuration (static, no hook calls here!)
import {
    Benefits,
    AddUpdateBenefitForm,
    Skills,
    AddUpdateSkillForm,
    BlacklistReasons,
    AddUpdateBlacklistReasonForm,
    OfferLetterTemplates,
    AddUpdateOfferLetterTemplateForm,
    FeedBackForms,
    AddUpdateFeedBackForm,
    InterviewTypes,
    AddUpdateInterviewTypeForm,
    CareerLevels,
    AddUpdateCareerLevelForm,
    Educations,
    AddUpdateEducationForm,
    JobTypes,
    AddUpdateJobTypeForm,
    RemoteWorkChecklist,
    AddUpdateRemoteWorkChecklistForm,
    EmailTemplates,
    AddUpdateEmailTemplateForm,
    DemoGraphics,
} from "app/modules/TalentSphere/SettingManagement";
import {
    TeamManpowerHeadcount,
    AddUpdateManpowerHeadcountRequest,
    ManpowerHeadCountRequest,
    ScheduledInterviews,
} from 'app/modules/TalentSphere/TeamTalentSphere';
import { AllApplicants } from "app/modules/TalentSphere";
import {
    RequisitionRequests,
    AddUpdateRequisitionRequestForm,
} from "app/modules/TalentSphere/Requisitions";
import {
    GenerateOffer,
    OfferRequests,
    ApplicantOffers,
} from 'app/modules/TalentSphere/OfferTracking';
import {
    ApplicantInformation,
    ShortlistingInfomation,
    ScreeningInfomation,
    VacancyDetails,
    AllInterviewDetails,
    AllOfferDetails,
    BlacklistedInformation,
    RejectedInformation,
    HiringInfomation,
} from 'app/modules/TalentSphere/Sections';

// 🔹 Central config for all tabs
export const SETTING_TAB_CONFIG = [
    {
        key: "benefits",
        label: "Benefits",
        viewPerm: "VIEW_TS_BENEFITS",
        addPerm: "ADD_TS_BENEFITS",
        list: (reload) => <Benefits reload={reload} />,
        form: AddUpdateBenefitForm,
    },
    {
        key: "career-level",
        label: "Career Level",
        viewPerm: "VIEW_TS_CAREER_LEVEL",
        addPerm: "ADD_TS_CAREER_LEVEL",
        list: (reload) => <CareerLevels reload={reload} />,
        form: AddUpdateCareerLevelForm,
    },
    {
        key: "skills",
        label: "Skills",
        viewPerm: "VIEW_TS_SKILLS",
        addPerm: "ADD_TS_SKILLS",
        list: (reload) => <Skills reload={reload} />,
        form: AddUpdateSkillForm,
    },
    {
        key: "education",
        label: "Education",
        viewPerm: "VIEW_TS_EDUCATION",
        addPerm: "ADD_TS_EDUCATION",
        list: (reload) => <Educations reload={reload} />,
        form: AddUpdateEducationForm,
    },
    {
        key: "job-type",
        label: "Job Types",
        viewPerm: "VIEW_TS_JOB_TYPE",
        addPerm: "ADD_TS_JOB_TYPE",
        list: (reload) => <JobTypes reload={reload} />,
        form: AddUpdateJobTypeForm,
    },
    {
        key: "checklist",
        label: "Remote Work Checklist",
        addLabel: "Add Checklist Item",
        viewPerm: "VIEW_TS_REMOTE_WORK_CHECKLIST",
        addPerm: "ADD_TS_REMOTE_WORK_CHECKLIST",
        list: (reload) => <RemoteWorkChecklist reload={reload} />,
        form: AddUpdateRemoteWorkChecklistForm,
    },
    {
        key: "add-demographics",
        label: "Demographics Form",
        // no permissions required
        list: () => <DemoGraphics />,
        form: null,
    },
    {
        key: "feedback-form",
        label: "Feedback Forms",
        viewPerm: "VIEW_INTERVIEW_FEEDBACK_FORMS",
        addPerm: "ADD_INTERVIEW_FEEDBACK_FORM",
        list: (reload) => <FeedBackForms reload={reload} />,
        form: AddUpdateFeedBackForm,
    },
    {
        key: "interview-type",
        label: "Interview Types",
        viewPerm: "VIEW_INTERVIEW_TYPES",
        addPerm: "ADD_INTERVIEW_TYPE",
        list: (reload) => <InterviewTypes reload={reload} />,
        form: AddUpdateInterviewTypeForm,
    },
    {
        key: "email-template",
        label: "Email Templates",
        viewPerm: "VIEW_TS_EMAIL_TEMPLATES",
        addPerm: "ADD_TS_EMAIL_TEMPLATE",
        list: (reload) => <EmailTemplates reload={reload} />,
        form: AddUpdateEmailTemplateForm,
    },
    {
        key: "offer-letter-template",
        label: "Offer Letter Templates",
        viewPerm: "VIEW_TS_OFFER_LETTER_TEMPLATES",
        addPerm: "ADD_TS_OFFER_LETTER_TEMPLATE",
        list: (reload) => <OfferLetterTemplates reload={reload} />,
        form: AddUpdateOfferLetterTemplateForm,
    },
    {
        key: "blacklist-reason",
        label: "Blacklist Reasons",
        viewPerm: "VIEW_BLACKLIST_REASON",
        addPerm: "ADD_BLACKLIST_REASON",
        list: (reload) => <BlacklistReasons reload={reload} />,
        form: AddUpdateBlacklistReasonForm,
    },
];
export const TEAM_TALENT_SPHERE_TAB_CONFIG = [
    {
        key: "headcount-request",
        label: "Manpower Headcount",
        viewPerm: "VIEW_TEAM_MANPOWER_HEADCOUNT",
        addPerm: "REQUEST_MANPOWER_HEADCOUNT",
        list: (reload) => <TeamManpowerHeadcount reload={reload} />,
        form: AddUpdateManpowerHeadcountRequest,
    },
    {
        key: "headcount-request",
        label: "Manpower Headcount Request",
        viewPerm: "VIEW_TEAM_MANPOWER_HEADCOUNT",
        addPerm: "REQUEST_MANPOWER_HEADCOUNT",
        list: (reload) => <ManpowerHeadCountRequest reload={reload} />,
        form: AddUpdateManpowerHeadcountRequest,
    },
    {
        key: "requisition-request",
        label: "Requisition Request",
        viewPerm: "VIEW_REQUISITION_REQUEST_CREATED",
        addPerm: "CREATE_REQUISITION_REQUEST",
        list: (reload) => <RequisitionRequests reload={reload} />,
        form: AddUpdateRequisitionRequestForm,
    },
    {
        key: "interviews",
        label: "Applicant Interviews",
        viewPerm: "VIEW_APPLICANT_INTERVIEW_AS_PANELIST",
        list: (reload) => <ScheduledInterviews reload={reload} />,
    },
];

export const APPLICANT_TAB_CONFIG = [
    {
        label: "All Applicants",
        permission: "VIEW_TS_BENEFITS",
        component: (reload, deepLinkFilterData) => <AllApplicants reload={reload} deepLinkFilterData={deepLinkFilterData} />,
    },
    {
        label: "AI Talent Picks",
        permission: "VIEW_TS_BENEFITS",
        component: (reload, deepLinkFilterData) => <AllApplicants variant="ai_picks" deepLinkFilterData={deepLinkFilterData} />,
    },
    {
        label: "Screened",
        permission: "VIEW_TS_EDUCATION",
        component: (reload, deepLinkFilterData) => <AllApplicants variant="screened" reload={reload} deepLinkFilterData={deepLinkFilterData} />,
    },
    {
        label: "Shortlisted",
        permission: "VIEW_TS_CAREER_LEVEL",
        component: (reload, deepLinkFilterData) => <AllApplicants variant="shortlisted" reload={reload} deepLinkFilterData={deepLinkFilterData} />,
    },
    {
        label: "Rejected",
        permission: "VIEW_REJECTED_APPLICATION",
        component: (reload, deepLinkFilterData) => <AllApplicants variant="rejected" reload={reload} deepLinkFilterData={deepLinkFilterData} />,
    },
    {
        label: "Blacklisted",
        permission: "VIEW_REJECTED_APPLICATION",
        component: (reload, deepLinkFilterData) => <AllApplicants variant="blacklisted" reload={reload} deepLinkFilterData={deepLinkFilterData} />,
    },
    
];


export const OFFER_TAB_CONFIG = [
    {
        key: "offer-request",
        label: "Offer Letter Requests",
        viewPerm: "VIEW_TS_BENEFITS",
        addPerm: "GENERATE_OFFER_LETTER",
        list: (reload, deepLinkFilterData, deepLinkSubTab) => <OfferRequests reload={reload} deepLinkFilterData={deepLinkFilterData} deepLinkSubTab={deepLinkSubTab} />,
        form: GenerateOffer,
        addLabel: 'Generate Offer'
    },
    {
        key: "offer-send",
        label: "Applicant Offers",
        viewPerm: "VIEW_OFFER_SEND_TO_APPLICANT",
        list: (reload, deepLinkFilterData, deepLinkSubTab) => <ApplicantOffers reload={reload} deepLinkFilterData={deepLinkFilterData} deepLinkSubTab={deepLinkSubTab} />,
    },
    {
        label: "Hired Applicants",
        permission: "VIEW_HIRED_APPLICANTS",
        list: (reload, deepLinkFilterData) => <AllApplicants variant="hired" reload={reload} deepLinkFilterData={deepLinkFilterData} />,
    },
];


export const APPLICANT_PROFILE_TAB_CONFIG = [
    {
        label: "Requisition Info",
        infoFields: VacancyDetails,
        dataKey: "publish_vacancy",
    },
    {
        label: "Applicant Info",
        infoFields: ApplicantInformation,

    },
    {
        label: "Screening Info",
        infoFields: ScreeningInfomation,
        key:'screened_by',
    },
    {
        label: "Interview Details",
        infoFields: AllInterviewDetails,
        key:"interviews"
    },
    {
        label: "Offer Details",
        infoFields: AllOfferDetails,
        key:'offer_letters'
    },
    {
        label: "Shortlising Info",
        infoFields: ShortlistingInfomation,
        dataKey: "recruitment_shortlist",
    },
    {
        label: "Rejection Details",
        infoFields: RejectedInformation,
        dataKey: "recruitment_rejected",
    },
    {
        label: "Backlisting Info",
        infoFields: BlacklistedInformation,
        dataKey: "blacklist",
    },
    {
        label: "Demographics",
        dataKey: null,
        customComponent: true, // Flag to indicate this uses a custom component
        key:"interviews"
    },
    {
        label: "Hiring Info",
        infoFields: HiringInfomation,
        key:'hired_by',
    },
];