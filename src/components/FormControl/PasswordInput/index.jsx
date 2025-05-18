import React, { useState } from "react";
import { Input } from "components/ui/input";
import { FormField, InvalidInput } from "components/FormControl";
import { Button } from "components/ui/button";
import { Eye, EyeOff } from "lucide-react";
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
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const handleChangePasswordVisibility = (event) => {
      event.preventDefault();
      setIsPasswordVisible((prev) => !prev);
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
        <div className="relative">
          <Input
            type={isPasswordVisible ? "text" : "password"}
            maxLength={maxLength || 20}
            id={name}
            name={name}
            autoComplete="new-password"
            placeholder={placeholder || `Enter ${label || "value"}`}
            value={value ?? ""}
            disabled={disabled}
            className={error && touch ? InvalidInput : ""}
            onChange={(event) => {
              const inputValue = event.target.value;
              if (regEx) {
                if (!inputValue || regEx.test(inputValue)) {
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
          <Button
            type="button"
            onClick={handleChangePasswordVisibility}
            className={`absolute bottom-[0px] right-0 hover:bg-transparent hover:text-neutral-900 text-neutral-700`}
            variant="ghost"
          >
            {isPasswordVisible ? <Eye size={17} /> : <EyeOff size={17} />}
          </Button>
        </div>
      </FormField>
    );
  }
);
export default PasswordInput;
