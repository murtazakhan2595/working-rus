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
import { Card } from "components/ui/card";
import SheetComponent from "components/ui/CustomSheet";

const TaskCard = ({ projectId, task, reloadData, onDragStart }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditCardOpen, setIsEditCardOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [comments, setComments] = useState([]);

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
        setIsDropdownOpen(false);
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
    fetchData();
    setIsTaskDetailOpen(false);
  };

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

  const formSheetData = {
    triggerText: null,
    title: "View Details",
    description: null,
    footer: null,
  };

  const formSheetEditData = {
    triggerText: null,
    title: "Edit Card",
    description: null,
    footer: null,
  };



  return (
    <Card
      className="flex flex-col p-3 mt-6 w-full bg-white rounded-lg shadow cursor-pointer"
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
    >
      {isEditCardOpen && (
        <SheetComponent
        {...formSheetEditData}
        isOpen={isEditCardOpen}
        setIsOpen={setIsEditCardOpen}
        width="500px"
        contentClassName="custom-sheet-width"
        >
        <EditCard
          cardId={task.id}
          projectId={projectId}
          onClose={() => {
            setIsEditCardOpen(false);
            setIsTaskDetailOpen(false)
            reloadData();
          }}
        /> 
        </SheetComponent>
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
        {PriorityList.find((option) => option.value === task?.priority)?.label}
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
          <div
            dangerouslySetInnerHTML={{
              __html: `${task?.description.slice(0, 170)}${
                task?.description.length > 170 ? "..." : ""
              }`,
            }}
          />
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
      {isTaskDetailOpen && (
        <SheetComponent
         {...formSheetData}
         isOpen={isTaskDetailOpen}
         setIsOpen={setIsTaskDetailOpen}
         width="500px"
        >
        <TaskDetail
          task={task} // Pass task data as props to TaskDetail
          comments={task.comments} // Pass comments data as props to TaskDetail (if needed)
          attachments={task.attachments} // Pass attachments data as props to TaskDetail (if needed)
          onClose={closeTaskDetail}
          deleteTask={confirmDelete}
        />
        </SheetComponent>
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
