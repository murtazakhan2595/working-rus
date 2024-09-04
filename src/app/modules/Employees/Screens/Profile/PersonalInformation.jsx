import { getAllCountries } from "countries-and-timezones";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Form } from "reactstrap";
import {
  CustomDarkButton,
  EmailInput,
  ImageInput,
  PhoneNumberInput,
  SelectComponent,
  TextInput,
} from "../../../../../components/form-control";
import PageLoader from "../../../../../components/PageLoader.jsx";
import { maritalStatus } from "../../../../../data/Data.js";
import {
  getEmployeePersonalInfoData,
  saveEmployeePersonalInfoData,
} from "../../../../hooks/employee";
import { validationPersonalInfoFormSchema } from "../../../../utils/FormSchema/employeeFormSchema";
import { getPersonalInfo } from "../../../../utils/MappingObjects/mapEmployeeData.jsx";
import { Label } from "../../../../../src/@/components/ui/label";
import { Input } from "../../../../../components/ui/input";
import { Button } from "../../../../../components/ui/button";
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react";
import { Calendar } from '../../../../../src/@/components/ui/calendar';



// Get country options for Select component
const countryOptions = Object.keys(getAllCountries()).map((countryCode) => ({
  value: countryCode,
  label: getAllCountries()[countryCode].name,
}));

const PersonalInfo = ({ nextstep, baseUrl, token, employeeId, isEditMode }) => {
  const formRef = React.createRef();
  const [personalInfo, setPersonalInfo] = useState({});
  const [imageError, setImageError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState(new Date());
  

  useEffect(() => {
    getEmployeePersonalInfoData(employeeId)
      .then((response) => {
        setPersonalInfo(response);
        setIsLoading(false);
        console.log("I am then");
      })
      .catch((error) => {
        console.log(error);
        console.log("I am catch");
      });
  }, [baseUrl, employeeId, token]);

  const handleSubmit = (data) => {
    const personalInfrmation = getPersonalInfo(data);

    const response = saveEmployeePersonalInfoData(
      employeeId,
      personalInfrmation
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
                const errors = {};
                // for (let field in values) {
                //     if (!values[`${field}`]) {
                //         errors[`${field}`] = 'This field is required';
                //     }
                // }
                if (imageError) {
                  errors.profile_picture = imageError;
                }
                // console.log(values, errors)

                return errors;
              }}
            >
              {(props) => (
                <form onSubmit={props.handleSubmit} className="mt-6 space-y-6">
                  <div className="space-y-4">
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
                    {employeeId && (
                      <div className="space-y-2">
                        <h6 className="">
                          {props.values.first_name} {props.values.last_name}
                        </h6>
                        <span className="opacity-65 fs-12">
                          ID: {`TXB-${employeeId.toString().padStart(4, "0")}`}
                        </span>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
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
                        touch={props.touched.mobile_no}
                        value={props.values.mobile_no}
                        label={"Contact no."}
                        countryCode={props.values.country_code}
                        countryCodeName={"country_code"}
                        required={true}
                        onChange={(field, value) => {
                          props.setFieldValue(field, value);
                        }}
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
                        options={countryOptions}
                        error={props.errors.nationality}
                        touch={props.touched.nationality}
                        value={props.values.nationality}
                        label={"Nationality"}
                        onChange={(field, value) => {
                          props.setFieldValue(field, value);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="joiningDate">Joining Date</Label>
                      <div className="flex">
                        <Input
                          id="joiningDate"
                          type="text"
                          placeholder="Select date"
                          value={date ? format(date, "PPP") : ""}
                          readOnly
                          className="w-[calc(100%-40px)]"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="w-[40px] px-0"
                          onClick={() => setDate(new Date())}
                        >
                          <CalendarIcon className="w-4 h-4" />
                        </Button>
                      </div>
                      {date && (
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          className="border rounded-md"
                        />
                      )}
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
                  <div className="col-span-2 p-6 border-t border-gray-200 bg-gray-50">
                      <div className="flex justify-end space-x-4">
                       
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
                  <div>
                  
                    
                  </div>
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
