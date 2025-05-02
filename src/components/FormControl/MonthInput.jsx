"use client";
import React, { useEffect, useRef, useState } from "react";
import { Calendar as LucideCalendar } from "lucide-react";
import {
  FormField,
  FormPopoverButton,
  FormPlaceholder,
  FormFieldIcon,
} from "components/FormControl";
import { format, parse, isValid } from "date-fns";
import { SelectInputComponent } from "./InputSelect";
import { createDropdownOptions } from "utils/Lists";
import moment from "moment";
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
function MonthInput({
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
}) {
  const displayPattern = "MMMM yyyy";
  const [selectedDate, setSelectedDate] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const currentYear = new Date().getFullYear();
  const YearsList = React.useMemo(
    () =>
      createDropdownOptions(
        Array.from({ length: 10 }, (_, i) => currentYear - 5 + i)
      ),
    [currentYear]
  );

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    if (value) {
      const dateObj = new Date(value);
      const year = dateObj.getFullYear();
      const monthIndex = dateObj.getMonth(); // 0-based index (0 = Jan)
      setSelectedYear(year);
      setSelectedMonth(months[monthIndex]);
      setSelectedDate(`${months[monthIndex]} ${year}`);
    }
  }, [value]);

  // Close dropdown when clicking outside the calendar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle selection of a month
  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    setSelectedDate(`${month} ${selectedYear}`);
    const formattedMoment = moment(
      `${month} ${selectedYear}`,
      "MMM YYYY"
    ).startOf("month");

    onChange(name, formattedMoment.format("YYYY-MM-DD"));
    setIsOpen(false);
  };

  // Handle year dropdown selection
  const handleYearChange = (e) => {
    setSelectedYear(e);
  };
  const resetFields = (callOnChange = true) => {
    // setDate(null);
    // setInputValue("");
    // setCalendarDate(null);
    // if (callOnChange) {
    //   onChange(name, ""); // Reset the form value
    // }
    // setIsOpen(false);
  };

  const handleReset = (e) => {
    e.stopPropagation(); // Prevent the popover from opening
    resetFields();
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
      >
        <FormPopoverButton
          open={isOpen}
          setOpen={setIsOpen}
          className={!selectedDate ? "text-neutral-1000" : ""}
          invalidField={!!(error && touch)}
          disabled={disabled}
          triggerContent={
            <div className="flex justify-start w-full gap-2 items-center">
              <FormFieldIcon icon={<LucideCalendar size={16} />} />
              {selectedDate ? (
                <div className="flex justify-between items-center w-full">
                  <span>{format(selectedDate, displayPattern)}</span>
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
                  placeholder={placeholder ? placeholder : "Select Month"}
                />
              )}
            </div>
          }
          popoverContent={
            <div className="px-6 py-4">
              {/* Year selector */}
              <div className="flex justify-between items-center mb-4">
                <SelectInputComponent
                  name={"year"}
                  value={selectedYear}
                  options={YearsList}
                  onChange={(_, value) => {
                    handleYearChange(value);
                  }}
                />
              </div>

              {/* Grid of months */}
              <div className="grid gap-2 grid-cols-3">
                {months.map((month) => (
                  <button
                    key={month}
                    onClick={() => handleMonthSelect(month)}
                    className={`p-1 text-center rounded hover:bg-slate-300 transition ${
                      selectedMonth === month
                        ? "bg-slate-1000 text-white font-medium"
                        : ""
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            </div>
          }
        />
      </FormField>
    </>
  );
}

export default MonthInput;
