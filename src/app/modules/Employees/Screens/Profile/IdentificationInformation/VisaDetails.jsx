import React, { useState, useEffect } from "react";

import { countriesList,visaOptions } from "data/Data.js";
import {
  DateInput,
  SelectInputComponent,
  TextInput,
  CoverFileUpload,
} from "components/FormControl";
import PageLoader from "components/PageLoader.jsx";

const VisaDetails = ({
  isLoading = false,
  errors = {},
  touched = {},
  values = {},
  onChange = () => {},
  addUpdateFile = () => {},
}) => {
  return isLoading ? (
    <div className="space-y-4">
      <PageLoader />
    </div>
  ) : (
    <>
      <div className="col-span-2 space-y-2">
        <TextInput
          name={"entry_permit_number"}
          error={errors.entry_permit_number}
          touch={touched.entry_permit_number}
          value={values.entry_permit_number}
          label={"Entry Permit Number"}
          required={true}
          onChange={(field, value) => {
            onChange(field, value);
          }}
        />
      </div>
      <div className="space-y-2">
        <SelectInputComponent
          name={"country_of_visa_issuance"}
          value={values.country_of_visa_issuance}
          options={countriesList}
          error={errors.country_of_visa_issuance}
          touch={touched.country_of_visa_issuance}
          label={"Visa Issuance Country"}
          onChange={(field, value) => {
            onChange(field, value);
          }}
        />
      </div>
      <div className="space-y-2">
        <TextInput
          name={"uid_number"}
          error={errors.uid_number}
          touch={touched.uid_number}
          value={values.uid_number}
          label={"UID Number"}
          required={true}
          onChange={(field, value) => {
            onChange(field, value);
          }}
          regEx={/^[0-9]+$/}
        />
      </div>
      <div className="space-y-2">
        <SelectInputComponent
          name={"visa_type"}
          options={visaOptions}
          error={errors.visa_type}
          touch={touched.visa_type}
          value={values.visa_type}
          label={"Visa Type"}
          onChange={(field, value) => {
            onChange(field, value);
          }}
        />
      </div>
      <div className="space-y-2">
        <TextInput
          name={"visa_duration"}
          error={errors.visa_duration}
          touch={touched.visa_duration}
          value={values.visa_duration}
          label={"Visa Duration"}
          required={true}
          onChange={(field, value) => {
            onChange(field, value);
          }}
        />
      </div>
      <div className="space-y-2">
        <DateInput
          name={"visa_issuance_date"}
          error={errors.visa_issuance_date}
          touch={touched.visa_issuance_date}
          value={values.visa_issuance_date}
          label={"Visa Issuance Date"}
          onChange={(field, value) => {
            onChange(field, value);
          }}
        />
      </div>
      <div className="space-y-2">
        <DateInput
          name={"visa_expiry_date"}
          error={errors.visa_expiry_date}
          touch={touched.visa_expiry_date}
          value={values.visa_expiry_date}
          label={"Visa Expiry Date"}
          onChange={(field, value) => {
            onChange(field, value);
          }}
        />
      </div>

      <div className="space-y-2">
        <DateInput
          name={"visa_country_entry_date"}
          error={errors.visa_country_entry_date}
          touch={touched.visa_country_entry_date}
          value={values.visa_country_entry_date}
          label={"Visa Country Entry Date"}
          onChange={(field, value) => {
            onChange(field, value);
          }}
        />
      </div>
      <div className="space-y-2">
        <DateInput
          name={"visa_country_exit_date"}
          error={errors.visa_country_exit_date}
          touch={touched.visa_country_exit_date}
          value={values.visa_country_exit_date}
          label={"Visa Country Exit Date"}
          onChange={(field, value) => {
            onChange(field, value);
          }}
        />
      </div>
      <div className="space-y-2">
        <CoverFileUpload
          name={"enter_permit"}
          error={errors?.enter_permit}
          touch={touched?.enter_permit}
          value={values?.enter_permit?.document}
          label={"Entery Permit"}
          required={true}
          onChange={(field, value) => {
            addUpdateFile(field, value);
          }}
        />
      </div>

      <div className="space-y-2">
        <CoverFileUpload
          name={"visa_page"}
          error={errors?.visa_page}
          touch={touched?.visa_page}
          value={values?.visa_page?.document}
          label={"Visa Page"}
          required={true}
          onChange={(field, value) => {
            addUpdateFile(field, value);
          }}
        />
      </div>
      <div className="space-y-2">
        <CoverFileUpload
          name={"medical"}
          error={errors?.medical}
          touch={touched?.medical}
          value={values?.medical?.document}
          label={"Medical Result"}
          required={true}
          onChange={(field, value) => {
            addUpdateFile(field, value);
          }}
        />
      </div>
      <div className="space-y-2">
        <CoverFileUpload
          name={"id_application"}
          error={errors?.id_application}
          touch={touched?.id_application}
          value={values?.id_application?.document}
          label={"ID Application"}
          required={true}
          onChange={(field, value) => {
            addUpdateFile(field, value);
          }}
        />
      </div>
    </>
  );
};

export default VisaDetails;
