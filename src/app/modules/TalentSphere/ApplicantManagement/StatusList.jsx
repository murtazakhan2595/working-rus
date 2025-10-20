// nextOptions: [{ status:}' new, rejected, resume_bank, screened, in_progress, hired, shortlisted, blacklisted, hold']

export const ApplicantStatusList = {
    new: [
        { status: 'resume_bank', label: 'Resume Bank', variant: 'outline', permission: 'update-status' },
        { status: 'screened', label: 'Screen Application', variant: 'success', permission: 'update-status' },
        { status: 'rejected', label: 'Reject Application', variant: 'destructive', permission: 'update-status' },
    ],
    'resume bank': [
        { status: 'remove-resume-bank', label: 'Remove From Resume Bank', variant: 'default', permission: 'update-status' },
    ],
    hold: [
        { status: 'revert_hold', label: 'Revert Hold', variant: 'default', permission: 'update-status' },
    ],
    screened: [
        { status: 'schedule-interview', label: 'Schedule Interview', variant: 'default',permission: 'schedule-interview'  },
    ],
    blacklisted: [
        { status: 'view-feedback', label: 'View Feedback', variant: 'outline' ,permission: 'view-feedback'},
        { status: 'remove_blacklist', label: 'Remove from Blacklist', variant: 'default', permission: 'update-status' },
    ],
    shortlisted: [
        { status: 'view-feedback', label: 'View Feedback', variant: 'outline', permission: 'view-feedback' },
        { status: 'generate-offer', label: 'Generate Offer Letter', variant: 'default' , permission: 'generate-offer'},
    ],
    hired: [
        { status: 'view-feedback', label: 'View Feedback', variant: 'outline', permission: 'view-feedback' },
    ],
    rejected: [
        { status: 'view-feedback', label: 'View Feedback', variant: 'outline', permission: 'view-feedback' },
    ],
    'in progress': [ // status when applicant and interview status is in progress 
        { status: 'view-feedback', label: 'View Feedback', variant: 'outline', permission: 'view-feedback' },
        { status: 'reschedule-interview', label: 'Reschedule Interview', variant: 'default',permission: 'schedule-interview' },
        { status: 'hold', label: 'Hold', variant: 'continue',  permission: 'update-status'},
        { status: 'shortlisted', label: 'Shortlisted Application', variant: 'success', permission: 'update-status' },
        { status: 'rejected', label: 'Reject Application', variant: 'destructive', permission: 'update-status' },
        { status: 'blacklisted', label: 'Blacklist Application', variant: 'default', permission: 'update-status' },
    ],
    // feedack: [ // status when applicant and interview status is in progress 
    //     { status: 'add-feedback', label: 'Add Feedback', variant: 'outline', permission: 'add-feedback' },
    // ]
}