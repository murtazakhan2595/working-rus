export const SELF_SERVICE_PERMISSIONS = {
  // My Profile Module
  PROFILE: {
    // Personal Information
    PERSONAL_INFO: {
      VIEW: 'VIEW_PERSONAL_INFO',
      EDIT: 'EDIT_PERSONAL_INFO'
    },
    // Job Information
    JOB_INFO: {
      VIEW: 'VIEW_JOB_INFO'
    },
    // Academic Information
    ACADEMIC_INFO: {
      VIEW: 'VIEW_ACADEMIC_INFO',
      EDIT: 'EDIT_ACADEMIC_INFO'
    },
    // Experience Information
    EXPERIENCE_INFO: {
      VIEW: 'VIEW_EXPERIENCE_INFO',
      EDIT: 'EDIT_EXPERIENCE_INFO'
    },
    // Certification Information
    CERTIFICATION_INFO: {
      VIEW: 'VIEW_CERTIFICATION_INFO',
      EDIT: 'EDIT_CERTIFICATION_INFO'
    },
    // Identification Information
    IDENTIFICATION_INFO: {
      VIEW: 'VIEW_IDENTIFICATION_INFO',
      EDIT: 'EDIT_IDENTIFICATION_INFO'
    }
  },

  // My Attendance Module
  ATTENDANCE: {
    MARK: 'MARK_SELF_ATTENDANCE',
    LOG_BREAK: 'LOG_BREAK_TIME',
    VIEW_RECORDS: 'VIEW_SELF_ATTENDANCE'
  },

  // Daily Task Report Module
  DTR: {
    CREATE: 'CREATE_SELF_DTR',
    VIEW: 'VIEW_SELF_DTR',
    SUBMIT: 'SUBMIT_SELF_DTR'
  },

  // My Shift Calendar Module
  SHIFT_CALENDAR: {
    VIEW: 'VIEW_SELF_SHIFT',
    REQUEST_CHANGE: 'REQUEST_SHIFT_CHANGE'
  },

  // My Leave Tracker Module
  LEAVE: {
    REQUEST: 'REQUEST_SELF_LEAVE',
    VIEW: 'VIEW_SELF_LEAVE',
    DELETE: 'DELETE_SELF_LEAVE',
    VIEW_BALANCE: 'VIEW_LEAVE_BALANCE'
  },

  // My Payroll Module
  PAYROLL: {
    VIEW: 'VIEW_SELF_PAYROLL'
  },

  // My Claims Module
  CLAIMS: {
    REQUEST: 'REQUEST_SELF_CLAIM',
    VIEW: 'VIEW_SELF_CLAIMS',
    DELETE: 'DELETE_SELF_CLAIM'
  },

  // My Transfers Module
  TRANSFERS: {
    REQUEST: 'REQUEST_SELF_TRANSFER',
    VIEW: 'VIEW_SELF_TRANSFERS'
  },

  // HR Documents Module
  DOCUMENTS: {
    VIEW: 'VIEW_ASSIGNED_DOCUMENTS',
    MANAGE: 'MANAGE_ASSIGNED_DOCUMENTS'
  },

  // My Assets Module
  ASSETS: {
    REQUEST: 'REQUEST_SELF_ASSET',
    WITHDRAW: 'WITHDRAW_SELF_ASSET',
    VIEW: 'VIEW_SELF_ASSETS'
  },

  // Exit Module
  EXIT: {
    SUBMIT_RESIGNATION: 'SUBMIT_RESIGNATION',
    VIEW_REQUESTS: 'VIEW_EXIT_REQUESTS',
    MANAGE_TERMINATION: 'MANAGE_TERMINATION_REQUESTS'
  }
}; 