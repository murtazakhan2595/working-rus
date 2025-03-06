import React from "react";

import { countriesList } from "data/Data.js";
import {
  DateInput,
  SelectInputComponent,
  TextInput,
  CoverFileUpload,
} from "components/FormControl";

const DrivingLicenseDetails = ({
  errors = {},
  touched = {},
  values = {},
  onChange = () => {},
  addUpdateFile = () => {},
}) => {
  return (
    <>
      <div className="space-y-2">
        <TextInput
          name={"license_number"}
          error={errors.license_number}
          touch={touched.license_number}
          value={values.license_number}
          label={"License Number"}
          required={true}
          onChange={(field, value) => {
            onChange(field, value);
          }}
        />
      </div>
      <div className="space-y-2">
        <SelectInputComponent
          name="license_Issuance_Country"
          options={countriesList}
          value={values.license_Issuance_Country}
          error={errors.license_Issuance_Country}
          touch={touched.license_Issuance_Country}
          label="License Issuance Country"
          required={true}
          onChange={(field, value) => {
            onChange(field, value);
          }}
        />
      </div>
      <div className="space-y-2">
        <DateInput
          name={"license_Issuance_Date"}
          error={errors.license_Issuance_Date}
          touch={touched.license_Issuance_Date}
          value={values.license_Issuance_Date}
          label={"License Issuance Date"}
          required={true}
          onChange={(field, value) => {
            onChange(field, value);
          }}
        />
      </div>
      <div className="space-y-2">
        <DateInput
          name={"license_Expiry_Date"}
          error={errors.license_Expiry_Date}
          touch={touched.license_Expiry_Date}
          value={values.license_Expiry_Date}
          label={"License Expiry Date"}
          required={true}
          onChange={(field, value) => {
            onChange(field, value);
          }}
        />
      </div>
      <div className="space-y-2 col-span-2">
        <CoverFileUpload
          name={"license_copy"}
          error={errors?.license_copy}
          touch={touched?.license_copy}
          value={values?.license_copy?.document}
          label={"License Copy"}
          required={true}
          onChange={(field, value) => {
            addUpdateFile(field, value);
          }}
        />
      </div>
    </>
  );
};

export default DrivingLicenseDetails;
