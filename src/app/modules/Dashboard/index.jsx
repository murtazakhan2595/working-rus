import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { getDashboard } from "./Sections";
import { Header } from "components";
import { Card } from "components/ui/card";
import ShiftDetailsWidget from "./Screens/ShiftDetailsWidget";
import { DailyShiftDetailsCard } from "app/modules/Attendance/MyAttendance/Section";

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

  // Separate main content sections and sidebar sections
  const mainContentSections = DashBoardSections.slice(1).filter(
    (section) => section.className !== "w-full"
  );

  const sidebarSections = DashBoardSections.slice(1).filter(
    (section) => section.className === "w-full"
  );

  return (
    <div className="dashboard">
      <Header />
      <div className="flex flex-col gap-4">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* My Attendance */}
          {DashBoardSections[0] && (
            <Card className="w-full h-full lg:col-span-2">
              {DashBoardSections[0].content}
            </Card>
          )}

          {/* Shift Schedule Section */}
          <div className="lg:col-span-2">
            {/* Daily Shift Details */}
            <Card className="w-full h-full">
              <DailyShiftDetailsCard
                userId={userProfile.id}
                isDashboard={true}
              />
            </Card>
          </div>

          {/* Recent Activity */}
          {DashBoardSections[2] && (
            <Card className="w-full h-full lg:col-span-2">
              {DashBoardSections[2].content}
            </Card>
          )}

          {/* Monthly Attendance */}
          {DashBoardSections[3] && (
            <Card className="w-full h-full lg:col-span-2">
              {DashBoardSections[3].content}
            </Card>
          )}

          {/* Event Calendar */}
          {DashBoardSections[4] && (
            <Card className="w-full h-full lg:col-span-2">
              {DashBoardSections[4].content}
            </Card>
          )}

          {/* Profile Completeness */}
          {DashBoardSections[5] && (
            <Card className="w-full h-full lg:col-span-2">
              {DashBoardSections[5].content}
            </Card>
          )}

          {/* My Leaves
          {DashBoardSections[6] && (
            <Card className="w-full h-full lg:col-span-3">
              {DashBoardSections[6].content}
            </Card>
          )} */}

          {/* Expired Documents */}
          {DashBoardSections[7] && (
            <Card className="w-full h-full lg:col-span-3">
              {DashBoardSections[7].content}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(Dashboard);
