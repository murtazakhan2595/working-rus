import React from "react";

import { countriesList } from "data/Data.js";
import {
  DateInput,
  SelectInputComponent,
  TextInput,
  CoverFileUpload,
} from "components/FormControl";

const IDDetails = ({
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
          name={"living_country_id_no"}
          error={errors.living_country_id_no}
          touch={touched.living_country_id_no}
          value={values.living_country_id_no}
          label={"Living Country ID No"}
          required={true}
          onChange={(field, value) => {
            onChange(field, value);
          }}
        />
      </div>
      <div className="space-y-2">
        <SelectInputComponent
          name="place_of_issuance"
          options={countriesList}
          value={values.place_of_issuance}
          error={errors.place_of_issuance}
          touch={touched.place_of_issuance}
          label="Select Country"
          required={true}
          onChange={(field, value) => {
            onChange(field, value);
          }}
        />
      </div>
      <div className="space-y-2">
        <DateInput
          name={"id_issuance_date"}
          error={errors.id_issuance_date}
          touch={touched.id_issuance_date}
          value={values.id_issuance_date}
          label={"ID Issuance Date"}
          required={true}
          onChange={(field, value) => {
            onChange(field, value);
          }}
        />
      </div>
      <div className="space-y-2">
        <DateInput
          name={"id_expiry_date"}
          error={errors.id_expiry_date}
          touch={touched.id_expiry_date}
          value={values.id_expiry_date}
          label={"ID Expiry Date"}
          required={true}
          onChange={(field, value) => {
            onChange(field, value);
          }}
        />
      </div>
      <div className="space-y-2">
        <CoverFileUpload
          name={"id_front"}
          error={errors?.id_front}
          touch={touched?.id_front}
          value={values?.id_front?.document}
          label={"ID Front"}
          required={true}
          onChange={(field, value) => {
            addUpdateFile(field, value);
          }}
        />
      </div>
      <div className="space-y-2">
        <CoverFileUpload
          name={"id_back"}
          error={errors?.id_back}
          touch={touched?.id_back}
          value={values?.id_back?.document}
          label={"ID Back"}
          required={true}
          onChange={(field, value) => {
            addUpdateFile(field, value);
          }}
        />
      </div>
    </>
  );
};

export default IDDetails;
