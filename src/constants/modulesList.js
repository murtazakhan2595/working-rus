const ModuleList = [
  "DASHBOARD",
 "SELF_SERVICE_HUB",
 "TEAM_MANAGEMENT",
 "PEOPLE_TEAM",
 "ATTENDANCE",
 "LEAVE_MANAGEMENT",
 "PAYROLL",
 "TASK_MANAGEMENT",
 "TALENT_SPHERE",
 "ASSET_MANAGEMENT",
 "ORGANIZATIONAL_CHART",
 "OFFICE_SETTING",
];

const SubModuleList = [
 "MY_PROFILE",
  
 "MY_ATTENDANCE",
  
 "DAILY_TASK_REPORT",
  
 "MY_LEAVE_TRACKER",
   
 "MY_PAYROLL",
  
 "MY_CLAIMS",
   
 "MY_TRANSFERS",
    
 "DOCUMENTS",
   
 "MY_ASSETS",
  
 "EXIT",
   
  // Team Management
 "TEAM_PROFILE",
   
 "TEAM_LEAVE_REQUEST",
 
 "TEAM_ATTENDANCE",
   "TEAM_DAILY_TASK_REPORT",
   
  // People Team
 "PROFILE_MANAGEMENT",
  "EXIT_CLEARANCE",
  "EMPLOYEE_CREATION",
  "HR_DOCUMENTS",
  "EMPLOYEE_TRANSFER",
  
  // Sub module of Attendance
 "EMPLOYEES_ATTENDANCE",
   
 "SHIFT_CALENDAR",
   
 "EMPLOYEE_DAILY_TASK_REPORT",
    
 "LEAVE_RECORDS",
 
 "LEAVE_REQUEST",
 
 "EMPLOYEES_PAYROLL",
   
 "SALARY_SETUP",
   "CLAIM_REQUEST",
  
 "PAY_RUN",
   
 "ON_HOLD_SALARIES",
  
 "END_OF_SERVICE",
   
 "PROJECT_BOARD",
  
  // Sub Modules of Talent Sphere
 "JOBS",
  
 "APPLICANTS",
  
  // Sub module of Asset Management
 "ASSETS",
   
 "REQUEST_AND_ASSIGN",
   
  // Sub Module of Organization Chart
 "ORGANIZATION_TREE",
  
 "MY_REPORTING_LINE",
 
  // Sub module of Office Settings
 "ORGANIZATION",
   
 "DEPARTMENTS",
  
 "DESIGNATIONS",
  
 "BRANCHES",
   
 "SHIFTS",
  
 "ONBOARDING_CHECKLIST",
   
];
// const FeatureList = [
//   // Sub Module of Self Service Hub

//  "MY_PROFILE",
//     name: "My Profile",
//     order: 1,
//     feature_list: [
//       {
//         code_name: "VIEW_PERSONAL_INFORMATION",
//         name: "View Personal Information",
//       },
//       {
//         code_name: "EDIT_PERSONAL_INFORMATION",
//         name: "Edit Personal Information",
//       },
//       {
//         code_name: "VIEW_JOB_INFORMATION",
//         name: "View Job Information",
//       },
//       {
//         code_name: "EDIT_ACADEMIC_INFORMATION",
//         name: "Edit Academic Information",
//       },
//       {
//         code_name: "VIEW_ACADEMIC_INFORMATION",
//         name: "View Academic Information",
//       },
//       {
//         code_name: "VIEW_EXPERIENCE_INFORMATION",
//         name: "View Experience Information",
//       },
//       {
//         code_name: "EDIT_EXPERIENCE_INFORMATION",
//         name: "Edit Experience Information",
//       },
//       {
//         code_name: "VIEW_CERTIFICATION_INFORMATION",
//         name: "View Certification Information",
//       },
//       {
//         code_name: "EDIT_CERTIFICATION_INFORMATION",
//         name: "Edit Certification Information",
//       },
//       {
//         code_name: "VIEW_IDENTIFICATION_INFORMATION",
//         name: "View Identification Information",
//       },
//       {
//         code_name: "EDIT_IDENTIFICATION_INFORMATION",
//         name: "Edit Identification Information",
//       },
//     ],
//  "MY_ATTENDANCE",
//     name: "My Attendance",
//     order: 2,
//     feature_list: [
//       {
//         code_name: "MARK_ATTENDANCE",
//         name: "Mark My Attendance",
//       },
//       {
//         code_name: "MARK_BREAK",
//         name: "Log Break Time",
//       },
//       {
//         code_name: "VIEW_ATTENDANCE",
//         name: "View Attendance Records",
//       },
//     ],
//  "DAILY_TASK_REPORT",
//     name: "Daily Task Report",
//     order: 3,
//     feature_list: [
//       {
//         code_name: "ADD_DAILY_TASK_REPORT",
//         name: "Create Daily Task Report",
//       },
//       {
//         code_name: "VIEW_DAILY_TASK_REPORT",
//         name: "View Daily Task Report",
//       },
//       {
//         code_name: "SUBMIT_DAILY_TASK_REPORT",
//         name: "Submit Daily Task Report",
//       },
//     ],
//   },

//  "MY_LEAVE_TRACKER",
//     name: "My Leave Tracker",
//     order: 4,
//     feature_list: [
//       {
//         code_name: "ADD_LEAVE_REQUEST",
//         name: "Add Leave Request",
//       },
//       {
//         code_name: "VIEW_LEAVES_APPLIED",
//         name: "View Applied Leaves",
//       },
//       {
//         code_name: "DELETE_LEAVE_REQUEST",
//         name: "Delete Leave Request",
//       },
//       {
//         code_name: "VIEW_CONSUMED_LEAVES",
//         name: "View Consumed Leaves",
//       },
//     ],
//  "MY_PAYROLL",
//     name: "My Payroll",
//     order: 5,
//     feature_list: [
//       {
//         code_name: "VIEW_PAYROLL",
//         name: "View Payroll",
//       },
//     ],
//  "MY_CLAIMS",
//     name: "My Claims",
//     order: 6,
//     feature_list: [
//       {
//         code_name: "REQUEST_CLAIM",
//         name: "Request Claim",
//       },
//       {
//         code_name: "VIEW_CLAIMS",
//         name: "View Claims",
//       },
//       {
//         code_name: "DELETE_CLAIM",
//         name: "Delete Claim",
//       },
//     ],
//  "MY_TRANSFERS",
//     name: "My Transfers",
//     order: 7,
//     feature_list: [
//       {
//         code_name: "REQUEST_TRANSFER",
//         name: "Request Transfer",
//       },
//       {
//         code_name: "VIEW_TRANSFER",
//         name: "View Transfer",
//       },
//     ],
//  "DOCUMENTS",
//     name: "HR Documents",
//     order: 8,
//     feature_list: [
//       {
//         code_name: "VIEW_ASSIGNED_DOCUMENTS",
//         name: "View Assigned Documents",
//       },
//       {
//         code_name: "MANAGE_ASSIGNED_DOCUMENTS",
//         name: "Manage Assigned Documents",
//         description: "View, acknowledge, and sign assigned documents",
//       },
//     ],
//  "MY_ASSETS",
//     name: "My Assets",
//     order: 9,
//     feature_list: [
//       {
//         code_name: "VIEW_ASSET",
//         name: "View Asset",
//       },
//       {
//         code_name: "ADD_ASSET_REQUEST",
//         name: "Request New Asset",
//       },
//       {
//         code_name: "WITHDRAW_ASSET",
//         name: "Withdraw Asset",
//       },
//     ],
//  "EXIT",
//     name: "Exit",
//     order: 10,
//     feature_list: [
//       {
//         code_name: "SUBMIT_RESIGNATION",
//         name: "Submit Resignation",
//       },
//       {
//         code_name: "VIEW_EXIT_REQUEST",
//         name: "View Exit Request",
//         description:
//           "View submitted exit requests, including resignations and terminations",
//       },
//       {
//         code_name: "MANAGE_TERMINATION_REQUESTS",
//         name: "Manage Termination Requests",
//         description: "Approve or reject termination requests",
//       },
//     ],
//   },

//   // Team Management
//  "TEAM_PROFILE",
//     name: "Team Profile",
//     order: 1,
//  "TEAM_LEAVE_REQUEST",
//     name: "Leave Request",
//     order: 2,
//     feature_list: [
//       { code_name: "VIEW_TEAM_LEAVE_REQUEST", name: "View Team Leave Request" },
//       {
//         code_name: "MANAGE_TEAM_LEAVE_REQUEST",
//         name: "Manage Team Leave Request",
//         description: "Approve or reject leave requests from employees",
//       },
//     ],
//  "TEAM_ATTENDANCE",
//     name: "Attendance",
//     order: 3,
//     feature_list: [
//       {
//         code_name: "VIEW_TEAM_LEAVE_STATUS",
//         name: "View Team Leave Status Overview",
//       },
//       {
//         code_name: "VIEW_TEAM_WEEKLY_STATISTICS",
//         name: "View Team Weekly Attendance Statistics",
//       },
//       {
//         code_name: "UPDATE_TEAM_ATTENDANCE",
//         name: "Update Team Attendance",
//       },
//       {
//         code_name: "VIEW_TEAM_ATTENDANCE",
//         name: "View Team Attendance",
//       },
//       {
//         code_name: "EXPORT_TEAM_ATTENDANCE",
//         name: "Export Team Attendance",
//       },
//     ],
//  "TEAM_DAILY_TASK_REPORT",
//     name: "Daily Task Report",
//     order: 4,
//     feature_list: [
//       {
//         code_name: "VIEW_TEAM_DAILY_TASK_REPORT",
//         name: "View Team Daily Task Report",
//       },
//     ],
//   },

//   // People Team
//  "PROFILE_MANAGEMENT",
//     name: "Profile Management",
//     order: 1,
//     feature_list: [
//       { code_name: "ADD_EMPLOYEE", name: "Add Employee" },
//       { code_name: "VIEW_EMPLOYEES", name: "View Employees" },
//       {
//         code_name: "VIEW_EMPLOYEE_DETAILS",
//         name: "View Employee Details",
//         description:
//           "View employee profile details (Personal, Contact, Bank, Academic, Experience, Certification, Identification)",
//       },
//       {
//         code_name: "EDIT_EMPLOYEE_PROFILE",
//         name: "Edit Employee Profile",
//         description:
//           "Edit employee profile details (Personal, Contact, Bank, Academic, Experience, Certification, Identification)",
//       },
//       {
//         code_name: "EDIT_EMPLOYEE",
//         name: "Edit Employee",
//         description: "Edit employee work information",
//       },
//     ],
//  "EXIT_CLEARANCE",
//     name: "Exit & Clearance",
//     order: 2,
//     feature_list: [
//       { code_name: "VIEW_EXIT_REQUESTS", name: "View Exit Requests" },
//       { code_name: "VIEW_EXIT_RECORDS", name: "View Exit Records" },
//       {
//         code_name: "MANAGE_EXIT_REQUESTS",
//         name: "Manage Exit Requests",
//         description:
//           "Approve, reject, or change status of exit requests (Termination or Resignation)",
//       },
//       {
//         code_name: "ADD_TERMINATION",
//         name: "Add Termination Request",
//       },
//     ],
//  "EMPLOYEE_CREATION",
//     name: "Employee Creation",
//     order: 3,
//     feature_list: [{ code_name: "ADD_EMPLOYEE", name: "Add Employee" }],
//  "HR_DOCUMENTS",
//     name: "HR Documents",
//     order: 4,
//     feature_list: [
//       { code_name: "UPLOAD_HR_DOCUMENT", name: "Upload HR Document" },
//       { code_name: "VIEW_HR_DOCUMENT", name: "View HR Document" },
//       {
//         code_name: "VIEW_HR_DOCUMENT_DETAILS",
//         name: "View HR Document Details",
//         description: "View all assigned employees for a document",
//       },
//       { code_name: "ASSIGN_HR_DOCUMENT", name: "Assign HR Document" },
//       { code_name: "ADD_DOCUMENT_CATEGORY", name: "Add Document Category" },
//       { code_name: "VIEW_DOCUMENT_CATEGORY", name: "View Document Category" },
//       { code_name: "EDIT_DOCUMENT_CATEGORY", name: "Edit Document Category" },
//       {
//         code_name: "DELETE_DOCUMENT_CATEGORY",
//         name: "Delete Document Category",
//       },
//     ],
//  "EMPLOYEE_TRANSFER",
//     name: "Employee Transfer",
//     order: 5,
//     feature_list: [
//       { code_name: "VIEW_EMPLOYEE_TRANSFER", name: "View Employee Transfer" },
//       { code_name: "EDIT_EMPLOYEE_TRANSFER", name: "Edit Employee Transfer" },
//       {
//         code_name: "MANAGE_EMPLOYEE_TRANSFER",
//         name: "Manage Employee Transfer",
//         description: "Approve or reject employee transfer requests",
//       },
//     ],
//   },

//   // Sub module of Attendance
//  "EMPLOYEES_ATTENDANCE",
//     name: "Attendance",
//     order: 1,
//     feature_list: [
//       { code_name: "VIEW_LEAVE_STATUS", name: "View Leave Status Overview" },
//       {
//         code_name: "VIEW_WEEKLY_STATISTICS",
//         name: "View Weekly Attendance Statistics",
//       },
//       {
//         code_name: "VIEW_DEPARTMENT_ATTENDANCE_OVERVIEW",
//         name: "View Department Attendance Overview",
//       },
//       {
//         code_name: "UPDATE_EMPLOYEE_ATTENDANCE",
//         name: "Update Employee Attendance",
//       },
//       {
//         code_name: "VIEW_EMPLOYEE_ATTENDANCE",
//         name: "View Employee Attendance",
//       },
//       { code_name: "EXPORT_ATTENDANCE", name: "Export Attendance" },
//     ],
//  "SHIFT_CALENDAR",
//     name: "Shift Calendar",
//     order: 2,
//     feature_list: [
//       { code_name: "VIEW_SHIFT_CALENDAR", name: "View Shift Calendar" },
//       { code_name: "ASSIGN_SHIFT", name: "Assign Shift" },
//     ],
//  "EMPLOYEE_DAILY_TASK_REPORT",
//     name: "Daily Task Report",
//     order: 3,
//     feature_list: [
//       {
//         code_name: "VIEW_EMPLOYEE_DAILY_TASK_REPORT",
//         name: "View Daily Task Report",
//       },
//     ],
//  "LEAVE_RECORDS",
//     name: "Leave Records",
//     order: 1,
//     feature_list: [
//       { code_name: "VIEW_EMPLOYEE_LEAVE", name: "View Employee Leave Details" },
//       { code_name: "ASSIGN_LEAVES", name: "Assign Leaves to Employee" },
//       {
//         code_name: "EDIT_ASSIGNED_LEAVES",
//         name: "Edit Assigned Leaves for Employee",
//       },
//       { code_name: "ADD_LEAVE_TYPES", name: "Add Leave Types" },
//       { code_name: "VIEW_LEAVE_TYPES", name: "View Leave Types" },
//       { code_name: "EDIT_LEAVE_TYPES", name: "Edit Leave Types" },
//       { code_name: "DELETE_LEAVE_TYPES", name: "Delete Leave Types" },
//     ],
//  "LEAVE_REQUEST",
//     name: "Leave Request",
//     order: 2,
//     feature_list: [
//       { code_name: "VIEW_LEAVE_REQUEST", name: "View Leave Request" },
//       { code_name: "MANAGE_LEAVE_REQUEST", name: "Manage Leave Request" },
//     ],
//  "EMPLOYEES_PAYROLL",
//     name: "Employees Payroll",
//     order: 1,
//     feature_list: [
//       { code_name: "VIEW_EMPLOYEE_PAYROLL", name: "View Employee Payroll" },
//     ],
//  "SALARY_SETUP",
//     name: "Salary Setup",
//     order: 2,
//     feature_list: [
//       { code_name: "VIEW_EMPLOYEE_SALARY_SETUP", name: "View Salary Setup" },
//       { code_name: "EDIT_EMPLOYEE_SALARY_SETUP", name: "Edit Salary Setup" },
//       { code_name: "ADD_EMPLOYEE_REVISED_SALARY", name: "Add Revised Salary" },
//       { code_name: "MANAGE_REVISED_SALARY", name: "Manage Revised Salary" },
//       { code_name: "ADD_SALARY_COMPONENTS", name: "Add Salary Components" },
//       { code_name: "VIEW_SALARY_COMPONENTS", name: "View Salary Components" },
//       { code_name: "EDIT_SALARY_COMPONENTS", name: "Edit Salary Components" },
//       {
//         code_name: "DELETE_SALARY_COMPONENTS",
//         name: "Delete Salary Components",
//       },
//       { code_name: "ADD_PAYROLL_ADJUSTMENT", name: "Add Payroll Adjustments" },
//       {
//         code_name: "VIEW_PAYROLL_ADJUSTMENT",
//         name: "View Payroll Adjustments",
//       },
//       {
//         code_name: "EDIT_PAYROLL_ADJUSTMENT",
//         name: "Edit Payroll Adjustments",
//       },
//       {
//         code_name: "DELETE_PAYROLL_ADJUSTMENT",
//         name: "Delete Payroll Adjustments",
//       },
//       {
//         code_name: "MANAGE_PAYROLL_ADJUSTMENT",
//         name: "Manage Payroll Adjustments",
//       },
//       {
//         code_name: "IMPORT_PAYROLL_ADJUSTMENT",
//         name: "Import Payroll Adjustments",
//       },
//     ],
//  "CLAIM_REQUEST",
//     name: "Claim Request",
//     order: 3,
//     feature_list: [
//       { code_name: "ADD_CLAIM_REQUEST", name: "Add Claim Request" },
//       { code_name: "VIEW_CLAIM_REQUEST", name: "View Claim Request" },
//       { code_name: "DELETE_CLAIM_REQUEST", name: "Delete Claim Request" },
//       { code_name: "EXPORT_CLAIM_REQUEST", name: "Export Claim Request" },
//       { code_name: "MANAGE_CLAIM_REQUEST", name: "Manage Claim Request" },
//     ],
//  "PAY_RUN",
//     name: "Pay Run",
//     order: 4,
//     feature_list: [
//       { code_name: "GENERATE_RUN_PAYROLL", name: "Generate Run Payroll" },
//       { code_name: "VIEW_RUN_PAYROLL", name: "View Run Payroll" },
//       { code_name: "DELETE_RUN_PAYROLL", name: "Delete Run Payroll" },
//       {
//         code_name: "EDIT_EMPLOYEE_RUN_PAYROLL",
//         name: "Edit Employee Run Payroll",
//       },
//       { code_name: "PROCEED_TO_PAYRUN", name: "Proceed to Payrun" },
//       { code_name: "VIEW_PAYRUN", name: "View Payrun" },
//       { code_name: "EXPORT_PAYRUN", name: "Export Payrun" },
//       { code_name: "VIEW_PAYSLIPS", name: "View Payslips" },
//       { code_name: "DOWNLOAD_PAYSLIPS", name: "Download Payslips" },
//     ],
//  "ON_HOLD_SALARIES",
//     name: "On-Hold Salaries",
//     order: 5,
//     feature_list: [
//       { code_name: "VIEW_ON_HOLD_SALARIES", name: "View On-Hold Salaries" },
//     ],
//  "END_OF_SERVICE",
//     name: "End of Service",
//     order: 6,
//     feature_list: [
//       { code_name: "VIEW_END_OF_SERVICE", name: "View End of Service" },
//       { code_name: "SETUP_END_OF_SERVICE", name: "Setup End of Service" },
//       { code_name: "DOWNLOAD_END_OF_SERVICE", name: "Download End of Service" },
//       {
//         code_name: "MARK_END_OF_SERVICE_AS_PAID",
//         name: "Mark End of Service as Paid",
//       },
//     ],
//  "PROJECT_BOARD",
//     name: "Project Board",
//     order: 1,
//     feature_list: [
//       { code_name: "VIEW_OWN_PROJECTS", name: "View Own Projects" },
//       { code_name: "VIEW_ALL_PROJECTS", name: "View All Projects" },
//       { code_name: "ADD_PROJECTS", name: "Add Projects" },
//       { code_name: "EDIT_PROJECTS", name: "Edit Projects" },
//     ],
//   },

//   // Sub Modules of Talent Sphere
//  "JOBS",
//     name: "Jobs",
//     order: 1,
//     feature_list: [
//       { code_name: "VIEW_JOBS", name: "View Jobs" },
//       { code_name: "EDIT_JOBS", name: "Edit Jobs" },
//       { code_name: "DELETE_JOBS", name: "Delete Jobs" },
//     ],
//  "APPLICANTS",
//     name: "Applicants",
//     order: 2,
//     feature_list: [
//       { code_name: "VIEW_APPLICANTS", name: "View Applicants" },
//       {
//         code_name: "MANAGE_APPLICANTS",
//         name: "Manage Applicants",
//         description: "Update the applicants' application status",
//       },
//     ],
//   },

//   // Sub module of Asset Management
//  "ASSETS",
//     name: "Assets",
//     order: 1,
//     feature_list: [
//       { code_name: "VIEW_ASSET", name: "View Asset" },
//       { code_name: "ADD_ASSET", name: "Add Asset" },
//       { code_name: "EDIT_ASSET", name: "Edit Asset" },
//       { code_name: "DELETE_ASSET", name: "Delete Asset" },
//       { code_name: "VIEW_ASSET_CATEGORY", name: "View Asset Category" },
//       { code_name: "ADD_ASSET_CATEGORY", name: "Add Asset Category" },
//       { code_name: "EDIT_ASSET_CATEGORY", name: "Edit Asset Category" },
//       { code_name: "DELETE_ASSET_CATEGORY", name: "Delete Asset Category" },
//     ],
//  "REQUEST_AND_ASSIGN",
//     name: "Request and Assign",
//     order: 2,
//     feature_list: [
//       { code_name: "VIEW_ASSETS_REQUEST", name: "View Assets Request" },
//       { code_name: "VIEW_ASSIGN_ASSETS", name: "View Assign Assets" },
//       {
//         code_name: "ASSIGN_ASSETS_TO_EMPLOYEE",
//         name: "Assign Assets to Employee",
//       },
//       {
//         code_name: "MANAGE_ASSET_REQUEST",
//         name: "Manage Asset Request",
//         description: "Approve/Reject asset request from employees.",
//       },
//     ],
//   },

//   // Sub Module of Organization Chart
//  "ORGANIZATION_TREE",
//     name: "Organization Tree",
//     order: 1,
//     feature_list: [
//       { code_name: "VIEW_ORGANIZATION_TREE", name: "View Organization Tree" },
//     ],
//  "MY_REPORTING_LINE",
//     name: "My Reporting Line",
//     order: 2,
//     feature_list: [
//       { code_name: "VIEW_MY_REPORTING_LINE", name: "View My Reporting Line" },
//     ],
//   },

//   // Sub module of Office Settings
//  "ORGANIZATION",
//     name: "Organization",
//     order: 1,
//     feature_list: [
//       { code_name: "VIEW_ORGANIZATION", name: "View Organization" },
//       { code_name: "EDIT_ORGANIZATION", name: "Edit Organization" },
//     ],
//  "DEPARTMENTS",
//     name: "Departments",
//     order: 2,
//     feature_list: [
//       { code_name: "ADD_DEPARTMENTS", name: "Add Departments" },
//       { code_name: "VIEW_DEPARTMENTS", name: "View Departments" },
//       { code_name: "EDIT_DEPARTMENTS", name: "Edit Departments" },
//       { code_name: "DELETE_DEPARTMENTS", name: "Delete Departments" },
//     ],
//  "DESIGNATIONS",
//     name: "Designations",
//     order: 3,
//     feature_list: [
//       { code_name: "ADD_DESIGNATIONS", name: "Add Designation" },
//       { code_name: "VIEW_DESIGNATIONS", name: "View Designation" },
//       { code_name: "EDIT_DESIGNATIONS", name: "Edit Designation" },
//       { code_name: "DELETE_DESIGNATIONS", name: "Delete Designation" },
//     ],
//  "BRANCHES",
//     name: "Branches",
//     order: 4,
//     feature_list: [
//       { code_name: "ADD_BRANCHES", name: "Add Branches" },
//       { code_name: "VIEW_BRANCHES", name: "View Branches" },
//       { code_name: "EDIT_BRANCHES", name: "Edit Branches" },
//       { code_name: "DELETE_BRANCHES", name: "Delete Branches" },
//     ],
//  "SHIFTS",
//     name: "Working Hours",
//     order: 5,
//     feature_list: [
//       { code_name: "ADD_SHIFTS", name: "Add Working Hours" },
//       { code_name: "VIEW_SHIFTS", name: "View Working Hours" },
//       { code_name: "EDIT_SHIFTS", name: "Edit Working Hours" },
//       { code_name: "DELETE_SHIFTS", name: "Delete Working Hours" },
//     ],
//  "ONBOARDING_CHECKLIST",
//     name: "Onboarding Checklist",
//     order: 6,
//     feature_list: [
//       {
//         code_name: "ADD_ONBOARDING_CHECKLIST",
//         name: "Add Onboarding Checklist",
//       },
//       {
//         code_name: "VIEW_ONBOARDING_CHECKLIST",
//         name: "View Onboarding Checklist",
//       },
//       {
//         code_name: "EDIT_ONBOARDING_CHECKLIST",
//         name: "Edit Onboarding Checklist",
//       },
//       {
//         code_name: "DELETE_ONBOARDING_CHECKLIST",
//         name: "Delete Onboarding Checklist",
//       },
//     ],
//   },
// ];

export { ModuleList };
