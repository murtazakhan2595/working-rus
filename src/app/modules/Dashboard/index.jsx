import { connect } from "react-redux";
import { useEffect, useState } from "react";
import {  getDashboard } from "./Sections";
import { Header } from "components";




const filters = {
  TalentSphere: "TalentSphere",
  EmployeeOverview: "EmployeeOverview",
  AllProjects: "AllProjects",
  LeaveTracker: "LeaveTracker",
  MyTeam: "MyTeam",
  MyTasks: "MyTasks",
  MyLeaves: "MyLeaves",
  RecentActivity: "RecentActivity",
  TaskProgress: "TaskProgress",
  ProfileManagement: "ProfileManagement",
  LeaveBalance: "LeaveBalance",
};

const Dashboard = ({ userProfile }) => {
  const [filterData, setFilterData] = useState(filters);
  const [DashBoardSections, setDashBoardSections] = useState([]);

  useEffect(() => {
    if (userProfile.role) {
      const sections = getDashboard(userProfile.role);
      setDashBoardSections(sections);
    }
  }, [userProfile]);
  

  const handleFilterChange = (filterName, filterValue, filterCheckStatus) => {

    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (!filterValue || filterCheckStatus === false) {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] =
          filterCheckStatus === false ? "" : filterValue;
      }
      return updatedFilters;
    });
  };
  const renderSectionOptions = (options) => {
    return options.map((section, index) => {
      if (!!filterData[section.value])
        return (
          <div key={index} className={section.className}>
            {section.content}
          </div>
        );
      else if (section.children && section.children.length > 0)
        return (
          <div key={index} className={section.className}>
            {section.children && <>{renderSectionOptions(section.children)}</>}
          </div>
        );
    });
  };

  console.log("filterData", filterData);

  return (
    <>    
      
      <div className="dashboard ">
     <Header/>
        <div className="flex flex-col w-full gap-4">
          {DashBoardSections.map((section, index) => {
            if (!!filterData[section.value])
              return (
                <div key={index} className={section.className}>
                  {section.content}
                </div>
              );
            else if (section.children && section.children.length > 0)
              return (
                <div key={index} className={section.className}>
                {console.log("section.children", section.children)}
                  {section.children && (
                    <>{renderSectionOptions(section.children)}</>
                  )}
                </div>
              );
          })}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(Dashboard);
