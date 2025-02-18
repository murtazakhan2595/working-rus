import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { PageLoader, TableCustom } from "components";
import { getTaskByprojectId, getAllTasks } from "app/hooks/taskManagment";
import {
  ProjectBoardColumn,
  ProjectBoardSubtaskColumn,
} from "app/modules/TaskManagment/Sections";
import { Card, CardContent } from "components/ui/card";
import { Button } from "components/ui/button";
import { RxPlus } from "react-icons/rx";
import { SubtaskList } from "app/modules/TaskManagment/Boards/TaskEditAddViewDetails/Sections";
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
                renderExpandedContent={(row) => {
                  if (row.sub_task.length)
                    return <RenderTaskSubTasks subtaskIdList={row.sub_task} />;
                  else return null;
                }}
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

const RenderTaskSubTasks = ({ subtaskIdList = [] }) => {
  const [subTasksDetails, setSubTasksDetails] = useState({
    results: [],
    count: 0,
  });
  const [viewSubTask, setViewSubTask] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubTaskDetailOpen, setIsSubTaskDetailOpen] = useState(false);
  const [ordering, setOrdering] = useState("-start_date");

  const tableOptions = {
    onRowClick: (row) => {
      setIsSubTaskDetailOpen(true);
      setViewSubTask(row);
    },
    onSortChange: (sortName) => {
      setOrdering(sortName);
    },
  };
  const fetchSubTaskDetails = async (isMounted) => {
    if (subtaskIdList.length > 0) {
      setIsLoading(true);
      try {
        const subtaskDetails = await getAllTasks({
          filterData: { id: subtaskIdList },
          ordering: ordering,
        });

        if (isMounted) {
          setSubTasksDetails(subtaskDetails);
        }
      } catch (error) {
        console.error("Error fetching subtasks:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;

    fetchSubTaskDetails(isMounted);

    return () => {
      isMounted = false;
    };
  }, [subtaskIdList, ordering]);

  return (
    <div className="pl-8">
      {isLoading ? (
        <PageLoader />
      ) : (
        <TableCustom
          columns={ProjectBoardSubtaskColumn}
          data={subTasksDetails.results || []}
          pagination={false}
          dataTotalSize={subTasksDetails?.count || 0}
          tableOptions={tableOptions}
          dataStyle={{
            paddingTop: "5px",
            paddingBottom: "5px",
            backgroundColor: "",
          }}
          showHeader={false}
        />
      )}
      {isSubTaskDetailOpen && (
        <TaskEditAddViewDetails
          taskId={viewSubTask?.id}
          isOpen={isSubTaskDetailOpen}
          projectId={viewSubTask?.project_id}
          boardId={viewSubTask?.board_id}
          setIsOpen={() => {
            setIsSubTaskDetailOpen(false);
            setViewSubTask(null);
          }}
          reloadData={() => fetchSubTaskDetails()}
        />
      )}
    </div>
  );
};

export default BoardListView;
