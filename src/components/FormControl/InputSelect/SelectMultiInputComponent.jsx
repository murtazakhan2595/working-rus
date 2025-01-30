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
    required,
    classes = "flex flex-col gap-4",
    icon,
    valueIdentifier = true,
    addNewOption = false,
    NewOptionButtonDetail = {
      buttonValue: "Add",
      onClick: () => {},
    },
  }) => {
    const [open, setOpen] = useState(false);

    const handleSelect = useCallback(
      (option) => {
        const newValue = value.includes(option)
          ? value.filter((item) => item !== option)
          : [...value, option];
        onChange(name, newValue);
      },
      [value, onChange, name]
    );

    const handleRemove = useCallback(
      (option) => {
        const newValue = value.filter((item) => item !== option);
        onChange(name, newValue);
      },
      [value, onChange, name]
    );

    return (
      <div className={classes}>
        {label && (
          <Label htmlFor={name}>
            {required && <span className="text-red-600">* </span>}
            {label}
          </Label>
        )}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="flex-wrap justify-between w-full rounded-sm h-fit border-neutral-500 hover:border-primary-200 hover:shadow-none hover:text-primary-1100 hover:bg-primary-200"
            >
              <div className="flex justify-start w-full gap-2">
                {icon && <div className="w-4">{icon}</div>}
                <div className="flex flex-wrap justify-start gap-2 items-center max-w-[95%]">
                  {value.length > 0 ? (
                    value.map((val) =>
                      valueIdentifier ? (
                        <span
                          key={val}
                          className="bg-plum-300 text-plum-800 text-xs font-semibold px-2.5 py-0.5 rounded-lg flex items-center max-w-[100%]"
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
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput
                placeholder="Search options..."
                className="text-sm font-normal text-neutral-900"
              />
              <CommandList>
                <CommandEmpty>No options found.</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      onSelect={() => handleSelect(option.value)}
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          value.includes(option.value)
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
            {addNewOption && (
              <div className="my-3 px-8">
                <Button
                  key={options.length + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    NewOptionButtonDetail.onClick();
                  }}
                   className={`w-full`}
                  size="sm"
                >
                  {NewOptionButtonDetail.buttonValue}
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
        {error && touch && <div className="text-red-600 text-sm">{error}</div>}
      </div>
    );
  }
);

export { SelectMultiInputComponent };
