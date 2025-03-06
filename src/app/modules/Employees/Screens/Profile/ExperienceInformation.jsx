import React, { useState, useEffect } from "react";

import { Formik } from "formik";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  getEmployeeProfessionalExperianceData,
  saveEmployeeProfessionalExperianceData,
  deleteEmployeeProfessionalExperianceData, // Import the delete function
} from "app/hooks/employee.jsx";
import PageLoader from "components/PageLoader.jsx";
import Experience from "../Sections/ExperianceForm.jsx";
import { validationEmployeeExperienceFormSchema } from "app/utils/FormSchema/employeeFormSchema.jsx";
import { CircleX, X } from "lucide-react";
import { Button } from "../../../../../components/ui/button.jsx";
import { Card, CardContent, CardFooter } from "components/ui/card.jsx";
import ProfileFormFooter from "app/modules/Employees/Screens/Sections/ProfileFormFooter";

const ExperienceInformation = ({
  nextstep,
  employeeId,
  isEditMode,
  prevStep,
  baseUrl,
  token,
}) => {
  const formRef = React.createRef();
  const [experiences, setExperiences] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isEdited, setIsEdited] = useState(false);

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
    const response = await saveEmployeeProfessionalExperianceData(
      employeeId,
      data.experiences
    );
    if (response) nextstep();
  };

  const handleDelete = async (experienceId, index, props) => {
    try {
      if (experienceId) {
        await deleteEmployeeProfessionalExperianceData(
          baseUrl,
          employeeId,
          token,
          [experienceId]
        );
      }
      const newExperiences = [...props.values.experiences];
      newExperiences.splice(index, 1);
      props.setFieldValue("experiences", newExperiences);
    } catch (error) {
      console.error("Error deleting experience:", error);
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
        <div className="space-y-4">
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
              <form onSubmit={props.handleSubmit} className="mt-6 space-y-6">
                <Card className="p-6">
                  <CardContent>
                    <div>
                      {props.values?.experiences &&
                        props.values.experiences.length > 0 &&
                        props.values.experiences.map((experience, index) => (
                          <React.Fragment key={index} >
                            <div className="space-y-4 my-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <h5 className="text-base mb-2">
                                    {index === 0
                                      ? `Current Experience`
                                      : `Add Experience ${index + 1}`}
                                  </h5>
                                </div>
                                <div className="flex justify-end space-y-2">
                                  {index !== 0 && (
                                    <CircleX
                                      className="justify-end text-red-600 cursor-pointer "
                                      onClick={() =>
                                        handleDelete(
                                          experience.id,
                                          index,
                                          props
                                        )
                                      }
                                    />
                                  )}
                                </div>
                              </div>
                            </div>

                            <Experience
                              values={experience}
                              errors={
                                props.errors?.experiences
                                  ? props.errors?.experiences[index]
                                  : {}
                              }
                              isCurrentExperience={index === 0}
                              touched={
                                props.touched?.experiences
                                  ? props.touched?.experiences[index]
                                  : {}
                              }
                              onChange={(field, value) => {
                                experience[field] = value;
                                if (field === "disableEndDate" && value) {
                                  experience.exp_end_date = null;
                                }
                                props.setFieldValue(
                                  `experiences[${index}]`,
                                  experience
                                );
                                setIsEdited(true);
                              }}
                            />
                          </React.Fragment>
                        ))}
                      <div className="grid grid-cols-1 gap-4">
                        <div className="my-4 space-y-2">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              const length = props.values?.experiences?.length;
                              const index = length ? length : 0;
                              props.setFieldValue(`experiences[${index}]`, {
                                employee_id: null,
                                exp_organization: null,
                                exp_designation: null,
                                exp_discription: null,
                                exp_letter: null,
                                exp_start_date: null,
                                exp_end_date: null,
                                disableEndDate: false,
                              });
                            }}
                          >
                            + Add Another Experience
                          </Button>
                        </div>
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
