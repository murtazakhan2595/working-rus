// TaskDetail.js

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { CiEdit } from "react-icons/ci";
import { FiSend } from "react-icons/fi";
import { BsCheckCircle } from "react-icons/bs";
import { HiOutlinePaperClip } from "react-icons/hi";
import { PiHeadlightsBold, PiUsersLight } from "react-icons/pi";
import { IoCalendarOutline } from "react-icons/io5";
import { RxCross2, RxPerson } from "react-icons/rx";
import {
  AiOutlineDownload,
  AiOutlineFile,
  AiOutlinePaperClip,
  AiOutlineSend,
} from "react-icons/ai";
import { FaRegImage } from "react-icons/fa";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { RiSendPlaneFill } from "react-icons/ri";
import { LiaCommentAlt } from "react-icons/lia";
import { PriorityList } from "data/Data";
import { MembersList } from "../Sections";
import moment from "moment";
import { fetchComments } from "app/hooks/taskManagment";
import { postComment } from "app/hooks/taskManagment";
import { getBoardById } from "app/hooks/taskManagment";
import { EmployeeName } from "utils/getValuesFromTables";
import { useSelector } from "react-redux";

const TaskDetail = ({ task, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [boardName, setBoardName] = useState("Loading...");
  const fileInputRef = useRef(null);

  const userId = useSelector((state) => state.user.userProfile.id);

  useEffect(() => {
    const fetchBoardName = async () => {
      try {
        const name = await getBoardById(task?.board_id);
        setBoardName(name?.name);
      } catch (error) {
        console.error("Error fetching board name:", error);
      }
    };

    const fetchData = async () => {
      try {
        const data = await fetchComments(task.id);
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setComments([]);
      }
    };

    fetchBoardName();
    fetchData();
  }, [task?.board_id, task?.id]);

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        await postComment(task.id, userId, newComment);
        const data = await fetchComments(task.id);
        setComments(data);
        setNewComment("");
      } catch (error) {
        console.error("Error posting comment:", error);
      }
    }
  };

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log("Selected file:", file);
    // Handle the selected file
  };

  return (
    <div className="p-4 max-w-xl w-[40%] mx-auto bg-white rounded-lg shadow-lg fixed z-10 top-0 right-0 overflow-y-auto h-[100vh] hideScroll">
      <div onClick={onClose} className="flex justify-end mb-3">
        <RxCross2 className="text-baseGray" />
      </div>
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#323333] font-lato">
          {task?.name}
        </h1>
        <button className="flex items-center space-x-2 border border-gray-500 rounded text-gray-500 hover:text-gray-700 px-2 py-1">
          <CiEdit />
          <span className="text-base font-lato font-medium">Edit</span>
        </button>
      </header>

      <div className="mb-4">
        <span className="text-[14px] font-lato text-baseGray">Is in list </span>
        <span className="text-[14px] font-lato text-baseGray">{boardName}</span>
      </div>

      <div className="mb-4 border border-gray-400 rounded-lg px-3 py-3">
        <div className="flex items-center space-x-10 mb-3">
          <div className="flex items-center gap-x-2">
            <IoCalendarOutline className="text-baseGray" />
            <span className="ml-auto text-base font-lato font-bold text-baseGray">
              Start Date
            </span>
          </div>
          <span className="ml-8 text-sm font-semibold">
            {moment(task?.start_date).format("DD MMMM, YY")}
          </span>
        </div>
        <div className="flex items-center space-x-10 mb-3">
          <div className="flex items-center gap-x-2">
            <RxPerson className="text-baseGray" />
            <span className="ml-auto text-base font-lato font-bold text-baseGray">
              Created By
            </span>
          </div>
          <span className="ml-8 text-sm font-semibold">
            {/* {EmployeeName(task?.assigned_by)} */}
            <EmployeeName value={task?.assigned_by} />
          </span>
        </div>
        <div className="flex items-center space-x-10 mb-3">
          <div className="flex items-center gap-x-2">
            <IoCalendarOutline className="text-baseGray" />
            <span className="ml-auto text-base font-lato font-bold text-baseGray">
              Due Date
            </span>
          </div>
          <span className="ml-8 text-sm font-semibold">
            {moment(task?.end_date).format("DD MMMM, YY")}
          </span>
        </div>
        <div className="flex items-center space-x-10 mb-3">
          <div className="flex items-center gap-x-2">
            <PiUsersLight className="text-baseGray" />
            <span className="ml-auto text-base font-lato font-bold text-baseGray">
              Assigne
            </span>
          </div>
          <MembersList members={task?.assigned_to} />
        </div>
        <div className="flex items-center space-x-10">
          <div className="flex items-center gap-x-2">
            <PiHeadlightsBold className="text-baseGray" />
            <span className="ml-auto text-base font-lato font-bold text-baseGray">
              Priority
            </span>
          </div>
          <span className="ml-8 text-sm font-semibold text-red-500">
            {
              PriorityList.find((option) => option.value === task?.priority)
                ?.label
            }
          </span>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-base font-lato font-bold text-[#323333]">
          Description
        </h2>
        <p
          className="text-sm text-gray-700 mt-2"
          dangerouslySetInnerHTML={{ __html: task?.description }}
        />
      </div>

      <div className="mb-3">
        <h2 className="text-base font-lato font-bold text-[#323333] flex gap-x-2 items-center">
          <AiOutlinePaperClip className="text-xl" />
          Attachments
        </h2>
        <div className="flex items-center justify-between w-56 bg-gray-100 p-2 rounded-lg shadow-md">
          <div className="flex items-center">
            <FaRegImage className="h-4 w-4 text-gray-500" />
            <span className="ml-4 font-lato text-baseGray text-sm">
              image.jpg
            </span>
          </div>
          <div className="flex items-center gap-x-2">
            <a
              href="/path/to/your/image.jpg"
              download
              className="text-gray-500 hover:text-gray-700"
            >
              <AiOutlineDownload className="h-5 w-5" />
            </a>
            <BiDotsVerticalRounded className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="pb-1">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-lato font-bold text-[#323333] flex gap-x-2 items-center">
            <LiaCommentAlt className="text-xl" />
            Comments ({comments.length})
          </h2>
        </div>
        <div className="flex items-center border border-gray-300 rounded-lg p-1 bg-[#E8EAED]">
          <input
            type="text"
            placeholder="Type your comment here"
            className="flex-grow px-2 py-1 text-sm bg-transparent text-gray-700 focus:outline-none placeholder:text-[14px] placeholder:font-lato placeholder:text-baseGray"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <AiOutlinePaperClip
            onClick={handleFileClick}
            className="h-5 w-5 text-black mx-2 cursor-pointer"
          />
          <div
            className="bg-black rounded-full w-6 h-6 flex justify-center items-center mr-1"
            onClick={handleAddComment}
          >
            <RiSendPlaneFill className="h-3 w-3 text-white cursor-pointer" />
          </div>
        </div>
      </div>
      <div className="mt-3 space-y-4">
        {comments.map((comment, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="h-9 w-9 rounded-full bg-pink-500 flex items-center justify-center text-white font-semibold">
                <EmployeeName value={comment.name} length={2} />
              </div>
            </div>
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] mb-0 font-lato text-baseGray">
                  {comment.name}
                </h3>
                <span className="text-xs text-gray-500">{comment.date}</span>
              </div>
              <p className="mt-1 text-[#323333] font-lato text-base">
                {comment.comment}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskDetail;
