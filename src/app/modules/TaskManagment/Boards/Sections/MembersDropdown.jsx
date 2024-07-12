import React, { useState } from "react";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { EmployeeNameInfo } from "components";
import { MembersList } from "../../Sections";
import { useSelector } from "react-redux";

const MembersDropdown = ({ members }) => {
  const employees =  useSelector((state) => state.emp.employees);
  const [openDropdownRow, setOpenDropdownRow] = useState(null);
  const itemClassName = "px-0 py-2";
  const toggleDropdown = () => {
    setOpenDropdownRow(!openDropdownRow);
  };
  return (
    <>
      {members && members.length > 1 ? (
        <ButtonDropdown
          isOpen={!!openDropdownRow}
          toggle={() => toggleDropdown()}
        >
          <DropdownToggle className="border-0 shadow-none bg-transparent">
            <MembersList projectMembers={members} />
          </DropdownToggle>
          <DropdownMenu start className="p-3 ml-2 w-[250px]" >
            {employees && members.map((member) => {
                const employee = employees.find((emp) => emp.value === parseInt(member));
                console.log(employee)
              return (
                <DropdownItem className={`${itemClassName}`} >
                  <span>
                    <EmployeeNameInfo
                      name={`${employee?.name}`}
                      department={employee?.department_name}
                      position={employee?.department_position}
                    />
                  </span>
                </DropdownItem>
              );
            })}
          </DropdownMenu>
        </ButtonDropdown>
      ) : (
        <MembersList projectMembers={members} />
      )}
    </>
  );
};

export default MembersDropdown;
