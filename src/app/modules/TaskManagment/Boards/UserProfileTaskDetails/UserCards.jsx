import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "src/@/components/ui/accordion";
import { TableCustom } from "components";
import { getAllTasks } from "app/hooks/taskManagment";
import {
  ProjectBoardColumn,
  RenderTaskSubTasks,
} from "app/modules/TaskManagment/Sections";
import { Card, CardContent } from "components/ui/card";
import { ListActionOptions } from "app/modules/TaskManagment/Boards/Sections";
import { useParams, useNavigate,useLocation } from "react-router-dom";
import { getAllBoards } from "app/hooks/taskManagment";
import Err404 from "app/modules/Error/Err404";

const UserCards = ({ projectId = null, userId = null }) => {
  const [AllBoards, setAllBoards] = useState([]);
  const [filterData, setFilterData] = useState({
    is_subtask: [false],
    is_archive: [false],
    assigned_to: [userId],
  });

  const fetchAllBoards = async (isMounted) => {
    try {
      const boardsData = await getAllBoards(
        projectId ? { filterData: { project_id: [projectId] } } : null
      );
      if (isMounted) {
        setAllBoards(boardsData);
      }
    } catch (error) {
      console.error("Error fetching employeeLeaveTypes:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchAllBoards(isMounted);
    return () => {
      isMounted = false;
    };
  }, [projectId]);

  if (projectId === -1 || !userId) {
    return <Err404 />;
  }
  return (
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
            reloadData={fetchAllBoards}
            accordionItemValue={`board-${index}`}
            userId={userId}
          />
        ))}
    </Accordion>
  );
};

const ListTasks = ({
  filterData,
  board,
  reloadData = () => {},
  accordionItemValue,
  projectId = null,
  userId = null,
}) => {
  const navigate = useNavigate();
  const [AllBoardTasks, setAllBoardTasks] = useState({ results: [], count: 0 });
  const [ordering, setOrdering] = useState("-start_date");

  const tableOptions = {
    onRowClick: (row) => {
      handleNavigation(row.id,row.project_id);
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

  const handleNavigation = (taskID,projectId) => {
    navigate(`/project-board/card/${taskID}`, {
      state: {
        GOTO_URLS: `/project-board/user/${userId}`,
        activeView: "cards",
        projectId: projectId,
      },
    });
  };

  if (AllBoardTasks.count === 0) return null;
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
                    return (
                      <RenderTaskSubTasks
                        subtaskIdList={row.sub_task}
                        parentTaskId={row.id}
                        GOTO_URLS={`/project-board/user/${userId}`}
                        activeView="cards"
                        projectId={row.project_id}
                      />
                    );
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

export default UserCards;
