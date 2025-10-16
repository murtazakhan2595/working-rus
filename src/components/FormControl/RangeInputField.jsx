

import React, { useState, useEffect } from "react";
import {
  FormField,
  FormPopoverButton,
  FormPlaceholder,
  FormFieldIcon,
  // InvalidInput,
  NumberInput,
} from "components/FormControl";
import { renderRange } from "utils/renderValues";

// Main RangeInputField Component
const RangeInputField = React.memo(
  ({
    name = null,
    label = null,
    required = false,
    error = null,
    touch = null,
    disabled = false,
    value = null,
    onChange = () => { },
    className = "w-full",
    description,
    placeholder,
    icon = null,
  }) => {
    const [minValue, setMinValue] = useState(null);
    const [maxValue, setMaxValue] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    // Convert value to internal date format
    useEffect(() => {
      if (value) {
        if (typeof value === "string") {
          const [min, max] = value.split(',');
          setMinValue(min);
          setMaxValue(max);
        }
      } else {
        handleReset(null);
      }
    }, [value]);

    const handleReset = (event) => {
      if (event) {
        event.stopPropagation();
        event.preventDefault();
        onChange(name, null);
        setIsOpen(false);
      }
      setMaxValue(null);
      setMinValue(null);
    };

    const handleChange = (min, max) => {
      onChange(name, [min || '0', max || '0'].join(','));
    }

    return (
      <FormField
        name={name}
        label={label}
        required={required}
        error={error}
        touched={touch}
        className={className}
        disabled={disabled}
        field_description={description}
      >
        <FormPopoverButton
          open={isOpen}
          setOpen={setIsOpen}
          className={!value ? "text-neutral-1000" : ""}
          invalidField={!!(error && touch)}
          disabled={disabled}
          triggerContent={
            <div className="flex justify-start w-full gap-2 items-center">
              {icon && <FormFieldIcon icon={<icon size={16} />} />}
              {value ? (
                <div className="flex justify-between items-center w-full">
                  <span className="text-neutral-1000">{renderRange(minValue, maxValue, '')}</span>
                  <span
                    className="text-sm text-neutral-900 hover:text-red-500 cursor-pointer ml-2 px-2 py-0.5 border border-neutral-200 rounded-md hover:bg-white transition-colors"
                    onClick={handleReset}
                  >
                    Reset
                  </span>
                </div>
              ) : (
                <FormPlaceholder
                  placeholder={placeholder || `Enter ${label || "Range"}`}
                />
              )}
            </div>
          }
          popoverContent={
            <div className="flex flex-col p-2">
              <div className="flex items-center justify-center gap-2">
                <NumberInput
                  placeholder={'Min'}
                  // className={`rounded-sm text-neutral-1000`}
                  name={'minValue'}
                  value={minValue}
                  onChange={(_, minvalue) => { handleChange(minvalue, maxValue) }}
                />
                <span className="text-neutral-1000">-</span>
                <NumberInput
                  placeholder={'Max'}
                  // className={`rounded-sm text-neutral-1000`}
                  name={'maxValue'}
                  value={maxValue}
                  onChange={(_, maxvalue) => { handleChange(minValue, maxvalue) }}
                />
              </div>
            </div>
          }
        />
      </FormField>
    );
  }
);

export default RangeInputField;