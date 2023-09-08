import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Datepicker = ({ onChange }) => {
    const [startDate, setStartDate] = useState(new Date());

    const InputDay = React.forwardRef(({ onClick }, ref) => (
        <button className="bg-white py-1.5 px-3 rounded-md" onClick={onClick} ref={ref}>
            {startDate.getDate()}
        </button>
    ));

    const InputMonth = React.forwardRef(({ onClick }, ref) => (
        <button className="bg-white py-1.5 px-3 rounded-md" onClick={onClick} ref={ref}>
            {startDate.toLocaleString('default', { month: 'short' })}
        </button>
    ));

    const InputYear = React.forwardRef(({ onClick }, ref) => (
        <button className="bg-white py-1.5 px-3 rounded-md" onClick={onClick} ref={ref}>
            {startDate.getFullYear()}
        </button>
    ));

    const handleDateChange = (date) => {
        setStartDate(date);
        if (onChange) {
            onChange(date); // Call the onChange callback with the selected date
        }
    };

    return (
        <div>
            <DatePicker
                selected={startDate}
                onChange={handleDateChange}
                customInput={<InputDay />}
            />
            -
            <DatePicker
                selected={startDate}
                onChange={handleDateChange}
                customInput={<InputMonth />}
            />
            -
            <DatePicker
                selected={startDate}
                onChange={handleDateChange}
                customInput={<InputYear />}
            />
        </div>
    );
};

export default React.memo(Datepicker);
