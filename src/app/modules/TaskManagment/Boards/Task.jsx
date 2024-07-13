import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { deleteTask } from "app/hooks/taskManagment";
import { PriorityList } from "data/Data";
import {ConfirmationModal}  from "components";
import { BiComment } from "react-icons/bi";
import { getStatusClass, getStatusIconColor } from "./Sections";
import { CustomDropdown, MembersList } from "../Sections";
import { ImAttachment } from "react-icons/im";
import TimeIcon from "assets/images/timeIcon";
import EditCard from "./EditCard";
import moment from "moment";

const TaskCard = ({ projectId, task, reloadData }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditCardOpen, setIsEditCardOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
    { label: "View Details", onClick: () => {} },
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

  return (
    <div className="flex flex-col p-3 mt-6 w-full bg-white rounded-lg shadow">
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
      <div className="flex gap-3 justify-between items-center py-0.5 ">
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
          <div dangerouslySetInnerHTML={{ __html: task?.description }} />
        </p>
      </div>
      <footer className="flex justify-between py-2">
        <div className="flex gap-1 items-center">
          <div className="flex -space-x-2.5">
            <MembersList members={task?.assigned_to} />
          </div>
          {/* <div className="w-8 h-8 rounded-full flex justify-center items-center cursor-pointer bg-[#eceaea] border-2">
            <span className="text-white text-2xl flex justify-center items-center plus-icon w-8 h-8">
              <RxPlus />
            </span>
          </div> */}
        </div>
        <div className="flex gap-2 items-center text-zinc-600">
          {task?.end_date && (
            <div
              className={`flex gap-1 justify-center items-center text-sm p-2 rounded ${getStatusClass(
                task?.end_date
              )}`}
            >
              <TimeIcon color={getStatusIconColor(task?.end_date)} />
              <div className="my-auto">
                {moment(task?.end_date).format("MMMM DD")}
              </div>
            </div>
          )}
          <div className="flex gap-0.5 items-center my-auto whitespace-nowrap">
            <BiComment />
            <div>{task?.comments || 0}</div>
          </div>
          <div className="flex items-center gap-0.5 my-auto whitespace-nowrap">
            <ImAttachment />
            <div>{task?.attachments?.length || 0}</div>
          </div>
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
