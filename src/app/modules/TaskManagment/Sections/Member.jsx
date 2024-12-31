import { EmployeeName } from "utils/getValuesFromTables";

import React, { useState } from "react";
import { getRandomColor } from "utils/renderValues"
import { CircleX } from "lucide-react";


const Members = ({ member, isEditMode, removeMember }) => {
  const employeeName = EmployeeName({ value: member });
  const name = employeeName.props.children;
  return (
    <div
      className="bg-plum-300 text-plum-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-lg flex items-center"
      title={name}
    >

      {name?.toUpperCase()}

      {isEditMode && (
        
          <div className="" onClick={() => removeMember(member)}>
            <CircleX
              className="ml-1 text-sm text-red-600 cursor-pointer"
            />
          
        </div>
      )}
    </div>
  );
};

export default Members;
