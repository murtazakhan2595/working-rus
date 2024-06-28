import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { DepartmentName, DesignationName } from "utils/getValuesFromTables";
import React, { useState, useRef, forwardRef, useEffect } from "react";
import { Card, CardHeader, CardBody, Row, Col, Button, Form } from "reactstrap";
import { Formik } from "formik";
import {
  TextInput,
  SelectComponent,
  DateInput,
  FileInput,
  PhoneNumberInput,
  EmailInput,
  FilterInput,
} from "components/form-control.jsx";
import { countryOptions } from "data/Data";
const AllotLeavesForm = ({ employeeData }) => {
  const formRef = useRef();
  const [showEdit, setShowEdit] = useState(false);
  const [filterData, setFilterData] = useState({});

  const handleEditClick = () => {
    setShowEdit(true);
  };

  const handleFilterChange = (filterName, filterValue, filterCheckStatus) => {
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (!filterValue || filterCheckStatus === false) {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] =
          filterCheckStatus === false ? "" : filterValue;
      }
      return updatedFilters;
    });
  };
  return (
    <>
      <div className="flex align-bottom justify-between my-4">
        <div>
          <div className="font-bold leading-normal text-[#323333] text-left text-capitalize text-[25px]">
            {employeeData.first_name} {employeeData.last_name}
          </div>
          <div className="text-baseGray text-left flex justify-between gap-3">
            ID: {employeeData.id} |{"  "}
            <DesignationName value={employeeData.position} /> |{"  "}
            <DepartmentName value={employeeData.department_name} />
          </div>
          <div className="text-baseGray text-left mt-3">
            Jan {new Date().getFullYear()} to Dec{new Date().getFullYear()}
          </div>
        </div>
        <div className="flex items-end">
          <FilterInput
            filters={[
              {
                type: "sorting",
                option: [],
                name: "sorting",
                placeholder: "Sort By",
                values: filterData,
              },
            ]}
            onChange={handleFilterChange}
          />
        </div>
      </div>
      <div>
        <Formik
          initialValues={employeeData}
          innerRef={formRef}
          onSubmit={(values, { resetForm }) => {
            //handleSubmit(values, resetForm);
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
                    regEx={/^[0-9.]+$/}
                  />
                </Col>
                <Col md="6">
                  <DateInput
                    name="availability_for_interview"
                    error={props.errors.availability_for_interview}
                    touch={props.touched.availability_for_interview}
                    value={props.values.availability_for_interview}
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
                  <Button type="submit" className="btn btn-dark w-100">
                    {"Submit"}
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
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

export default connect(mapStateToProps)(AllotLeavesForm);
