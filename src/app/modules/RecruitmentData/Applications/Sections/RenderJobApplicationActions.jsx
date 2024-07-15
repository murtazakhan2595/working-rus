import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Row,
  Col,
} from "reactstrap";
import { BsThreeDots } from "react-icons/bs";
import { dropdownOptions } from "data/Data";

const RenderJobApplicationActions = ({
  labelContact,
  row,
  handleOptionSelect,
}) => {
  const [openDropdownRow, setOpenDropdownRow] = useState(null);
  const toggleDropdown = (index) => {
    setOpenDropdownRow(index === openDropdownRow ? null : index);
  };
  if(!row) return <></>;

  return (
    <div>
      <ButtonDropdown
        isOpen={openDropdownRow === row.id}
        toggle={() => toggleDropdown(row.id)}
        className="float-end"
      >
        <DropdownToggle size="sm" className={`btn-brand ${labelContact ? 'bg-white rounded' : ''}`}>
          {labelContact ? (
            labelContact
          ) : (
            <BsThreeDots onClick={() => toggleDropdown(row.id)} />
          )}
        </DropdownToggle>
        <DropdownMenu right>
          {dropdownOptions.map((option) => {
            return (
              <>
                <DropdownItem
                  onClick={() => handleOptionSelect(row, option.value)}
                >
                  {option.label}
                </DropdownItem>
              </>
            );
          })}
        </DropdownMenu>
      </ButtonDropdown>
    </div>
  );
};

export default RenderJobApplicationActions;
