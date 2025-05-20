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
  LeaveRequests,
} from "app/modules/LeaveTracker";
import {
  Projects,
  Board,
  UserProfileTaskDetails,
  TaskEditAddViewDetails,
} from "app/modules/TaskManagment";
import ViewEmployee from "app/modules/Employees/Screens/View";
import "react-toastify/dist/ReactToastify.css";
import CreateUpdateEmployee from "app/modules/Employees/Screens/Create.jsx";
import Employee from "app/modules/Employees/Employee.jsx";
import { EmployeeTransfer, MyTransfers } from "app/modules/EmployeeTransfer";
import {
  HRDocuments,
  MyDocuments,
  DocumentDetails,
} from "app/modules/HRDocuments";
import { EditEmployeeProfile } from "app/modules/Employees/Screens/Profile";
import { MyDtr } from "app/modules/DTR";
import ForgotPassword from "app/modules/Login/ForgotPassword.jsx";
import ResetPassword from "app/modules/Login/ResetPassword.jsx";
import ComingSoon from "app/modules/comingSoon/ComingSoon.jsx";
import { ApprovalHierarchy } from "app/modules/ApprovalHierarchy";
import CreateEmployeeProfile from "app/modules/Employees/Screens/AddProfile/CreateEmployeeProfile.jsx";
import { ExitAndClearance, EmployeeExit } from "app/modules/ExitAndClearance";
import { Exit, EOSSettlementDetails } from "app/modules/SelfService/Exit";
import {
  Payslip,
  EmployeeSalaryDetails,
  EmployeesPayroll,
  MyPayroll,
  SalarySetup,
  EmployeeSalarySetup,
  PayRun,
  CreatePayRun,
  PayRunDetails,
  PayrollPayrunDetail,
} from "app/modules/Payroll";
import { ClaimRequest, MyClaims } from "app/modules/claims";
import {
  Attendance,
  MyAttendance,
  EmployeeAttendance,
  EmployeeAttendanceReport,
} from "app/modules/Attendance";
import StyleGuide from "app/modules/StyleGuide";
import { OfficeSetting } from "app/modules/OfficeSetting";
import ShiftCalendar from "app/modules/Attendance/ShiftCalendar/ShiftCalendar";
import EmployeeDTRs from "app/modules/DTR/EmployeeDTRs";
import OrganizationalChart from "app/modules/OfficeSetting/Screens/OrganizationalChart";
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
          component: <TeamProfileMangement />,
          name: "TEAM_PROFILE",
        },
        Config.TEAM_LEAVE_REQUEST && {
          path: "/team-leave-request",
          component: <LeaveRequests isTeamView={true} />,
          name: "TEAM_LEAVE_REQUEST",
        },
        Config.TEAM_EXIT_CLEARANCE && {
          path: "/team-exit-clearance",
          component: <ExitAndClearance isTeamView={true} />,
          name: "TEAM_EXIT_CLEARANCE",
        },
      ].filter(Boolean) // Filter out undefined route
    : []),
  ...(Config.TEAM_MANAGEMENT
    ? [
        Config.TEAM_PROFILE && {
          path: "/team-profile-management",
          component: <TeamProfileMangement />,
          name: "TEAM_PROFILE",
        },
        Config.TEAM_LEAVE_REQUEST && {
          path: "/team-leave-request",
          component: <LeaveRequests isTeamView={true} />,
          name: "TEAM_LEAVE_REQUEST",
        },
        Config.TEAM_EXIT_CLEARANCE && {
          path: "/team-exit-clearance",
          component: <ExitAndClearance isTeamView={true} />,
          name: "TEAM_EXIT_CLEARANCE",
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
          path: "/employee-tranfer",
          component: <EmployeeTransfer />,
          name: "EMPLOYEE_TRANSFER",
        },

        Config.EMPLOYEE_CREATION && {
          path: "/create-employee",
          component: <CreateUpdateEmployee />,
          name: "EMPLOYEE_CREATION",
        },
        Config.PROFILE_MANAGEMENT && {
          path: "/edit-employee/:id",
          component: <CreateUpdateEmployee />,
          name: "Edit Employee",
        },
        Config.PROFILE_MANAGEMENT && {
          path: "/profile/:id",
          component: <EditEmployeeProfile />,
          name: "Edit Employee Profile",
        },
        Config.PROFILE_MANAGEMENT && {
          path: "/user/:id",
          component: <ViewEmployee profileView={false} />,
          name: "User Profile",
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
        Config.TASK_MANAGMENT && {
          path: "/projects",
          component: <Projects />,
          name: "PROJECT_BOARD",
        },
      ].filter(Boolean) // Filter out undefined route
    : []),
  ...(Config.LEAVE_MANAGEMENT
    ? [
        Config.LEAVE_RECORDS && {
          path: "/leave-records",
          component: <LeaveTracker />,
          name: "LEAVE_RECORDS",
        },
        Config.LEAVE_REQUEST && {
          path: "/leave-request",
          component: <LeaveRequests />,
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
      ].filter(Boolean) // Filter out undefined route
    : []),
  ...(Config.OFFICE_SETTING
    ? [
        Config.ROLE_PERMISSIONS && {
          path: "/office-settings/role-permission",
          component: <RoleAndPermissions />,
          name: "ROLE_PERMISSIONS",
        },
        Config.OFFICE_SETTING && {
          path: "/office-settings",
          component: <OfficeSetting />,
          name: "OFFICE_SETTING",
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
      ].filter(Boolean) // Filter out undefined route
    : []),
  {
    path: "/change-password",
    component: <ChangePassword />,
    name: "CHANGE_PASSWORD",
  },
];

const RemainingSidebarRoutes = [
  {
    path: "/",
    component: <Dashboard />,
    name: "DASHBOARD",
  },

  Config.TASK_MANAGMENT && {
    path: "/project-board/card/add",
    component: <TaskEditAddViewDetails />,
    name: "PROJECT_BOARD",
  },
  Config.TASK_MANAGMENT && {
    path: "/project-board/card/:taskId",
    component: <TaskEditAddViewDetails />,
    name: "VIEW_ALL_PROJECTS",
  },
  Config.TASK_MANAGMENT && {
    path: "/project-board/card/:parentTaskId/subtask/:subtaskId",
    component: <TaskEditAddViewDetails />,
    name: "VIEW_ALL_PROJECTS",
  },
  Config.TASK_MANAGMENT && {
    path: "/project-board/:projectId",
    component: <Board />,
    name: "VIEW_ALL_PROJECTS",
  },
  Config.TASK_MANAGMENT && {
    path: "/project-board/user/:userId",
    component: <UserProfileTaskDetails />,
    name: "VIEW_ALL_PROJECTS",
  },

  Config.TALENT_SPHERE && {
    path: "/edit-post/:id",
    component: <CreateUpdateJob />,
    name: "JOBS",
  },
  Config.LEAVE_MANAGMENT && {
    path: "/leave-tracker",
    component: <LeaveTracker />,
    name: "LEAVE_RECORDS",
  },

  // Config.PAYROLL && {
  //   path: "/payroll/:id",
  //   component: <EmployeeSalaryDetails />,
  //   name: "Payroll Details",
  // },
  Config.PAYROLL && {
    path: "/payslip/:id",
    component: <Payslip />,
    name: "Payslip",
  },
  Config.PAYROLL && {
    path: "/payslip-eos/:id",
    component: <Payslip />,
    name: "Payslip EOS",
  },

  Config.PAYROLL && {
    path: "/payroll",
    component: <EmployeesPayroll />,
    name: "Payroll",
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
  Config.PAYROLL && {
    path: "/payroll/salary-setup",
    component: <SalarySetup />,
    name: "Salary Setup",
  },
  Config.PAYROLL && {
    path: "/pay-run",
    component: <PayRun />,
    name: "Pay Run",
  },
  Config.PAYROLL && {
    path: "/payroll/eos",
    component: <EOSList />,
    name: "End of Service",
  },
  Config.PAYROLL && {
    path: "/payroll/eos/:id",
    component: <EOSDetails />,
    name: "EOS Details",
  },

  Config.ATTENDANCE && {
    path: "attendance-reports/:id",
    component: <EmployeeAttendanceReport />,
    name: "Attendance Report",
  },

  Config.ATTENDANCE && {
    path: "/attendance/:id",
    component: <EmployeeAttendance />,
    name: "Employee Attendance",
  },

  Config.TALENT_SPHERE &&
    Config.TS_PERSONAL_REQUISITION && {
      path: "/personnel-requisition",
      component: <ComingSoon />,
      name: "Personnel Requisition",
    },

  Config.TALENT_SPHERE &&
    Config.TS_REFERRALS && {
      path: "/referals",
      component: <ComingSoon />,
      name: "Referrals",
    },

  Config.TALENT_SPHERE &&
    Config.TS_ON_BOARDING && {
      path: "/on-boarding",
      component: <ComingSoon />,
      name: "Onboarding",
    },

  Config.PAYROLL && {
    path: "/claim-request",
    component: <ClaimRequest />,
    name: "Claim Request",
  },
  Config.PAYROLL && {
    path: "/on-hold-salaries",
    component: <OnHoldSalaries />,
    name: "On-Hold Salaries",
  },
  Config.PAYROLL && {
    path: "/payroll/on-hold-salaries/:id",
    component: <OnHoldSalaryDetails />,
    name: "On-Hold Salary Details",
  },

  {
    path: "/organizational-chart",
    component: <OrganizationalChart />,
    name: "Organizational Chart",
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
