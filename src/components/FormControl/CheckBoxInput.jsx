import React from "react";
import { Input } from "components/ui/input";
import { FormField, InvalidInput } from "components/FormControl";
import { Checkbox } from "src/@/components/ui/checkbox";
import { cn } from "src/@/lib/utils";
const CheckBoxInput = React.memo(
  ({
    name,
    value,
    error,
    onChange,
    touch,
    required = false,
    label,
    disabled,
    className,
  }) => {
    return (
      <FormField
        name={name}
        label={label}
        required={required}
        error={error}
        touched={touch}
        className={cn("w-full flex-row-reverse justify-end gap-2", className)}
        disabled={disabled}
      >
        <Checkbox
          id={name}
          checked={value}
          onCheckedChange={() => {
            onChange(name, !value);
          }}
          disabled={disabled}
          className="w-4"
        />
      </FormField>
    );
  }
);
export default CheckBoxInput;
