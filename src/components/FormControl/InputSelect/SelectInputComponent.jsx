import React, { useState, useCallback } from "react";
import { ChevronsUpDown } from "lucide-react";
import {
  SelectableOptionsList,
  DropdownIcon,
} from "components/FormControl/InputSelect";
import {
  FormField,
  FormPopoverButton,
  FormPlaceholder,
  FormFieldIcon,
} from "components/FormControl";

const SelectInputComponent = React.memo(
  ({
    name,
    options, // List of selectable options
    error,
    touch,
    value = null, // Current selected values
    label = null, // Label for the select field
    onChange, // Function to handle selection change
    required = false, // Whether the field is required
    className = "w-full", // Custom styling
    icon, // Optional icon inside the button
    allowNewOption = false, // Whether users can add new options
    newOptionConfig = {}, // Configuration for new options
    showOptionsActions = false, // Show additional actions for options
    optionsActions = [], // List of action buttons for options
    placeholder = null, // Placeholder text when no value is selected
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    // Toggle selection for a given option
    const handleSelectionToggle = useCallback(
      (optionValue) => {
        const newValue =
          optionValue === value || (optionValue === null && value === null)
            ? ""
            : optionValue;
        setIsOpen(false);
        onChange(name, newValue);
      },
      [onChange, name]
    );

    return (
      <FormField
        name={name}
        label={label}
        required={required}
        error={error}
        touched={touch}
        className={className}
      >
        <FormPopoverButton
          open={isOpen}
          setOpen={setIsOpen}
          triggerContent={
            <div className="flex justify-start w-full gap-2 items-center">
              <FormFieldIcon icon={icon} />
              {value ? (
                options.find((option) => option.value == value)?.label
              ) : (
                <FormPlaceholder
                  placeholder={placeholder ? placeholder : `Select ${label}`}
                />
              )}
              <DropdownIcon />
            </div>
          }
          popoverContent={
            <SelectableOptionsList
              options={options}
              selectedValues={[value]}
              handleSelectionToggle={handleSelectionToggle}
              showOptionsActions={showOptionsActions}
              optionsActions={optionsActions}
              allowNewOption={allowNewOption}
              newOptionConfig={newOptionConfig}
            />
          }
        />
      </FormField>
    );
  }
);

export { SelectInputComponent };
