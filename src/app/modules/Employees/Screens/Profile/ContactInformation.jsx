import React, { useState, useEffect } from "react";
import { Row, Col, Form } from "reactstrap";
import { Formik } from "formik";
import { connect } from "react-redux";
import {
  getEmployeeContactInfo,
  saveEmployeeContactInfoData,
} from "app/hooks/employee";
import {
  CustomLightOutlineButton,
  CustomDarkButton,
  TextInput,
  PhoneNumberInput,
  TextAreaInput,
} from "components/form-control.jsx";
import {PageLoader} from "components";
import { getContactInfo } from "app/utils/MappingObjects/mapEmployeeData.jsx";
import {validationEmployeeContactInfoFormSchema} from 'app/utils/FormSchema/employeeFormSchema'
import { countryCodes } from "data/CountryCode";

const ContactInformation = ({
  nextstep,
  employeeId,
  isEditMode,
  prevStep,
}) => {
  const formRef = React.createRef();
  const [contactInfo, setContactInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getEmployeeContactInfo(employeeId)
      .then((response) => {
        // split emergency phone number into country code and number
        if (response.emergency_phone_no) {
          const result = extractCountryCodeAndNumber(
            response.emergency_phone_no
          );
          response.emergency_country_code = result[0];
          response.emergency_phone_no = result[1];
        }
        setContactInfo(response);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [employeeId]); // Empty dependency array ensures this effect runs only once after the initial render

  function extractCountryCodeAndNumber(phoneNumber) {
    for (let i = 0; i < countryCodes.length; i++) {
      const dialCode = countryCodes[i].dial_code;
      if (phoneNumber.startsWith(dialCode)) {
        const countryCode = dialCode;
        const number = phoneNumber.substring(dialCode.length);
        return [countryCode, number];
      }
    }
    // Return null or handle if no matching country code found
    return null;
  }

  const handleSubmit = (data) => {
    const ContactInformation = getContactInfo(data);
    const response = saveEmployeeContactInfoData(
      employeeId,
      ContactInformation
    );
    console.log("response", response);
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
            <Form onSubmit={props.handleSubmit}>
              <h2 className="text-[22px] font-lato font-bold text-[#323333] text-left">
                Emergency Contact
              </h2>
              <Row>
                <Col md="6">
                  <PhoneNumberInput
                    name="emergency_phone_no"
                    error={props.errors.emergency_phone_no}
                    touch={props.touched.emergency_phone_no}
                    value={props.values.emergency_phone_no}
                    countryCode={props.values.emergency_country_code}
                    countryCodeName={'emergency_country_code'}
                    label="Emergency Contact"
                    required
                    onChange={(field, value) => {
                      props.handleChange(field)(value);
                    }}
                  />
                </Col>
                <Col md="6">
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
                </Col>
                <Col md="6">
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
                </Col>
              </Row>
              <h2 className="text-[22px] font-lato font-bold text-[#323333] text-left">
                Permanent Address
              </h2>
              <Row>
                <Col md="12">
                  <TextAreaInput
                    name="residential_address"
                    error={props.errors.residential_address}
                    touch={props.touched.residential_address}
                    value={props.values.residential_address}
                    label="Permanent Address"
                    required
                    onChange={(field, value) => {
                      props.handleChange(field)(value);
                    }}
                  />
                </Col>
              </Row>
              <h2 className="text-[22px] font-lato font-bold text-[#323333] text-left">
                Present Address
              </h2>
              <Row>
                <Col md="12">
                  <TextAreaInput
                    name="current_address"
                    error={props.errors.current_address}
                    touch={props.touched.current_address}
                    value={props.values.current_address}
                    label="Current Address"
                    required
                    onChange={(field, value) => {
                      props.handleChange(field)(value);
                    }}
                  />
                </Col>
              </Row>
              <hr />
              <Row>
                <Col md={6} className="text-left">
                  {!isEditMode &&
                    <CustomLightOutlineButton
                      onClick={() => {
                        prevStep()
                      }}
                      label={'Back'}
                    />

                  }</Col>
                <Col md="6" className="text-right">
                  <CustomDarkButton
                    onClick={() => {
                      props.handleSubmit();
                    }}
                    label={isEditMode ? 'Save' : 'Next'}
                  />
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
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
