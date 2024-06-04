import React from "react";
import Select from "react-select";
import { FormGroup, Label, Input, Button } from "reactstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import upload from "../assets/images/upload.png";

const SelectComponent = ({
    name,
    value,
    error,
    touch,
    onChange,
    options,
    label,
    disabled,
}) => {
    return (
        <FormGroup>
            <Select
                name={name}
                isDisabled={disabled}
                id={name}
                className={`custom-select-input form-control ${error && touch ? "is-invalid" : ""
                    }`}
                options={options ? options : []}
                value={options ? options.find((option) => option.label === value) : ""}
                onChange={(selectedOption) => onChange(name, selectedOption.value)}
                placeholder={label}
            />
            {error && touch && <div className="invalid-feedback">{error}</div>}
        </FormGroup>
    );
};
const SelectMultiInputComponent = ({
    name,
    value,
    error,
    touch,
    onChange,
    options,
    label,
    disabled,
}) => {
    return (
        <FormGroup>
            <Select
                name={name}
                id={name}
                isDisabled={disabled}
                className={`custom-select-input form-control ${error && touch ? "is-invalid" : ""
                    }`}
                options={options ? options : []}
                value={value ? value : ""}
                onChange={(selectedOption) => {
                    onChange(name, selectedOption);
                }}
                placeholder={label}
                isMulti={true}
                noOptionsMessage={() => "No such employee found"}
            />
            {error && touch && <div className="invalid-feedback">{error}</div>}
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
                    value={value ? moment(value) : ''}
                    selected={value}
                    dropdownMode="select"
                    onChange={(value) => {
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

const TextInput = ({ name, value, error, touch, onChange, label, disabled, required, regEx }) => {
    return (
        <>
            <FormGroup floating>
                <Input
                    type="text"
                    maxLength="100"
                    id={name}
                    name={name}
                    autoComplete="Off"
                    placeholder={'Enter' + label}
                    value={value}
                    disabled={disabled}
                    className={error && touch ? 'is-invalid' : ''}
                    onChange={(option) => {
                        const value = option.target.value;
                        if (regEx) {
                            if (!value || regEx.test(value))
                                onChange(name, value);
                        } else {
                            onChange(name, value);
                        }
                    }}
                />
                <Label htmlFor="address">
                    {required && <span className="text-danger">* </span>}{label}
                </Label>

                {error && touch && (
                    <div className="invalid-feedback">
                        {error}
                    </div>
                )}
            </FormGroup>
        </>
    );
};

const PhoneInput = ({ name, value, error, touch, onChange, label, disabled, required }) => {
    return (
        <>
            <FormGroup floating>
                <Input
                    type="text"
                    maxLength="100"
                    id={name}
                    name={name}
                    autoComplete="Off"
                    placeholder={'Enter' + label}
                    value={value}
                    className={error && touch ? 'is-invalid' : ''}
                    onChange={(option) => {
                        const regExTelephone = /^[0-9-+]+$/;
                        const value = option.target.value;
                        if (!value || regExTelephone.test(value))
                            onChange(name, value);
                    }}
                />
                <Label htmlFor="address">
                    {required && <span className="text-danger">* </span>}{label}
                </Label>

                {error && touch && (
                    <div className="invalid-feedback">
                        {error}
                    </div>
                )}
            </FormGroup>
        </>
    );
};

const EmailInput = ({ name, value, error, touch, onChange, label, disabled, required }) => {
    return (
        <>
            <FormGroup floating>
                <Input
                    type="email"
                    maxLength="100"
                    id={name}
                    name={name}
                    autoComplete="Off"
                    placeholder={'Enter' + label}
                    value={value}
                    className={error && touch ? 'is-invalid' : ''}
                    onChange={(option) => {
                        const regExTelephone = /^[A-Za-z0-9.@]+$/;
                        const value = option.target.value;
                        if (!value || regExTelephone.test(value))
                            onChange(name, value);
                    }}
                />
                <Label htmlFor="address">
                    {required && <span className="text-danger">* </span>}{label}
                </Label>
            </FormGroup>
        </>
    )
};
const CustomButton = ({ label, onClick, disabled }) => {
    return (
        <div className="flex justify-end">
            <Button
                className="bg-[#323333] text-[#F7F8FA] w-40 h-12 font-lato text-base font-semibold"
                onClick={onClick}
                disabled={disabled}
            >
                {label}
            </Button>
        </div>
    );
};

const ImageInput = ({ value, error, setImageError, onChange, touch, name }) => {
    return (
        <>
            <label
                htmlFor="file-upload"
                className="flex cursor-pointer text-center overflow-hidden font-bold rounded-3xl my-3"
            >
                <div className="w-full h-full flex flex-row justify-start  items-center border-solid rounded-3xl relative">
                    <div className="relative overflow-hidden w-[110px]">
                        {value?.file ? (
                            <img
                                src={value.file}
                                alt="Preview"
                                className="h-[100px] object-cover border-2 border-gray-400 rounded-full"
                                width={'100px'}
                            />
                        ) : (
                            <img
                                src={upload}
                                alt="Default"
                                className="h-[100px] block mx-auto border-2 border-gray-400 rounded-full"
                                width={'100px'}
                            />
                        )}
                    </div>
                    <div className="text-sm text-left">
                        <FormGroup>
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const selectedFile = e.target.files[0];
                                    if (selectedFile) {
                                        // Check file size
                                        const maxSize = 1024 * 1024; // 1 MB in bytes
                                        if (selectedFile.size > maxSize) {
                                            // File size exceeds 1 MB, handle error
                                            setImageError("Please upload a file smaller than 1 MB.");
                                            return;
                                        }

                                        const reader = new FileReader();
                                        reader.onload = (e) => {
                                            onChange(name, {
                                                name: selectedFile.name,
                                                file: e.target.result,
                                            });
                                        };
                                        reader.readAsDataURL(selectedFile);
                                    }
                                }}
                                className="form-control mb-2"
                                style={{ minHeight: 'auto', fontSize: '12px' }}
                            />
                            {error && touch && (
                                <div className="invalid-feedback">
                                    {error}
                                </div>
                            )}
                        </FormGroup>
                        <span className='fw-lighter' style={{ minHeight: 'auto', fontSize: '12px' }} >JPEG or PNG. Max size of 100KB</span>
                    </div>
                </div>

            </label>

        </>
    );
};
export {

    SelectComponent,
    SelectMultiInputComponent,
    DateInput,
    TextInput,
    PhoneInput,
    EmailInput,
    ImageInput,
    CustomButton,
}
