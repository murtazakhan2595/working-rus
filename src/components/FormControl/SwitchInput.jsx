import React from "react";
import { FormField } from "components/FormControl";
import { Switch } from "src/@/components/ui/switch";

const SwitchInput = React.memo(
  ({
    name,
    value,
    error,
    touch,
    onChange,
    label,
    disabled,
    required,
    className = "w-full", // Custom styling
    description, // Optional description text
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
        <div className="flex items-center space-x-2">
          <Switch
            id={name}
            name={name}
            checked={value ?? false}
            onCheckedChange={(checked) => onChange(name, checked)}
            disabled={disabled}
          />
          {description && (
            <label htmlFor={name} className="text-sm text-muted-1100">
              {description}
            </label>
          )}
        </div>
      </FormField>
    );
  }
);

export default SwitchInput;
