import React from "react";
import { Input } from "components/ui/input";
import { FormField, InvalidInput } from "components/FormControl";

const TextAreaInput = React.memo(
  ({
    regEx,
    maxLength,
    maxRows,
    onBlur,
    name,
    value,
    error,
    touch,
    onChange = () => {},
    label,
    placeholder,
    disabled,
    required,
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
          type="textarea"
          maxLength={maxLength ?? "5000"}
          id={name}
          name={name}
          autoComplete="new-password"
          placeholder={placeholder || `Enter ${label || "value"}`}
          value={value || ""}
          rows={maxRows ?? 3}
          disabled={disabled}
          className={`h-auto ${error && touch ? InvalidInput : ""}`}
          onChange={(option) => {
            const value = option.target.value;
            if (regEx) {
              if (!value || regEx.test(value)) onChange(name, value);
            } else {
              onChange(name, value);
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
export default TextAreaInput;
