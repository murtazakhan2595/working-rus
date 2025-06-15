# Self Service Hub - Permissions Implementation Guide

## Table of Contents
1. [Permission Structure](#permission-structure)
2. [Implementation Guide](#implementation-guide)
3. [Module-Specific Examples](#module-specific-examples)
4. [Integration Guide](#integration-guide)

## Permission Structure

### Permission Keys

```javascript
const SELF_SERVICE_PERMISSIONS = {
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
```

## Implementation Guide

### 1. Custom Hook for Self Service Permissions

```javascript
// hooks/useSelfServicePermissions.js

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

    // Leave Permissions
    leave: {
      canRequest: permissions.includes(SELF_SERVICE_PERMISSIONS.LEAVE.REQUEST),
      canView: permissions.includes(SELF_SERVICE_PERMISSIONS.LEAVE.VIEW),
      canDelete: permissions.includes(SELF_SERVICE_PERMISSIONS.LEAVE.DELETE),
      canViewBalance: permissions.includes(SELF_SERVICE_PERMISSIONS.LEAVE.VIEW_BALANCE)
    },

    // Other module permissions...
  };
};
```

### 2. Protected Route Configuration

```javascript
// routes/selfServiceRoutes.js

const selfServiceRoutes = [
  {
    path: '/self-service/profile',
    element: (
      <ProtectedRoute
        permissions={[SELF_SERVICE_PERMISSIONS.PROFILE.PERSONAL_INFO.VIEW]}
        component={MyProfile}
      />
    )
  },
  {
    path: '/self-service/attendance',
    element: (
      <ProtectedRoute
        permissions={[SELF_SERVICE_PERMISSIONS.ATTENDANCE.VIEW_RECORDS]}
        component={MyAttendance}
      />
    )
  },
  // ... other routes
];
```

### 3. Component Implementation Examples

```javascript
// components/MyProfile/PersonalInformation.jsx

const PersonalInformation = () => {
  const { profile } = useSelfServicePermissions();
  
  if (!profile.personal.canView) {
    return <UnauthorizedAccess />;
  }

  return (
    <div className="personal-info">
      <h2>Personal Information</h2>
      
      <InfoDisplay data={personalData} />
      
      {profile.personal.canEdit && (
        <EditButton onClick={handleEdit} />
      )}
    </div>
  );
};

// components/MyAttendance/AttendanceMarking.jsx

const AttendanceMarking = () => {
  const { attendance } = useSelfServicePermissions();

  return (
    <div className="attendance-marking">
      {attendance.canMark && (
        <MarkAttendanceButton onClick={handleMarkAttendance} />
      )}
      
      {attendance.canLogBreak && (
        <LogBreakButton onClick={handleLogBreak} />
      )}
      
      {attendance.canView && (
        <AttendanceHistory />
      )}
    </div>
  );
};
```

### 4. API Integration

```javascript
// services/selfServiceApi.js

export const selfServiceApi = {
  // Profile APIs
  updatePersonalInfo: async (data) => {
    return await authorizedApi.put('/self-service/profile/personal', data, {
      requiresPermission: SELF_SERVICE_PERMISSIONS.PROFILE.PERSONAL_INFO.EDIT
    });
  },

  // Attendance APIs
  markAttendance: async () => {
    return await authorizedApi.post('/self-service/attendance/mark', {
      requiresPermission: SELF_SERVICE_PERMISSIONS.ATTENDANCE.MARK
    });
  },

  // Leave APIs
  applyLeave: async (leaveData) => {
    return await authorizedApi.post('/self-service/leave/apply', leaveData, {
      requiresPermission: SELF_SERVICE_PERMISSIONS.LEAVE.REQUEST
    });
  }
};
```

## Module-Specific Examples

### 1. My Profile Module

```javascript
// modules/SelfService/MyProfile/index.jsx

const MyProfile = () => {
  const { profile } = useSelfServicePermissions();

  return (
    <div className="my-profile">
      <PermissionWrapper
        permissions={SELF_SERVICE_PERMISSIONS.PROFILE.PERSONAL_INFO.VIEW}
      >
        <PersonalInformation />
      </PermissionWrapper>

      <PermissionWrapper
        permissions={SELF_SERVICE_PERMISSIONS.PROFILE.JOB_INFO.VIEW}
      >
        <JobInformation />
      </PermissionWrapper>

      {/* Other sections */}
    </div>
  );
};
```

### 2. My Attendance Module

```javascript
// modules/SelfService/MyAttendance/index.jsx

const MyAttendance = () => {
  const { attendance } = useSelfServicePermissions();

  return (
    <div className="my-attendance">
      <AttendanceActions
        canMark={attendance.canMark}
        canLogBreak={attendance.canLogBreak}
      />

      {attendance.canView && (
        <AttendanceHistory />
      )}
    </div>
  );
};
```

### 3. Leave Management Module

```javascript
// modules/SelfService/MyLeave/index.jsx

const MyLeave = () => {
  const { leave } = useSelfServicePermissions();

  return (
    <div className="my-leave">
      {leave.canRequest && (
        <LeaveRequestForm />
      )}

      {leave.canView && (
        <LeaveHistory 
          canDelete={leave.canDelete}
        />
      )}

      {leave.canViewBalance && (
        <LeaveBalance />
      )}
    </div>
  );
};
```

## Integration Guide

### 1. Redux Store Integration

```javascript
// state/slices/selfServiceSlice.js

const selfServiceSlice = createSlice({
  name: 'selfService',
  initialState: {
    permissions: [],
    loading: false,
    error: null
  },
  reducers: {
    setPermissions: (state, action) => {
      state.permissions = action.payload;
    }
  }
});
```

### 2. Navigation Integration

```javascript
// components/SelfServiceNavigation.jsx

const SELF_SERVICE_MENU = [
  {
    label: 'My Profile',
    path: '/self-service/profile',
    permission: SELF_SERVICE_PERMISSIONS.PROFILE.PERSONAL_INFO.VIEW
  },
  {
    label: 'My Attendance',
    path: '/self-service/attendance',
    permission: SELF_SERVICE_PERMISSIONS.ATTENDANCE.VIEW_RECORDS
  },
  // ... other menu items
];

const SelfServiceNavigation = () => {
  const permissions = useSelector(state => state.auth.permissions);

  return (
    <nav className="self-service-nav">
      {SELF_SERVICE_MENU.map(item => {
        if (!permissions.includes(item.permission)) return null;

        return (
          <NavLink
            key={item.path}
            to={item.path}
          >
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );
};
```

### 3. Error Handling

```javascript
// components/SelfServiceErrorBoundary.jsx

class SelfServiceErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    if (error.name === 'PermissionError') {
      // Log permission error
      console.error('Permission Error in Self Service:', error);
    }
  }

  render() {
    if (this.state.hasError) {
      return <SelfServiceErrorPage />;
    }

    return this.props.children;
  }
}
```

Would you like me to:
1. Create implementation examples for specific features?
2. Add more detailed error handling?
3. Show how to integrate this with your existing components?
4. Add testing examples for the permission-based functionality? 