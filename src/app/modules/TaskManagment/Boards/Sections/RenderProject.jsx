import React, { useState, useEffect } from "react";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { ProjectName } from "utils/getValuesFromTables";
import { IoIosArrowDown } from "react-icons/io";
import { getProjectsList } from "app/hooks/general";
import { useSelector } from "react-redux";

const RenderProject = ({ projectId, updateLeaveType }) => {
  const projects = useSelector((state) => state.common.projects);
  const [openDropdownRow, setOpenDropdownRow] = useState(null);

  const itemClassName = "";
  const toggleDropdown = () => {
    setOpenDropdownRow(!openDropdownRow);
  };

  const handleLeaveTypeChange = (leaveType) => {
    const leavesData = {
      leaveType: leaveType ? leaveType.leave_type : "",
      allotedLeaves: leaveType ? leaveType.total_alloted_leaves : "",
      remainingLeaves: leaveType ? leaveType.left_leave : "",
      usedLeaves: leaveType ? leaveType.used_leave : "",
    };
    updateLeaveType(leavesData);
  };

  return (
    <>
      {projects && projects.length > 1 ? (
          <ButtonDropdown
            isOpen={!!openDropdownRow}
            toggle={() => toggleDropdown()}
          >
            <DropdownToggle className="border-0 shadow-none bg-transparent">
              <div className="text-dark flex">
                <ProjectName value={projectId} />
                <IoIosArrowDown style={{ margin: "auto 0px 2px 5px" }} />
              </div>
            </DropdownToggle>
            <DropdownMenu start className="p-3 ml-2">
              {projects.map((project) => {
                return (
                  <DropdownItem className={`${itemClassName}`}>
                    <span
                      onClick={() => {
                        handleLeaveTypeChange();
                      }}
                    >
                      {project?.label}
                    </span>
                  </DropdownItem>
                );
              })}
            </DropdownMenu>
          </ButtonDropdown>
        
      ) : (
        <ProjectName value={projectId} />
      )}
    </>
  );
};

export default RenderProject;
