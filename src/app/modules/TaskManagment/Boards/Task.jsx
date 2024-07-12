import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Project } from "app/utils/Types/TaskManagment";
import { Table, Header, PageLoader } from "components";
import { FilterInput } from "components/form-control";
import { Card, CardBody, Row, Col, Button } from "reactstrap";
import {
  getAllBoards,
  getProjectById,
  getTaskByBoardId,
} from "app/hooks/taskManagment";
import { priorityOptions } from "data/Data";
import { FaPlus } from "react-icons/fa";
import { getRandomColor } from "utils/getValuesFromTables";
import { EmployeeName } from "utils/getValuesFromTables";
import { FiFilter } from "react-icons/fi";
import { RxPlus } from "react-icons/rx";
import { useParams, Link } from "react-router-dom";
import RenderProject from "./Sections/RenderProject";
import { CustomDropdown, MembersList } from "../Sections";
import { AddNewListModel, MembersDropdown } from "./Sections";
import { BsThreeDotsVertical } from "react-icons/bs";
import highpriority from "assets/images/highpriority.svg";
import lowpriority from "assets/images/lowpriority.svg";
import TimeIcon from "assets/images/timeIcon";
import message from "assets/images/message.svg";
import attachmentsIcon from "assets/images/attachments.svg";
import EditCard from "./EditCard";


const TaskCard = ({
  projectId,
  task,
  title,
  description,
  dueDate,
  status,
  comments,
  attachments,
  priority,
  project_members,
  completed,
}) => {
  console.log("task", task)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditCardOpen, setIsEditCardOpen] = useState(false);
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
    { label: "View Details", onClick: ()=>{} },
    { label: "Delete", onClick: ()=>{} },
  ];
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const getStatusClass = (status) => {
    switch (status) {
      case "amber":
        return "text-amber-500 bg-orange-100";
      case "red":
        return "text-white bg-red-600";
      default:
        return "bg-neutral-200 text-zinc-600";
    }
  };

  const getPriorityIcon = (priority) => {
    if (priority === "high") {
      return (
        <div className="flex justify-center items-center px-1.5 pt-1 pb-0.5 rounded-[100px]">
          <img loading="lazy" src={highpriority} alt="" />
        </div>
      );
    }
    return (
      <div className="flex justify-center items-center px-1.5 pt-1 pb-0.5  rounded-[100px]">
        <img loading="lazy" src={lowpriority} alt="" />
      </div>
    );
  };
  const closeEditCard = () => {
    setIsEditCardOpen(false);
  }

  return (
    <div className="flex flex-col p-3 mt-6 w-full bg-white rounded-lg shadow">
      {isEditCardOpen && (
        <EditCard cardId={task.id} projectId={projectId} onClose={closeEditCard}/>
      )}
      <div className="flex gap-3 justify-between items-center py-0.5 ">
        {
          priorityOptions.find((option) => option.value === task?.priority)
            ?.label
        }
        {/* <BsThreeDotsVertical
          className="text-[#757880] cursor-pointer"
          onClick={toggleDropdown}
        /> */}
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
          <div dangerouslySetInnerHTML={{ __html: task?.description }} />
        </p>
      </div>
      <footer className="flex justify-between py-2">
        <div className="flex gap-1 items-center">
          <div className="flex -space-x-2.5">
            <MembersList members={task?.assigned_to} />
          </div>
          <FaPlus className="text-black p-1 bg-[#e3e3e3] text-center rounded-full cursor-pointer" />
        </div>
        <div className="flex gap-2 items-center text-xs text-zinc-600">
          {dueDate && (
            <div
              className={`flex gap-1 justify-center items-center self-stretch px-1.5 py-1 text-xs leading-6 rounded ${getStatusClass(
                status
              )}`}
            >
              <TimeIcon
                color={
                  status === "amber"
                    ? "#FF9A1F"
                    : status === "red"
                    ? "#fff"
                    : "#5C5E64"
                }
              />
              <div className="my-auto">{dueDate}</div>
            </div>
          )}
          {comments !== null && (
            <div className="flex gap-0.5 items-center self-stretch my-auto whitespace-nowrap">
              <img
                loading="lazy"
                src={message}
                className="shrink-0 self-start w-3 aspect-square"
                alt=""
              />
              <div>{comments}</div>
            </div>
          )}
          {attachments !== null && (
            <div className="flex items-center gap-0.5 self-stretch my-auto whitespace-nowrap">
              <img
                loading="lazy"
                src={attachmentsIcon}
                className="shrink-0 self-start w-3 aspect-square"
                alt=""
              />
              <div>{attachments}</div>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(TaskCard);
