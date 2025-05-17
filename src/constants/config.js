const Config = {
  DASHBOARD: true,

  //---------------SELF_SERVICE_HUB----------

  SELF_SERVICE_HUB: true,
  //Sub modules
  MY_PROFILE: true,
  MY_ATTENDANCE: true,
  DAILY_TASK_REPORT: true,
  MY_LEAVE_TRACKER: true,
  MY_PAYROLL: true,
  MY_CLAIMS: true,
  MY_TRANSFERS: true,
  DOCUMENTS: true, // My HR Documents
  MY_ASSETS: true,
  EXIT: true,

  //----------------TEAM_MANAGEMENT------------
  TEAM_MANAGEMENT: true,
  //Sub Modules
  TEAM_PROFILE: true,
  TEAM_ATTENDANCE: false,
  TEAM_DAILY_TASK_REPORT: false,
  TEAM_LEAVE_REQUEST: true,
  TEAM_EXIT_CLEARANCE: false,

  //-------------PROFIL_MANAGMENT-----------
  PEOPLE_TEAM: true,
  //Sub Modules
  PROFILE_MANAGEMENT:true,
  EXIT_CLEARANCE:true,
  EMPLOYEE_CREATION:true,
  EXIT_CLEARANCE:true,
  EMPLOYEE_CREATION:true,
  HR_DOCUMENTS:true,
  EMPLOYEE_TRANSFER:true,

  //-------------ATTENDANCE-----------
  ATTENDANCE: true,
  //Sub Modules
  EMPLOYEES_ATTENDANCE:true,
  SHIFT_CALENDAR:true,
  EMPLOYEE_DAILY_TASK_REPORT:true,

  //-------------LEAVE_MANAGEMENT-----------
  LEAVE_MANAGEMENT: true,
  //Sub Modules
  LEAVE_RECORDS:true,
  LEAVE_REQUEST:true,


  //-------------PAYROLL-----------
  PAYROLL: true,
  //Sub Modules
  EMPLOYEES_PAYROLL:true,
  SALARY_SETUP:true,
  CLAIM_REQUEST:true,
  PAY_RUN:true,
  ON_HOLD_SALARIES:true,
  END_OF_SERVICE:true,


  //-------------TASK_MANAGEMENT-----------
  TASK_MANAGEMENT: true,
  //Sub Modules
  PROJECT_BOARD:true,

  //-------------TALENT_SPHERE-----------
  TALENT_SPHERE: true,
  //Sub Modules
  JOBS: true,
  APPLICANTS: true,

  //-------------ASSET_MANAGEMENT-----------
  ASSET_MANAGEMENT: true,
  //Sub Modules
  ASSETS:true,
  REQUEST_AND_ASSIGN:true,

  //-------------ORGANIZATIONAL_CHART-----------
  ORGANIZATIONAL_CHART: true,
  //Sub Modules
  ORGANIZATION_TREE: false,
  MY_REPORTING_LINE: false,

  //-------------OFFICE_SETTING-----------
  OFFICE_SETTING: true,
  //Sub Modules
  ORGANIZATION: false,
  DEPARTMENTS: false,
  DESIGNATIONS: false,
  BRANCHES: false,
  SHIFTS: false,
  ONBOARDING_CHECKLIST: false,
  ROLE_PERMISSIONS:true,

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
  // Add more as needed
];

export default Config;
