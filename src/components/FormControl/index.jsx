import React, { useState, useEffect, useRef } from "react";
// import Select from "react-select";
import { Label } from "src/@/components/ui/label";
import DatePicker from "react-datepicker";
import { getFileNameFromURL } from "utils/downUtils";
import moment from "moment";
import { Card } from "components/ui/card";
import upload from "assets/images/upload.png";
import ReactQuill from "react-quill";
import { Input } from "components/ui/input";
import { Button } from "components/ui/button";
import { useSelector } from "react-redux";
import { Calendar as LucideCalendar } from "lucide-react";
import { AiOutlinePaperClip } from "react-icons/ai";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "src/@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "src/@/components/ui/radio-group";
import AttachmentUI from "components/ui/AttachmentUI";

import {
  ChevronsUpDown,
  Check,
  FileUp,
  CircleX,
  SearchIcon,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "src/@/components/ui/command";
import { cn } from "src/@/lib/utils";
import { format, parse, isValid } from "date-fns";
import { Calendar } from "src/@/components/ui/calendar";
import { PatternFormat } from "react-number-format";
import TextEditorInputField from "./TextEditorInputField";
import CommentsInputField from "./CommentsInputField";
import DateRangeFilter from "./DateRangeFilter";
import SortingFilters from "./SortingFilters";
import TimePicker from "./TimePicker";

const errorClassName = "text-red-100 text-sm font-[inter] font-normal ml-1";

const SelectComponent = ({
  name,
  value,
  error,
  touch,
  options,
  label,
  disabled,
  required,
  onChange,
  classes,
  placeholder,
  icon,
  showLabel = true,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (currentValue) => {
    const newValue =
      currentValue === value || (currentValue === null && value === null)
        ? ""
        : currentValue;
    setOpen(false);
    onChange(name, newValue);
  };
  return (
    <div className={`${classes || ""} flex flex-col`}>
      {showLabel && (
        <Label className={`mb-4`} htmlFor={name}>
          {required && <span className="text-red-600">* </span>} {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between w-full rounded-sm text-neutral-1100 h-fit border-neutral-500 hover:border-primary-200 hover:shadow-none hover:text-primary-1100 hover:bg-primary-200"
            disabled={disabled}
          >
            {icon}{" "}
            {value ? (
              options.find((option) => option.value == value)?.label
            ) : (
              <span className="text-sm font-normal text-neutral-1000">
                {placeholder || `Select`}
              </span>
            )}
            <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder={`Enter ${label || ""}`} />
            <CommandList>
              <CommandEmpty>No {label} found.</CommandEmpty>
              <CommandGroup>
                {options?.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option.value)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && touch && <div className={errorClassName}>{error}</div>}
    </div>
  );
};

const SelectMultiInputComponent = ({
  name,
  options,
  error,
  touch,
  value = [],
  label,
  onChange,
  required,
  classes,
  icon,
  valueIdentifier = true,
}) => {
  const [open, setOpen] = React.useState(false);

  // Ensure value is an array
  if (value === null || typeof value === "string") {
    value = [];
  }

  const handleSelect = (option) => {
    const newValue = value.includes(option)
      ? value.filter((item) => item !== option)
      : [...value, option];
    onChange(name, newValue);
  };

  const handleRemove = (option) => {
    const newValue = value.filter((item) => item !== option);
    onChange(name, newValue);
  };

  return (
    <div className={`${classes || "flex flex-col gap-4"}`}>
      {label && (
        <Label className={` ${value ? "" : ""}`} htmlFor={name}>
          {required && <span className="text-red-600">* </span>} {label}
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
              {icon && <div className="w-4"> {icon}</div>}
              <div className="flex flex-wrap justify-start gap-2 items-center max-w-[calc(100vh_-_40px)]">
                {value.length > 0 ? (
                  value?.map((val) => {
                    return valueIdentifier ? (
                      <span
                        key={val}
                        className="bg-plum-300 text-plum-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-lg flex items-center"
                      >
                        {options.find((opt) => opt.value === val)?.label}
                        {/* <CircleX
                          className="ml-1 text-sm text-red-600 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(val);
                          }}
                        /> */}
                      </span>
                    ) : (
                      options.find((opt) => opt.value === val)?.label
                    );
                  })
                ) : (
                  <span className="text-sm font-normal text-neutral-1000">
                    {`Select`}
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
        </PopoverContent>
      </Popover>
      {error && touch && <div className={errorClassName}>{error}</div>}
    </div>
  );
};

const DateInput = ({
  name,
  value,
  error,
  touch,
  onChange,
  label,
  disabled,
  required,
  minDate,
  className,
  placeholder,
  showReset,
}) => {
  const [date, setDate] = useState(
    value && isValid(parse(value, "yyyy-MM-dd", new Date()))
      ? parse(value, "yyyy-MM-dd", new Date())
      : null
  );
  const [inputValue, setInputValue] = useState(
    value && isValid(parse(value, "yyyy-MM-dd", new Date()))
      ? format(parse(value, "yyyy-MM-dd", new Date()), "dd/MM/yyyy")
      : ""
  );
  const [calendarDate, setCalendarDate] = useState(date || new Date());
  const [showResetText, setShowResetText] = useState(false);

  const handleReset = (e) => {
    e.stopPropagation(); // Prevent the popover from opening
    resetFields();
  };

  // Sync the input field and calendar when the value changes externally
  useEffect(() => {
    if (value) {
      const parsedDate = parse(value, "yyyy-MM-dd", new Date());
      if (isValid(parsedDate)) {
        setDate(parsedDate);
        setInputValue(format(parsedDate, "dd/MM/yyyy"));
        setCalendarDate(parsedDate);
      } else {
        resetFields();
      }
    } else {
      resetFields();
    }
  }, [value]);

  const resetFields = () => {
    setDate(null);
    setInputValue("");
    setCalendarDate(new Date());
    onChange(name, ""); // Reset the form value
  };

  // Handle manual input changes and sync with calendar
  const handleInputChange = (values) => {
    const { formattedValue } = values;
    setInputValue(formattedValue);

    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (dateRegex.test(formattedValue)) {
      const parsedDate = parse(formattedValue, "dd/MM/yyyy", new Date());
      if (isValid(parsedDate)) {
        setDate(parsedDate);
        setCalendarDate(parsedDate); // Sync with the calendar
        onChange(name, format(parsedDate, "yyyy-MM-dd"));
      }
    }
  };

  // Handle date selection from the calendar and sync with input
  const handleCalendarSelect = (selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
      setInputValue(format(selectedDate, "dd/MM/yyyy"));
      setCalendarDate(selectedDate);
      onChange(name, format(selectedDate, "yyyy-MM-dd"));
    }
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {label && (
        <Label htmlFor={name}>
          {required && <span className="text-red-600">* </span>} {label}
        </Label>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`w-full justify-start text-left font-normal rounded-sm h-fit border-neutral-500 hover:border-primary-200 hover:shadow-none hover:text-primary-1100 hover:bg-primary-200 ${
              !date ? "text-muted-foreground" : ""
            }`}
            onMouseEnter={() => showReset && date && setShowResetText(true)}
            onMouseLeave={() => setShowResetText(false)}
          >
            {date ? (
              // [MODIFIED] Wrapped content in div with flex layout
              <div className="flex justify-between items-center w-full">
                <span>{format(date, "d MMMM yyyy")}</span>
                {/* [NEW] Added reset button that shows on hover */}
                {showReset && showResetText && (
                  <span
                    className="text-sm text-neutral-900 hover:text-red-500 cursor-pointer ml-2 px-2 py-0.5 border border-neutral-200 rounded-md  hover:bg-white transition-colors"
                    onClick={handleReset}
                  >
                    Reset
                  </span>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <LucideCalendar size={16} />
                <div className="text-sm font-normal text-neutral-600">
                  {placeholder ? placeholder : "Pick a date"}
                </div>
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex flex-col p-2 space-y-2">
            <PatternFormat
              format="##/##/####"
              placeholder="DD/MM/YYYY"
              value={inputValue}
              onValueChange={handleInputChange}
              customInput={Input}
              className="w-[240px] text-center mx-auto text-sm font-normal text-neutral-1000"
            />
            <Calendar
              mode="single"
              selected={calendarDate} // Ensure calendar is synced with input
              onSelect={handleCalendarSelect}
              month={calendarDate}
              onMonthChange={setCalendarDate}
              // disabled={(date) =>
              //   date > new Date() || date < new Date("1900-01-01")
              // }
              initialFocus
            />
          </div>
        </PopoverContent>
      </Popover>
      {error && touch && <div className={errorClassName}>{error}</div>}
    </div>
  );
};

const DateRangeInput = ({
  name,
  value,
  error,
  touch,
  onChange,
  label,
  disabled,
  required,
  minDate,
  className,
  placeholder,
}) => {
  const [date, setDate] = useState(
    value && isValid(parse(value, "yyyy-MM-dd", new Date()))
      ? parse(value, "yyyy-MM-dd", new Date())
      : null
  );
  const [inputValue, setInputValue] = useState(
    value && isValid(parse(value, "yyyy-MM-dd", new Date()))
      ? format(parse(value, "yyyy-MM-dd", new Date()), "dd/MM/yyyy")
      : ""
  );
  const [calendarDate, setCalendarDate] = useState(date || new Date());

  // Sync the input field and calendar when the value changes externally
  useEffect(() => {
    if (value) {
      const parsedDate = parse(value, "yyyy-MM-dd", new Date());
      if (isValid(parsedDate)) {
        setDate(parsedDate);
        setInputValue(format(parsedDate, "dd/MM/yyyy"));
        setCalendarDate(parsedDate);
      } else {
        resetFields();
      }
    } else {
      resetFields();
    }
  }, [value]);

  const resetFields = () => {
    setDate(null);
    setInputValue("");
    setCalendarDate(new Date());
    // onChange(name, ""); // Reset the form value
  };

  // Handle manual input changes and sync with calendar
  const handleInputChange = (values) => {
    const { formattedValue } = values;
    setInputValue(formattedValue);

    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (dateRegex.test(formattedValue)) {
      const parsedDate = parse(formattedValue, "dd/MM/yyyy", new Date());
      if (isValid(parsedDate)) {
        setDate(parsedDate);
        setCalendarDate(parsedDate); // Sync with the calendar
        // onChange(name, format(parsedDate, "yyyy-MM-dd"));
      }
    }
  };

  // Handle date selection from the calendar and sync with input
  const handleCalendarSelect = (selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
      setInputValue(format(selectedDate, "dd/MM/yyyy"));
      setCalendarDate(selectedDate);
      // onChange(name, format(selectedDate, "yyyy-MM-dd"));
    }
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {label && (
        <Label htmlFor={name}>
          {required && <span className="text-red-600">* </span>} {label}
        </Label>
      )}
      <div className={cn("grid gap-2", className)}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              {/* <CalendarIcon /> */}
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
      {error && touch && <div className={errorClassName}>{error}</div>}
    </div>
  );
};

const RadioGroupInput = ({
  name,
  value,
  error,
  touch,
  options,
  label,
  disabled,
  required,
  onChange,
}) => {
  const defaultValue = value || (options.length > 0 ? options[0].value : "");
  return (
    <div>
      {label && <label className="font-medium">{label}</label>}
      <RadioGroup
        defaultValue={options[0]?.value}
        value={defaultValue}
        onValueChange={(value) => {
          onChange(name, value);
        }}
      >
        <div className="flex items-center justify-around">
          {options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem
                value={option.value}
                id={option.value}
                disabled={disabled}
              />
              <Label htmlFor={option.value}>{option.label}</Label>
            </div>
          ))}
        </div>
      </RadioGroup>
      {touch && error && <div className="text-sm text-red-500">{error}</div>}
    </div>
  );
};
const TextInput = ({
  name,
  value,
  error,
  touch,
  onChange,
  label,
  disabled,
  onBlur,
  required,
  regEx,
  maxLength,
  placeholder,
  autoComplete = "off",
}) => {
  return (
    <div className="flex flex-col gap-4">
      {label && (
        <Label htmlFor={name}>
          {label}
          {required && <span className="text-red-600">* </span>}
        </Label>
      )}
      <Input
        type="text"
        maxLength={maxLength ?? "100"}
        id={name}
        name={name}
        autoComplete={autoComplete} // Use "off" for no autocomplete or specify a valid autocomplete token like "name", "email", etc.
        placeholder={placeholder || (label ? `Enter ${label}` : "Enter value")}
        value={value ?? ""}
        disabled={disabled}
        className={error && touch ? "is-invalid" : "text-neutral-1000"}
        onChange={(event) => {
          const inputValue = event.target.value;
          if (regEx) {
            if (!inputValue || regEx.test(inputValue)) {
              onChange(name, inputValue);
            }
          } else {
            onChange(name, inputValue);
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
  );
};

const NumberInput = ({
  name,
  value,
  error,
  onBlur,
  touch,
  onChange,
  label,
  disabled,
  required,
  regEx,
  min,
  max,
  step,
  placeholder,
}) => {
  return (
    <>
      <div className="flex flex-col gap-4">
        {label && (
          <Label htmlFor={name}>
            {label}
            {required && <span className="text-red-600">* </span>}
          </Label>
        )}
        <Input
          type="number"
          id={name}
          name={name}
          autoComplete="Off"
          placeholder={label ? "Enter " + label : placeholder}
          value={value ?? ""}
          disabled={disabled}
          className={error && touch ? "is-invalid" : "text-neutral-1000"}
          min={min}
          max={max}
          step={step ?? "any"}
          onChange={(option) => {
            const value = option.target.value;
            // Only allow numeric input
            if (/^\d*\.?\d*$/.test(value) || value === "") {
              onChange(name, value);
            }
          }}
          // Prevent non-numeric input including 'e' and special characters
          onKeyDown={(e) => {
            if (
              e.key === "e" ||
              e.key === "E" ||
              e.key === "+" ||
              e.key === "-"
            ) {
              e.preventDefault();
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

const PasswordInput = ({
  name,
  value,
  error,
  touch,
  onChange,
  label,
  disabled,
  required,
  maxLength,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <Label htmlFor={name}>
        {label}
        {label}
        {required && <span className="text-red-600">* </span>}
      </Label>
      <Input
        type="password"
        maxLength={maxLength || 20}
        id={name}
        name={name}
        autoComplete="off"
        placeholder={`Enter ${label}`}
        value={value ?? ""}
        disabled={disabled}
        className={error && touch ? "is-invalid" : ""}
        onChange={onChange}
      />
      {error && touch && <div className={errorClassName}>{error}</div>}
    </div>
  );
};

const CheckBoxInput = ({ name, value, onChange, label, disabled }) => {
  return (
    <>
      <div className="flex flex-row items-center gap-4">
        <Input
          id={name}
          type="checkbox"
          checked={value}
          value={value}
          className="w-4"
          disabled={disabled}
          onChange={() => {
            console.log("value onchange", value);
            onChange(name, !value);
          }}
        />
        <Label check>{label}</Label>
      </div>
    </>
  );
};

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
              !selectedCountryCode
                ? "Select country code first"
                : `Enter ${label}`
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

const EmailInput = ({
  name,
  value,
  error,
  touch,
  onChange,
  label,
  disabled,
  required,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <Label className="text-baseGray" htmlFor={name}>
        {required && <span className="text-red-600">* </span>}
        {label}
      </Label>
      <Input
        type="email"
        maxLength="100"
        id={name}
        name={name}
        autoComplete="Off"
        placeholder={"Enter " + label}
        value={value}
        className={error && touch ? "is-invalid" : ""}
        onChange={(option) => {
          const regExTelephone = /^[A-Za-z0-9.@]+$/;
          const value = option.target.value;
          if (!value || regExTelephone.test(value)) onChange(name, value);
        }}
      />

      {error && touch && <div className={errorClassName}>{error}</div>}
    </div>
  );
};
const CustomButton = ({ label, onClick, disabled }) => {
  return (
    <div className="flex flex-col gap-4">
      <Button
        className="bg-[#323333] text-[#F7F8FA] w-40 h-12  text-base font-semibold"
        onClick={onClick}
        disabled={disabled}
      >
        {label}
      </Button>
    </div>
  );
};

const CustomDarkButton = ({ label, onClick, disabled, style, className }) => {
  return (
    <Button
      className={`btn btn-dark ${className ?? ""}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {label}
    </Button>
  );
};

const CustomLightOutlineButton = ({ label, onClick, disabled, style }) => {
  return (
    <Button
      type="button"
      className="btn btn-outline-dark btn-light"
      style={style}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </Button>
  );
};

const ImageInput = ({ label, value, error, onChange, touch, name }) => {
  return (
    <>
      <div className="relative flex flex-row items-center justify-start w-full h-full border-solid rounded-3xl">
        <div className="relative overflow-hidden w-[110px]">
          {value ? (
            <img
              src={
                typeof value === "string"
                  ? value // If value is a URL, use it directly
                  : URL.createObjectURL(value) // If value is a file object, create a temporary URL
              }
              alt="Preview"
              className="h-[100px] object-cover border-2 border-gray-400 rounded-full"
              width={"100px"}
            />
          ) : (
            <img
              src={upload}
              alt="Default"
              className="h-[100px] block mx-auto border-2 border-gray-400 rounded-full"
              width={"100px"}
            />
          )}
        </div>
        <div className="">
          <div>
            <Label htmlFor="picture"> {label}</Label>
            <Input
              id="picture"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const selectedFile = e.target.files[0];
                if (selectedFile) {
                  // Check file size
                  const maxSize = 1024 * 1024; // 1 MB in bytes
                  let imageError = null;
                  if (selectedFile.size > maxSize) {
                    // File size exceeds 1 MB, handle error
                    imageError = "Please upload a file smaller than 1 MB.";
                  }
                  // Pass the file object directly
                  onChange(
                    name,
                    selectedFile, // Pass the file object instead of Base64
                    imageError
                  );
                }
              }}
            />
            {error && touch && <div className={errorClassName}>{error}</div>}
          </div>
          <span>JPEG or PNG. Max size of 100KB</span>
        </div>
      </div>
    </>
  );
};
const FileInput = ({
  value,
  error,
  onChange,
  touch,
  name,
  label,
  acceptType,
}) => {
  return (
    <>
      <div className="w-full justify-start gap-1.5 mb-4 relative">
        <Label htmlFor={name} className="flex flex-row gap-4">
          <FileUp className="" />
          {`Upload Your ${label || "file"}`}
        </Label>
        <Input
          id={name}
          className="w-full"
          type="file"
          name={name}
          accept={acceptType || "*/*"}
          max-size="104857600"
          onChange={(e) => {
            let selectedFile = e.target.files[0];
            const fileData = { name: selectedFile?.name };
            if (selectedFile) {
              const reader = new FileReader();
              reader.onload = (e) => {
                const newDocument = {
                  name: fileData.name,
                  file: e.target.result,
                };
                if (value && value.id) {
                  value.document = newDocument;
                  value.name = fileData.name;
                } else {
                  value = newDocument;
                }
                onChange(name, value);
              };

              reader.readAsDataURL(selectedFile);
            }
          }}
        />
        <div style={{ position: "absolute", bottom: ".61rem", left: "6rem" }}>
          <div
            style={{ minWidth: "7rem", whiteSpace: "pre" }}
            className="w-full px-1 text-sm bg-white"
          >
            {value?.document?.name || value?.name}
          </div>
        </div>
      </div>
      {error && touch && <div className="text-red-500 ">{error}</div>}
    </>
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
const TextAreaEditorInput = ({
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
}) => {
  return (
    <>
      <div className="flex flex-col gap-4">
        <Label className="pt-4 mt-1 text-baseGray" htmlFor={name}>
          {required && <span className="text-red-600">* </span>}
          {label}
        </Label>

        {error && touch && <div className={errorClassName}>{error}</div>}
        <ReactQuill
          type="textarea"
          id={name}
          name={name}
          autoComplete="Off"
          placeholder={"Enter " + label}
          value={value}
          modules={{
            toolbar: {
              container: [
                ["bold", "italic", "underline"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link"],
                [{ align: "" }, { align: "center" }, { align: "right" }],
              ],
            },
          }}
          formats={[
            "bold",
            "italic",
            "underline",
            "list",
            "bullet",
            "link",
            "align",
          ]}
          readOnly={disabled}
          className={`rounded ${error && touch ? "is-invalid" : ""}`}
          onChange={(option) => {
            onChange(name, option);
          }}
        />
      </div>
    </>
  );
};

function dropdownStyles(backgrounddivor, fontSize, height) {
  return {
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    control: (provided, state) => ({
      ...provided,
      backgrounddivor: backgrounddivor,
      border: "none",
      boxShadow: "none",
      minWidth: "8rem",
      fontSize: fontSize,
      minHeight: height,
      maxHeight: height,
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: fontSize,
      fontWeight: state.isSelected ? "bold" : "normal",
      divor: state.isSelected ? "#000" : "#777",
      padding: "8px 12px",
      backgrounddivor: state.isSelected ? "#FAFBFC" : "#FAFBFC",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "8px",
      overflow: "hidden",
    }),
    scrollbarWidth: (base) => ({
      ...base,
      borderRadius: "8px",
      backgrounddivor: "#FAFBFC",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      divor: "#555",
    }),
  };
}

const FilterInput = ({
  filters,
  onChange,
  value,
  isClearable = true,
  type,
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
      <div className="relative">
        {!inputValues[filter.name] && (
          <SearchIcon className="absolute w-4 h-4 right-[16px] top-[13px] text-muted-foreground" />
        )}
        <Input
          key={index}
          type={filter.type}
          placeholder={filter.placeholder}
          className={`${filter.className ?? classNamesStyle} ${
            filter.width ?? width
          } ${filter.height ?? height} rounded-sm text-neutral-1000`}
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
    <div className="flex flex-wrap items-start gap-x-3 gap-y-3">
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

const CoverFileUpload = ({
  name,
  value,
  error,
  touch,
  onChange,
  label,
  acceptType,
  required,
  maxSize = 10,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]); // Store multiple files
  const fileInputRef = useRef(null);

  // Initialize files from value
  useEffect(() => {
    if (value) {
      // If the value is a URL, set the file data with the URL
      if (typeof value === "string" && value.startsWith("http")) {
        setFiles([{ name: getFileNameFromURL(value), url: value }]);
      } else {
        setFiles(Array.isArray(value) ? value : [value]);
      }
    }
  }, [value]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return false;
    }
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const handleFile = (file) => {
    if (validateFile(file)) {
      const reader = new FileReader();
      reader.onload = () => {
        const fileData = {
          name: file.name,
          file: reader.result,
        };

        // Replace existing files with new file
        setFiles([file]);
        onChange(name, file); // Send single file to parent
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = (indexToRemove) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    setFiles(updatedFiles);
    onChange(name, updatedFiles.length ? updatedFiles : null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + sizes[i];
  };

  const handleNewFileClick = () => {
    // Create a temporary file input
    const tempFileInput = document.createElement("input");
    tempFileInput.type = "file";
    tempFileInput.accept = acceptType;
    tempFileInput.style.display = "none";

    // Add change event listener
    tempFileInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        handleFile(file);
      }
      // Remove the temporary input after use
      document.body.removeChild(tempFileInput);
    });

    // Add to body and trigger click
    document.body.appendChild(tempFileInput);
    tempFileInput.click();
  };

  const renderUploadedFiles = () => {
    return files.map((fileData, index) => (
      <div
        key={index}
        className="flex items-center justify-between p-4 bg-white border rounded-lg border-neutral-500"
      >
        <div
          className="flex items-center gap-3"
          style={{ maxWidth: "67%", overflow: "hidden" }}
        >
          <div className="text-neutral-500">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-900">
              {fileData.name}
            </p>
            <a
              href={
                fileData.url
                  ? fileData.url
                  : fileData
                  ? URL.createObjectURL(fileData)
                  : "#"
              }
              download
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-neutral-700"
            >
              View Document
            </a>
            {/* ) : (
              <p className="text-sm text-neutral-500">
                {formatFileSize(fileData?.file?.length)}
              </p>
            )} */}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleNewFileClick}
            className="text-sm font-medium text-primary hover:text-plum-700"
          >
            Update
          </button>
          <button
            type="button"
            onClick={() => handleRemoveFile(index)}
            className="text-sm font-medium text-neutral-900 hover:text-neutral-700"
          >
            Remove
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="flex flex-col gap-4 mb-4">
      <Label className="text-normal " htmlFor={name}>
        {required && <span className="text-red-600">* </span>}
        {label || "Attachments"}
      </Label>

      {value ? (
        <div className="space-y-3">{renderUploadedFiles(value)}</div>
      ) : (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 ${
            dragActive
              ? "border-primary-500 bg-primary-50"
              : "border-neutral-300"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
            <div className="mb-4">
              <FileUp className="w-16 h-16 text-neutral-400" />
            </div>
            <p className="mb-2">
              <span className="font-semibold text-primary">Upload a file</span>
              <span className="text-neutral-1000"> or drag and drop</span>
            </p>
            <p className="text-sm text-neutral-1000">
              {acceptType === ".pdf"
                ? "Please upload PNG, JPG or PDF up to 10MB"
                : "PNG, JPG or PDF up to 10MB"}
            </p>

            <input
              ref={fileInputRef}
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleChange}
              accept={acceptType}
              title=""
            />
          </div>
        </div>
      )}

      {error && touch && <div className={errorClassName}>{error}</div>}
    </div>
  );
};

export {
  CommentsInputField,
  TimePicker,
  SelectComponent,
  SelectMultiInputComponent,
  DateInput,
  DateRangeInput,
  TextInput,
  PhoneNumberInput,
  EmailInput,
  ImageInput,
  CustomButton,
  TextAreaInput,
  CustomDarkButton,
  FileInput,
  FilterInput,
  CustomLightOutlineButton,
  CheckBoxInput,
  TextAreaEditorInput,
  PasswordInput,
  RadioGroupInput,
  NumberInput,
  CoverFileUpload,
  errorClassName,
  TextEditorInputField,
  SortingFilters,
  DateRangeFilter,
};
