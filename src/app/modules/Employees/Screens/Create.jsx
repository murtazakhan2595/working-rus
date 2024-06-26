import React, { useState, } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
} from "reactstrap";
import EmpDataHeader from "./Sections/Header.jsx";
import { FaChevronCircleLeft } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";
import { Link, useNavigate, useLocation } from "react-router-dom";
import EmployeeForm from "./Sections/EmployeeForm.jsx";

const CreateUpdateEmployee = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location?.state?.id;
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [email, setEmail] = useState("");
  const closeModal = () => {
    setShowSuccessModal(false);
    navigate("/profile-management");
  };

  return (
    <>
      <div className="screen">
        <EmpDataHeader title="Profile Managment" />
        <Row>
          <Col lg={12} className="mx-auto">
            <Card>
              <CardHeader>
                <Row>
                  <Col lg={10}>
                    <div className="h4 mb-0 d-flex align-items-center">
                      <i className="nav-icon fas fa-id-card-alt" />
                      <span className="ml-2 fw-700">
                        {id ? "Update" : "Add"} Employee
                      </span>
                    </div>
                  </Col>
                  <Col lg={2}>
                    <Link
                      type="button"
                      className="btn btn-light bg-transparent fw-700"
                      to="/profile-management"
                    >
                      <span style={{ display: "inline-block" }}>Go Back </span>
                      <FaChevronCircleLeft
                        style={{
                          display: "inline-block",
                          marginLeft: "10px",
                          marginBottom: "2px",
                        }}
                      />
                    </Link>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody style={{ maxWidth: "800px" }}>
                <EmployeeForm
                  setEmail={setEmail}
                  setShowSuccessModal={setShowSuccessModal}
                  id={id}
                />
              </CardBody>
            </Card>
          </Col>
          <Col lg={12}>
            {showSuccessModal && (
              <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
                <div className="bg-white shadow-md rounded-3xl lg:px-14 lg:py-16 w-[82%] px-10 py-12 flex justify-center items-center absolute md:w-[40%] lg:w-[26%] lg:h-[24%]">
                  <p className="text-base text-center text-gray-400">
                    User has been successfully registered and has been sent to{" "}
                    {email}
                  </p>
                  <div
                    className="absolute top-4 right-4 text-white bg-[#ECECEC] rounded-full p-[2px] cursor-pointer"
                    onClick={closeModal}
                  >
                    <RxCross2 className="text-sm" />
                  </div>
                </div>
              </div>
            )}
            <ToastContainer />
          </Col>
        </Row>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    baseUrl: state.user.baseUrl,
  };
};

export default connect(mapStateToProps)(CreateUpdateEmployee);
