import { useSelector } from 'react-redux';
import { SELF_SERVICE_PERMISSIONS } from '../permissions/constants';

export const useSelfServicePermissions = () => {
  const permissions = useSelector(state => state.auth.permissions);

  return {
    // Profile Permissions
    profile: {
      personal: {
        canView: permissions.includes(SELF_SERVICE_PERMISSIONS.PROFILE.PERSONAL_INFO.VIEW),
        canEdit: permissions.includes(SELF_SERVICE_PERMISSIONS.PROFILE.PERSONAL_INFO.EDIT)
      },
      job: {
        canView: permissions.includes(SELF_SERVICE_PERMISSIONS.PROFILE.JOB_INFO.VIEW)
      },
      academic: {
        canView: permissions.includes(SELF_SERVICE_PERMISSIONS.PROFILE.ACADEMIC_INFO.VIEW),
        canEdit: permissions.includes(SELF_SERVICE_PERMISSIONS.PROFILE.ACADEMIC_INFO.EDIT)
      },
      experience: {
        canView: permissions.includes(SELF_SERVICE_PERMISSIONS.PROFILE.EXPERIENCE_INFO.VIEW),
        canEdit: permissions.includes(SELF_SERVICE_PERMISSIONS.PROFILE.EXPERIENCE_INFO.EDIT)
      },
      certification: {
        canView: permissions.includes(SELF_SERVICE_PERMISSIONS.PROFILE.CERTIFICATION_INFO.VIEW),
        canEdit: permissions.includes(SELF_SERVICE_PERMISSIONS.PROFILE.CERTIFICATION_INFO.EDIT)
      },
      identification: {
        canView: permissions.includes(SELF_SERVICE_PERMISSIONS.PROFILE.IDENTIFICATION_INFO.VIEW),
        canEdit: permissions.includes(SELF_SERVICE_PERMISSIONS.PROFILE.IDENTIFICATION_INFO.EDIT)
      }
    },

    // Attendance Permissions
    attendance: {
      canMark: permissions.includes(SELF_SERVICE_PERMISSIONS.ATTENDANCE.MARK),
      canLogBreak: permissions.includes(SELF_SERVICE_PERMISSIONS.ATTENDANCE.LOG_BREAK),
      canView: permissions.includes(SELF_SERVICE_PERMISSIONS.ATTENDANCE.VIEW_RECORDS)
    },

    // DTR Permissions
    dtr: {
      canCreate: permissions.includes(SELF_SERVICE_PERMISSIONS.DTR.CREATE),
      canView: permissions.includes(SELF_SERVICE_PERMISSIONS.DTR.VIEW),
      canSubmit: permissions.includes(SELF_SERVICE_PERMISSIONS.DTR.SUBMIT)
    },

    // Shift Calendar Permissions
    shiftCalendar: {
      canView: permissions.includes(SELF_SERVICE_PERMISSIONS.SHIFT_CALENDAR.VIEW),
      canRequestChange: permissions.includes(SELF_SERVICE_PERMISSIONS.SHIFT_CALENDAR.REQUEST_CHANGE)
    },

    // Leave Permissions
    leave: {
      canRequest: permissions.includes(SELF_SERVICE_PERMISSIONS.LEAVE.REQUEST),
      canView: permissions.includes(SELF_SERVICE_PERMISSIONS.LEAVE.VIEW),
      canDelete: permissions.includes(SELF_SERVICE_PERMISSIONS.LEAVE.DELETE),
      canViewBalance: permissions.includes(SELF_SERVICE_PERMISSIONS.LEAVE.VIEW_BALANCE)
    },

    // Payroll Permissions
    payroll: {
      canView: permissions.includes(SELF_SERVICE_PERMISSIONS.PAYROLL.VIEW)
    },

    // Claims Permissions
    claims: {
      canRequest: permissions.includes(SELF_SERVICE_PERMISSIONS.CLAIMS.REQUEST),
      canView: permissions.includes(SELF_SERVICE_PERMISSIONS.CLAIMS.VIEW),
      canDelete: permissions.includes(SELF_SERVICE_PERMISSIONS.CLAIMS.DELETE)
    },

    // Transfers Permissions
    transfers: {
      canRequest: permissions.includes(SELF_SERVICE_PERMISSIONS.TRANSFERS.REQUEST),
      canView: permissions.includes(SELF_SERVICE_PERMISSIONS.TRANSFERS.VIEW)
    },

    // Documents Permissions
    documents: {
      canView: permissions.includes(SELF_SERVICE_PERMISSIONS.DOCUMENTS.VIEW),
      canManage: permissions.includes(SELF_SERVICE_PERMISSIONS.DOCUMENTS.MANAGE)
    },

    // Assets Permissions
    assets: {
      canRequest: permissions.includes(SELF_SERVICE_PERMISSIONS.ASSETS.REQUEST),
      canWithdraw: permissions.includes(SELF_SERVICE_PERMISSIONS.ASSETS.WITHDRAW),
      canView: permissions.includes(SELF_SERVICE_PERMISSIONS.ASSETS.VIEW)
    },

    // Exit Permissions
    exit: {
      canSubmitResignation: permissions.includes(SELF_SERVICE_PERMISSIONS.EXIT.SUBMIT_RESIGNATION),
      canViewRequests: permissions.includes(SELF_SERVICE_PERMISSIONS.EXIT.VIEW_REQUESTS),
      canManageTermination: permissions.includes(SELF_SERVICE_PERMISSIONS.EXIT.MANAGE_TERMINATION)
    }
  };
}; 