// ✅ Tab configuration (static, no hook calls here!)
import {
    Benefits,
    AddUpdateBenefitForm,
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
} from "app/modules/TalentSphere/SettingManagement";
import Demographics from "app/modules/TalentSphere/DemographicsForm";
import { Applicants } from "app/modules/TalentSphere/ScreenedApplicants";
import {
    AllApplicants,
    ResumeBankApplicants,
} from "app/modules/TalentSphere";
import {
    GenerateOffer,
    OfferRequests,
    OffersSend,
} from 'app/modules/TalentSphere/OfferTracking';


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
        key: "feedback-form",
        label: "Feedback Forms",
        viewPerm: "VIEW_TS_BENEFITS",
        addPerm: "ADD_TS_BENEFITS",
        list: (reload) => <FeedBackForms reload={reload} />,
        form: AddUpdateFeedBackForm,
    },
    {
        key: "interview-type",
        label: "Interview Types",
        viewPerm: "ADD_TS_BENEFITS",
        addPerm: "ADD_TS_BENEFITS",
        list: (reload) => <InterviewTypes reload={reload} />,
        form: AddUpdateInterviewTypeForm,
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
        viewPerm: "VIEW_TS_REMOTE_WORK_CHECKLIST",
        addPerm: "ADD_TS_REMOTE_WORK_CHECKLIST",
        list: (reload) => <RemoteWorkChecklist reload={reload} />,
        form: AddUpdateRemoteWorkChecklistForm,
    },
    {
        key: "add-demographics",
        label: "Add Demographics",
        // no permissions required
        list: () => <Demographics />,
        form: null,
    },
    {
        key: "email-template",
        label: "Email Templates",
        // viewPerm: "VIEW_TS_BENEFITS",
        addPerm: "ADD_TS_BENEFITS",
        list: (reload) => <EmailTemplates reload={reload} />,
        form: AddUpdateEmailTemplateForm,
    },
    {
        key: "offer-letter-template",
        label: "Offer Letter Templates",
        viewPerm: "VIEW_TS_BENEFITS",
        addPerm: "ADD_TS_BENEFITS",
        list: (reload) => <OfferLetterTemplates reload={reload} />,
        form: AddUpdateOfferLetterTemplateForm,
    },
    {
        key: "blacklist-reason",
        label: "Blacklist Reasons",
        viewPerm: "VIEW_TS_BENEFITS",
        addPerm: "ADD_TS_BENEFITS",
        list: (reload) => <BlacklistReasons reload={reload} />,
        form: AddUpdateBlacklistReasonForm,
    },
];



// -----------------
// Tab Configuration
// -----------------
export const APPLICANT_TAB_CONFIG = [
    {
        label: "All Applicants",
        permission: "VIEW_TS_BENEFITS",
        component: (reload) => <AllApplicants reload={reload?.benefits} />,
    },
    {
        label: "Rejected",
        permission: "VIEW_REJECTED_APPLICATION",
        component: (reload) => <AllApplicants variant="rejected" reload={reload?.rejected} />,
    },
    {
        label: "Resume Bank",
        permission: "VIEW_RESUME_BANK_APPLICATION",
        component: (reload) => <ResumeBankApplicants reload={reload?.resume} />,
    },
    {
        label: "Screened",
        permission: "VIEW_TS_EDUCATION",
        component: () => <Applicants />,
    },
    {
        label: "Shortlisted",
        permission: "VIEW_TS_CAREER_LEVEL",
        component: () => <AllApplicants variant="shortlisted" />,
    },
    {
        label: "Blacklisted",
        permission: "VIEW_REJECTED_APPLICATION",
        component: () => <AllApplicants variant="blacklisted" />,
    },
];


export const OFFER_TAB_CONFIG = [
    {
        key: "offer-request",
        label: "Offer Letter Requests",
        viewPerm: "VIEW_TS_BENEFITS",
        addPerm: "ADD_TS_BENEFITS",
        list: (reload) => <OfferRequests reload={reload} />,
        form: GenerateOffer,
        addLabel:'Generate Offer'
    },
    {
        key: "offer-send",
        label: "Offer Send",
        viewPerm: "VIEW_TS_BENEFITS",
        // addPerm: "ADD_TS_BENEFITS",
        list: (reload) => <OffersSend reload={reload} />,
        // form: GenerateOffer,
        // addLabel:'Generate Offer'
    },
];