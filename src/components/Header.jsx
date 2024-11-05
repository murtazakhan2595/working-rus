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
      payroll: "Employees Payrolls",
      "pay-run": "Pay Run",
      "salary-setup": "Salary Setup",
      "exit-employee": "Employee Offboarding",
      "claim-request": "Claim Request",
      "my-claims": "My Claims",
      "projects": `${userProfile.role === 4 ? "My Projects" : "All Projects"}`,
      "leave-records": "Leave Records",
      "applications": "Applications",
      "applicants": "Applicants",
      "create-profile": "Create Profile",
      "project-board": "Project Board",
      "my-profile": "My Profile",
      "test": "Test",
      "my-team": "My Team",
      "my-task": "My Tasks",
      "calender": "Calendar",
      "attendance": "Attendance",
      "files-data": "Files Data",
      "announcement": "Announcements",
      "recognition": "Recognition",
      "my-travel-details": "My Travel Details",
      "letter-request": "Letter Request",
      "leave-calender": "Leave Calendar",
      "my-payroll": "My Payroll",
      "create-task": "Create Task",
      "my-dtr": "My DTR",
      "settings": "Settings",
      "travel-details": "Travel Details",
      "customise-employees": "Customize Employees",
      "relocation": "Relocation",
      "create-employee": "Create Employee",
      "loans": "Loans",
      "payslips": "Payslips",
      "development-plan": "Development Plan",
      "personnel-requisition": "Personnel Requisition",
      "jobs": "Jobs",
      "job-post": "Job Post",
      "tests": "Tests",
      "referals": "Referrals",
      "learn": "Learning",
      "career-planning": "Career Planning",
      "on-boarding": "Onboarding",
      "employee-evaluation": "Employee Evaluation",
      "leave-request": "Leave Request",
      "recruitment": "Recruitment",
      "my-leave-tracker": "My Leave Tracker",
    };
    setPathName(pathNames[path] || "Dashboard");
  }, [location]);

  return (
    <div className="flex flex-row items-center justify-between px-4 py-4">
      <h3 className="capitalize h4 ">{pathName}</h3>
      <div className="flex flex-wrap justify-end gap-3">
        {/* <FilterInput
          filters={[
            {
              type: "search",
              placeholder: "Search",
              name: "id_and_Job_Title",
            },
          ]}
          onChange={(filterName, filterValue) => {
            // Handle filter change here if needed
          }}
        /> */}
        {content}
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};
export default connect(mapStateToProps)( Header);
