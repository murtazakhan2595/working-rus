const Config = {
  DASHBOARD: true,

  //---------------SELF_SERVICE_HUB----------

  SELF_SERVICE_HUB: true,
  //Sub modules
  MY_PROFILE: true,
  MY_ATTENDANCE: true,
  DAILY_TASK_REPORT: false,
  MY_LEAVE_TRACKER: true,
  MY_PAYROLL: false,
  MY_CLAIMS: false,
  MY_TRANSFERS: true,
  DOCUMENTS: true, // My HR Documents
  MY_ASSETS: true,
  MY_SHIFT_CALENDAR: true,
  EXIT: true,

  //----------------TEAM_MANAGEMENT------------
  TEAM_MANAGEMENT: true,
  //Sub Modules
  TEAM_PROFILE: false,
  TEAM_ATTENDANCE: false,
  TEAM_DAILY_TASK_REPORT: false,
  TEAM_LEAVE_REQUEST: true,
  TEAM_EXIT_CLEARANCE: true,

  //-------------PROFIL_MANAGMENT-----------
  PEOPLE_TEAM: true,
  //Sub Modules
  PROFILE_MANAGEMENT: true,
  EXIT_CLEARANCE: true,
  EMPLOYEE_CREATION: true,
  HR_DOCUMENTS: true,
  EMPLOYEE_TRANSFER: true,

  //-------------ATTENDANCE-----------
  ATTENDANCE: true,
  //Sub Modules
  EMPLOYEES_ATTENDANCE: true,
  SHIFT_CALENDAR: true,
  EMPLOYEE_DAILY_TASK_REPORT: false,
  TIME_ADJUSTMENTS: true,
  ATTENDANCE_UPDATES: true,

  //-------------LEAVE_MANAGEMENT-----------
  LEAVE_MANAGEMENT: true,
  //Sub Modules
  LEAVE_RECORDS: true,
  LEAVE_REQUEST: true,

  //-------------PAYROLL-----------
  PAYROLL: false,
  //Sub Modules
  EMPLOYEES_PAYROLL: false,
  SALARY_SETUP: false,
  CLAIM_REQUEST: false,
  PAY_RUN: false,
  ON_HOLD_SALARIES: false,
  END_OF_SERVICE: false,

  //-------------TASK_MANAGEMENT-----------
  TASK_MANAGEMENT: false,
  //Sub Modules
  PROJECT_BOARD: false,

  //-------------TALENT_SPHERE-----------
  TALENT_SPHERE: false,
  //Sub Modules
  JOBS: false,
  APPLICANTS: false,

  //-------------ASSET_MANAGEMENT-----------
  ASSET_MANAGEMENT: true,
  //Sub Modules
  ASSETS: true,
  REQUEST_AND_ASSIGN: true,

  //-------------ORGANIZATIONAL_CHART-----------
  ORGANIZATIONAL_CHART: true,
  //Sub Modules
  ORGANIZATION_TREE: true,
  MY_REPORTING_LINE: false,

  //-------------OFFICE_SETTING-----------
  OFFICE_SETTING: true,
  //Sub Modules
  ORGANIZATION: true,
  DEPARTMENTS: false,
  DESIGNATIONS: false,
  BRANCHES: false,
  SHIFTS: false,
  ONBOARDING_CHECKLIST: false,
  ROLE_PERMISSIONS: true,
  APPROVAL_HIERARCHY: true,
  LEAVE_SETUP: true,
};

export const URLS = [
  {
    Frontend: "https://app.cohrus.com",
    Backend: "https://hrms-be.tecbrix.cloud/api",
  },
  {
    Frontend: "https://staging-hrms.tecbrix.cloud",
    Backend: "https://staging-hrms-be.tecbrix.cloud/api",
  },
  {
    Frontend: "http://localhost:3000",
    Backend: "https://staging-hrms-be.tecbrix.cloud/api",
  },
  {
    Frontend: "https://production-hdfnfucnc9gpcaaw.z02.azurefd.net",
    Backend: "https://hrms-be.tecbrix.cloud/api",
  },
  {
    Frontend: "https://hrmsblob-fsc9g0a0b5axcufm.z02.azurefd.net",
    Backend: "https://staging-hrms-be.tecbrix.cloud/api",
  },
  {
    Frontend: "https://staging.cohrus.com",
    Backend: "https://staging-be.cohrus.com/api",
  },
];

export const WEBSOCKET_PATHS = [
  "/ws/notifications/",
  "/ws/systemnotifications/",
  "/ws/payrollnotifications/",
  "/ws/approvalnotifications/",
  "/ws/leavenotification/",
  // Add more as needed
];

export default Config;
