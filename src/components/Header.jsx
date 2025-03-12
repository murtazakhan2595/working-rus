import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { connect } from "react-redux";

const Header = ({ content, userProfile }) => {
  const location = useLocation();
  const [pathName, setPathName] = useState("");

  useEffect(() => {
    const path = location.pathname.replace(/^\//, "");
    const pathNames = {
      "people-team": "People Team",
      "team-profile-management": "Team Managment",
      "self-service": "Self Service",
      "talent-sphere": "Talent Sphere",
      "task-management": "Task Management",
      "pay-attendance": "Pay and Attendance",
      "people-engagement": "People Engagement",
      "personal-development": "Personal Development",
      "leave-tracker": "Leave Tracker",
      performance: "Performance",
      reports: "Reports",
      dashboard: "Dashboard",
      services: "Services",
      profile: "Profile",
      "profile-management": "Profile Management",
      "exit-clearance": "Exit Requests",
      payroll: "Employees Payrolls Testing",
      "pay-run": "Pay Run",
      "salary-setup": "Salary Setup",
      "exit-employee": "Employee Offboarding",
      "claim-request": "Claim Request",
      "my-claims": "My Claims",
      projects: `${userProfile.role === 4 ? "My Projects" : "All Projects"}`,
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
      settings: "Settings",
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
      "office-settings": "Office Setting",
      "my-attendance": "Attendance History",
      "employee-tranfer": "Employee Tranfer",
      "my-tranfers": "My Tranfers",
      "assets":"Assets",
    };
    setPathName(pathNames[path] || "Dashboard");
  }, [location]);

  return (
    <div className="flex flex-row items-center justify-between px-4 py-4">
      <h3 className="text-lg font-semibold capitalize sm:text-xl md:text-2xl lg:text-3xl">
        {pathName}
      </h3>
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
