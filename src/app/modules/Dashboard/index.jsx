import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { vectorFilter } from "assets/images";
import { DashboardFilters, getDashboard } from "./Sections";
import { Header } from "components";
import { FilterInput } from "components/form-control";

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
      <div className="screen bg-[#F0F1F2] ">
        <Header
          title={`Dashboard`}
          content={
            <FilterInput
              filters={[
                {
                  type: "sorting",
                  option: DashboardFilters,
                  name: "diaplay",
                  placeholder: (
                    <div>
                      <img src={vectorFilter} className="w-[38px] h-[38px]" />
                    </div>
                  ),
                  values: filterData,
                  className: "custom-dasboard-dropdown-toggle-filter ",
                  mainHeading: "Manage Dashboard",
                },
              ]}
              onChange={handleFilterChange}
            />
          }
        />
        <div className="flex flex-wrap">
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
