import React, { useState, useEffect } from "react";
import { Calendar as LucideCalendar } from "lucide-react";
import {
  FormField,
  FormPopoverButton,
  FormPlaceholder,
  FormFieldIcon,
} from "components/FormControl";
import { format, parse, isValid, isToday } from "date-fns";
import { Input } from "components/ui/input";
import { TooltipText } from "components";
import { Calendar } from "src/@/components/ui/calendar";
import { PatternFormat } from "react-number-format";
import moment from "moment";
import { useSelector } from "react-redux";
import { renderDate } from "utils/renderValues";
import { useNavigation } from "react-day-picker";

// Custom caption component without Month: and Year: labels
const CustomCaption = ({ date, locale, displayMonth }) => {
  const { goToMonth } = useNavigation();
  
  // Ensure we have a valid date object
  const safeDate = date || displayMonth || new Date();
  
  // Generate arrays for months and years
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = new Date();
    month.setMonth(i);
    return {
      value: i,
      label: month.toLocaleString(locale || 'default', { month: 'long' })
    };
  });

  // Generate array of years (from 1925 to current year + 10)
  const currentYear = new Date().getFullYear();
  const startYear = 1925;
  const endYear = currentYear + 10;
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => {
    const year = startYear + i;
    return {
      value: year,
      label: year.toString()
    };
  });

  const handleMonthChange = (e) => {
    const newDate = new Date(safeDate);
    newDate.setMonth(parseInt(e.target.value));
    goToMonth(newDate);
  };

  const handleYearChange = (e) => {
    const newDate = new Date(safeDate);
    newDate.setFullYear(parseInt(e.target.value));
    goToMonth(newDate);
  };

  return (
    <div className="flex items-center justify-center gap-2 py-1">
      <div className="relative">
        <select 
          value={safeDate.getMonth()} 
          onChange={handleMonthChange}
          className="h-8 w-[130px] text-sm font-medium border border-neutral-300 rounded-md px-2 pr-8 focus:outline-none focus:ring-1 focus:ring-plum-500 hover:bg-neutral-50 transition-colors appearance-none"
          aria-label="Select month"
        >
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-500">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </div>
      </div>
      
      <div className="relative">
        <select 
          value={safeDate.getFullYear()} 
          onChange={handleYearChange}
          className="h-8 w-[80px] text-sm font-medium border border-neutral-300 rounded-md px-2 pr-8 focus:outline-none focus:ring-1 focus:ring-plum-500 hover:bg-neutral-50 transition-colors appearance-none"
          aria-label="Select year"
        >
          {years.map((year) => (
            <option key={year.value} value={year.value}>
              {year.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-500">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

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
    disableHolidays = false,
  }) => {
    const CalendarContent = useSelector(
      (state) => state.common.calendar_content
    );
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
            handleChange(parsedDate);
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
        handleChange(selectedDate);
      }
    };
    const handleChange = (value) => {
      if (disableHolidays) {
        const baseDate = moment(value).format("YYYY-MM-DD");
        const disableHoliday = Boolean(CalendarContent[baseDate]);
        if (disableHoliday) return null;
      }
      setDate(value);
      setInputValue(format(value, inputPattern));
      setCalendarDate(value);
      onChange(name, format(value, dateFormat));
      setIsOpen(false);
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
            <div className="flex items-center justify-start w-full gap-2">
              <FormFieldIcon icon={<LucideCalendar size={16} />} />
              {date ? (
                <div className="flex items-center justify-between w-full">
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
            <>
              <Calendar
                mode="single"
                selected={calendarDate}
                onSelect={handleCalendarSelect}
                month={calendarDate || new Date()}
                onMonthChange={setCalendarDate}
                initialFocus
                // For month-year picker, show only month view
                view={showMonthYearPicker ? "month" : "day"}
                showMonthYearPicker={showMonthYearPicker}
                // ✅ Block past dates
                disabled={(date) => {
                  const disableMinDate = Boolean(
                    minDate ? moment(date).isBefore(MinDate) : false
                  );
                  if (disableMinDate) return true;
                  const disableMaxDate = Boolean(
                    maxDate ? moment(date).isAfter(MaxDate) : false
                  );
                  if (disableMaxDate) return true;

                  return false;
                }}
                // Style to match the first image
                classNames={{
                  caption: "flex justify-center items-center space-x-2",
                  dropdown: "border border-neutral-300 rounded-md px-2 py-1 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-plum-500 hover:bg-neutral-50",
                  dropdown_icon: "ml-1 opacity-70",
                  dropdown_month: "w-[100px]",
                  dropdown_year: "w-[80px]",
                }}
                // Custom components to remove Month: and Year: labels
                components={{
                  Caption: CustomCaption,
                  DayContent: ({ date }) => {
                    const baseDate = moment(date).format("YYYY-MM-DD");
                    const { title, isHoliday } = CalendarContent[baseDate] || {};
                    const isCurrentDay = isToday(date);
                    const className = `w-full h-full flex items-center justify-center ${
                      disableHolidays && isHoliday ? "text-green-500" : ""
                    } ${isHoliday ? "bg-green-100 rounded-full" : ""} ${
                      isCurrentDay ? "border-2 border-plum-1000 rounded-full" : ""
                    }`;
                    return (
                      <div className={className}>
                        {isHoliday ? (
                          <TooltipText
                            tooltipTriggerText={date.getDate()}
                            content={title}
                          />
                        ) : (
                          date.getDate()
                        )}
                      </div>
                    );
                  },
                }}
              />
              <div className="flex items-center justify-center gap-4 pt-2 border-t border-gray-200">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-100 rounded-full"></div>
                  <span className="text-xs text-neutral-700">Holiday</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 border-2 border-plum-1000 rounded-full"></div>
                  <span className="text-xs text-neutral-700">Today</span>
                </div>
              </div>
            </>
          }
        />
      </FormField>
    );
  }
);

export default DateInput;
