import React, { useState } from "react";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { CheckBoxInput } from "./form-control";

const CheckboxDropdown = ({
  items,
  onChange,
  values,
  mainHeading,
  label,
  className,
}) => {
  const [openDropdownRow, setOpenDropdownRow] = useState(false);

  const toggleDropdown = () => {
    setOpenDropdownRow(!openDropdownRow);
  };

  return (
    <div>
      <ButtonDropdown
        isOpen={openDropdownRow}
        toggle={() => {}}
        className="float-end"
      >
        <DropdownToggle
          className={`${
            className ?? "custom-dropdown-toggle"
          } placeholder-[#5C5E64] rounded-md`}
        >
          <span onClick={() => toggleDropdown()}>{label}</span>
        </DropdownToggle>
        <DropdownMenu end className="custom-dropdown-menu h-[70vh] overflow-y-auto">
          {mainHeading && (
            <h5 className="mb-2">
              <b>{mainHeading}</b>
            </h5>
          )}
          {items.map((item) => {
            return (
              <>
                <DropdownItem className="custom-dropdown-item" key={item.name}>
                  <SortingCategory
                    item={item}
                    onChange={onChange}
                    values={values}
                  />
                </DropdownItem>
              </>
            );
          })}
        </DropdownMenu>
      </ButtonDropdown>
    </div>
  );
};

export const SortingCategory = ({ item, onChange, values }) => {
  return (
    <div>
      <div>
        <b>{item.label}</b>
      </div>
      {item.options &&
        item.options.length > 0 &&
        item.options.map((checkbox) => {
          return (
            <div className="pl-3" key={checkbox.value}>
              <CheckBoxInput
                name={item.name}
                label={checkbox.label}
                value={
                  values &&
                  values[item.name] ?
                  values[item.name].includes(checkbox.value) : false
                }
                onChange={(field, option) => {
                  onChange(field, checkbox.value, option);
                }}
              />
            </div>
          );
        })}
    </div>
  );
};

export default CheckboxDropdown;
