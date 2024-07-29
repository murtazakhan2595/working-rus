import React from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { FaChevronDown } from "react-icons/fa";

const CustomDropdown = ({ isOpen, toggleDropdown, options }) => {
  return (
    <div className="relative">
      <FaChevronDown className=" cursor-pointer" onClick={toggleDropdown} />
      {isOpen && (
        <div className="absolute right-3 top-3 w-28 bg-[#FAFBFC] rounded-xl projectDetails-shadow z-10">
          <ul className="py-1">
            {options.map((option, index) => (
              <li
                key={index}
                className="px-3 py-2 font-lato font-medium text-[12px] text-baseGray hover:bg-gray-100 cursor-pointer"
                onClick={option.onClick}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
