import React, { useState, useEffect } from "react";
import { Input } from "components/ui/input";
import {
  FormField,
  InvalidInput,
  SelectInputComponent,
} from "components/FormControl";

const PhoneNumberInput = React.memo(
  ({
    name,
    value,
    error,
    touch,
    onChange,
    label,
    disabled,
    required,
    placeholder,
    autoComplete = "new-password",
    className = "w-full", // Custom styling
    countryOptions,
    countryCodeName,
    countryCode,
  }) => {
    const [selectedCountryCode, setSelectedCountryCode] = useState(null);
    const [inputValue, setInputValue] = useState(value || "");
    const [searchQuery, setSearchQuery] = useState("");

    // Sync state with countryCode prop
    useEffect(() => {
      const selectedOption = countryOptions.find(
        (option) => option.value === countryCode
      );
      if (selectedOption) {
        setSelectedCountryCode(selectedOption);
        setInputValue((prev) =>
          prev.startsWith(`+${selectedOption.value}`)
            ? prev
            : `+${selectedOption.value}`
        );
      }
    }, [countryCode, countryOptions]);

    useEffect(() => {
      if (value !== undefined && selectedCountryCode) {
        const formattedValue = `+${selectedCountryCode.value}${value ?? ""}`;
        setInputValue(formattedValue);
      }
    }, [value, selectedCountryCode]);

    // Handles the country code selection
    const handleSelectChange = (value) => {
      const selectedOption = countryOptions.find(
        (option) => option.value === value
      );
      if (selectedOption) {
        setSelectedCountryCode(selectedOption);
        // setInputValue(`+${selectedOption.value}`); // Update the input with the selected country code
        onChange(countryCodeName, selectedOption.value); // Notify parent about country code change
      }
    };

    // Handles the phone number input change
    const handleInputChange = (event) => {
      const regExTelephone = /^[0-9-]+$/;
      const strippedValue = event.target.value.replace(
        `+${selectedCountryCode?.value || ""}`,
        ""
      );

      if (!strippedValue || regExTelephone.test(strippedValue)) {
        setInputValue(`+${selectedCountryCode?.value || ""}${strippedValue}`);
        onChange(name, strippedValue); // Send the stripped value (without country code) to the parent
      }
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
      >
        <div className="flex items-center">
          <div className="flex-shrink-0 w-fit">
            <SelectInputComponent
              value={selectedCountryCode?.alpha2}
              name="country_code"
              placeholder="Select Code"
              onChange={(_, value) => {
                handleSelectChange(value);
              }}
              options={countryOptions}
              inputCustomStyle={"rounded-l-sm rounded-r-none"}
            />
          </div>
          <div className="w-full">
            <Input
              id={name}
              name={name}
              disabled={!selectedCountryCode || disabled}
              autoComplete="off"
              placeholder={
                !selectedCountryCode ? "Select country code" : `Enter ${label}`
              }
              value={inputValue}
              className={`
                     ${error && touch ? InvalidInput : ""} 
                     rounded-l-none rounded-r-sm
                     ${
                       !selectedCountryCode
                         ? "bg-gray-100 cursor-not-allowed"
                         : ""
                     }
                   `}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </FormField>
    );
  }
);
export default PhoneNumberInput;
