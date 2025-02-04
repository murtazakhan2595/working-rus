import React, { useState, useEffect, useRef } from "react";
// import Select from "react-select";
import { Label } from "src/@/components/ui/label";
import DatePicker from "react-datepicker";
import { getFileNameFromURL } from "utils/downUtils";
import moment from "moment";
import { Card } from "components/ui/card";
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
import CoverFileUpload from "components/FormControl/UploadFiles";
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
import { SelectMultiInputComponent } from "components/FormControl/InputSelect";
import ImageInput from 'components/FormControl/UploadFiles/ImageInput';
import { errorClassName } from "app/utils/Types/General";

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
  classes = 'gap-4',
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
    <div className={`${classes} flex flex-col w-full`}>
      {showLabel && (
        <Label className="" htmlFor={name}>
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
              !date ? "text-neutral-1000" : ""
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
                <div className="text-sm font-normal text-neutral-1000">
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
