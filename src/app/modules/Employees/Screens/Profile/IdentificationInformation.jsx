import React, { useState, useEffect } from "react";
import {
  CardHeader,
  CardBody,
  Row,
  Col,
  Button,
  Form,
  Label,
  FormGroup,
} from 'reactstrap';
import { Formik } from 'formik';
import { connect } from "react-redux";
import { getAllCountries } from 'countries-and-timezones';
import { visaOptions } from '../../../../../data/Data.js';
import {
  FileInput,
  DateInput,
  SelectComponent,
  TextInput,
  CustomDarkButton,
  CustomLightOutlineButton,
  CheckBoxInput,
} from "../../../../../components/form-control";
import PageLoader from '../../../../../components/PageLoader.jsx';
import { getEmployeeVisaDetailsFiles, getEmployeeVisaDetailData, saveEmployeeVisaDetailData } from '../../../../hooks/employee.jsx';


const countryOptions = Object.keys(getAllCountries()).map((countryCode) => ({
  value: countryCode,
  label: getAllCountries()[countryCode].name
}));


const IdentificationInformation = ({ nextstep, baseUrl, token, employeeId, isEditMode, prevStep }) => {
  const formRef = React.createRef();
  const [isLoading, setIsLoading] = useState(true);

  const [visaDetails, setVisaDetails] = useState(false);

  useEffect(() => {
    getEmployeeVisaDetailData(baseUrl, employeeId, token).then(response => {
      setVisaDetails(response);
      setIsLoading(false)
    }).catch(error => {
      //  setIsLoading(false)
      console.log(error);
    });
  }, [baseUrl, employeeId, token]); // Empty dependency array ensures this effect runs only once after the initial render

  const handleSubmit = (data) => {
    const documents = {
      passport_copy: data.passport_copy,
      enter_permit: data.enter_permit,
      visa_page: data.visa_page,
      medical: data.medical,
      id_application: data.id_application,
      id_front: data.id_front,
      id_back: data.id_back,
      insurance_card: data.insurance_card,
    };
    const response = saveEmployeeVisaDetailData(baseUrl, employeeId, token, data, documents);
    if (response)
      nextstep();
  };

  return (
    <>
      {isLoading ?
        <Row>
          <Col lg={12}>
            <PageLoader />
          </Col>
        </Row>
        :
        <Row>
          <Col lg={12}>
            <Formik
              initialValues={visaDetails}
              ref={formRef}
              onSubmit={(values, { resetForm }) => {
                handleSubmit(values, resetForm);
              }}
              validate={(values) => {
                const errors = {};
                console.log(values,);
                // if (values.experiences) {
                //   values.experiences.forEach((value, index) => {
                //     const experienceErrors = {};
                //     Object.keys(value).forEach((field) => {
                //       if (!value[field] && field !== 'disableEndDate') {
                //         experienceErrors[field] = 'This field is required';
                //       }
                //     });
                //     if (Object.keys(experienceErrors).length > 0) {
                //       errors.experiences = errors.experiences || [];
                //       errors.experiences[index] = experienceErrors;
                //     }
                //   });
                //  }
                return errors;
              }}

            >
              {(props) => (
                <Form onSubmit={props.handleSubmit}>

                  <Row>
                    <Col md="12">
                      <h5 className="fw-700 mb-3 mt-4">ID Details</h5>
                    </Col>
                    {console.log(props.values)}

                    <Col md="6">
                      <TextInput
                        name={'living_country_id_no'}
                        error={props.errors.living_country_id_no}
                        touch={props.touched.living_country_id_no}
                        value={props.values.living_country_id_no}
                        label={'Living Country ID No'}
                        required={true}
                        onChange={(field, value) => {
                          props.handleChange(field,)(value);
                        }}
                      />
                    </Col>
                    <Col md={6}>
                      <SelectComponent
                        name={'place_of_issuance'}
                        options={countryOptions}
                        error={props.errors.place_of_issuance}
                        touch={props.touched.place_of_issuance}
                        value={props.values.place_of_issuance}
                        label={'Place of Issuance'}
                        onChange={(field, value) => {
                          props.setFieldValue(field, value);
                        }}
                      />
                    </Col>
                    <Col md={6}>
                      <DateInput
                        name={'id_issuance_date'}
                        error={props.errors.id_issuance_date}
                        touch={props.touched.id_issuance_date}
                        value={props.values.id_issuance_date}
                        label={'ID Issuance Date'}
                        onChange={(field, value) => {
                          props.setFieldValue(field, value);
                        }}
                      />
                    </Col>
                    <Col md={6}>
                      <DateInput
                        name={'id_expiry_date'}
                        error={props.errors.id_expiry_date}
                        touch={props.touched.id_expiry_date}
                        value={props.values.id_expiry_date}
                        label={'ID Expiry Date'}
                        onChange={(field, value) => {
                          props.setFieldValue(field, value);
                        }}
                      />
                    </Col>
                    <Col md="12">
                      <FileInput
                        name={'id_front'}
                        error={props.errors?.id_front}
                        touch={props.touched?.id_front}
                        value={props.values?.id_front}
                        label={'ID Front'}
                        required={true}
                        onChange={(field, value) => {
                          props.setFieldValue(field, value);
                        }}
                      />
                    </Col>
                    <Col md="12">
                      <FileInput
                        name={'id_back'}
                        error={props.errors?.id_back}
                        touch={props.touched?.id_back}
                        value={props.values?.id_back}
                        label={'ID Back'}
                        required={true}
                        onChange={(field, value) => {
                          props.setFieldValue(field, value);
                        }}
                      />
                    </Col>
                    <Col md="12">
                      <CheckBoxInput
                        name={'is_passport_applicable'}
                        value={props.values.is_passport_applicable}
                        label={'Passport Details'}
                        onChange={(field, value) => {
                          props.setFieldValue(field, value);
                        }}
                      />
                    </Col>
                    {props.values.is_passport_applicable &&
                      <>
                        <Col md="6">
                          <TextInput
                            name={'passport_number'}
                            error={props.errors.passport_number}
                            touch={props.touched.passport_number}
                            value={props.values.passport_number}
                            label={'Passport Number'}
                            required={true}
                            onChange={(field, value) => {
                              props.handleChange(field,)(value);
                            }}
                          />
                        </Col>
                        <Col md={6}>
                          <SelectComponent
                            name={'Passport_Issuance_Country'}
                            options={countryOptions}
                            error={props.errors.Passport_Issuance_Country}
                            touch={props.touched.Passport_Issuance_Country}
                            value={props.values.Passport_Issuance_Country}
                            label={'Passport Issuance Country'}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                        </Col>
                        <Col md={6}>
                          <DateInput
                            name={'Passport_Issuance_Date'}
                            error={props.errors.Passport_Issuance_Date}
                            touch={props.touched.Passport_Issuance_Date}
                            value={props.values.Passport_Issuance_Date}
                            label={'Issuance Date'}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                        </Col>
                        <Col md={6}>
                          <DateInput
                            name={'Passport_Expiry_Date'}
                            error={props.errors.Passport_Expiry_Date}
                            touch={props.touched.Passport_Expiry_Date}
                            value={props.values.Passport_Expiry_Date}
                            label={'Expiry Date'}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                        </Col>
                        <Col md="12">
                          <FileInput
                            name={'passport_copy'}
                            error={props.errors?.passport_copy}
                            touch={props.touched?.passport_copy}
                            value={props.values?.passport_copy}
                            label={'Passport Copy'}
                            required={true}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                        </Col>
                      </>
                    }
                    {/* ------------------------------------------------------------ */}
                    <Col md="12">
                      <CheckBoxInput
                        name={'is_visa_applicable'}
                        value={props.values.is_visa_applicable}
                        label={'Visa Details'}
                        onChange={(field, value) => {
                          props.setFieldValue(field, value);
                        }}
                      />
                    </Col>
                    {props.values.is_visa_applicable &&
                      <>
                        <Col md="6">
                          <TextInput
                            name={'entry_permit_number'}
                            error={props.errors.entry_permit_number}
                            touch={props.touched.entry_permit_number}
                            value={props.values.entry_permit_number}
                            label={'Entry Permit Number'}
                            required={true}
                            onChange={(field, value) => {
                              props.handleChange(field,)(value);
                            }}
                          />
                        </Col>
                        <Col md={6}>
                          <SelectComponent
                            name={'country_of_visa_issuance'}
                            options={countryOptions}
                            error={props.errors.country_of_visa_issuance}
                            touch={props.touched.country_of_visa_issuance}
                            value={props.values.country_of_visa_issuance}
                            label={'Visa Issuance Country'}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                        </Col>
                        <Col md="6">
                          <TextInput
                            name={'uid_number'}
                            error={props.errors.uid_number}
                            touch={props.touched.uid_number}
                            value={props.values.uid_number}
                            label={'UID Number'}
                            required={true}
                            onChange={(field, value) => {
                              props.handleChange(field,)(value);
                            }}
                            regEx={/^[0-9]+$/}
                          />
                        </Col>
                        <Col md={6}>
                          <SelectComponent
                            name={'visa_type'}
                            options={visaOptions}
                            error={props.errors.visa_type}
                            touch={props.touched.visa_type}
                            value={props.values.visa_type}
                            label={'Visa Type'}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                        </Col>
                        <Col md={6}>
                          <DateInput
                            name={'visa_issuance_date'}
                            error={props.errors.visa_issuance_date}
                            touch={props.touched.visa_issuance_date}
                            value={props.values.visa_issuance_date}
                            label={'Visa Issuance Date'}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                        </Col>
                        <Col md={6}>
                          <DateInput
                            name={'visa_expiry_date'}
                            error={props.errors.visa_expiry_date}
                            touch={props.touched.visa_expiry_date}
                            value={props.values.visa_expiry_date}
                            label={'Visa Expiry Date'}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                        </Col>
                        <Col md="6">
                          <TextInput
                            name={'visa_duration'}
                            error={props.errors.visa_duration}
                            touch={props.touched.visa_duration}
                            value={props.values.visa_duration}
                            label={'Visa Duration'}
                            required={true}
                            onChange={(field, value) => {
                              props.handleChange(field,)(value);
                            }}
                          />
                        </Col>
                        <Col md={6}>
                          <DateInput
                            name={'visa_country_entry_date'}
                            error={props.errors.visa_country_entry_date}
                            touch={props.touched.visa_country_entry_date}
                            value={props.values.visa_country_entry_date}
                            label={'Visa Country Entry Date'}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                        </Col>
                        <Col md={6}>
                          <DateInput
                            name={'visa_country_entry_date'}
                            error={props.errors.visa_country_exit_date}
                            touch={props.touched.visa_country_exit_date}
                            value={props.values.visa_country_exit_date}
                            label={'Visa Country Exit Date'}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                        </Col>
                        <Col md="12">
                          <FileInput
                            name={'enter_permit'}
                            error={props.errors?.enter_permit}
                            touch={props.touched?.enter_permit}
                            value={props.values?.enter_permit}
                            label={'Entery Permit'}
                            required={true}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                        </Col>
                        <Col md="12">
                          <FileInput
                            name={'visa_page'}
                            error={props.errors?.visa_page}
                            touch={props.touched?.visa_page}
                            value={props.values?.visa_page}
                            label={'Visa Page'}
                            required={true}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                        </Col>
                        <Col md="12">
                          <FileInput
                            name={'medical'}
                            error={props.errors?.medical}
                            touch={props.touched?.medical}
                            value={props.values?.medical}
                            label={'Medical Result'}
                            required={true}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                        </Col>
                        <Col md="12">
                          <FileInput
                            name={'id_application'}
                            error={props.errors?.id_application}
                            touch={props.touched?.id_application}
                            value={props.values?.id_application}
                            label={'ID Application'}
                            required={true}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                        </Col>
                      </>
                    }
                    <Col md="12">
                      <CheckBoxInput
                        name={'is_insurance_applicable'}
                        value={props.values.is_insurance_applicable}
                        label={'Insurance Details'}
                        onChange={(field, value) => {
                          props.setFieldValue(field, value);
                        }}
                      />
                    </Col>
                    {props.values.is_insurance_applicable &&
                      <>
                        <Col md="6">
                          <TextInput
                            name={'dha_id'}
                            error={props.errors.dha_id}
                            touch={props.touched.dha_id}
                            value={props.values.dha_id}
                            label={'DHA ID'}
                            required={true}
                            onChange={(field, value) => {
                              props.handleChange(field,)(value);
                            }}
                          />
                        </Col>
                        <Col md="6">
                          <TextInput
                            name={'card_number'}
                            error={props.errors.card_number}
                            touch={props.touched.card_number}
                            value={props.values.card_number}
                            label={'Card Number'}
                            required={true}
                            onChange={(field, value) => {
                              props.handleChange(field,)(value);
                            }}
                          />
                        </Col>
                        <Col md="6">
                          <TextInput
                            name={'insurance_policy'}
                            error={props.errors.insurance_policy}
                            touch={props.touched.insurance_policy}
                            value={props.values.insurance_policy}
                            label={'Insurance Policy'}
                            required={true}
                            onChange={(field, value) => {
                              props.handleChange(field,)(value);
                            }}
                          />
                        </Col>
                        <Col md="6">
                          <TextInput
                            name={'insurance_company'}
                            error={props.errors.insurance_company}
                            touch={props.touched.insurance_company}
                            value={props.values.insurance_company}
                            label={'Insurance Company'}
                            required={true}
                            onChange={(field, value) => {
                              props.handleChange(field,)(value);
                            }}
                          />
                        </Col>
                        <Col md={6}>
                          <DateInput
                            name={'Passport_Issuance_Date'}
                            error={props.errors.Passport_Issuance_Date}
                            touch={props.touched.Passport_Issuance_Date}
                            value={props.values.Passport_Issuance_Date}
                            label={'Issuance Date'}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                        </Col>
                        <Col md={6}>
                          <DateInput
                            name={'insurance_active_date'}
                            error={props.errors.insurance_active_date}
                            touch={props.touched.insurance_active_date}
                            value={props.values.insurance_active_date}
                            label={'Insurance Active Date'}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                        </Col>
                        <Col md={6}>
                          <DateInput
                            name={'insurance_expiry_date'}
                            error={props.errors.insurance_expiry_date}
                            touch={props.touched.insurance_expiry_date}
                            value={props.values.insurance_expiry_date}
                            label={'Insurance Expiry Date'}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                        </Col>
                        <Col md="12">
                          <FileInput
                            name={'insurance_card'}
                            error={props.errors?.insurance_card}
                            touch={props.touched?.insurance_card}
                            value={props.values?.insurance_card}
                            label={'Insurance Card'}
                            required={true}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                        </Col>
                      </>
                    }
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
          </Col>
        </Row>
      }
    </>
    // <div className="screen flex justify-center">
    //   <div className="w-full flex flex-col min-h-full p-3 md:p-5 lg:p-7">
    //     <div className="flex justify-center flex-grow h-[80vh] overflow-y-auto">
    //       <div className="md:mx-auto w-full md:max-w-3xl">
    //         <h2 className="text-2xl font-lato font-bold text-[#323333] text-left">
    //           Identification Details
    //         </h2>
    //         <hr />
    //         <h2 className="text-[22px] font-lato font-bold text-[#323333] text-left">
    //           ID card
    //         </h2>
    //         <div className="flex flex-wrap gap-x-3">
    //           <div className="w-full md:w-[48%]">
    //             <TextInput name="living_country_id_no" />
    //           </div>
    //           <div className="w-full md:w-[48%]">
    //             <SelectComponent name="place_of_issuance" />
    //           </div>
    //           <div className="w-full md:w-[48%]">
    //             <DateInput name="id_issuance_date" />
    //           </div>
    //           <div className="w-full md:w-[48%]">
    //             <DateInput name="id_expiry_date" />
    //           </div>
    //           <div className="w-full md:w-[97.5%] bg-[#E5E5F0] flex justify-center items-center h-40 mb-2">
    //             <input type="file" name="id_front" id="" />
    //           </div>
    //           <div className="w-full md:w-[97.5%] bg-[#E5E5F0] flex justify-center items-center h-40 mb-2">
    //             <input type="file" name="id_back" id="" />
    //           </div>
    //         </div>
    //         {/* Passport details */}
    //         <div className="flex items-center mb-4">
    //           <input
    //             type="checkbox"
    //             checked={showPassportFields}
    //             onChange={() => setShowPassportFields(!showPassportFields)}
    //           />
    //           <label className="ml-2">Passport Details</label>
    //         </div>
    //         {showPassportFields && (
    //           <>
    //             <h2 className="text-[22px] font-lato font-bold text-[#323333] text-left">
    //               Passport
    //             </h2>
    //             <div className="flex flex-wrap gap-x-3">
    //               <div className="w-full md:w-[48%]">
    //                 <TextInput name="passport_number" />
    //               </div>
    //               <div className="w-full md:w-[48%]">
    //                 <SelectComponent name="Passport_Issuance_Country" />
    //               </div>
    //               <div className="w-full md:w-[48%]">
    //                 <DateInput name="Passport_Issuance_Date" />
    //               </div>
    //               <div className="w-full md:w-[48%]">
    //                 <DateInput name="Passport_Expiry_Date" />
    //               </div>
    //               <div className="w-full md:w-[97.5%] bg-[#E5E5F0] flex justify-center items-center h-40 mb-2">
    //                 <input type="file" name="passport_copy" id="" />
    //               </div>
    //             </div>
    //           </>
    //         )}
    //         {/* visa details */}
    //         <div className="flex items-center mb-4">
    //           <input
    //             type="checkbox"
    //             checked={showVisaFields}
    //             onChange={() => setShowVisaFields(!showVisaFields)}
    //           />
    //           <label className="ml-2">Visa Details</label>
    //         </div>
    //         {showVisaFields && (
    //           <>
    //             <h2 className="text-[22px] font-lato font-bold text-[#323333] text-left">
    //               Visa
    //             </h2>
    //             <div className="flex flex-wrap gap-x-3">
    //               <div className="w-full md:w-[48%]">
    //                 <TextInput name="entry_permit_number" />
    //               </div>
    //               <div className="w-full md:w-[48%]">
    //                 <SelectComponent name="country_of_visa_issuance" />
    //               </div>
    //               <div className="w-full md:w-[48%]">
    //                 <TextInput name="uid_number" />
    //               </div>
    //               <div className="w-full md:w-[48%]">
    //                 <SelectComponent name="visa_type" />
    //               </div>
    //               <div className="w-full md:w-[48%]">
    //                 <DateInput name="visa_issuance_date" />
    //               </div>
    //               <div className="w-full md:w-[48%]">
    //                 <DateInput name="visa_expiry_date" />
    //               </div>
    //               <div className="w-full md:w-[48%]">
    //                 <TextInput name="visa_duration" />
    //               </div>
    //               <div className="w-full md:w-[48%]">
    //                 <DateInput name="visa_country_entry_date" />
    //               </div>
    //               <div className="w-full md:w-[48%]">
    //                 <DateInput name="visa_country_exit_date" />
    //               </div>
    //               <div className="w-full md:w-[97.5%] bg-[#E5E5F0] flex justify-center items-center h-40 mb-2">
    //                 <input type="file" name="enter_permit" id="" />
    //               </div>
    //               <div className="w-full md:w-[97.5%] bg-[#E5E5F0] flex justify-center items-center h-40 mb-2">
    //                 <input type="file" name="visa_page" id="" />
    //               </div>
    //               <div className="w-full md:w-[97.5%] bg-[#E5E5F0] flex justify-center items-center h-40 mb-2">
    //                 <input type="file" name="medical" id="" />
    //               </div>
    //               <div className="w-full md:w-[97.5%] bg-[#E5E5F0] flex justify-center items-center h-40 mb-2">
    //                 <input type="file" name="id_application" id="" />
    //               </div>
    //             </div>
    //           </>
    //         )}
    //         {/* insurance details */}
    //         <div className="flex items-center mb-4">
    //           <input
    //             type="checkbox"
    //             checked={showInsuranceFields}
    //             onChange={() => setShowInsuranceFields(!showInsuranceFields)}
    //           />
    //           <label className="ml-2">Insurance Details</label>
    //         </div>
    //         {showInsuranceFields && (
    //           <>
    //             <h2 className="text-[22px] font-lato font-bold text-[#323333] text-left">
    //               Insurance
    //             </h2>
    //             <div className="flex flex-wrap gap-x-3">
    //               <div className="w-full md:w-[48%]">
    //                 <TextInput name="dha_id" />
    //               </div>
    //               <div className="w-full md:w-[48%]">
    //                 <TextInput name="card_number" />
    //               </div>
    //               <div className="w-full md:w-[48%]">
    //                 <TextInput name="insurance_policy" />
    //               </div>
    //               <div className="w-full md:w-[48%]">
    //                 <TextInput name="insurance_company" />
    //               </div>
    //               <div className="w-full md:w-[48%]">
    //                 <DateInput name="insurance_active_date" />
    //               </div>
    //               <div className="w-full md:w-[48%]">
    //                 <DateInput name="insurance_expiry_date" />
    //               </div>
    //               <div className="w-full md:w-[97.5%] bg-[#E5E5F0] flex justify-center items-center h-40 mb-2">
    //                 <input type="file" name="insurance_card" id="" />
    //               </div>
    //             </div>
    //           </>
    //         )}
    //         <hr />

    //         <CustomButton label="Next" />
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};


const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    baseUrl: state.user.baseUrl,
  };
};

export default connect(mapStateToProps)(IdentificationInformation);