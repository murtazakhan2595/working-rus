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
}) {
  const [isAddSubtaskOpen, setIsAddSubtaskOpen] = useState(false);
  const [subtasks, setSubtasks] = useState([]);
  const [viewSubtasks, setViewSubtasks] = useState(null);
  const navigate = useNavigate();
  const fetchSubtasks = async () => {
    try {
      const taskData = await getTaskById(taskId);
      if (taskData.sub_task && taskData.sub_task.length > 0) {
        const subtaskDetails = await Promise.all(
          taskData.sub_task.map((subtaskId) => getSubtaskById(subtaskId))
        );
        setSubtasks(subtaskDetails);
      }
    } catch (error) {
      console.error("Error fetching subtasks:", error);
      toast.error("Failed to load subtasks");
    }
  };

  useEffect(() => {
    if (taskId) {
      fetchSubtasks();
    }
  }, [taskId]);

  const handleAddSubtask = async () => {
    setIsAddSubtaskOpen(true);
  };

  const handleSubtaskCreated = async (newTask) => {
    try {
      const subTask = await addSubtask({ tasks: [newTask.id] });
      if (subTask) {
        // Get current parent task
        const parentTask = await getTaskById(taskId);
        // Update parent task's sub_task array
        const updatedSubTasks = [...(parentTask.sub_task || []), subTask.id];
        // Update the parent task
        await addTask(
          {
            sub_task: updatedSubTasks,
          },
          taskId
        );
        // Refresh the subtasks list
        await fetchSubtasks();
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
      {/* List existing subtasks */}
      <div className="space-y-2">
        {subtasks.map((subtask) => (
          <div
            key={subtask.id}
            className="flex items-center justify-between p-2 rounded-lg border border-gray-200 cursor-pointer"
            onClick={() => {
              //navigate(`/project-board/${projectId}/${subtask.id}`);
              setViewSubtasks(subtask.id);
              setIsAddSubtaskOpen(true);
            }}
          >
            <span>{subtask.name}</span>
          </div>
        ))}
      </div>

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
