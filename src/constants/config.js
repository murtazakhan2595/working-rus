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
  MY_CLAIMS: true,
  MY_TRANSFERS: true,
  DOCUMENTS: true, // My HR Documents
  MY_ASSETS: true,
  MY_PERFORMANCE: false,
  MY_SHIFT_CALENDAR: true,
  EXIT: true,
  MY_JOB_ROTATIONS: false,
  MY_CLEARANCE: false,
  MY_LETTER_REQUEST: false,

  //----------------TEAM_MANAGEMENT------------
  TEAM_MANAGEMENT: true,
  //Sub Modules
  TEAM_PROFILE: true,
  TEAM_ATTENDANCE: true,
  TEAM_DAILY_TASK_REPORT: false,
  TEAM_LEAVE_REQUEST: true,
  TEAM_EXIT_CLEARANCE: true,
  TEAM_PERFORMANCE_EVALUATION: false,
  TEAM_TALENT_SPHERE: false,
  MANAGER_CLEARANCE_DASHBOARD: false,


  //-------------PROFIL_MANAGMENT-----------
  PEOPLE_TEAM: true,
  //Sub Modules
  PROFILE_MANAGEMENT: true,
  EXIT_CLEARANCE: true,
  EMPLOYEE_CREATION: true,
  HR_DOCUMENTS: true,
  COMPLIANCE: false,
  EMPLOYEE_TRANSFER: true,
  CLEARANCE_AND_HANDOVER: false,

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
  TASK_MANAGEMENT: true,
  //Sub Modules
  PROJECT_BOARD: true,

  //-------------TALENT_SPHERE-----------
  TALENT_SPHERE: false,
  //Sub Modules
  MANPOWER_PLANNINGS: false,
  REQUISITION_PLANNING: false,
  APPLICANT_INTERVIEW_TRACKER: false,
  APPLICANTS:false,
  TS_OFFER_TRACKING:false,
  TS_DASHBOARD:false,
  TS_APPLICANTS_PROFILE:false,
  TS_RESUME_BANK:false,

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
  TALENT_SPHERE_SETTING: false,
  DESIGNATIONS: false,
  BRANCHES: false,
  SHIFTS: false,
  ONBOARDING_CHECKLIST: false,
  ROLE_PERMISSIONS: true,
  APPROVAL_HIERARCHY: true,
  LEAVE_SETUP: true,
  CLEARANCE_CHECKLIST: false,

  //--------------Performance Edge-----------
  PERFORMANCE_EDGE: false,
  //Sub Modules
  GENERATE_FORM: false,
  PERFORMANCE_CYCLE_SETUP: false,
  PERFORMANCE_DASHBOARD: false,
  PERFORMANCE_EVALUATION: false,

  //--------------Reports-----------
  REPORTS: false,
  //Sub Modules
  PROFILE_MANAGEMENT_REPORTS: false,
  EXIT_AND_CLEARANCE_REPORTS: false,
  EMPLOYEE_CREATION_AND_HIRING: false,
  HR_DOCUMENT_REPORTS: false,
  TRANSFER_AND_ROTATIONS: false,
  ATTENDANCE_AND_SHIFT_REPORTS: false,
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
