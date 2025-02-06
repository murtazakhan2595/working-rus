import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { getAllBoards, deleteBoard, moveTask } from "app/hooks/taskManagment";
import { RxPlus } from "react-icons/rx";
import { AddNewListModel } from "./Sections";
import TaskEditAddViewDetails from "app/modules/TaskManagment/Boards/TaskEditAddViewDetails";
import { ScrollArea,ScrollBar } from "src/@/components/ui/scroll-area";
import TaskCard from "./Task";
import { ArrowLeft, LayoutGrid, LayoutList, MoreVertical } from "lucide-react";
import { Button } from "components/ui/button";
import { Card } from "components/ui/card";
import { CardContent } from "components/ui/card";
import AlertDialogue from "components/ui/AlertDialogue";
import { getAllTasks } from "app/hooks/taskManagment";
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

const BoardGridView = ({
  projectId,
  filterData,
  AllBoards = [],
  reloadData = () => {},
  toggleAddBoardModal = () => {},
}) => {
  return (
    <>
      <ScrollArea className="[&>div>div[style]]:!block">
        <Card className="p-0 relative overflow-y-hidden overflow-x-scroll bg-transparent shadow-none border-none">
          <CardContent className="py-3">
            <div className="flex gap-8 mt-5">
              {AllBoards.count > 0 &&
                AllBoards.results.map((board) => (
                  <TaskColumn
                    key={board.id}
                    board={board}
                    projectId={projectId}
                    reloadData={() => {
                      reloadData(true);
                    }}
                    filterData={{
                      ...filterData,
                      board_id: [board.id],
                    }}
                  />
                ))}
              <div className="flex flex-col min-w-[290px] max-w-[320px] mb-5">
                <div className="flex flex-col ">
                  <header className="">
                    <Button
                      variant="outline"
                      type="button"
                      size="lg"
                      className="w-full text-start"
                      onClick={toggleAddBoardModal}
                    >
                      <RxPlus className="text-xl " />
                      <span className="ml-2">Add New List</span>
                    </Button>
                  </header>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  );
};

const TaskColumn = ({ key, reloadData, board, projectId, filterData }) => {
  const [openCreateCard, setOpenCreateCard] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [showAddNewListModel, setshowAddNewListModel] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const updateTaskLocally = (taskId, updatedData) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      results: prevTasks.results.map((task) =>
        task.id === taskId ? { ...task, ...updatedData } : task
      ),
    }));
  };

  const fetchData = async (isMounted) => {
    try {
      const taskData = await getAllTasks({ filterData });
      if (taskData && isMounted) {
        setTasks(taskData);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [filterData]);

  const handleDragStart = async (e, taskId) => {
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.setData("sourceBoardId", board.id);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const sourceBoardId = e.dataTransfer.getData("sourceBoardId");
    if (sourceBoardId !== board.id) {
      await moveTask({ id: taskId, board_id: board.id });
      reloadData();
    }
  };

  const confirmDelete = async () => {
    await deleteBoard(board.id);
    fetchData(true);
    setIsDeleteModalOpen(false);
  };

  const sortTasks = (sortType) => {
    setTasks((prevTasks) => {
      const sortedResults = [...prevTasks.results].sort((a, b) => {
        switch (sortType) {
          case "newest":
            return new Date(b.start_date) - new Date(a.start_date);
          case "oldest":
            return new Date(a.start_date) - new Date(b.start_date);
          case "alphabetical":
            return a.name.localeCompare(b.name);
          case "dueDate":
            return new Date(a.end_date) - new Date(b.end_date);
          default:
            return 0;
        }
      });

      return {
        ...prevTasks,
        results: sortedResults,
      };
    });
  };

  return (
    <div
      className="flex flex-col min-w-[320px] max-w-[320px]"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      key={key}
    >
      <div className="flex flex-col gap-2">
        <div className="pr-5">
          <header className="flex justify-between w-full gap-5 pl-5 mb-2">
            <div className="flex gap-4">
              <h2 className="flex gap-2 text-base font-bold text-zinc-800">
                <span>{board.name}</span>
              </h2>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
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
                    <DropdownMenuItem onClick={() => sortTasks("newest")}>
                      Date created (newest first)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => sortTasks("oldest")}>
                      Date created (oldest first)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => sortTasks("alphabetical")}>
                      Card name (alphabetically)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => sortTasks("dueDate")}>
                      Due date
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          <Button
            variant="outline"
            type="button"
            size="lg"
            className="w-full"
            onClick={() => setOpenCreateCard(true)}
          >
            <RxPlus className="text-xl" />
            <span className="ml-2">Add Card</span>
          </Button>
        </div>
        <ScrollArea className="[&>div>div[style]]:!block">
          <div className="pr-4 h-[calc(100vh_-335px)] ">
            {tasks?.results &&
              tasks?.count > 0 &&
              tasks?.results.map((task) => (
                <div key={task.id}>
                  <TaskCard
                    task={task}
                    projectId={projectId}
                    boardId={board.id}
                    reloadData={() => fetchData(true)}
                    onDragStart={handleDragStart}
                    onUpdate={updateTaskLocally}
                  />
                </div>
              ))}
          </div>
        </ScrollArea>
      </div>

      {openCreateCard && (
        <TaskEditAddViewDetails
          boardId={board.id}
          isOpen={openCreateCard}
          projectId={projectId}
          setIsOpen={() => {
            setOpenCreateCard(false);
            fetchData(true);
          }}
          reloadData={() => fetchData(true)}
        />
      )}

      {showAddNewListModel && (
        <AddNewListModel
          boardId={board.id}
          onClose={() => {
            setshowAddNewListModel(false);
            fetchData(true);
          }}
          isEditMode
          setIsOpen={setshowAddNewListModel}
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
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    employees: state.emp.employees,
  };
};

export default connect(mapStateToProps)(BoardGridView);
