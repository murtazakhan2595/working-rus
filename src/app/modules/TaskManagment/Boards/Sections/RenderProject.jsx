import React, { useState } from "react";
import { ProjectName } from "utils/getValuesFromTables";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownTrigger,
} from "src/@/components/ui/dropdown-menu";

const RenderProject = ({ projectId, projectName }) => {
  const navigate = useNavigate();
  const projects = useSelector((state) => state.common.projects);
  const [openDropdownRow, setOpenDropdownRow] = useState(false);

  const toggleDropdown = () => {
    setOpenDropdownRow(!openDropdownRow);
  };

  const handleProjectChange = (project) => {
    navigate(`/project-board/${project?.value}`);
  };

  return (
    <>
      {projects && projects?.length > 1 ? (
        <div className="relative">
          <DropdownMenu open={openDropdownRow} onOpenChange={toggleDropdown}>
            <DropdownMenuTrigger asChild>
              <button
                className="border-0 shadow-none bg-transparent flex py-2 font-bold leading-7 whitespace-nowrap border-b border-solid border-zinc-300 text-zinc-800"
                onClick={toggleDropdown}
              >
                {projectName ? projectName : <ProjectName value={projectId} />}
                <IoIosArrowDown style={{ margin: "auto 0px 2px 5px" }} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-3 ml-2">
              {projects?.map((project) => (
                <DropdownMenuItem key={project?.value} asChild>
                  <span
                    onClick={() => {
                      handleProjectChange(project);
                    }}
                    className="cursor-pointer"
                  >
                    {project?.label}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <ProjectName value={projectId} />
      )}
    </>
  );
};

export default RenderProject;
