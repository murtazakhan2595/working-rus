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
          {TaskList &&
            TaskList.map((task) => (
              <TaskDetailsCard {...task} reloadData={() => fetchTasks(true)} />
            ))}
        </>
      </SheetComponent>
    </>
  );
};

const TaskDetailsCard = ({
  name,
  description,
  id,
  comment_count,
  attachment_count,
  attachment,
  reloadData = () => {},
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const handleDelete = (e) => {
    e.preventDefault();
    setIsDeleteModalOpen(true);
  };

  const handleRestore = async (e) => {
    e.preventDefault();
    try {
      const response = await addTask({ is_archive: false }, id);
      if (response) {
        reloadData();
        toast.success("Task Restored successfully");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const attachment = await getAttachmentDetails([attachment[0]]);
      if (attachment) {
        setCoverImage(attachment[0]?.attachment);
      }
    };
    if (attachment?.length > 0) {
      fetchData();
    }
  }, [id]);

  const confirmDelete = async () => {
    const response = await deleteTask(id);
    if (response && response.status === 200) {
      reloadData();
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <Card className="w-full p-3 mt-6 bg-white rounded-lg shadow cursor-pointer">
      {/* Render ConfirmationModal component when isDeleteModalOpen is true */}
      {isDeleteModalOpen && (
        <AlertDialogue
          isOpen={isDeleteModalOpen}
          setIsOpen={() => {
            setIsDeleteModalOpen(false);
          }}
          handleContinue={confirmDelete}
          title="Are you sure?"
          description="Are you sure you want to delete this Card? This action is irreversible and will delete all card details"
        />
      )}
      <div className="flex flex-col">
        <div className="my-2">
          {coverImage && (
            <img
              src={coverImage}
              alt="cover image"
              className="w-full h-auto max-h-[200px]  object-contain rounded-lg"
            />
          )}
        </div>

        <div
          className="flex flex-col pb-4 mt-3 border-b border-solid border-zinc-300 text-zinc-800"
          onClick={(e) => {
            e.preventDefault();
            setIsTaskDetailOpen(true);
          }}
        >
          <h3 className="text-base font-bold text-capitalize">{name}</h3>

          {description && (
            <p
              className="text-sm leading-5 truncate-text text-neutral-1000 image-none"
              style={{ maxHeight: "100px" }}
            >
              <span>{`${description.replace(/<[^>]*>/g, "").slice(0, 130)}${
                description.length > 130 ? "..." : ""
              }`}</span>
            </p>
          )}
        </div>
        <footer className="flex justify-between py-2">
          <div className="flex items-center gap-1">
            <Button variant="continue" size="sm" onClick={handleRestore}>
              <RotateCcw size={15} className="mr-1" />
              Restore
            </Button>
            <Button
              variant="destructiveOutline"
              size="sm"
              onClick={handleDelete}
            >
              <Trash2 size={15} />
            </Button>
          </div>
          <div className="flex items-center gap-2 text-neutral-1000">
            <div className="flex gap-0.5 text-sm items-center my-auto whitespace-nowrap">
              <BiComment />
              <div>{comment_count || 0}</div>
            </div>
            <div className="flex items-center text-sm gap-0.5 my-auto whitespace-nowrap">
              <ImAttachment />
              <div>{attachment_count || 0}</div>
            </div>
          </div>
        </footer>
      </div>
    </Card>
  );
};

export default ArchiveTasks;
