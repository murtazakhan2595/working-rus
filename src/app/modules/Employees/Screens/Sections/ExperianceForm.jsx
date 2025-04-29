import {
  DateInput,
  TextAreaInput,
  TextInput,
  CheckBoxInput,
  CoverFileUpload,
} from "components/FormControl";
import React, { useState } from "react";

const Experience = ({
  errors,
  touched,
  values,
  onChange,
  isCurrentExperience,
}) => {
  const [date, setDate] = useState(new Date());
  return (
    <>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <TextInput
              name={"exp_organization"}
              error={errors?.exp_organization}
              touch={touched?.exp_organization}
              value={values?.exp_organization}
              label={"Company Name"}
              required={true}
              onChange={(field, value) => {
                onChange(field, value);
              }}
            />
          </div>
          <div className="space-y-2">
            <TextInput
              name={"exp_designation"}
              error={errors?.exp_designation}
              touch={touched?.exp_designation}
              value={values?.exp_designation}
              label={"Position"}
              required={true}
              onChange={(field, value) => {
                onChange(field, value);
              }}
            />
          </div>

          <div className="space-y-2">
            <DateInput
              name={"exp_start_date"}
              error={errors?.exp_start_date}
              touch={touched?.exp_start_date}
              value={values?.exp_start_date}
              label={"Start Date"}
              required={true}
              onChange={(field, value) => {
                onChange(field, value);
              }}
            />
          </div>
          {!values.disableEndDate && !isCurrentExperience && (
            <div className="space-y-2">
              <DateInput
                name={"exp_end_date"}
                error={errors?.exp_end_date}
                touch={touched?.exp_end_date}
                value={values?.exp_end_date}
                label={"End Date"}
                required={true}
                onChange={(field, value) => {
                  onChange(field, value);
                }}
              />
            </div>
          )}
          <div className="flex items-center space-y-2">
            <CheckBoxInput
              name={"disableEndDate"}
              value={values.disableEndDate || isCurrentExperience}
              label={"Currently Working Here"}
              disabled={isCurrentExperience}
              onChange={(field, value) => {
                onChange(field, value);
                onChange("exp_end_date", '');
              }}
            />
          </div>

          <div className="col-span-2 space-y-2">
            <TextAreaInput
              name={"exp_discription"}
              error={errors?.exp_discription}
              touch={touched?.exp_discription}
              value={values?.exp_discription}
              label={"Responsibilities"}
              required={true}
              onChange={(field, value) => {
                onChange(field, value);
              }}
              maxRows={4}
              maxLength={'700'}
            />
          </div>
          <div className="col-span-2 space-y-2">
            <CoverFileUpload
              name="exp_letter"
              label={`${
                isCurrentExperience || values.disableEndDate
                  ? "Upload Resume"
                  : "Experience Letter"
              } or drag it here`}
              acceptType=".pdf"
              error={errors?.exp_letter}
              touch={touched?.exp_letter}
              value={values?.exp_letter}
              required={isCurrentExperience || values.disableEndDate}
              onChange={(field, value) => {
                onChange(field, value);
                if (isCurrentExperience) {
                  onChange("resume", value);
                } else {
                  onChange("resume", null);
                }
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Experience;
