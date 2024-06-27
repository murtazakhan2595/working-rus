import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoCalendarOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import ViewJobDetails from "./ViewJobDetails";
import { getLeaveApplications } from "app/hooks/leaveManagment";
import { getList } from "app/hooks/general";
import { jobIcon } from "assets/images";
import { BsBoxArrowUpRight } from "react-icons/bs";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { Tabs, Header, PageLoader } from "components";
import {
  getEmployeeType,
  getWorkType,
  getJobType,
  getWorkLocation,
  getFilterList,
} from "utils/getValuesFromTables";
import moment from "moment";

import { getEmployeeInformation } from "app/utils/MappingObjects/mapEmployeeData";
import { FilterInput } from "components/form-control";
import { Row, Col, Button } from "reactstrap";
import { DepartmentName, LeaveType } from "utils/getValuesFromTables";

const LeaveApplication = ({ userProfile }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterData, setFilterData] = useState({});
  useEffect(() => {
    const getApplications = async () => {
      setLoading(true);
      try {
        const URL = `/leave?search=${encodeURIComponent(
          JSON.stringify(filterData)
        )}`;
        const data = await getLeaveApplications(URL);
        setApplications(data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    getApplications();
  }, [filterData]);

  const handleFilterChange = (filterName, filterValue, filterCheckStatus) => {
    setFilterData((prevFilters) => {
      //  debugger
      const updatedFilters = { ...prevFilters };
      // if (filterName !== 'status' && filterName !== 'id_and_Job_Title' && filterName !== 'updated_at') {
      //   if (!updatedFilters[filterName]) {
      //     updatedFilters[filterName] = filterValue;
      //   } else {
      //     updatedFilters[filterName] = `${updatedFilters[filterName]},${filterValue}`;
      //   }
      // }
      // else {
      if (!filterValue) {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterCheckStatus ? filterValue : "";
      }
      return updatedFilters;
    });
  };
  console.log(filterData);
  return (
    <div className="screen bg-[#F0F1F2]">
      <Header
        title="Employee Leave Requests"
        content={
          <FilterInput
            filters={[
              {
                type: "search",
                placeholder: "Search",
                name: "id_and_Job_Title",
              },
            ]}
            onChange={handleFilterChange}
          />
        }
      />
      <Row className="bg-[#F0F1F2] relative">
        {/* {selectedJob && (
                    <Col md={6}>
                        <ViewJobDetails application={selectedJob} onClose={closeModal} />
                    </Col>
                )} */}
        <Col lg={12}>
          <div className="rounded-top bg-white p-2 m-2">
            <Tabs
              tabs={["Pending", "Approved", "Rejected", "All Applications"]}
              onTabChange={(value) => {
                handleFilterChange(
                  "status",
                  value === "Open"
                    ? "live"
                    : value === "Closed"
                    ? "expired"
                    : ""
                );
              }}
            />
          </div>
        </Col>
        <Col lg={12}>
          {loading ? (
            <PageLoader />
          ) : (
            <RenderApplications applicationsList={applications} />
          )}
        </Col>
        <br />
      </Row>
    </div>
  );
};

const RenderApplications = ({ applicationsList }) => {
  return (
    <Row className="m-2 bg-white px-2 py-4">
      {applicationsList.map((application) => (
        <>
          <Col lg={6} className={`whitespace-nowrap`} key={application.id}>
            <div
              className="py-3 px-2 my-2 rounded-md overflow-hidden"
              style={{ boxShadow: "0.5px 0px 5px 0px rgba(0, 0, 0, 0.19)" }}
            >
              <RenderApplication application={application} />
            </div>
          </Col>
        </>
      ))}
    </Row>
  );
};

const RenderApplication = ({ application }) => {
  return (
    <Row style={{ whiteSpace: "break-spaces" }}>
      <Col md={5} className="mb-3">
        <div className="flex items-center">
          <div className="bg-[#BE24A5] text-[#FAFBFC] flex font-semibold text-lg items-center justify-center rounded-full w-10 h-10">
            {application?.name?.toUpperCase().charAt(0)}
            {application?.last_name?.toUpperCase().charAt(0)}
          </div>
          <div className="flex flex-col ml-2">
            <div className="text-base font-bold leading-normal text-[#323333]">
              {`${application?.name}`}
            </div>
            <div className="text-base">
              {DepartmentName(application?.position)}
            </div>
          </div>
        </div>
      </Col>
      <Col md={2} className="mb-3">
        <div>{application.total_leave} days</div>
      </Col>
      <Col md={5} className="mb-3">
        <div className="pr-1 text-right">
          {moment(application.start_date).format("DD MMM YYYY")} -{" "}
          {moment(application.end_date).format("DD MMM YYYY")}
        </div>
      </Col>
      <Col md={5} className="mb-3">
        <div>
          {LeaveType(application?.leave_type)}
          <br />
          {application?.reason}
        </div>
      </Col>
      <Col md={7} className="mb-3">
        <div className="flex justify-end gap-2">
          <Button
            className="btn btn-outline-danger bg-white shadow-none"
            style={{ color: "#dc3545" }}
          >
            Deny
          </Button>
          <Button
            className="btn btn-outline-success bg-white shadow-none"
            style={{ color: "#198754" }}
          >
            Approve
          </Button>
          <Button
            className="btn btn-outline-primary bg-white border-0 shadow-none"
            style={{ color: "#0d6efd" }}
          >
            Detail
          </Button>
        </div>
      </Col>
      <Col md={12}>
        <div className="flex justify-between gap-1">
          <StatusBar
            label={"Direct Manager"}
            value={application?.status_manager}
          />
          {application?.status_indirect_manager && (
            <StatusBar
              label={"Indirect Manager"}
              value={application?.status_indirect_manager}
            />
          )}
          <StatusBar label={"HR"} value={application?.status_hr} />
        </div>
      </Col>
    </Row>
  );
};

const StatusBar = ({ label, value }) => {
  const status = value
    ? value.includes("Approved")
      ? "Approved"
      : value.includes("Pending")
      ? "Pending"
      : value.includes("Denied")
      ? "Denied"
      : ""
    : "";
  const backgroungColor = status
    ? status === "Approved"
      ? "#ADD9CA"
      : status === "Denied"
      ? "#D99898"
      : status === "Pending"
      ? "#EEEEF0"
      : ""
    : "";
  return (
    <div className="flex-1">
      <div
        className="progress"
        style={{ height: ".5rem" }}
        title={`${
          status === "Pending"
            ? `Waiting for ${label} Approval`
            : `${status} by ${label}`
        } `}
      >
        <div
          className={`${status ? "bg-[#ADD9CA]" : "bg-[#D99898]"} progress-bar`}
          style={{ width: "100%", backgroundColor: backgroungColor }}
          role="progressbar"
          aria-valuenow="100"
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
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

export default connect(mapStateToProps)(LeaveApplication);
