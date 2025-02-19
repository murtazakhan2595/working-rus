import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "components/ui/button";
import { PageLoader, TableCustom, TextUI } from "components";
import { getTaskById, addTask, getAllTasks } from "app/hooks/taskManagment";
import { toast } from "react-toastify";
import TaskEditAddViewDetails from "../Boards/TaskEditAddViewDetails";
import { calculateTotalCount, calculatePercentage } from "utils/renderValues";
import { Checkbox } from "src/@/components/ui/checkbox";
import { URLS } from "constants/config";
import { Progress } from "src/@/components/ui/progress";
import {
  ProjectBoardSubtaskColumn,
  SubtaskColumn,
  MembersList,
  TaskEndDate,
  TaskStatusLabel,
  RenderTaskTitle,
} from "app/modules/TaskManagment/Sections";
export default function Subtasks({
  taskId,
  projectId,
  boardId,
  items,
  projectDetail,
  fetchTaskData,
}) {
  const [isAddSubtaskOpen, setIsAddSubtaskOpen] = useState(false);
  const [subTaskCompletedPercentage, setSubTaskCompletedPercentage] =
    useState(0);
  const [viewSubtasks, setViewSubtasks] = useState(null);
  const [subTasksDetails, setSubTasksDetails] = useState([]);
  const fetchSubTaskProgress = async (isMounted) => {
    if (items.length > 0) {
      try {
        const subtaskDetails = await getAllTasks({
          filterData: { id: items },
        });

        if (isMounted) {
          setSubTasksDetails(subtaskDetails.results);
          const completedTask = calculateTotalCount(
            subtaskDetails.results,
            "status",
            "COMPLETED"
          );
          setSubTaskCompletedPercentage(
            calculatePercentage(completedTask, subtaskDetails.count)
          );
        }
      } catch (error) {
        console.error("Error fetching subtasks:", error);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchSubTaskProgress(isMounted);
    return () => {
      isMounted = false;
    };
  }, [items]);

  const handleAddSubtask = async () => {
    setIsAddSubtaskOpen(true);
  };

  const handleSubtaskCreated = async (newTask) => {
    try {
      if (newTask) {
        // Update parent task's sub_task array
        const updatedSubTasks = [...(items || []), newTask.id];
        // Update the parent task
        await addTask({ sub_task: updatedSubTasks }, taskId);
        // Refresh the subtasks list
        fetchTaskData(true);
        // Close the dialog and clean up
        setIsAddSubtaskOpen(false);
      }
    } catch (error) {
      console.error("Error updating parent task:", error);
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-3 flex-4 items-center">
        <Progress
          value={subTaskCompletedPercentage || 0}
          className="mt-1 h-2 bg-gray-400"
        />
        <span>{subTaskCompletedPercentage.toFixed(0) || 0}%</span>
      </div>

      <RenderSubtaskList
        subtaskList={subTasksDetails}
        reloadData={fetchSubTaskProgress}
      />

      {/* Add Subtask Button */}
      <Button
        type="button"
        variant="continue"
        size="sm"
        className="w-full"
        onClick={(e) => {
          e.preventDefault();
          handleAddSubtask();
        }}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Subtask
      </Button>

      {/* Subtask Creation Dialog */}
      {isAddSubtaskOpen && (
        <TaskEditAddViewDetails
          taskId={viewSubtasks}
          isOpen={isAddSubtaskOpen}
          setIsOpen={(value) => {
            setViewSubtasks(null);
            setIsAddSubtaskOpen(value);
          }}
          projectId={projectId}
          boardId={boardId}
          onTaskCreated={handleSubtaskCreated}
          isSubtask={true}
        />
      )}
    </div>
  );
}

const RenderSubtaskList = ({ subtaskList = [], reloadData = () => {} }) => {
  const [isAddSubtaskOpen, setIsAddSubtaskOpen] = useState(false);
  const [viewSubtasks, setViewSubtasks] = useState(null);
  const handleStatusChange = async (status, taskId) => {
    try {
      const newStatus =
        status?.toUpperCase() !== "COMPLETED" ? "COMPLETED" : "INPROGRESS";
      const response = await addTask({ status: newStatus }, taskId);
      if (response) {
        reloadData(true);
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };
  return (
    <div className="space-y-2">
      {subtaskList?.length > 0 &&
        subtaskList?.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-gray-100"
            onClick={(e) => {
              e.preventDefault();
              setIsAddSubtaskOpen(true);
              setViewSubtasks(task);
            }}
          >
            <div className="inline-flex justify-start items-center gap-2">
              <Checkbox
                checked={task.status?.toUpperCase() === "COMPLETED"}
                className=""
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange(task.status, task.id);
                }}
              />
              <div className=" w-full">
                <TextUI
                  text={task.name}
                  className={`${
                    task.status?.toUpperCase() === "COMPLETED"
                      ? "line-through text-muted-foreground"
                      : ""
                  }`}
                />
              </div>
              <TaskStatusLabel status={task.status} />
            </div>
            <div className="flex justify-end w-fit">
              <MembersList members={task.assigned_to} />
            </div>
          </div>
        ))}
      {isAddSubtaskOpen && (
        <TaskEditAddViewDetails
          taskId={viewSubtasks.id}
          isOpen={isAddSubtaskOpen}
          setIsOpen={(value) => {
            setViewSubtasks(null);
            setIsAddSubtaskOpen(false);
            reloadData(true);
          }}
          projectId={viewSubtasks.project_id}
          boardId={viewSubtasks.board_id}
          isSubtask={true}
        />
      )}
    </div>
  );
};

export const RenderTaskSubTasks = ({
  subtaskIdList = [],
  TaskColumns = ProjectBoardSubtaskColumn,
  showAsSubDetail = true,
  showHeader = false,
}) => {
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
    <div className={`${showAsSubDetail ? "pl-8 py-3" : ""}`}>
      {isLoading ? (
        <PageLoader />
      ) : (
        <TableCustom
          columns={TaskColumns}
          data={subTasksDetails.results || []}
          pagination={false}
          dataTotalSize={subTasksDetails?.count || 0}
          tableOptions={tableOptions}
          dataStyle={
            showAsSubDetail
              ? {
                  paddingTop: "5px",
                  paddingBottom: "5px",
                  backgroundColor: "",
                }
              : {}
          }
          showHeader={showHeader}
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
