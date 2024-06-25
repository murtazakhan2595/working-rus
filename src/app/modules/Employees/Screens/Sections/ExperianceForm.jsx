import React from "react";
import { Col } from "reactstrap";
import {
  FileInput,
  DateInput,
  TextAreaInput,
  TextInput,
  CheckBoxInput
} from "components/form-control";

const Experience = ({ errors, touched, values, onChange }) => {

  return (
    <>
      <Col md="6">
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
      </Col>
      <Col md="6">
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
      </Col>

      <Col md={6}>
        <DateInput
          name={"exp_start_date"}
          error={errors?.exp_start_date}
          touch={touched?.exp_start_date}
          value={values?.exp_start_date}
          label={"Start Date"}
          onChange={(field, value) => {
            onChange(field, value);
          }}
        />
      </Col>
      <Col md={6}>
        <CheckBoxInput
          name={"disableEndDate"}
          value={values.disableEndDate}
          label={"Currently Working Here"}
          onChange={(field, value) => {
            onChange(field, value);
            // if (value) {
            //   onChange("exp_end_date", null);
            // }
          }}
        />
      </Col>
      {!values.disableEndDate && (
        <Col md={6}>
          <DateInput
            name={"exp_end_date"}
            error={errors?.exp_end_date}
            touch={touched?.exp_end_date}
            value={values?.exp_end_date}
            label={"End Date"}
            onChange={(field, value) => {
              onChange(field, value);
            }}
          />
        </Col>
      )}
      <Col md="12">
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
        />
      </Col>
      <Col md="12">
        <FileInput
          name="exp_letter"
          label="Experience Letter or drag it here"
          acceptType=".pdf"
          error={errors?.exp_letter}
          touch={touched?.exp_letter}
          value={values?.exp_letter}
          required={true}
          onChange={(field, value) => {
            onChange(field, value);
          }}
        />
      </Col>
    </>
  );
};

export default Experience;
