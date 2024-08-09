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
import ExitRequestHeader from "./section/Header.jsx";
import { CustomDarkButton } from "components/form-control";
import { FilterInput } from "components/form-control";
import { resignationStatus } from "data/Data";
import { terminationStatus } from "data/Data";
import RequestTerminationCard from "./RequestTerminationCard";
import Terminated from "./Terminated";


const ExitAndClearance = ({ userProfile }) => {
  const [activeTab, setActiveTab] = useState("Resignations");
  const [resignations, setResignations] = useState([]);
  const [terminations, setTerminations] = useState([]);
  const [totalExit, setTotalExit] = useState(0);
  const [approvedResignation, setApprovedResignation] = useState(0);
  const [rejectedResignation, setRejectedResignation] = useState(0);
  const [terminated, setTerminated] = useState([]);
  const [filterData, setFilterData] = useState({});
  const [openRequestTermination, setOpenRequestTermination] = useState(false);
  console.log("terminateddd", terminated)

  const fetchData = async () => {
    const response = await getEmployeeExitData({filterData});
    if (response) {
      const data = response?.data.results.result;
      console.log("response in index", data);
      const resignations = data.filter(
        (item) => item.exit_category === "resignation"
      );
      const terminations = data.filter(
        (item) => item.exit_category === "termination"
      );
      const terminated = data.filter(
        (item) =>
          item.exit_category === "termination" &&
          (item.status_termination === "accepted by employee" ||
            item.status_termination === "rejected by employee")
      );
      setResignations(resignations);
      setTerminations(terminations);
      setTerminated(terminated);
      setTotalExit(response.data.results.total_exit);
      setRejectedResignation(response.data.results.rejected_resignation);
      setApprovedResignation(response.data.results.approved_resignation);
    }
  };
  useEffect(() => {
    fetchData();
  }, [userProfile, filterData]);

    const handleFilterChange = (filterName, filterValue) => {
      setFilterData((prevFilters) => {
        const updatedFilters = { ...prevFilters };
        if (filterValue === "") {
          delete updatedFilters[filterName];
        } else {
          updatedFilters[filterName] = filterValue;
        }
        return updatedFilters;
      });
    };

    const closeRequestTerminationCard = () => {
      setOpenRequestTermination(false);
      fetchData()
    }

  return (
    <div className="screen bg-[#F0F1F2]">
      {openRequestTermination && (
        <RequestTerminationCard closeModel={closeRequestTerminationCard} />
      )}
      <ExitRequestHeader
        title="Exit Requests"
        content={
          <CustomDarkButton
            label={"Request termination +"}
            onClick={() => setOpenRequestTermination(!openRequestTermination)}
          />
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
              tabs={["Resignations", "Terminations", "Resigned", "Terminated"]}
              onTabChange={(value) => {
                setActiveTab(value);
              }}
            />
          </div>
        </Col>
        <Col lg={12} className="">
          <div className="py-3 px-3 bg-white">
            <FilterInput
              filters={[
                {
                  type: "search",
                  placeholder: "Search by id",
                  name: "employee_id",
                },
                {
                  type: "select",
                  option:
                    activeTab === "Resignations"
                      ? resignationStatus
                      : terminationStatus,
                  name:
                    activeTab === "Resignations"
                      ? "status_resignation"
                      : "status_termination",
                  placeholder: "Status",
                },
              ]}
              onChange={handleFilterChange}
            />
          </div>
        </Col>
        <Col lg={12}>
          <>
            {activeTab === "Resignations" && (
              <Resignations
                userProfile={userProfile}
                resignations={resignations}
                reload={fetchData}
              />
            )}
            {activeTab === "Terminations" && (
              <Terminations
                userProfile={userProfile}
                terminations={terminations}
                reload={fetchData}
              />
            )}
            {activeTab === "Terminated" && (
              <Terminated reload={fetchData} terminated={terminated} />
            )}
          </>
        </Col>
        <br />
      </Row>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(ExitAndClearance);
