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
  }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Parse the date range from string format
    const parseDate = useCallback((dateStr) => {
      if (!dateStr) return null;
      return parse(dateStr, "yyyy-MM-dd", new Date());
    }, []);

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

    // Convert string value to date range object for Calendar component
    const getSelectedDateRange = useCallback(() => {
      if (!value) return { from: undefined, to: undefined };

      const [startDate, endDate] = value.split(",");

      return {
        from: startDate ? parseDate(startDate) : undefined,
        to: endDate ? parseDate(endDate) : undefined,
      };
    }, [value, parseDate]);

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

    // Handle disabled dates (minDate support)
    const handleDisabledDate = useCallback(
      (date) => {
        // If minDate is provided, disable all dates before it
        if (disabled) return true;
        return false;
      },
      [disabled]
    );

    // Handle reset button click
    const handleReset = useCallback(() => {
      onChange(name, null);
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
          invalidField={!!(error && touch)}
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
              <Calendar
                mode="range"
                defaultMonth={getSelectedDateRange().from}
                selected={getSelectedDateRange()}
                onSelect={handleDateSelect}
                numberOfMonths={numberOfMonths}
                disabled={
                  minDate
                    ? (date) => {
                        // Disable dates before minDate
                        const minDateObj = minDate ? parseDate(minDate) : null;
                        return minDateObj ? date < minDateObj : false;
                      }
                    : undefined
                }
                initialFocus
              />
              {showResetButton && value && (
                <div className="flex justify-end p-2 border-t">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-sm font-medium text-primary hover:text-primary-1100"
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
