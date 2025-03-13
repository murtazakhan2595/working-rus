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
import { EditEmployeeProfile } from "app/modules/Employees/Screens/Profile";
import { MyDtr } from "app/modules/DTR";
import ForgotPassword from "app/modules/Login/ForgotPassword.jsx";
import ResetPassword from "app/modules/Login/ResetPassword.jsx";
import ComingSoon from "app/modules/comingSoon/ComingSoon.jsx";
import Services from "app/shared/templates/Sidebar/Services.jsx";
import CreateEmployeeProfile from "app/modules/Employees/Screens/AddProfile/CreateEmployeeProfile.jsx";
import { ExitAndClearance, EmployeeExit } from "app/modules/ExitAndClearance";
import {
  Payslip,
  EmployeeSalaryDetails,
  EmployeesPayroll,
  MyPayroll,
  SalarySetup,
  SalarySetupDetail,
  PayRun,
  CreatePayRun,
  PayRunDetails,
} from "app/modules/payroll";
import { ClaimRequest, MyClaims } from "app/modules/claims";
import Attendance from "app/modules/Attendance";
import MyAttendance from "app/modules/Attendance/MyAttendance";
import EmployeeAttendance from "app/modules/Attendance/EmployeeAttendance";
import StyleGuide from "app/modules/StyleGuide";
import { OfficeSetting } from "app/modules/OfficeSetting";
import ShiftCalendar from "app/modules/Attendance/ShiftCalendar/ShiftCalendar";
import AttendanceReport from "app/modules/Attendance/Sections/AttendenceFile";
import EmployeeDTRs from "app/modules/DTR/EmployeeDTRs";
import OrganizationalChart from "app/modules/OfficeSetting/Screens/OrganizationalChart";
import { TeamProfileMangement } from "app/modules/TeamManagment";
import { Assets, MyAssets } from "app/modules/AssetsManagement";

const SidebarRoutes = [
  {
    path: "/",
    component: <Dashboard />,
    name: "Dashboard",
  },
  {
    path: "/services",
    component: <Services />,
    name: "Services",
  },
  Config.TASK_MANAGMENT && {
    path: "/projects",
    component: <Projects />,
    name: "Projects",
  },
  Config.TASK_MANAGMENT && {
    path: "/project-board/card/add",
    component: <TaskEditAddViewDetails />,
    name: "Project Board",
  },
  Config.TASK_MANAGMENT && {
    path: "/project-board/card/:taskId",
    component: <TaskEditAddViewDetails />,
    name: "Project Board",
  },
  Config.TASK_MANAGMENT && {
    path: "/project-board/card/:parentTaskId/subtask/:subtaskId",
    component: <TaskEditAddViewDetails />,
    name: "Project Board",
  },
  Config.TASK_MANAGMENT && {
    path: "/project-board/:projectId",
    component: <Board />,
    name: "Project Board",
  },
  Config.TASK_MANAGMENT && {
    path: "/project-board/user/:userId",
    component: <UserProfileTaskDetails />,
    name: "User Profile Details",
  },

  Config.SELF_SERVICE_HUB &&
    Config.PROFIL_MANAGMENT && {
      path: "/my-profile",
      component: <ViewEmployee profileView />,
      name: "View Employee Profile",
    },
  Config.TALENT_SPHERE && {
    path: "/edit-post/:id",
    component: <CreateUpdateJob />,
    name: "Edit Post",
  },
  Config.LEAVE_MANAGMENT && {
    path: "/leave-tracker",
    component: <LeaveTracker />,
    name: "Leave Tracker",
  },
  Config.PAYROLL &&
    Config.SELF_SERVICE_HUB && {
      path: "/my-payroll",
      component: <MyPayroll />,
      name: "My Payroll",
    },
  Config.PAYROLL && {
    path: "/payroll/:id",
    component: <EmployeeSalaryDetails />,
    name: "Payroll Details",
  },
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
  Config.SELF_SERVICE_HUB &&
    Config.EMPLOYEE_OFFBOARDING && {
      path: "/exit-employee",
      component: <EmployeeExit />,
      name: "Exit Employee",
    },
  Config.PAYROLL &&
    Config.SELF_SERVICE_HUB && {
      path: "/my-claims",
      component: <MyClaims />,
      name: "My Claims",
    },
  Config.SELF_SERVICE_HUB &&
    Config.LEAVE_MANAGMENT && {
      path: "/my-leave-tracker",
      component: <MyLeaveTracker />,
      name: "My Leave Tracker",
    },
  Config.DAILY_TASK_REPORT &&
    Config.MY_DAILY_TASK_REPORT && {
      path: "/my-dtr",
      component: <MyDtr />,
      name: "My DTR",
    },
  Config.PROFIL_MANAGMENT && {
    path: "/profile-management",
    component: <Employee />,
    name: "Profile Management",
  },
  Config.TRANSFER_MANAGEMENT && {
    path: "/employee-tranfer",
    component: <EmployeeTransfer />,
    name: "Employee Tranfer",
  },
  Config.TRANSFER_MANAGEMENT && {
    path: "/my-tranfers",
    component: <MyTransfers />,
    name: "My Tranfer",
  },
  Config.ASSETS_MANAGEMENT && {
    path: "/my-assets",
    component:<MyAssets />,
    name: "My Assets",
  },
  Config.TEAM_MANAGEMENT && {
    path: "/team-profile-management",
    component: <TeamProfileMangement />,
    name: "Team Profile Management",
  },
  Config.PROFIL_MANAGMENT && {
    path: "/create-employee",
    component: <CreateUpdateEmployee />,
    name: "Create Employee",
  },
  Config.PROFIL_MANAGMENT && {
    path: "/edit-employee/:id",
    component: <CreateUpdateEmployee />,
    name: "Edit Employee",
  },
  Config.PROFIL_MANAGMENT && {
    path: "/profile/:id",
    component: <EditEmployeeProfile />,
    name: "Edit Employee Profile",
  },
  Config.PAYROLL && {
    path: "/payroll",
    component: <EmployeesPayroll />,
    name: "Payroll",
  },
  Config.PAYROLL && {
    path: "/payroll/salary-setup/:id",
    component: <SalarySetupDetail />,
    name: "Salary Setup Detail",
  },
  Config.PAYROLL && {
    path: "/payroll/salary-setup-eos/:id",
    component: <SalarySetupDetail />,
    name: "Salary Setup EOS",
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
    path: "/salary-setup",
    component: <SalarySetup />,
    name: "Salary Setup",
  },
  Config.PAYROLL && {
    path: "/pay-run",
    component: <PayRun />,
    name: "Pay Run",
  },
  Config.ATTENDANCE && {
    path: "/attendance",
    component: <Attendance />,
    name: "Attendance",
  },
  Config.MY_ATTENDANCE && {
    path: "/my-attendance",
    component: <MyAttendance />,
    name: "My Attendance",
  },
  Config.MY_ATTENDANCE && {
    path: "/employee-dtrs",
    component: <EmployeeDTRs />,
    name: "Employee DTRs",
  },
  Config.ATTENDANCE && {
    path: "/shift-calendar",
    component: <ShiftCalendar />,
    name: "Shift Calendar",
  },

  Config.ATTENDANCE && {
    path: "attendance-reports/:id",
    component: <AttendanceReport />,
    name: "Attendance Report",
  },

  Config.ATTENDANCE && {
    path: "/attendance/:id",
    component: <EmployeeAttendance />,
    name: "Employee Attendance",
  },

  Config.OFFICE_SETTING && {
    path: "/office-settings",
    component: <OfficeSetting />,
    name: "Office Setting",
  },

  Config.PROFIL_MANAGMENT && {
    path: "/user/:id",
    component: <ViewEmployee profileView={false} />,
    name: "User Profile",
  },
  Config.TALENT_SPHERE &&
    Config.TS_PERSONAL_REQUISITION && {
      path: "/personnel-requisition",
      component: <ComingSoon />,
      name: "Personnel Requisition",
    },
  Config.TALENT_SPHERE && {
    path: "/jobs",
    component: <Jobs />,
    name: "Jobs",
  },
  Config.TALENT_SPHERE && {
    path: "/job-post",
    component: <CreateUpdateJob />,
    name: "Job Post",
  },
  Config.TALENT_SPHERE && {
    path: "/applicants/:id",
    component: <Applications />,
    name: "Applicants",
  },
  Config.TALENT_SPHERE && {
    path: "/applicants",
    component: <Applications />,
    name: "Applicants List",
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

  Config.LEAVE_MANAGMENT && {
    path: "/leave-request",
    component: <LeaveRequests />,
    name: "Leave Request",
  },
  Config.LEAVE_MANAGMENT && {
    path: "/leave-records",
    component: <LeaveTracker />,
    name: "Leave Records",
  },
  Config.PAYROLL && {
    path: "/claim-request",
    component: <ClaimRequest />,
    name: "Claim Request",
  },
  Config.EMPLOYEE_OFFBOARDING && {
    path: "/exit-clearance",
    component: <ExitAndClearance />,
    name: "Exit Clearance",
  },
  {
    path: "/organizational-chart",
    component: <OrganizationalChart />,
    name: "Organizational Chart",
  },
  Config.ASSETS_MANAGEMENT && {
    path: "/assets",
    component: <Assets />,
    name: "Assets Management",
  },
].filter(Boolean); // Filter out undefined routes

const LoginRoutes = [
  {
    path: "/create-profile",
    component: Config.EMPLOYEE_ONBOARDING ? (
      <CreateEmployeeProfile />
    ) : (
      <ComingSoon />
    ),
    name: "Create Employee Profile",
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

export { SidebarRoutes, LoginRoutes, GeneralRoutes };
