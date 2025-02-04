import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { getTaskByprojectId } from "app/hooks/taskManagment";
import { SelectMultiInputComponent } from "components/FormControl";

export default function TaskRelation({
  relationsList,
  onChange,
  projectId,
  taskId,
  error,
  touch,
  editMode = true,
}) {
  const [taskList, setTaskList] = useState([]);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [viewTaskId, setViewTaskId] = useState(null);
  const fetchTasks = async () => {
    const taskList = await getTaskByprojectId(projectId);
    const tasks = taskList.results || [];
    const finalTaskList = taskId
      ? tasks.filter((obj) => obj.id !== taskId)
      : tasks;
    setTaskList(finalTaskList || []); // Update this to `tasklList`
  };

  useEffect(() => {
    fetchTasks();
  }, []);


  const handleTaskToggle = (taskId) => {
    if (relationsList.includes(taskId)) {
      // Remove the label if it already exists
      const updatedLabels = relationsList.filter((id) => id !== taskId);
      onChange(updatedLabels);
      return updatedLabels;
    } else {
      // Add the label if it doesn't exist
      const updatedLabels = [...relationsList, taskId];
      onChange(updatedLabels);
      return updatedLabels;
    }
  };

  return (
    <>
      {editMode ? (
        <SelectMultiInputComponent
          name="relation"
          options={taskList.map((task) => ({
            label: task.name,
            value: task.id,
          }))}
          label={"Relation"}
          error={error}
          touch={touch}
          value={relationsList}
          placeholder="Add Relation"
          onChange={(field, value) => {
            onChange(value);
          }}
        />
      ) : (
        relationsList &&
        relationsList.length > 0 && (
          <div className="flex flex-col w-full">
            {relationsList.map((taskId, index) => {
              const task = taskList.find((obj) => obj.id === taskId);
              if (!task) return null;
              return (
                <div
                  className="flex items-center justify-between p-2 mb-2 bg-gray-100 rounded-lg shadow-md w-fit"
                  key={index}
                >
                  <div className="flex items-center">
                    <span className="ml-4 mr-5 text-sm text-baseGray cursor-pointer">
                      <span
                        onClick={() => {
                          setIsTaskDetailOpen(true);
                          setViewTaskId(taskId);
                        }}
                      >
                        {task.name || "Task Titile (N/A)"}
                      </span>
                    </span>
                  </div>
                  {editMode && (
                    <div className="flex items-center gap-x-2">
                      <MdClose
                        className="w-5 h-5 text-gray-500 cursor-pointer"
                        onClick={() => {
                          handleTaskToggle(taskId);
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      )}
    </>
  );
}
