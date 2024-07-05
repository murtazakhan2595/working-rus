import React, { useState, useEffect } from "react";
import { Row, Col, Form } from "reactstrap";
import { Formik } from "formik";
import { connect } from "react-redux";
import {
  getEmployeeCerficationData,
  saveEmployeeCertificationData,
  deleteEmployeeCertificateData, // Import the delete function
} from "app/hooks/employee.jsx";
import PageLoader from "components/PageLoader.jsx";
import { EmployeeCertifiation } from "app/utils/Types/Employee";
import {
  DateInput,
  TextInput,
  CustomDarkButton,
  CustomLightOutlineButton,
  FileInput,
} from "components/form-control";
import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa"; // Import the close icon from react-icons

const CertificationsInformation = ({
  nextstep,
  baseUrl,
  token,
  employeeId,
  isEditMode,
  prevStep,
}) => {
  const formRef = React.createRef();
  const [certifications, setCertifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching certification data...");
    getEmployeeCerficationData(employeeId)
      .then((response) => {
        console.log("Certification data fetched:", response);
        setCertifications(response);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("Error fetching certification data:", error);
      });
  }, [baseUrl, employeeId, token]);

  const handleSubmit = async (data) => {
    console.log("Submitting data:", data);
    try {
      const response = await saveEmployeeCertificationData(
        employeeId,
        data.certifications
      );
      console.log("Save response:", response);
      if (response) nextstep();
    } catch (error) {
      console.error("Error saving certifications:", error);
    }
  };

  const handleDelete = async (certificationId, index, props) => {
    try {
      await deleteEmployeeCertificateData(baseUrl, employeeId, token, [certificationId]);
      const newCertifications = [...props.values.certifications];
      newCertifications.splice(index, 1);
      props.setFieldValue('certifications', newCertifications);
    } catch (error) {
      console.error("Error deleting certification:", error);
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
              initialValues={{ certifications: certifications }}
              innerRef={formRef}
              onSubmit={(values, { resetForm }) => {
                console.log("Submitting form values:", values);
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
                    {props.values?.certifications &&
                      props.values.certifications.length > 0 &&
                      props.values.certifications.map(
                        (certification, index) => (
                          <React.Fragment key={index}>
                            <Col md="12">
                              <div className="d-flex justify-content-between align-items-center">
                                <h5 className="fw-700 mb-3 mt-4">
                                  Certification {index + 1}
                                </h5>
                                <FaTimes
                                  className="cursor-pointer"
                                  onClick={() => handleDelete(certification.id, index, props)}
                                />
                              </div>
                            </Col>
                            <div className="flex flex-wrap gap-x-3">
                              <div className="w-full md:w-[48%]">
                                <TextInput
                                  name={`certifications[${index}].certification_name`}
                                  value={certification.certification_name}
                                  label={"Certification Name"}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </div>
                              <div className="w-full md:w-[48%]">
                                <DateInput
                                  name={`certifications[${index}].completion_date`}
                                  value={certification.completion_date}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                  label={"Completion Date"}
                                />
                              </div>
                              <div className="w-full md:w-[48%]">
                                <DateInput
                                  name={`certifications[${index}].expiry_date`}
                                  value={certification.expiry_date}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                  label={"Expiry Date"}
                                />
                              </div>
                              <div className="w-full md:w-[48%]">
                                <TextInput
                                  name={`certifications[${index}].certification_institute`}
                                  value={certification.certification_institute}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                  label={"Certification Institute"}
                                />
                              </div>
                              <div className="w-full">
                                <FileInput
                                  acceptType=".pdf"
                                  name={`certifications[${index}].certification_body`}
                                  value={certification.certification_body}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                  label={"Certification or drag it here"}
                                  required
                                  error={
                                    props.errors.certifications &&
                                    props.errors.certifications[index]
                                      ?.certification_body
                                  }
                                  touched={
                                    props.touched.certifications &&
                                    props.touched.certifications[index]
                                      ?.certification_body
                                  }
                                />
                              </div>
                            </div>
                          </React.Fragment>
                        )
                      )}
                    <Col md="12" className="text-left">
                      <Link
                        type="button"
                        className="btn btn-outline-dark"
                        onClick={() => {
                          const length = props.values?.certifications?.length;
                          const index = length ? length : 0;
                          props.setFieldValue(
                            `certifications[${index}]`,
                            EmployeeCertifiation
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

export default connect(mapStateToProps)(CertificationsInformation);
