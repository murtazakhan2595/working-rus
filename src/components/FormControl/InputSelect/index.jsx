import React, { useState, useCallback } from "react";
import { Label } from "src/@/components/ui/label";
import { Button } from "components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "src/@/components/ui/popover";
import { ChevronsUpDown, Check, CircleX } from "lucide-react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "src/@/components/ui/command";

const SelectMultiInputComponent = React.memo(
  ({
    name,
    options, // List of selectable options
    error,
    touch,
    value = [], // Current selected values
    label, // Label for the select field
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
    allowMultipleSelection = false, // Allow multiple selections (Generalized name)
    showSelectedValuesBelow = false, // Show selected values below the dropdown (Generalized name)
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
      <div className={`${className} flex flex-col gap-4`}>
        {/* Field Label */}
        {label && (
          <Label htmlFor={name}>
            {required && <span className="text-red-600">* </span>}
            {label}
          </Label>
        )}

        {/* Dropdown Button */}
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={isOpen}
              className="flex-wrap justify-between w-full rounded-sm h-fit border-neutral-500 hover:border-primary-200 hover:shadow-none hover:text-primary-1100 hover:bg-primary-200"
            >
              <div className="flex justify-start w-full gap-2">
                {icon && <div className="w-4">{icon}</div>}

                <div className="flex flex-wrap gap-2 items-center max-w-[90%]">
                  {selectedValues.length > 0 && !showSelectedValuesBelow ? (
                    <SelectedOptionsList
                      selectedValues={selectedValues}
                      useValueAsIdentifier={useValueAsIdentifier}
                      options={options}
                      handleRemove={handleRemove}
                    />
                  ) : (
                    <span className="text-sm font-normal text-neutral-1000">
                      {placeholder ? placeholder : `Select ${label}`}
                    </span>
                  )}
                </div>
                <ChevronsUpDown className="w-4 h-4 ml-2 ml-auto opacity-50 shrink-0" />
              </div>
            </Button>
          </PopoverTrigger>

          {/* Dropdown Content */}
          <PopoverContent className="w-[300px] p-0">
            <SelectableOptionsList
              options={options}
              selectedValues={selectedValues}
              handleSelectionToggle={handleSelectionToggle}
              showOptionsActions={showOptionsActions}
              optionsActions={optionsActions}
            />
            {/* Add New Option Button */}
            {allowNewOption && (
              <div className="my-3 px-8">
                <Button
                  key="add-new-option"
                  onClick={(e) => {
                    e.preventDefault();
                    newOptionConfig.onClick();
                  }}
                  className="w-full"
                  size="sm"
                >
                  {newOptionConfig.buttonValue}
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>

        {/* Show Selected Values Below if Enabled */}
        {showSelectedValuesBelow && (
          <div className="flex fex-row flex-wrap gap-2 items-center max-w-[90%]">
            <SelectedOptionsList
              selectedValues={selectedValues}
              useValueAsIdentifier={useValueAsIdentifier}
              options={options}
              handleRemove={handleRemove}
            />
          </div>
        )}

        {/* Error Message Display */}
        {error && touch && <div className="text-red-600 text-sm">{error}</div>}
      </div>
    );
  }
);

/**
 * Component to Display Selected Options.
 * It supports removing selected options.
 */
const SelectedOptionsList = ({
  selectedValues = [],
  useValueAsIdentifier = true,
  options = [],
  handleRemove = () => {},
}) => {
  return selectedValues.map((val) =>
    useValueAsIdentifier ? (
      <span
        key={val}
        className="bg-plum-300 text-plum-800 text-xs font-semibold px-2.5 py-0.5 rounded-lg flex items-center max-w-[100%] overflow-hidden"
      >
        {options.find((opt) => opt.value === val)?.label}
        <CircleX
          className="ml-1 text-red-700 cursor-pointer"
          size={16}
          onClick={(e) => {
            e.stopPropagation();
            handleRemove(val);
          }}
        />
      </span>
    ) : (
      options.find((opt) => opt.value === val)?.label
    )
  );
};

/**
 * Component to Render Selectable Options in the Dropdown.
 * Allows selection/deselection of items.
 */
const SelectableOptionsList = ({
  options = [],
  selectedValues = [],
  handleSelectionToggle = () => {},
  showOptionsActions = false,
  optionsActions = [],
}) => {
  return (
    <Command>
      <CommandInput
        placeholder="Search options..."
        className="text-sm font-normal text-neutral-900"
      />
      <CommandList>
        <CommandEmpty>No options found.</CommandEmpty>
        <CommandGroup>
          {options.map(({ value, label }) => (
            <CommandItem
              key={value}
              onSelect={() => handleSelectionToggle(value)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <Check
                    className={`mr-2 h-4 w-4 min-w-4 ${
                      selectedValues.includes(value)
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  />
                  {label}
                </div>

                {/* Additional Actions for Each Option */}
                {showOptionsActions && (
                  <div className="flex">
                    {optionsActions.map(({ content, onClick }, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className={`w-10 h-4`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onClick?.(value);
                        }}
                      >
                        {content}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export { SelectMultiInputComponent };
