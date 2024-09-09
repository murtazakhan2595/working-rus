import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FilterInput } from "components/form-control";

const Header = ({ content }) => {
  const location = useLocation();
  const [pathName, setPathName] = useState("");

  useEffect(() => {
    const path = location.pathname.replace(/^\//, "");
    const pathNames = {
      "people-team": "People Team",
      "self-service": "Self Service",
      "talent-spere": "Talent Spere",
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
    };
    setPathName(pathNames[path] || "Dashboard");
  }, [location]);

  return (
    <div className="px-4 py-4 d-flex justify-content-between">
      <h4 className="font-bold capitalize">{pathName}</h4>
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

export default Header;
