import React, { useState } from 'react';
import Select from 'react-select';

const CustomSelect = ({ value, options, onChange, isEdit,placeholder,isMulti }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (inputValue) => {
    setInputValue(inputValue);
  };

  return (
    <Select
      menuIsOpen={inputValue.length > 0} // Open menu only when there is input value
      onInputChange={handleInputChange}
      inputValue={inputValue}
      value={value}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      isMulti={isMulti}
    //   isDisabled={!isEdit} // Use the isEdit prop to determine if the field should be disabled
      noOptionsMessage={() => "No such employee found"} // Custom message when no options are available
      styles={{
        control: (provided) => ({ ...provided, minHeight: 0 }), // Adjust control height
        indicatorsContainer: (provided) => ({ ...provided, display: "none" }), // Hide dropdown indicators
      }}
    />
  );
};

export default CustomSelect;
