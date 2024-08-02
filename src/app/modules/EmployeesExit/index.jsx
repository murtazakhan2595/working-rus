import React from "react";

import { connect } from "react-redux";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { getLeaveApplications } from "app/hooks/leaveManagment";
import { Tabs, Header, PageLoader } from "components";
import { Row, Col } from "reactstrap";
import ExitRequestForm from "./ExitRequestForm";

const EmployeeExit = ({ userProfile }) => {
  const [activeTab, setActiveTab] = useState("Exit Request");

  return (
    <div className="screen bg-[#F0F1F2]">
      <Header title="Employee Exit" />
      <Row className="bg-[#F0F1F2] relative">
        <Col lg={12}>
          <div className="   m-2 mb-0 0">
            <Tabs
              tabs={["Exit Request", "Termination Letter"]}
              onTabChange={(value) => {
                setActiveTab(value);
              }}
            />
          </div>
        </Col>
        <Col lg={12}>
          <>
            {activeTab === "Exit Request" ? (
              <ExitRequestForm userProfile={userProfile} />
            ) : (
              <>Test</>
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

export default connect(mapStateToProps)(EmployeeExit);
