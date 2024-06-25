import React, { useState, useRef, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, Row, Col, Button, Form, CardHeader } from "reactstrap";
import { Formik } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import { getAllCountries } from "countries-and-timezones";
import {
  TextInput,
  SelectComponent,
  PhoneNumberInput,
  DateInput,
} from "components/form-control.jsx";
import PageLoader from "components/PageLoader.jsx";
import {
  getDesignationList,
  getManagersList,
  getDepartmentList,
  getOrganizationList,
} from "app/hooks/general";
import { addLeaveRequest } from "app/hooks/leaveManagment";
import { getLeaveTypes } from "app/hooks/leaveManagment";
import { FaChevronCircleLeft } from "react-icons/fa";

const countryOptions = Object.keys(getAllCountries()).map((countryCode) => ({
  value: countryCode,
  label: getAllCountries()[countryCode].name,
}));

const CreateLeaveRequest = ({ token, baseUrl }) => {
  const { id } = useParams();
  const formRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [managers, setManagers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [organization, setOrganization] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const departmentResponse = await getDepartmentList();
        setDepartments(departmentResponse);

        const managerResponse = await getManagersList();
        setManagers(managerResponse);

        const designationResponse = await getDesignationList();
        setDesignations(designationResponse);

        const organizationResponse = await getOrganizationList();
        setOrganization(organizationResponse);

        const leaveTypesResponse = await getLeaveTypes();
        setLeaveTypes(leaveTypesResponse);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLists();
  }, []);

  console.log("i am leave types", leaveTypes);

  const initialValues = {
    employee_id: "",
    name: "",
    date: "",
    position: "",
    department: "",
    joining_date: "",
    nationality: "",
    start_date: "",
    end_date: "",
    last_work_day: "",
    rejoining_date: "",
    total_leave: "",
    leave_type: "",
    reason: "",
    contact_no: "",
    country_code: "",
    report_to: "",
    address_during_leave: "",
  };

  const handleSubmit = async (values, resetForm) => {
    setIsLoading(true);
    try {
      // Extract the value from the report_to field
      const modifiedValues = {
        ...values,
        report_to: values.report_to.value,
      };
      await addLeaveRequest(baseUrl, modifiedValues, token);
      toast.success("Form submitted successfully!");
      resetForm();
      navigate("/jobs");
    } catch (error) {
      toast.error("Form submission failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="screen bg-[#F0F1F2]">
      <Row>
        <Col lg={12} className="mx-auto">
          <Card>
            <CardHeader>
              <Row>
                <Col lg={10}>
                  <div className="h4 mb-0 d-flex align-items-center">
                    <i className="nav-icon fas fa-id-card-alt" />
                    <span className="ml-2 fw-700">New Leave Request</span>
                  </div>
                </Col>
                <Col lg={2}>
                  <Link
                    type="button"
                    className="btn btn-light bg-transparent fw-700"
                    to="/leave-application"
                  >
                    <span style={{ display: "inline-block" }}>Go Back</span>
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
              <>
                {isLoading ? (
                  <Row>
                    <Col lg={12}>
                      <PageLoader />
                    </Col>
                  </Row>
                ) : (
                  <Row>
                    <Col lg={12}>
                      <Formik
                        initialValues={initialValues}
                        innerRef={formRef}
                        onSubmit={(values, { resetForm }) => {
                          handleSubmit(values, resetForm);
                        }}
                        validate={(values) => {
                          const errors = {};
                          // Add your validation logic here
                          return errors;
                        }}
                      >
                        {(props) => (
                          <Form onSubmit={props.handleSubmit}>
                            <h2 className="text-baseGray font-lato text-lg font-semibold">
                              Employee Details
                            </h2>
                            <Row>
                              <Col md="6">
                                <TextInput
                                  name="employee_id"
                                  error={props.errors.employee_id}
                                  touch={props.touched.employee_id}
                                  value={props.values.employee_id}
                                  label="Employee ID"
                                  required={true}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </Col>
                              <Col md="6"></Col>

                              <Col md={6}>
                                <TextInput
                                  name="name"
                                  error={props.errors.name}
                                  touch={props.touched.name}
                                  value={props.values.name}
                                  label="Name"
                                  required={true}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </Col>
                              <Col md="6">
                                <DateInput
                                  name="date"
                                  error={props.errors.date}
                                  touch={props.touched.date}
                                  value={props.values.date}
                                  label="Date"
                                  required={true}
                                  minDate={new Date()}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </Col>
                              <Col md="6">
                                {/* <TextInput
                                  name="position"
                                  error={props.errors.position}
                                  touch={props.touched.position}
                                  value={props.values.position}
                                  label="Position"
                                  required={true}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                /> */}

                                <SelectComponent
                                  name="position"
                                  options={designations}
                                  error={props.errors.position}
                                  touch={props.touched.position}
                                  value={props.values.position}
                                  label="Position"
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </Col>
                              <Col md="6">
                                <SelectComponent
                                  name="department"
                                  options={departments}
                                  error={props.errors.department}
                                  touch={props.touched.department}
                                  value={props.values.department}
                                  label="Department"
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </Col>
                              <Col md="6">
                                <DateInput
                                  name="joining_date"
                                  error={props.errors.joining_date}
                                  touch={props.touched.joining_date}
                                  value={props.values.joining_date}
                                  label="Joining Date"
                                  required={true}
                                  minDate={new Date()}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </Col>
                              <Col md="6">
                                <SelectComponent
                                  name="nationality"
                                  options={countryOptions}
                                  error={props.errors.nationality}
                                  touch={props.touched.nationality}
                                  value={props.values.nationality}
                                  label="Nationality"
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </Col>
                            </Row>
                            <h2 className="text-baseGray font-lato text-lg font-semibold">
                              Leave Details
                            </h2>
                            <Row>
                              <Col md="6">
                                <DateInput
                                  name="start_date"
                                  error={props.errors.start_date}
                                  touch={props.touched.start_date}
                                  value={props.values.start_date}
                                  label="Start Date"
                                  required={true}
                                  minDate={new Date()}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </Col>
                              <Col md="6">
                                <DateInput
                                  name="end_date"
                                  error={props.errors.end_date}
                                  touch={props.touched.end_date}
                                  value={props.values.end_date}
                                  label="End Date"
                                  required={true}
                                  minDate={new Date()}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </Col>

                              <Col md={6}>
                                <DateInput
                                  name="last_work_day"
                                  error={props.errors.last_work_day}
                                  touch={props.touched.last_work_day}
                                  value={props.values.last_work_day}
                                  label="Last Work Day"
                                  required={true}
                                  minDate={new Date()}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </Col>
                              <Col md={6}>
                                <DateInput
                                  name="rejoining_date"
                                  error={props.errors.rejoining_date}
                                  touch={props.touched.rejoining_date}
                                  value={props.values.rejoining_date}
                                  label="Rejoining Date"
                                  required={true}
                                  minDate={new Date()}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </Col>
                              <Col md="6">
                                <TextInput
                                  name="total_leave"
                                  error={props.errors.total_leave}
                                  touch={props.touched.total_leave}
                                  value={props.values.total_leave}
                                  label="Total Leave"
                                  required={true}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </Col>
                              <Col md="6">
                                <SelectComponent
                                  name="leave_type"
                                  options={leaveTypes}
                                  error={props.errors.leave_type}
                                  touch={props.touched.leave_type}
                                  value={props.values.leave_type}
                                  label="Leave Type"
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </Col>
                              <Col md="12">
                                <TextInput
                                  name="reason"
                                  error={props.errors.reason}
                                  touch={props.touched.reason}
                                  value={props.values.reason}
                                  label="Reason"
                                  required={true}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </Col>
                              <Col md="6">
                                <PhoneNumberInput
                                  name={"contact_no"}
                                  error={props.errors.contact_no}
                                  touch={props.touched.contact_no}
                                  value={props.values.contact_no}
                                  label={"Contact Number"}
                                  countryCode={props.values.country_code}
                                  countryCodeName={"country_code"}
                                  required={true}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </Col>
                              <Col md="6">
                                <SelectComponent
                                  name="report_to"
                                  options={managers}
                                  error={props.errors.report_to}
                                  touch={props.touched.report_to}
                                  value={props.values.report_to}
                                  label="Report To"
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </Col>
                              <Col md="12">
                                <TextInput
                                  name="address_during_leave"
                                  error={props.errors.address_during_leave}
                                  touch={props.touched.address_during_leave}
                                  value={props.values.address_during_leave}
                                  label="Address During Leave"
                                  required={true}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </Col>
                            </Row>
                            <Row>
                              <Col md="2">
                                <Link
                                  type="button"
                                  className="btn btn-outline-dark w-100"
                                  to="/"
                                >
                                  Cancel
                                </Link>
                              </Col>
                              <Col md="4">
                                <Button
                                  type="submit"
                                  className="btn btn-dark w-100"
                                >
                                  Submit
                                </Button>
                              </Col>
                            </Row>
                          </Form>
                        )}
                      </Formik>
                    </Col>
                  </Row>
                )}
              </>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <ToastContainer />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    baseUrl: state.user.baseUrl,
  };
};

export default connect(mapStateToProps)(CreateLeaveRequest);
