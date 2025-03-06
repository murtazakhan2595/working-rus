import React, { useState, useEffect, forwardRef } from "react";

import { Formik } from "formik";
import { connect } from "react-redux";
import { countriesList, visaOptions } from "data/Data.js";
import {
  DateInput,
  SelectInputComponent,
  TextInput,
  CheckBoxInput,
} from "components/FormControl";
import PageLoader from "components/PageLoader.jsx";
import {
  getEmployeeVisaDetailData,
  saveEmployeeVisaDetailData,
  saveEmployeePersonalInfoData,
} from "../../../../../hooks/employee.jsx";
import { File } from "app/utils/Types/General.jsx";
import DrivingLicenseDetails from "./DrivingLicenseDetails";
import PassportDetails from "./PassportDetails";
import IDDetails from "./IDDetails";
import VisaDetails from "./VisaDetails";
import InsuranceDetails from "./InsuranceDetails";
import { validateEmployeeIdentificationForm } from "app/utils/FormSchema/employeeFormSchema.jsx";
import { CoverFileUpload } from "components/FormControl";
import { Card, CardContent, CardFooter } from "components/ui/card.jsx";
import ProfileFormFooter from "app/modules/Employees/Screens/Sections/ProfileFormFooter";

const IdentificationInformation = ({
  nextstep,
  employeeId,
  isEditMode,
  prevStep,
}) => {
  const formRef = React.createRef();
  const [isLoading, setIsLoading] = useState(true);
  const [visaDetails, setVisaDetails] = useState({});
  const [isEdited, setIsEdited] = useState(false);

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
        license_copy:data.license_copy,
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
        license_copy,
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
    debugger
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
        <div className="space-y-4">
          <Formik
            initialValues={visaDetails}
            ref={formRef}
            onSubmit={(values, { resetForm }) => {
              handleSubmit(values, resetForm);
            }}
            validate={(values) => {
              const errors = validateEmployeeIdentificationForm(values);
              console.log("errors", errors);

              return errors;
            }}
          >
            {(props) => (
              <form onSubmit={props.handleSubmit} className="mt-6 space-y-6">
                <Card className="py-4">
                  <CardContent className="flex flex-col gap-2">
                    <IdentificationDetailSection title={"ID Details"}>
                      <IDDetails
                        errors={props.errors}
                        touched={props.touched}
                        values={props.values}
                        onChange={(field, value) => {
                          setIsEdited(true);
                          props.setFieldValue(field, value);
                        }}
                        addUpdateFile={(field, value) => {
                          setIsEdited(true);
                          addUpdateFile(field, value, props);
                        }}
                      />
                    </IdentificationDetailSection>
                    <div className="space-y-2">
                      <CheckBoxInput
                        name={"is_license_applicable"}
                        value={props.values.is_license_applicable}
                        label={"Driving License Details"}
                        onChange={(field, value) => {
                          setIsEdited(true);
                          props.setFieldValue(field, value);
                        }}
                      />
                    </div>
                    {props.values.is_license_applicable && (
                      <IdentificationDetailSection title="Driving License Details">
                        <DrivingLicenseDetails
                          errors={props.errors}
                          touched={props.touched}
                          values={props.values}
                          onChange={(field, value) => {
                            setIsEdited(true);
                            props.setFieldValue(field, value);
                          }}
                          addUpdateFile={(field, value) => {
                            setIsEdited(true);
                            addUpdateFile(field, value, props);
                          }}
                        />
                      </IdentificationDetailSection>
                    )}

                    <div className="space-y-2">
                      <CheckBoxInput
                        name={"is_passport_applicable"}
                        value={props.values.is_passport_applicable}
                        label={"Passport Details"}
                        onChange={(field, value) => {
                          setIsEdited(true);
                          props.setFieldValue(field, value);
                        }}
                      />
                    </div>
                    {props.values.is_passport_applicable && (
                      <IdentificationDetailSection title="Passport Details">
                        <PassportDetails
                          errors={props.errors}
                          touched={props.touched}
                          values={props.values}
                          onChange={(field, value) => {
                            setIsEdited(true);
                            props.setFieldValue(field, value);
                          }}
                          addUpdateFile={(field, value) => {
                            setIsEdited(true);
                            addUpdateFile(field, value, props);
                          }}
                        />
                      </IdentificationDetailSection>
                    )}
                    <div className="space-y-2">
                      <CheckBoxInput
                        name={"is_visa_applicable"}
                        value={props.values.is_visa_applicable}
                        label={"Visa Details"}
                        onChange={(field, value) => {
                          setIsEdited(true);
                          props.setFieldValue(field, value);
                        }}
                      />
                    </div>
                    {props.values.is_visa_applicable && (
                      <IdentificationDetailSection title="Visa Details">
                        <VisaDetails
                          errors={props.errors}
                          touched={props.touched}
                          values={props.values}
                          onChange={(field, value) => {
                            setIsEdited(true);
                            props.setFieldValue(field, value);
                          }}
                          addUpdateFile={(field, value) => {
                            setIsEdited(true);
                            addUpdateFile(field, value, props);
                          }}
                        />
                      </IdentificationDetailSection>
                    )}
                    <div className="col-span-2 space-y-2">
                      <CheckBoxInput
                        name={"is_insurance_applicable"}
                        value={props.values.is_insurance_applicable}
                        label={"Insurance Details"}
                        onChange={(field, value) => {
                          setIsEdited(true);
                          props.setFieldValue(field, value);
                        }}
                      />
                    </div>
                    {props.values.is_insurance_applicable && (
                      <IdentificationDetailSection title="Insurance Details">
                        <InsuranceDetails
                          errors={props.errors}
                          touched={props.touched}
                          values={props.values}
                          onChange={(field, value) => {
                            setIsEdited(true);
                            props.setFieldValue(field, value);
                          }}
                          addUpdateFile={(field, value) => {
                            setIsEdited(true);
                            addUpdateFile(field, value, props);
                          }}
                        />
                      </IdentificationDetailSection>
                    )}
                  </CardContent>
                  <CardFooter>
                    <ProfileFormFooter
                      nextstep={nextstep}
                      handleSubmit={() => {
                        props.handleSubmit();
                      }}
                      prevStep={prevStep}
                      isEditMode={isEditMode}
                      isEdited={isEdited}
                      enableBackButton={true}
                    />
                  </CardFooter>
                </Card>
              </form>
            )}
          </Formik>
        </div>
      )}
    </>
  );
};

const IdentificationDetailSection = forwardRef(({ title, children }, ref) => {
  return (
    <div>
      <h6 className="text-base text-neutral-1200 my-4">{title}</h6>
      <div className="space-y-4 mb-5">
        <div className="grid grid-cols-2 gap-4">{children}</div>
      </div>
    </div>
  );
});

export default IdentificationInformation;
