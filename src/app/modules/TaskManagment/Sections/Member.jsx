import { EmployeeName } from "utils/getValuesFromTables";

import React, { useState } from "react";
import {getRandomColor} from "utils/renderValues"
import { CircleX } from "lucide-react";


const Members = ({ member, isEditMode, removeMember }) => {
  const employeeName = EmployeeName({ value: member });
  const name = employeeName.props.children;
  return (
    <div
      className="flex items-center p-1 rounded-lg border border-emerald-600 relative"
      title={name}
    >
      <div
        className={`${getRandomColor(name?.charAt(0))}  flex font-semibold text-md items-center justify-center rounded-full w-10 h-10`}
        
      >
        {name?.toUpperCase().charAt(0)}
      </div>
      {isEditMode && (
        <div 
          className="flex flex-col mx-2 whitespace-break-spaces flex-wrap cursor-pointer"
          onClick={() => removeMember(member)}
        >
          <div className="">
            <CircleX
              className="ml-1 text-sm text-red-600 cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
