import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Button,
  Form,
} from "reactstrap";
import { Formik } from "formik";
import { connect } from "react-redux";
import {
  getEmployeeAcademicRecordData,
  saveEmployeeAcademicRecordData,
} from "app/hooks/employee.jsx";
import PageLoader from "components/PageLoader.jsx";
import { EmployeeAcademicRecord } from "app/utils/Types/Employee";
import {
  DateInput,
  SelectComponent,
  TextInput,
  CustomDarkButton,
  CustomLightOutlineButton,
  FileInput,
} from "components/form-control";
import { educationTypeOptions } from "data/Data.js";
import { Link } from "react-router-dom";

const EducationInformation = ({
  nextstep,
  baseUrl,
  token,
  employeeId,
  isEditMode,
  prevStep,
}) => {
  const formRef = React.createRef();
  const [educations, setEducations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getEmployeeAcademicRecordData(employeeId)
      .then((response) => {
        // Process the response to include the document name
        setEducations(response);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [baseUrl, employeeId, token]);

  const handleSubmit = async (data) => {
    try {
      const response = await saveEmployeeAcademicRecordData(
        employeeId,
        data.educations
      );
      if (response) nextstep();
    } catch (error) {
      console.error("Error saving academic records:", error);
    }
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
              initialValues={{ educations: educations }}
              ref={formRef}
              onSubmit={(values, { resetForm }) => {
                handleSubmit(values);
              }}
              validate={(values) => {
                const errors = {};
                return errors;
              }}
            >
              {(props) => (
                <Form onSubmit={props.handleSubmit}>
                  <Row>
                    {props.values?.educations &&
                      props.values.educations.length > 0 &&
                      props.values.educations.map((education, index) => (
                        <React.Fragment key={index}>
                          {console.log(education)}
                          <Col md="12">
                            <h5 className="fw-700 mb-3 mt-4">
                              Education {index + 1}
                            </h5>
                          </Col>
                          <div className="flex flex-wrap gap-x-3">
                            <div className="w-full md:w-[48%] z-0">
                              <SelectComponent
                                options={educationTypeOptions}
                                name={`educations[${index}].education_level`}
                                value={education.education_level}
                                onChange={(field, value) => {
                                  props.setFieldValue(field, value);
                                }}
                                label={"Educational Level"}
                                required
                                error={
                                  props.errors.educations &&
                                  props.errors.educations[index]
                                    ?.education_level
                                }
                                touched={
                                  props.touched.educations &&
                                  props.touched.educations[index]
                                    ?.education_level
                                }
                              />
                            </div>
                            <div className="w-full md:w-[48%]">
                              <TextInput
                                name={`educations[${index}].program`}
                                value={education.program}
                                onChange={(field, value) => {
                                  props.setFieldValue(field, value);
                                }}
                                label={"Program"}
                                required
                                error={
                                  props.errors.educations &&
                                  props.errors.educations[index]?.program
                                }
                                touched={
                                  props.touched.educations &&
                                  props.touched.educations[index]?.program
                                }
                              />
                            </div>
                            <div className="w-full md:w-[48%]">
                              <TextInput
                                name={`educations[${index}].institute_name`}
                                value={education.institute_name}
                                onChange={(field, value) => {
                                  props.setFieldValue(field, value);
                                }}
                                label={"Institute"}
                                required
                                error={
                                  props.errors.educations &&
                                  props.errors.educations[index]?.institute_name
                                }
                                touched={
                                  props.touched.educations &&
                                  props.touched.educations[index]
                                    ?.institute_name
                                }
                              />
                            </div>
                            <div className="w-full md:w-[48%]">
                              <DateInput
                                name={`educations[${index}].edu_start_date`}
                                value={education.edu_start_date}
                                onChange={(field, value) => {
                                  props.setFieldValue(field, value);
                                }}
                                label={"Start Date"}
                                required
                                error={
                                  props.errors.educations &&
                                  props.errors.educations[index]?.edu_start_date
                                }
                                touched={
                                  props.touched.educations &&
                                  props.touched.educations[index]
                                    ?.edu_start_date
                                }
                              />
                            </div>
                            <div className="w-full md:w-[48%]">
                              <DateInput
                                name={`educations[${index}].edu_end_date`}
                                value={education.edu_end_date}
                                onChange={(field, value) => {
                                  props.setFieldValue(field, value);
                                }}
                                label={"End Date"}
                                required
                                error={
                                  props.errors.educations &&
                                  props.errors.educations[index]?.edu_end_date
                                }
                                touched={
                                  props.touched.educations &&
                                  props.touched.educations[index]?.edu_end_date
                                }
                              />
                            </div>
                            <div className="w-full">
                              <FileInput
                                acceptType=".pdf"
                                name={`educations[${index}].education_body`}
                                value={education.education_body}
                                onChange={(field, value) => {
                                  props.setFieldValue(field, value);
                                }}
                                label={"Certification or drag it here"}
                                required
                                error={
                                  props.errors.educations &&
                                  props.errors.educations[index]?.education_body
                                }
                                touched={
                                  props.touched.educations &&
                                  props.touched.educations[index]
                                    ?.education_body
                                }
                              />
                            </div>
                          </div>
                        </React.Fragment>
                      ))}
                    <Col md="12" className="text-left">
                      <Link
                        type="button"
                        className="btn btn-outline-dark"
                        onClick={() => {
                          const length = props.values?.educations?.length;
                          const index = length ? length : 0;
                          props.setFieldValue(
                            `educations[${index}]`,
                            EmployeeAcademicRecord
                          );
                        }}
                      >
                        + Add Another
                      </Link>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col md={6} className="text-left">
                      {!isEditMode && (
                        <CustomLightOutlineButton
                          onClick={() => {
                            prevStep();
                          }}
                          label={"Back"}
                        />
                      )}
                    </Col>
                    <Col md="6" className="text-right">
                      <CustomDarkButton
                        onClick={() => {
                          props.handleSubmit();
                        }}
                        label={isEditMode ? "Save" : "Next"}
                      />
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
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
    token: state.user.token,
    baseUrl: state.user.baseUrl,
  };
};

export default connect(mapStateToProps)(EducationInformation);
