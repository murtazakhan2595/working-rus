import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { Row, Col, Button } from "reactstrap";
import { LeaveType } from "utils/getValuesFromTables";
import { Status } from "../Sections";
import { EmployeeNameInfo } from "components";
import { useState } from "react";
import ViewLeaveDetails from "../Sections/ViewLeaveDetails";
import { addLeaveRequest } from "app/hooks/leaveManagment";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const RenderApplications = ({ applicationsList, activeTab, reload }) => {
  const [selectedLeaveIndex, setSelectedLeaveIndex] = useState(null);

  const handleLeaveDetails = (index) => {
    setSelectedLeaveIndex(index);
  };

  const closeModal = () => {
    setSelectedLeaveIndex(null);
  };

  const handleNext = () => {
    if (selectedLeaveIndex < applicationsList.length - 1) {
      setSelectedLeaveIndex(selectedLeaveIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (selectedLeaveIndex > 0) {
      setSelectedLeaveIndex(selectedLeaveIndex - 1);
    }
  };

  return (
    <Row className="m-2 bg-white px-2 py-4">
      {applicationsList ? (
        applicationsList.map((application, index) => {
          const status = Status(application.status_hr);
          return (
            <>
              {status === activeTab && (
                <Col
                  lg={6}
                  className={`whitespace-nowrap`}
                  key={application.id}
                >
                  <div
                    className="py-3 px-2 my-2 rounded-md overflow-hidden"
                    style={{
                      boxShadow: "0.5px 0px 5px 0px rgba(0, 0, 0, 0.19)",
                    }}
                  >
                    <RenderApplication
                      application={application}
                      activeTab={activeTab}
                      reload={reload}
                      onDetails={() => handleLeaveDetails(index)}
                    />
                  </div>
                </Col>
              )}
            </>
          );
        })
      ) : (
        <div
          className="flex justify-center items-center"
          style={{ minHeight: "20vh" }}
        >
          No records to display
        </div>
      )}
      {selectedLeaveIndex !== null && (
        <ViewLeaveDetails
          application={applicationsList[selectedLeaveIndex]}
          onClose={closeModal}
          onNext={handleNext}
          onPrevious={handlePrevious}
          disableNext={selectedLeaveIndex >= applicationsList.length - 1}
          disablePrevious={selectedLeaveIndex <= 0}
        />
      )}
    </Row>
  );
};

const RenderApplication = ({ application, activeTab, reload, onDetails }) => {
  const loggedInUser = useSelector((state) => state.user.userProfile);
  const handleApprove = async (status) => {
    try {
      const payload = application;
      let field = "";
      if (loggedInUser.role === 1 || loggedInUser.role === 3) {
        field = "status_hr";
      }
      if (field) {
        payload[field] = status;
      }
      const response = await addLeaveRequest(payload);
      if (response) {
        toast.success(`Application ${status} Successfully!`);
        reload();
      } else {
        toast.error(`Application Could not be ${status}"`);
      }
    } catch (error) {
      toast.error(`Application Could not be ${status}"`);
    }
  };

  return (
    <Row style={{ whiteSpace: "break-spaces" }}>
      <Col md={5} className="mb-3">
        <EmployeeNameInfo
          name={application?.name}
          department={application?.department_name}
          position={application?.position}
        />
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
          <b>
            <LeaveType value={application?.leave_type} />
          </b>
          <br />
          {application?.reason}
        </div>
      </Col>
      <Col md={7} className="mb-3">
        <div className="flex justify-end gap-2">
          {activeTab === "Approved" && (
            <Button
              className="btn bg-[#E6F2EE] shadow-none "
              style={{
                color: "#ACADB0",
                borderColor: "#AEC7BE",
                backgroundColor: "#E6F2EE",
                width: "200px",
              }}
            >
              Approved
            </Button>
          )}
          {activeTab === "Rejected" && (
            <Button
              className="btn shadow-none"
              style={{
                color: "#ACADB0",
                borderColor: "#EABFBC",
                backgroundColor: "#F2DCDA",
                width: "200px",
              }}
            >
              Denied
            </Button>
          )}
          {activeTab === "Pending" && (
            <Button
              className="btn btn-outline-danger bg-white shadow-none"
              style={{ color: "#dc3545" }}
              onClick={() => {
                handleApprove("Denied");
              }}
            >
              Deny
            </Button>
          )}
          {activeTab === "Pending" && (
            <Button
              className="btn btn-outline-success bg-white shadow-none"
              style={{ color: "#198754" }}
              onClick={() => {
                handleApprove("Approved");
              }}
            >
              Approve
            </Button>
          )}
          <Button
            className="btn btn-outline-primary bg-white border-0 shadow-none"
            style={{ color: "#0d6efd" }}
            onClick={onDetails}
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

export default RenderApplications;

