import React, { useState, useEffect } from "react";
import { Row, Col, Button, Form, FormGroup } from "reactstrap";
import { Formik } from "formik";
import { connect } from "react-redux";
import logo from "../../../../../assets/images/tecbrix-logo.png";
import {
  getEmployeeData,
  saveEmployeePersonalInfoData,
} from "../../../../hooks/employee.jsx";
// import { getContactDetails } from '../../../../utils/MappingObjects/mapEmployeeData.jsx'
import {
  CustomButton,
  TextInput,
} from "../../../../../components/form-control.jsx";
import PageLoader from "../../../../../components/PageLoader.jsx";

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
    getEmployeeData(baseUrl, employeeId, token)
      .then((response) => {
        setContactInfo(response);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [baseUrl, employeeId, token]);

  const handleSubmit = (data) => {
    // const contactDetails = getContactDetails(data);
    // const response = saveEmployeePersonalInfoData(baseUrl, employeeId, token, contactDetails);
    // if (response && isEditMode)
    //     nextstep();
  };

  return (
    // <div className="h-screen flex justify-center">
    //     <div className="w-full flex flex-col min-h-full p-3 md:p-5 lg:p-7">
    //         <div className="flex justify-between">
    //             <div className="flex justify-start items-start">
    //                 <img
    //                     src={logo}
    //                     className="w-[142px] h-auto md:h-auto lg:pl-5"
    //                     alt="Tecbrix logo"
    //                 />
    //             </div>
    //         </div>
    //         <div className="flex justify-center flex-grow h-[80vh] overflow-y-auto">
    //             <div className="md:mx-auto w-full md:max-w-3xl">
    //                 <h2 className="text-2xl font-lato font-bold text-[#323333] text-left">
    //                     Contact Information
    //                 </h2>
    //                 <hr />
    //                 {isLoading ?
    //                     <Row>
    //                         <Col lg={12}>
    //                             <PageLoader />
    //                         </Col>
    //                     </Row>
    //                     :
    //                     <Formik
    //                         initialValues={contactInfo}
    //                         ref={formRef}
    //                         onSubmit={(values, { resetForm }) => {
    //                             handleSubmit(values, resetForm);
    //                         }}
    //                         validate={(values) => {
    //                             const errors = {};
    //                             for (let field in values) {
    //                                 if (!values[`${field}`]) {
    //                                     errors[`${field}`] = 'This field is required';
    //                                 }
    //                             }
    //                             return errors;
    //                         }}
    //                     >
    //                         {(props) => (
    //                             <Form onSubmit={props.handleSubmit}>
    //                                 <h2 className="text-[22px] font-lato font-bold text-[#323333] text-left">
    //                                     Emergency Contact
    //                                 </h2>
    //                                 <div className="flex flex-wrap gap-x-3">
    //                                     <Col md="6">
    //                                         <TextInput
    //                                             name={'emergency_phone_no'}
    //                                             error={props.errors.emergency_phone_no}
    //                                             touch={props.touched.emergency_phone_no}
    //                                             value={props.values.emergency_phone_no}
    //                                             label={'Emergency Phone Number'}
    //                                             required={true}
    //                                             onChange={(field, value) => {
    //                                                 props.handleChange(field,)(value);
    //                                             }}
    //                                         />
    //                                     </Col>
    //                                     <Col md="6">
    //                                         <TextInput
    //                                             name={'emergency_first_name'}
    //                                             error={props.errors.emergency_first_name}
    //                                             touch={props.touched.emergency_first_name}
    //                                             value={props.values.emergency_first_name}
    //                                             label={'First Name'}
    //                                             required={true}
    //                                             onChange={(field, value) => {
    //                                                 props.handleChange(field,)(value);
    //                                             }}
    //                                         />
    //                                     </Col>
    //                                     <Col md="6">
    //                                         <TextInput
    //                                             name={'emergency_last_name'}
    //                                             error={props.errors.emergency_last_name}
    //                                             touch={props.touched.emergency_last_name}
    //                                             value={props.values.emergency_last_name}
    //                                             label={'Last Name'}
    //                                             required={true}
    //                                             onChange={(field, value) => {
    //                                                 props.handleChange(field,)(value);
    //                                             }}
    //                                         />
    //                                     </Col>
    //                                     <Col md="6">
    //                                         <TextInput
    //                                             name={'emergency_relation'}
    //                                             error={props.errors.emergency_relation}
    //                                             touch={props.touched.emergency_relation}
    //                                             value={props.values.emergency_relation}
    //                                             label={'Relation'}
    //                                             required={true}
    //                                             onChange={(field, value) => {
    //                                                 props.handleChange(field,)(value);
    //                                             }}
    //                                         />
    //                                     </Col>
    //                                 </div>
    //                                 <h2 className="text-[22px] font-lato font-bold text-[#323333] text-left">
    //                                     Permanent Address
    //                                 </h2>
    //                                 <div className="flex flex-wrap gap-x-3">
    //                                     <Col md="6">
    //                                         <TextInput
    //                                             name={'first_name'}
    //                                             error={props.errors.first_name}
    //                                             touch={props.touched.first_name}
    //                                             value={props.values.first_name}
    //                                             label={'First Name'}
    //                                             required={true}
    //                                             onChange={(field, value) => {
    //                                                 props.handleChange(field,)(value);
    //                                             }}
    //                                         />
    //                                     </Col>
    //                                     <Col md="6">
    //                                         <TextInput
    //                                             name={'mobile_no'}
    //                                             error={props.errors.mobile_no}
    //                                             touch={props.touched.mobile_no}
    //                                             value={props.values.mobile_no}
    //                                             label={'Mobile Number'}
    //                                             required={true}
    //                                             onChange={(field, value) => {
    //                                                 props.handleChange(field,)(value);
    //                                             }}
    //                                             regEx={/^[0-9]+$/}
    //                                         />
    //                                     </Col>
    //                                 </div>
    //                                 <h2 className="text-[22px] font-lato font-bold text-[#323333] text-left">
    //                                     Present Address
    //                                 </h2>
    //                                 <div className="flex flex-wrap gap-x-3">
    //                                     <Col md="6">
    //                                         <TextInput
    //                                             name={'current_address'}
    //                                             error={props.errors.current_address}
    //                                             touch={props.touched.current_address}
    //                                             value={props.values.current_address}
    //                                             label={'Current Address'}
    //                                             required={true}
    //                                             onChange={(field, value) => {
    //                                                 props.handleChange(field,)(value);
    //                                             }}
    //                                         />
    //                                     </Col>
    //                                     <Col md="6">
    //                                         <TextInput
    //                                             name={'mobile_no'}
    //                                             error={props.errors.mobile_no}
    //                                             touch={props.touched.mobile_no}
    //                                             value={props.values.mobile_no}
    //                                             label={'Mobile Number'}
    //                                             required={true}
    //                                             onChange={(field, value) => {
    //                                                 props.handleChange(field,)(value);
    //                                             }}
    //                                             regEx={/^[0-9]+$/}
    //                                         />
    //                                     </Col>
    //                                 </div>
    //                                 <Row>
    //                                     <Col md="12">
    //                                         <FormGroup className="text-right">
    //                                             <Button
    //                                                 type="submit"
    //                                                 className="btn btn-dark"
    //                                             >
    //                                                 Next
    //                                             </Button>
    //                                         </FormGroup>
    //                                     </Col>
    //                                 </Row>
    //                             </Form>
    //                         )}
    //                     </Formik>
    //                 }
    //             </div>
    //         </div>
    //         <div className="flex justify-start items-start">
    //             <p className="font-roboto font-normal text-base text-[#5C5E64] lg:pl-5">
    //                 © 2024 TecBrix
    //             </p>
    //         </div>
    //     </div>
    // </div>
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-3xl p-3 md:p-5 lg:p-7">
        <h2 className="text-2xl font-lato font-bold text-[#323333] text-left">
          Contact Information
        </h2>
        <hr />
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
                      onChange={props.handleChange}
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
                      onChange={props.handleChange}
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
                      onChange={props.handleChange}
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
                      onChange={props.handleChange}
                    />
                  </Col>
                </Row>
                <h2 className="text-[22px] font-lato font-bold text-[#323333] text-left">
                  Permanent Address
                </h2>
                <Row>
                  <Col md="6">
                    <TextInput
                      name="first_name"
                      error={props.errors.first_name}
                      touch={props.touched.first_name}
                      value={props.values.first_name}
                      label="First Name"
                      required
                      onChange={props.handleChange}
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
                      onChange={props.handleChange}
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
                      onChange={props.handleChange}
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
                      onChange={props.handleChange}
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
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    baseUrl: state.user.baseUrl,
  };
};

export default connect(mapStateToProps)(ContactInformation);
