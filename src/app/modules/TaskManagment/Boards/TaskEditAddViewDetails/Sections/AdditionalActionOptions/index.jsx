import React, { useState } from "react";
import { Button } from "components/ui/button";
import { toast } from "react-toastify";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "src/@/components/ui/dropdown-menu";
import CopyLink from "components/ui/CopyLink";
import { useNavigate } from "react-router-dom";
import { initialState } from "state/slices/UserSlice";
import {
  MoreHorizontal,
  Archive,
  Link,
  RotateCcw,
  LogOut,
  Trash,
} from "lucide-react";
import { addTask, deleteTask } from "app/hooks/taskManagment";
import { useSelector } from "react-redux";
import AlertDialogue from "components/ui/AlertDialogue";

const frontendURL = initialState.frontendURL;

const AdditionalActionOption = React.memo(
  ({
    projectId = null,
    taskId = null,
    reloadData = () => {},
    isArchive = false,
  }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const archeiveTask = async (archeived = true) => {
      try {
        const response = await addTask({ is_archive: archeived }, taskId);
        if (response) {
          reloadData();
          toast.success("Task Archeived updated successfully");
        }
      } catch (error) {
        console.error("Error updating task status:", error);
      }
    };
    const handleArchiveCardClick = (e) => {
      e.preventDefault();
      archeiveTask();
    };
    const handleRestoreCardClick = (e) => {
      e.preventDefault();
      archeiveTask(false);
    };
    const handleDeleteCardClick = (e) => {
      e.preventDefault();
      setIsDeleteModalOpen(true);
    };
    const confirmDelete = async () => {
      const response = await deleteTask(taskId);
      if (response && response.status === 200) {
        reloadData();
      }
      setIsDeleteModalOpen(false);
    };
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="continue" className="bg-white font-normal">
              <MoreHorizontal className="w-4 h-4 mr-2" />
              More
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <CopyLink
                link={`/project-board/${projectId}/${taskId}`}
                text={"Copy Card Link"}
              />
            </DropdownMenuItem>
            {taskId && !isArchive && (
              <DropdownMenuItem onClick={handleArchiveCardClick}>
                <Archive size={14} className="mr-2" /> Archive Card
              </DropdownMenuItem>
            )}
            {taskId && isArchive && (
              <DropdownMenuItem onClick={handleRestoreCardClick}>
                <RotateCcw size={14} className="mr-2" /> Restore
              </DropdownMenuItem>
            )}
            {taskId && (
              <DropdownMenuItem onClick={handleDeleteCardClick}>
                <Trash size={14} className="mr-2" /> Delete Card
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogue
          isOpen={isDeleteModalOpen}
          setIsOpen={setIsDeleteModalOpen}
          handleContinue={confirmDelete}
          title="Are you sure?"
          description="Are you sure you want to delete this Card? This action is irreversible and will delete all card details"
        />
      </>
    );
  }
);
export default AdditionalActionOption;
