import React from "react";
import { Input } from "components/ui/input";
import { FormField, InvalidInput } from "components/FormControl";


const RegExEmail = /^[A-Za-z0-9.@._%+-]+$/;
const EmailInput = React.memo(
  ({
    name,
    value,
    error,
    touch,
    onChange,
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
          type="email"
          maxLength="100"
          id={name}
          name={name}
          autoComplete="new-password"
          placeholder={placeholder || `Enter ${label || "value"}`}
          value={value || ""}
          disabled={disabled}
          className={error && touch ? InvalidInput : ""}
          onChange={(option) => {
            const value = option.target.value;
            if (!value || RegExEmail.test(value)) onChange(name, value);
          }}
        />
      </FormField>
    );
  }
);
export default EmailInput;
