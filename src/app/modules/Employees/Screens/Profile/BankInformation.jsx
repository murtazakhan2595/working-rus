import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import { connect } from "react-redux";
import {
  getEmployeeData,
  saveEmployeeBankDetailsData,
} from "app/hooks/employee.jsx";
import {
  mapEmployeeBankDetailPayloadData,
  getBankDetails,
} from "app/utils/MappingObjects/mapEmployeeData.jsx";
import { TextInput, TextAreaInput } from "components/FormControl";
import PageLoader from "components/PageLoader.jsx";
import { Button } from "components/ui/button.jsx";
import { validateEmployeeBankInformationForm } from "app/utils/FormSchema/employeeFormSchema.jsx";
import { Card, CardContent } from "components/ui/card.jsx";

const BankInformation = ({
  nextstep,
  employeeId,
  isEditMode,
  prevStep,
}) => {
  const formRef = React.createRef();
  const [bankInfo, setBankInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isEdited, setIsEdited] = useState(false);
  const fetchData = async (isMounted) => {
    try {
      setIsLoading(true);
      if (isMounted) {
        const response = await getEmployeeData(employeeId);
        const employeeData = await getBankDetails(response);
        setBankInfo(employeeData);
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

  const handleSubmit = (data) => {
    const bandetails = mapEmployeeBankDetailPayloadData(data);
    const response = saveEmployeeBankDetailsData(bandetails, employeeId);
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
        <div className="space-y-4">
          <Formik
            initialValues={bankInfo}
            ref={formRef}
            onSubmit={(values, { resetForm }) => {
              handleSubmit(values, resetForm);
            }}
            validate={validateEmployeeBankInformationForm}
          >
            {(props) => (
              <form onSubmit={props.handleSubmit} className="mt-6 space-y-6">
                <Card className="p-6">
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <TextInput
                            name={"account_iban"}
                            error={props.errors.account_iban}
                            touch={props.touched.account_iban}
                            value={props.values.account_iban}
                            label={"IBAN Number"}
                            required={true}
                            onChange={(field, value) => {
                              setIsEdited(true);
                              props.handleChange(field)(value);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <TextInput
                            name={"bank_name"}
                            error={props.errors.bank_name}
                            touch={props.touched.bank_name}
                            value={props.values.bank_name}
                            label={"Bank Name"}
                            required={true}
                            onChange={(field, value) => {
                              setIsEdited(true);
                              props.handleChange(field)(value);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <TextInput
                            name={"account_title"}
                            error={props.errors.account_title}
                            touch={props.touched.account_title}
                            value={props.values.account_title}
                            label={"Account Title"}
                            required={true}
                            onChange={(field, value) => {
                              setIsEdited(true);
                              props.handleChange(field)(value);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <TextInput
                            name={"branch_code"}
                            error={props.errors.branch_code}
                            touch={props.touched.branch_code}
                            value={props.values.branch_code}
                            label={"Branch Code"}
                            onChange={(field, value) => {
                              setIsEdited(true);
                              props.handleChange(field)(value);
                            }}
                            regEx={/^[0-9]+$/}
                          />
                        </div>
                        <div className="space-y-2">
                          <TextInput
                            name={"account_number"}
                            error={props.errors.account_number}
                            touch={props.touched.account_number}
                            value={props.values.account_number}
                            label={"Account Number"}
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
                            name={"swift_code"}
                            error={props.errors.swift_code}
                            touch={props.touched.swift_code}
                            value={props.values.swift_code}
                            label={"Routing Code"}
                            onChange={(field, value) => {
                              setIsEdited(true);
                              props.handleChange(field)(value);
                            }}
                            maxLength={10}
                            regEx={/^[a-zA-Z0-9]*$/}
                          />
                        </div>
                        <div className="col-span-2 space-y-2">
                          <TextAreaInput
                            name={"branch_address"}
                            error={props.errors.branch_address}
                            touch={props.touched.branch_address}
                            value={props.values.branch_address}
                            label={"Branch Address"}
                            onChange={(field, value) => {
                              setIsEdited(true);
                              props.handleChange(field)(value);
                            }}
                          />
                        </div>
                      </div>

                      <div className="p-6 border-t border-gray-200 div-span-2 bg-gray-50">
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
                          {isEdited || isEditMode ? (
                            <Button
                              type="submit"
                              size="lg"
                              variant="default"
                              onClick={() => {
                                props.handleSubmit();
                              }}
                            >
                              Save
                            </Button>
                          ) : (
                            <Button
                              size="lg"
                              variant="default"
                              onClick={(e) => {
                                e.preventDefault();
                                nextstep();
                              }}
                            >
                              Next
                            </Button>
                          )}
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

export default connect(mapStateToProps)(BankInformation);
