import React, { useState, useCallback } from "react";
import { Label } from "src/@/components/ui/label";
import { Button } from "components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "src/@/components/ui/popover";
import { ChevronsUpDown, Check } from "lucide-react";
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
    options,
    error,
    touch,
    value = [],
    label,
    onChange,
    required = false,
    className = "flex flex-col gap-4 w-full",
    icon,
    useValueAsIdentifier = true,
    allowNewOption = false,
    newOptionConfig = {},
    showOptionsActions = false,
    optionsActions = [],
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedValues = value && Array.isArray(value) ? value : [];
    // Handle selection toggle
    const handleSelectionToggle = useCallback(
      (optionValue) => {
        const updatedSelection = selectedValues.includes(optionValue)
          ? selectedValues.filter((item) => item !== optionValue)
          : [...selectedValues, optionValue];

        onChange(name, updatedSelection);
      },
      [selectedValues, onChange, name]
    );

    return (
      <div className={`${className} flex flex-col w-full`}>
        {/* Label */}
        {label && (
          <Label htmlFor={name}>
            {required && <span className="text-red-600">* </span>}
            {label}
          </Label>
        )}

        {/* Dropdown Trigger */}
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
                  {selectedValues.length > 0 ? (
                    selectedValues.map((val) =>
                      useValueAsIdentifier ? (
                        <span
                          key={val}
                          className="bg-plum-300 text-plum-800 text-xs font-semibold px-2.5 py-0.5 rounded-lg flex items-center max-w-[100%] overflow-hidden"
                        >
                          {options.find((opt) => opt.value === val)?.label}
                        </span>
                      ) : (
                        options.find((opt) => opt.value === val)?.label
                      )
                    )
                  ) : (
                    <span className="text-sm font-normal text-neutral-1000">
                      Select
                    </span>
                  )}
                </div>

                <ChevronsUpDown className="w-4 h-4 ml-2 ml-auto opacity-50 shrink-0" />
              </div>
            </Button>
          </PopoverTrigger>

          {/* Dropdown Content */}
          <PopoverContent className="w-[300px] p-0">
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

                        {/* Action Buttons */}
                        {showOptionsActions && (
                          <div className="flex">
                            {optionsActions.map(
                              ({ content, onClick }, index) => (
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
                              )
                            )}
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
          </PopoverContent>
        </Popover>

        {/* Error Message */}
        {error && touch && <div className="text-red-600 text-sm">{error}</div>}
      </div>
    );
  }
);

export { SelectMultiInputComponent };
