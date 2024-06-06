import React, { useState, useEffect } from "react";
import { Row, Col, Button, Form, FormGroup } from "reactstrap";
import { Formik } from "formik";
import { connect } from "react-redux";
import logo from "../../../../../assets/images/tecbrix-logo.png";
import {
  getEmployeeContactInfo,
  saveEmployeeContactInfoData,
} from "../../../../hooks/employee";
import {
  CustomButton,
  TextInput,
} from "../../../../../components/form-control.jsx";
import PageLoader from "../../../../../components/PageLoader.jsx";
import { getContactInfo } from "../../../../utils/MappingObjects/mapEmployeeData.jsx";

const ContactInformation = ({
  nextstep,
  baseUrl,
  token,
  employeeId,
  isEditMode,
}) => {
  const formRef = React.createRef();
  const [contactInfo, setContactInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getEmployeeContactInfo(baseUrl, employeeId, token)
      .then((response) => {
        setContactInfo(response);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [baseUrl, employeeId, token]); // Empty dependency array ensures this effect runs only once after the initial render

  const handleSubmit = (data) => {
    const ContactInformation = getContactInfo(data);
    const response = saveEmployeeContactInfoData(
      baseUrl,
      employeeId,
      token,
      ContactInformation
    );
    if (response && isEditMode) nextstep();
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
                const errors = {};
                for (let field in values) {
                  if (!values[`${field}`]) {
                    errors[`${field}`] = "This field is required";
                  }
                }
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
                      <TextInput
                        name="emergency_phone_no"
                        error={props.errors.emergency_phone_no}
                        touch={props.touched.emergency_phone_no}
                        value={props.values.emergency_phone_no}
                        label="Emergency Phone Number"
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
                        label="First Name"
                        required
                        onChange={(field, value) => {
                          props.handleChange(field)(value);
                        }}
                      />
                    </Col>
                    <Col md="6">
                      <TextInput
                        name="emergency_last_name"
                        error={props.errors.emergency_last_name}
                        touch={props.touched.emergency_last_name}
                        value={props.values.emergency_last_name}
                        label="Last Name"
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
                    <Col md="6">
                      <TextInput
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
                    <Col md="6">
                      <TextInput
                        name="mobile_no"
                        error={props.errors.mobile_no}
                        touch={props.touched.mobile_no}
                        value={props.values.mobile_no}
                        label="Mobile Number"
                        required
                        onChange={(field, value) => {
                          props.handleChange(field)(value);
                        }}
                        regEx={/^[0-9]+$/}
                      />
                    </Col>
                  </Row>
                  <h2 className="text-[22px] font-lato font-bold text-[#323333] text-left">
                    Present Address
                  </h2>
                  <Row>
                    <Col md="6">
                      <TextInput
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
                    <Col md="6">
                      <TextInput
                        name="mobile_no"
                        error={props.errors.mobile_no}
                        touch={props.touched.mobile_no}
                        value={props.values.mobile_no}
                        label="Mobile Number"
                        required
                        onChange={(field, value) => {
                          props.handleChange(field)(value);
                        }}
                        regEx={/^[0-9]+$/}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup className="text-right">
                        <Button type="submit" className="btn btn-dark">
                          Next
                        </Button>
                      </FormGroup>
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
