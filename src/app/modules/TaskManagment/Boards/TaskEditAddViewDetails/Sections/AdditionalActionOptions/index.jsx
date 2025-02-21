import React, { useState } from "react";
import { Button } from "components/ui/button";
import { toast } from "react-toastify";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "src/@/components/ui/dropdown-menu";
import CopyLink from "components/ui/CopyLink";
import { useNavigate, useParams } from "react-router-dom";
import { MoreHorizontal, Archive, RotateCcw, Trash } from "lucide-react";
import { addTask, deleteTask } from "app/hooks/taskManagment";
import { useSelector } from "react-redux";
import AlertDialogue from "components/ui/AlertDialogue";

const AdditionalActionOption = React.memo(
  ({ isArchive = false, reloadData = () => {} }) => {
    const { projectId, taskId, viewStyle, boardId, subtaskId } = useParams();
    const navigate = useNavigate();
    const currentTaskId = subtaskId ? subtaskId : taskId;
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const userId = useSelector((state) => state.user.userProfile.id);
    const archeiveTask = async (archived = true) => {
      try {
        const response = await addTask(
          { is_archive: archived },
          currentTaskId,
          userId,
          { is_archive: !archived }
        );
        if (response) {
          toast.success("Task Archeived updated successfully");
          if (archived)
            navigate(
              `/project-board/${projectId}/${viewStyle}${
                subtaskId ? `/${boardId}/${taskId}` : ""
              }`
            );
          else reloadData(true);
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
      const response = await deleteTask(currentTaskId);
      if (response && response.status === 200) {
        navigate(
          `/project-board/${projectId}/${viewStyle}${
            subtaskId ? `/${boardId}/${taskId}` : ""
          }`
        );
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
                link={`/project-board/${projectId}/${viewStyle}/${boardId}/${taskId}/${
                  subtaskId || ""
                }`}
                text={"Copy Card Link"}
              />
            </DropdownMenuItem>
            {currentTaskId && !isArchive && (
              <DropdownMenuItem onClick={handleArchiveCardClick}>
                <Archive size={14} className="mr-2" /> Archive Card
              </DropdownMenuItem>
            )}
            {currentTaskId && isArchive && (
              <DropdownMenuItem onClick={handleRestoreCardClick}>
                <RotateCcw size={14} className="mr-2" /> Restore
              </DropdownMenuItem>
            )}
            {currentTaskId && (
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
