import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Datepicker = ({ onChange, day = null, month = null, year = null , disabled = false }) => {
  const [startDate, setStartDate] = useState(new Date());

  const InputDay = React.forwardRef(({ onClick }, ref) => (
    <button
      type="button"
      className={`${disabled ? "text-gray-500 cursor-default" :"text-black"} bg-white py-1.5 px-3 rounded-md`}
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      ref={ref}
    >
      {day === null ? startDate.getDate() : day}
    </button>
  ));

  const InputMonth = React.forwardRef(({ onClick }, ref) => (
    <button
      type="button"
      className={`${disabled ? "text-gray-500 cursor-default" :"text-black"} bg-white py-1.5 px-3 rounded-md`}
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      ref={ref}
    >
      {month === null ? startDate.getMonth() + 1 : month}
    </button>
  ));

  const InputYear = React.forwardRef(({ onClick }, ref) => (
    <button
      type="button"
      className={`${disabled ? "text-gray-500 cursor-default" :"text-black"} bg-white py-1.5 px-3 rounded-md`}
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      ref={ref}
    >
      {year === null ? startDate.getFullYear() : year}
    </button>
  ));

  const handleDateChange = (date) => {
    setStartDate(date);
    if (onChange) {
      onChange(date);
    }
  };

  const handleDatepickerClick = (event) => {
    event.preventDefault();
  };

  return (
    <div className="flex items-center">
      <DatePicker
        selected={startDate}
        onChange={handleDateChange}
        customInput={<InputDay />}
        showMonthDropdown
        disabled={disabled}
        showYearDropdown
        dropdownMode="select"
        onClick={handleDatepickerClick}
        />
      -
      <DatePicker
        selected={startDate}
        onChange={handleDateChange}
        customInput={<InputMonth />}
        disabled={disabled}
        peekNextMonth
        showMonthDropdown
        dropdownMode="select"
        onClick={handleDatepickerClick}
        />
      -
      <DatePicker
        selected={startDate}
        onChange={handleDateChange}
        customInput={<InputYear />}
        disabled={disabled}
        dropdownMode="select"
        showYearDropdown
        onClick={handleDatepickerClick}
      />
    </div>
  );
};

export default React.memo(Datepicker);
