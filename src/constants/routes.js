import Config from "constants/config";
import Dashboard from "app/modules/Dashboard";
import Login from "app/modules/Login";
import {
  Applications,
  Jobs,
  CreateUpdateJob,
  JobDescription,
  JobApplicationForm,
} from "app/modules/RecruitmentData";
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
import { EmployeeTransfer, MyTransfers } from "app/modules/EmployeeTransfer";
import {
  TransferAndRotation,
  JobRotationCalendar,
} from "app/modules/TransferAndRotation";
import {
  HRDocuments,
  MyDocuments,
  DocumentDetails,
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
import { TeamProfileMangement } from "app/modules/TeamManagment";
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
      ].filter(Boolean) // Filter out undefined route
    : []),
  ...(Config.PEOPLE_TEAM
    ? [
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
        Config.VIEW_JOB_ROTATION && {
          path: "/job-rotation-calendar",
          component: <JobRotationCalendar />,
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
        Config.JOBS && {
          path: "/jobs",
          component: <Jobs />,
          name: "JOBS",
        },
        Config.JOBS && {
          path: "/job-post",
          component: <CreateUpdateJob />,
          name: "JOBS",
        },
        Config.JOBS && {
          path: "/edit-post/:id",
          component: <CreateUpdateJob />,
          name: "EDIT_JOBS",
        },
        Config.TALENT_SPHERE && {
          path: "/applicants/:id",
          component: <Applications />,
          name: "Applicants",
        },
        Config.APPLICANTS && {
          path: "/applicants",
          component: <Applications />,
          name: "APPLICANTS",
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
        Config.PAY_RUN && {
          path: "/payslip/:id",
          component: <Payslip />,
          name: "VIEW_PAYSLIPS",
        },
        Config.EMPLOYEES_PAYROLL && {
          path: "/payroll",
          component: <EmployeesPayroll />,
          name: "EMPLOYEES_PAYROLL",
        },
        Config.EMPLOYEES_PAYROLL && {
          path: "/payroll/:id",
          component: <EmployeeSalaryDetails />,
          name: "Payroll Details",
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
          path: "/payroll/eos/:id",
          component: <EOSDetails />,
          name: "VIEW_END_OF_SERVICE",
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

  {
    path: "/change-password",
    component: <ChangePassword />,
    name: "CHANGE_PASSWORD",
  },
];

console.log("SidebarRoutes", SidebarRoutes);

const RemainingSidebarRoutes = [
  Config.PAYROLL && {
    path: "/payslip-eos/:id",
    component: <Payslip />,
    name: "Payslip EOS",
  },

  Config.PAYROLL && {
    path: "/payroll/salary-setup/:id",
    component: <EmployeeSalarySetup />,
    name: "Salary Setup Detail",
  },
  Config.PAYROLL && {
    path: "/payroll/salary-setup-eos/:id",
    component: <EmployeeSalarySetup />,
    name: "Salary Setup EOS",
  },
  Config.PAYROLL && {
    path: "/payroll/team-payroll-adjustment",
    component: <TeamAdjustments />,
    name: "Salary Setup",
  },
  Config.PAYROLL && {
    path: "/payroll/create-payrun",
    component: <CreatePayRun />,
    name: "Create Payrun",
  },
  Config.PAYROLL && {
    path: "/payroll/pay-slip-details/:id",
    component: <PayRunDetails />,
    name: "Pay Slip Details",
  },
  Config.PAYROLL && {
    path: "/payroll/pay-run/details/:id",
    component: <PayrollPayrunDetail />,
    name: "Payroll Details",
  },

  Config.SELF_SERVICE_HUB &&
    Config.EMPLOYEE_OFFBOARDING && {
      path: "/self-service/exit/eos-settlement/:id",
      component: <EOSSettlementDetails />,
      name: "EOS Settlement Details",
    },
].filter(Boolean); // Filter out undefined routes

const LoginRoutes = [
  {
    path: "/create-profile",
    component: <CreateEmployeeProfile />,
    name: "Create_Employee_Profile",
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
  Config.TALENT_SPHERE && {
    path: "/apply/:id",
    component: <JobApplicationForm />,
    name: "Job Application Form",
  },
  Config.TALENT_SPHERE && {
    path: "/job-description/:id",
    component: <JobDescription />,
    name: "Job Description",
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
].filter(Boolean); // Filter out undefined routes

export { LoginRoutes, GeneralRoutes };
