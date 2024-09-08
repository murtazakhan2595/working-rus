import React, { useState, useEffect } from "react";

import { Formik } from "formik";
import { connect } from "react-redux";
import {
  getEmployeeAcademicRecordData,
  saveEmployeeAcademicRecordData,
  deleteEmployeeAcademicRecordData, // Import the delete function
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

import { Label } from "../../../../../src/@/components/ui/label";
import { Input } from "../../../../../components/ui/input";
import { Button } from "../../../../../components/ui/button";
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react";
import { Calendar } from '../../../../../src/@/components/ui/calendar';
import { CircleX, X } from "lucide-react";
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
  const [date, setDate] = useState(new Date());
  const [selectedValue, setSelectedValue] = useState('');

  useEffect(() => {
    getEmployeeAcademicRecordData(employeeId)
      .then((response) => {
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

  const handleDelete = async (educationId, index, props) => {
    try {
      await deleteEmployeeAcademicRecordData(baseUrl, employeeId, token, [
        educationId,
      ]);
      const newEducations = [...props.values.educations];
      newEducations.splice(index, 1);
      props.setFieldValue("educations", newEducations);
    } catch (error) {
      console.error("Error deleting education:", error);
    }
  };
  const handleChange = (name, value) => {
    console.log(`Selected ${name}: ${value}`)
    setSelectedValue(value)
  }
  return (
    <div>
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
            <div className="space-y-4">
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
                {(props) =>
                  (
                  <form onSubmit={props.handleSubmit} className="mt-6 space-y-6">
                    {props.values?.educations &&
                      props.values.educations.length > 0 &&
                      props.values.educations.map
                      ((education, index) =>
                        (
                        <React.Fragment key={index}>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <h5 className="text-base">
                                      Education {index + 1}
                                    </h5>
                                </div>
                                <div className="flex justify-end space-y-2">
                                    <CircleX
                                      className="justify-end text-red-600 cursor-pointer "
                                      onClick={() =>
                                        handleDelete(education.id, index, props)
                                      }
                                    />
                                </div>
                              <div className="col-span-2 space-y-2">
                                <SelectComponent
                                  options={educationTypeOptions}
                                  name={`educations[${index}].education_level`}
                                  value={selectedValue}
                                  setValue={setSelectedValue}

                                  onChange={handleChange}

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
                              <div className="space-y-2">
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
                              <div className="space-y-2">
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
                              <div className="space-y-2">
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
                              <div className="space-y-2">
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
                              <div className="col-span-2 space-y-2">
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
                          </div>
                        </React.Fragment>
                        )
                      )
                    }
                    <div className="grid grid-cols-1 gap-4">
                      <div className="mb-4 space-y-2 ">
                        <Button>
                          <Link
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
                  )
                }
              </Formik>
              </div>
          </>
        )
      }
    </div>
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
