import React, { useEffect, useState } from "react";
import { ChevronRight, Clock, CheckCircle2 } from "lucide-react";
import TaskEditAddViewDetails from "../index";
import { toast } from "react-toastify";
import { getSubtaskById } from "app/hooks/taskManagment";
import { getTaskById, addTask } from "app/hooks/taskManagment";
import { Input } from "components/ui/input";
import { cn } from "src/@/lib/utils";
import {
  TaskStatusLabel,
  TaskEndDate,
  MembersList,
  RenderTaskTitle,
} from "app/modules/TaskManagment/Sections";

const SubtaskList = ({ taskId, projectId, boardId, items, projectDetail }) => {
  return (
    <div className="space-y-2">
      {items?.length>0 && items?.map((task, index) => (
        <RenderSubTask taskId={task} />
      ))}
    </div>
  );
};

const RenderSubTask = ({ taskId }) => {
  const [isAddSubtaskOpen, setIsAddSubtaskOpen] = useState(false);
  const [viewSubtasks, setViewSubtasks] = useState(null);
  const [subTaskDetails, setSubTaskDetails] = useState([]);

  const fetchTaskData = async (isMounted) => {
    try {
      const subtaskDetails = await getTaskById(taskId);
      if (isMounted) setSubTaskDetails(subtaskDetails);
    } catch (error) {
      console.error("Error fetching task data:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (taskId) fetchTaskData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [taskId]);

  if (!taskId || !subTaskDetails || !subTaskDetails?.id) return null;
  return (
    <div
      key={taskId}
      className="w-full max-w-full gap-4 flex items-center justify-between py-1 px-3 rounded-lg bg-white border border-gray-500 hover:border-primary hover:shadow-sm transition-all cursor-pointer"
    >
      <div className="flex items-center space-x-3 w-fit">
        <RenderTaskTitle
          title={subTaskDetails.name}
          taskId={subTaskDetails.id}
          isChecked={subTaskDetails.status?.toUpperCase() === "COMPLETED"}
          className="text-sm font-medium text-neutral-1100"
          reload={fetchTaskData}
          onClick={(e) => {
            e.preventDefault();
            setViewSubtasks(subTaskDetails);
            setIsAddSubtaskOpen(true);
          }}
        />
      </div>

      <div className="flex items-center space-x-3 justify-end">
        <TaskEndDate
          dueDate={subTaskDetails.end_date}
          taskStatus={subTaskDetails.status}
        />
        <TaskStatusLabel status={subTaskDetails.status} />
        <MembersList members={subTaskDetails.assigned_to || []} />
        <ChevronRight
          size={18}
          className="text-neutral-1100 transition-colors"
        />
      </div>
      {isAddSubtaskOpen && (
        <TaskEditAddViewDetails
          taskId={viewSubtasks.id}
          isOpen={isAddSubtaskOpen}
          setIsOpen={(value) => {
            debugger;
            setViewSubtasks(null);
            setIsAddSubtaskOpen(false);
          }}
          projectId={viewSubtasks.project_id}
          boardId={viewSubtasks.board_id}
          isSubtask={true}
        />
      )}
    </div>
  );
};

export default SubtaskList;
