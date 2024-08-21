import React from "react";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Tabs } from "components";
import { Row, Col } from "reactstrap";
import { getEmployeesExitCount } from "app/hooks/employeeExitAndClearance";
import StatCard from "./StatCard";
import Resignations from "./Resignations";
import Terminations from "./Terminations";
import { Header } from "./Sections";
import { CustomDarkButton } from "components/form-control";
import RequestTerminationCard from "./RequestTerminationCard";
import Terminated from "./Terminated";
import Resigned from "./Resigned";

const ExitAndClearance = ({ userProfile }) => {
  const [activeTab, setActiveTab] = useState("Resignations");
  const [totalExit, setTotalExit] = useState(0);
  const [approvedResignation, setApprovedResignation] = useState(0);
  const [rejectedResignation, setRejectedResignation] = useState(0);
  const [openRequestTermination, setOpenRequestTermination] = useState(false);
  const fetchData = async () => {
    try {
      const response = await getEmployeesExitCount(
        userProfile.role === 2
          ? { filterData: { reporting_to: userProfile.id } }
          : {}
      );
      if (response) {
        setTotalExit(response.total);
        setRejectedResignation(response.rejected);
        setApprovedResignation(response.approved);
      }
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const closeRequestTerminationCard = () => {
    setOpenRequestTermination(false);
    fetchData();
  };

  return (
    <div className="screen bg-[#F0F1F2]">
      {openRequestTermination && (
        <RequestTerminationCard closeModel={closeRequestTerminationCard} />
      )}
      <Header
        title="Exit Requests"
        content={
          userProfile.role !== 2 ? (
            <CustomDarkButton
              label={"Request termination +"}
              onClick={() => setOpenRequestTermination(!openRequestTermination)}
            />
          ) : (
            <></>
          )
        }
      />
      <Row className="bg-[#F0F1F2] relative">
        <Col lg={12}>
          <StatCard
            totalExit={totalExit}
            approvedResignation={approvedResignation}
            rejectedResignation={rejectedResignation}
          />
        </Col>
        <Col lg={12}>
          <div className="   m-2 mb-0 0">
            <Tabs
              tabs={[
                ...["Resignations", "Terminations"],
                ...(userProfile.role !== 2 ? ["Resigned", "Terminated"] : []),
              ]}
              onTabChange={(value) => {
                setActiveTab(value);
              }}
            />
          </div>
        </Col>
        <Col lg={12}>
          <>
            {activeTab === "Resignations" && <Resignations />}
            {activeTab === "Terminations" && <Terminations />}
            {activeTab === "Terminated" && <Terminated />}
            {activeTab === "Resigned" && <Resigned />}
          </>
        </Col>
        <br />
      </Row>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(ExitAndClearance);
