
import React, { useState } from "react";
// import Select from "react-select";
import { Label } from "../src/@/components/ui/label"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import upload from "../assets/images/upload.png";
import { TfiFiles } from "react-icons/tfi";
import { IoIosSearch } from "react-icons/io";
import { countryCodesOptions } from "../data/CountryCode";
import ReactQuill from "react-quill";
import CheckboxMenu from "./SortingFilters";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectGroup, SelectContent, SelectItem } from "../src/@/components/ui/select"


const SelectComponent = ({
  name,
  value,
  error,
  touch,
  onChange,
  options,
  label,
  disabled,
  required,
}) => {
  return (
    <div >
      <Label for={name}>{required && <span className="text-red-600">* </span>} {label}</Label>
      {error && touch && <div className="invalid-feedback">{error || ""}</div>}
      <Select>
        <SelectTrigger>
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

    </div>
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
  required,
}) => {
  return (
    <div>
         <Label
        className={`text-baseGray ${value ? "date-floating-label" : ""}`}
        for={name}
      >
        {required && <span className="text-red-600">* </span>} {label}
      </Label>
      {error && touch && <div className="invalid-feedback">{error}</div>}
      <Select>
        <SelectTrigger>
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
   
    </div>

  );
};

const DateInput = ({
  name,
  value,
  error,
  touch,
  onChange,
  label,
  disabled,
  required,
  minDate,
}) => {
  const date = value ? new Date(moment(value)) : null;
  return (
    <>
      <div>
      <Label
          className={`text-baseGray ${value ? "date-floating-label" : ""}`}
          for={name}
        >
          {required && <span className="text-red-600">* </span>} {label}
        </Label>
        {error && touch && (
          <div className="invalid-feedback d-block">{error}</div>
        )}
        <DatePicker
          name={name}
          id={name}
          autoComplete="off"
          minDate={minDate}
          disabled={disabled}
          className={`form-control ${error && touch ? "is-invalid" : ""} ${value ? "border-mauve-600" : ""
            }`}
          value={date && !isNaN(date.getTime()) ? date : ""}
          selected={date && !isNaN(date.getTime()) ? date : new Date()}
          dropdownMode="select"
          placeholder={`${label}`}
          onChange={(value) => {
            if (value) {
              value = moment(value).format("YYYY-MM-DD");
              onChange(name, value);
            } else {
              onChange(name, "");
            }
          }}
          showMonthDropdown
          showYearDropdown
          dateFormat="dd-MM-yyyy"
        />
       
      </div>
    </>
  );
};

const TextInput = ({
  name,
  value,
  error,
  touch,
  onChange,
  label,
  disabled,
  required,
  regEx,
  maxLength,
}) => {
  return (
    <>
      <div>
        <Label className="" htmlFor={name}>
          {required && <span className="text-red-600">* </span>}
          {label}
        </Label>
        <Input
          type="text"
          maxLength={maxLength ?? "100"}
          id={name}
          name={name}
          autoComplete="Off"
          placeholder={"Enter" + label}
          value={value ?? ""}
          disabled={disabled}
          className={error && touch ? "is-invalid" : ""}
          onChange={(option) => {
            const value = option.target.value;
            if (regEx) {
              if (!value || regEx.test(value)) {
                onChange(name, value);
              }
            } else {
              onChange(name, value);
            }
          }}
        />


        {error && touch && <div className="invalid-feedback">{error}</div>}
      </div>
    </>
  );
};

const CheckBoxInput = ({ name, value, onChange, label, disabled }) => {
  return (
    <>
      <div>
        <Label check>{label}</Label>
        <Input
          id={name}
          type="checkbox"
          checked={value}
          value={value}
          style={{ boxShadow: "none" }}
          disabled={disabled}
          onChange={() => {
            onChange(name, !value);
          }}
        />{" "}

      </div>
    </>
  );
};



const PhoneNumberInput = ({ name, disabled, label, error, touch, onChange }) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState('');
  const [inputValue, setInputValue] = useState('');

  const handleSelectChange = (value) => {
    const selectedOption = countryCodesOptions.find(option => option.value === value);
    if (selectedOption) {
      setSelectedCountryCode(selectedOption.code);
      setInputValue(selectedOption.code); // Set input value to country code
    }
  };

  const handleInputChange = (event) => {
    const regExTelephone = /^[0-9-]+$/;
    let value = event.target.value;
    value = value.replace(selectedCountryCode, "");
    if (value.includes("+")) {
      value = "";
    }
    if (!value || regExTelephone.test(value)) {
      setInputValue(selectedCountryCode + value);
      onChange(name, value);
    }
  };

  return (
    <div className="">
      <Label check>{label}</Label>
      <div class="grid grid-cols-6 gap-0">
        <div class="col-start-1 col-span-2 "><Select onValueChange={handleSelectChange}>
          <SelectTrigger className="">
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            {countryCodesOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select></div>
        <div class="col-start-3 col-span-4"> <Input
          id={name}
          name={name}
          disabled={disabled}
          autoComplete="Off"
          placeholder={"Enter " + label}
          value={inputValue}
          className={error && touch ? "is-invalid" : ""}
          onChange={handleInputChange}
        />
        </div></div>
    </div>

  );
};

const EmailInput = ({
  name,
  value,
  error,
  touch,
  onChange,
  label,
  disabled,
  required,
}) => {
  return (
    <>
      <div>
        <Label className="text-baseGray" htmlFor={name}>
          {required && <span className="text-red-600">* </span>}
          {label}
        </Label>
        <Input
          type="email"
          maxLength="100"
          id={name}
          name={name}
          autoComplete="Off"
          placeholder={"Enter" + label}
          value={value}
          className={error && touch ? "is-invalid" : ""}
          onChange={(option) => {
            const regExTelephone = /^[A-Za-z0-9.@]+$/;
            const value = option.target.value;
            if (!value || regExTelephone.test(value)) onChange(name, value);
          }}
        />

        {error && touch && <div className="invalid-feedback">{error}</div>}
      </div>
    </>
  );
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

const CustomDarkButton = ({ label, onClick, disabled, style, className }) => {
  return (
    <Button
      className={`btn btn-dark ${className ?? ""}`}
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
        className="flex my-3 overflow-hidden font-bold text-center cursor-pointer rounded-3xl"
      >
        <div className="relative flex flex-row items-center justify-start w-full h-full border-solid rounded-3xl">
          <div className="relative overflow-hidden w-[110px]">
            {value?.file ? (
              <img
                src={value.file}
                alt="Preview"
                className="h-[100px] object-cover border-2 border-gray-400 rounded-full"
                width={"100px"}
              />
            ) : (
              <img
                src={upload}
                alt="Default"
                className="h-[100px] block mx-auto border-2 border-gray-400 rounded-full"
                width={"100px"}
              />
            )}
          </div>
          <div className="text-sm text-left">
            <div>
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
                className="mb-2 form-control"
                style={{ minHeight: "auto", fontSize: "12px" }}
              />
              {error && touch && (
                <div className="invalid-feedback">{error}</div>
              )}
            </div>
            <span
              className="fw-lighter"
              style={{ minHeight: "auto", fontSize: "12px" }}
            >
              JPEG or PNG. Max size of 100KB
            </span>
          </div>
        </div>
      </label>
    </>
  );
};
const FileInput = ({
  value,
  error,
  onChange,
  touch,
  name,
  label,
  acceptType,
}) => {
  return (
    <>
      <div
        className="flex flex-col bg-[#F5F5FA] text-center file-input mb-3"
        style={{ padding: "4rem 2rem", borderRadius: "12px" }}
      >
        <h4>
          <TfiFiles className="m-auto mb-3" />
          {`Upload Your ${label || "file"}`}
        </h4>
        <Label
          htmlFor={name}
          className="mt-3 rounded-lg cursor-pointer opacity-70 text-input"
          style={{
            width: "fit-content",
            margin: "auto",
            position: "relative",
          }}
        >
          <Input
            id={name}
            type="file"
            name={name}
            accept={acceptType || "*/*"}
            max-size="104857600"
            onChange={(e) => {
              let selectedFile = e.target.files[0];
              const fileData = { name: selectedFile?.name };
              if (selectedFile) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  const newDocument = {
                    name: fileData.name,
                    file: e.target.result,
                  };
                  if (value && value.id) {
                    value.document = newDocument;
                    value.name = fileData.name;
                  } else {
                    value = newDocument;
                  }
                  onChange(name, value);
                };

                reader.readAsDataURL(selectedFile);
              }
            }}
            style={{ position: "relative" }}
          />
          {value?.name && (
            <span
              style={{
                fontSize: "13px",
                width: "176px",
                left: "140px",
                minHeight: "40px",
              }}
              className="bg-[#F5F5FA] absolute"
            >
              {value?.name}
            </span>
          )}
        </Label>
        <br />
      </div>
      {error && touch && <div className="text-sm text-red-500">{error}</div>}
    </>
  );
};

const TextAreaInput = ({
  name,
  value,
  error,
  touch,
  onChange,
  label,
  disabled,
  required,
  regEx,
  maxLength,
  maxRows,
}) => {
  return (
    <>
      <div>
      <Label
          className={`text-baseGray ${value ? "active" : ""}`}
          htmlFor={name}
        >
          {required && <span className="text-red-600">* </span>}
          {label}
        </Label>
        {error && touch && <div className="invalid-feedback">{error}</div>}
        <Input
          type="textarea"
          maxLength={maxLength ?? "5000"}
          id={name}
          name={name}
          autoComplete="Off"
          placeholder={"Enter " + label}
          value={value}
          rows={maxRows ?? 1}
          disabled={disabled}
          className={`h-auto ${error && touch ? "is-invalid" : ""}`}
          onChange={(option) => {
            const value = option.target.value;
            if (regEx) {
              if (!value || regEx.test(value)) onChange(name, value);
            } else {
              onChange(name, value);
            }
          }}
        />
      
      </div>
    </>
  );
};
const TextAreaEditorInput = ({
  name,
  value,
  error,
  touch,
  onChange,
  label,
  disabled,
  required,
  regEx,
  maxLength,
}) => {
  return (
    <>
      <div>
      <Label className="pt-4 mt-1 text-baseGray" htmlFor={name}>
          {required && <span className="text-red-600">* </span>}
          {label}
        </Label>

        {error && touch && <div className="invalid-feedback">{error}</div>}
        <ReactQuill
          type="textarea"
          id={name}
          name={name}
          autoComplete="Off"
          placeholder={"Enter " + label}
          value={value}
          modules={{
            toolbar: {
              container: [
                ["bold", "italic", "underline"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link"],
                [{ align: "" }, { align: "center" }, { align: "right" }],
              ],
            },
          }}
          formats={[
            "bold",
            "italic",
            "underline",
            "list",
            "bullet",
            "link",
            "align",
          ]}
          readOnly={disabled}
          className={`rounded ${error && touch ? "is-invalid" : ""}`}
          onChange={(option) => {
            onChange(name, option);
          }}
        />
       
      </div>
    </>
  );
};

function dropdownStyles(backgroundColor, fontSize, height) {
  return {
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    control: (provided, state) => ({
      ...provided,
      backgroundColor: backgroundColor,
      border: "none",
      boxShadow: "none",
      minWidth: "8rem",
      fontSize: fontSize,
      minHeight: height,
      maxHeight: height,
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: fontSize,
      fontWeight: state.isSelected ? "bold" : "normal",
      color: state.isSelected ? "#000" : "#777",
      padding: "8px 12px",
      backgroundColor: state.isSelected ? "#FAFBFC" : "#FAFBFC",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "8px",
      overflow: "hidden",
    }),
    scrollbarWidth: (base) => ({
      ...base,
      borderRadius: "8px",
      backgroundColor: "#FAFBFC",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#555",
    }),
  };
}

const FilterInput = ({ filters, onChange, isClearable = true }) => {
  const classNamesStyle =
    "focus:outline-none focus:border-non bg-[#FAFBFC] py-2 pl-2 shadow-input placeholder-[#5C5E64] border-none rounded-md";
  const width = "w-56";
  const height = "h-[38px]";
  return (
    <>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-3">
        {filters &&
          filters.map((filter, index) => {
            if (filter.type === "search") {
              return (
                <div className="relative" key={index}>
                  <IoIosSearch className="absolute top-[30%] left-3 text-baseGray" />
                  <input
                    type="search"
                    style={{ paddingLeft: "2.5rem" }}
                    placeholder={filter.placeholder}
                    className={`${filter.className ?? classNamesStyle} ${filter.width ?? width
                      } ${filter.height ?? height}`}
                    name={filter.name}
                    id={filter.name}
                    onChange={(option) => {
                      onChange(filter.name, option.target.value);
                    }}
                  />
                </div>
              );
            } else if (filter.type === "text") {
              return (
                <input
                  key={index}
                  type="text"
                  placeholder={filter.placeholder}
                  className={`${filter.className ?? classNamesStyle} ${filter.width ?? width
                    } ${filter.height ?? height}`}
                  name={filter.name}
                  id={filter.name}
                  onChange={(option) => {
                    onChange(filter.name, option.target.value);
                  }}
                />
              );
            } else if (filter.type === "select") {
              return (
                <Select
                  key={index}
                  options={filter.option}
                  placeholder={filter.placeholder}
                  className={`${!filter.className && "shadow-input"
                    } rounded-lg`}
                  styles={dropdownStyles(
                    filter?.className?.backgroundColor ?? "#fafbfc",
                    filter?.className?.fontSize ?? "16px",
                    filter?.className?.height ?? "38px"
                  )}
                  name={filter.name}
                  defaultValue={filter.option.find(
                    (obj) => obj.value === filter.defaultValue
                  )}
                  id={filter.name}
                  onChange={(option) => {
                    onChange(filter.name, option?.value);
                  }}
                  isClearable={isClearable}
                />
              );
            } else if (filter.type === "date") {
              const date = filter.value ? new Date(moment(filter.value)) : null;
              return (
                <div style={{ width: "fit-content" }}>
                  <DatePicker
                    key={index}
                    name={filter.name}
                    id={filter.name}
                    className={`${filter.className ?? classNamesStyle} ${filter.width ?? width
                      } ${filter.height ?? height}`}
                    dropdownMode="select"
                    placeholderText={filter.placeholder}
                    value={date}
                    selected={date}
                    autoComplete="off"
                    onChange={(value) => {
                      if (value) {
                        value = moment(value).format("YYYY-MM-DD");
                        onChange(filter.name, value);
                      } else {
                        onChange(filter.name, null);
                      }
                    }}
                    showMonthDropdown
                    showYearDropdown
                    dateFormat="dd-MM-yyyy"
                  />
                </div>
              );
            } else if (filter.type === "sorting") {
              return (
                <CheckboxMenu
                  key={index}
                  items={filter.option}
                  onChange={(name, value, filterCheckStatus) => {
                    onChange(name, value, filterCheckStatus);
                  }}
                  values={filter.values}
                  mainHeading={filter.mainHeading}
                  label={filter.placeholder}
                  className={filter.className ?? null}
                />
              );
            } else {
              return <div key={index}></div>;
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
  PhoneNumberInput,
  EmailInput,
  ImageInput,
  CustomButton,
  TextAreaInput,
  CustomDarkButton,
  FileInput,
  FilterInput,
  CustomLightOutlineButton,
  CheckBoxInput,
  TextAreaEditorInput,
};