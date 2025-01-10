import React, { useState } from "react";
import { useSelector } from "react-redux";
import { EmployeeNameInfo } from "components";
import { MembersList } from "../../Sections";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "src/@/components/ui/dropdown-menu";

const MembersDropdown = ({ members }) => {
  const employees = useSelector((state) => state.emp.employees);
  const [openDropdownRow, setOpenDropdownRow] = useState(false);
  const itemClassName = "px-0 py-2";
  const toggleDropdown = () => {
    setOpenDropdownRow(!openDropdownRow);
  };

  return (
    <>
      {members && members.length > 1 ? (
        <DropdownMenu open={openDropdownRow} onOpenChange={toggleDropdown}>
          <DropdownMenuTrigger asChild>
            <button className="border-0 shadow-none bg-transparent">
              <MembersList members={members} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-3 ml-2 w-[250px]">
            {employees &&
              members.map((member) => {
                const employee = employees.find(
                  (emp) => emp.value === parseInt(member)
                );
                return (
                  <DropdownMenuItem key={member} className={itemClassName}>
                    <span>
                      <EmployeeNameInfo
                        name={employee?.name}
                        department={employee?.department_name}
                        position={employee?.department_position}
                      />
                    </span>
                  </DropdownMenuItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <MembersList members={members} />
      )}
    </>
  );
};

export default MembersDropdown;
