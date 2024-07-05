import React, { useState, useEffect } from "react";
import { Row, Col, Form } from "reactstrap";
import { Formik } from "formik";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  getEmployeeProfessionalExperianceData,
  saveEmployeeProfessionalExperianceData,
  deleteEmployeeProfessionalExperianceData // Import the delete function
} from "app/hooks/employee.jsx";
import PageLoader from "components/PageLoader.jsx";
import Experience from "../Sections/ExperianceForm.jsx";
import { EmployeeProfessionalExperiance } from "app/utils/Types/Employee";
import { CustomDarkButton, CustomLightOutlineButton } from "components/form-control";
import { validationEmployeeExperienceFormSchema } from "app/utils/FormSchema/employeeFormSchema.jsx";
import { FaTimes } from "react-icons/fa"; // Import the close icon from react-icons

const ExperienceInformation = ({ nextstep, employeeId, isEditMode, prevStep, baseUrl, token }) => {
  const formRef = React.createRef();
  const [experiences, setExperiences] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getEmployeeProfessionalExperianceData(employeeId)
      .then((response) => {
        setExperiences(response);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [employeeId]);

  const handleSubmit = async (data) => {
    const response = await saveEmployeeProfessionalExperianceData(employeeId, data.experiences);
    if (response) nextstep();
  };

  const handleDelete = async (experienceId, index, props) => {
    try {
      await deleteEmployeeProfessionalExperianceData(baseUrl, employeeId, token, [experienceId]);
      const newExperiences = [...props.values.experiences];
      newExperiences.splice(index, 1);
      props.setFieldValue('experiences', newExperiences);
    } catch (error) {
      console.error("Error deleting experience:", error);
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
              initialValues={{ experiences: experiences }}
              ref={formRef}
              onSubmit={(values, { resetForm }) => {
                handleSubmit(values, resetForm);
              }}
              validate={(values) => {
                const errors = validationEmployeeExperienceFormSchema(values);
                return errors;
              }}
            >
              {(props) => (
                <Form onSubmit={props.handleSubmit}>
                  <Row>
                    {props.values?.experiences &&
                      props.values.experiences.length > 0 &&
                      props.values.experiences.map((experience, index) => (
                        <React.Fragment key={index}>
                          <Col md="12">
                            <div className="d-flex justify-content-between align-items-center">
                              <h5 className="fw-700 mb-3 mt-4">
                                Experience {index + 1}
                              </h5>
                              <FaTimes
                                className="cursor-pointer"
                                onClick={() => handleDelete(experience.id, index, props)}
                              />
                            </div>
                          </Col>
                          <Experience
                            values={experience}
                            errors={props.errors?.experiences ? props.errors?.experiences[index] : {}}
                            touched={props.touched?.experiences ? props.touched?.experiences[index] : {}}
                            onChange={(field, value) => {
                              experience[field] = value;
                              if (field === "disableEndDate" && value) {
                                experience.exp_end_date = null;
                              }
                              props.setFieldValue(`experiences[${index}]`, experience);
                            }}
                          />
                        </React.Fragment>
                      ))}
                    <Col md="12" className="text-left mt-4">
                      <Link
                        type="button"
                        className="btn btn-outline-dark"
                        onClick={() => {
                          const length = props.values?.experiences?.length;
                          const index = length ? length : 0;

                          props.setFieldValue(`experiences[${index}]`, EmployeeProfessionalExperiance);
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

export default connect(mapStateToProps)(ExperienceInformation);

