import React, { useState, useCallback } from "react";
import { ChevronsUpDown } from "lucide-react";
import {
  SelectableOptionsList,
  SelectedOptionsList,
  DropdownIcon,
} from "components/FormControl/InputSelect";
import {
  FormField,
  FormPopoverButton,
  FormFieldIcon,
  FormPlaceholder,
} from "components/FormControl";

const SelectMultiInputComponent = React.memo(
  ({
    name,
    options, // List of selectable options
    error,
    touch,
    value = [], // Current selected values
    label = null, // Label for the select field
    onChange, // Function to handle selection change
    required = false, // Whether the field is required
    className = "w-full", // Custom styling
    icon, // Optional icon inside the button
    useValueAsIdentifier = true, // Determines if value or label is used for selection
    allowNewOption = false, // Whether users can add new options
    newOptionConfig = {}, // Configuration for new options
    showOptionsActions = false, // Show additional actions for options
    optionsActions = [], // List of action buttons for options
    placeholder = null, // Placeholder text when no value is selected
    selectedOptionClassName = "", // Add custom style to value labels
    selectedOptionListClassName = "", // Add custom style to value labels List
    showSelectedValuesBelow = false, // Show selected values below the dropdown (Generalized name)
    disabled=false,
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedValues = value && Array.isArray(value) ? value : [];

    // Toggle selection for a given option
    const handleSelectionToggle = useCallback(
      (optionValue) => {
        const updatedSelection = selectedValues.includes(optionValue)
          ? selectedValues.filter((item) => item !== optionValue)
          : [...selectedValues, optionValue];

        onChange(name, updatedSelection);
      },
      [selectedValues, onChange, name]
    );

    // Remove a selected value
    const handleRemove = useCallback(
      (option) => {
        const newValue = value.filter((item) => item !== option);
        onChange(name, newValue);
      },
      [value, onChange, name]
    );

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
        <FormPopoverButton
          open={isOpen}
          setOpen={setIsOpen}
          disabled={disabled}
          triggerContent={
            <div className="flex justify-start w-full gap-2 items-center">
              <FormFieldIcon icon={icon} />
              {selectedValues.length > 0 && !showSelectedValuesBelow ? (
                <SelectedOptionsList
                  selectedValues={selectedValues}
                  useValueAsIdentifier={useValueAsIdentifier}
                  options={options}
                  handleRemove={handleRemove}
                  selectedOptionClassName={selectedOptionClassName}
                  selectedOptionListClassName={selectedOptionListClassName}
                />
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
              selectedValues={selectedValues}
              handleSelectionToggle={handleSelectionToggle}
              showOptionsActions={showOptionsActions}
              optionsActions={optionsActions}
              allowNewOption={allowNewOption}
              newOptionConfig={newOptionConfig}
            />
          }
        />
        {/* Show Selected Values Below if Enabled */}
        {showSelectedValuesBelow && selectedValues.length > 0 && (
          <SelectedOptionsList
            selectedValues={selectedValues}
            useValueAsIdentifier={useValueAsIdentifier}
            options={options}
            handleRemove={handleRemove}
            selectedOptionClassName={selectedOptionClassName}
            selectedOptionListClassName={selectedOptionListClassName}
          />
        )}
      </FormField>
    );
  }
);

export { SelectMultiInputComponent };
