import React, { useState, useEffect, forwardRef, memo } from "react";
// import Select from "react-select";
import { Label } from "src/@/components/ui/label";
import DatePicker from "react-datepicker";
import { cn } from "src/@/lib/utils";
import moment from "moment";
import { Input } from "components/ui/input";
import { Button } from "components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "src/@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "src/@/components/ui/radio-group";
import TextInput from "components/FormControl/TextInput";
import NumberInput from "components/FormControl/NumberInput";
import PasswordInput from "components/FormControl/PasswordInput";
import CoverFileUpload from "components/FormControl/UploadFiles";
import { ChevronsUpDown, Check, SearchIcon } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "src/@/components/ui/command";
import { format, parse, isValid } from "date-fns";
import { Calendar } from "src/@/components/ui/calendar";
import TextEditorInputField from "./TextEditorInputField";
import CommentsInputField from "./CommentsInputField";
import DateRangeFilter from "./DateRangeFilter";
import SortingFilters from "./SortingFilters";
import TimePicker from "./TimePicker";
import { InputSignature } from "./InputSignature";
import {
  SelectMultiInputComponent,
  SelectInputComponent,
} from "components/FormControl/InputSelect";
import ImageInput from "components/FormControl/UploadFiles/ImageInput";
import EmailInput from "components/FormControl/EmailInput";
import ColorInput from "./ColorInput";
import DateInput from "./DateInput";
import RadioGroupInput from "./RadioGroupInput";
import CheckBoxInput from "./CheckBoxInput";
import DateRangeInput from "./DateRangeInput";
import SelectLocationOnMap from "./SelectLocationOnMap";

const errorClassName = "text-red-800 text-xs font-[inter] font-normal ml-1";
export const inputButtonClassName =
  "inline-flex items-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border bg-white text-primary hover:text-primary hover:bg-white hover:shadow-none h-fit px-4 py-2 flex-wrap justify-between w-full rounded-sm border-neutral-500";

export const InvalidInput = "border-red-800";
// General FormField Component
export const FormField = memo(
  forwardRef(
    (
      {
        name,
        label,
        required,
        error,
        touched,
        className = "w-full", // Custom styling
        disabled = false,
        children,
      },
      ref
    ) => {
      return (
        <div className={cn(`flex flex-col gap-4`, className)}>
          {label && (
            <Label htmlFor={name} className="items-center flex">
              {required && <span className="text-red-600">* </span>}
              {label}
            </Label>
          )}
          <div
            className={`flex-col flex gap-1 ${
              disabled ? "cursor-not-allowed" : ""
            }`}
          >
            {children}
            {error && touched && <div className={errorClassName}>{error}</div>}
          </div>
        </div>
      );
    }
  )
);

export const FormPopoverButton = memo(
  forwardRef(
    (
      {
        popoverContent,
        triggerContent,
        className = "", // Allows additional styling
        open,
        setOpen,
        disabled = false,
        invalidField = false,
      },
      ref
    ) => {
      return (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={ref}
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(
                inputButtonClassName,
                className,
                invalidField ? InvalidInput : ""
              )}
              disabled={disabled}
            >
              {triggerContent}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="min-w-[300px] w-auto p-0">
            {popoverContent}
          </PopoverContent>
        </Popover>
      );
    }
  )
);

export const FormPlaceholder = memo(
  ({
    placeholder = "Enter Value",
    className = "", // Allows additional styling
  }) => {
    return (
      <div
        className={cn(
          "text-sm font-normal text-neutral-1000 max-w-[90%] overflow-hidden",
          className
        )}
      >
        {placeholder}
      </div>
    );
  }
);

export const FormFieldIcon = memo(
  ({
    icon = null,
    className = "", // Allows additional styling
  }) => {
    if (!icon) return null;
    return <div className={cn("w-4", className)}>{icon}</div>;
  }
);

// const RadioGroupInput = ({
//   name,
//   value,
//   error,
//   touch,
//   options,
//   label,
//   disabled,
//   required,
//   onChange,
// }) => {
//   const defaultValue = value || (options.length > 0 ? options[0].value : "");
//   return (
//     <div>
//       {label && <label className="font-medium">{label}</label>}
//       <RadioGroup
//         defaultValue={options[0]?.value}
//         value={defaultValue}
//         onValueChange={(value) => {
//           onChange(name, value);
//         }}
//       >
//         <div className="flex items-center justify-around">
//           {options.map((option) => (
//             <div key={option.value} className="flex items-center space-x-2">
//               <RadioGroupItem
//                 value={option.value}
//                 id={option.value}
//                 disabled={disabled}
//               />
//               <Label htmlFor={option.value}>{option.label}</Label>
//             </div>
//           ))}
//         </div>
//       </RadioGroup>
//       {touch && error && <div className="text-sm text-red-500">{error}</div>}
//     </div>
//   );
// };

// const NumberInput = ({
//   name,
//   value,
//   error,
//   onBlur,
//   touch,
//   onChange,
//   label,
//   disabled,
//   required,
//   regEx,
//   min,
//   max,
//   step,
//   placeholder,
// }) => {
//   return (
//     <>
//       <div className="flex flex-col gap-4">
//         {label && (
//           <Label htmlFor={name}>
//             {label}
//             {required && <span className="text-red-600">* </span>}
//           </Label>
//         )}
//         <Input
//           type="number"
//           id={name}
//           name={name}
//           autoComplete="Off"
//           placeholder={label ? "Enter " + label : placeholder}
//           value={value ?? ""}
//           disabled={disabled}
//           className={error && touch ? "is-invalid" : "text-neutral-1000"}
//           min={min}
//           max={max}
//           step={step ?? "any"}
//           onChange={(option) => {
//             const value = option.target.value;
//             // Only allow numeric input
//             if (/^\d*\.?\d*$/.test(value) || value === "") {
//               onChange(name, value);
//             }
//           }}
//           // Prevent non-numeric input including 'e' and special characters
//           onKeyDown={(e) => {
//             if (
//               e.key === "e" ||
//               e.key === "E" ||
//               e.key === "+" ||
//               e.key === "-"
//             ) {
//               e.preventDefault();
//             }
//           }}
//           onBlur={(event) => {
//             if (onBlur) {
//               onBlur(event);
//             }
//           }}
//         />

//         {error && touch && <div className={errorClassName}>{error}</div>}
//       </div>
//     </>
//   );
// };

const PhoneNumberInput = ({
  name,
  disabled,
  label,
  error,
  touch,
  onChange,
  required,
  countryCode,
  value,
  countryOptions,
  countryCodeName,
}) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState(null);
  const [inputValue, setInputValue] = useState(value || "");
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Sync state with countryCode prop
  useEffect(() => {
    const selectedOption = countryOptions.find(
      (option) => option.value === countryCode
    );
    if (selectedOption) {
      setSelectedCountryCode(selectedOption);
      setInputValue((prev) =>
        prev.startsWith(`+${selectedOption.value}`)
          ? prev
          : `+${selectedOption.value}`
      );
    }
  }, [countryCode, countryOptions]);

  useEffect(() => {
    if (value !== undefined && selectedCountryCode) {
      const formattedValue = `+${selectedCountryCode.value}${value ?? ""}`;
      setInputValue(formattedValue);
    }
  }, [value, selectedCountryCode]);

  // Handles the country code selection
  const handleSelectChange = (value) => {
    const selectedOption = countryOptions.find(
      (option) => option.value === value
    );
    if (selectedOption) {
      setSelectedCountryCode(selectedOption);
      // setInputValue(`+${selectedOption.value}`); // Update the input with the selected country code
      onChange(countryCodeName, selectedOption.value); // Notify parent about country code change
      setOpen(false); // Close the popover
    }
  };

  // Handles the phone number input change
  const handleInputChange = (event) => {
    const regExTelephone = /^[0-9-]+$/;
    const strippedValue = event.target.value.replace(
      `+${selectedCountryCode?.value || ""}`,
      ""
    );

    if (!strippedValue || regExTelephone.test(strippedValue)) {
      setInputValue(`+${selectedCountryCode?.value || ""}${strippedValue}`);
      onChange(name, strippedValue); // Send the stripped value (without country code) to the parent
    }
  };

  // Filters the country options based on the search query
  const filteredCountries = countryOptions.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      <Label check>
        {label}
        {required && <span className="text-red-600">*</span>}
      </Label>
      <div className="flex items-center">
        <div className="flex-shrink-0 w-fit">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="justify-start w-full rounded-l-sm rounded-r-none text-neutral-1000 h-fit border-neutral-500 hover:border-primary-200 hover:shadow-none hover:text-primary-1100 hover:bg-primary-200"
              >
                {selectedCountryCode?.alpha2 ?? "Select code"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[300px]">
              <Command>
                <CommandInput
                  placeholder="Search country..."
                  value={searchQuery}
                  onValueChange={(value) => setSearchQuery(value)}
                />
                <CommandList>
                  <CommandEmpty>No country found.</CommandEmpty>
                  <CommandGroup>
                    {filteredCountries.length ? (
                      filteredCountries.map((option) => (
                        <CommandItem
                          key={option.value}
                          onSelect={() => handleSelectChange(option.value)}
                        >
                          {option.label}
                        </CommandItem>
                      ))
                    ) : (
                      <CommandEmpty>No country found.</CommandEmpty>
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className="w-full">
          <Input
            id={name}
            name={name}
            disabled={!selectedCountryCode || disabled}
            autoComplete="off"
            placeholder={
              !selectedCountryCode ? "Select country code" : `Enter ${label}`
            }
            value={inputValue}
            className={`
              ${error && touch ? "is-invalid" : ""} 
              rounded-l-none rounded-r-sm
              ${!selectedCountryCode ? "bg-gray-100 cursor-not-allowed" : ""}
            `}
            onChange={handleInputChange}
          />
        </div>
      </div>
      {error && touch && <div className={errorClassName}>{error}</div>}
    </div>
  );
};

const TextAreaInput = ({
  name,
  value,
  error,
  touch,
  onChange,
  label,
  disabled,
  required,
  regEx,
  maxLength,
  maxRows,
  onBlur,
  placeholder,
}) => {
  return (
    <>
      <div className="flex flex-col">
        {label && (
          <Label
            className={`text-baseGray mb-4 ${value ? "active" : ""}`}
            htmlFor={name}
          >
            {required && <span className="text-red-600">* </span>}
            {label}
          </Label>
        )}

        <Input
          type="textarea"
          maxLength={maxLength ?? "5000"}
          id={name}
          name={name}
          autoComplete="Off"
          placeholder={label ? "Enter " + label : placeholder}
          value={value}
          rows={maxRows ?? 3}
          disabled={disabled}
          className={`h-auto ${error && touch ? "is-invalid" : ""}`}
          onChange={(option) => {
            const value = option.target.value;
            if (regEx) {
              if (!value || regEx.test(value)) onChange(name, value);
            } else {
              onChange(name, value);
            }
          }}
          onBlur={(event) => {
            if (onBlur) {
              onBlur(event);
            }
          }}
        />
        {error && touch && <div className={errorClassName}>{error}</div>}
      </div>
    </>
  );
};

const FilterInput = ({
  filters,
  onChange,
  value,
  isClearable = true,
  type,
  className = "",
}) => {
  const classNamesStyle = "";
  const width = "w-56";
  const height = "h-[38px]";
  const [openRole, setOpenRole] = useState(false);
  const [openDesignation, setOpenDesignation] = useState(false);
  const [openDepartment, setOpenDepartment] = useState(false);
  const [inputValues, setInputValues] = useState({});

  const handleInputChange = (filter, event) => {
    setInputValues((prev) => ({
      ...prev,
      [filter.name]: event.target.value,
    }));
    onChange(filter.name, event.target.value);
  };

  const renderInputField = (filter, index) => {
    return (
      <div
        className={`${filter.className} ${filter.width ?? width} ${
          filter.height ?? height
        } relative`}
      >
        {!inputValues[filter.name] && (
          <SearchIcon className="absolute w-4 h-4 right-[16px] top-[13px] text-muted-foreground" />
        )}
        <Input
          key={index}
          type={filter.type}
          placeholder={filter.placeholder}
          className={`rounded-sm text-neutral-1000`}
          name={filter.name}
          id={filter.name}
          value={inputValues[filter.name] || ""}
          onChange={(event) => handleInputChange(filter, event)}
        />
      </div>
    );
  };

  const renderPopoverSelect = (filter, index, open, setOpen) => {
    // Add "All" option to the options array if it exists
    const allOptions = filter.option
      ? [{ value: "", label: "All" }, ...filter.option]
      : [];

    // Only find selectedOption if there's a value
    const selectedOption = filter.values
      ? allOptions.find((option) => option.value === filter.values)
      : null;

    return (
      <Popover key={index} open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`${
              filter.width ? filter.width : "w-[200px]"
            } justify-between rounded-sm text-neutral-1000 h-fit border-neutral-500 hover:border-primary-200 hover:shadow-none hover:text-primary-1100 hover:bg-primary-200`}
          >
            <span
              className={`${
                selectedOption ? "text-neutral-1000" : "text-muted-foreground"
              } truncate max-w-full`}
              style={{ display: "block" }}
            >
              {selectedOption ? selectedOption.label : filter.placeholder}
            </span>

            <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>No option found.</CommandEmpty>
              <CommandGroup>
                {allOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      onChange(filter.name, option.value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        filter.values === option.value
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
        </PopoverContent>
      </Popover>
    );
  };

  const renderDatePicker = (filter, index) => {
    const date = filter.value ? new Date(moment(filter.value)) : null;
    return (
      <div key={index} style={{ width: "fit-content" }}>
        <DatePicker
          name={filter.name}
          id={filter.name}
          className={`${filter.className ?? classNamesStyle} ${
            filter.width ?? width
          } ${filter.height ?? height}`}
          dropdownMode="select"
          placeholderText={filter.placeholder}
          selected={date}
          autoComplete="off"
          onChange={(value) => {
            const formattedValue = value
              ? moment(value).format("YYYY-MM-DD")
              : null;
            onChange(filter.name, formattedValue);
          }}
          showMonthDropdown
          showYearDropdown
          dateFormat="dd-MM-yyyy"
        />
      </div>
    );
  };
  const renderDateRangePicker = (filter, index) => {
    const dateRange = filter.value ? filter.value?.split(",") : null;
    const date = {
      from:
        dateRange &&
        dateRange[0] &&
        isValid(parse(dateRange[0], "yyyy-MM-dd", new Date()))
          ? parse(dateRange[0], "yyyy-MM-dd", new Date())
          : null,
      to:
        dateRange &&
        dateRange[1] &&
        isValid(parse(dateRange[1], "yyyy-MM-dd", new Date()))
          ? parse(dateRange[1], "yyyy-MM-dd", new Date())
          : null,
    };
    return (
      <div key={index} style={{ width: "fit-content" }}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"ghost"}
              className={cn(
                "border-neutral-400 round justify-start border font-normal",
                !date && "text-muted-foreground"
              )}
            >
              {/* <CalendarIcon /> */}
              {dateRange && date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>{filter.placeholder}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={(date) => {
                if (date) {
                  const startOfWeek = moment(date.from).format("YYYY-MM-DD");
                  const endOfWeek = moment(date.to).format("YYYY-MM-DD");
                  onChange(filter.name, `${startOfWeek},${endOfWeek}`);
                }
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  };
  return (
    <div className={`${className} flex flex-wrap items-start gap-x-3 gap-y-3`}>
      {filters &&
        filters?.map((filter, index) => {
          switch (filter.type) {
            case "search":
              return renderInputField(filter, index);
            case "select-one":
              return renderPopoverSelect(
                filter,
                index,
                openDepartment,
                setOpenDepartment
              );
            case "select-two":
              return renderPopoverSelect(
                filter,
                index,
                openDesignation,
                setOpenDesignation
              );
            case "select-three":
              return renderPopoverSelect(filter, index, openRole, setOpenRole);
            case "date":
              return renderDatePicker(filter, index);
            case "date-range":
              return renderDateRangePicker(filter, index);
            default:
              return <div key={index}></div>;
          }
        })}
    </div>
  );
};

export {
  CommentsInputField,
  TimePicker,
  SelectLocationOnMap,
  SelectMultiInputComponent,
  SelectInputComponent,
  DateInput,
  TextInput,
  PhoneNumberInput,
  EmailInput,
  ImageInput,
  TextAreaInput,
  FilterInput,
  CheckBoxInput,
  PasswordInput,
  RadioGroupInput,
  NumberInput,
  CoverFileUpload,
  errorClassName,
  TextEditorInputField,
  SortingFilters,
  DateRangeFilter,
  ColorInput,
  DateRangeInput,
  InputSignature,
};
