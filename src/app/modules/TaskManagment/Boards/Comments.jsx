import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { CiEdit } from "react-icons/ci";
import { FiSend } from "react-icons/fi";
import { LabelHolo } from "components";
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
import {
  Card,
  CardHeader,
  CardBody,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Row,
  Col,
} from "reactstrap";
import { FaRegImage } from "react-icons/fa";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { RiSendPlaneFill } from "react-icons/ri";
import { LiaCommentAlt } from "react-icons/lia";
import { PriorityList } from "data/Data";
import { MembersList } from "../Sections";
import moment from "moment";
import {
  fetchComments,
  postComment,
  getBoardById,
  addAttachments,
  getAttachmentById,
} from "app/hooks/taskManagment";
import { EmployeeName } from "utils/getValuesFromTables";
import { connect, useSelector } from "react-redux";
import EditCard from "./EditCard";
import { getRandomColor } from "utils/renderValues";
import { addCommentAttachment } from "app/hooks/taskManagment";
import { getCommentsWithAttachments } from "app/hooks/taskManagment";
import { filebase64Download } from "utils/fileUtils";

const Comments = ({ task, task_id, employees }) => {
  const [comments, setComments] = useState([]);
  const fetchData = async () => {
    try {
      const data = await getCommentsWithAttachments({ task_id: [task_id] });
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    }
  };
  useEffect(() => {
    fetchData();
  }, [task_id]);
  return (
    <>
      <div className="pb-1">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-lato font-bold text-[#323333] flex gap-x-2 items-center">
            <LiaCommentAlt className="text-xl" />
            Comments ({comments.length})
          </h2>
        </div>
        <CommentInput employees={employees} task={task} fetchData={fetchData} />
      </div>
      <div className="mt-3 space-y-4">
        {comments?.map((comment, index) => (
          <div key={index} className="flex items-start space-x-3">
            {/* <div className="w-[40px]">  */}
            <div className="h-9 w-9 text-[13px] rounded-full bg-pink-500 flex items-center justify-center text-white font-semibold">
              <EmployeeName value={comment.user_id} length={2} />
            </div>
            {/* </div> */}
            <div
              className="flex flex-col"
              style={{ width: "calc(100% - 40px)" }}
            >
              <div className="flex justify-between">
                <div class="text-baseGray">
                  <EmployeeName value={comment.user_id} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-[12px] font-lato text-baseGray">
                    {moment(comment.created_at?.slice(0, 10)).format(
                      "DD-MMM-YY"
                    )}
                  </div>
                  <CustomDropdown comment={comment} />
                </div>
              </div>

              <div>
                {comment?.commentattach?.length > 0 &&
                  comment?.attachments?.length > 0 &&
                  comment?.attachments[0]?.attachment && (
                    <button
                      className="flex items-center gap-2 hover:bg-[#E8EAED] p-1"
                      onClick={() => {
                        console.log(comment?.attachments[0]?.attachment?.file);
                        filebase64Download(comment?.attachments[0]?.attachment);
                      }}
                    >
                      <AiOutlineFile className="h-5 w-5 text-black" />
                      <span className="text-sm text-black">
                        {comment?.attachments[0]?.attachment?.name}
                      </span>
                    </button>
                  )}
                <p className="mt-1 text-[#323333] font-lato text-base">
                  {comment.comment}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

const CommentInput = ({ employees, task, fetchData }) => {
  const [newComment, setNewComment] = useState("");
  const [newAttachment, setNewAttachment] = useState({});
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const fileInputRef = useRef(null);
  const commentRef = useRef(null);
  const userId = useSelector((state) => state.user.userProfile.id);
  const handleAddComment = async () => {
    if (newComment.trim() || newAttachment) {
      try {
        if (newAttachment) {
          console.log("newAttachment", newAttachment);
          try {
            const response = await addCommentAttachment(newAttachment);
            console.log("attachmed response", response);
            if (response) {
              const payload = {
                task_id: task.id,
                user_id: userId,
                comment: newComment,
                commentattach: [response.id],
              };
              const result = await postComment(payload);
              if (result) {
                setNewAttachment([]);
                setNewComment("");
              }
            }
          } catch (error) {
            console.error("Error uploading file:", error);
          }
        } else if (newComment.trim()) {
          const payload = {
            task_id: task.id,
            user_id: userId,
            comment: newComment,
          };
          await postComment(payload);
          setNewComment("");
        }
        fetchData();
      } catch (error) {
        console.error("Error posting comment or uploading attachment:", error);
      }
    }
  };
  const handleFileClick = () => {
    fileInputRef.current.click();
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the single file

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const fileData = {
          name: file.name, // File name
          file: event.target.result, // Base64 data URL
        };
        setNewAttachment(fileData); // Update state with file data
      };

      reader.onerror = (error) => {
        console.error("Error reading file:", error); // Handle errors
      };

      reader.readAsDataURL(file); // Read file as data URL
    }
  };
  const handleCommentChange = (e) => {
    const value = e.target.value;
    setNewComment(value);
    const mentionStart = value.lastIndexOf("@");
    if (mentionStart !== -1) {
      const mentionQuery = value.substring(mentionStart + 1);
      const matches = employees.filter((user) =>
        user.label.toLowerCase().includes(mentionQuery.toLowerCase())
      );
      setFilteredUsers(matches);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };
  const handleUserSelect = (user) => {
    const mentionStart = newComment.lastIndexOf("@");
    const comment = newComment.substring(0, mentionStart) + `@${user.label} `;
    setNewComment(comment);
    setShowDropdown(false);

    // Move cursor to the end of the inserted mention
    setTimeout(() => {
      commentRef.current.selectionStart = comment.length;
      commentRef.current.selectionEnd = comment.length;
      commentRef.current.focus();
    }, 0);
  };
  const UserInitials = ({ user }) => {
    const employeeName = EmployeeName({ value: user.value, length: 2 });
    console.log("emp name - ", employeeName);
    const name = employeeName.props.children;
    return (
      <span
        className={`${getRandomColor(
          name?.charAt(0)
        )} font-lato flex justify-center items-center text-[10.5px] font-bold text-[#FAFBFC] w-8 h-8 rounded-full`}
      >
        {name}
      </span>
    );
  };
  return (
    <div className="flex items-center border border-gray-300 rounded-lg p-1 bg-[#E8EAED]">
      <div className="relative w-full">
        {newAttachment?.name && (
          <div className="flex items-center gap-2 pb-2">
            <AiOutlineFile className="h-5 w-5 text-black" />
            <span className="text-sm text-black">{newAttachment.name}</span>
          </div>
        )}
        <input
          type="text"
          placeholder="Type your comment here"
          className="flex-grow px-2 py-1 text-sm bg-transparent text-gray-700 focus:outline-none placeholder:text-[14px] placeholder:font-lato placeholder:text-baseGray w-full"
          value={newComment}
          onChange={handleCommentChange}
          ref={commentRef}
        />
        {showDropdown && (
          <div className="absolute z-10  top-0 left-0 mt-8 mx-auto shadow-lg rounded-lg bg-white max-h-32 overflow-y-auto ">
            {filteredUsers.map((user) => (
              <div
                key={user.value}
                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 mb-1"
                onClick={() => handleUserSelect(user)}
              >
                <UserInitials user={user} />
                <div className="flex-col gap-1">
                  <p>{user.name}</p>
                  <p className="text-sm">@{user.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
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
  );
};

const CustomDropdown = ({ comment }) => {
  const [openDropdownRow, setOpenDropdownRow] = useState(null);
  const toggleDropdown = (index) => {
    setOpenDropdownRow(index === openDropdownRow ? null : index);
  };
  const handleOptionSelect = () => {};

  return (
    <div>
      <ButtonDropdown
        isOpen={openDropdownRow === comment.id}
        toggle={() => toggleDropdown(comment.id)}
        className="float-end"
      >
        <DropdownToggle
          className={`text-baseGray cursor-pointer bg-white border-0`}
        >
          <BiDotsVerticalRounded className="text-baseGray" />
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem onClick={() => handleOptionSelect()}>Edit</DropdownItem>
          <DropdownItem onClick={() => handleOptionSelect()}>Delete</DropdownItem>
        </DropdownMenu>
      </ButtonDropdown>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    employees: state.emp.employees,
  };
};

export default connect(mapStateToProps)(Comments);
