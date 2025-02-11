import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { getAllBoards, deleteBoard, moveTask } from "app/hooks/taskManagment";
import { RxPlus } from "react-icons/rx";
import TaskEditAddViewDetails from "app/modules/TaskManagment/Boards/TaskEditAddViewDetails";
import { ScrollArea, ScrollBar } from "src/@/components/ui/scroll-area";
import TaskCard from "./Task";
import { Button } from "components/ui/button";
import { Card } from "components/ui/card";
import { CardContent } from "components/ui/card";
import { getAllTasks } from "app/hooks/taskManagment";
import { ListActionOptions } from "app/modules/TaskManagment/Boards/Sections";

const BoardGridView = ({
  projectId,
  filterData,
  AllBoards = [],
  reloadData = () => {},
  toggleAddBoardModal = () => {},
}) => {
  return (
    <>
      <ScrollArea className="">
        <Card className="p-0 relative bg-transparent shadow-none border-none">
          <CardContent className="p-0">
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
  const [ordering, setOrdering] = useState("-start_date");

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
      const taskData = await getAllTasks({ ordering, filterData });
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
  }, [ordering, filterData]);

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
                  reloadData={reloadData}
                  boardId={board.id}
                  setOrdering={setOrdering}
                />
              </div>
            </header>

            <Button
              variant="outline"
              type="button"
              className="w-full justify-start group mb-3"
              onClick={() => setOpenCreateCard(true)}
            >
              <RxPlus className="text-xl" />
              <span className="ml-2">Add a card</span>
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
