import React from "react";
import { Label } from "src/@/components/ui/label";
import { FormField, InvalidInput } from "components/FormControl";
import { RadioGroup, RadioGroupItem } from "src/@/components/ui/radio-group";
import { cn } from "src/@/lib/utils";
import { cva } from "class-variance-authority";

const buttonVariants = cva("", {
  variants: {
    variant: {
      default: "flex-row py-4",
      one_line: "flex-row",
      stacked: "flex-col",
      with_icons: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const RadioGroupInput = React.memo(
  ({
    name,
    value,
    error,
    onChange,
    touch,
    required = false,
    options,
    label,
    disabled,
    className = "w-full",
    variant = "one_line",
  }) => {
    const defaultValue = value;
    return (
      <FormField
        name={name}
        label={label}
        required={required}
        error={error}
        touched={touch}
        className={cn(buttonVariants({ variant, className }))}
        disabled={disabled}
      >
        <RadioGroup
          // defaultValue={options[0]?.value}
          value={defaultValue}
          onValueChange={(value) => {
            onChange(name, value);
          }}
        >
          <div className="flex items-center justify-start gap-6">
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.value}
                  id={option.value}
                  disabled={disabled}
                />
                <Label htmlFor={option.value} className="font-normal">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </FormField>
    );
  }
);
export default RadioGroupInput;
