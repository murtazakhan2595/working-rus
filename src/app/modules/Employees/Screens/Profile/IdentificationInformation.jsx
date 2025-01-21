import React, { useState, useEffect } from "react";

import { Formik } from "formik";
import { connect } from "react-redux";
import { countriesList, visaOptions } from "../../../../../data/Data.js";
import {
  DateInput,
  SelectComponent,
  TextInput,
  CheckBoxInput,
} from "components/FormControl";
import PageLoader from "components/PageLoader.jsx";
import {
  getEmployeeVisaDetailData,
  saveEmployeeVisaDetailData,
  saveEmployeePersonalInfoData,
} from "../../../../hooks/employee.jsx";
import { File } from "app/utils/Types/General.jsx";
import { Button } from "../../../../../components/ui/button";
import { validateEmployeeIdentificationForm } from "app/utils/FormSchema/employeeFormSchema.jsx";
import { CoverFileUpload } from "components/FormControl";
import { Card, CardContent } from "components/ui/card.jsx";

const IdentificationInformation = ({
  nextstep,
  employeeId,
  isEditMode,
  prevStep,
}) => {
  const formRef = React.createRef();
  const [isLoading, setIsLoading] = useState(true);
  const [visaDetails, setVisaDetails] = useState({});

  useEffect(() => {
    const fetchVisaDetails = async () => {
      setIsLoading(true);
      try {
        const response = await getEmployeeVisaDetailData(employeeId);
        setVisaDetails(response);
      } catch (error) {
        console.error("Error fetching visa details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVisaDetails();
  }, [employeeId]);
  const handleSubmit = async (data, resetForm) => {
    setIsLoading(true);
    try {
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

      // Remove document fields from the data
      const {
        passport_copy,
        enter_permit,
        visa_page,
        medical,
        id_application,
        id_front,
        id_back,
        insurance_card,
        ...payLoad
      } = data;
      const response = await saveEmployeeVisaDetailData(
        employeeId,
        payLoad,
        documents
      );

      if (response) {
        nextstep();
        const personalInformation = { is_filled: true };
        await saveEmployeePersonalInfoData(employeeId, personalInformation);
        resetForm();
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error in handleSubmit:", error);
    }
  };
  const addUpdateFile = (field, value, props) => {
    const file = props.values[field] || File;
    file.document = value;
    file.description = `${value?.name} file`;
    props.setFieldValue(field, file);
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
          <Card>
            <CardContent>
              <div className="space-y-4">
                <Formik
                  initialValues={visaDetails}
                  ref={formRef}
                  onSubmit={(values, { resetForm }) => {
                    handleSubmit(values, resetForm);
                  }}
                  validate={validateEmployeeIdentificationForm}
                >
                  {(props) => (
                    <form
                      onSubmit={props.handleSubmit}
                      className="mt-6 space-y-6"
                    >
                      <h6 className="text-base">ID Details</h6>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <TextInput
                              name={"living_country_id_no"}
                              error={props.errors.living_country_id_no}
                              touch={props.touched.living_country_id_no}
                              value={props.values.living_country_id_no}
                              label={"Living Country ID No"}
                              required={true}
                              onChange={(field, value) => {
                                props.handleChange(field)(value);
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <SelectComponent
                              name="place_of_issuance"
                              options={countriesList}
                              value={props.values.place_of_issuance}
                              error={props.errors.place_of_issuance}
                              touch={props.touched.place_of_issuance}
                              label="Select Country"
                              required={true}
                              onChange={(field, value) => {
                                props.setFieldValue(field, value);
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <DateInput
                              name={"id_issuance_date"}
                              error={props.errors.id_issuance_date}
                              touch={props.touched.id_issuance_date}
                              value={props.values.id_issuance_date}
                              label={"ID Issuance Date"}
                              required={true}
                              onChange={(field, value) => {
                                props.setFieldValue(field, value);
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <DateInput
                              name={"id_expiry_date"}
                              error={props.errors.id_expiry_date}
                              touch={props.touched.id_expiry_date}
                              value={props.values.id_expiry_date}
                              label={"ID Expiry Date"}
                              required={true}
                              onChange={(field, value) => {
                                props.setFieldValue(field, value);
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <CoverFileUpload
                              name={"id_front"}
                              error={props.errors?.id_front}
                              touch={props.touched?.id_front}
                              value={props.values?.id_front?.document}
                              label={"ID Front"}
                              required={true}
                              onChange={(field, value) => {
                                addUpdateFile(field, value, props);
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <CoverFileUpload
                              name={"id_back"}
                              error={props.errors?.id_back}
                              touch={props.touched?.id_back}
                              value={props.values?.id_back?.document}
                              label={"ID Back"}
                              required={true}
                              onChange={(field, value) => {
                                addUpdateFile(field, value, props);
                              }}
                            />
                          </div>
                          <div className="col-span-2 space-y-2">
                            <CheckBoxInput
                              name={"is_passport_applicable"}
                              value={props.values.is_passport_applicable}
                              label={"Passport Details"}
                              onChange={(field, value) => {
                                props.setFieldValue(field, value);
                              }}
                            />
                          </div>
                          {props.values.is_passport_applicable && (
                            <>
                              <h6 className="text-base">Passport Details</h6>
                              <div className="col-span-2 space-y-2">
                                <TextInput
                                  name={"passport_number"}
                                  error={props.errors.passport_number}
                                  touch={props.touched.passport_number}
                                  value={props.values.passport_number}
                                  label={"Passport Number"}
                                  required={true}
                                  onChange={(field, value) => {
                                    props.handleChange(field)(value);
                                  }}
                                />
                              </div>
                              <div className="space-y-2">
                                <SelectComponent
                                  name={"Passport_Issuance_Country"}
                                  value={props.values.Passport_Issuance_Country}
                                  error={props.errors.Passport_Issuance_Country}
                                  touch={
                                    props.touched.Passport_Issuance_Country
                                  }
                                  options={countriesList}
                                  label={"Passport Issuance Country"}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </div>
                              <div className="space-y-2">
                                <DateInput
                                  name={"Passport_Issuance_Date"}
                                  error={props.errors.Passport_Issuance_Date}
                                  touch={props.touched.Passport_Issuance_Date}
                                  value={props.values.Passport_Issuance_Date}
                                  label={"Issuance Date"}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </div>
                              <div className="space-y-2">
                                <DateInput
                                  name={"Passport_Expiry_Date"}
                                  error={props.errors.Passport_Expiry_Date}
                                  touch={props.touched.Passport_Expiry_Date}
                                  value={props.values.Passport_Expiry_Date}
                                  label={"Expiry Date"}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </div>
                              <div className="space-y-2">
                                <CoverFileUpload
                                  name={"passport_copy"}
                                  error={props.errors?.passport_copy}
                                  touch={props.touched?.passport_copy}
                                  value={props.values?.passport_copy?.document}
                                  label={"Passport Copy"}
                                  required={true}
                                  onChange={(field, value) => {
                                    addUpdateFile(field, value, props);
                                  }}
                                />
                              </div>
                            </>
                          )}
                          {/* ------------------------------------------------------------ */}
                          <div className="col-span-2 space-y-2">
                            <CheckBoxInput
                              name={"is_visa_applicable"}
                              value={props.values.is_visa_applicable}
                              label={"Visa Details"}
                              onChange={(field, value) => {
                                props.setFieldValue(field, value);
                              }}
                            />
                          </div>
                          {props.values.is_visa_applicable && (
                            <>
                              <h6 className="text-base">Visa Details</h6>
                              <div className="col-span-2 space-y-2">
                                <TextInput
                                  name={"entry_permit_number"}
                                  error={props.errors.entry_permit_number}
                                  touch={props.touched.entry_permit_number}
                                  value={props.values.entry_permit_number}
                                  label={"Entry Permit Number"}
                                  required={true}
                                  onChange={(field, value) => {
                                    props.handleChange(field)(value);
                                  }}
                                />
                              </div>
                              <div className="space-y-2">
                                <SelectComponent
                                  name={"country_of_visa_issuance"}
                                  value={props.values.country_of_visa_issuance}
                                  options={countriesList}
                                  error={props.errors.country_of_visa_issuance}
                                  touch={props.touched.country_of_visa_issuance}
                                  label={"Visa Issuance Country"}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </div>
                              <div className="space-y-2">
                                <TextInput
                                  name={"uid_number"}
                                  error={props.errors.uid_number}
                                  touch={props.touched.uid_number}
                                  value={props.values.uid_number}
                                  label={"UID Number"}
                                  required={true}
                                  onChange={(field, value) => {
                                    props.handleChange(field)(value);
                                  }}
                                  regEx={/^[0-9]+$/}
                                />
                              </div>
                              <div className="space-y-2">
                                <SelectComponent
                                  name={"visa_type"}
                                  options={visaOptions}
                                  error={props.errors.visa_type}
                                  touch={props.touched.visa_type}
                                  value={props.values.visa_type}
                                  label={"Visa Type"}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </div>
                              <div className="space-y-2">
                                <TextInput
                                  name={"visa_duration"}
                                  error={props.errors.visa_duration}
                                  touch={props.touched.visa_duration}
                                  value={props.values.visa_duration}
                                  label={"Visa Duration"}
                                  required={true}
                                  onChange={(field, value) => {
                                    props.handleChange(field)(value);
                                  }}
                                />
                              </div>
                              <div className="space-y-2">
                                <DateInput
                                  name={"visa_issuance_date"}
                                  error={props.errors.visa_issuance_date}
                                  touch={props.touched.visa_issuance_date}
                                  value={props.values.visa_issuance_date}
                                  label={"Visa Issuance Date"}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </div>
                              <div className="space-y-2">
                                <DateInput
                                  name={"visa_expiry_date"}
                                  error={props.errors.visa_expiry_date}
                                  touch={props.touched.visa_expiry_date}
                                  value={props.values.visa_expiry_date}
                                  label={"Visa Expiry Date"}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </div>

                              <div className="space-y-2">
                                <DateInput
                                  name={"visa_country_entry_date"}
                                  error={props.errors.visa_country_entry_date}
                                  touch={props.touched.visa_country_entry_date}
                                  value={props.values.visa_country_entry_date}
                                  label={"Visa Country Entry Date"}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </div>
                              <div className="space-y-2">
                                <DateInput
                                  name={"visa_country_exit_date"}
                                  error={props.errors.visa_country_exit_date}
                                  touch={props.touched.visa_country_exit_date}
                                  value={props.values.visa_country_exit_date}
                                  label={"Visa Country Exit Date"}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </div>
                              <div className="space-y-2">
                                <CoverFileUpload
                                  name={"enter_permit"}
                                  error={props.errors?.enter_permit}
                                  touch={props.touched?.enter_permit}
                                  value={props.values?.enter_permit?.document}
                                  label={"Entery Permit"}
                                  required={true}
                                  onChange={(field, value) => {
                                    addUpdateFile(field, value, props);
                                  }}
                                />
                              </div>

                              <div className="space-y-2">
                                <CoverFileUpload
                                  name={"visa_page"}
                                  error={props.errors?.visa_page}
                                  touch={props.touched?.visa_page}
                                  value={props.values?.visa_page?.document}
                                  label={"Visa Page"}
                                  required={true}
                                  onChange={(field, value) => {
                                    addUpdateFile(field, value, props);
                                  }}
                                />
                              </div>
                              <div className="space-y-2">
                                <CoverFileUpload
                                  name={"medical"}
                                  error={props.errors?.medical}
                                  touch={props.touched?.medical}
                                  value={props.values?.medical?.document}
                                  label={"Medical Result"}
                                  required={true}
                                  onChange={(field, value) => {
                                    addUpdateFile(field, value, props);
                                  }}
                                />
                              </div>
                              <div className="space-y-2">
                                <CoverFileUpload
                                  name={"id_application"}
                                  error={props.errors?.id_application}
                                  touch={props.touched?.id_application}
                                  value={props.values?.id_application?.document}
                                  label={"ID Application"}
                                  required={true}
                                  onChange={(field, value) => {
                                    addUpdateFile(field, value, props);
                                  }}
                                />
                              </div>
                            </>
                          )}
                          <div className="col-span-2 space-y-2">
                            <CheckBoxInput
                              name={"is_insurance_applicable"}
                              value={props.values.is_insurance_applicable}
                              label={"Insurance Details"}
                              onChange={(field, value) => {
                                props.setFieldValue(field, value);
                              }}
                            />
                          </div>
                          {props.values.is_insurance_applicable && (
                            <>
                              <h6 className="text-base">Insurance Details</h6>
                              <div className="col-span-2 space-y-2">
                                <TextInput
                                  name={"dha_id"}
                                  error={props.errors.dha_id}
                                  touch={props.touched.dha_id}
                                  value={props.values.dha_id}
                                  label={"DHA ID"}
                                  required={true}
                                  onChange={(field, value) => {
                                    props.handleChange(field)(value);
                                  }}
                                />
                              </div>
                              <div className="space-y-2">
                                <TextInput
                                  name={"card_number"}
                                  error={props.errors.card_number}
                                  touch={props.touched.card_number}
                                  value={props.values.card_number}
                                  label={"Card Number"}
                                  required={true}
                                  onChange={(field, value) => {
                                    props.handleChange(field)(value);
                                  }}
                                />
                              </div>
                              <div className="space-y-2">
                                <TextInput
                                  name={"insurance_policy"}
                                  error={props.errors.insurance_policy}
                                  touch={props.touched.insurance_policy}
                                  value={props.values.insurance_policy}
                                  label={"Insurance Policy"}
                                  required={true}
                                  onChange={(field, value) => {
                                    props.handleChange(field)(value);
                                  }}
                                />
                              </div>

                              {/* <div className="space-y-2">
                          <DateInput
                            name={"Passport_Issuance_Date"}
                            error={props.errors.Passport_Issuance_Date}
                            touch={props.touched.Passport_Issuance_Date}
                            value={props.values.Passport_Issuance_Date}
                            label={"Issuance Date"}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                        </div> */}
                              <div className="space-y-2">
                                <DateInput
                                  name={"insurance_active_date"}
                                  error={props.errors.insurance_active_date}
                                  touch={props.touched.insurance_active_date}
                                  value={props.values.insurance_active_date}
                                  label={"Insurance Active Date"}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </div>
                              <div className="space-y-2">
                                <DateInput
                                  name={"insurance_expiry_date"}
                                  error={props.errors.insurance_expiry_date}
                                  touch={props.touched.insurance_expiry_date}
                                  value={props.values.insurance_expiry_date}
                                  label={"Insurance Expiry Date"}
                                  onChange={(field, value) => {
                                    props.setFieldValue(field, value);
                                  }}
                                />
                              </div>
                              <div className="space-y-2">
                                <TextInput
                                  name={"insurance_company"}
                                  error={props.errors.insurance_company}
                                  touch={props.touched.insurance_company}
                                  value={props.values.insurance_company}
                                  label={"Insurance Company"}
                                  required={true}
                                  onChange={(field, value) => {
                                    props.handleChange(field)(value);
                                  }}
                                />
                              </div>
                              <div className="space-y-2">
                                <CoverFileUpload
                                  name={"insurance_card"}
                                  error={props.errors?.insurance_card}
                                  touch={props.touched?.insurance_card}
                                  value={props.values?.insurance_card?.document}
                                  label={"Insurance Card"}
                                  required={true}
                                  onChange={(field, value) => {
                                    addUpdateFile(field, value, props);
                                  }}
                                />
                              </div>
                            </>
                          )}
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
                    </form>
                  )}
                </Formik>
              </div>
            </CardContent>
          </Card>
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

export default connect(mapStateToProps)(IdentificationInformation);
