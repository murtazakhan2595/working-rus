import React from "react";
import Select from "react-select";
import { FormGroup, Label, Input, Button, Col } from "reactstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import upload from "../assets/images/upload.png";
import { TfiFiles } from 'react-icons/tfi'
import { dropdownStyles } from "../data/Data";
import { IoIosSearch } from "react-icons/io";
import { File } from "../app/utils/Types/General";

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
                value={options ? options.find((option) => option.value === value) : ""}
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
    const date = new Date(moment(value));
    return (
        <>
            <FormGroup>
                <DatePicker
                    name={name}
                    id={name}
                    isDisabled={disabled}
                    className={`form-control ${error && touch ? 'is-invalid' : ''}`}
                    value={date && !isNaN(date.getTime()) ? date : ''}
                    selected={date && !isNaN(date.getTime()) ? date : new Date()}
                    dropdownMode="select"
                    onChange={(value) => {
                        value = moment(value).format('YYYY-MM-DD');
                        onChange(name, value)
                    }}
                    placeholderText={label}
                    showMonthDropdown
                    showYearDropdown
                    dateFormat="dd-MM-yyyy"
                />
                {error && touch && (
                    <div className="invalid-feedback d-block">
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

const CheckBoxInput = ({ name, value, onChange, label, disabled }) => {
    return (
        <>
            <FormGroup check className="my-3">
                <Input
                    id={name}
                    type="checkbox"
                    checked={value}
                    value={value}
                    disabled={disabled}
                    onChange={() => {
                        onChange(name, !value);
                    }}
                />
                {' '}
                <Label check>
                    {label}
                </Label>
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
                    value={value ? value : ''}
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

const CustomDarkButton = ({ label, onClick, disabled, style }) => {
    return (
        <Button
            className="btn btn-dark"
            onClick={onClick}
            disabled={disabled}
            style={style}
        >
            {label}
        </Button>
    );
};

const CustomLightOutlineButton = ({ label, onClick, disabled, style }) => {
    return (
        <Button
            type="button"
            className="btn btn-outline-dark btn-light"
            style={style}
            onClick={onClick}
            disabled={disabled}
        >
            {label}
        </Button>
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
const FileInput = ({ value, error, setImageError, onChange, touch, name, label, acceptType }) => {
    return (
        <>
            <div className="flex flex-col bg-[#F5F5FA] text-center file-input mb-3" style={{ padding: '4rem 2rem', borderRadius: '12px' }}>
                <h4>
                    <TfiFiles className="m-auto mb-3" />
                    {`Upload Your ${label || 'file'} or Drag it Here`}
                </h4>
                <label
                    htmlFor={name}
                    className="cursor-pointer opacity-70 rounded-lg text-input mt-3"
                >
                    <input
                        id={name}
                        type="file"
                        name={name}
                        accept={acceptType || "*/*"}
                        max-size="104857600"
                        onChange={(e) => {
                            console.log(value);
                            let selectedFile = e.target.files[0];
                            const fileData = { name: selectedFile?.name };
                            if (selectedFile) {
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                    debugger
                                    const newDocument = {
                                        name: fileData.name,
                                        file: e.target.result,
                                    }
                                    if (value && value.id) {
                                        value.document = newDocument;
                                        value.name = fileData.name;
                                    } else {
                                        value = newDocument;
                                    }
                                    onChange(name, value)

                                };

                                reader.readAsDataURL(selectedFile);
                            }
                        }}
                        style={{ position: 'relative' }}
                    />
                </label>
                <br />
            </div>
            {error && touch && (
                <div className="text-red-500 text-sm">
                    {error}
                </div>
            )}
        </>
    );
};

const TextAreaInput = ({ name, value, error, touch, onChange, label, disabled, required, regEx, maxLength }) => {
    return (
        <>
            <FormGroup floating>
                <Input
                    type="textarea"
                    maxLength={maxLength ?? '100'}
                    id={name}
                    name={name}
                    autoComplete="Off"
                    placeholder={'Enter' + label}
                    value={value}
                    rows={5}
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


const FilterInput = ({ filters }) => {
    return (
        <>
            <div className="flex items-center gap-x-3 mb-4">
                {filters && filters.map((filter, index) => {
                    if (filter.type === 'search') {
                        return (
                            <div className="relative">
                                <IoIosSearch className="absolute top-3 left-3 text-baseGray" />
                                <input
                                    type="search"
                                    placeholder={filter.placeholder}
                                    className="focus:outline-none focus:border-non bg-[#FAFBFC] py-2 pl-10 shadow-input placeholder-[#5C5E64] border-none w-56 rounded-md"
                                />
                            </div>
                        )
                    } if (filter.type === 'select') {
                        return (
                            <Select
                                options={filter.option}
                                placeholder={filter.placeholder}
                                className="w-[20%] shadow-input rounded-lg"
                                styles={dropdownStyles}
                            />
                        )
                    }

                })}
            </div>
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
    TextAreaInput,
    CustomDarkButton,
    FileInput,
    FilterInput,
    CustomLightOutlineButton,
    CheckBoxInput,
}
