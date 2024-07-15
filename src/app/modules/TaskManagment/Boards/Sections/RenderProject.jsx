import React, { useState, useEffect } from "react";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { ProjectName } from "utils/getValuesFromTables";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const RenderProject = ({ projectId }) => {
  const navigate = useNavigate();
  const projects = useSelector((state) => state.common.projects);
  const [openDropdownRow, setOpenDropdownRow] = useState(null);

  const itemClassName = "";
  const toggleDropdown = () => {
    setOpenDropdownRow(!openDropdownRow);
  };

  const handleProjectChange = (project) => {
    navigate(`/project-board/${project.value}`);
  };

  return (
    <>
      {projects && projects.length > 1 ? (
          <ButtonDropdown
            isOpen={!!openDropdownRow}
            toggle={() => toggleDropdown()}
          >
            <DropdownToggle className="border-0 shadow-none bg-transparent">
              <div className="flex py-2 font-bold leading-7 whitespace-nowrap border-b border-solid border-zinc-300 text-zinc-800">
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
                        handleProjectChange(project);
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
