import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { Button } from "components/ui/button";
import { ArrowLeft } from "lucide-react";

const pathNames = () => {
  return {
    "people-team": "People Team",
    "manpower-planning": "Manpower Planning",
    "team-profile-management": "Team Managment",
    "self-service": "Self Service",
    "talent-sphere-setting": "Talent Sphere Setting",
    "talent-sphere": "Talent Sphere",
    "task-management": "Task Management",
    "pay-attendance": "Pay and Attendance",
    "people-engagement": "People Engagement",
    "personal-development": "Personal Development",
    "leave-tracker": "Leave Tracker",
    'performance-cycle-setup': 'Performance Cycle',
    'evaluatoin-summary': 'Evaluation Details',
    'team-performance-evaluation': 'Team Performance',
    performance: "Performance",
    reports: "Reports",
    dashboard: "Dashboard",
    services: "Services",
    profile: "Profile",
    "profile-management": "Profile Management",
    "exit-clearance": "Exit Requests",
    payroll: "Employees Payroll",
    "pay-run": "Pay Run",
    "salary-setup": "Salary Setup",
    "exit-employee": "Employee Offboarding",
    "claim-request": "Claim Request",
    "my-claims": "My Claims",
    projects: `Projects`,
    "leave-records": "Leave Records",
    applications: "Applications",
    applicants: "Applicants",
    "create-profile": "Create Profile",
    "project-board": "Project Board",
    "my-profile": "My Profile",
    test: "Test",
    "my-team": "My Team",
    "my-task": "My Tasks",
    calender: "Calendar",
    attendance: "Attendance",
    "shift-calendar": "Shift Calender",
    "files-data": "Files Data",
    announcement: "Announcements",
    recognition: "Recognition",
    "my-travel-details": "My Travel Details",
    "letter-request": "Letter Request",
    "leave-calender": "Leave Calendar",
    "my-payroll": "My Payroll",
    "create-task": "Create Task",
    "my-dtr": "Daily Tasks Report",
    "employee-dtrs": "Daily Tasks Report",
    "user-role/add": "Add User Role",
    "user-role/edit": "Update User Role",
    "role-permission/history-logs": "Role Assignment History & Logs",
    "role-permission": "Role & Permission",
    "travel-details": "Travel Details",
    "customise-employees": "Customize Employees",
    relocation: "Relocation",
    "create-employee": "Create Employee",
    loans: "Loans",
    payslips: "Payslips",
    "development-plan": "Development Plan",
    "personnel-requisition": "Personnel Requisition",
    jobs: "Jobs",
    "job-post": "Job Post",
    tests: "Tests",
    referals: "Referrals",
    learn: "Learning",
    "career-planning": "Career Planning",
    "on-boarding": "Onboarding",
    "employee-evaluation": "Employee Evaluation",
    "leave-request": "Leave Request",
    recruitment: "Recruitment",
    "my-leave-tracker": "My Leave Tracker",
    "job-application": "Job Application",
    "job-application-form": "Job Application Form",
    "job-description": "Job Description",
    "my-attendance": "Attendance History",
    "tranfer-rotations": "Transfers & Rotations",
    "job-rotations": "Job Rotations",
    "my-tranfers": "My Tranfers",
    assets: "Assets",
    "my-assets": "My Assets",
    "my-shift-calendar": "My Shift Calendar",
    "request-and-assign": "Request and Assign",
    documents: "HR Documents",
    "my-documents": "HR Documents",
    "on-hold-salaries": "On-Hold Salaries",
    "hierarchy-detail": "Approval Hierarchy Detail",
    "office-settings/approval-hierarchy": "Approval Hierarchy",
    "leave-setup": "Leave Setup",
    "office-settings": "Organization Setup",
    settings: "Settings",
    "time-adjustments": "Time Ajustments",
    "employee-leave-count": "Employee Leave Count",
    "organizational-tree": "Organizational Chart",
    "job-rotation-calendar": "Job Rotation Calendar",
    "clearance-requests": "Clearance & Handover Management",
    "my-letter-request": "My Letter Requests",
  };
};

const Header = ({
  content,
  showBackButton = false,
  navigationLink = "-1",
  showTitle = true,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [pathName, setPathName] = useState("");
  const PATHNAMELIST = React.useMemo(() => {
    return pathNames();
  }, []);

  useEffect(() => {
    const path = location.pathname.replace(/^\//, "");
    const matchedPathKey = Object.keys(PATHNAMELIST).find((key) =>
      path.includes(key)
    );
    setPathName(PATHNAMELIST[matchedPathKey] || "Dashboard");
  }, [location]);

  return (
    <div className="flex flex-row items-center justify-between px-4 py-4">
      <div className="flex flex-row gap-2">
        {showBackButton && (
          <Button
            variant="ghost"
            onClick={() => {
              navigate(navigationLink);
            }}
            className="p-0 text-xl text-balance hover:bg-transparent"
          >
            <ArrowLeft className="w-6 h-6 mr-2 bg-white rounded-lg shadow-sm" />
            {!showTitle ? "Go Back" : ""}
          </Button>
        )}
        {showTitle && (
          <h3 className="text-lg font-semibold capitalize sm:text-xl md:text-2xl lg:text-3xl">
            {pathName}
          </h3>
        )}
      </div>
      <div className="flex flex-wrap justify-end gap-3">{content}</div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};
export default connect(mapStateToProps)(Header);
