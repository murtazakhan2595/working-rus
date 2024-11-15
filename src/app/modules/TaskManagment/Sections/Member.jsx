import { EmployeeName } from "utils/getValuesFromTables";
import { IoIosArrowDown } from "react-icons/io";
import React, { useState } from "react";
import {getRandomColor} from "utils/renderValues"


const Members = ({ member, isEditMode, removeMember }) => {
  const [isOpen, setIsOpen] = useState(false);
  const employeeName = EmployeeName({ value: member });
  const name = employeeName.props.children;
  return (
    <div
      className="flex items-center p-1 bg-[#EEEEF0] rounded-full relative"
      title={name}
    >
      <div
        className={`${getRandomColor(name?.charAt(0))} text-[#FAFBFC] flex font-semibold text-md items-center justify-center rounded-full w-10 h-10`}
        style={{ minWidth: "40px" }}
      >
        {name?.toUpperCase().charAt(0)}
      </div>
      {isEditMode && (
        <div className="flex flex-col mx-2 whitespace-break-spaces flex-wrap">
          <div className="text-base font-bold leading-normal text-[#323333] text-left text-capitalize">
            <IoIosArrowDown
              onClick={() => {
                setIsOpen(!isOpen);
              }}
            />
            {isOpen && (
              <div className="absolute top-[2rem] w-28 bg-[#FAFBFC] rounded-xl projectDetails-shadow z-10">
                <ul className="py-1">
                  <li
                    className="px-3 py-2  font-medium text-[12px] text-baseGray hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      removeMember(member);
                      setIsOpen(false);
                    }}
                  >
                    Remove
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
