import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { deleteTask } from "app/hooks/taskManagment";
import { PriorityList } from "data/Data";
import { ConfirmationModal } from "components";
import { BiComment } from "react-icons/bi";
import { getStatusClass, getStatusIconColor } from "./Sections";
import { CustomDropdown, MembersList } from "../Sections";
import { ImAttachment } from "react-icons/im";
import TimeIcon from "assets/images/timeIcon";
import EditCard from "./EditCard";
import moment from "moment";
import TaskDetail from "./TaskDetail";
import { fetchComments } from "app/hooks/taskManagment";

const TaskCard = ({ projectId, task, reloadData, onDragStart }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditCardOpen, setIsEditCardOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [comments, setComments] = useState([]);

  console.log(comments)

  const editDetails = () => {
    setIsDropdownOpen(false);
    setIsEditCardOpen(true);
  };

  const dropdownOptions = [
    {
      label: "Edit Details",
      onClick: () => {
        editDetails();
      },
    },
    {
      label: "View Details",
      onClick: () => {
        // Optionally, you can open TaskDetail here as well
        setIsTaskDetailOpen(true);
      },
    },
    {
      label: "Delete",
      onClick: () => {
        setIsDeleteModalOpen(true);
      },
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

  // Function to handle opening TaskDetail
  const openTaskDetail = () => {
    setIsTaskDetailOpen(true);
  };
  const closeTaskDetail = () => {
    setIsTaskDetailOpen(false);
  };


  useEffect(() => {

    const fetchData = async () => {
      try {
        const data = await fetchComments(task.id);
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setComments([]);
      }
    };
    fetchData();
  }, [task?.board_id, task?.id]);

  return (
    <div
      className="flex flex-col p-3 mt-6 w-full bg-white rounded-lg shadow cursor-pointer"
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
    >
      {/* Render EditCard component when isEditCardOpen is true */}
      {isEditCardOpen && (
        <EditCard
          cardId={task.id}
          projectId={projectId}
          onClose={() => {
            setIsEditCardOpen(false);
            reloadData();
          }}
        />
      )}
      {/* Render ConfirmationModal component when isDeleteModalOpen is true */}
      {isDeleteModalOpen && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            reloadData();
          }}
          onDelete={confirmDelete}
        />
      )}
      <div className="flex gap-3 justify-between items-center py-0.5">
        {/* Display task priority */}
        {PriorityList.find((option) => option.value === task?.priority)?.label}
        {/* Render CustomDropdown component */}
        <CustomDropdown
          isOpen={isDropdownOpen}
          toggleDropdown={toggleDropdown}
          options={dropdownOptions}
        />
      </div>
      <div className="flex flex-col pb-4 mt-3 border-b border-solid border-zinc-300 text-zinc-800">
        {/* Display task name */}
        <h3 className="text-base font-bold text-capitalize">{task?.name}</h3>
        {/* Display task description */}
        <p
          className="text-sm leading-5 truncate-text"
          style={{ maxHeight: "100px" }}
        >
          {/* Render HTML from task description */}
          <div dangerouslySetInnerHTML={{ __html: task?.description }} />
        </p>
      </div>
      <footer className="flex justify-between py-2">
        <div className="flex gap-1 items-center">
          <div className="flex -space-x-2.5">
            {/* Render MembersList component */}
            <MembersList members={task?.assigned_to} />
          </div>
        </div>
        <div className="flex gap-2 items-center text-zinc-600">
          {task?.end_date && (
            <div
              className={`flex gap-1 justify-center items-center text-sm p-2 rounded ${getStatusClass(
                task?.end_date
              )}`}
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
      {isTaskDetailOpen && (
        <TaskDetail
          task={task} // Pass task data as props to TaskDetail
          comments={task.comments} // Pass comments data as props to TaskDetail (if needed)
          attachments={task.attachments} // Pass attachments data as props to TaskDetail (if needed)
          onClose={closeTaskDetail}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(TaskCard);
