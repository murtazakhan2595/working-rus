import React, { useState, useEffect } from "react";
import { Calendar as LucideCalendar } from "lucide-react";
import {
  FormField,
  FormPopoverButton,
  FormPlaceholder,
  FormFieldIcon,
} from "components/FormControl";
import { format, parse, isValid } from "date-fns";
import { Input } from "components/ui/input";
import { Calendar } from "src/@/components/ui/calendar";
import { PatternFormat } from "react-number-format";
import moment from "moment";

const DateInput = React.memo(
  ({
    name,
    error,
    touch,
    value = null, // Current selected values
    label = null, // Label for the select field
    onChange, // Function to handle selection change
    required = false, // Whether the field is required
    className = "w-full", // Custom styling
    placeholder = null, // Placeholder text when no value is selected
    showReset = false,
    disabled = false,
    dateFormat = "yyyy-MM-dd", // Default format for the value
    showMonthYearPicker = false, // Whether to show only month/year picker
    minDate,
    maxDate,
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const MinDate = React.useMemo(() => {
      return minDate ? moment(minDate).startOf("day") : null;
    }, [minDate]);
    const MaxDate = React.useMemo(() => {
      return maxDate ? moment(maxDate).endOf("day") : null;
    }, [maxDate]);
    // Determine input and display formats based on showMonthYearPicker
    const inputPattern = showMonthYearPicker ? "MM/yyyy" : "dd/MM/yyyy";
    const displayPattern = showMonthYearPicker ? "MMMM yyyy" : "d MMMM yyyy";
    const inputMask = showMonthYearPicker ? "##/####" : "##/##/####";
    const inputPlaceholder = showMonthYearPicker ? "MM/YYYY" : "DD/MM/YYYY";

    // Parse the initial date based on the format
    const [date, setDate] = useState(() => {
      if (!value) return null;
      try {
        const parsedDate = parse(value, dateFormat, new Date());
        return isValid(parsedDate) ? parsedDate : null;
      } catch (e) {
        return null;
      }
    });

    // Format input value based on the selected date
    const [inputValue, setInputValue] = useState(() => {
      if (!date) return "";
      return format(date, inputPattern);
    });

    const [calendarDate, setCalendarDate] = useState(date);

    const handleReset = (e) => {
      e.stopPropagation(); // Prevent the popover from opening
      resetFields();
    };

    // Sync the input field and calendar when the value changes externally
    useEffect(() => {
      if (value) {
        try {
          const parsedDate = parse(value, dateFormat, new Date());
          if (isValid(parsedDate)) {
            setDate(parsedDate);
            setInputValue(format(parsedDate, inputPattern));
            setCalendarDate(parsedDate);
          } else {
            resetFields(false);
          }
        } catch (e) {
          resetFields(false);
        }
      } else {
        resetFields(false);
      }
    }, [value, dateFormat, inputPattern]);

    const resetFields = (callOnChange = true) => {
      setDate(null);
      setInputValue("");
      setCalendarDate(null);
      if (callOnChange) {
        onChange(name, ""); // Reset the form value
      }
      setIsOpen(false);
    };

    // Handle manual input changes and sync with calendar
    const handleInputChange = (values) => {
      const { formattedValue } = values;
      setInputValue(formattedValue);

      // Use different regex patterns based on the picker mode
      const dateRegex = showMonthYearPicker
        ? /^(0[1-9]|1[0-2])\/\d{4}$/
        : /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

      if (dateRegex.test(formattedValue)) {
        try {
          const parsedDate = parse(formattedValue, inputPattern, new Date());
          if (isValid(parsedDate)) {
            // ✅ Add check: if selected date >= minDate
            if (minDate && moment(parsedDate).isBefore(MinDate)) {
              return; // Don't allow setting date earlier than minDate
            }
            if (maxDate && moment(parsedDate).isAfter(MaxDate)) {
              return; // Don't allow setting date earlier than minDate
            }
            setDate(parsedDate);
            setCalendarDate(parsedDate); // Sync with the calendar
            onChange(name, format(parsedDate, dateFormat));
            setIsOpen(false);
          }
        } catch (e) {
          // Invalid date, do nothing
        }
      }
    };

    // Handle date selection from the calendar and sync with input
    const handleCalendarSelect = (selectedDate) => {
      if (selectedDate) {
        // ✅ Add check: if selected date >= minDate
        if (minDate && moment(selectedDate).isBefore(MinDate)) {
          return; // Ignore selection if before minDate
        }
        if (maxDate && moment(selectedDate).isAfter(MaxDate)) {
          return; // Ignore selection if before minDate
        }
        setDate(selectedDate);
        setInputValue(format(selectedDate, inputPattern));
        setCalendarDate(selectedDate);
        onChange(name, format(selectedDate, dateFormat));
        setIsOpen(false);
      }
    };

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
          className={!date ? "text-neutral-1000" : ""}
          invalidField={!!(error && touch)}
          disabled={disabled}
          triggerContent={
            <div className="flex justify-start w-full gap-2 items-center">
              <FormFieldIcon icon={<LucideCalendar size={16} />} />
              {date ? (
                <div className="flex justify-between items-center w-full">
                  <span>{format(date, displayPattern)}</span>
                  {showReset && (
                    <span
                      className="text-sm text-neutral-900 hover:text-red-500 cursor-pointer ml-2 px-2 py-0.5 border border-neutral-200 rounded-md hover:bg-white transition-colors"
                      onClick={handleReset}
                    >
                      Reset
                    </span>
                  )}
                </div>
              ) : (
                <FormPlaceholder
                  placeholder={
                    placeholder
                      ? placeholder
                      : showMonthYearPicker
                      ? "Select Month-Year"
                      : "Pick a date"
                  }
                />
              )}
            </div>
          }
          popoverContent={
            <div className="flex flex-col p-2 space-y-2">
              <PatternFormat
                format={inputMask}
                placeholder={inputPlaceholder}
                value={inputValue}
                onValueChange={handleInputChange}
                customInput={Input}
                className="w-[240px] text-center mx-auto text-sm font-normal text-neutral-1000"
              />
              <Calendar
                mode="single"
                selected={calendarDate}
                onSelect={handleCalendarSelect}
                month={calendarDate || new Date()}
                onMonthChange={setCalendarDate}
                initialFocus
                // For month-year picker, show only month view
                view={showMonthYearPicker ? "month" : "day"}
                // For month-year picker, don't allow day selection
                // This works if the Calendar component supports it
                showMonthYearPicker={showMonthYearPicker}
                // ✅ Block past dates
                disabled={(date) =>
                  (minDate ? moment(date).isBefore(MinDate) : false) ||
                  (maxDate ? moment(date).isAfter(MaxDate) : false)
                }
              />
            </div>
          }
        />
      </FormField>
    );
  }
);

export default DateInput;
