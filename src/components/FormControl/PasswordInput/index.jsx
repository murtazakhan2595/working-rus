import React from "react";
import { Input } from "components/ui/input";
import { FormField, InvalidInput } from "components/FormControl";
const PasswordInput = React.memo(
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
          type="password"
          maxLength={maxLength || 20}
          id={name}
          name={name}
          autoComplete="new-password"
          placeholder={placeholder || `Enter ${label || "value"}`}
          value={value ?? ""}
          disabled={disabled}
          className={error && touch ? InvalidInput : ""}
          onChange={onChange}
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
export default PasswordInput;
