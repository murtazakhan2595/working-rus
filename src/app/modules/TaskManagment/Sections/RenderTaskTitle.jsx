import React, { useEffect, useState } from "react";
import { getTaskById, addTask } from "app/hooks/taskManagment";
import { Checkbox } from "src/@/components/ui/checkbox";

const RenderTaskTitle = ({
  taskId,
  title,
  className = "",
  isChecked = false,
  reload = () => {},
  onClick = () => {},
}) => {
  console.log(isChecked);
  const checked = isChecked;
  const handleContainerClick = (e) => {
    e.stopPropagation();
    handleStatusChange(!checked);
  };
  const handleStatusChange = async (newChecked) => {
    debugger;
    if (newChecked === checked) return; // Prevent duplicate API calls
    try {
      const newStatus = newChecked ? "COMPLETED" : "INPROGRESS";
      const response = await addTask({ status: newStatus }, taskId);
      if (response) {
        reload(true);
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return (
    <div
      className={`group flex items-center gap-2 text-base font-bold capitalize transition-all duration-200 transform -translate-x-2 group-hover:translate-x-0 ${className}`}
      onClick={handleContainerClick}
    >
      {/* Checkbox only appears on hover */}
      <div className="hidden group-hover:block transition-opacity duration-200">
        <Checkbox
          checked={checked}
          className=""
          onCheckedChange={(e) => {}}
        />
      </div>

      {/* Task Title */}
      <div
        onClick={onClick}
        className="transition-all duration-300 transform group-hover:translate-x-2 group-hover:opacity-100"
      >
        {title}
      </div>
    </div>
  );
};

export default RenderTaskTitle;
