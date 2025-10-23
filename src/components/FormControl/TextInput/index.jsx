import React from "react";
import { Input } from "components/ui/input";
import { FormField, InvalidInput } from "components/FormControl";
import { ValidationRegEx } from 'app/utils/Types/ValidationPattern';
const TextInput = React.memo(
  ({
    name,
    value,
    error,
    touch,
    onChange,
    label,
    disabled,
    onBlur,
    required,
    regEx,
    maxLength,
    placeholder,
    autoComplete = "new-password",
    className = "w-full", // Custom styling
    description,
  }) => {
    return (
      <FormField
        name={name}
        label={label}
        required={required}
        error={error}
        touched={touch}
        className={`${className}`}
        disabled={disabled}
        field_description={description}
      >
        <Input
          type="text"
          maxLength={maxLength ?? "100"}
          id={name}
          name={name}
          autoComplete={autoComplete} // Use "off" for no autocomplete or specify a valid autocomplete token like "name", "email", etc.
          placeholder={placeholder || `Enter ${label || "value"}`}
          value={value ?? ""}
          disabled={disabled}
          className={error && touch ? InvalidInput : "text-neutral-1000"}
          onChange={(event) => {
            const inputValue = event.target.value;
            if (regEx) {
              const REGEX = ValidationRegEx[regEx] ?? regEx;
              if (!inputValue || REGEX.test(inputValue)) {
                onChange(name, inputValue);
              }
            } else {
              onChange(name, inputValue);
            }
          }}
          onBlur={(event) => {
            if (onBlur) {
              onBlur(event);
            }
          }}
        />
      </FormField>
    );
  }
);
export default TextInput;
