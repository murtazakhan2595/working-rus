import React, { useState } from "react";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import {
  LeaveType,
} from "utils/getValuesFromTables";
import { IoMdArrowDropdown } from "react-icons/io";

const RenderLeaveType = ({ row, updateLeaveType }) => {
  const [openDropdownRow, setOpenDropdownRow] = useState(null);
  const itemClassName = "";
  const toggleDropdown = (index) => {
    setOpenDropdownRow(index === openDropdownRow ? null : index);
  };

  const handleLeaveTypeChange = (leaveType) => {
    const leavesData = {
      leaveType: leaveType ? leaveType.leave_type : "",
      allotedLeaves: leaveType ? leaveType.total_alloted_leaves : "",
      remainingLeaves: leaveType ? leaveType.left_leave : "",
      usedLeaves: leaveType ? leaveType.used_leave : "",
    };
    updateLeaveType(row.id, leavesData);
  };

  return (
    <>
      {row.leaveTypeList && row.leaveTypeList.length > 1 ? (
        <div>
          <ButtonDropdown
            isOpen={!!(openDropdownRow === row.id)}
            toggle={() => toggleDropdown(row.id)}
          >
            <DropdownToggle className="border-0 shadow-none bg-transparent">
              <div className="text-dark flex">
                <LeaveType value={row.leaveType} />
                <IoMdArrowDropdown style={{ margin: "auto 0px 2px 5px" }} />
              </div>
            </DropdownToggle>
            <DropdownMenu start className="p-3 ml-2">
              {row.leaveTypeList.map((leaveType) => {
                return (
                  <DropdownItem className={`${itemClassName}`}>
                    <span
                      onClick={() => {
                        handleLeaveTypeChange(leaveType);
                      }}
                    >
                      <LeaveType value={leaveType.leave_type} />
                    </span>
                  </DropdownItem>
                );
              })}
            </DropdownMenu>
          </ButtonDropdown>
        </div>
      ) : (
        <LeaveType value={row.leaveType} />
      )}
    </>
  );
};

export default RenderLeaveType;
