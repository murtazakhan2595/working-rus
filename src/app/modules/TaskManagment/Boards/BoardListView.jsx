import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { TableCustom } from "components";
import { getAllTasks } from "app/hooks/taskManagment";
import {
  ProjectBoardColumn,
  RenderTaskSubTasks,
} from "app/modules/TaskManagment/Sections";
import { Card, CardContent } from "components/ui/card";
import { Button } from "components/ui/button";
import { RxPlus } from "react-icons/rx";
import TaskEditAddViewDetails from "app/modules/TaskManagment/Boards/TaskEditAddViewDetails";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "src/@/components/ui/accordion";
import { ListActionOptions } from "app/modules/TaskManagment/Boards/Sections";
import { useNavigate, useParams } from "react-router-dom";

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
  board,
  reloadData = () => {},
  isEditMode = true,
  accordionItemValue,
}) => {
  const navigate = useNavigate();
  const { projectId, viewStyle } = useParams();
  const [AllBoardTasks, setAllBoardTasks] = useState({ results: [], count: 0 });
  const [ordering, setOrdering] = useState("-start_date");

  const tableOptions = {
    onRowClick: (row) => {
      navigate(
        `/project-board/${row.project_id}/${viewStyle}/${row.board_id}/${row.id}`
      );
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
                navigate(
                  `/project-board/${projectId}/${viewStyle}/${board.id}`
                );
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
                    return <RenderTaskSubTasks subtaskIdList={row.sub_task} parentTaskId={row.id} />;
                  else return null;
                }}
              />
            </CardContent>
          </Card>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default BoardListView;
