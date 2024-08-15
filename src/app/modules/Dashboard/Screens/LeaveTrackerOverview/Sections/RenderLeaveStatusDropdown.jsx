import React, { useState } from "react";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { IoIosArrowDown } from "react-icons/io";

const StatusDropdown = [
  { label: "All Requests", value: "All Requests" },
  { label: "Pending", value: "Pending" },
  { label: "Approved", value: "Approved" },
  { label: "Denied", value: "Rejected" },
];
const RenderLeaveStatusDropdown = ({ status, setFilterOption }) => {
  const [openDropdownRow, setOpenDropdownRow] = useState(null);
  const itemClassName =
    "px-3 py-2 font-lato font-medium text-[12px] text-baseGray hover:bg-gray-100 cursor-pointer";
  const toggleDropdown = () => {
    setOpenDropdownRow(!openDropdownRow);
  };

  return (
    <>
      <ButtonDropdown
        isOpen={!!openDropdownRow}
        toggle={() => toggleDropdown()}
      >
        <DropdownToggle className="border-0 shadow-none bg-transparent">
          <div className="flex font-bold text-[14px] leading-7 whitespace-nowrap text-zinc-800">
            {status}
            <IoIosArrowDown style={{ margin: "auto" }} />
          </div>
        </DropdownToggle>
        <DropdownMenu start className="">
          {StatusDropdown.map((item, index) => {
            if (item.label === status) {
              return null;
            }
            return (
              <DropdownItem
                key={index}
                className={`${itemClassName}`}
                onClick={() => {
                  setFilterOption(item.value);
                }}
              >
                <span>{item.label}</span>
              </DropdownItem>
            );
          })}
        </DropdownMenu>
      </ButtonDropdown>
    </>
  );
};

export default RenderLeaveStatusDropdown;
