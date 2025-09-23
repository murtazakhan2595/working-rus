const Config = {
  DASHBOARD: true,

  //---------------SELF_SERVICE_HUB----------

  SELF_SERVICE_HUB: true,
  //Sub modules
  MY_PROFILE: true,
  MY_ATTENDANCE: true,
  DAILY_TASK_REPORT: false,
  MY_LEAVE_TRACKER: true,
  MY_PAYROLL: true,
  MY_CLAIMS: true,
  MY_TRANSFERS: true,
  DOCUMENTS: true, // My HR Documents
  MY_ASSETS: true,
  MY_PERFORMANCE: true,
  MY_SHIFT_CALENDAR: true,
  EXIT: true,
  MY_JOB_ROTATIONS: true,
  MY_CLEARANCE: true,
  MANAGER_CLEARANCE_DASHBOARD: true,
  MY_LETTER_REQUEST: true,

  //----------------TEAM_MANAGEMENT------------
  TEAM_MANAGEMENT: true,
  //Sub Modules
  TEAM_PROFILE: true,
  TEAM_ATTENDANCE: true,
  TEAM_DAILY_TASK_REPORT: false,
  TEAM_LEAVE_REQUEST: true,
  TEAM_EXIT_CLEARANCE: true,
  TEAM_PERFORMANCE_EVALUATION: true,

  //-------------PROFIL_MANAGMENT-----------
  PEOPLE_TEAM: true,
  //Sub Modules
  PROFILE_MANAGEMENT: true,
  EXIT_CLEARANCE: true,
  EMPLOYEE_CREATION: true,
  HR_DOCUMENTS: true,
  EMPLOYEE_TRANSFER: true,
  CLEARANCE_AND_HANDOVER: true,

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
  PAYROLL: true,
  //Sub Modules
  EMPLOYEES_PAYROLL: true,
  SALARY_SETUP: true,
  CLAIM_REQUEST: true,
  PAY_RUN: false,
  ON_HOLD_SALARIES: false,
  END_OF_SERVICE: false,

  //-------------TASK_MANAGEMENT-----------
  TASK_MANAGEMENT: true,
  //Sub Modules
  PROJECT_BOARD: true,

  //-------------TALENT_SPHERE-----------
  TALENT_SPHERE: true,
  //Sub Modules
  JOBS: true,
  APPLICANTS: true,

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
  CLEARANCE_CHECKLIST: true,

  //--------------Performance Edge-----------
  PERFORMANCE_EDGE: true,
  //Sub Modules
  GENERATE_FORM: true,
  PERFORMANCE_CYCLE_SETUP: true,
  PERFORMANCE_DASHBOARD: true,

  //--------------Reports-----------
  REPORTS: true,
  //Sub Modules
  PROFILE_MANAGEMENT_REPORTS: true,
  EXIT_AND_CLEARANCE_REPORTS: true,
  EMPLOYEE_CREATION_AND_HIRING: true,
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
  "/ws/performance_system/",
  "/ws/clearancenotifications/"
  // Add more as needed
];

export const APP_CODES = [
  {
    URL: 'http://localhost:3000',
    CODE: 'LOCALHOST'    
  },
  {
    URL: 'https://staging-hrms.tecbrix.cloud',
    CODE: 'STAGING'    
  },
  {
    URL: 'https://staging.cohrus.com',
    CODE: 'STAGING'    
  },
  {
    URL: 'https://app.cohrus.com',
    CODE: 'TECBRIX'    
  },
  {
    URL: 'https://alghurair.cohrus.com',
    CODE: 'ALGHURAIR_COHRUS'    
  },
  {
    URL: 'https://demo.cohrus.com',
    CODE: 'DEMO1'    
  },
  {
    URL: 'https://demo1.cohrus.com/',
    CODE: 'DEMO2'
  }
];

export const CONTROLPANEL_BASE_URL = 'https://be-control-panel.cohrus.com/api';

export default Config;
