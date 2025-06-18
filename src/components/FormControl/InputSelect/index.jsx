import React, { useState } from "react";
import { cn } from "src/@/lib/utils.js";
import { Check, X, ChevronsUpDown } from "lucide-react";
import { SelectMultiInputComponent } from "./SelectMultiInputComponent";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "src/@/components/ui/command";
import { Button } from "components/ui/button";
import { SelectInputComponent } from "./SelectInputComponent";

/**
 * Component to Display Selected Options.
 * It supports removing selected options.
 */
const SelectedOptionsList = ({
  selectedValues = [],
  useValueAsIdentifier = true,
  options = [],
  handleRemove = () => {},
  selectedOptionClassName = "",
  selectedOptionListClassName = "",
}) => {
  return (
    <div
      className={cn(
        "flex fex-row flex-wrap gap-2 items-center max-w-[90%]",
        selectedOptionListClassName
      )}
    >
      {selectedValues.map((val, index) =>
        useValueAsIdentifier ? (
          <div
            key={index}
            className={cn(
              "bg-neutral-300 text-neutral-1200 text-xs font-semibold px-2 py-1 rounded-lg flex items-center max-w-[100%] min-w-fit overflow-hidden",
              selectedOptionClassName
            )}
          >
            {options.find((opt) => opt.value === val)?.label}
            <X
              className="ml-1 text-neutral-1000 cursor-pointer"
              size={15}
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(val);
              }}
            />
          </div>
        ) : (
          options.find((opt) => opt.value === val)?.label
        )
      )}
    </div>
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
  allowNewOption = false, // Whether users can add new options
  newOptionConfig = {}, // Configuration for new options
  showAllOption = false, // retrict to show all option in dropdown even in case of search
}) => {
  const [inputSearchValue, setInputSearchValue] = useState(false);
  const OptionSelect = (value, selectedValues) => {
    if (selectedValues.length === 0 && value === null) return true;
    else if (selectedValues.includes(value)) return true;
    else return false;
  };

  const AllOption = showAllOption
    ? options.find((obj) => obj.label === "All")
    : null;
console.log(showAllOption , AllOption , inputSearchValue,'cbjhsbdcjhbsjb')
  return (
    <div className="w-[300px] p-0">
      <Command>
        <CommandInput
          placeholder="Search options..."
          className="text-sm font-normal text-neutral-900"
          onValueChange={(value) => setInputSearchValue(value)}
        />
        <CommandList>
          <CommandEmpty>No options found.</CommandEmpty>
          <CommandGroup>
            {showAllOption && AllOption && inputSearchValue && (
              <CommandItem
                key={AllOption.value}
                onSelect={() => handleSelectionToggle(AllOption.value, inputSearchValue)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <Check
                      className={`mr-2 h-4 w-4 min-w-4 ${
                        OptionSelect(AllOption.value, selectedValues)
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />
                    {AllOption.label}
                  </div>
                </div>
              </CommandItem>
            )}
            {options.map(({ value, label }) => (
              <CommandItem
                key={value}
                onSelect={() => handleSelectionToggle(value, inputSearchValue)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <Check
                      className={`mr-2 h-4 w-4 min-w-4 ${
                        OptionSelect(value, selectedValues)
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
    </div>
  );
};

const DropdownIcon = React.memo(({}) => {
  return (
    <ChevronsUpDown className="w-4 h-4 ml-2 ml-auto opacity-50 shrink-0" />
  );
});

export {
  SelectMultiInputComponent,
  SelectableOptionsList,
  SelectedOptionsList,
  SelectInputComponent,
  DropdownIcon,
};
