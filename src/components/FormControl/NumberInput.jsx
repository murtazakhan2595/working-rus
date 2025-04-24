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
    step = 1,
    placeholder,
    autoComplete = "off",
    className = "w-full",
  }) => {
    const handleChange = (event) => {
      const inputValue = event.target.value;
      // Allow only digits and decimal point
      if (/^\d*\.?\d*$/.test(inputValue) || inputValue === "") {
        onChange(name, inputValue);
      }
    };

    const handleBlur = () => {
      let numericValue = parseFloat(value);
      if (isNaN(numericValue)) return;

      if (min !== undefined && numericValue < min) {
        numericValue = min;
      }

      if (max !== undefined && numericValue > max) {
        numericValue = max;
      }

      // Enforce step rounding if step is defined
      if (step && step !== "any") {
        numericValue = Math.round(numericValue / step) * step;
      }

      onChange(name, numericValue.toString());
    };

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
          id={name}
          name={name}
          maxLength={"1000"}
          autoComplete={autoComplete}
          placeholder={placeholder || `Enter ${label || "value"}`}
          value={value ?? ""}
          disabled={disabled}
          className={error && touch ? InvalidInput : "text-neutral-1000"}
          onChange={handleChange}
          // onBlur={handleBlur}
          inputMode="decimal"
        />
      </FormField>
    );
  }
);

export default NumberInput;
