import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  DateInput,
  EmailInput,
  ImageInput,
  PhoneNumberInput,
  SelectInputComponent,
  TextInput,
} from "components/FormControl";
import { PageLoader } from "components";
import {
  countriesCallingCodes,
  countriesList,
  maritalStatus,
  GenderOptions,
  BloodGroupOptions,
} from "data/Data.js";
import {
  getEmployeeData,
  saveEmployeePersonalInfoData,
} from "app/hooks/employee";
import { validateEmployeePersonalInfoForm } from "app/utils/FormSchema/employeeFormSchema";
import {
  mapEmployeePersonalInformationPayloadData,
  getPersonalInfo,
} from "app/utils/MappingObjects/mapEmployeeData";
import { Card, CardContent, CardFooter } from "components/ui/card";
import ProfileFormFooter from "app/modules/Employees/Screens/Sections/ProfileFormFooter";
import { DisbursementTypeOptions } from "data/Data";
// Get country options for Select component but do not showing country calling code

// const countryOptions = Object.keys(countries).map((countryCode) => ({
//   value: countryCode,
//   label: countries[countryCode].name,
// }));

const PersonalInfo = ({ nextstep, employeeId, isEditMode }) => {
  const formRef = React.createRef();
  const [personalInfo, setPersonalInfo] = useState({});
  const [isEdited, setIsEdited] = useState(false);
  const [imageError, setImageError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  console.log(isEdited, "isEditMode");

  const fetchData = async (isMounted) => {
    try {
      setIsLoading(true);
      if (isMounted) {
        const response = await getEmployeeData(employeeId);
        const employeeData = await getPersonalInfo(response);
        setPersonalInfo(employeeData);
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

  const handleSubmit = async (data) => {
    console.log("handle submit is called");
    // Prepare personal information from data
    const payload = mapEmployeePersonalInformationPayloadData(data);
    try {
      // Call the API with FormData
      const response = await saveEmployeePersonalInfoData(employeeId, payload);
      if (response) {
        // Proceed to the next step
        nextstep();
      } else {
        console.error("Failed to save data:", await response.json());
      }
    } catch (error) {
      console.error("Error during data submission:", error);
    }
  };
  console.log("personalInfo", personalInfo);
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
                <form
                  onSubmit={props.handleSubmit}
                  className="mt-6 space-y-6"
                  onKeyDown={(e) => {
                    // Prevent form submission on Enter key press
                    if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
                      e.preventDefault();
                    }
                  }}
                >
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
                            onChange={(field, value, error) => {
                              setIsEdited(true);
                              props.setFieldValue(field, value);
                              setImageError(error);
                            }}
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
                              ID: {props.values.serial_number}
                            </span>
                          </div>
                        )}
                        <div className="grid grid-cols-3 gap-4">
                          {/* First row */}
                          <div className="space-y-2">
                            <TextInput
                              name={"first_name"}
                              error={props.errors.first_name}
                              touch={props.touched.first_name}
                              value={props.values.first_name}
                              label={"First Name"}
                              required={true}
                              onChange={(field, value) => {
                                setIsEdited(true);
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
                                setIsEdited(true);
                                props.setFieldValue(field, value);
                              }}
                              countryOptions={countriesCallingCodes}
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
                                setIsEdited(true);
                                props.handleChange(field)(value);
                              }}
                            />
                          </div>

                          {/* Second row */}
                          <div className="space-y-2">
                            <EmailInput
                              name={"other_email"}
                              error={props.errors.other_email}
                              touch={props.touched.other_email}
                              value={props.values.other_email}
                              label={"Personal/Other Email"}
                              required={true}
                              onChange={(field, value) => {
                                setIsEdited(true);
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
                                setIsEdited(true);
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
                                setIsEdited(true);
                                props.handleChange(field)(value);
                              }}
                            />
                          </div>

                          {/* Third row */}
                          <div className="space-y-2">
                            <TextInput
                              name={"mother_name"}
                              error={props.errors.mother_name}
                              touch={props.touched.mother_name}
                              value={props.values.mother_name}
                              label={"Mother Name"}
                              required={true}
                              onChange={(field, value) => {
                                setIsEdited(true);
                                props.handleChange(field)(value);
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <SelectInputComponent
                              name={"nationality"}
                              options={countriesList}
                              error={props.errors.nationality}
                              touch={props.touched.nationality}
                              value={props.values.nationality}
                              required={true}
                              label={"Nationality"}
                              onChange={(field, value) => {
                                setIsEdited(true);
                                props.setFieldValue(field, value);
                              }}
                            />
                          </div>
                          {/* UAE-specific field */}
                          <div className="space-y-2">
                            {props.values.nationality ===
                            "United Arab Emirates" ? (
                              <TextInput
                                name={"family_book_number"}
                                error={props.errors?.family_book_number}
                                touch={props.touched?.family_book_number}
                                value={props.values?.family_book_number}
                                label={"Family Book Number"}
                                required={true}
                                onChange={(field, value) => {
                                  props.handleChange(field)(value);
                                }}
                              />
                            ) : (
                              <div className="invisible"></div> /* Invisible placeholder */
                            )}
                          </div>

                          {/* Fourth row */}
                          {/* For UAE, show disbursement type */}
                          <div className="space-y-2">
                            {props.values.nationality ===
                            "United Arab Emirates" ? (
                              <SelectInputComponent
                                name={"disbursement_type"}
                                options={DisbursementTypeOptions}
                                error={props.errors?.disbursement_type}
                                touch={props.touched.disbursement_type}
                                value={props.values.disbursement_type}
                                label={"Disbursement Type"}
                                required={true}
                                onChange={(field, value) => {
                                  props.setFieldValue(field, value);
                                }}
                              />
                            ) : (
                              <DateInput
                                name={"date_of_birth"}
                                error={props.errors.date_of_birth}
                                touch={props.touched.date_of_birth}
                                value={props.values.date_of_birth}
                                label={"Date of Birth"}
                                onChange={(field, value) => {
                                  setIsEdited(true);
                                  props.setFieldValue(field, value);
                                }}
                              />
                            )}
                          </div>

                          {/* For UAE with Bank Transfer, show AGENT_BANK_RTN_CODE */}
                          <div className="space-y-2">
                            {props.values.nationality ===
                              "United Arab Emirates" &&
                            props.values.disbursement_type ===
                              "Bank Transfer" ? (
                              <TextInput
                                name={"agent_bank_rtn_code"}
                                error={props.errors?.agent_bank_rtn_code}
                                touch={props.touched?.agent_bank_rtn_code}
                                value={props.values?.agent_bank_rtn_code}
                                label={"AGENT_BANK_RTN_CODE"}
                                required={false}
                                onChange={(field, value) => {
                                  props.handleChange(field)(value);
                                }}
                              />
                            ) : props.values.nationality ===
                              "United Arab Emirates" ? (
                              <div className="invisible"></div> /* Invisible placeholder */
                            ) : (
                              <SelectInputComponent
                                name={"marital_status"}
                                options={maritalStatus}
                                error={props.errors.marital_status}
                                touch={props.touched.marital_status}
                                value={props.values.marital_status}
                                label={"Marital Status"}
                                onChange={(field, value) => {
                                  setIsEdited(true);
                                  props.setFieldValue(field, value);
                                }}
                              />
                            )}
                          </div>

                          {/* For UAE with Bank Transfer, show MOL_Person_ID */}
                          <div className="space-y-2">
                            {props.values.nationality ===
                              "United Arab Emirates" &&
                            props.values.disbursement_type ===
                              "Bank Transfer" ? (
                              <TextInput
                                name={"mol_person_id"}
                                error={props.errors?.mol_person_id}
                                touch={props.touched?.mol_person_id}
                                value={props.values?.mol_person_id}
                                label={"MOL Person ID"}
                                required={false}
                                onChange={(field, value) => {
                                  props.handleChange(field)(value);
                                }}
                              />
                            ) : props.values.nationality ===
                              "United Arab Emirates" ? (
                              <div className="invisible"></div> /* Invisible placeholder */
                            ) : (
                              <SelectInputComponent
                                name={"blood_group"}
                                options={BloodGroupOptions}
                                error={props.errors?.blood_group}
                                touch={props.touched.blood_group}
                                value={props.values.blood_group}
                                required={true}
                                label={"Blood Group"}
                                onChange={(field, value) => {
                                  setIsEdited(true);
                                  props.setFieldValue(field, value);
                                }}
                              />
                            )}
                          </div>

                          {/* UAE Date of Birth, moved down for UAE case */}
                          <div className="space-y-2">
                            {props.values.nationality ===
                            "United Arab Emirates" ? (
                              <DateInput
                                name={"date_of_birth"}
                                error={props.errors.date_of_birth}
                                touch={props.touched.date_of_birth}
                                value={props.values.date_of_birth}
                                label={"Date of Birth"}
                                onChange={(field, value) => {
                                  setIsEdited(true);
                                  props.setFieldValue(field, value);
                                }}
                              />
                            ) : (
                              <SelectInputComponent
                                name={"gender"}
                                options={GenderOptions}
                                error={props.errors?.gender}
                                touch={props.touched.gender}
                                value={props.values.gender}
                                required={true}
                                label={"Gender"}
                                onChange={(field, value) => {
                                  setIsEdited(true);
                                  props.setFieldValue(field, value);
                                }}
                              />
                            )}
                          </div>

                          {/* UAE Marital Status */}
                          <div className="space-y-2">
                            {props.values.nationality ===
                            "United Arab Emirates" ? (
                              <SelectInputComponent
                                name={"marital_status"}
                                options={maritalStatus}
                                error={props.errors.marital_status}
                                touch={props.touched.marital_status}
                                value={props.values.marital_status}
                                label={"Marital Status"}
                                onChange={(field, value) => {
                                  setIsEdited(true);
                                  props.setFieldValue(field, value);
                                }}
                              />
                            ) : null}
                          </div>

                          {/* UAE Blood Group */}
                          <div className="space-y-2">
                            {props.values.nationality ===
                            "United Arab Emirates" ? (
                              <SelectInputComponent
                                name={"blood_group"}
                                options={BloodGroupOptions}
                                error={props.errors?.blood_group}
                                touch={props.touched.blood_group}
                                value={props.values.blood_group}
                                required={true}
                                label={"Blood Group"}
                                onChange={(field, value) => {
                                  setIsEdited(true);
                                  props.setFieldValue(field, value);
                                }}
                              />
                            ) : null}
                          </div>

                          {/* UAE Gender */}
                          <div className="space-y-2">
                            {props.values.nationality ===
                            "United Arab Emirates" ? (
                              <SelectInputComponent
                                name={"gender"}
                                options={GenderOptions}
                                error={props.errors?.gender}
                                touch={props.touched.gender}
                                value={props.values.gender}
                                required={true}
                                label={"Gender"}
                                onChange={(field, value) => {
                                  setIsEdited(true);
                                  props.setFieldValue(field, value);
                                }}
                              />
                            ) : null}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <ProfileFormFooter
                          nextstep={nextstep}
                          handleSubmit={() => {
                            props.handleSubmit();
                          }}
                          isEditMode={isEditMode}
                          isEdited={isEdited}
                        />
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
