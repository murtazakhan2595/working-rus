import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { getAllBoards, deleteBoard, moveTask, updateBoardPosition } from "app/hooks/taskManagment";
import { RxPlus } from "react-icons/rx";
import { AddNewListModel } from "./Sections";
import TaskEditAddViewDetails from "app/modules/TaskManagment/Boards/TaskEditAddViewDetails";
import { ScrollArea, ScrollBar } from "src/@/components/ui/scroll-area";
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
import { ListActionOptions } from "app/modules/TaskManagment/Boards/Sections";

const BoardGridView = ({
  projectId,
  filterData,
  AllBoards = [],
  reloadData = () => {},
  toggleAddBoardModal = () => {},
}) => {
  const [boards, setBoards] = useState([]);
  const [draggedBoard, setDraggedBoard] = useState(null);

  useEffect(() => {
    if (AllBoards?.results) {
      console.log(AllBoards?.results, "RESULTS")
      setBoards(AllBoards.results);
    }
  }, [AllBoards]);

  const handleDragStart = (e, board) => {
    setDraggedBoard(board);
    e.dataTransfer.effectAllowed = "move";
    // Add some styling to dragged element
    e.target.style.opacity = "0.5";
  };

  const handleDragEnd = (e) => {
    setDraggedBoard(null);
    // Reset styling
    e.target.style.opacity = "1";
  };

  const handleDragOver = (e, board) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    
    // Add visual feedback
    const draggedOverElement = e.currentTarget;
    if (draggedOverElement) {
      draggedOverElement.style.borderLeft = draggedBoard?.id === board.id ? "" : "3px solid #4f46e5";
    }
  };

  const handleDragLeave = (e) => {
    e.currentTarget.style.borderLeft = "";
  };

  const handleDrop = async (e, targetBoard) => {
    e.preventDefault();
    e.currentTarget.style.borderLeft = "";
    
    if (!draggedBoard || draggedBoard.id === targetBoard.id) return;

    const oldIndex = boards.findIndex(b => b.id === draggedBoard.id);
    const newIndex = boards.findIndex(b => b.id === targetBoard.id);
    
    if (oldIndex === -1 || newIndex === -1) return;

    // Create new array with reordered columns
    const newBoards = [...boards];
    newBoards.splice(oldIndex, 1);
    newBoards.splice(newIndex, 0, draggedBoard);

    // Update local state immediately for smooth UI
    setBoards(newBoards);

    try {
      // Update the position in backend
      await Promise.all(newBoards.map((board, index) => 
        updateBoardPosition(board.id, index)
      ));
      
      // Refresh data from server
      reloadData(true);
    } catch (error) {
      console.error("Error updating board positions:", error);
      // Revert to original order on error
      setBoards(AllBoards.results);
    }
  };

  return (
    <>
      <ScrollArea className="">
        <Card className="p-0 relative bg-transparent shadow-none border-none">
          <CardContent className="p-0">
            <div className="flex gap-8 mt-5">
              {boards.map((board) => (
                <div
                  key={board.id}
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, board)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOver(e, board)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, board)}
                  className="cursor-move transition-all duration-200"
                >
                  <TaskColumn
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
                </div>
              ))}
              <div className="flex flex-col min-w-[290px] max-w-[320px] mb-5">
                <div className="flex flex-col">
                  <header className="">
                    <Button
                      variant="outline"
                      type="button"
                      size="lg"
                      className="w-full text-start"
                      onClick={toggleAddBoardModal}
                    >
                      <RxPlus className="text-xl" />
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
  const [boardTaskFilters, setBoardTaskFilters] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    let isMounted = true;
    if (isMounted)
      setBoardTaskFilters((prev) => {
        return { ...prev, filterData: filterData };
      });
    return () => {
      isMounted = false;
    };
  }, [filterData]);

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
      const taskData = await getAllTasks(boardTaskFilters);
      if (taskData && isMounted) {
        setTasks(taskData);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (boardTaskFilters) fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [boardTaskFilters]);

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

  return (
    <div
      className="flex flex-col min-w-[320px] max-w-[320px]"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      key={key}
    >
      <div className="flex flex-col">
        <div
          className={`rounded-xl py-4`}
          style={{ background: board.color ? board.color : "white" }}
        >
          <div className="flex flex-col px-4">
            <header className="flex justify-between w-full items-center mb-3">
              <h2 className="text-zinc-800 text-base font-bold">
                {board.name}
              </h2>
              <div className="flex gap-1">
                <ListActionOptions
                  fetchData={fetchData}
                  setTasks={(task) => {
                    setTasks(task);
                  }}
                  reloadData={reloadData}
                  boardId={board.id}
                  taskFilters={boardTaskFilters}
                  setTaskFilters={setBoardTaskFilters}
                />
              </div>
            </header>

            <Button
              variant="outline"
              type="button"
              className="w-full justify-center group mb-3"
              onClick={() => setOpenCreateCard(true)}
            >
              <RxPlus className="text-xl" />
              <span className="ml-2">Add Task</span>
            </Button>
          </div>
          <ScrollArea className="[&>div>div[style]]:!block">
            <div className="space-y-3 h-[calc(100vh_-335px)] px-4">
              {tasks?.results &&
                tasks?.count > 0 &&
                tasks?.results.map((task) => (
                  <TaskCard
                    task={task}
                    projectId={projectId}
                    boardId={board.id}
                    reloadData={() => fetchData(true)}
                    onDragStart={handleDragStart}
                    onUpdate={updateTaskLocally}
                  />
                ))}
            </div>
          </ScrollArea>
        </div>
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
    </div>
  );
};

export default BoardGridView;
