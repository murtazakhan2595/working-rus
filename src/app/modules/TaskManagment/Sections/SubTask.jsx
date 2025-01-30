import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "components/ui/button";
import { getTaskById, addTask, getProjectById } from "app/hooks/taskManagment";
import { toast } from "react-toastify";
import TaskEditAddViewDetails from "../Boards/TaskEditAddViewDetails";
import { addSubtask } from "app/hooks/taskManagment";
import { getSubtaskById } from "app/hooks/taskManagment";
import { useNavigate } from "react-router-dom";
import { URLS } from "constants/config";

export default function Subtasks({
  taskId,
  projectId,
  boardId,
  employees,
  projectDetail,
  fetchTaskData,
}) {
  const [isAddSubtaskOpen, setIsAddSubtaskOpen] = useState(false);
  const [subtasks, setSubtasks] = useState([]);
  const [viewSubtasks, setViewSubtasks] = useState(null);

  console.log("Opening subtask dialog", { projectId, boardId, projectDetail });

  const handleAddSubtask = async () => {
    setIsAddSubtaskOpen(true);
  };

  const handleSubtaskCreated = async (newTask) => {
    try {
      const subTask = await addSubtask({ tasks: [newTask.id] });
      if (subTask) {
        console.log("Subtask created:", subTask);
        // Get current parent task
        const parentTask = await getTaskById(taskId);
        // Update parent task's sub_task array
        const updatedSubTasks = [...(parentTask.sub_task || []), subTask.id];
        console.log("Updated subtasks:", updatedSubTasks);
        console.log("Parent task newTask.id:", newTask.id);
        // Update the parent task
        await addTask(
          {
            sub_task: updatedSubTasks,
          },
          taskId
        );
        // Refresh the subtasks list
        fetchTaskData(true);
        // Close the dialog and clean up
        setIsAddSubtaskOpen(false);
      }
    } catch (error) {
      console.error("Error updating parent task:", error);
      toast.error("Failed to update subtask relationship");
    }
  };
  return (
    <div>

      {/* Add Subtask Button */}
      <Button
        type="button"
        variant="continue"
        size="sm"
        className="w-full"
        onClick={(e) => {
          e.preventDefault();
          handleAddSubtask();
        }}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Subtask
      </Button>

      {/* Subtask Creation Dialog */}
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
          onTaskCreated={handleSubtaskCreated}
          isSubtask={true}
        />
      )}
    </div>
  );
}
