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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { initialState } from "state/slices/UserSlice";
import {
  MoreHorizontal,
  Archive,
  Link,
  ShieldX,
  LogOut,
  Trash,
} from "lucide-react";
import { addTask, deleteTask } from "app/hooks/taskManagment";
import { useSelector } from "react-redux";
import AlertDialogue from "components/ui/AlertDialogue";

const frontendURL = initialState.frontendURL;

const AdditionalActionOption = React.memo(
  ({ projectId = null, taskId = null, reloadData = () => {} }) => {
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const navigate = useNavigate();
    const userRole = useSelector((state) => state.user.userProfile)?.role;
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleCopyBoardLinkClick = (e) => {
      e.preventDefault();
      const Url = `${frontendURL}/project-board/${projectId}/${taskId}`;
      console.log(Url);
      navigator.clipboard
        .writeText(Url)
        .then(() => {
          setTooltipOpen(true);
          setTimeout(() => setTooltipOpen(false), 2000);
        })
        .catch((err) => console.error("Failed to copy:", err));
    };
    const archeiveTask = async () => {
      try {
        const response = await addTask({ is_archive: true }, taskId);
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
            <DropdownMenuItem onClick={handleCopyBoardLinkClick}>
              <TooltipProvider>
                <Tooltip open={tooltipOpen}>
                  <TooltipTrigger asChild>
                    <span className="flex">
                      <Link size={14} className="mr-2" />
                      Copy Card Link
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copied!</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DropdownMenuItem>
            {taskId && (
              <DropdownMenuItem onClick={handleArchiveCardClick}>
                <Archive size={14} className="mr-2" /> Archive Card
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
