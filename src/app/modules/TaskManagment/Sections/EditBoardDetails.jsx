import React from "react";
import { RxCross2 } from "react-icons/rx";
import { CiEdit } from "react-icons/ci";
import dots from "assets/images/dots.svg";
import { EmployeeName } from "utils/getValuesFromTables";

const EditProjectModal = ({ onClose, project }) => {
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
                Edit Project
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProjectModal;
