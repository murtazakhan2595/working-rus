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
import CheckBoxInputTree from "components/FormControl/CheckBoxInputTree";
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
import MonthInput from "./MonthInput";
import CommentsInputField from "./CommentsInputField";
import SwitchInput from "./SwitchInput";
import DateRangeFilter from "./DateRangeFilter";
import TextAreaInput from "./TextAreaInput";
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
import PhoneNumberInput from "./PhoneNumberInput";
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
        field_description,
        label_description,
        children,
      },
      ref
    ) => {
      return (
        <div className={cn(`flex flex-col gap-4`, className)}>
          {label && (
            <div>
              <Label htmlFor={name} className="items-center flex">
                {required && <span className="text-red-600">* </span>}
                {label}
              </Label>
              {label_description && (
                <div
                  className={
                    "text-neutral-900 text-xs font-[inter] font-normal"
                  }
                >
                  {label_description}
                </div>
              )}
            </div>
          )}

          <div
            className={`flex-col flex gap-1 relative ${
              disabled ? "cursor-not-allowed" : ""
            }`}
          >
            {children}
            {field_description && (
              <div
                className={
                  "text-neutral-900 text-xs font-[inter] font-normal mt-1"
                }
              >
                {field_description}
              </div>
            )}
            {Boolean(error) && touched && (
              <div className={errorClassName}>{error}</div>
            )}
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
        popoverClassName,
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
          <PopoverContent
            className={cn("min-w-[300px] w-auto p-0", popoverClassName)}
          >
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
  const [openFilterFour, setOpenFilterFour] = useState(false);
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
            case "select-four":
              return renderPopoverSelect(
                filter,
                index,
                openFilterFour,
                setOpenFilterFour
              );
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
  CheckBoxInputTree,
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
  MonthInput,
  SwitchInput,
};
