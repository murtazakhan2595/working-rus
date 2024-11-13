import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import { connect } from "react-redux";
import {
  getEmployeeContactInfo,
  saveEmployeeContactInfoData,
} from "../../../../../app/hooks/employee";

import {
  TextInput,
  PhoneNumberInput,
  TextAreaInput,
} from "../../../../../components/form-control.jsx";
import { PageLoader } from "components";
import { getContactInfo } from "../../../../../app/utils/MappingObjects/mapEmployeeData.jsx";
import { validationEmployeeContactInfoFormSchema } from "../../../../../app/utils/FormSchema/employeeFormSchema";
import { Button } from "../../../../../components/ui/button";
import countries from "country-data";
import { countriesCallingCodes } from "data/Data";
import { Card, CardContent } from "components/ui/card";

const ContactInformation = ({ nextstep, employeeId, isEditMode, prevStep }) => {
  const formRef = React.createRef();
  const [contactInfo, setContactInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // const countryOptions = countries.all
  // .filter((country) => country.countryCallingCodes && country.countryCallingCodes.length > 0)
  // .map((country) => ({
  //   value: country.countryCallingCodes[0].replace("+", ""), // Remove any existing plus signs
  //   label: `${country.name} (+${country.countryCallingCodes[0].replace("+", "")})`,
  // }));

  useEffect(() => {
    getEmployeeContactInfo(employeeId)
      .then((response) => {
        setContactInfo(response);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [employeeId]); // Empty dependency array ensures this effect runs only once after the initial render

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
                    <h6 className="text-2xl text-secondary-foreground">
                      Emergency Contact
                    </h6>
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
                              props.handleChange(field)(value);
                            }}
                          />
                        </div>

                        <div className="space-y-2">
                          <TextAreaInput
                            name="emergency_permanent_address"
                            error={props.errors.emergency_permanent_address}
                            touch={props.touched.emergency_permanent_address}
                            value={props.values.emergency_permanent_address}
                            label="Permanent Address"
                            required
                            onChange={(field, value) => {
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
                            required
                            onChange={(field, value) => {
                              props.handleChange(field)(value);
                            }}
                          />
                        </div>
                        <div className="col-span-2 p-6 border-t border-gray-200 bg-gray-50">
                          <div className="flex justify-end space-x-4">
                            {!isEditMode && (
                              <Button
                                variant="outline"
                                size="lg"
                                onClick={() => {
                                  prevStep();
                                }}
                              >
                                Back
                              </Button>
                            )}
                            <Button
                              type="submit"
                              size="lg"
                              variant="default"
                              onClick={() => {
                                props.handleSubmit();
                              }}
                            >
                              {isEditMode ? "Save" : "Next"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
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
