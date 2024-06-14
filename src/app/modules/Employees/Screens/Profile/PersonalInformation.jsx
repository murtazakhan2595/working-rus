import React, { useState, useEffect } from "react";
import { Row, Col, Form } from "reactstrap";
import { Formik } from "formik";
import { getAllCountries } from "countries-and-timezones";
import { connect } from "react-redux";
import {
  getEmployeePersonalInfoData,
  saveEmployeePersonalInfoData,
} from "../../../../hooks/employee";
import { getPersonalInfo } from "../../../../utils/MappingObjects/mapEmployeeData.jsx";
import { validationPersonalInfoFormSchema } from "../../../../utils/FormSchema/employeeFormSchema";
import {
  SelectComponent,
  ImageInput,
  DateInput,
  TextInput,
  PhoneNumberInput,
  EmailInput,
  CustomDarkButton,
} from "../../../../../components/form-control";
import PageLoader from "../../../../../components/PageLoader.jsx";
import { maritalStatus } from "../../../../../data/Data.js";

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

  useEffect(() => {
    getEmployeePersonalInfoData(baseUrl, employeeId, token)
      .then((response) => {
        setPersonalInfo(response);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [baseUrl, employeeId, token]); // Empty dependency array ensures this effect runs only once after the initial render

  const handleSubmit = (data) => {
    const personalInfrmation = getPersonalInfo(data);

    console.log("I am the submmited personal Information", personalInfrmation);
    const response = saveEmployeePersonalInfoData(
      baseUrl,
      employeeId,
      token,
      personalInfrmation
    );
    if (response) nextstep();
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
                <Form onSubmit={props.handleSubmit}>
                  <Row>
                    <Col md="12">
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
                    </Col>
                    {employeeId && (
                      <Col lg={12} className="mb-3 ml-1">
                        <h6 className="fw-700 mb-0">
                          {props.values.first_name} {props.values.last_name}
                        </h6>
                        <span className="opacity-65 fs-12">
                          ID: {`TXB-${employeeId.toString().padStart(4, "0")}`}
                        </span>
                      </Col>
                    )}
                    <Col md="6">
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
                    </Col>
                    <Col md={6}>
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
                    </Col>
                    <Col md="6">
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
                    </Col>
                    <Col md="6">
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
                    </Col>
                    <Col md="6">
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
                    </Col>
                    <Col md="6">
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
                    </Col>
                    <Col md="6">
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
                    </Col>

                    <Col md={6}>
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
                    </Col>
                    <Col md={6}>
                      <DateInput
                        name={"date_of_birth"}
                        error={props.errors.date_of_birth}
                        touch={props.touched.date_of_birth}
                        value={props.values.date_of_birth}
                        label={"DOB"}
                        onChange={(field, value) => {
                          props.setFieldValue(field, value);
                        }}
                      />
                    </Col>
                    <Col md={6}>
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
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col md={6} className="text-left"></Col>
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
    token: state.user.token,
    baseUrl: state.user.baseUrl,
  };
};

export default connect(mapStateToProps)(PersonalInfo);
