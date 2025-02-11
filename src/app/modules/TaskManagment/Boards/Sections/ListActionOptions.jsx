import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { getAllBoards, deleteBoard, moveTask } from "app/hooks/taskManagment";
import { AddNewListModel } from "app/modules/TaskManagment/Boards/Sections";
import {
  ArrowLeft,
  LayoutGrid,
  MoreHorizontal,
  MoreVertical,
} from "lucide-react";
import { Button } from "components/ui/button";
import AlertDialogue from "components/ui/AlertDialogue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "src/@/components/ui/dropdown-menu";

const ListActionOptions = ({
  reloadData = () => {},
  boardId = null,
  fetchData = () => {},
  buttonOrientation = "vertical",
  setOrdering = () => {},
}) => {
  const [showAddNewListModel, setshowAddNewListModel] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const confirmDelete = async () => {
    await deleteBoard(boardId);
    fetchData(true);
    setIsDeleteModalOpen(false);
  };

  const sortTasks = (event, sortType) => {
    event.preventDefault();
    const getFilter = (sortType) => {
      let filter = "";
      switch (sortType) {
        case "newest":
          filter = "-start_date";
          return filter;
        case "oldest":
          filter = "start_date";
          return filter;
        case "alphabetical":
          filter = "name";
          return filter;
        case "dueDate":
          filter = "-end_date";
          return filter;
        default:
          return filter;
      }
    };
    setOrdering(getFilter(sortType));
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="font-normal p-1 hover:bg-transparent"
          >
            {buttonOrientation === "vertical" ? (
              <MoreVertical className="h-5 w-5" />
            ) : (
              <MoreHorizontal className="h-5 w-5" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setshowAddNewListModel(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDeleteModalOpen(true)}>
            Delete
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Sort by...</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={(e) => sortTasks(e, "newest")}>
                Date created (newest first)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => sortTasks(e, "oldest")}>
                Date created (oldest first)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => sortTasks(e, "alphabetical")}>
                Card name (alphabetically)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => sortTasks(e, "dueDate")}>
                Due date
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
      {showAddNewListModel && (
        <AddNewListModel
          boardId={boardId}
          setIsOpen={() => {
            setshowAddNewListModel(false);
            reloadData(true);
          }}
          isEditMode
        />
      )}

      {isDeleteModalOpen && (
        <AlertDialogue
          isOpen={isDeleteModalOpen}
          setIsOpen={() => setIsDeleteModalOpen(false)}
          handleContinue={confirmDelete}
          title="Confirm Delete"
          description="This action can't be undone. All information associated with this will be lost."
        />
      )}
    </>
  );
};

export default ListActionOptions;
