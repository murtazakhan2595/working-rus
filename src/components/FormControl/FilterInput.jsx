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

const FilterInput = ({
  filters,
  onChange,
  value,
  isClearable = true,
  type,
  className = "",
}) => {
  const classNamesStyle = "";
  const DefaultWidth = "w-56";
  const DefaultHeight = "h-[38px]";
  const [openRole, setOpenRole] = useState(false);
  const [openFilterFour, setOpenFilterFour] = useState(false);
  const [openDesignation, setOpenDesignation] = useState(false);
  const [openDepartment, setOpenDepartment] = useState(false);
  const [inputValues, setInputValues] = useState({});

  const handleInputChange = (field, value) => {
    onChange(field, value);
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
            filter.width ?? DefaultWidth
          } ${filter.height ?? DefaultHeight}`}
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
          const {
            className: FilterClassName,
            width,
            height,
            placeholder,
            name,
            options = [],
          } = filter;
          switch (filter.type) {
            case "search":
              return (
                <RenderInputField
                  className={FilterClassName}
                  width={width ?? DefaultWidth}
                  name={name}
                  placeholder={placeholder}
                  height={height ?? DefaultHeight}
                  handleInputChange={handleInputChange}
                />
              );
            case "select":
              return (
                <RenderSelectInputField
                  className={FilterClassName}
                  width={width ?? DefaultWidth}
                  name={name}
                  options={options}
                  placeholder={`Search ${placeholder}`}
                  height={height ?? DefaultHeight}
                  handleInputChange={handleInputChange}
                />
              );
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
              return (
                <RenderDateRangeInputField
                  className={FilterClassName}
                  width={width ?? 'w-[235px]'}
                  name={name}
                  placeholder={`Search ${placeholder}`}
                  height={height ?? DefaultHeight}
                  handleInputChange={handleInputChange}
                />
              );
            default:
              return <div key={index}></div>;
          }
        })}
    </div>
  );
};

const RenderInputField = React.memo(
  ({
    className = "",
    width = "",
    name,
    placeholder,
    height = "",
    handleInputChange = () => {},
  }) => {
    const [inputValue, setInputValue] = useState("");

    return (
      <div className={`${className} ${width} ${height} relative`}>
        <TextInput
          type={"text"}
          placeholder={placeholder}
          className={`rounded-sm text-neutral-1000`}
          name={name}
          value={inputValue || ""}
          onChange={(field, value) => {
            setInputValue(value);
            handleInputChange(field, value);
          }}
        />
        {!inputValue && (
          <SearchIcon className="absolute w-4 h-4 right-[16px] top-[13px] text-neutral-800" />
        )}
      </div>
    );
  }
);

const RenderSelectInputField = React.memo(
  ({
    className = "",
    width = "",
    name,
    placeholder,
    height = "",
    handleInputChange = () => {},
    options = [],
  }) => {
    const [inputValue, setInputValue] = useState("");
    // Add "All" option to the options array if it exists
    const allOptions = React.useMemo(
      () => (options ? [{ value: "All", label: "All" }, ...options] : []),
      [options]
    );
    return (
      <div className={`${className} ${width} ${height} relative`}>
        <SelectInputComponent
          type={"text"}
          placeholder={placeholder}
          className={`rounded-sm text-neutral-1000`}
          name={name}
          value={inputValue || ""}
          onChange={(field, value) => {
            setInputValue(value);
            handleInputChange(
              field,
              value ? (value === "All" ? "" : value) : ""
            );
          }}
          options={allOptions}
        />
      </div>
    );
  }
);

const RenderDateRangeInputField = React.memo(
  ({
    className = "",
    width = "",
    name,
    placeholder,
    height = "",
    handleInputChange = () => {},
  }) => {
    const [inputValue, setInputValue] = useState("");
    
    return (
      <div className={`${className} ${width} ${height} relative`}>
        <DateRangeInput
          type={"text"}
          placeholder={placeholder}
          className={`rounded-sm text-neutral-1000`}
          name={name}
          value={inputValue || ""}
          onChange={(field, value) => {
            setInputValue(value);
            handleInputChange(
              field,
              value 
            );
          }}
        />
      </div>
    );
  }
);

export default FilterInput;
