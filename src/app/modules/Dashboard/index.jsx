import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { getDashboard } from "./Sections";
import { Header } from "components";
import { Card } from "components/ui/card";
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

  return (
    <>
      <div className="dashboard ">
        <Header />
        <div className="flex flex-col gap-4 sm:grid sm:gap-4 sm:grid-cols-1 lg:gap-x-4 md:gap-x-4 sm:gap-x-0 gap-y-4 xl:grid-cols-3 md:grid-cols-2 lg:grid-cols-2">
          {DashBoardSections.map((section, index) => {
            return (
              <div key={index} className={section.className}>
                <Card className="w-full h-auto min-h-[27rem]">
                  {section.content}
                </Card>
              </div>
            );
            // else if (section.children && section.children.length > 0)
            //   return (
            //     <div key={index} className={section.className}>
            //     {console.log("section.children", section.children)}
            //       {section.children && (
            //         <>{renderSectionOptions(section.children)}</>
            //       )}
            //     </div>
            //   );
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
