import React from "react";

import { countriesList } from "data/Data.js";
import {
  DateInput,
  SelectInputComponent,
  TextInput,
  CoverFileUpload,
} from "components/FormControl";

const InsuranceDetails = ({
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
          name={"dha_id"}
          error={errors.dha_id}
          touch={touched.dha_id}
          value={values.dha_id}
          label={"DHA ID"}
          required={true}
          onChange={(field, value) => {
            onChange(field, value);
          }}
        />
      </div>
      <div className="space-y-2">
        <TextInput
          name={"card_number"}
          error={errors.card_number}
          touch={touched.card_number}
          value={values.card_number}
          label={"Card Number"}
          required={true}
          onChange={(field, value) => {
            onChange(field, value);
          }}
        />
      </div>
      <div className="space-y-2">
        <TextInput
          name={"insurance_policy"}
          error={errors.insurance_policy}
          touch={touched.insurance_policy}
          value={values.insurance_policy}
          label={"Insurance Policy"}
          required={true}
          onChange={(field, value) => {
            onChange(field, value);
          }}
        />
      </div>

      <div className="space-y-2">
        <DateInput
          name={"insurance_active_date"}
          error={errors.insurance_active_date}
          touch={touched.insurance_active_date}
          value={values.insurance_active_date}
          label={"Insurance Active Date"}
          onChange={(field, value) => {
            onChange(field, value);
          }}
        />
      </div>
      <div className="space-y-2">
        <DateInput
          name={"insurance_expiry_date"}
          error={errors.insurance_expiry_date}
          touch={touched.insurance_expiry_date}
          value={values.insurance_expiry_date}
          label={"Insurance Expiry Date"}
          onChange={(field, value) => {
            onChange(field, value);
          }}
        />
      </div>
      <div className="space-y-2">
        <TextInput
          name={"insurance_company"}
          error={errors.insurance_company}
          touch={touched.insurance_company}
          value={values.insurance_company}
          label={"Insurance Company"}
          required={true}
          onChange={(field, value) => {
            onChange(field, value);
          }}
        />
      </div>
      <div className="space-y-2">
        <CoverFileUpload
          name={"insurance_card"}
          error={errors?.insurance_card}
          touch={touched?.insurance_card}
          value={values?.insurance_card?.document}
          label={"Insurance Card"}
          required={true}
          onChange={(field, value) => {
            addUpdateFile(field, value);
          }}
        />
      </div>
    </>
  );
};

export default InsuranceDetails;
