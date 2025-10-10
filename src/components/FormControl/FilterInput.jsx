import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import { Button } from "components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "src/@/components/ui/popover";
import { ChevronsUpDown, Check, SearchIcon, RefreshCcw } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "src/@/components/ui/command";
import {
  SelectInputComponent,
  SelectMultiInputComponent,
  DateRangeInput,
  DateRangeFilter,
  TextInput,
} from "components/FormControl";
import { GetDateRange } from "utils/renderValues";
import { GetDispatchStateList } from "utils/Lists";
import { countriesList } from "data/Data";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/@/components/ui/tooltip";

const FilterInput = ({
  filters,
  onChange,
  className = "",
  filterValues = {},
  defaultDateRangeTab = "Day", // new optional prop to control initial tab
}) => {
  const Departments = GetDispatchStateList("departments", "common") || [];
  const Designations = GetDispatchStateList("designations", "common") || [];
  const Branches = GetDispatchStateList("branches", "common") || [];
  const Employees = GetDispatchStateList("employees", "emp") || [];
  const classNamesStyle = "";
  const DefaultWidth = "min-w-56";
  const DefaultHeight = "min-h-[38px]";
  const [openRole, setOpenRole] = useState(false);
  const [openFilterFour, setOpenFilterFour] = useState(false);
  const [openDesignation, setOpenDesignation] = useState(false);
  const [openDepartment, setOpenDepartment] = useState(false);
  const [resetFields, setResetFields] = useState(false);

  const handleInputChange = React.useCallback(
    (field, value) => {
      onChange(field, value);
    },
    [onChange]
  );

  const renderPopoverSelect = (filter, index, open, setOpen) => {
    const allOptions = filter.option
      ? [{ value: "", label: "All" }, ...filter.option]
      : [];

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
            className={`${filter.width ? filter.width : "w-[200px]"
              } justify-between rounded-sm text-neutral-1000 h-fit border-neutral-500 hover:border-primary-200 hover:shadow-none hover:text-primary-1100 hover:bg-primary-200`}
          >
            <span
              className={`${selectedOption ? "text-neutral-1000" : "text-muted-foreground"
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
                      className={`mr-2 h-4 w-4 ${filter.values === option.value
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
          className={`${filter.className ?? classNamesStyle} ${filter.width ?? DefaultWidth
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
          const SearchOptions = !options
            ? []
            : Array.isArray(options)
              ? options
              : typeof options === "string"
                ? options.toLowerCase() === "departments"
                  ? Departments || []
                  : options.toLowerCase() === "branches"
                    ? Branches || []
                    : options.toLowerCase() === "designations"
                      ? Designations || []
                      : options.toLowerCase() === "nationalities"
                        ? countriesList || []
                        : options.toLowerCase() === "employees"
                          ? Employees || []
                          : []
                : [];
          switch (filter.type) {
            case "search":
              return (
                <RenderInputField
                  key={index}
                  className={FilterClassName}
                  width={width ?? DefaultWidth}
                  name={name}
                  placeholder={placeholder}
                  height={height ?? DefaultHeight}
                  handleInputChange={handleInputChange}
                  value={filterValues[name] || null}
                  resetField={resetFields}
                />
              );
            case "numeric-range":
              return (
                <RenderNumericRangeField
                  key={index}
                  className={FilterClassName}
                  width={width ?? DefaultWidth}
                  name={name}
                  placeholder={placeholder}
                  height={height ?? DefaultHeight}
                  handleInputChange={handleInputChange}
                  value={filterValues[name] || null}
                  resetField={resetFields}
                />
              );
            case "select":
              return (
                <RenderSelectInputField
                  key={index}
                  className={FilterClassName}
                  width={width ?? DefaultWidth}
                  name={name}
                  options={SearchOptions || []}
                  placeholder={`Search ${placeholder}`}
                  height={height ?? DefaultHeight}
                  handleInputChange={handleInputChange}
                  value={filterValues[name] || null}
                  resetField={resetFields}
                />
              );
            case "select-multiple":
              return (
                <RenderMultiSelectInputField
                  key={index}
                  className={FilterClassName}
                  width={width ?? DefaultWidth}
                  name={name}
                  options={SearchOptions || []}
                  placeholder={`Search ${placeholder}`}
                  height={height ?? DefaultHeight}
                  handleInputChange={handleInputChange}
                  value={filterValues[name] || null}
                  resetField={resetFields}
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
                  key={index}
                  className={FilterClassName}
                  width={width ?? "w-[235px]"}
                  name={name}
                  placeholder={`Search ${placeholder}`}
                  height={height ?? DefaultHeight}
                  resetField={resetFields}
                  value={filterValues[name] || null}
                  handleInputChange={handleInputChange}
                />
              );
            case "date-range-filter":
              return (
                <RenderDateRangeFilterField
                  key={index}
                  className={FilterClassName}
                  name={name}
                  placeholder={`Search ${placeholder}`}
                  height={height ?? DefaultHeight}
                  resetField={resetFields}
                  value={filterValues[name] || null}
                  defaultDateRangeTab={defaultDateRangeTab}
                  handleInputChange={handleInputChange}
                />
              );
            default:
              return <div key={index}></div>;
          }
        })}
      <RenderResetFilter
        handleInputChange={handleInputChange}
        filtersList={filters}
        resetAllFields={() => {
          setResetFields(!resetFields);
        }}
      />
    </div>
  );
};

const RenderNumericRangeField = React.memo(
  ({
    className = "",
    width = "",
    name,
    placeholder,
    height = "",
    handleInputChange = () => { },
    value,
    resetField,
  }) => {
    const [inputValue, setInputValue] = useState(value);

    const prevResetField = React.useRef(resetField);
    useEffect(() => {
      if (prevResetField.current !== resetField && resetField !== false) {
        setInputValue(null);
      }
      prevResetField.current = resetField;
    }, [resetField]);

    useEffect(() => {
      setInputValue(value);
    }, [value]);

    const handleChange = (_, value) => {
      let newValue = value;
      if (!newValue.includes("-")) {
        const lastValue = inputValue;
        if (!lastValue) {
          newValue = newValue + "-";
        } else {
          const cursorWasBeforeDash =
            lastValue.indexOf("-") >= 0 &&
            value.length < lastValue.length &&
            lastValue.indexOf("-") >= value.length;
          if (cursorWasBeforeDash) newValue = "-" + newValue;
          else newValue = newValue + "-";
        }
      }
      newValue = newValue.replace(/[^0-9-]/g, "");
      const parts = newValue.split("-");
      if (parts.length > 2) newValue = parts[0] + "-" + parts[1];
      if (newValue === "") newValue = "-";
      setInputValue(newValue);
      handleInputChange?.(name, parts);
    };

    return (
      <div className={`${className} ${width} ${height} relative`}>
        <TextInput
          type={"text"}
          placeholder={placeholder}
          className={`rounded-sm text-neutral-1000`}
          name={name}
          value={inputValue || ""}
          onChange={handleChange}
        />
      </div>
    );
  }
);

const RenderInputField = React.memo(
  ({
    className = "",
    width = "",
    name,
    placeholder,
    height = "",
    handleInputChange = () => { },
    value,
    resetField,
  }) => {
    const [inputValue, setInputValue] = useState(value);

    const prevResetField = React.useRef(resetField);
    useEffect(() => {
      if (prevResetField.current !== resetField && resetField !== false) {
        setInputValue(null);
      }
      prevResetField.current = resetField;
    }, [resetField]);

    useEffect(() => {
      setInputValue(value);
    }, [value]);

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

const RenderMultiSelectInputField = React.memo(
  ({
    className = "",
    width = "",
    name,
    placeholder,
    height = "",
    handleInputChange = () => { },
    options = [],
    resetField,
    value,
  }) => {
    const [inputValue, setInputValue] = useState(value);

    const allOptions = React.useMemo(
      () => (options ? [{ value: "All", label: "All" }, ...options] : []),
      [options]
    );

    const prevResetField = React.useRef(resetField);
    useEffect(() => {
      if (prevResetField.current !== resetField && resetField !== false) {
        setInputValue(null);
      }
      prevResetField.current = resetField;
    }, [resetField]);

    useEffect(() => {
      setInputValue(value);
    }, [value]);

    return (
      <div className={`${className} ${width} ${height} relative`}>
        <SelectMultiInputComponent
          type={"text"}
          placeholder={placeholder}
          className={`rounded-sm text-neutral-1000`}
          name={name}
          value={inputValue || ""}
          onChange={(field, value) => {
            if (value && value.includes("All")) {
              setInputValue("");
              handleInputChange(field, "");
            } else {
              setInputValue(value && value.length > 0 ? value : "");
              handleInputChange(field, value && value.length > 0 ? value : "");
            }
          }}
          options={allOptions}
        />
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
    handleInputChange = () => { },
    options = [],
    resetField,
    value,
  }) => {
    const [inputValue, setInputValue] = useState(value);

    const allOptions = React.useMemo(
      () => (options ? [{ value: "All", label: "All" }, ...options] : []),
      [options]
    );

    const prevResetField = React.useRef(resetField);
    useEffect(() => {
      if (prevResetField.current !== resetField && resetField !== false) {
        setInputValue(null);
      }
      prevResetField.current = resetField;
    }, [resetField]);

    useEffect(() => {
      setInputValue(value);
    }, [value]);

    return (
      <div className={`${className} ${width} ${height} relative`}>
        <SelectInputComponent
          type={"text"}
          placeholder={placeholder}
          className={`rounded-sm text-neutral-1000`}
          name={name}
          value={inputValue !== null || inputValue !== undefined ? inputValue : ""}
          onChange={(field, value) => {
            setInputValue(value !== null || value !== undefined ? (value === "All" ? "" : value) : "");
            handleInputChange(
              field,
              value !== null || value !== undefined ? (value === "All" ? "" : value) : ""
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
    resetField,
    handleInputChange = () => { },
    value,
  }) => {
    const [inputValue, setInputValue] = useState(value);

    const prevResetField = React.useRef(resetField);
    useEffect(() => {
      if (prevResetField.current !== resetField && resetField !== false) {
        setInputValue(null);
      }
      prevResetField.current = resetField;
    }, [resetField]);

    useEffect(() => {
      setInputValue(value);
    }, [value]);

    return (
      <div className={`${className} ${width} ${height} relative`}>
        <DateRangeInput
          placeholder={placeholder}
          className={`rounded-sm text-neutral-1000`}
          name={name}
          value={inputValue || ""}
          onChange={(field, value) => {
            setInputValue(value);
            handleInputChange(field, value);
          }}
        />
      </div>
    );
  }
);

const RenderDateRangeFilterField = React.memo(
  ({
    className = "",
    name,
    height = "",
    resetField,
    handleInputChange = () => { },
    defaultDateRangeTab = "Day",
  }) => {
    const [activeTab, setActiveTab] = useState(defaultDateRangeTab || "Day");

    useEffect(() => {
      let isMounted = true;
      if (isMounted) {
        setActiveTab(defaultDateRangeTab || "Day");
        const tab = (defaultDateRangeTab || "").toUpperCase();
        // If defaultDateRangeTab is falsy or 'NONE', do not apply any date filter on mount
        if (!tab || tab === "NONE") {
          // no-op: keep filter unset until user selects a tab
        } else if (tab === "DAY") {
          const formattedDatee = moment().format("YYYY-MM-DD");
          handleInputChange(name, `${formattedDatee},${formattedDatee}`);
        } else {
          const date_range = GetDateRange(defaultDateRangeTab)?.split(",") || [];
          const end_date =
            date_range[1] && date_range[1] !== "null" ? date_range[1] : "";
          const start_date =
            date_range[0] && date_range[0] !== "null" ? date_range[0] : "";
          handleInputChange(name, `${start_date},${end_date}`);
        }
      }
      return () => {
        isMounted = false;
      };
    }, [resetField, name, defaultDateRangeTab]);

    return (
      <div className={`${className} ${height} h-full w-fit relative`}>
        <DateRangeFilter
          activeDateRange={activeTab}
          className={`rounded-sm text-neutral-1000`}
          setDateRange={(dateRange) => {
            if (dateRange.toUpperCase() === "DAY") {
              const formattedDatee = moment().format("YYYY-MM-DD");
              handleInputChange(name, `${formattedDatee},${formattedDatee}`);
            } else {
              const date_range = GetDateRange(dateRange)?.split(",") || [];
              const end_date =
                date_range[1] && date_range[1] !== "null" ? date_range[1] : "";
              const start_date =
                date_range[0] && date_range[0] !== "null" ? date_range[0] : "";
              handleInputChange(name, `${start_date},${end_date}`);
            }
            setActiveTab(dateRange);
            return;
          }}
        />
      </div>
    );
  }
);

const RenderResetFilter = React.memo(
  ({
    className = "",
    width = "",
    name,
    filtersList = [],
    height = "",
    handleInputChange = () => { },
    resetAllFields = () => { },
  }) => {
    const resetFilters = (event) => {
      event.preventDefault();
      event.stopPropagation();
      for (const filter of filtersList) {
        handleInputChange(filter.name, "");
      }
      resetAllFields();
    };

    return (
      <div className={`${className} ${width} ${height} relative`}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={resetFilters}>
                <RefreshCcw size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reset the filters</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }
);

export default FilterInput;
