import React, { useEffect, useState } from "react";
import { ChevronRight, Clock, CheckCircle2 } from "lucide-react";
import TaskEditAddViewDetails from "../index";
import { toast } from "react-toastify";
import { getSubtaskById } from "app/hooks/taskManagment";
import { getTaskById } from "app/hooks/taskManagment";
import { TaskStatus } from "data/Data";
import { getStatusLabel } from "utils/getValuesFromTables";

const SubtaskList = ({
  taskId,
  projectId,
  boardId,
  employees,
  projectDetail,
  subTasksDetails,
}) => {
  const [isAddSubtaskOpen, setIsAddSubtaskOpen] = useState(false);
  console.log("subTasksDetails", subTasksDetails);
  const [viewSubtasks, setViewSubtasks] = useState(null);
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "inprogress":
        return "bg-blue-100 text-blue-800";
      case "todo":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "inprogress":
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-2">
      {subTasksDetails.map((subtask, index) => (
        <div
          key={subtask.id || index}
          onClick={() => {
            setViewSubtasks(subtask.id);
            setIsAddSubtaskOpen(true);
          }}
          className="group flex items-center justify-between p-3 bg-white rounded-lg border border-gray-500 hover:border-primary hover:shadow-sm transition-all cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            {getStatusIcon(subtask.status)}
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                {subtask.name}
              </h4>
              {subtask.description && (
                <p className="text-xs text-gray-500 line-clamp-1">
                  {subtask.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {subtask.status && (
              <span
                className={`px-2 py-1 text-xs rounded-full  capitalize ${getStatusColor(
                  subtask.status
                )}`}
              >
                {getStatusLabel(subtask.status, TaskStatus)}
              </span>
            )}
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
          </div>
        </div>
      ))}
      {isAddSubtaskOpen && (
        <TaskEditAddViewDetails
          taskId={viewSubtasks}
          isOpen={isAddSubtaskOpen}
          setIsOpen={(value) => {
            setViewSubtasks(null);
            setIsAddSubtaskOpen(value);
          }}
          projectId={projectId}
          boardId={boardId}
          // onTaskCreated={handleSubtaskCreated}
          isSubtask={true}
        />
      )}
    </div>
  );
};

export default SubtaskList;
