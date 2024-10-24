import React from "react";

import { connect } from "react-redux";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Tabs, Header, PageLoader } from "components";
import { Row, Col } from "reactstrap";
import ExitRequestForm from "./ExitRequestForm";
import { getEmployeeExitDataById } from "app/hooks/employee";
import ExitRequestDetails from "./ExitRequestDetails";

const EmployeeExit = ({ userProfile, userDetails }) => {
  const [activeTab, setActiveTab] = useState("Exit Request");
  const [resignation, setResignation] = useState({});
  const [termination, setTermination] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getEmployeeExitDataById(userProfile.id);
      if (response) {
        const data = response?.data.results.result;
        const resignations = data.filter(
          (item) => item.exit_category === "resignation"
        );
        const terminations = data.filter(
          (item) => item.exit_category === "termination"
        );

        setResignation(resignations[0]);
        setTermination(terminations[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [userProfile]);

  return (
    <div className="screen bg-[#F0F1F2]">
      <Header title="Employee Offboarding" />
      <Row className="bg-[#F0F1F2] relative">
        <Col lg={12}>
          <div className="m-2 mb-0 0">
            <Tabs
              tabs={["Exit Request", "Termination Letter"]}
              onTabChange={(value) => {
                setActiveTab(value);
              }}
            />
          </div>
        </Col>
        {loading ? (
          <PageLoader />
        ) : (
          <Col lg={12}>
            <>
              {activeTab === "Exit Request" && resignation ? (
                <ExitRequestDetails
                  userDetails={userDetails}
                  exitData={resignation}
                  isTermination={false}
                />
              ) : activeTab === "Exit Request" ? (
                <ExitRequestForm userProfile={userProfile} reload={fetchData} />
              ) : termination ? (
                <ExitRequestDetails
                  userDetails={userDetails}
                  exitData={termination}
                  isTermination={true}
                />
              ) : (
                <div className="w-full h-96 bg-white flex items-center justify-center text-3xl text-gray-600">
                  <div>No Termination Letter</div>
                </div>
              )}
            </>
          </Col>
        )}
        <br />
      </Row>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    userProfile: state.user.userProfile,
    userDetails: state.emp.userDetails,
  };
};

export default connect(mapStateToProps)(EmployeeExit);
