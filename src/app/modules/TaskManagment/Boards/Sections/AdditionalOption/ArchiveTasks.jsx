import React, { useEffect, useRef, useState } from "react";
import SheetComponent from "components/ui/CustomSheet";
import { Plus, Trash2, RotateCcw } from "lucide-react";
import {
  deleteTask,
  addTask,
  getTaskByprojectId,
} from "app/hooks/taskManagment";
import { BiComment } from "react-icons/bi";
import { ImAttachment } from "react-icons/im";
import { Card } from "components/ui/card";
import AlertDialogue from "components/ui/AlertDialogue";
import { getAttachmentDetails } from "app/hooks/taskManagment";
import { Button } from "components/ui/button";
import { toast } from "react-toastify";
import TaskCard from "app/modules/TaskManagment/Boards/Task";

const ArchiveTasks = ({ onClose, isOpen, projectId }) => {
  const [TaskList, setTaskList] = useState([]);
  const fetchTasks = async (isMounted) => {
    const taskList = await getTaskByprojectId(projectId, {
      filterData: { is_archive: [true] },
    });
    if (isMounted) {
      const tasks = taskList.results || [];
      setTaskList(tasks || []); // Update this to `tasklList`
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (projectId) fetchTasks(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);
  const formSheetData = {
    triggerText: null,
    title: "Archives Cards",
    description: null,
    footer: null,
  };

  return (
    <>
      <SheetComponent
        {...formSheetData}
        isOpen={isOpen}
        setIsOpen={onClose}
        width="550px"
        contentClassName="custom-sheet-width"
      >
        <>
          {TaskList && TaskList.length?
            TaskList.map((task) => (
              <div key={task.id}>
                <TaskCard
                  task={task}
                  projectId={projectId}
                  boardId={task.board_id}
                  reloadData={() => fetchTasks(true)}
                  showMembers={false}
                  showDueDate={false}
                />
              </div>
            )):<div className="flex w-full my-4 justify-center text-neutral-1000">No Archieve Cards</div>}
        </>
      </SheetComponent>
    </>
  );
};

export default ArchiveTasks;
