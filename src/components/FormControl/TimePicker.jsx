

import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import {
  FormField,
  FormPopoverButton,
  FormPlaceholder,
  FormFieldIcon,
  InvalidInput,
} from "components/FormControl";
import { Input } from "components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/@/components/ui/select";
import { Button } from "components/ui/button";
import { cn } from "src/@/lib/utils";
import moment from "moment";

// Utility functions from the original time-picker-utils
export function isValid12Hour(value) {
  return /^(0[1-9]|1[0-2])$/.test(value);
}

export function isValidMinuteOrSecond(value) {
  return /^[0-5][0-9]$/.test(value);
}

export function getValidNumber(value, { max, min = 0, loop = false }) {
  let numericValue = parseInt(value, 10);

  if (!isNaN(numericValue)) {
    if (!loop) {
      if (numericValue > max) numericValue = max;
      if (numericValue < min) numericValue = min;
    } else {
      if (numericValue > max) numericValue = min;
      if (numericValue < min) numericValue = max;
    }
    return numericValue.toString().padStart(2, "0");
  }

  return "00";
}

export function getValid12Hour(value) {
  if (isValid12Hour(value)) return value;
  return getValidNumber(value, { min: 1, max: 12 });
}

export function getValidMinuteOrSecond(value) {
  if (isValidMinuteOrSecond(value)) return value;
  return getValidNumber(value, { max: 59 });
}

export function getValidArrowNumber(value, { min, max, step }) {
  let numericValue = parseInt(value, 10);
  if (!isNaN(numericValue)) {
    numericValue += step;
    return getValidNumber(String(numericValue), { min, max, loop: true });
  }
  return "00";
}

export function getValidArrow12Hour(value, step) {
  return getValidArrowNumber(value, { min: 1, max: 12, step });
}

export function getValidArrowMinuteOrSecond(value, step) {
  return getValidArrowNumber(value, { min: 0, max: 59, step });
}

export function convert12HourTo24Hour(hour, period) {
  if (period === "PM") {
    if (hour <= 11) {
      return hour + 12;
    } else {
      return hour;
    }
  } else if (period === "AM") {
    if (hour === 12) return 0;
    return hour;
  }
  return hour;
}

export function display12HourValue(hours) {
  if (hours === 0 || hours === 12) return "12";
  if (hours >= 22) return `${hours - 12}`;
  if (hours % 12 > 9) return `${hours}`;
  return `0${hours % 12}`;
}

export function setMinutes(date, value) {
  const minutes = getValidMinuteOrSecond(value);
  date.setMinutes(parseInt(minutes, 10));
  return date;
}

export function set12Hours(date, value, period) {
  const hours = parseInt(getValid12Hour(value), 10);
  const convertedHours = convert12HourTo24Hour(hours, period);
  date.setHours(convertedHours);
  return date;
}

export function setDateByType(date, value, type, period) {
  switch (type) {
    case "minutes":
      return setMinutes(date, value);
    case "12hours": {
      if (!period) return date;
      return set12Hours(date, value, period);
    }
    default:
      return date;
  }
}

export function getDateByType(date, type) {
  if (!date) return "00";
  
  switch (type) {
    case "minutes":
      return getValidMinuteOrSecond(String(date.getMinutes()));
    case "12hours":
      const hours = display12HourValue(date.getHours());
      return getValid12Hour(String(hours));
    default:
      return "00";
  }
}

export function getArrowByType(value, step, type) {
  switch (type) {
    case "minutes":
      return getValidArrowMinuteOrSecond(value, step);
    case "12hours":
      return getValidArrow12Hour(value, step);
    default:
      return "00";
  }
}

// TimePickerInput Component (exact logic from GitHub)
const TimePickerInput = React.forwardRef(
  (
    {
      className,
      type = "tel",
      value,
      id,
      name,
      date,
      setDate,
      onChange,
      onKeyDown,
      picker,
      period,
      onLeftFocus,
      onRightFocus,
      error,
      touch,
      ...props
    },
    ref
  ) => {
    const [flag, setFlag] = useState(false);
    const [prevIntKey, setPrevIntKey] = useState("0");

    /**
     * allow the user to enter the second digit within 2 seconds
     * otherwise start again with entering first digit
     */
    useEffect(() => {
      if (flag) {
        const timer = setTimeout(() => {
          setFlag(false);
        }, 2000);

        return () => clearTimeout(timer);
      }
    }, [flag]);

    const calculatedValue = React.useMemo(() => {
      return getDateByType(date, picker);
    }, [date, picker]);

    const calculateNewValue = (key) => {
      /*
       * If picker is '12hours' and the first digit is 0, then the second digit is automatically set to 1.
       * The second entered digit will break the condition and the value will be set to 10-12.
       */
      if (picker === "12hours") {
        if (flag && calculatedValue.slice(1, 2) === "1" && prevIntKey === "0")
          return "0" + key;
      }

      return !flag ? "0" + key : calculatedValue.slice(1, 2) + key;
    };

    const handleKeyDown = (e) => {
      if (e.key === "Tab") return;
      e.preventDefault();
      if (e.key === "ArrowRight") onRightFocus?.();
      if (e.key === "ArrowLeft") onLeftFocus?.();
      if (["ArrowUp", "ArrowDown"].includes(e.key)) {
        const step = e.key === "ArrowUp" ? 1 : -1;
        const newValue = getArrowByType(calculatedValue, step, picker);
        if (flag) setFlag(false);
        const tempDate = new Date(date || new Date().setHours(0, 0, 0, 0));
        setDate(setDateByType(tempDate, newValue, picker, period));
      }
      if (e.key >= "0" && e.key <= "9") {
        if (picker === "12hours") setPrevIntKey(e.key);

        const newValue = calculateNewValue(e.key);
        if (flag) onRightFocus?.();
        setFlag((prev) => !prev);
        const tempDate = new Date(date || new Date().setHours(0, 0, 0, 0));
        setDate(setDateByType(tempDate, newValue, picker, period));
      }
    };

    return (
      <Input
        ref={ref}
        id={id || picker}
        name={name || picker}
        className={cn(
          "w-[48px] text-center font-mono text-base tabular-nums caret-transparent text-neutral-1000",
          error && touch ? InvalidInput : "",
          className
        )}
        value={value || calculatedValue}
        onChange={(e) => {
          e.preventDefault();
          onChange?.(e);
        }}
        type={type}
        inputMode="decimal"
        onKeyDown={(e) => {
          onKeyDown?.(e);
          handleKeyDown(e);
        }}
        {...props}
      />
    );
  }
);

TimePickerInput.displayName = "TimePickerInput";

// Period Selector Component (exact logic from GitHub)
const TimePeriodSelect = React.forwardRef(
  ({ period, setPeriod, date, setDate, onLeftFocus, onRightFocus, error, touch }, ref) => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") onRightFocus?.();
      if (e.key === "ArrowLeft") onLeftFocus?.();
    };

    const handleValueChange = (value) => {
      setPeriod(value);

      /**
       * trigger an update whenever the user switches between AM and PM;
       * otherwise user must manually change the hour each time
       */
      if (date) {
        const tempDate = new Date(date);
        const hours = display12HourValue(date.getHours());
        setDate(setDateByType(tempDate, hours.toString(), "12hours", period === "AM" ? "PM" : "AM"));
      }
    };

    return (
      <div className="flex h-10 items-center">
        <Select value={period} onValueChange={handleValueChange}>
          <SelectTrigger
            ref={ref}
            className={cn(
              "w-[65px] text-neutral-1000",
              error && touch ? InvalidInput : ""
            )}
            onKeyDown={handleKeyDown}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AM">AM</SelectItem>
            <SelectItem value="PM">PM</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  }
);

TimePeriodSelect.displayName = "TimePeriodSelect";

// Main TimePicker Component
const TimePicker = React.memo(
  ({
    name = null,
    label = null,
    required = false,
    error = null,
    touch = null,
    disabled = false,
    value = null,
    date = null,
    onChange = () => {},
    className = "w-full",
    description,
    placeholder,
    autoComplete = "new-password",
    inputCustomStyle = "",
    icon = null,
  }) => {
    const [internalDate, setInternalDate] = useState(null);
    const [period, setPeriod] = useState("AM");
    const [isOpen, setIsOpen] = useState(false);

    const minuteRef = React.useRef(null);
    const hourRef = React.useRef(null);
    const periodRef = React.useRef(null);

    // Convert value to internal date format
    useEffect(() => {
      if (value) {
        let parsedDate;
        
        // Handle moment objects
        if (value && typeof value === 'object' && value._isAMomentObject) {
          parsedDate = value.toDate();
        }
        // Handle date strings longer than 7 characters (likely ISO format)
        else if (value && value.length > 7) {
          const currentMoment = moment(value);
          if (currentMoment.isValid()) {
            parsedDate = currentMoment.toDate();
          }
        }
        // Handle time strings like "12:30 PM"
        else if (value && typeof value === 'string') {
          const timeMatch = value.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)?$/i);
          if (timeMatch) {
            const [, hours, minutes, period] = timeMatch;
            parsedDate = new Date();
            let hour24 = parseInt(hours, 10);
            
            if (period) {
              if (period.toUpperCase() === 'PM' && hour24 !== 12) {
                hour24 += 12;
              } else if (period.toUpperCase() === 'AM' && hour24 === 12) {
                hour24 = 0;
              }
            }
            
            parsedDate.setHours(hour24, parseInt(minutes, 10), 0, 0);
          }
        }
        
        if (parsedDate && !isNaN(parsedDate.getTime())) {
          setInternalDate(parsedDate);
          setPeriod(parsedDate.getHours() >= 12 ? "PM" : "AM");
        }
      } else {
        setInternalDate(null);
      }
    }, [value]);

    // Handle date changes from time picker
    const handleDateChange = (newDate) => {
      if (!newDate) {
        setInternalDate(null);
        onChange(name, null);
        return;
      }

      setInternalDate(newDate);
      setPeriod(newDate.getHours() >= 12 ? "PM" : "AM");

      // Return moment object for compatibility with existing application
      // If date prop is provided, use it as the base date, otherwise use current date
      const baseDate = date ? moment(date) : moment();
      const momentObject = moment(baseDate)
        .hour(newDate.getHours())
        .minute(newDate.getMinutes())
        .second(0)
        .millisecond(0);
      
      onChange(name, momentObject);
    };

    // Format display value
    const getDisplayValue = () => {
      if (!internalDate) return "";
      const hours = display12HourValue(internalDate.getHours());
      const minutes = internalDate.getMinutes().toString().padStart(2, "0");
      const period = internalDate.getHours() >= 12 ? "PM" : "AM";
      return `${hours.padStart(2, '0')}:${minutes} ${period}`;
    };

    const handleReset = (e) => {
      e.stopPropagation();
      setInternalDate(null);
      onChange(name, null);
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
        field_description={description}
      >
        <FormPopoverButton
          open={isOpen}
          setOpen={setIsOpen}
          className={!internalDate ? "text-neutral-1000" : ""}
          invalidField={!!(error && touch)}
          disabled={disabled}
          triggerContent={
            <div className="flex justify-start w-full gap-2 items-center">
              <FormFieldIcon icon={<Clock size={16} />} />
              {internalDate ? (
                <div className="flex justify-between items-center w-full">
                  <span className="text-neutral-1000">{getDisplayValue()}</span>
                  <span
                    className="text-sm text-neutral-900 hover:text-red-500 cursor-pointer ml-2 px-2 py-0.5 border border-neutral-200 rounded-md hover:bg-white transition-colors"
                    onClick={handleReset}
                  >
                    Reset
                  </span>
                </div>
              ) : (
                <FormPlaceholder
                  placeholder={placeholder || `Enter ${label || "time"}`}
                />
              )}
            </div>
          }
          popoverContent={
            <div className="flex flex-col p-2">
              <div className="flex items-center justify-center gap-2">
                <TimePickerInput
                  picker="12hours"
                  date={internalDate}
                  setDate={handleDateChange}
                  ref={hourRef}
                  period={period}
                  error={error}
                  touch={touch}
                  onRightFocus={() => minuteRef?.current?.focus()}
                />
                <span className="text-neutral-1000">:</span>
                <TimePickerInput
                  picker="minutes"
                  date={internalDate}
                  setDate={handleDateChange}
                  ref={minuteRef}
                  error={error}
                  touch={touch}
                  onLeftFocus={() => hourRef?.current?.focus()}
                  onRightFocus={() => periodRef?.current?.focus()}
                />
                <TimePeriodSelect
                  period={period}
                  setPeriod={setPeriod}
                  date={internalDate}
                  setDate={handleDateChange}
                  ref={periodRef}
                  error={error}
                  touch={touch}
                  onLeftFocus={() => minuteRef?.current?.focus()}
                />
              </div>
            </div>
          }
        />
      </FormField>
    );
  }
);

export default TimePicker;