import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import { deleteTask } from "app/hooks/taskManagment";
import { PriorityList } from "data/Data";
import { BiComment } from "react-icons/bi";
import { getStatus, getStatusIconColor } from "./Sections";
import { MembersList, Labels } from "../Sections";
import { ImAttachment } from "react-icons/im";
import TimeIcon from "assets/images/timeIcon";
import moment from "moment";
import TaskEditAddViewDetails from "app/modules/TaskManagment/Boards/TaskEditAddViewDetails";
import { Card, CardContent, CardFooter } from "components/ui/card";
import AlertDialogue from "components/ui/AlertDialogue";
import { TextUI, TooltipText } from "components";
import { toast } from "react-toastify";
import { addTask } from "app/hooks/taskManagment";
import { ListChecks, Trash2, RotateCcw ,ExternalLink} from "lucide-react";
import { Input } from "components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/@/components/ui/tooltip";
import TaskStatusLabel from "app/modules/TaskManagment/Sections/TaskStatus";
import { Button } from "components/ui/button";

const TaskCard = ({
  projectId,
  task,
  reloadData,
  onDragStart = () => {},
  onUpdate = () => {},
  showMembers = true,
  showDueDate = true,
}) => {
  const [viewTaskDetail, setViewTaskDetail] = useState(task.id);
  const [isSubtask, setIsSubtask] = useState(false);
  const [subTasksDetails, setSubTasksDetails] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);

  const confirmDelete = async () => {
    const response = await deleteTask(task.id);
    if (response && response.status === 200) {
      reloadData();
    }
    setIsDeleteModalOpen(false);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    setIsDeleteModalOpen(true);
  };

  const handleRestore = async (e) => {
    e.preventDefault();
    try {
      const response = await addTask({ is_archive: false }, task.id);
      if (response) {
        reloadData();
        toast.success("Task Restored successfully");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return (
    <Card
      className="w-full p-3 bg-white rounded-lg shadow"
      draggable
      onDragStart={(e) => {
        onDragStart(e, task.id);
      }}
    >
      <CardContent className="p-0 w-full cursor-pointer">
        <div
          className="flex flex-col"
          onClick={(e) => {
            e.preventDefault();
            setIsTaskDetailOpen(true);
          }}
        >
          <div className="my-2">
            {task.cover_photo && (
              <img
                src={task.cover_photo}
                alt="cover image"
                className="w-full h-auto max-h-[200px]  object-contain rounded-lg"
              />
            )}
          </div>
          <div className="flex justify-start items-start py-0.5">
            {task?.label && task?.label.length > 0 && (
              <Labels
                labelsSelected={task.label || []}
                onSelectedLabelsChange={() => {}}
                editMode={false}
              />
            )}
            <span>
              {
                PriorityList.find((option) => option.value === task?.priority)
                  ?.label
              }
            </span>
          </div>
          <div className="flex flex-col gap-2 pb-4 mt-3 border-b border-solid border-zinc-300 text-zinc-800">
            <h3 className="text-base font-bold text-capitalize">
              {task?.name}
            </h3>
            {/* <TextUI text={task?.description} maxLength={130} /> */}
            <div className="flex flex-row justify-start flex-wrap overflow-hidden max-w-[100%]">
              <TooltipText
                tooltipTriggerText={<TaskStatusLabel status={task.status} />}
                content={`Task Status`}
              />
              {task?.end_date && showDueDate && (
                <TimeStatusIcon
                  task={task}
                  onUpdate={onUpdate}
                />
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="w-full justify-between py-2 px-0">
          <div className="flex items-center gap-1">
            {showMembers ? (
              <div className="flex -space-x-2.5">
                {/* Render MembersList component */}
                <MembersList members={task?.assigned_to} />
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Button variant="continue" size="sm" onClick={handleRestore}>
                  <RotateCcw size={15} className="mr-1" />
                  Restore
                </Button>
                <Button
                  variant="destructiveOutline"
                  size="sm"
                  onClick={handleDelete}
                >
                  <Trash2 size={15} />
                </Button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 text-neutral-1000">
            <TooltipText
              tooltipTriggerText={
                <div className="flex gap-0.5 text-sm items-center my-auto whitespace-nowrap">
                  <BiComment />
                  <div>{task?.comment_count || 0}</div>
                </div>
              }
              content={`${task?.comment_count || 0} Comments`}
            />

            <TooltipText
              tooltipTriggerText={
                <div className="flex items-center text-sm gap-0.5 my-auto whitespace-nowrap">
                  <ImAttachment />
                  <div>{task?.attachment_count || 0}</div>
                </div>
              }
              content={`${task?.attachment_count || 0} Attachment`}
            />
            <TooltipText
              tooltipTriggerText={
                <div className="flex items-center text-sm gap-0.5 my-auto whitespace-nowrap">
                  <ListChecks size={16} />
                  <div>{task?.sub_task?.length || 0}</div>
                </div>
              }
              content={`${task?.sub_task?.length || 0} Subtasks`}
            />
            <TooltipText
              tooltipTriggerText={
                <div className="flex items-center text-sm gap-0.5 my-auto whitespace-nowrap">
                  <ExternalLink  size={16} />
                  <div>{task?.relation?.length || 0}</div>
                </div>
              }
              content={`${task?.relation?.length || 0} Task Related`}
            />
          </div>
      </CardFooter>
      {/* Render ConfirmationModal component when isDeleteModalOpen is true */}
      {isDeleteModalOpen && (
        <AlertDialogue
          isOpen={isDeleteModalOpen}
          setIsOpen={() => {
            setIsDeleteModalOpen(false);
          }}
          handleContinue={confirmDelete}
          title="Are you sure?"
          description="Are you sure you want to delete this Card? This action is irreversible and will delete all card details"
        />
      )}

      {/* Render TaskDetail component if isTaskDetailOpen is true */}
      {isTaskDetailOpen && (
        <TaskEditAddViewDetails
          taskId={viewTaskDetail} // Pass task Id as props to TaskDetail
          isOpen={isTaskDetailOpen}
          setIsOpen={() => {
            setIsTaskDetailOpen(false);
            reloadData();
            setViewTaskDetail(task.id);
          }}
          reloadData={reloadData}
          projectId={projectId}
          boardId={task.board_id}
          isSubtask={isSubtask}
        />
      )}
    </Card>
  );
};

const TimeStatusIcon = ({ task, onUpdate }) => {
  const [showCheckbox, setShowCheckbox] = useState(false);
  const [isChecked, setIsChecked] = useState(task.status === "COMPLETED");

  const handleStatusChange = async (value) => {
    try {
      const newStatus = value ? "COMPLETED" : "INPROGRESS";
      const response = await addTask({
        ...task,
        status: newStatus,
      });
      setIsChecked(value);
      onUpdate(task.id, { status: newStatus });
      toast.success("Task status updated successfully");

      if (response) {
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status");
    }
  };

  const handleContainerClick = (e) => {
    e.stopPropagation();
    handleStatusChange(!isChecked);
  };

  const getBackgroundClass = (date) => {
    if (isChecked) {
      return "bg-[#ECFDF3]";
    }

    const status = getStatus(date);
    if (status === "Due Today") {
      return "bg-amber-100";
    } else if (status === "Overdue") {
      return "bg-[#ffe2e2]";
    } else {
      return "bg-gray-50";
    }
  };

  const getIconColor = () => {
    if (isChecked) {
      return "#12B76A";
    }
    return getStatusIconColor(task?.end_date);
  };

  const getTooltipMessage = () => {
    if (isChecked) {
      return "The card is complete.";
    }

    const status = getStatus(task?.end_date);
    if (status === "Overdue") {
      return "The card is past due.";
    } else if (status === "Due Today") {
      return "The card is due today.";
    } else {
      return "The card is due later.";
    }
  };

  const textStyle = {
    color: getIconColor(),
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`flex items-center text-xs rounded px-1 py-1 ${getBackgroundClass(
              task?.end_date
            )} cursor-pointer`}
            onMouseEnter={() => setShowCheckbox(true)}
            onMouseLeave={() => setShowCheckbox(false)}
            onClick={handleContainerClick}
          >
            <div className="relative w-5 h-5">
              <div
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
                  showCheckbox ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <Input
                  type="checkbox"
                  checked={isChecked}
                  value={isChecked}
                  className="w-4 h-4"
                  onChange={(e) => {
                    e.stopPropagation();
                    handleStatusChange(!isChecked);
                  }}
                />
              </div>
              <div
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
                  showCheckbox ? "opacity-0 z-0" : "opacity-100 z-10"
                }`}
              >
                <TimeIcon color={getIconColor()} />
              </div>
            </div>
            <div style={textStyle} className="select-none">
              {moment(task?.end_date).format("MMMM DD")}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipMessage()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(TaskCard);
