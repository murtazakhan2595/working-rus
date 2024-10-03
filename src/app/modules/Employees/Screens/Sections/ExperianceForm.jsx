

import {
  FileInput,
  DateInput,
  TextAreaInput,
  TextInput,
  CheckBoxInput
} from "components/form-control";
import React, { useEffect, useState } from "react";
import { Label } from "../../../../../src/@/components/ui/label";
import { Input } from "../../../../../components/ui/input";
import { Button } from "../../../../../components/ui/button";
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react";
import { Calendar } from '../../../../../src/@/components/ui/calendar';

const Experience = ({ errors, touched, values, onChange }) => {
  const [date, setDate] = useState(new Date());
  const [selectedValue, setSelectedValue] = useState('');
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
          {!values.disableEndDate && (
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
              value={values.disableEndDate}
              label={"Currently Working Here"}
              onChange={(field, value) => {
                onChange(field, value);
                // if (value) {
                //   onChange("exp_end_date", null);
                // }
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
              maxLength={1000}
            />
          </div>
          <div className="col-span-2 space-y-2">
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
          </div>
        </div>
      </div>
    </>
  );
};

export default Experience;
