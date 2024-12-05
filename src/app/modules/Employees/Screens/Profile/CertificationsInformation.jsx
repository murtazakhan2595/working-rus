/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";

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
  CoverFileUpload
} from "components/form-control";
import { Link } from "react-router-dom";


import { Button } from "../../../../../components/ui/button";

import { CircleX } from "lucide-react";
import { Card, CardContent } from "components/ui/card";

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
  const [date, setDate] = useState(new Date());
  const [selectedValue, setSelectedValue] = useState('');

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
  const handleChange = (name, value) => {
    console.log(`Selected ${name}: ${value}`)
    setSelectedValue(value)
  }
  return (
    <>
     {isLoading ?
        (
          <div>
            <div className="space-y-4">
              <PageLoader />
            </div>
          </div>
        ) :
        (
          <>
          <Card>
            <CardContent>
            <div className="space-y-4">
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
                <form onSubmit={props.handleSubmit} className="mt-6 space-y-6">
                  {props.values?.certifications &&
                      props.values.certifications.length > 0 &&
                      props.values.certifications.map
                      (
                        (certification, index) =>
                        (
                          <React.Fragment key={index}>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                        <h5 className="text-base">
                                      Certification {index + 1}
                                      </h5>
                                  </div>
                                  <div className="flex justify-end space-y-2">
                                        <CircleX
                                          className="justify-end text-red-600 cursor-pointer "
                                          onClick={() =>
                                            handleDelete(certification.id, index, props)}
                                    />
                                  </div>
                                  <div className="col-span-2 space-y-2">
                                    <TextInput
                                      name={`certifications[${index}].certification_name`}
                                      value={certification.certification_name}
                                      label={"Certification Name"}
                                      onChange={(field, value) => {
                                        props.setFieldValue(field, value);
                                      }}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                  <DateInput
                                  name={`certifications[${index}].completion_date`}
                                  value={certification.completion_date}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                  label={"Completion Date"}
                                />
                                  </div>
                                  <div className="space-y-2">
                                  <DateInput
                                  name={`certifications[${index}].expiry_date`}
                                  value={certification.expiry_date}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                  label={"Expiry Date"}
                                />
                                  </div>
                                  <div className="col-span-2 space-y-2">
                                    <TextInput
                                      name={`certifications[${index}].certification_institute`}
                                      value={certification.certification_institute}
                                      onChange={(field, value) => {
                                        props.setFieldValue(field, value);
                                      }}
                                      label={"Certification Institute"}
                                    />
                                  </div>
                                  <div className="col-span-2 space-y-2 ">
                                    <CoverFileUpload
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
                            </div>
                          </React.Fragment>
                        )
                      )
                  }
                      <div className="grid grid-cols-1 gap-4">
                        <div className="mb-4 space-y-2 ">
                          <Button>
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
                              + Add Another Certification

                            </Link>
                          </Button>
                        </div>
                      </div>
                      <div className="col-span-2 p-6 border-t border-gray-200 bg-gray-50">
                          <div className="flex justify-end space-x-4">
                            {!isEditMode &&
                              <Button variant="outline" size="lg" onClick={() => {
                                prevStep()
                              }}
                              >Back</Button>
                            }
                            <Button
                              type="submit"
                              size="lg"
                              variant="default"
                              onClick={() => {
                                props.handleSubmit();
                              }}
                            >
                              {isEditMode ? 'Save' : 'Next'}
                            </Button>
                          </div>
                      </div>
                </form>
              )}
            </Formik>
            </div>
            </CardContent>
            </Card>
          </>
        )
      }
    </>
      )
}
const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
    token: state.user.token,
    baseUrl: state.user.baseUrl,
  };
};

export default connect(mapStateToProps)(CertificationsInformation);
