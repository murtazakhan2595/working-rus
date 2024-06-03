import React from 'react';
import Select from 'react-select';
import { FormGroup, Label, Input } from 'reactstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const SelectComponent = ({
    name, value, error, touch, onChange, options, label, disabled }) => {
    return (
        <FormGroup>
            <Select
                name={name}
                isDisabled={disabled}
                id={name}
                className={`custom-select-input form-control ${error && touch ? 'is-invalid' : ''}`}
                options={options ? options : []}
                value={options ? options.find(option => option.label === value) : ''}
                onChange={selectedOption => onChange(name, selectedOption.value)}
                placeholder={label}
            />
            {error && touch && (
                <div className="invalid-feedback">
                    {error}
                </div>
            )}
        </FormGroup>
    );
};
const SelectMultiInputComponent = ({ name, value, error, touch, onChange, options, label, disabled }) => {
    return (
        <FormGroup>
            <Select
                name={name}
                id={name}
                isDisabled={disabled}
                className={`custom-select-input form-control ${error && touch ? 'is-invalid' : ''}`}
                options={options ? options : []}
                value={value ? value : ''}
                onChange={(selectedOption) => {
                    debugger
                    onChange(name, selectedOption)
                }}
                placeholder={label}
                isMulti={true}
                noOptionsMessage={() => "No such employee found"}
            />
            {error && touch && (
                <div className="invalid-feedback">
                    {error}
                </div>
            )}
        </FormGroup>
    );
};


const DateInput = ({ name, value, error, touch, onChange, label, disabled }) => {
    return (
        <>
            <FormGroup>
                <DatePicker
                    name={name}
                    id={name}
                    isDisabled={disabled}
                    className={`form-control ${error && touch ? 'is-invalid' : ''}`}
                    value={value ? value : ''}
                    selected={value}
                    dropdownMode="select"
                    onChange={(value) => {
                        debugger
                        onChange(name, value)
                    }}
                    placeholderText={label}
                    showMonthDropdown
                    showYearDropdown
                    dateFormat="dd-MM-yyyy"
                />
                {error && touch && (
                    <div className="invalid-feedback">
                        {error}
                    </div>
                )}
            </FormGroup>
        </>
    );
};
export {
    SelectComponent,
    SelectMultiInputComponent,
    DateInput,
}
