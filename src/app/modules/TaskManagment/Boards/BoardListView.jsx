import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { PageLoader, TableCustom } from "components";
import { getTaskByprojectId, getAllTasks } from "app/hooks/taskManagment";
import { ProjectBoardColumn } from "app/modules/TaskManagment/Sections";
import { Card, CardContent } from "components/ui/card";
import { Button } from "components/ui/button";
import { RxPlus } from "react-icons/rx";
import CreateAndEditCardForm from "app/modules/TaskManagment/Boards/Sections/CreateAndEditCardForm";
import TaskEditAddViewDetails from "app/modules/TaskManagment/Boards/TaskEditAddViewDetails";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "src/@/components/ui/accordion";
import { ListActionOptions } from "app/modules/TaskManagment/Boards/Sections";

const BoardListView = ({
  filterData,
  projectId,
  AllBoards = [],
  reloadData = () => {},
  toggleAddBoardModal = () => {},
  isEditMode = true,
}) => {
  return (
    <>
      {isEditMode && (
        <div className="flex justify-end my-4">
          <Button variant="outline" type="button" onClick={toggleAddBoardModal}>
            <RxPlus size={15} />
            <span className="ml-2">Add New List</span>
          </Button>
        </div>
      )}
      <Accordion type="single" collapsible defaultValue="board-0">
        {AllBoards.count > 0 &&
          AllBoards.results.map((board, index) => (
            <ListTasks
              filterData={{
                ...filterData,
                board_id: [board.id],
              }}
              projectId={projectId}
              board={board}
              reloadData={reloadData}
              isEditMode={isEditMode}
              accordionItemValue={`board-${index}`}
            />
          ))}
      </Accordion>
    </>
  );
};

const ListTasks = ({
  filterData,
  projectId,
  board,
  reloadData = () => {},
  isEditMode = true,
  accordionItemValue,
}) => {
  console.log(accordionItemValue,'accordionItemValue')
  const [AllBoardTasks, setAllBoardTasks] = useState({ results: [], count: 0 });
  const [viewTask, setViewTask] = useState(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [ordering, setOrdering] = useState("-start_date");

  const tableOptions = {
    onRowClick: (row) => {
      setIsTaskDetailOpen(true);
      setViewTask(row);
    },
    onSortChange: (sortName) => {
      setOrdering(sortName);
    },
  };

  const fetchData = async (isMounted) => {
    try {
      const boardsData = await getAllTasks({ ordering, filterData });
      if (isMounted) {
        setAllBoardTasks(boardsData);
      }
    } catch (error) {
      console.error("Error fetching employeeLeaveTypes:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [ordering, filterData]);
  if (!isEditMode && AllBoardTasks.count === 0) return null;
  return (
    <AccordionItem value={accordionItemValue} className="mb-3">
      <AccordionTrigger
        className="bg-white rounded-t-sm py-1 px-4 min-h-[44px]"
        style={{ backgroundColor: board.color ? board.color : "white" }}
      >
        <div className="flex flex-row justify-between gap-3 items-center">
          <p className="flex text-sm font-semibold">
            {board.name} ({AllBoardTasks.count || 0})
          </p>
          {isEditMode && (
            <ListActionOptions
              fetchData={fetchData}
              setTasks={(task) => {
                setAllBoardTasks(task);
              }}
              reloadData={reloadData}
              boardId={board.id}
              buttonOrientation={"horizontal"}
              setOrdering={setOrdering}
            />
          )}
          {isEditMode && (
            <Button
              variant="link"
              type="button"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                setSelectedBoard(board.id);
                setIsTaskDetailOpen(true);
              }}
            >
              <RxPlus size={15} />
              <span className="ml-2">Add Task</span>
            </Button>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div key={board.id}>
          <Card className="rounded-t-none rounded-b-sm p-0 mt-2">
            <CardContent className="pb-1 py-2">
              <TableCustom
                columns={ProjectBoardColumn}
                data={AllBoardTasks.results || []}
                pagination={false}
                dataTotalSize={AllBoardTasks?.count || 0}
                tableOptions={tableOptions}
                dataStyle={{ backgroundColor: "white" }}
              />
            </CardContent>
          </Card>
          {isTaskDetailOpen && (
            <TaskEditAddViewDetails
              taskId={viewTask?.id} // Pass task Id as props to TaskDetail
              isOpen={isTaskDetailOpen}
              projectId={projectId}
              boardId={viewTask?.board_id || selectedBoard}
              setIsOpen={() => {
                setIsTaskDetailOpen(false);
                setViewTask(null);
                setSelectedBoard(null);
                fetchData(true);
              }}
              reloadData={() => fetchData(true)}
            />
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default BoardListView;
