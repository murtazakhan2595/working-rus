import React, { useEffect, useState } from "react";
import { getTaskById, addTask } from "app/hooks/taskManagment";
import { Input } from "components/ui/input";
import { cn } from "src/@/lib/utils";
import { Checkbox } from "src/@/components/ui/checkbox";

const RenderTaskTitle = ({
  taskId,
  title,
  className = "",
  isChecked = false,
  reload = () => {},
}) => {
  const [checked, setChecked] = useState(isChecked);

  const handleStatusChange = async (newChecked) => {
    if (newChecked === checked) return; // Prevent duplicate API calls

    try {
      const newStatus = newChecked ? "COMPLETED" : "INPROGRESS";
      const response = await addTask({ status: newStatus }, taskId);
      if (response) {
        setChecked(newChecked);
        reload(true);
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return (
    <div
      className={`group flex items-center gap-2 text-base font-bold capitalize transition-all duration-200 ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        handleStatusChange(!checked);
      }}
    >
      {/* Checkbox only appears on hover */}
      <div className="hidden group-hover:block transition-opacity duration-200">
        <Checkbox
          checked={checked}
          className="w-4 h-4 cursor-pointer accent-blue-600"
          onCheckedChange={(e) => handleStatusChange(e)}
        />
      </div>

      {/* Task Title */}
      <span className="">{title}</span>
    </div>
  );
};

export default RenderTaskTitle;
