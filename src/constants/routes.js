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
import { Projects, Board } from "app/modules/TaskManagment";
import ViewEmployee from "app/modules/Employees/Screens/View";
import Err401 from "app/modules/Error/Err401.jsx";
import "react-toastify/dist/ReactToastify.css";
import CreateUpdateEmployee from "app/modules/Employees/Screens/Create.jsx";
import Employee from "app/modules/Employees/Employee.jsx";
import { EditEmployeeProfile } from "app/modules/Employees/Screens/Profile";
import Test from "app/modules/Profile/Test.jsx";
import MyDtr from "app/modules/DTR/MyDtr.jsx";
import CreateTask from "app/modules/DTR/CreateTask.jsx";
import ForgotPassword from "app/modules/Login/ForgotPassword.jsx";
import ResetPassword from "app/modules/Login/ResetPassword.jsx";
import ComingSoon from "app/modules/comingSoon/ComingSoon.jsx";
import Services from "app/shared/templates/Sidebar/Services.jsx";
import CreateEmployeeProfile from "app/modules/Employees/Screens/AddProfile/CreateEmployeeProfile.jsx";
import EmployeesExit from "app/modules/EmployeesExit";
import { ExitAndClearance } from "app/modules/ExitAndClearance";
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
import StyleGuide from "app/modules/StyleGuide";

const SidebarRoutes = [
  {
    path: "/",
    component: Config.DASHBOARD ? <Dashboard /> : <ComingSoon />,
    name: "Dashboard",
  },
  {
    path: "/services",
    component: <Services />,
    name: "Services",
  },
  {
    path: "/projects",
    component: Config.TASK_MANAGMENT ? <Projects /> : <ComingSoon />,
    name: "Projects",
  },
  {
    path: "/project-board/:projectId",
    component: Config.TASK_MANAGMENT ? <Board /> : <ComingSoon />,
    name: "Project Board",
  },
  {
    path: "/my-profile",
    component: Config.PROFIL_EMANAGMENT ? (
      <ViewEmployee profileView />
    ) : (
      <ComingSoon />
    ),
    name: "View Employee Profile",
  },
  {
    path: "/edit-post/:id",
    component: Config.TALENT_SPHERE ? <CreateUpdateJob /> : <ComingSoon />,
    name: "Edit Post",
  },
  {
    path: "/my-team",
    component: Config.PROFIL_EMANAGMENT ? <ComingSoon /> : <ComingSoon />,
    name: "My Team",
  },
  {
    path: "/my-task",
    component: Config.TASK_MANAGMENT ? <ComingSoon /> : <ComingSoon />,
    name: "My Task",
  },
  {
    path: "/calender",
    component: <ComingSoon />,
    name: "Calendar",
  },
  {
    path: "/attendence",
    component: <ComingSoon />,
    name: "Attendance",
  },
  {
    path: "/leave-tracker",
    component: Config.LEAVE_MANAGMENT ? <LeaveTracker /> : <ComingSoon />,
    name: "Leave Tracker",
  },
  {
    path: "/files-data",
    component: <ComingSoon />,
    name: "Files Data",
  },
  {
    path: "/announcement",
    component: <ComingSoon />,
    name: "Announcement",
  },
  {
    path: "/recognition",
    component: <ComingSoon />,
    name: "Recognition",
  },
  {
    path: "/my-travel-details",
    component: <ComingSoon />,
    name: "My Travel Details",
  },
  {
    path: "/letter-request",
    component: <ComingSoon />,
    name: "Letter Request",
  },
  {
    path: "/leave-calender",
    component: <ComingSoon />,
    name: "Leave Calendar",
  },
  {
    path: "/my-payroll",
    component: Config.PAYROLL ? <MyPayroll /> : <ComingSoon />,
    name: "My Payroll",
  },
  {
    path: "/payroll/:id",
    component: Config.PAYROLL ? <EmployeeSalaryDetails /> : <ComingSoon />,
    name: "Payroll Details",
  },
  {
    path: "/payslip/:id",
    component: Config.PAYROLL ? <Payslip /> : <ComingSoon />,
    name: "Payslip",
  },
  {
    path: "/payslip-eos/:id",
    component: Config.PAYROLL ? <Payslip /> : <ComingSoon />,
    name: "Payslip EOS",
  },
  {
    path: "/exit-employee",
    component: Config.EMPLOYEE_ONBOARDING ? <EmployeesExit /> : <ComingSoon />,
    name: "Exit Employee",
  },
  {
    path: "/my-claims",
    component: Config.PAYROLL ? <MyClaims /> : <ComingSoon />,
    name: "My Claims",
  },
  {
    path: "/my-leave-tracker",
    component: Config.LEAVE_MANAGMENT ? <MyLeaveTracker /> : <ComingSoon />,
    name: "My Leave Tracker",
  },
  {
    path: "/create-task",
    component: Config.TASK_MANAGMENT ? <CreateTask /> : <ComingSoon />,
    name: "Create Task",
  },
  {
    path: "/my-dtr",
    component: <MyDtr />,
    name: "My DTR",
  },
  {
    path: "/reports",
    component: Config.REPORTS ? <ComingSoon /> : <ComingSoon />,
    name: "Reports",
  },
  {
    path: "/profile-management",
    component: Config.PROFIL_EMANAGMENT ? <Employee /> : <ComingSoon />,
    name: "Profile Management",
  },
  {
    path: "/settings",
    component: Config.OFFICE_SETTING ? <ComingSoon /> : <ComingSoon />,
    name: "Settings",
  },
  {
    path: "/travel-details",
    component: <ComingSoon />,
    name: "Travel Details",
  },
  {
    path: "/customise-employees",
    component: <ComingSoon />,
    name: "Customize Employees",
  },
  {
    path: "/relocation",
    component: <ComingSoon />,
    name: "Relocation",
  },
  {
    path: "/create-employee",
    component: Config.PROFIL_EMANAGMENT ? (
      <CreateUpdateEmployee />
    ) : (
      <ComingSoon />
    ),
    name: "Create Employee",
  },
  {
    path: "/edit-employee/:id",
    component: Config.PROFIL_EMANAGMENT ? (
      <CreateUpdateEmployee />
    ) : (
      <ComingSoon />
    ),
    name: "Edit Employee",
  },
  {
    path: "/profile/:id",
    component: Config.PROFIL_EMANAGMENT ? (
      <EditEmployeeProfile />
    ) : (
      <ComingSoon />
    ),
    name: "Edit Employee Profile",
  },
  {
    path: "/payroll",
    component: Config.PAYROLL ? <EmployeesPayroll /> : <ComingSoon />,
    name: "Payroll",
  },
  {
    path: "/payroll/salary-setup/:id",
    component: Config.PAYROLL ? <SalarySetupDetail /> : <ComingSoon />,
    name: "Salary Setup Detail",
  },
  {
    path: "/payroll/salary-setup-eos/:id",
    component: Config.PAYROLL ? <SalarySetupDetail /> : <ComingSoon />,
    name: "Salary Setup EOS",
  },
  {
    path: "/payroll/create-payrun",
    component: Config.PAYROLL ? <CreatePayRun /> : <ComingSoon />,
    name: "Create Payrun",
  },
  {
    path: "/payroll/pay-slip-details/:id",
    component: Config.PAYROLL ? <PayRunDetails /> : <ComingSoon />,
    name: "Pay Slip Details",
  },
  {
    path: "/salary-setup",
    component: Config.PAYROLL ? <SalarySetup /> : <ComingSoon />,
    name: "Salary Setup",
  },
  {
    path: "/loans",
    component: Config.PAYROLL ? <ComingSoon /> : <ComingSoon />,
    name: "Loans",
  },
  {
    path: "/pay-run",
    component: Config.PAYROLL ? <PayRun /> : <ComingSoon />,
    name: "Pay Run",
  },
  {
    path: "/payslips",
    component: Config.PAYROLL ? <ComingSoon /> : <ComingSoon />,
    name: "Payslips",
  },
  {
    path: "/attendance",
    component: <Attendance />,
    name: "Attendance",
  },
  {
    path: "/development-plan",
    component: <ComingSoon />,
    name: "Development Plan",
  },
  {
    path: "/user/:id",
    component: Config.PROFIL_EMANAGMENT ? (
      <ViewEmployee profileView={false} />
    ) : (
      <ComingSoon />
    ),
    name: "User Profile",
  },
  {
    path: "/personnel-requisition",
    component: <ComingSoon />,
    name: "Personnel Requisition",
  },
  {
    path: "/jobs",
    component: Config.TALENT_SPHERE ? <Jobs /> : <ComingSoon />,
    name: "Jobs",
  },
  {
    path: "/job-post",
    component: Config.TALENT_SPHERE ? <CreateUpdateJob /> : <ComingSoon />,
    name: "Job Post",
  },
  {
    path: "/applicants/:id",
    component: Config.TALENT_SPHERE ? <Applications /> : <ComingSoon />,
    name: "Applicants",
  },
  {
    path: "/applicants",
    component: Config.TALENT_SPHERE ? <Applications /> : <ComingSoon />,
    name: "Applicants List",
  },
  {
    path: "/referals",
    component: <ComingSoon />,
    name: "Referrals",
  },
  {
    path: "/learn",
    component: <ComingSoon />,
    name: "Learn",
  },
  {
    path: "/career-planning",
    component: <ComingSoon />,
    name: "Career Planning",
  },
  {
    path: "/on-boarding",
    component: <ComingSoon />,
    name: "Onboarding",
  },
  {
    path: "/employee-evaluation",
    component: <ComingSoon />,
    name: "Employee Evaluation",
  },
  {
    path: "/leave-request",
    component: Config.LEAVE_MANAGMENT ? <LeaveRequests /> : <ComingSoon />,
    name: "Leave Request",
  },
  {
    path: "/leave-records",
    component: Config.LEAVE_MANAGMENT ? <LeaveTracker /> : <ComingSoon />,
    name: "Leave Records",
  },
  {
    path: "/claim-request",
    component: Config.PAYROLL ? <ClaimRequest /> : <ComingSoon />,
    name: "Claim Request",
  },
  {
    path: "/exit-clearance",
    component: Config.EMPLOYEE_ONBOARDING ? (
      <ExitAndClearance />
    ) : (
      <ComingSoon />
    ),
    name: "Exit Clearance",
  },
];
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
];

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
    path: "/apply/:id",
    component: Config.TALENT_SPHERE ? <JobApplicationForm /> : <ComingSoon />,
    name: "Job Application Form",
  },
  {
    path: "/job-description/:id",
    component: Config.TALENT_SPHERE ? <JobDescription /> : <ComingSoon />,
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
];

export { SidebarRoutes, LoginRoutes, GeneralRoutes };
