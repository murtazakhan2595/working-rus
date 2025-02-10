import React, { useState } from "react";
import { EmployeeName } from "utils/getValuesFromTables";
import { getRandomColor } from "utils/renderValues";
import { CircleX } from "lucide-react";

// Using React.memo to memoize the component and avoid unnecessary re-renders
const Members = React.memo(({ member, isEditMode, removeMember }) => {
  return (
    <div className="bg-plum-300 text-plum-800 text-sm font-semibold px-2 py-1 rounded-lg flex items-center">
      <EmployeeName value={member} />
      {isEditMode && (
        <CircleX
          className="ml-1 text-red-600 cursor-pointer"
          size={17}
          onClick={(e) => {
            e.preventDefault();
            removeMember(member);
          }}
        />
      )}
    </div>
  );
});

export default Members;
