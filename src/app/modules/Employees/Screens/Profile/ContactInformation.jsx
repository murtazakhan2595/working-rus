import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import { connect } from "react-redux";
import {
  getEmployeeData,
  saveEmployeeContactInfoData,
} from "../../../../../app/hooks/employee";

import {
  TextInput,
  PhoneNumberInput,
  TextAreaInput,
} from "../../../../../components/FormControl/index.jsx";
import { PageLoader } from "components";
import { getContactInfo } from "app/utils/MappingObjects/mapEmployeeData";
import { validationEmployeeContactInfoFormSchema } from "../../../../../app/utils/FormSchema/employeeFormSchema";
import { Button } from "../../../../../components/ui/button";
import { countriesCallingCodes } from "data/Data";
import { Card, CardContent, CardFooter } from "components/ui/card";
import ProfileFormFooter from "app/modules/Employees/Screens/Sections/ProfileFormFooter";

const ContactInformation = ({ nextstep, employeeId, isEditMode, prevStep }) => {
  const formRef = React.createRef();
  const [contactInfo, setContactInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isEdited, setIsEdited] = useState(false);

  const fetchData = async (isMounted) => {
    try {
      setIsLoading(true);
      if (isMounted) {
        const response = await getEmployeeData(employeeId);
        const employeeData = await getContactInfo(response);
        setContactInfo(employeeData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      if (isMounted) setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (employeeId) fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [employeeId]);

  const handleSubmit = (data) => {
    const ContactInformation = getContactInfo(data);
    const response = saveEmployeeContactInfoData(
      employeeId,
      ContactInformation
    );
    if (response) nextstep();
  };

  console.log(contactInfo);
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
            initialValues={contactInfo}
            ref={formRef}
            onSubmit={(values, { resetForm }) => {
              handleSubmit(values, resetForm);
            }}
            validate={(values) => {
              const errors = validationEmployeeContactInfoFormSchema(values);
              return errors;
            }}
          >
            {(props) => (
              <form onSubmit={props.handleSubmit} className="mt-6 space-y-6">
                <Card className="p-6">
                  <CardContent>
                    {/* <h6 className="text-2xl text-secondary-foreground">
                      Emergency Contact
                    </h6> */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <PhoneNumberInput
                            name={"emergency_phone_no"}
                            error={props.errors.emergency_phone_no}
                            touch={props.touched.emergency_phone_no}
                            value={props.values.emergency_phone_no}
                            label="Emergency Contact"
                            countryCode={props.values.emergency_country_code}
                            countryCodeName={"emergency_country_code"}
                            required={true}
                            onChange={(field, value) => {
                              setIsEdited(true);
                              props.setFieldValue(field, value);
                            }}
                            countryOptions={countriesCallingCodes} // Pass the country options here
                          />
                        </div>
                        <div className="space-y-2">
                          <TextInput
                            name="emergency_first_name"
                            error={props.errors.emergency_first_name}
                            touch={props.touched.emergency_first_name}
                            value={props.values.emergency_first_name}
                            label="Full Name"
                            required
                            onChange={(field, value) => {
                              setIsEdited(true);
                              props.handleChange(field)(value);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <TextInput
                            name="emergency_relation"
                            error={props.errors.emergency_relation}
                            touch={props.touched.emergency_relation}
                            value={props.values.emergency_relation}
                            label="Relation"
                            required
                            onChange={(field, value) => {
                              setIsEdited(true);
                              props.handleChange(field)(value);
                            }}
                          />
                        </div>

                        <div className="col-span-2 space-y-2">
                          <TextAreaInput
                            name="emergency_permanent_address"
                            error={props.errors.emergency_permanent_address}
                            touch={props.touched.emergency_permanent_address}
                            value={props.values.emergency_permanent_address}
                            label="Permanent Address"
                            onChange={(field, value) => {
                              setIsEdited(true);
                              props.handleChange(field)(value);
                            }}
                          />
                        </div>
                        <div className="col-span-2 space-y-2">
                          <TextAreaInput
                            name="emergency_current_address"
                            error={props.errors.emergency_current_address}
                            touch={props.touched.emergency_current_address}
                            value={props.values.emergency_current_address}
                            label="Current Address"
                            onChange={(field, value) => {
                              setIsEdited(true);
                              props.handleChange(field)(value);
                            }}
                          />
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
    token: state.user.token,
    baseUrl: state.user.baseUrl,
  };
};

export default connect(mapStateToProps)(ContactInformation);
