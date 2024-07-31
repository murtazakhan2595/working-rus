import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { Row, Col, Button } from "reactstrap";
import { Status } from "../Sections";
import { EmployeeNameInfo } from "components";
import { useState } from "react";
import ViewLeaveDetails from "../Sections/ViewLeaveDetails";
import { toast } from "react-toastify";
import { connect, useSelector } from "react-redux";
import {
  allotLeavesToEmployee,
  getEmployeeLeaveTypesById,
  updateLeaveStatus
} from "app/hooks/leaveManagment";

const RenderApplications = ({
  applicationsList,
  activeTab,
  reload,
  leaveTypes,
  userProfile,
}) => {
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
          const statusMessage =
            userProfile.role === 2
              ? application.status_manager
              : application.status_hr;
          const status = Status(statusMessage);
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
                      leaveTypes={leaveTypes}
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

const RenderApplication = ({
  application,
  activeTab,
  reload,
  onDetails,
  leaveTypes,
}) => {
  const loggedInUser = useSelector((state) => state.user.userProfile);
  const handleApprove = async (status) => {
    try {
      const payload = application;
      if (loggedInUser.role === 1 || loggedInUser.role === 3) {
        payload["status_hr"] = `${status} by HR`;
      } else if (loggedInUser.role === 2) {
        payload["status_manager"] = `${status} by Manager`;
      }
      const response = await updateLeaveStatus(payload, loggedInUser);

      // If declined, update the employee leaves
      if (response) {
        if (
          status === "Declined" &&
          (loggedInUser.role === 1 || loggedInUser.role === 3)
        ) {
          const alloted_leaves_info = await getEmployeeLeaveTypesById(
            payload.leave_type
          );
          const leavesInfo = {
            ...alloted_leaves_info,
            ...{
              left_leave: alloted_leaves_info.left_leave + payload.total_leave,
              used_leave: alloted_leaves_info.used_leave - payload.total_leave,
            },
          };
          const result = await allotLeavesToEmployee(payload.employee_id, [
            leavesInfo,
          ]);
          if (!result) {
            toast.error("Error updating employee leaves");
          }
        }
        toast.success(`Application ${status} Successfully!`);
        reload();
      } else {
        toast.error(`Application Could not be ${status}"`);
      }
    } catch (error) {
      console.error(error);
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
        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
          <b>{application?.leave_component_name}</b>
          <br />
          {application?.reason}
        </div>
      </Col>
      <Col md={7} className="mb-3">
        <div className="flex justify-end gap-2 flex-wrap">
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
                handleApprove("Declined");
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
          {/* {application?.status_indirect_manager && (
            <StatusBar
              label={"Indirect Manager"}
              value={application?.status_indirect_manager}
            />
          )} */}
          <StatusBar label={"HR"} value={application?.status_hr} />
        </div>
      </Col>
    </Row>
  );
};

const StatusBar = ({ label, value }) => {
  const status = Status(value);
  const backgroungColor = status
    ? status === "Approved"
      ? "#ADD9CA"
      : status === "Rejected"
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
  return {
    leaveTypes: state.common.leaveTypes,
    userProfile: state.user.userProfile,
  };
};
export default connect(mapStateToProps)(RenderApplications);
