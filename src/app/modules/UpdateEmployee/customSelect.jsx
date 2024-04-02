// CustomSelect component
import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const CustomSelect = ({ value, options, onChange, isEdit, placeholder, isMulti, menuPlacement }) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    // Set initial inputValue to the label of the current value
    if (value) setInputValue(value.label || '');
}, [value]); // Update useEffect dependency to value


  const handleInputChange = (inputValue) => {
    setInputValue(inputValue);
  };

  return (
    <Select
      menuPlacement={menuPlacement}
      menuIsOpen={inputValue.length > 0}
      onInputChange={handleInputChange}
      inputValue={inputValue}
      value={value}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      isMulti={isMulti}
      isDisabled={!isEdit} // Disable if not in edit mode
      noOptionsMessage={() => "No such employee found"}
      menuPortalTarget={document.body}
      styles={{
        menuPortal: base => ({ ...base, zIndex: 9999 }),
        control: (provided) => ({ ...provided, minHeight: 0 }),
        indicatorsContainer: (provided) => ({ ...provided, display: "none" }),
      }}
    />
  );
};

export default CustomSelect;