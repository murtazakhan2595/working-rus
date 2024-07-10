import React from "react";
import { BsChevronDown } from "react-icons/bs";

const CustomBoardDropdown = ({ isOpen, toggleDropdown, projects }) => {
  return (
    <div className="relative flex items-center">
      <BsChevronDown
        onClick={toggleDropdown}
        className="shrink-0 aspect-square w-[26px] cursor-pointer"
      />
      {isOpen && (
        <div
          className="flex flex-col pt-[15px] pr-[30px] pl-5 text-sm font-semibold tracking-tight leading-4 bg-white rounded-xl shadow-md text-zinc-800 absolute top-4 left-3 z-10 gap-[15px]"
          style={{ paddingBottom: "20px" }}
        >
          <h2 className="text-lg font-bold tracking-tight leading-4 ">
            Projects
          </h2>
          <div>
            <ul className="space-y-[15px]">
              {projects.map((project, index) => (
                <li
                  key={index}
                  className="p-2  justify-center text-zinc-800 text-sm font-semibold hover:text-blue-900 whitespace-nowrap rounded-lg hover:bg-sky-500 hover:bg-opacity-10 cursor-pointer"
                  onClick={project.onClick}
                >
                  <div className="">{project.label}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};




export default CustomBoardDropdown;
