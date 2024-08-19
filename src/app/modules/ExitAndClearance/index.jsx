import React from "react";

import { connect } from "react-redux";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Tabs, PageLoader } from "components";
import { Row, Col } from "reactstrap";
import { getEmployeeExitData } from "app/hooks/employee";
import StatCard from "./StatCard";
import Resignations from "./Resignations";
import Terminations from "./Terminations";
import { Header } from "./Section";
import { CustomDarkButton } from "components/form-control";
import { FilterInput } from "components/form-control";
import { ResignationStatusOptions } from "data/Data";
import { terminationStatus } from "data/Data";
import RequestTerminationCard from "./RequestTerminationCard";
import Terminated from "./Terminated";
import { getEmployeeData } from "app/hooks/employee";
import Resigned from "./Resigned";

const ExitAndClearance = ({ userProfile }) => {
  const [activeTab, setActiveTab] = useState("Resignations");
  const [resignations, setResignations] = useState([]);
  const [terminations, setTerminations] = useState([]);
  const [resigned, setResigned] = useState([]);
  const [totalExit, setTotalExit] = useState(0);
  const [approvedResignation, setApprovedResignation] = useState(0);
  const [rejectedResignation, setRejectedResignation] = useState(0);
  const [terminated, setTerminated] = useState([]);
  const [filterData, setFilterData] = useState({});
  const [openRequestTermination, setOpenRequestTermination] = useState(false);
  const [loading, setLoading] = useState(true);

  console.log("resigned in index", resigned);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getEmployeeExitData({ filterData });
      let employeeData = await getEmployeeData();
      console.log("employeeData", employeeData);
      if (response && employeeData) {
        const data = response?.data.results.result;
        let mergedData = data.map((exitItem) => {
          const employee = employeeData.find(
            (emp) => emp.id === exitItem.employee_id
          );
          return {
            ...exitItem,
            department_position: employee?.department_position,
            department_name: employee?.department_name,
            date_joined: employee?.date_joined,
            mobile_no: employee?.mobile_no,
          };
        });

        if (userProfile.role === 2) {
          mergedData = mergedData.filter(
            (item) => Number(item.report_to[0]) === userProfile.id
          );
        }
        const resignations = mergedData.filter(
          (item) => item.exit_category === "resignation"
        );
        const terminations = mergedData.filter(
          (item) => item.exit_category === "termination"
        );
        const terminated = mergedData.filter(
          (item) =>
            item.exit_category === "termination" &&
            (item.status_termination === "accepted by employee" ||
              item.status_termination === "rejected by employee")
        );
        const resigned = mergedData.filter(
          (item) =>
            item.exit_category === "resignation" &&
            item.status_resignation === "accepted by hr"
        );
        setResignations(resignations);
        setTerminations(terminations);
        setTerminated(terminated);
        setResigned(resigned);
        setTotalExit(response.data.results.total_exit);
        setRejectedResignation(response.data.results.rejected_resignation);
        setApprovedResignation(response.data.results.approved_resignation);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
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
        {activeTab !== "Resignations" && (
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
                        ? ResignationStatusOptions
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
        )}
        {loading ? (
          <PageLoader />
        ) : (
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
              {activeTab === "Resigned" && (
                <Resigned reload={fetchData} resigned={resigned} />
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
  };
};

export default connect(mapStateToProps)(ExitAndClearance);
