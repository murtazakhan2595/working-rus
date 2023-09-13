import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Datepicker = ({ onChange }) => {
    const [startDate, setStartDate] = useState(new Date());

    const InputDay = React.forwardRef(({ onClick }, ref) => (
        <button className="bg-white py-1.5 px-3 rounded-md" onClick={(e) => {
            e.stopPropagation();
            onClick(e);
        }}
            ref={ref}>
            {startDate.getDate()}
        </button>
    ));

    const InputMonth = React.forwardRef(({ onClick }, ref) => (
        <button className="bg-white py-1.5 px-3 rounded-md" onClick={(e) => {
            e.stopPropagation();
            onClick(e);
        }}
            ref={ref}>
            {startDate.toLocaleString('default', { month: 'short' })}
        </button>
    ));

    const InputYear = React.forwardRef(({ onClick }, ref) => (
        <button className="bg-white py-1.5 px-3 rounded-md" onClick={(e) => {
            e.stopPropagation();
            onClick(e);
        }}
            ref={ref}>
            {startDate.getFullYear()}
        </button>
    ));

    const handleDateChange = (date) => {
        setStartDate(date);
        if (onChange) {
            onChange(date); // Call the onChange callback with the selected date
        }
    };

    const handleDatepickerClick = (event) => {
        event.preventDefault();
    };


    return (
        <div className='flex items-center'>
            <DatePicker
                selected={startDate}
                onChange={handleDateChange}
                customInput={<InputDay />}
                onClick={handleDatepickerClick}
            />
            -
            <DatePicker
                selected={startDate}
                onChange={handleDateChange}
                customInput={<InputMonth />}
                onClick={handleDatepickerClick}
            />
            -
            <DatePicker
                selected={startDate}
                onChange={handleDateChange}
                customInput={<InputYear />}
                onClick={handleDatepickerClick}
            />
        </div>
    );
};

export default React.memo(Datepicker);
