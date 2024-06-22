import React, { useState, useRef, forwardRef } from "react";
import { Card, CardHeader, CardBody, Row, Col, Button, Form } from "reactstrap";
import { Formik } from "formik";
import { FaChevronCircleLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import {
  TextInput,
  SelectComponent,
  DateInput,
  TextAreaInput,
} from "../../../../components/form-control.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  educationTypeOptions,
  employeeTypeOptions,
  jobTypeOptions,
  locationTypeOptions,
  workTypeOptions,
} from "../../../../data/Data.js";
import PageLoader from "../../../../components/PageLoader.jsx";
import { connect } from "react-redux";
import { addJob, updateJob } from "../../../hooks/recruitment.jsx";
import { Header } from "../Sections/index.js";
import { JobDetail } from "../../../utils/Types/Recruitment.jsx";

const JobForm = forwardRef(
  ({ isLoading, formData, handleSubmit, isEditMode, id }, formRef) => {
    const initialValues = {
      JobDetail,
      ...formData,
    };

    return (
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
                  if (!values.Job_Title) {
                    errors.Job_Title = "Job Title is required";
                  }
                  return errors;
                }}
              >
                {(props) => (
                  <Form onSubmit={props.handleSubmit}>
                    <Row>
                      <Col md="12">
                        <h5 className="fw-700 mb-3 mt-4">Details</h5>
                      </Col>
                      <Col md="6">
                        <TextInput
                          name="Job_Title"
                          error={props.errors.Job_Title}
                          touch={props.touched.Job_Title}
                          value={props.values.Job_Title}
                          label="Job Title"
                          required
                          onChange={(field, value) => {
                            props.handleChange(field)(value);
                          }}
                        />
                      </Col>
                      <Col md="6">
                        <SelectComponent
                          name="Job_Type"
                          options={jobTypeOptions}
                          error={props.errors.Job_Type}
                          touch={props.touched.Job_Type}
                          value={props.values.Job_Type}
                          label="Job Type"
                          required
                          onChange={(field, value) => {
                            props.handleChange(field)(value);
                          }}
                        />
                      </Col>
                      <Col md="6">
                        <SelectComponent
                          name="Work_type"
                          options={workTypeOptions}
                          error={props.errors.Work_type}
                          touch={props.touched.Work_type}
                          value={props.values.Work_type}
                          label="Work Type"
                          required
                          onChange={(field, value) => {
                            props.handleChange(field)(value);
                          }}
                        />
                      </Col>
                      <Col md="6">
                        <SelectComponent
                          name="Employee_Type"
                          options={employeeTypeOptions}
                          error={props.errors.Employee_Type}
                          touch={props.touched.Employee_Type}
                          value={props.values.Employee_Type}
                          label="Employee Type"
                          required
                          onChange={(field, value) => {
                            props.handleChange(field)(value);
                          }}
                        />
                      </Col>
                      <Col md={6}>
                        <SelectComponent
                          name="Education"
                          options={educationTypeOptions}
                          error={props.errors.Education}
                          touch={props.touched.Education}
                          value={props.values.Education}
                          label="Education"
                          required
                          onChange={(field, value) => {
                            props.handleChange(field)(value);
                          }}
                        />
                      </Col>
                      <Col md="6">
                        <SelectComponent
                          name="location"
                          options={locationTypeOptions}
                          error={props.errors.location}
                          touch={props.touched.location}
                          value={props.values.location}
                          label="Location"
                          required
                          onChange={(field, value) => {
                            props.handleChange(field)(value);
                          }}
                        />
                      </Col>
                      <Col md="6">
                        <TextInput
                          name="min_salary"
                          error={props.errors.min_salary}
                          touch={props.touched.min_salary}
                          value={props.values.min_salary}
                          label="Salary range (min)"
                          required
                          onChange={(field, value) => {
                            props.handleChange(field)(value);
                          }}
                          regEx={/^[0-9]+$/}
                        />
                      </Col>
                      <Col md="6">
                        <TextInput
                          name="max_salary"
                          error={props.errors.max_salary}
                          touch={props.touched.max_salary}
                          value={props.values.max_salary}
                          label="Salary range (max)"
                          required
                          onChange={(field, value) => {
                            props.handleChange(field)(value);
                          }}
                          regEx={/^[0-9]+$/}
                        />
                      </Col>
                      <Col md="6">
                        <DateInput
                          name="Deadline"
                          error={props.errors.Deadline}
                          touch={props.touched.Deadline}
                          value={props.values.Deadline}
                          label="Deadline"
                          required
                          onChange={(field, value) => {
                            props.handleChange(field)(value);
                          }}
                        />
                      </Col>
                      <Col md="12">
                        <h5 className="fw-700 mb-3 mt-4">Description</h5>
                      </Col>
                      <Col md="12">
                        <TextAreaInput
                          name="Job_Requirement"
                          error={props.errors.Job_Requirement}
                          touch={props.touched.Job_Requirement}
                          value={props.values.Job_Requirement}
                          label="Job Requirement"
                          required
                          onChange={(field, value) => {
                            props.handleChange(field)(value);
                          }}
                        />
                      </Col>
                      <Col md="12">
                        <TextAreaInput
                          name="Job_Description"
                          error={props.errors.Job_Description}
                          touch={props.touched.Job_Description}
                          value={props.values.Job_Description}
                          label="Job Description"
                          required
                          onChange={(field, value) => {
                            props.handleChange(field)(value);
                          }}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col md="2">
                        <Link
                          type="button"
                          className="btn btn-outline-dark w-100"
                          to="/profile-management"
                        >
                          Cancel
                        </Link>
                      </Col>
                      <Col md="4">
                        <Button type="submit" className="btn btn-dark w-100">
                          {id ? "Update" : "Add"}
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
    );
  }
);

const CreateUpdateJob = ({ baseUrl, token, onClose, isEditMode, formData }) => {
  const formRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const id = formData?.id;

  const handleSubmit = async (values) => {
    setIsLoading(true);

    try {
      let response;
      if (isEditMode && id) {
        response = await updateJob(baseUrl, id, values, token);
      } else {
        response = await addJob(baseUrl, values, token);
      }

      if (response.status === 200 || response.status === 201) {
        toast.success(`Job ${isEditMode ? "updated" : "added"} successfully!`, {
          autoClose: 1000,
        });
        onClose();

        if (!isEditMode) {
          formRef.current.resetForm();
        }
      } else {
        toast.error(
          `Failed to ${isEditMode ? "update" : "add"} job. Please try again.`
        );
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? "updating" : "adding"} job:`, error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isEditMode ? (
        <JobForm
          isLoading={isLoading}
          formData={formData}
          handleSubmit={handleSubmit}
          formRef={formRef}
          isEditMode={isEditMode}
          id={id}
        />
      ) : (
        <div className="screen bg-[#F0F1F2]">
          <Header title="Jobs" />
          <Row>
            <Col lg={12} className="mx-auto">
              <Card>
                <CardHeader>
                  <Row>
                    <Col lg={10}>
                      <div className="h4 mb-0 d-flex align-items-center">
                        <i className="nav-icon fas fa-id-card-alt" />
                        <span className="ml-2 fw-700">
                          {id ? "Update" : "Add New"} Job
                        </span>
                      </div>
                    </Col>
                    <Col lg={2}>
                      <Link
                        type="button"
                        className="btn btn-light bg-transparent fw-700"
                        to="/jobs"
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
                  <JobForm
                    isLoading={isLoading}
                    formData={formData}
                    handleSubmit={handleSubmit}
                    formRef={formRef}
                    isEditMode={isEditMode}
                    id={id}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    baseUrl: state.user.baseUrl,
  };
};

export default connect(mapStateToProps)(CreateUpdateJob);
