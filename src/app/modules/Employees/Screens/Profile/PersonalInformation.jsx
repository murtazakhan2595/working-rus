import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  DateInput,
  EmailInput,
  ImageInput,
  PhoneNumberInput,
  SelectComponent,
  TextInput,
} from "../../../../../components/form-control";
import PageLoader from "../../../../../components/PageLoader.jsx";
import {
  countriesCallingCodes,
  countriesList,
  maritalStatus,
} from "../../../../../data/Data.js";
import {
  getEmployeePersonalInfoData,
  saveEmployeePersonalInfoData,
} from "../../../../hooks/employee";
import {
  validateEmployeePersonalInfoForm,
  validationPersonalInfoFormSchema,
} from "../../../../utils/FormSchema/employeeFormSchema";
import { getPersonalInfo } from "../../../../utils/MappingObjects/mapEmployeeData.jsx";
import { Label } from "../../../../../src/@/components/ui/label";
import { Input } from "../../../../../components/ui/input";
import { Button } from "../../../../../components/ui/button";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../../../../../src/@/components/ui/calendar";
import { Card, CardContent, CardFooter } from "components/ui/card";


// Get country options for Select component but do not showing country calling code

// const countryOptions = Object.keys(countries).map((countryCode) => ({
//   value: countryCode,
//   label: countries[countryCode].name,
// }));

const PersonalInfo = ({ nextstep, baseUrl, token, employeeId, isEditMode }) => {
  const formRef = React.createRef();
  const [personalInfo, setPersonalInfo] = useState({});
  const [imageError, setImageError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState(new Date());
  const [selectedMaritalStatus, setSelectedMaritalStatus] = React.useState("");
  const [selectedCountry, setSelectedCountry] = React.useState("");

  useEffect(() => {
    getEmployeePersonalInfoData(employeeId)
      .then((response) => {
        setPersonalInfo(response);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [baseUrl, employeeId, token]);

  const handleSubmit = (data) => {
    const personalInformation = getPersonalInfo(data);

    const response = saveEmployeePersonalInfoData(
      employeeId,
      personalInformation
    );
    if (response) nextstep();
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
        <div>
          <div className="space-y-4">
            <Formik
              initialValues={personalInfo}
              ref={formRef}
              onSubmit={(values, { resetForm }) => {
                handleSubmit(values, resetForm);
              }}
              validate={(values) => {
                const errors = { ...validateEmployeePersonalInfoForm(values) };
                if (imageError) {
                  errors.profile_picture = imageError;
                }
                return errors;
              }}
            >
              {(props) => (
                <form onSubmit={props.handleSubmit} className="mt-6 space-y-6">
                  <div className="space-y-4">
                    <Card className="p-6">
                      <CardContent>
                        <div className="space-y-2">
                          <ImageInput
                        name={"profile_picture"}
                        error={props.errors.profile_picture}
                        touch={props.touched.profile_picture}
                        value={props.values.profile_picture}
                        label={"Your Photo"}
                        required={true}
                        onChange={(field, value) => {
                          props.setFieldValue(field, value);
                          setImageError(null);
                        }}
                        setImageError={setImageError}
                      />
                    </div>
                      </CardContent>
                    </Card>
                    <Card className="p-6">
                      <CardContent>
                    {employeeId && (
                      <div className="space-y-2">
                        <h6 className="text-base">
                          {props.values.first_name} {props.values.last_name}
                        </h6>
                        <span className="opacity-65 fs-12">
                          ID: {`TXB-${employeeId.toString().padStart(4, "0")}`}
                        </span>
                      </div>
                    )}
                    
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                        <TextInput
                          name={"first_name"}
                          error={props.errors.first_name}
                          touch={props.touched.first_name}
                          value={props.values.first_name}
                          label={"First Name"}
                          required={true}
                          onChange={(field, value) => {
                            props.handleChange(field)(value);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <PhoneNumberInput
                          name={"mobile_no"}
                          error={props.errors.mobile_no}
                          touch={props.touched?.mobile_no}
                          value={props.values?.mobile_no}
                          required={true}
                          label={"Contact no."}
                          countryCode={props.values?.country_code}
                          countryCodeName={"country_code"}
                          onChange={(field, value) => {
                            props.setFieldValue(field, value);
                          }}
                          countryOptions={countriesCallingCodes} // Pass the country options here
                        />
                      </div>
                      <div className="space-y-2">
                        <TextInput
                          name={"last_name"}
                          error={props.errors.last_name}
                          touch={props.touched.last_name}
                          value={props.values.last_name}
                          label={"Last Name"}
                          required={true}
                          onChange={(field, value) => {
                            props.handleChange(field)(value);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <EmailInput
                          name={"other_email"}
                          error={props.errors.other_email}
                          touch={props.touched.other_email}
                          value={props.values.other_email}
                          label={"Email"}
                          required={true}
                          onChange={(field, value) => {
                            props.handleChange(field)(value);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <TextInput
                          name={"nic"}
                          error={props.errors.nic}
                          touch={props.touched.nic}
                          value={props.values.nic}
                          label={"ID Card no"}
                          required={true}
                          onChange={(field, value) => {
                            props.handleChange(field)(value);
                          }}
                          regEx={/^[0-9]+$/}
                        />
                      </div>
                      <div className="space-y-2">
                        <TextInput
                          name={"father_name"}
                          error={props.errors.father_name}
                          touch={props.touched.father_name}
                          value={props.values.father_name}
                          label={"Father Name"}
                          required={true}
                          onChange={(field, value) => {
                            props.handleChange(field)(value);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <TextInput
                          name={"mother_name"}
                          error={props.errors.mother_name}
                          touch={props.touched.mother_name}
                          value={props.values.mother_name}
                          label={"Mother Name"}
                          required={true}
                          onChange={(field, value) => {
                            props.handleChange(field)(value);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <SelectComponent
                          name={"nationality"}
                          options={countriesList}
                          error={props.errors.nationality}
                          touch={props.touched.nationality}
                          value={props.values.nationality}
                          required={true}
                          label={"Nationality"}
                          onChange={(field, value) => {
                            props.setFieldValue(field, value);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <DateInput
                          name={"date_of_birth"}
                          error={props.errors.date_of_birth}
                          touch={props.touched.date_of_birth}
                          value={props.values.date_of_birth}
                          label={"Date of Birth"}
                          onChange={(field, value) => {
                            props.setFieldValue(field, value);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <SelectComponent
                          name={"marital_status"}
                          options={maritalStatus}
                          error={props.errors.marital_status}
                          touch={props.touched.marital_status}
                          value={props.values.marital_status}
                          label={"Martial Status"}
                          onChange={(field, value) => {
                            props.setFieldValue(field, value);
                          }}
                        />
                      </div>
                        </div>
                        
                      </CardContent>
                      <CardFooter>
                      <div className="col-span-2 p-6 border-t border-gray-200 bg-gray-50 w-full">
                    <div className="flex justify-end space-x-4">
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
                      </CardFooter>
                    </Card>
                  </div>
                 
                  <div></div>
                </form>
              )}
            </Formik>
          </div>
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

export default connect(mapStateToProps)(PersonalInfo);
// export default PersonalInfo;
