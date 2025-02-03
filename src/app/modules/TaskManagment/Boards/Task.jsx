import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { deleteTask } from "app/hooks/taskManagment";
import { PriorityList } from "data/Data";
import { BiComment } from "react-icons/bi";
import { getStatus, getStatusIconColor } from "./Sections";
import { CustomDropdown, MembersList, Labels } from "../Sections";
import { ImAttachment } from "react-icons/im";
import TimeIcon from "assets/images/timeIcon";
import EditCard from "./EditCard";
import moment from "moment";
import TaskEditAddViewDetails from "app/modules/TaskManagment/Boards/TaskEditAddViewDetails";
import { Card } from "components/ui/card";
import AlertDialogue from "components/ui/AlertDialogue";
import { TextUI } from "components";
import { toast } from "react-toastify";
import { addTask } from "app/hooks/taskManagment";
import { getAttachmentDetails } from "app/hooks/taskManagment";
import { Input } from "components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/@/components/ui/tooltip";
import { getTaskById } from "app/hooks/taskManagment";
import { ListChecks } from "lucide-react";

const TaskCard = ({ projectId, task, reloadData, onDragStart, onUpdate }) => {
  const [viewTaskDetail, setViewTaskDetail] = useState(task.id);
  const [isEditCardOpen, setIsEditCardOpen] = useState(false);
  const [isSubtask, setIsSubtask] = useState(false);
  const [subTasksDetails, setSubTasksDetails] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // State to manage TaskDetail visibility
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const fetchSubtasks = async () => {
    if (task.sub_task && task.sub_task.length > 0) {
      const subtaskDetails = await Promise.all(
        task.sub_task.map((subtaskId) => getTaskById(subtaskId))
      );
      setSubTasksDetails(subtaskDetails);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const attachment = await getAttachmentDetails([task.attachment[0]]);
      if (attachment) {
        setCoverImage(attachment[0]?.attachment);
      }
    };
    if (task?.attachment?.length > 0) {
      fetchData();
    }
    fetchSubtasks();
  }, [task]);

  const confirmDelete = async () => {
    const response = await deleteTask(task.id);
    if (response && response.status === 200) {
      reloadData();
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <Card
      className="w-full p-3 mt-6 bg-white rounded-lg shadow cursor-pointer"
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
    >
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
      <div className="flex flex-col">
        <div
          className="my-2"
          onClick={(e) => {
            e.preventDefault();
            setIsTaskDetailOpen(true);
          }}
        >
          {coverImage && (
            <img
              src={coverImage}
              alt="cover image"
              className="w-full h-auto max-h-[200px]  object-contain rounded-lg"
            />
          )}
        </div>
        <div
          className="flex justify-start items-start py-0.5"
          onClick={(e) => {
            e.preventDefault();
            setIsTaskDetailOpen(true);
          }}
        >
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
        <div className="flex flex-col pb-4 mt-3 border-b border-solid border-zinc-300 text-zinc-800">
          <h3
            className="text-base font-bold text-capitalize"
            onClick={(e) => {
              e.preventDefault();
              setIsTaskDetailOpen(true);
            }}
          >
            {task?.name}
          </h3>
          <TextUI text={task?.description} maxLength={130} />
          <div className="flex gap-3 justify-start font-semibold text-sm text-grey-1000 mt-3">
            {task?.relation &&
              task.relation.map((relation) => (
                <span
                  key={relation}
                  className="hover:text-gray-800 "
                  onClick={(e) => {
                    e.preventDefault();
                    setViewTaskDetail(relation);
                    setIsTaskDetailOpen(true);
                  }}
                >{`RT-${relation}`}</span>
              ))}
            {subTasksDetails &&
              subTasksDetails.map((sub_task) => (
                <TooltipProvider key={sub_task.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span
                        className="hover:text-gray-800 cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsSubtask(true);
                          setViewTaskDetail(sub_task.id);
                          setIsTaskDetailOpen(true);
                        }}
                      >{`ST-${sub_task.id}`}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{sub_task.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
          </div>
        </div>
        <footer className="flex justify-between py-2">
          <div className="flex items-center gap-1">
            <div className="flex -space-x-2.5">
              {/* Render MembersList component */}
              <MembersList members={task?.assigned_to} />
            </div>
          </div>
          <div className="flex items-center gap-2 text-neutral-1000">
            {task?.end_date && (
              <TimeStatusIcon
                task={task}
                getStatusIconColor={getStatusIconColor}
                onUpdate={onUpdate}
              />
            )}
            <div className="flex gap-0.5 text-sm items-center my-auto whitespace-nowrap">
              <BiComment />
              <div>{task?.comment_count || 0}</div>
            </div>
            <div className="flex items-center text-sm gap-0.5 my-auto whitespace-nowrap">
              <ImAttachment />
              <div>{task?.attachment_count || 0}</div>
            </div>
            <div className="flex items-center text-sm gap-0.5 my-auto whitespace-nowrap">
              <ListChecks size={16} />
              <div>{task?.sub_task?.length || 0}</div>
            </div>
          </div>
        </footer>
      </div>
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
      {isEditCardOpen && (
        <EditCard
          cardId={task.id}
          projectId={projectId}
          onClose={() => {
            setIsEditCardOpen(false);
            setIsTaskDetailOpen(false);
            setIsSubtask(false);
            reloadData();
          }}
          setIsOpen={setIsEditCardOpen}
          isOpen={isEditCardOpen}
        />
      )}
    </Card>
  );
};

const TimeStatusIcon = ({ task, getStatusIconColor, onUpdate }) => {
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
            className={`flex items-center text-sm rounded px-1 py-1 ${getBackgroundClass(
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
