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
import { DateInput, TextInput, CoverFileUpload } from "components/FormControl";
import { Link } from "react-router-dom";
import ProfileFormFooter from "app/modules/Employees/Screens/Sections/ProfileFormFooter";
import { Button } from "../../../../../components/ui/button";
import { CircleX } from "lucide-react";
import { Card, CardContent, CardFooter } from "components/ui/card";
import AlertDialogue from "components/ui/AlertDialogue";

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
  const [openAlertDialogue, setOpenAlertDialogue] = useState(false);
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
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
      await deleteEmployeeCertificateData(employeeId, [certificationId]);
      const newCertifications = [...props.values.certifications];
      newCertifications.splice(index, 1);
      props.setFieldValue("certifications", newCertifications);
    } catch (error) {
      console.error("Error deleting certification:", error);
    }
  };

  return (
    <>
      {isLoading ? (
        <div>
          <div className="space-y-4">
            <PageLoader />
          </div>
        </div>
      ) : (
        <>
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
                  <Card>
                    <CardContent>
                      {" "}
                      {props.values?.certifications &&
                        props.values.certifications.length > 0 &&
                        props.values.certifications.map(
                          (certification, index) => (
                            <React.Fragment key={index}>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 my-4">
                                  <div className="space-y-2">
                                    <h5 className="text-base">
                                      Certification {index + 1}
                                    </h5>
                                  </div>
                                  <div className="flex justify-end space-y-2">
                                    <CircleX
                                      className="justify-end text-red-600 cursor-pointer "
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setOpenAlertDialogue(true);
                                      }}
                                    />
                                  </div>

                                  <div className="col-span-2 space-y-2">
                                    <TextInput
                                      name={`certifications[${index}].certification_name`}
                                      value={certification.certification_name}
                                      label={"Certification Name"}
                                      onChange={(field, value) => {
                                        setIsEdited(true);
                                        props.setFieldValue(field, value);
                                      }}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <DateInput
                                      name={`certifications[${index}].completion_date`}
                                      value={certification.completion_date}
                                      onChange={(field, value) => {
                                        setIsEdited(true);
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
                                        setIsEdited(true);
                                        props.setFieldValue(field, value);
                                      }}
                                      label={"Expiry Date"}
                                    />
                                  </div>
                                  <div className="col-span-2 space-y-2">
                                    <TextInput
                                      name={`certifications[${index}].certification_institute`}
                                      value={
                                        certification.certification_institute
                                      }
                                      onChange={(field, value) => {
                                        setIsEdited(true);
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
                                        setIsEdited(true);
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
                                {openAlertDialogue && (
                                  <AlertDialogue
                                    isOpen={openAlertDialogue}
                                    setIsOpen={setOpenAlertDialogue}
                                    handleContinue={() => {
                                      handleDelete(
                                        certification.id,
                                        index,
                                        props
                                      );
                                    }}
                                    continueText="Delete"
                                    title="Are you Sure?"
                                    description={`Are you sure you want to delete your certification/licences details? This action is irreversible and will delete all information related ${certification.certification_name}.`}
                                  />
                                )}
                              </div>
                            </React.Fragment>
                          )
                        )}
                      <div className="grid grid-cols-1 gap-4">
                        <div className="my-4 space-y-2 ">
                          <Button>
                            <Link
                              type="button"
                              className="btn btn-outline-dark"
                              onClick={() => {
                                const length =
                                  props.values?.certifications?.length;
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
                    </CardContent>
                    <CardFooter>
                      <ProfileFormFooter
                        nextstep={nextstep}
                        handleSubmit={() => {
                          props.handleSubmit();
                        }}
                        prevStep={prevStep}
                        isEditMode={isEditMode}
                        isEdited={isEdited}
                        enableBackButton={true}
                      />
                    </CardFooter>
                  </Card>
                </form>
              )}
            </Formik>
          </div>
        </>
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
