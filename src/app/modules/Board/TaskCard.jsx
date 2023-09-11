import React from "react";
import { BsTrash3, BsBookmark } from "react-icons/bs";


const TaskCard = ({title = "My Bords sections, Todo, multiple project details, to accumulate ideas etc."}) => {
  return (
    <div>
      <div className={`bg-[#F2F2F2] rounded-md p-3 m-2`}>
        <div className="opacity-70">
            {title}
        </div>
        <hr className=" bg-white h-[2px] my-2" />
        <div className="flex justify-between">
          <BsBookmark className="text-xs text- opacity-50" />
          <BsTrash3 className="text-xs opacity-50 " />
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
