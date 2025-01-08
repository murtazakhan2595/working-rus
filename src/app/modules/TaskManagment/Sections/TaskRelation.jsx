import React, { useEffect, useRef, useState } from "react";
import { Plus, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../src/@/components/ui/popover";
import { TaskDetailBox } from "app/modules/TaskManagment/Sections";
import { MdClose } from "react-icons/md";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Label } from "../../../../src/@/components/ui/label";
import { Checkbox } from "../../../../src/@/components/ui/checkbox";
import { Card } from "components/ui/card";
import axios from "axios";
import { getTaskByprojectId } from "app/hooks/taskManagment";
import { toast } from "react-toastify";
import { getDarkerTextColor } from "../Boards/Sections/getTaskStatus";
import { Members } from "app/modules/TaskManagment/Sections";

export default function TaskRelation({
  relationsList,
  onChange,
  projectId,
  taskId,
  editMode = true,
}) {
  const [taskList, setTaskList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTasks = async () => {
    const taskList = await getTaskByprojectId({
      filterData: { project_id: [projectId] },
    });
    const tasks = taskList.results || [];
    const finalTaskList = taskId
      ? tasks.filter((obj) => obj.id !== taskId)
      : tasks;
    setTaskList(finalTaskList || []); // Update this to `tasklList`
  };

  useEffect(() => {
    fetchTasks();
  }, []);
  
  // Filter labels based on search query
  const filteredTasks = React.useMemo(() => {
    return taskList?.filter((task) =>
      task.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, taskList]);

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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <TaskDetailBox
      dataContent={
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
                    <span className="ml-4 mr-5 text-sm text-baseGray">
                      <span>{task.name || "Task Titile (N/A)"}</span>
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
      }
      inputDataContent={
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-10 h-10 p-0 rounded-full">
              <Plus className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <Card className="border-0 shadow-none">
              <div className="p-4 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search Task"
                    className="pl-9"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
                <div className="space-y-3 max-h-[200px] overflow-y-auto scroll-smooth">
                  {filteredTasks?.map((task) => (
                    <div key={task?.id} className="flex items-center space-x-2">
                      <Checkbox
                        checked={relationsList.includes(task?.id)}
                        onCheckedChange={() => handleTaskToggle(task?.id)}
                      />
                      <span className={`px-3 py-1 rounded-full inline-block`}>
                        {task?.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </PopoverContent>
        </Popover>
      }
      editMode={editMode}
    />
  );
}
