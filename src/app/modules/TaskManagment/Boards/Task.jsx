import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import { deleteTask } from "app/hooks/taskManagment";
import { PriorityList } from "data/Data";
import { BiComment } from "react-icons/bi";
import { MembersList, Labels } from "../Sections";
import { ImAttachment } from "react-icons/im";
import TaskEditAddViewDetails from "app/modules/TaskManagment/Boards/TaskEditAddViewDetails";
import { Card, CardContent, CardFooter } from "components/ui/card";
import AlertDialogue from "components/ui/AlertDialogue";
import { TextUI, TooltipText } from "components";
import { toast } from "react-toastify";
import { addTask, getAllTasks } from "app/hooks/taskManagment";
import {
  Trash2,
  RotateCcw,
  ExternalLink,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Badge } from "components/ui/badge";
import {
  TaskStatusLabel,
  RenderTaskTitle,
  TaskEndDate,
} from "app/modules/TaskManagment/Sections";
import { Button } from "components/ui/button";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const TaskCard = ({
  task,
  reloadData = () => {},
  onDragStart = () => {},
  showMembers = true,
  showDueDate = true,
}) => {
  const [subTasksDetails, setSubTasksDetails] = useState([]);
  const [openSubtaskDetails, setOpenSubtaskDetails] = useState(false);

  const fetchSubTaskDetails = async (isMounted) => {
    try {
      const subtaskDetails = await getAllTasks({
        filterData: { id: task?.sub_task },
      });

      if (isMounted) {
        setSubTasksDetails(subtaskDetails.results);
      }
    } catch (error) {
      console.error("Error fetching subtasks:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (task?.sub_task?.length) fetchSubTaskDetails(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div
      className="flex flex-col gap-1 rounded-lg cursor-default"
      draggable
      onDragStart={(e) => {
        onDragStart(e, task.id);
      }}
      key={task.id}
    >
      <TaskDetails
        task={task}
        reloadData={reloadData}
        showMembers={showMembers}
        showDueDate={showDueDate}
        setOpenSubtaskDetails={setOpenSubtaskDetails}
        openSubtaskDetails={openSubtaskDetails}
      />

      {openSubtaskDetails &&
        subTasksDetails.map((subtask) => (
          <div className="pl-5" key={subtask.id}>
            <TaskDetails
              task={subtask}
              reloadData={fetchSubTaskDetails}
              showMembers={showMembers}
              showDueDate={showDueDate}
              isSubtask={true}
              parentTaskId={task.id}
            />
          </div>
        ))}
    </div>
  );
};

const TaskDetails = ({
  task,
  showMembers = true,
  showDueDate = true,
  reloadData = () => {},
  setOpenSubtaskDetails = () => {},
  openSubtaskDetails = false,
  isSubtask = false,
  parentTaskId = null,
}) => {
  const navigate = useNavigate();
  const { projectId, viewStyle } = useParams();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const userId = useSelector((state) => state.user.userProfile.id);

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
      const response = await addTask({ is_archive: false }, task.id, userId, {
        is_archive: true,
      });
      if (response) {
        reloadData();
        toast.success("Task Restored successfully");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };
  return (
    <Card className="w-full p-3 bg-white rounded-lg border-2 border-gray-300">
      <CardContent className="p-0 w-full cursor-pointer border-b border-solid border-zinc-300 pb-4 ">
        <div
          className="flex flex-col"
          onClick={(e) => {
            e.preventDefault();
            navigate(
              `/project-board/${projectId}/${viewStyle}/${task.board_id}/${
                isSubtask ? `${parentTaskId}/` : ""
              }${task.id}`
            );
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
          <div className="flex flex-col gap-2 mt-3 text-zinc-800">
            {/* <h3 className="text-base font-bold text-capitalize">
              {task?.name}
            </h3> */}
            <RenderTaskTitle
              title={task.name}
              taskId={task.id}
              isChecked={task.status?.toUpperCase() === "COMPLETED"}
              className="text-base font-bold text-capitalize pl-3"
              reload={reloadData}
            />
            {/* <TextUI text={task?.description} maxLength={130} /> */}
            <div className="flex flex-row justify-start flex-wrap overflow-hidden max-w-[100%]">
              <TaskStatusLabel status={task.status} />
              {task?.end_date && showDueDate && (
                <TaskEndDate dueDate={task.end_date} taskStatus={task.status} />
              )}
            </div>
          </div>
        </div>
        {!task.is_subtask && (
          <div className="mt-2">
            <TooltipText
              tooltipTriggerText={
                <Badge
                  className="rounded"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenSubtaskDetails(!openSubtaskDetails);
                  }}
                  variant="plum"
                >
                  {openSubtaskDetails ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                  <div>{task?.sub_task?.length || 0} Subtask</div>
                </Badge>
              }
              content={`${task?.sub_task?.length || 0} Subtasks`}
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="w-full justify-between py-2 px-0">
        <div className="flex items-center gap-1">
          {showMembers ? (
            <div className="flex -space-x-2.5">
              {/* Render MembersList component */}
              <MembersList
                members={task?.assigned_to}
                onMemberClick={(event, user) => {
                  event.preventDefault();
                  if (task.project_id && user.id)
                    navigate(
                      `/project-board/${task.project_id}/user/${user.id}`
                    );
                }}
              />
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
                <ExternalLink size={16} />
                <div>{task?.relation_ship?.length || 0}</div>
              </div>
            }
            content={`${task?.relation_ship?.length || 0} Task Related`}
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
    </Card>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(TaskCard);
