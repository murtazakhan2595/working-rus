import Config from "constants/config";
import Dashboard from "app/modules/Dashboard";
import Login from "app/modules/Login";
import {
  ManpowerPlanning,
  TalentSphereSettingManagement,
  RequisitionPlanning,
  TeamTalentSphere,
  OfferTracking,
  ApplicantManagement,
  InterviewTracker,
  ApplicantOffer,
  TalentSphereDashboard,
  ApplicantProfiles,
  AllApplicants,
  ApplicantProfileDetails,
  ApplicantByRequisition,
  EmiratizationAllApplicants,
  EmiratizationScreenedApplicants,
  EmiratizationShortlistedApplicants,
  EmiratizationHiredApplicants,
  EmiratizationRequisitions,
} from 'app/modules/TalentSphere';
import {
  LeaveTracker,
  MyLeaveTracker,
  LeaveManagement,
  EmployeeLeaveCount,
} from "app/modules/LeaveTracker";
import {
  Projects,
  Board,
  UserProfileTaskDetails,
  TaskEditAddViewDetails,
} from "app/modules/TaskManagment";
import ViewEmployee from "app/modules/Employees/Screens/View/";
import "react-toastify/dist/ReactToastify.css";
import CreateUpdateEmployee from "app/modules/Employees/Screens/Create.jsx";
import Employee from "app/modules/Employees/Employee.jsx";
import {
  TransferAndRotation,
  MyJobRotations,
  MyTransfers,
  UserJobRotations,
} from "app/modules/TransferAndRotation";
import {
  HRDocuments,
  MyDocuments,
  DocumentDetails,
  MyLetterRequests,
} from "app/modules/HRDocuments";
import { EditEmployeeProfile } from "app/modules/Employees/Screens/Profile";
import { MyDtr } from "app/modules/DTR";
import ForgotPassword from "app/modules/Login/ForgotPassword.jsx";
import ResetPassword from "app/modules/Login/ResetPassword.jsx";
import {
  ApprovalHierarchy,
  ApprovalHierarchyDetails,
  ApprovalHierarchyHistoryLogs,
} from "app/modules/ApprovalHierarchy";
import CreateEmployeeProfile from "app/modules/Employees/Screens/AddProfile/CreateEmployeeProfile.jsx";
import { ExitAndClearance, EmployeeExit } from "app/modules/ExitAndClearance";
import { EOSSettlementDetails } from "app/modules/SelfService/Exit";
import {
  Payslip,
  EmployeesPayroll,
  MyPayroll,
  SalarySetup,
  EmployeeSalarySetup,
  PayRun,
  CreatePayRun,
  PayRunDetails,
  EmployeeSalaryDetails,
  PayrollPayrunDetail,
} from "app/modules/Payroll";
import { ClaimRequest, MyClaims } from "app/modules/claims";
import {
  Attendance,
  MyAttendance,
  EmployeeAttendance,
  EmployeeAttendanceReport,
  TimeAdjustments,
  AttendanceAdjustment,
  TimeAdjustmentHistoryDetails,
} from "app/modules/Attendance";
import StyleGuide from "app/modules/StyleGuide";
import { OfficeSetting } from "app/modules/OfficeSetting";
import ShiftCalendar from "app/modules/Attendance/ShiftCalendar/ShiftCalendar";
import EmployeeDTRs from "app/modules/DTR/EmployeeDTRs";
import { OrganizationalTree } from "app/modules/OrganizationalChart";
import {
  GenerateForm,
  PerformanceCycleSetup,
  MyPerformance,
  TeamPerformanceEvaluation,
  PerformanceEvaluation,
  EvaluationSummaryDetails
} from "app/modules/PerformanceEdge";
import { Assets, MyAssets } from "app/modules/AssetsManagement";
import { TeamAdjustments } from "app/modules/Payroll/Screens/TeamPayroll";
import { OnHoldSalaries, OnHoldSalaryDetails } from "app/modules/Payroll";
import { EOSList, EOSDetails } from "app/modules/Payroll/Screens/EOS";
import { RequestAndAssign } from "app/modules/AssetsManagement";
import { ChangePassword } from "app/modules/ResetPassword";
import {
  RoleAndPermissions,
  AssignedRoles,
  AddUpdateUserRoleForm,
  RoleAssignmentEmployeeHistoryLogs,
} from "app/modules/RoleAndPermissions";
import {
  MyShiftCalendar,
  ShiftCalendarHistoryLogs,
} from "app/modules/Attendance/ShiftCalendar";
import { ClearanceAndHandover } from "app/modules/ClearanceAndHandOver";
import { MyClearanceTab } from "app/modules/ClearanceAndHandOver/Sections/MyClearance";
import AccessRevokedPage from "app/modules/ClearanceAndHandOver/AccessRevoked";
import AccessDenied from "app/modules/Error/AccessDenied";
import { ManagerClearanceDashboard } from "app/modules/ClearanceAndHandOver/Sections/ManagerDashboard";
import { PerformanceDashboard } from "app/modules/PerformanceEdge";
import { ProfileManagementReports } from "app/modules/Reports";
import { ExitAndClearanceReports } from "app/modules/Reports";
import { EmployeeCreationAndHiringReports } from "app/modules/Reports";
import { HRDocumentsReports } from "app/modules/Reports";
import { TransferAndRotationReports } from "app/modules/Reports";
import { AttendanceAndShiftReports } from "app/modules/Reports";
import DemographicsForm from "app/modules/TalentSphere/OfferTracking/DemographicsForm";
import Compliance from "app/modules/Compliance";
import { GlobalPayrollRoutes } from "constants/globalPayrollRoutes";

export const SidebarRoutes = [
  {
    path: "/",
    component: <Dashboard />,
    name: "DASHBOARD",
  },
  ...(Config.SELF_SERVICE_HUB
    ? [
      Config.MY_PROFILE && {
        path: "/my-profile",
        component: <ViewEmployee profileView />,
        name: "MY_PROFILE",
      },
      Config.MY_ATTENDANCE && {
        path: "/my-attendance",
        component: <MyAttendance />,
        name: "MY_ATTENDANCE",
      },
      Config.MY_ATTENDANCE && {
        path: "/my-attendance-report/:id",
        component: <EmployeeAttendanceReport />,
        name: "VIEW_ATTENDANCE",
      },
      Config.DAILY_TASK_REPORT && {
        path: "/my-dtr",
        component: <MyDtr />,
        name: "DAILY_TASK_REPORT",
      },
      Config.MY_LEAVE_TRACKER && {
        path: "/my-leave-tracker",
        component: <MyLeaveTracker />,
        name: "MY_LEAVE_TRACKER",
      },
      Config.MY_PAYROLL && {
        path: "/my-payroll",
        component: <MyPayroll />,
        name: "MY_PAYROLL",
      },
      Config.MY_CLAIMS && {
        path: "/my-claims",
        component: <MyClaims />,
        name: "MY_CLAIMS",
      },
      Config.MY_TRANSFERS && {
        path: "/my-tranfers",
        component: <MyTransfers />,
        name: "MY_TRANSFERS",
      },
      Config.DOCUMENTS && {
        path: "/my-documents",
        component: <MyDocuments />,
        name: "DOCUMENTS",
      },
      Config.MY_LETTER_REQUEST && {
        path: "/my-letter-requests",
        component: <MyLetterRequests />,
        name: "MY_LETTER_REQUEST",
      },
      Config.MY_ASSETS && {
        path: "/my-assets",
        component: <MyAssets />,
        name: "MY_ASSETS",
      },
      Config.MY_SHIFT_CALENDAR && {
        path: "/my-shift-calendar",
        component: <MyShiftCalendar />,
        name: "MY_SHIFT_CALENDAR",
      },
      Config.EXIT && {
        path: "/exit-employee",
        component: <EmployeeExit />,
        name: "EXIT",
      },
      Config.MY_JOB_ROTATIONS && {
        path: "/my-job-rotations",
        component: <MyJobRotations />,
        name: "MY_JOB_ROTATIONS",
      },
      Config.MY_CLEARANCE && {
        path: "/my-clearance",
        component: <MyClearanceTab />,
        name: "MY_CLEARANCE",
      },
      Config.MY_PERFORMANCE && {
        path: "/my-performance",
        component: <MyPerformance />,
        name: "MY_PERFORMANCE",
      },
    ].filter(Boolean) // Filter out undefined routes
    : []),
  ...(Config.TEAM_MANAGEMENT
    ? [
      Config.TEAM_PROFILE && {
        path: "/team-profile-management",
        component: <Employee isTeamView={true} />,
        name: "TEAM_PROFILE",
      },
      Config.TEAM_LEAVE_REQUEST && {
        path: "/team-leave-tracker",
        component: <LeaveTracker isTeamView={true} />,
        name: "TEAM_LEAVE_REQUEST",
      },
      Config.TEAM_EXIT_CLEARANCE && {
        path: "/team-exit-clearance",
        component: <ExitAndClearance isTeamView={true} />,
        name: "TEAM_EXIT_CLEARANCE",
      },
      Config.TEAM_ATTENDANCE && {
        path: "/team-attendance",
        component: <Attendance isTeamView={true} />,
        name: "TEAM_ATTENDANCE",
      },
      Config.TEAM_PERFORMANCE_EVALUATION && {
        path: "/team-performance-evaluation",
        component: <TeamPerformanceEvaluation />,
        name: "TEAM_PERFORMANCE_EVALUATION",
      },
      Config.TEAM_TALENT_SPHERE && {
        path: "/team-talent-sphere",
        component: <TeamTalentSphere />,
        name: "TEAM_TALENT_SPHERE",
      },
      Config.TEAM_TALENT_SPHERE && {
        path: "/team-talent-sphere/requisition",
        component: <TeamTalentSphere activeView={'Requisition Request'} subActiveView={'Records'}/>,
        name: "VIEW_REQUISITION_REQUEST_CREATED",
      },
      Config.MANAGER_CLEARANCE_DASHBOARD && {
        path: "/manager-clearance-dashboard",
        component: <ManagerClearanceDashboard />,
        name: "MANAGER_CLEARANCE_DASHBOARD",
      },
    ].filter(Boolean) // Filter out undefined route
    : []),
  ...(Config.PEOPLE_TEAM
    ? [{
      path: "/compliance",
      component: <Compliance />,
      name: "COMPLIANCE",
    },
    Config.PROFILE_MANAGEMENT && {
      path: "/profile-management",
      component: <Employee />,
      name: "PROFILE_MANAGEMENT",
    },
    Config.HR_DOCUMENTS && {
      path: "/documents",
      component: <HRDocuments />,
      name: "HR_DOCUMENTS",
    },
    Config.HR_DOCUMENTS && {
      path: "/documents/detail",
      component: <DocumentDetails />,
      name: "VIEW_HR_DOCUMENT_DETAILS",
    },

    Config.EMPLOYEE_TRANSFER && {
      path: "/tranfer-rotations",
      component: <TransferAndRotation />,
      name: "EMPLOYEE_TRANSFER",
    },
    Config.EMPLOYEE_TRANSFER && {
      path: "/user-job-rotations",
      component: <UserJobRotations />,
      name: "VIEW_JOB_ROTATION",
    },
    Config.EMPLOYEE_CREATION && {
      path: "/create-employee",
      component: <CreateUpdateEmployee />,
      name: "EMPLOYEE_CREATION",
    },
    Config.PROFILE_MANAGEMENT && {
      path: "/edit-employee/:id",
      component: <CreateUpdateEmployee />,
      name: "EDIT_EMPLOYEE",
    },
    Config.PROFILE_MANAGEMENT && {
      path: "/profile/:id",
      component: <EditEmployeeProfile />,
      name: "EDIT_EMPLOYEE_PROFILE",
    },
    Config.PROFILE_MANAGEMENT && {
      path: "/user/:id",
      component: <ViewEmployee profileView={false} />,
      name: "VIEW_EMPLOYEES",
    },
    Config.CLEARANCE_AND_HANDOVER && {
      path: "/clearance-requests",
      component: <ClearanceAndHandover />,
      name: "CLEARANCE_AND_HANDOVER",
    },
    Config.EXIT_CLEARANCE && {
      path: "/exit-clearance",
      component: <ExitAndClearance />,
      name: "EXIT_CLEARANCE",
    },
    ].filter(Boolean) // Filter out undefined route
    : []),
  ...(Config.TASK_MANAGEMENT
    ? [
      Config.PROJECT_BOARD && {
        path: "/projects",
        component: <Projects />,
        name: "PROJECT_BOARD",
      },
      Config.PROJECT_BOARD && {
        path: "/project-board/card/add",
        component: <TaskEditAddViewDetails />,
        name: "VIEW_OWN_PROJECTS",
      },
      Config.PROJECT_BOARD && {
        path: "/project-board/card/:taskId",
        component: <TaskEditAddViewDetails />,
        name: "VIEW_OWN_PROJECTS",
      },
      Config.PROJECT_BOARD && {
        path: "/project-board/card/:parentTaskId/subtask/:subtaskId",
        component: <TaskEditAddViewDetails />,
        name: "VIEW_OWN_PROJECTS",
      },
      Config.PROJECT_BOARD && {
        path: "/project-board/:projectId",
        component: <Board />,
        name: "VIEW_OWN_PROJECTS",
      },
      Config.PROJECT_BOARD && {
        path: "/project-board/user/:userId",
        component: <UserProfileTaskDetails />,
        name: "VIEW_OWN_PROJECTS",
      },
    ].filter(Boolean) // Filter out undefined route
    : []),
  ...(Config.LEAVE_MANAGEMENT
    ? [
      Config.LEAVE_RECORDS && {
        path: "/employee-leave-count",
        component: <EmployeeLeaveCount />,
        name: "LEAVE_RECORDS",
      },
      Config.LEAVE_REQUEST && {
        path: "/leave-tracker",
        component: <LeaveTracker />,
        name: "LEAVE_REQUEST",
      },
    ].filter(Boolean) // Filter out undefined route
    : []),
  ...(Config.TALENT_SPHERE
    ? [
      Config.MANPOWER_PLANNINGS && {
        path: "/manpower-planning",
        component: <ManpowerPlanning />,
        name: "MANPOWER_PLANNINGS",
      },
      Config.APPLICANTS && {
        path: "/talent-sphere/applicant-management",
        component: <ApplicantManagement />,
        name: "APPLICANTS",
      },
      Config.TS_DASHBOARD && {
        path: "/talent-sphere/applicant-management/requisition-applicants",
        component: <ApplicantByRequisition />,
        name: "APPLICANTS",
      },
      Config.TS_DASHBOARD && {
        path: "/talent-sphere/applicant-management/emiratization-applicants",
        component: <EmiratizationAllApplicants />,
        name: "APPLICANTS",
      },
      Config.TS_DASHBOARD && {
        path: "/talent-sphere/applicant-management/emiratization-screened",
        component: <EmiratizationScreenedApplicants />,
        name: "APPLICANTS",
      },
      Config.TS_DASHBOARD && {
        path: "/talent-sphere/applicant-management/emiratization-shortlisted",
        component: <EmiratizationShortlistedApplicants />,
        name: "APPLICANTS",
      },
      Config.TS_DASHBOARD && {
        path: "/talent-sphere/applicant-management/emiratization-hired",
        component: <EmiratizationHiredApplicants />,
        name: "APPLICANTS",
      },
      Config.TS_DASHBOARD && {
        path: "/talent-sphere/applicant-management/source/:source",
        component: <AllApplicants variant='by_source' />,
        name: "APPLICANTS",
      },
      Config.REQUISITION_PLANNING && {
        path: "/talent-sphere/requisition-planning",
        component: <RequisitionPlanning />,
        name: "REQUISITION_PLANNING",
      },
      Config.REQUISITION_PLANNING && {
        path: "/talent-sphere/emiratization-requisitions",
        component: <EmiratizationRequisitions />,
        name: "REQUISITION_PLANNING",
      },
      Config.APPLICANT_INTERVIEW_TRACKER && {
        path: "/talent-sphere/interview-tracker",
        component: <InterviewTracker />,
        name: "APPLICANT_INTERVIEW_TRACKER",
      },
      Config.TS_OFFER_TRACKING && {
        path: "/talent-sphere/offer-tracking",
        component: <OfferTracking />,
        name: "TS_OFFER_TRACKING",
      },
      Config.TS_DASHBOARD && {
        path: "/talent-sphere/dashboard",
        component: <TalentSphereDashboard />,
        name: "TS_DASHBOARD",
      },
      Config.TS_APPLICANTS_PROFILE && {
        path: "/talent-sphere/applicants-profile",
        component: <ApplicantProfiles />,
        name: "TS_APPLICANTS_PROFILE",
      },
      Config.TS_APPLICANTS_PROFILE && {
        path: "/talent-sphere/applicant/:id",
        component: <ApplicantProfileDetails />,
        name: "TS_VIEW_APPLICANT_PROFILE",
      },
      Config.TS_RESUME_BANK && {
        path: "/talent-sphere/applicant-management/resume-bank-applicants",
        component: <AllApplicants variant='resume_bank' />,
        name: "TS_RESUME_BANK",
      },

    ].filter(Boolean) // Filter out undefined route
    : []),
  ...(Config.ASSET_MANAGEMENT
    ? [
      Config.ASSETS && {
        path: "/assets",
        component: <Assets />,
        name: "ASSETS",
      },
      Config.REQUEST_AND_ASSIGN && {
        path: "/request-and-assign",
        component: <RequestAndAssign />,
        name: "REQUEST_AND_ASSIGN",
      },
    ].filter(Boolean) // Filter out undefined route
    : []),
  ...(Config.REPORTS
    ? [
      Config.PROFILE_MANAGEMENT_REPORTS && {
        path: "/profile-management-reports",
        component: <ProfileManagementReports />,
        name: "PROFILE_MANAGEMENT_REPORTS",
      },
      Config.EXIT_AND_CLEARANCE_REPORTS && {
        path: "/exit-and-clearance-reports",
        component: <ExitAndClearanceReports />,
        name: "EXIT_AND_CLEARANCE_REPORTS",
      },
      Config.EMPLOYEE_CREATION_AND_HIRING && {
        path: "/employee-creation-and-hiring",
        component: <EmployeeCreationAndHiringReports />,
        name: "EMPLOYEE_CREATION_AND_HIRING",
      },
      Config.HR_DOCUMENT_REPORTS && {
        path: "/hr-documents-reports",
        component: <HRDocumentsReports />,
        name: "HR_DOCUMENT_REPORTS",
      },
      Config.TRANSFER_AND_ROTATIONS && {
        path: "/transfer-and-rotation-reports",
        component: <TransferAndRotationReports />,
        name: "TRANSFER_AND_ROTATIONS",
      },
      Config.ATTENDANCE_AND_SHIFT_REPORTS && {
        path: "/attendance-and-shift-reports",
        component: <AttendanceAndShiftReports />,
        name: "ATTENDANCE_AND_SHIFT_REPORTS",
      },
    ].filter(Boolean) // Filter out undefined route
    : []),
  ...(Config.ATTENDANCE
    ? [
      Config.EMPLOYEES_ATTENDANCE && {
        path: "/attendance",
        component: <Attendance />,
        name: "EMPLOYEES_ATTENDANCE",
      },
      Config.ATTENDANCE_UPDATES && {
        path: "/attendance-adjustment",
        component: <AttendanceAdjustment />,
        name: "ATTENDANCE_UPDATES",
      },
      Config.TIME_ADJUSTMENTS && {
        path: "/time-adjustments",
        component: <TimeAdjustments />,
        name: "TIME_ADJUSTMENTS",
      },
      Config.TIME_ADJUSTMENTS && {
        path: "time-adjustments/history",
        component: <TimeAdjustments activeView="History & Logs" />,
        name: "TIME_ADJUSTMENTS",
      },
      Config.TIME_ADJUSTMENTS && {
        path: "/time-adjustments/history-details",
        component: <TimeAdjustmentHistoryDetails />,
        name: "VIEW_TIME_ADJ_LOGS",
      },
      Config.EMPLOYEE_DAILY_TASK_REPORT && {
        path: "/employee-dtrs",
        component: <EmployeeDTRs />,
        name: "EMPLOYEE_DAILY_TASK_REPORT",
      },
      Config.SHIFT_CALENDAR && {
        path: "/shift-calendar",
        component: <ShiftCalendar />,
        name: "SHIFT_CALENDAR",
      },
      Config.SHIFT_CALENDAR && {
        path: "/shift-calendar/history-logs",
        component: <ShiftCalendarHistoryLogs />,
        name: "SHIFT_CALENDAR",
      },
      Config.EMPLOYEES_ATTENDANCE && {
        path: "/attendance-reports/:id",
        component: <EmployeeAttendanceReport />,
        name: "VIEW_EMPLOYEE_ATTENDANCE",
      },
      Config.EMPLOYEES_ATTENDANCE && {
        path: "/attendance/:id",
        component: <EmployeeAttendance />,
        name: "VIEW_EMPLOYEE_ATTENDANCE",
      },
    ].filter(Boolean) // Filter out undefined route
    : []),
  ...(Config.PAYROLL
    ? [
      // Global Payroll Module Routes
      ...GlobalPayrollRoutes,
      
      Config.PAY_RUN && {
        path: "/payslip/:id",
        component: <Payslip />,
        name: "VIEW_PAYSLIPS",
      },
      Config.SALARY_SETUP && {
        path: "/payroll/salary-setup/:id",
        component: <EmployeeSalarySetup />,
        name: "VIEW_EMPLOYEE_SALARY_SETUP",
      },
      Config.PAY_RUN && {
        path: "/payroll/create-payrun",
        component: <CreatePayRun />,
        name: "GENERATE_RUN_PAYROLL",
      },
      Config.EMPLOYEES_PAYROLL && {
        path: "/payroll",
        component: <EmployeesPayroll />,
        name: "EMPLOYEES_PAYROLL",
      },
      Config.EMPLOYEES_PAYROLL && {
        path: "/payroll/:id",
        component: <EmployeeSalaryDetails />,
        name: "EMPLOYEES_PAYROLL",
      },
      Config.SALARY_SETUP && {
        path: "/payroll/salary-setup",
        component: <SalarySetup />,
        name: "SALARY_SETUP",
      },
      Config.CLAIM_REQUEST && {
        path: "/claim-request",
        component: <ClaimRequest />,
        name: "CLAIM_REQUEST",
      },
      Config.PAY_RUN && {
        path: "/pay-run",
        component: <PayRun />,
        name: "PAY_RUN",
      },
      Config.ON_HOLD_SALARIES && {
        path: "/on-hold-salaries",
        component: <OnHoldSalaries />,
        name: "ON_HOLD_SALARIES",
      },
      Config.ON_HOLD_SALARIES && {
        path: "/payroll/on-hold-salaries/:id",
        component: <OnHoldSalaryDetails />,
        name: "VIEW_ON_HOLD_SALARIES",
      },
      Config.END_OF_SERVICE && {
        path: "/payroll/eos",
        component: <EOSList />,
        name: "END_OF_SERVICE",
      },
      Config.END_OF_SERVICE && {
        path: "/payslip-eos/:id",
        component: <Payslip />,
        name: "VIEW_END_OF_SERVICE",
      },
      Config.END_OF_SERVICE && {
        path: "/payroll/eos/:id",
        component: <EOSDetails />,
        name: "VIEW_END_OF_SERVICE",
      },

      Config.SALARY_SETUP && {
        path: "/payroll/salary-setup-eos/:id",
        component: <EmployeeSalarySetup />,
        name: "VIEW_EMPLOYEE_SALARY_SETUP",
      },
      Config.SALARY_SETUP && {
        path: "/payroll/team-payroll-adjustment",
        component: <TeamAdjustments />,
        name: "VIEW_PAYROLL_ADJUSTMENT",
      },

      Config.PAY_RUN && {
        path: "/payroll/pay-slip-details/:id",
        component: <PayRunDetails />,
        name: "VIEW_PAYSLIPS",
      },
      Config.PAY_RUN && {
        path: "/payroll/pay-run/details/:id",
        component: <PayrollPayrunDetail />,
        name: "VIEW_RUN_PAYROLL",
      },

      Config.SELF_SERVICE_HUB &&
      Config.EMPLOYEE_OFFBOARDING && {
        path: "/self-service/exit/eos-settlement/:id",
        component: <EOSSettlementDetails />,
        name: "EOS Settlement Details",
      },
    ].filter(Boolean) // Filter out undefined route
    : []),
  ...(Config.OFFICE_SETTING
    ? [
      Config.ROLE_PERMISSIONS && {
        path: "/office-settings/role-permission",
        component: <RoleAndPermissions />,
        name: "ROLE_PERMISSIONS",
      },
      Config.ORGANIZATION && {
        path: "/office-settings",
        component: <OfficeSetting />,
        name: "ORGANIZATION",
      },
      Config.ROLE_PERMISSIONS && {
        path: "/office-settings/role-permission/user-role/add",
        component: <AddUpdateUserRoleForm />,
        name: "ADD_USER_ROLE",
      },
      Config.ROLE_PERMISSIONS && {
        path: "/office-settings/assigned-roles",
        component: <AssignedRoles />,
        name: "Add User Role",
      },
      Config.ROLE_PERMISSIONS && {
        path: "/office-settings/role-permission/user-role/edit",
        component: <AddUpdateUserRoleForm />,
        name: "EDIT_USER_ROLE",
      },
      Config.ROLE_PERMISSIONS && {
        path: "/office-settings/role-permission/history-logs",
        component: <RoleAssignmentEmployeeHistoryLogs />,
        name: "VIEW_ROLE_HISTORY_LOGS",
      },
      Config.APPROVAL_HIERARCHY && {
        path: "/office-settings/approval-hierarchy",
        component: <ApprovalHierarchy />,
        name: "APPROVAL_HIERARCHY",
      },
      Config.APPROVAL_HIERARCHY && {
        path: "/office-settings/approval-hierarchy/history",
        component: <ApprovalHierarchy active={"History & Logs"} />,
        name: "APPROVAL_HIERARCHY",
      },
      Config.APPROVAL_HIERARCHY && {
        path: "/office-settings/approval-hierarchy/hierarchy-detail",
        component: <ApprovalHierarchyDetails />,
        name: "APPROVAL_HIERARCHY",
      },
      Config.APPROVAL_HIERARCHY && {
        path: "/office-settings/approval-hierarchy/history-logs",
        component: <ApprovalHierarchyHistoryLogs />,
        name: "APPROVAL_HIERARCHY",
      },
      Config.LEAVE_SETUP && {
        path: "/office-settings/leave-setup",
        component: <LeaveManagement />,
        name: "LEAVE_SETUP",
      },
      Config.TALENT_SPHERE_SETTING && {
        path: "/office-settings/talent-sphere-setting",
        component: <TalentSphereSettingManagement />,
        name: "TALENT_SPHERE_SETTING",
      },

    ].filter(Boolean) // Filter out undefined route
    : []),
  ...(Config.ORGANIZATIONAL_CHART
    ? [
      Config.ORGANIZATION_TREE && {
        path: "/organizational-tree",
        component: <OrganizationalTree />,
        name: "ORGANIZATION_TREE",
      },
    ].filter(Boolean) // Filter out undefined route
    : []),
  ...(Config.PERFORMANCE_EDGE
    ? [
      Config.PERFORMANCE_DASHBOARD && {
        path: "/performance-dashboard",
        component: <PerformanceDashboard />,
        name: "PERFORMANCE_DASHBOARD",
      },
      Config.GENERATE_FORM && {
        path: "/performance-forms",
        component: <GenerateForm />,
        name: "GENERATE_FORM",
      },
      Config.PERFORMANCE_CYCLE_SETUP && {
        path: "/performance-cycle-setup",
        component: <PerformanceCycleSetup />,
        name: "PERFORMANCE_CYCLE_SETUP",
      },
      Config.PERFORMANCE_EVALUATION && {
        path: "/performance-evaluation",
        component: <PerformanceEvaluation />,
        name: "PERFORMANCE_EVALUATION",
      },
      Config.PERFORMANCE_EVALUATION && {
        path: "/evaluatoin-summary/:id",
        component: <EvaluationSummaryDetails />,
        name: "PERFORMANCE_EVALUATION",
      },
    ].filter(Boolean) // Filter out undefined route
    : []),
  {
    path: "/change-password",
    component: <ChangePassword />,
    name: "CHANGE_PASSWORD",
  },
];

const LoginRoutes = [
  {
    path: "/create-profile",
    component: <CreateEmployeeProfile />,
    name: "Create_Employee_Profile",
  },
  {
    path: "/clearance-revoke",
    component: <AccessRevokedPage />,
    name: "Access_Revoked",
  },
].filter(Boolean); // Filter out undefined routes;

const GeneralRoutes = [
  {
    path: "/login",
    component: <Login />,
    name: "Login",
  },
  {
    path: "/style-guide",
    component: <StyleGuide />,
    name: "Style Guide",
  },
  {
    path: "/forgot-password",
    component: <ForgotPassword />,
    name: "Forgot Password",
  },
  {
    path: "/confirm-password",
    component: <ResetPassword />,
    name: "Reset Password",
  },
  {
    path: "/access-denied",
    component: <AccessDenied />,
    name: "Access Denied",
  },
  {
    path: "/applicant-offer/:id",
    component: <ApplicantOffer />,
    name: "Applicant Offer",
  },
  {
    path: "/demographics-form/:uuid",
    component: <DemographicsForm />,
    name: "Demographics Form",
  },
].filter(Boolean); // Filter out undefined routes

export { LoginRoutes, GeneralRoutes };
