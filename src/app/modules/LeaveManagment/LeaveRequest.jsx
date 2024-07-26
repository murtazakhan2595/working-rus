import { connect } from "react-redux";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { getLeaveApplications } from "app/hooks/leaveManagment";
import { Tabs, Header, PageLoader } from "components";
import { FilterInput } from "components/form-control";
import { Row, Col } from "reactstrap";
import RenderApplications from "./Screens/RenderApplications";
import RenderAllApplications from "./Screens/RenderAllApplications";

const LeaveRequest = ({}) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterData, setFilterData] = useState({});
  const [activeTab, setActiveTab] = useState("Pending");
  const getApplications = async () => {
    setLoading(true);
    try {
      console.log("filterData", filterData);
      const data = await getLeaveApplications({ filterData });
      console.log(data);
      setApplications(data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getApplications();
  }, [filterData]);

  const handleFilterChange = (filterName, filterValue) => {
    setFilterData((prevFilters) => {
      //  debugger
      const updatedFilters = { ...prevFilters };
      if (!filterValue) {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }
      return updatedFilters;
    });
  };
  return (
    <div className="screen bg-[#F0F1F2]">
      <Header title="Employee Leave Requests" />
      <Row className="bg-[#F0F1F2] relative">
        <Col lg={12}>
          <div className="rounded-top bg-white p-2 m-2">
            <Tabs
              tabs={["Pending", "Approved", "Rejected", "All Applications"]}
              onTabChange={(value) => {
                setActiveTab(value);
              }}
            />
          </div>
        </Col>
        <Col lg={12}>
          {loading ? (
            <PageLoader />
          ) : (
            <>
              {activeTab === "All Applications" ? (
                <RenderAllApplications
                  applicationsList={applications}
                  activeTab={activeTab}
                  reload={getApplications}
                />
              ) : (
                <RenderApplications
                  applicationsList={applications?.results || []}
                  activeTab={activeTab}
                  reload={getApplications}
                />
              )}
            </>
          )}
        </Col>
        <br />
      </Row>
    </div>
  );
};

const mapStateToProps = (state) => {
  console.log(state);
  return {
    token: state.user.token,
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(LeaveRequest);
