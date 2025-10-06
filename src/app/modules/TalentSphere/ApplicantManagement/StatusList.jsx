// nextOptions: [{ status:}' new, rejected, resume_bank, screened, in_progress, hired, shortlisted, blacklisted, hold']

export const ApplicantStatusList = {
    new: [
        { status: 'resume_bank', label: 'Resume Bank', variant: 'outline' },
        { status: 'screened', label: 'Screen Application', variant: 'success' },
        { status: 'rejected', label: 'Reject Application', variant: 'destructive' },
    ],
    blacklisted: [
        { status: 'view-feedback', label: 'View Feedback', variant: 'outline' },
        { status: 'remove_blacklist', label: 'Remove from Blacklist', variant: 'default' },
    ],
    shortlisted: [
        { status: 'view-feedback', label: 'View Feedback', variant: 'outline' },
        { status: 'generate-offer', label: 'Generate Offer Letter', variant: 'default' },
    ],
    'in progress': [ // status when applicant and interview status is in progress 
        { status: 'view-feedback', label: 'View Feedback', variant: 'outline' },
        { status: 'reschedule-interview', label: 'Reschedule Interview', variant: 'default' },
        { status: 'hold', label: 'Hold', variant: 'continue' },
        { status: 'shortlisted', label: 'Shortlisted Application', variant: 'success' },
        { status: 'rejected', label: 'Reject Application', variant: 'destructive' },
        { status: 'blacklisted', label: 'Blacklist Application', variant: 'default' },
    ],
    feedack: [ // status when applicant and interview status is in progress 
        { status: 'add-feedback', label: 'Add Feedback', variant: 'outline' },
    ]
}