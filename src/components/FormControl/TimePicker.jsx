import React, { useState, useEffect } from "react";
import { FormField, InvalidInput } from "components/FormControl";
import moment from "moment";
import { Input } from "components/ui/input";
import { renderTime } from "utils/DateTimeUtils";
import { renderDate } from "utils/renderValues";

// const TimeRegex = /^[0-9:\s]*\s?(a|P|p|A|AM|PM)?$/i;
const TimeRegex = /^(0?[1-9]|1[0-2]):([0-5][0-9])\s?(AM|PM)?$/i;
const TypingRegex = /^[0-9]{0,2}(:[0-9]{0,2})?\s?(A|P|AM|PM|a|p|am|pm)?$/;

const TimePicker = ({
  name = null,
  label = null,
  required = true,
  error = null,
  touch = null,
  disabled = false,
  value = null,
  date = null,
  onChange = () => {},
  className,
  description,
  placeholder,
  autoComplete = "new-password",
  inputCustomStyle = "",
  icon = null,
}) => {
  const [time, setTime] = useState(null);

  useEffect(() => {
    if (value) {
      const currentMoment = value && value.length > 7 ? moment(value) : null;
      if (currentMoment && currentMoment.isValid) {
        const formattedTime = renderDate(currentMoment, "--", "time");
        setTime(formattedTime);
      } else setTime(value);
    } else setTime(null);
  }, [value]); // Runs whenever `value` changes
  const handleTimeChange = (inputValue) => {
    if (inputValue.length === 8) {
      const formattedTime = renderTime(inputValue, date);
      onChange(name, formattedTime ? formattedTime : inputValue);
    } else {
      onChange(name, inputValue);
    }
  };

  return (
    <>
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
        <Input
          type="text"
          maxLength={20}
          id={name}
          name={name}
          autoComplete={autoComplete}
          placeholder={placeholder || `Enter ${label || "value"}`}
          value={time ?? ""}
          disabled={disabled}
          className={error && touch ? InvalidInput : "text-neutral-1000"}
          onChange={(event) => {
            let inputValue = event.target.value;
            const isBackspace =
              event.nativeEvent.inputType === "deleteContentBackward";
            const currentKeyInput = event.nativeEvent.data;
            if (!inputValue || isBackspace) {
              onChange(name, null);
              setTime(null);
              return;
            }
            // Allow typing only if partial format is valid
            if (TypingRegex.test(inputValue)) {
              if (currentKeyInput === ":" && inputValue.length === 2)
                inputValue = "0" + inputValue;
              if (
                (currentKeyInput === "p" ||
                  currentKeyInput === "a" ||
                  currentKeyInput === "A" ||
                  currentKeyInput === "P") &&
                inputValue.length <= 5 &&
                inputValue.length > 4 &&
                inputValue.includes(":")
              ) {
                inputValue = inputValue.replace(currentKeyInput, "");
                const [hours, minutes] = inputValue.split(":");
                inputValue =
                  String(hours).padStart(2, "0") +
                  ":" +
                  String(minutes).padStart(2, "0") +
                  " " +
                  currentKeyInput.toUpperCase() +
                  "M";
              }
              if (currentKeyInput === " " && inputValue.length !== 6) return;

              // Auto-insert ":" after hours
              if (inputValue.length === 2 && !inputValue.includes(":")) {
                const hours = parseInt(inputValue);
                if (hours < 1 || hours > 12) return;
                inputValue = inputValue + ":";
              }

              // Auto-insert space after minutes
              if (inputValue.length === 5 && !inputValue.includes(" ")) {
                const [hours, minutes] = inputValue.split(":");
                if (parseInt(minutes) < 0 || parseInt(minutes) > 60) return;
                inputValue = inputValue + " ";
              }

              // Auto-complete AM/PM
              if (inputValue.length === 7) {
                const timePeriod = inputValue.charAt(6).toUpperCase();
                if (timePeriod === "A" || timePeriod === "P") {
                  inputValue = inputValue.substring(0, 6) + timePeriod + "M";
                }
              }
              setTime(inputValue);
              // Send only if fully valid
              if (TimeRegex.test(inputValue)) {
                handleTimeChange(inputValue);
              }
            }
          }}
        />
      </FormField>
    </>
  );
};

export default TimePicker;
