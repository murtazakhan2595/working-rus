import React, { useState, useCallback, useEffect } from "react";
import { Calendar } from "src/@/components/ui/calendar";
import { format, isValid, parse } from "date-fns";
import { CalendarIcon, CalendarDays } from "lucide-react";
import moment from "moment";
import {
  FormField,
  FormPopoverButton,
  FormPlaceholder,
  FormFieldIcon,
} from "components/FormControl";
import { Input } from "components/ui/input";
import { PatternFormat } from "react-number-format";

const DateRangeInput = React.memo(
  ({
    name,
    error,
    touch,
    value = null, // Expected format: "YYYY-MM-DD,YYYY-MM-DD"
    label = null,
    onChange,
    required = false,
    className = "w-full",
    icon = <CalendarIcon className="h-4 w-4" />,
    placeholder = "Select date range",
    disabled = false,
    numberOfMonths = 2,
    showResetButton = true,
    minDate = null, // Minimum allowed date (in YYYY-MM-DD format)
    maxDate = null, // Maximum allowed date (in YYYY-MM-DD format)
    showManualInput = true, // New prop to enable/disable manual input
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [calendarMonth, setCalendarMonth] = useState(new Date());

    // Input pattern and format
    const inputPattern = "dd/MM/yyyy";
    const inputMask = "##/##/####";
    const inputPlaceholder = "DD/MM/YYYY";

    // Parse the date range from string format
    const parseDate = useCallback((dateStr) => {
      if (!dateStr) return null;
      return parse(dateStr, "yyyy-MM-dd", new Date());
    }, []);

    // Parse date from input format (DD/MM/YYYY)
    const parseInputDate = useCallback((dateStr) => {
      if (!dateStr || dateStr.length < 10) return null;
      return parse(dateStr, inputPattern, new Date());
    }, []);

    // Format date for input display (DD/MM/YYYY)
    const formatInputDate = useCallback((dateObj) => {
      if (!dateObj || !isValid(dateObj)) return "";
      return format(dateObj, inputPattern);
    }, []);

    // Initialize input values
    const getInputValues = useCallback(() => {
      if (!value) return { startInput: "", endInput: "" };

      const [startDate, endDate] = value.split(",");
      const startDateObj = startDate ? parseDate(startDate) : null;
      const endDateObj = endDate ? parseDate(endDate) : null;

      return {
        startInput: startDateObj ? formatInputDate(startDateObj) : "",
        endInput: endDateObj ? formatInputDate(endDateObj) : "",
      };
    }, [value, parseDate, formatInputDate]);

    const [inputValues, setInputValues] = useState(getInputValues);

    // Convert string value to date range object for Calendar component
    const getSelectedDateRange = useCallback(() => {
      if (!value) return { from: undefined, to: undefined };

      const [startDate, endDate] = value.split(",");

      return {
        from: startDate ? parseDate(startDate) : undefined,
        to: endDate ? parseDate(endDate) : undefined,
      };
    }, [value, parseDate]);

    // Update calendar month when value changes
    useEffect(() => {
      const selectedRange = getSelectedDateRange();
      if (selectedRange.from) {
        setCalendarMonth(selectedRange.from);
      }
    }, [getSelectedDateRange]);

    // Update input values when value prop changes
    useEffect(() => {
      setInputValues(getInputValues());
    }, [getInputValues]);

    // Format selected date range for display
    const formatDateRange = useCallback(
      (dateRange) => {
        if (!dateRange) return null;

        const [startDate, endDate] = dateRange.split(",");

        if (!startDate) return null;

        const parsedStartDate = parseDate(startDate);
        const parsedEndDate = endDate ? parseDate(endDate) : null;

        if (!isValid(parsedStartDate)) return null;

        if (parsedEndDate && isValid(parsedEndDate)) {
          return `${format(parsedStartDate, "LLL dd, yyyy")} - ${format(
            parsedEndDate,
            "LLL dd, yyyy"
          )}`;
        }

        return format(parsedStartDate, "LLL dd, yyyy");
      },
      [parseDate]
    );

    // Validate date against min/max constraints
    const isDateValid = useCallback(
      (date) => {
        if (!date || !isValid(date)) return false;

        if (minDate) {
          const minDateObj = parseDate(minDate);
          if (minDateObj && date < minDateObj) return false;
        }

        if (maxDate) {
          const maxDateObj = parseDate(maxDate);
          if (maxDateObj && date > maxDateObj) return false;
        }

        return true;
      },
      [minDate, maxDate, parseDate]
    );

    // Handle manual input changes
    const handleInputChange = useCallback(
      (field, values) => {
        const { formattedValue } = values;

        setInputValues((prev) => ({
          ...prev,
          [field]: formattedValue,
        }));

        // Validate complete date format
        const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

        if (dateRegex.test(formattedValue)) {
          const parsedDate = parseInputDate(formattedValue);

          if (parsedDate && isDateValid(parsedDate)) {
            const formattedDate = format(parsedDate, "yyyy-MM-dd");

            // Update calendar month to show the entered date
            setCalendarMonth(parsedDate);

            // Update the value based on which field changed
            const currentRange = value ? value.split(",") : ["", ""];
            let newValue;

            if (field === "startInput") {
              newValue = currentRange[1]
                ? `${formattedDate},${currentRange[1]}`
                : formattedDate;
            } else {
              newValue = currentRange[0]
                ? `${currentRange[0]},${formattedDate}`
                : `,${formattedDate}`;
            }

            onChange(name, newValue);
            // Don't close the popover when typing - let user continue selecting
          }
        }
      },
      [value, onChange, name, parseInputDate, isDateValid]
    );

    // Handle date selection in calendar
    const handleDateSelect = useCallback(
      (range) => {
        if (!range) {
          onChange(name, null);
          return;
        }

        const { from, to } = range;
        let newValue = null;

        if (from) {
          const formattedFrom = format(from, "yyyy-MM-dd");
          newValue = formattedFrom;

          if (to) {
            const formattedTo = format(to, "yyyy-MM-dd");
            newValue = `${formattedFrom},${formattedTo}`;
          }
        }

        onChange(name, newValue);

        // Close popover when a full range is selected
        if (from && to) {
          setIsOpen(false);
        }
      },
      [onChange, name]
    );

    // Handle disabled dates
    const handleDisabledDate = useCallback(
      (date) => {
        if (disabled) return true;

        if (minDate) {
          const minDateObj = parseDate(minDate);
          if (minDateObj && date < minDateObj) return true;
        }

        if (maxDate) {
          const maxDateObj = parseDate(maxDate);
          if (maxDateObj && date > maxDateObj) return true;
        }

        return false;
      },
      [disabled, minDate, maxDate, parseDate]
    );

    // Handle reset button click
    const handleReset = useCallback(() => {
      onChange(name, null);
      setInputValues({ startInput: "", endInput: "" });
      setCalendarMonth(new Date());
    }, [onChange, name]);
    return (
      <FormField
        name={name}
        label={label}
        required={required}
        error={error}
        touched={touch}
        className={className}
        disabled={disabled}
      >
        <FormPopoverButton
          open={isOpen}
          setOpen={setIsOpen}
          disabled={disabled}
          invalidField={!!(error)}
          triggerContent={
            <div className="flex justify-start w-full gap-2 items-center">
              <FormFieldIcon icon={icon} />
              {value ? (
                formatDateRange(value)
              ) : (
                <FormPlaceholder placeholder={placeholder} />
              )}
            </div>
          }
          popoverContent={
            <div className="p-0">
              {showManualInput && (
                <div className="flex flex-col p-3 space-y-2 border-b">
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <label className="text-xs text-muted-700 mb-1 block">
                        Start Date
                      </label>
                      <PatternFormat
                        format={inputMask}
                        placeholder={inputPlaceholder}
                        value={inputValues.startInput}
                        onValueChange={(values) =>
                          handleInputChange("startInput", values)
                        }
                        customInput={Input}
                        className="w-full text-center text-sm font-normal"
                        disabled={disabled}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-muted-700 mb-1 block">
                        End Date
                      </label>
                      <PatternFormat
                        format={inputMask}
                        placeholder={inputPlaceholder}
                        value={inputValues.endInput}
                        onValueChange={(values) =>
                          handleInputChange("endInput", values)
                        }
                        customInput={Input}
                        className="w-full text-center text-sm font-normal"
                        disabled={disabled}
                      />
                    </div>
                  </div>
                </div>
              )}
              <Calendar
                mode="range"
                defaultMonth={getSelectedDateRange().from || calendarMonth}
                selected={getSelectedDateRange()}
                onSelect={handleDateSelect}
                numberOfMonths={numberOfMonths}
                disabled={handleDisabledDate}
                initialFocus
                month={calendarMonth}
                onMonthChange={setCalendarMonth}
              />
              {showResetButton && value && (
                <div className="flex justify-end p-2 border-t">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-sm font-medium text-primary hover:text-primary-1100"
                    disabled={disabled}
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>
          }
        />
      </FormField>
    );
  }
);

export default DateRangeInput;
