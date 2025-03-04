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
  }) => {
    const [isOpen, setIsOpen] = useState(false);
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
    const [calendarDate, setCalendarDate] = useState(date);
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
          setDate(null);
          setInputValue("");
          setCalendarDate(null);
        }
      } else {
        setDate(null);
        setInputValue("");
        setCalendarDate(null);
      }
    }, [value]);

    const resetFields = () => {
      setDate(null);
      setInputValue("");
      setCalendarDate(null);
      onChange(name, ""); // Reset the form value
      setIsOpen(false);
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
          setIsOpen(false);
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
      >
        <FormPopoverButton
          open={isOpen}
          setOpen={setIsOpen}
          className={!date ? "text-neutral-1000" : ""}
          triggerContent={
            <div className="flex justify-start w-full gap-2 items-center">
              <FormFieldIcon icon={<LucideCalendar size={16} />} />
              {date ? (
                // [MODIFIED] Wrapped content in div with flex layout
                <div className="flex justify-between items-center w-full">
                  <span>{format(date, "d MMMM yyyy")}</span>
                  {/* [NEW] Added reset button that shows on hover */}
                  {showReset && (
                    <span
                      className="text-sm text-neutral-900 hover:text-red-500 cursor-pointer ml-2 px-2 py-0.5 border border-neutral-200 rounded-md  hover:bg-white transition-colors"
                      onClick={handleReset}
                    >
                      Reset
                    </span>
                  )}
                </div>
              ) : (
                <FormPlaceholder
                  placeholder={placeholder ? placeholder : `Pick a date`}
                />
              )}
            </div>
          }
          popoverContent={
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
                month={calendarDate || new Date()}
                onMonthChange={setCalendarDate}
                // disabled={(date) =>
                //   date > new Date() || date < new Date("1900-01-01")
                // }
                initialFocus
              />
            </div>
          }
        />
      </FormField>
    );
  }
);

export default DateInput;
