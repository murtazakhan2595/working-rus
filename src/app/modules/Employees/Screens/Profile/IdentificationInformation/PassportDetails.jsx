import React from "react";

import { countriesList } from "data/Data.js";
import {
  DateInput,
  SelectInputComponent,
  TextInput,
  CoverFileUpload,
} from "components/FormControl";

const PassportDetails = ({
  errors = {},
  touched = {},
  values = {},
  onChange = () => {},
  addUpdateFile = () => {},
}) => {
  return (
    <>
      <div className="col-span-2 space-y-2">
        <TextInput
          name={"passport_number"}
          error={errors.passport_number}
          touch={touched.passport_number}
          value={values.passport_number}
          label={"Passport Number"}
          required={true}
          onChange={(field, value) => {
            onChange(field, value);
          }}
        />
      </div>
      <div className="space-y-2">
        <SelectInputComponent
          name={"Passport_Issuance_Country"}
          value={values.Passport_Issuance_Country}
          error={errors.Passport_Issuance_Country}
          touch={touched.Passport_Issuance_Country}
          options={countriesList}
          label={"Passport Issuance Country"}
          onChange={(field, value) => {
            onChange(field, value);
          }}
        />
      </div>
      <div className="space-y-2">
        <DateInput
          name={"Passport_Issuance_Date"}
          error={errors.Passport_Issuance_Date}
          touch={touched.Passport_Issuance_Date}
          value={values.Passport_Issuance_Date}
          label={"Issuance Date"}
          onChange={(field, value) => {
            onChange(field, value);
          }}
        />
      </div>
      <div className="space-y-2">
        <DateInput
          name={"Passport_Expiry_Date"}
          error={errors.Passport_Expiry_Date}
          touch={touched.Passport_Expiry_Date}
          value={values.Passport_Expiry_Date}
          label={"Expiry Date"}
          onChange={(field, value) => {
            onChange(field, value);
          }}
        />
      </div>
      <div className="space-y-2">
        <CoverFileUpload
          name={"passport_copy"}
          error={errors?.passport_copy}
          touch={touched?.passport_copy}
          value={values?.passport_copy?.document}
          label={"Passport Copy"}
          required={true}
          onChange={(field, value) => {
            addUpdateFile(field, value);
          }}
        />
      </div>
    </>
  );
};

export default PassportDetails;
