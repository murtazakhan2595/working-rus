import React from "react";
import { RxCross2 } from "react-icons/rx";
import { CiEdit } from "react-icons/ci";
import dots from "assets/images/dots.svg";
import { EmployeeName } from "utils/getValuesFromTables";
import { getRandomColor } from "utils/renderValues";


const ViewBoardDetails = ({ onClose, project, setIsEditMode }) => {
  const openEditProjectModal= () => {
    setIsEditMode(true);
  };
  return (
    <div className="fixed top-0 right-0 max-w-[35%] w-[35%] h-full z-10 overflow-y-auto hideScroll">
      <div className="bg-white h-full fixed  max-w-[35%] w-[35%] top-0 right-0  shadow px-[50px] py-10 flex flex-col gap-7">
        <div className="flex-col justify-start items-start gap-2.5 flex">
          <RxCross2
            className="cursor-pointer self-end"
            onClick={() => {
              onClose();
            }}
          />
          <div className="self-stretch justify-between items-end inline-flex">
            <div className="flex-col justify-start items-start gap-2.5 inline-flex">
              <div className="text-zinc-800 text-[25px] font-bold ">
                {project.name}
              </div>
              <div className="justify-start items-start gap-2.5 inline-flex">
                <div className="text-zinc-600 text-sm font-normal">
                  Created by Hani Hassan | {project.start_date}
                </div>
              </div>
            </div>
            <div className="h-9 justify-end items-center gap-4 flex">
              <button
                className="px-3 py-2 rounded border border-zinc-600 justify-center items-center gap-2 flex"
                onClick={openEditProjectModal}
              >
                <CiEdit className="text-2xl cursor-pointer opacity-80" />
                <div className="text-zinc-600 text-base font-medium  leading-tight">
                  Edit Job
                </div>
              </button>
              <img
                src={dots}
                alt=""
                onClick={() => {}}
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col text-base text-zinc-800">
          <div className="font-bold leading-[100%] ">Project Description</div>
          <p
            className="mt-2.5 leading-6 "
            dangerouslySetInnerHTML={{ __html: project.description }}
          />
        </div>
        <div className="flex flex-col items-center gap-[25px] text-sm text-gray-100 ">
          <h2 className="self-stretch  text-xl font-bold text-zinc-600 ">
            Team Members{" "}
            <span className="text-base">
              ({project.project_members.length})
            </span>
          </h2>
          <div className="px-[15px] py-2.5 rounded-[5px]  justify-start items-start gap-4 inline-flex w-[447px]">
            {project.project_members &&
              project.project_members.length > 0 &&
              project.project_members.map((member, index) => (
                <div
                  key={index}
                  className={`w-[35px] h-[35px] p-3 ${getRandomColor()} rounded-[100px] justify-center items-center gap-2.5 inline-flex`}
                >
                  <div className="text-zinc-100 text-sm font-normal font-['Lato']">
                    HP
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBoardDetails;

