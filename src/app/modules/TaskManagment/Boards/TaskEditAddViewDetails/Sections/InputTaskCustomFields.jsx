import React, { useState, useEffect, useRef, memo } from "react";
import { TextInput, NumberInput } from "components/FormControl";
import { createDropdownOptions } from "utils/Lists";
import { SelectComponent } from "components/FormControl";
import { Checkbox } from "src/@/components/ui/checkbox";

const InputTaskCustomFields = ({
  CustomField,
  onChange = () => {},
  customFieldValues = [],
  name,
}) => {
  const field_type = CustomField?.field_data?.field_type;
  const field_name = CustomField?.field_data?.field_name;
  const field_value = customFieldValues.find(
    (obj) => obj.field === field_name
  )?.value || null;

  const handleOnChangeField = (field, value) => {
    // Create a shallow copy of customFieldValues to avoid directly mutating the original array
    const values = [...customFieldValues];

    // Check if the field already exists in the array
    const existingFieldIndex = values.findIndex((item) => item.field === field);

    if (existingFieldIndex !== -1) {
      // If the field exists, update its value
      values[existingFieldIndex].value = value;
    } else {
      // If the field doesn't exist, create a new object and push it into the array
      values.push({ field, value });
    }

    // Trigger the onChange callback to update the parent state or context
    onChange(name, values);
  };

  if (field_type === "INPUT_TEXT")
    return (
      <TextInput
        name={field_name}
        label={field_name}
        value={field_value}
        onChange={(field, value) => {
          handleOnChangeField(field, value);
        }}
      />
    );

  if (field_type === "INPUT_NUMBER")
    return (
      <NumberInput
        name={field_name}
        label={field_name}
        value={field_value}
        onChange={(field, value) => {
          handleOnChangeField(field, value);
        }}
      />
    );
  if (field_type === "INPUT_NUMBER")
    return (
      <Checkbox
        checked={field_value}
        onCheckedChange={() => {
          handleOnChangeField(field_name, !field_value);
        }}
      />
    );

  if (field_type === "SELECT_DROPDOWN") {
    const Options = CustomField?.field_data?.value
      ? createDropdownOptions(CustomField?.field_data?.value)
      : [];
    return (
      <SelectComponent
        name={field_name}
        label={field_name}
        value={field_value}
        onChange={(field, value) => {
          handleOnChangeField(field, value);
        }}
        options={Options}
      />
    );
  }
};

export default memo(InputTaskCustomFields);
