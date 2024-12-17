import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { deleteTask } from "app/hooks/taskManagment";
import { PriorityList } from "data/Data";
import { BiComment } from "react-icons/bi";
import { getStatusClass, getStatusIconColor } from "./Sections";
import { CustomDropdown, MembersList, Labels } from "../Sections";
import { ImAttachment } from "react-icons/im";
import TimeIcon from "assets/images/timeIcon";
import EditCard from "./EditCard";
import moment from "moment";
import TaskDetail from "./TaskDetail";
import { fetchComments } from "app/hooks/taskManagment";
import { Card } from "components/ui/card";
import SheetComponent from "components/ui/CustomSheet";
import AlertDialogue from "components/ui/AlertDialogue";

const TaskCard = ({ projectId, task, reloadData, onDragStart }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditCardOpen, setIsEditCardOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const dropdownOptions = [
    {
      label: "Edit Details",
      onClick: () => {
        setIsDropdownOpen(false);
        setIsEditCardOpen(true);
      },
    },
    {
      label: "View Details",
      onClick: () => {
        setIsDropdownOpen(false);
        setIsTaskDetailOpen(true);
      },
    },
    {
      label: "Delete",
      onClick: () => handleDelete(),
    },
  ];

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const confirmDelete = async () => {
    const response = await deleteTask(task.id);
    if (response && response.status === 200) {
      reloadData();
    }
    setIsDeleteModalOpen(false);
  };

  // State to manage TaskDetail visibility
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);


  const fetchData = async () => {
    try {
      const data = await fetchComments({ task_id: [task.id] });
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    }
  };
  useEffect(() => {
    fetchData();
  }, [task?.board_id, task?.id]);

  return (
    <Card
      className="flex flex-col w-full p-3 mt-6 bg-white rounded-lg shadow cursor-pointer"
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
          title="Confirm Delete?"
          description="This action can't be undone. All information associated with this
            will be lost."
        />
      )}
      <div className="flex justify-between items-start py-0.5">
        <div className="flex justify-between">
          {task?.label && (
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
        <CustomDropdown
          isOpen={isDropdownOpen}
          toggleDropdown={toggleDropdown}
          options={dropdownOptions}
        />
      </div>
      <div className="flex flex-col pb-4 mt-3 border-b border-solid border-zinc-300 text-zinc-800">
        <h3 className="text-base font-bold text-capitalize">{task?.name}</h3>
        <p
          className="text-sm leading-5 truncate-text"
          style={{ maxHeight: "100px" }}
        >
          <span
            dangerouslySetInnerHTML={{
              __html: `${task?.description.slice(0, 170)}${
                task?.description.length > 170 ? "..." : ""
              }`,
            }}
          />
        </p>
      </div>
      <footer className="flex justify-between py-2">
        <div className="flex items-center gap-1">
          <div className="flex -space-x-2.5">
            {/* Render MembersList component */}
            <MembersList members={task?.assigned_to} />
          </div>
        </div>
        <div className="flex items-center gap-2 text-zinc-600">
          {task?.end_date && (
            <div
              className={`flex gap-1 justify-center items-center text-sm p-2 rounded`}
            >
              {/* Render TimeIcon component */}
              <TimeIcon color={getStatusIconColor(task?.end_date)} />
              <div className="my-auto">
                {/* Display formatted date */}
                {moment(task?.end_date).format("MMMM DD")}
              </div>
            </div>
          )}
          <div className="flex gap-0.5 items-center my-auto whitespace-nowrap">
            <BiComment />
            <div>{comments?.length || 0}</div>
          </div>
          <div className="flex items-center gap-0.5 my-auto whitespace-nowrap">
            <ImAttachment />
            <div>{task?.attachment?.length || 0}</div>
          </div>
        </div>
      </footer>
      {/* Render TaskDetail component if isTaskDetailOpen is true */}
      <TaskDetail
        taskId={task.id} // Pass task Id as props to TaskDetail
        handleDelete={handleDelete}
        isOpen={isTaskDetailOpen}
        setIsOpen={setIsTaskDetailOpen}
      />
      <EditCard
        cardId={task.id}
        projectId={projectId}
        onClose={() => {
          setIsEditCardOpen(false);
          setIsTaskDetailOpen(false);
          reloadData();
        }}
        setIsOpen={setIsEditCardOpen}
        isOpen={isEditCardOpen}
      />
    </Card>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(TaskCard);
