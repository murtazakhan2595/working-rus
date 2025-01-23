import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "components/ui/button";
import { getTaskById, addTask, getProjectById } from "app/hooks/taskManagment";
import { toast } from "react-toastify";
import TaskEditAddViewDetails from "../Boards/TaskEditAddViewDetails";
import { addSubtask } from "app/hooks/taskManagment";
import { getSubtaskById } from "app/hooks/taskManagment";

export default function Subtasks({ taskId, projectId, boardId, employees, projectDetail }) {
  const [isAddSubtaskOpen, setIsAddSubtaskOpen] = useState(false);
  const [subtasks, setSubtasks] = useState([]);

  console.log("Opening subtask dialog", { projectId, boardId, projectDetail });

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
      if(subTask){
        console.log("Subtask created:", subTask);
        // Get current parent task
        const parentTask = await getTaskById(taskId);
        // Update parent task's sub_task array
        const updatedSubTasks = [
          ...(parentTask.sub_task || []),
          subTask.id,
        ];
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
    <div className="space-y-4">
      {/* List existing subtasks */}
      <div className="space-y-2">
        {subtasks.map((subtask) => (
          <div
            key={subtask.id}
            className="flex items-center justify-between p-2 rounded-lg border border-gray-200"
          >
            <span>{subtask.name}</span>
          </div>
        ))}
      </div>

      {/* Add Subtask Button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full"
        onClick={handleAddSubtask}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Subtask
      </Button>

      {/* Subtask Creation Dialog */}
      {isAddSubtaskOpen && projectDetail && (
        <TaskEditAddViewDetails
          isOpen={isAddSubtaskOpen}
          setIsOpen={(value) => {
            setIsAddSubtaskOpen(value);
          }}
          projectId={projectId}
          boardId={boardId}
          employees={employees}
          onTaskCreated={handleSubtaskCreated}
          isSubtask={true}
          projDetailsBySubtask={projectDetail}
        />
      )}
    </div>
  );
}