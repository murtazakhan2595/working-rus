import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Button, Form } from "reactstrap";
import { Formik } from "formik";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  TextInput,
  CustomDarkButton,
  SelectComponent,
  DateInput,
  TextAreaInput,
} from "../../../components/form-control.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  educationTypeOptions,
  employeeTypeOptions,
  jobTypeOptions,
  locationTypeOptions,
  workTypeOptions,
} from "../../../data/Data";
import { PiCaretCircleLeftFill } from "react-icons/pi";
import PageLoader from "../../../components/PageLoader.jsx";
import { connect } from "react-redux";
import { addJob } from "../../hooks/recruitment.jsx";

const RecruitmentForm = ({ baseUrl, token }) => {
  const formRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values) => {
    setIsLoading(true);

    try {
      const response = await addJob(baseUrl, values, token);

      if (response.status === 201) {
        toast.success("Job added successfully!");
        formRef.current.resetForm();
      } else {
        toast.error("Failed to add job. Please try again.");
      }
    } catch (error) {
      console.error("Error adding job:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col bg-[#F0F1F2]">
      <h2 className="font-lato text-xl font-bold text-baseGray px-6 py-4">Jobs</h2>
      <div className="bg-[#FAFBFC] p-4 rounded-lg mx-3 h-[88vh] overflow-y-auto hideScroll">
        <div className="flex justify-between mb-3">
          <h3 className="text-[#323333] font-bold font-lato text-2xl">
            Add New Job
          </h3>
          <Link
            to="/"
            className="flex items-center gap-x-2 font-lato font-medium text-xl"
          >
            Go Back
            <PiCaretCircleLeftFill className="text-black text-xl" />
          </Link>
        </div>
        <div className="md:max-w-3xl">
          {isLoading ? (
            <Row>
              <Col lg={12}>
                <PageLoader />
              </Col>
            </Row>
          ) : (
            <Formik
              innerRef={formRef}
              initialValues={{
                Job_Title: "",
                Job_Type: "",
                Work_type: "",
                Employee_Type: "",
                Education: "",
                location: "",
                min_salary: "",
                max_salary: "",
                Deadline: "",
                Job_Requirement: "",
                Job_Description: "",
              }}
              validate={(values) => {
                const errors = {};
                // Add your validation logic here if needed
                return errors;
              }}
              onSubmit={(values, { resetForm }) => {
                handleSubmit(values);
              }}
            >
              {(props) => (
                <Form onSubmit={props.handleSubmit}>
                  <Row>
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
                          props.setFieldValue(field, value);
                        }}
                      />
                    </Col>
                  </Row>
                  <Row>
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
                          props.setFieldValue(field, value);
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
                          props.setFieldValue(field, value);
                        }}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <SelectComponent
                        name="Education"
                        options={educationTypeOptions}
                        error={props.errors.Education}
                        touch={props.touched.Education}
                        value={props.values.Education}
                        label="Education"
                        required
                        onChange={(field, value) => {
                          props.setFieldValue(field, value);
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
                          props.setFieldValue(field, value);
                        }}
                      />
                    </Col>
                  </Row>
                  <Row>
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
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <DateInput
                        name="Deadline"
                        error={props.errors.Deadline}
                        touch={props.touched.Deadline}
                        value={props.values.Deadline}
                        label="Deadline"
                        required
                        onChange={(field, value) => {
                          props.setFieldValue(field, value);
                        }}
                      />
                    </Col>
                  </Row>
                  <h3 className="font-lato text-baseGray text-xl font-bold">
                    Description
                  </h3>
                  <Row>
                    <Col md="6">
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
                    <Col md="6">
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
                    <Col md="6" className="text-left"><CustomDarkButton
                        label="Cancel"
                      /></Col>
                    <Col md="6" className="text-right">
                      <CustomDarkButton
                        onClick={() => {
                          props.handleSubmit();
                        }}
                        label="Add"
                      />
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </div>
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

export default connect(mapStateToProps)(RecruitmentForm);

