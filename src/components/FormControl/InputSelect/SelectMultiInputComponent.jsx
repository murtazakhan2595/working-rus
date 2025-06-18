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
import _ from "lodash";

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
    disabled = false,
    SelectAllOption = false,
    AllOptionVariant = "empty", // empty || all || all-searched
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedValues = value && Array.isArray(value) ? value : [];
    const DropdownList = React.useMemo(() => {
      if (!options || !Array.isArray(options) || options.length === 0)
        return [];
      if (!SelectAllOption) return options || [];

      const AllValue =
        AllOptionVariant === "all-searched"
          ? "all-values-in-search-options"
          : AllOptionVariant === "empty"
          ? "all-values-in-options"
          : null;
      return SelectAllOption
        ? [{ label: "All", value: AllValue }, ...(options || [])]
        : options || [];
    }, [SelectAllOption, options]);

    const SelectedValueLabel = React.useMemo(() =>
      SelectAllOption && (!selectedValues || selectedValues?.length === 0)
        ? "All"
        : selectedValues[(SelectAllOption, selectedValues)]
    );
    // Toggle selection for a given option
    const handleSelectionToggle = useCallback(
      (optionValue, inputSearchValue) => {
        debugger;
        if (optionValue === null) {
          onChange(name, null);
          return;
        }
        let updatedSelection = [];
        if (optionValue === "all-values-in-search-options") {
          const selected_list = inputSearchValue
            ? options.filter((obj) => obj.label.includes(inputSearchValue))
            : options;
          const values_list = selected_list.map((obj) => obj.value);
          updatedSelection = [...selectedValues, ...values_list];
        } else {
          updatedSelection = selectedValues.includes(optionValue)
            ? selectedValues.filter((item) => item !== optionValue)
            : [...selectedValues, optionValue];
        }
        const uniqueList = _.uniq(updatedSelection);
        onChange(name, uniqueList);
        return;
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
          invalidField={!!(error && touch)}
          triggerContent={
            <div className="flex justify-start w-full gap-2 items-center">
              <FormFieldIcon icon={icon} />
              {selectedValues.length > 0 && !showSelectedValuesBelow ? (
                <SelectedOptionsList
                  selectedValues={selectedValues}
                  useValueAsIdentifier={useValueAsIdentifier}
                  options={DropdownList}
                  handleRemove={handleRemove}
                  selectedOptionClassName={selectedOptionClassName}
                  selectedOptionListClassName={selectedOptionListClassName}
                />
              ) : SelectAllOption ? (
                SelectedValueLabel
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
              options={DropdownList}
              selectedValues={selectedValues}
              handleSelectionToggle={handleSelectionToggle}
              showOptionsActions={showOptionsActions}
              optionsActions={optionsActions}
              allowNewOption={allowNewOption}
              newOptionConfig={newOptionConfig}
              showAllOption={Boolean(AllOptionVariant === "all-searched")}
            />
          }
        />
        {/* Show Selected Values Below if Enabled */}
        {showSelectedValuesBelow && selectedValues.length > 0 && (
          <SelectedOptionsList
            selectedValues={selectedValues}
            useValueAsIdentifier={useValueAsIdentifier}
            options={DropdownList}
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
