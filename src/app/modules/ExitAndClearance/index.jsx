import React from "react";

import { connect } from "react-redux";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { getLeaveApplications } from "app/hooks/leaveManagment";
import { Tabs, Header, PageLoader } from "components";
import { Row, Col } from "reactstrap";
import { getEmployeeExitData } from "app/hooks/employee";
import StatCard from "./StatCard";
import Resignations from "./Resignations";
import Terminations from "./Terminations";

const ExitAndClearance = ({ userProfile }) => {
  const [activeTab, setActiveTab] = useState("Resignations");
  const [exitData, setExitData] = useState(null);
  console.log("exit and clearance", exitData);

  const fetchData = async () => {
    const response = await getEmployeeExitData();
    console.log("response", response);
    if (response) {
      setExitData(response);
    }
  };
  useEffect(() => {
    fetchData();
  }, [userProfile]);

  return (
    <div className="screen bg-[#F0F1F2]">
      <Header title="Exit Requests" />
      <Row className="bg-[#F0F1F2] relative">
        <Col lg={12}>
          <StatCard exitData={exitData?.data} />
        </Col>
        <Col lg={12}>
          <div className="   m-2 mb-0 0">
            <Tabs
              tabs={["Resignations", "Terminations"]}
              onTabChange={(value) => {
                setActiveTab(value);
              }}
            />
          </div>
        </Col>
        <Col lg={12}>
          <>
            {activeTab === "Resignations" && exitData ? (
              <Resignations
                userProfile={userProfile}
                exitData={exitData}
                reload={fetchData}
              />
            ) : (
              activeTab === "Terminations" && (
                <Terminations userProfile={userProfile} />
              )
            )}
          </>
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

export default connect(mapStateToProps)(ExitAndClearance);
