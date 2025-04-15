import React from "react";
import { Input } from "components/ui/input";
import { FormField, InvalidInput } from "components/FormControl";

const NumberInput = React.memo(
  ({
    name,
    value,
    error,
    touch,
    onChange,
    label,
    disabled,
    required,
    min,
    max,
    step,
    placeholder,
    autoComplete = "new-password",
    className = "w-full", // Custom styling
  }) => {
    return (
      <FormField
        name={name}
        label={label}
        required={required}
        error={error}
        touched={touch}
        className={className}
        disabled={disabled}
      >
        <Input
          type="text"
          maxLength={"1000"}
          id={name}
          name={name}
          autoComplete={autoComplete} // Use "off" for no autocomplete or specify a valid autocomplete token like "name", "email", etc.
          placeholder={placeholder || `Enter ${label || "value"}`}
          value={value ?? ""}
          disabled={disabled}
          className={error && touch ? InvalidInput : "text-neutral-1000"}
          onChange={(event) => {
            const inputValue = event.target.value;
            if (/^\d*\.?\d*$/.test(inputValue) || inputValue === "") {
              onChange(name, inputValue);
            }
          }}
          min={min}
          max={max}
          step={step ?? "any"}
        />
      </FormField>
    );
  }
);
export default NumberInput;
