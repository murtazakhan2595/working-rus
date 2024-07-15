import { Link, useParams, useNavigate } from "react-router-dom";
import React, { useState, useRef } from "react";
import { Card, CardHeader, CardBody, Row, Col, Button, Form } from "reactstrap";
import { Formik } from "formik";
import {
  TextInput,
  SelectComponent,
  DateInput,
  FileInput,
  PhoneNumberInput,
  EmailInput,
} from "../../../../components/form-control.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageLoader from "../../../../components/PageLoader.jsx";
import { connect } from "react-redux";
import { addApplication } from "../../../hooks/recruitment.jsx";
import { Header } from "../Sections/index.js";
import { ApplicationDetail } from "../../../utils/Types/Recruitment.jsx";
import { getAllCountries } from "countries-and-timezones";

const countryOptions = Object.keys(getAllCountries()).map((countryCode) => ({
  value: countryCode,
  label: getAllCountries()[countryCode].name,
}));

const JobApplicationForm = () => {
  const { id } = useParams();
  const formRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const formData = { ...ApplicationDetail, ...{ job_id: id } };
  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      let response;
      response = await addApplication(values);
      if (response.status === 200 || response.status === 201) {
        toast.success(`Application submitted successfully!`, {
          autoClose: 1000,
        });
        navigate("/jobs");
      } else {
        toast.error(`Failed to submit application. Please try again.`);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        "An error occurred. Failed to submit application. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="screen bg-[#F0F1F2]">
      <Header title="Job Application" />
      <Row>
        <Col lg={12} className="mx-auto">
          <Card>
            <CardHeader>
              <Row>
                <Col lg={10}>
                  <div className="h4 mb-0 d-flex align-items-center">
                    <i className="nav-icon fas fa-id-card-alt" />
                    <span className="ml-2 fw-700">Application Form</span>
                  </div>
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
                        initialValues={formData}
                        innerRef={formRef}
                        onSubmit={(values, { resetForm }) => {
                          handleSubmit(values, resetForm);
                        }}
                        validate={(values) => {
                          const errors = {};

                          return errors;
                        }}
                      >
                        {(props) => (
                          <Form onSubmit={props.handleSubmit}>
                            <Row>
                              <Col md="6">
                                <TextInput
                                  name="first_name"
                                  error={props.errors.first_name}
                                  touch={props.touched.first_name}
                                  value={props.values.first_name}
                                  label="First Name"
                                  required={true}
                                  onChange={(field, value) => {
                                    props.handleChange(field)(value);
                                  }}
                                />
                              </Col>
                              <Col md="6">
                                <TextInput
                                  name="last_name"
                                  error={props.errors.last_name}
                                  touch={props.touched.last_name}
                                  value={props.values.last_name}
                                  label="Last Name"
                                  required={true}
                                  onChange={(field, value) => {
                                    props.handleChange(field)(value);
                                  }}
                                />
                              </Col>
                              <Col md={12}>
                                <SelectComponent
                                  name={"location"}
                                  options={countryOptions}
                                  error={props.errors.location}
                                  touch={props.touched.location}
                                  value={props.values.location}
                                  label={"Location"}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </Col>
                              <Col md={6}>
                                <PhoneNumberInput
                                  name={"phone_number"}
                                  error={props.errors.phone_number}
                                  touch={props.touched.phone_number}
                                  value={props.values.phone_number}
                                  label={"Contact no."}
                                  countryCode={props.values.country_code}
                                  countryCodeName={"country_code"}
                                  required={true}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </Col>
                              <Col md="6">
                                <EmailInput
                                  name={"email"}
                                  error={props.errors.email}
                                  touch={props.touched.email}
                                  value={props.values.email}
                                  label={"Email"}
                                  required={true}
                                  onChange={(field, value) => {
                                    props.handleChange(field)(value);
                                  }}
                                />
                              </Col>
                              <Col md="6">
                                <TextInput
                                  name="notice_period"
                                  error={props.errors.notice_period}
                                  touch={props.touched.notice_period}
                                  value={props.values.notice_period}
                                  label="Notice Period"
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                  required={true}
                                />
                              </Col>
                              <Col md="6">
                                <TextInput
                                  name="Year_of_Experience"
                                  error={props.errors.Year_of_Experience}
                                  touch={props.touched.Year_of_Experience}
                                  value={props.values.Year_of_Experience}
                                  label="Experience (in years)"
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                  maxLength={3}
                                  required={true}
                                  regEx={/^[0-9.]+$/}
                                />
                              </Col>
                              <Col md="6">
                                <TextInput
                                  name="current_salary"
                                  error={props.errors.current_salary}
                                  touch={props.touched.current_salary}
                                  value={props.values.current_salary}
                                  label="Current Salary"
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                  maxLength="14,2"
                                  regEx={/^[0-9.]+$/}
                                />
                              </Col>
                              <Col md="6">
                                <TextInput
                                  name="expected_salary"
                                  error={props.errors.expected_salary}
                                  touch={props.touched.expected_salary}
                                  value={props.values.expected_salary}
                                  label="Expected Salary"
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                  maxLength="14,2"
                                  regEx={/^[0-9.]+$/}
                                />
                              </Col>
                              <Col md="6">
                                <DateInput
                                  name="availability_for_interview"
                                  error={
                                    props.errors.availability_for_interview
                                  }
                                  touch={
                                    props.touched.availability_for_interview
                                  }
                                  value={
                                    props.values.availability_for_interview
                                  }
                                  label="Availability for interview"
                                  required={true}
                                  minDate={new Date()}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </Col>
                              <Col md="12">
                                <FileInput
                                  name="cv"
                                  label=" resume or drag it here"
                                  acceptType=".pdf"
                                  error={props.errors?.cv}
                                  touch={props.touched?.cv}
                                  value={props.values?.cv}
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
                                  to="/jobs"
                                >
                                  Cancel
                                </Link>
                              </Col>
                              <Col md="4">
                                <Button
                                  type="submit"
                                  className="btn btn-dark w-100"
                                >
                                  {"Submit"}
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
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    baseUrl: state.user.baseUrl,
  };
};

export default connect(mapStateToProps)(JobApplicationForm);
