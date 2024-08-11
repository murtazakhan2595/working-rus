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
import Comments from "./Comments";

const TaskDetail = ({ task, onClose, employees }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [boardName, setBoardName] = useState("Loading...");
  const [attachments, setAttachments] = useState([]);
  const [newAttachment, setNewAttachment] = useState({});
  const [isEditCardOpen, setIsEditCardOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const fileInputRef = useRef(null);
  const [isTaskDetailVisible, setIsTaskDetailVisible] = useState(true);
  const commentRef = useRef(null);
  const userId = useSelector((state) => state.user.userProfile.id);

  const fetchData = async () => {
    try {
      const data = await getCommentsWithAttachments({ task_id: [task.id] });
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    }
  };
  useEffect(() => {
    const fetchBoardName = async () => {
      try {
        const name = await getBoardById(task?.board_id);
        setBoardName(name?.name);
      } catch (error) {
        console.error("Error fetching board name:", error);
      }
    };

    const fetchAttachments = async () => {
      try {
        if (task?.attachment?.length) {
          const attachmentPromises = task.attachment.map((id) =>
            getAttachmentById(id)
          );
          const attachmentData = await Promise.all(attachmentPromises);
          setAttachments(attachmentData);
        }
      } catch (error) {
        console.error("Error fetching attachments:", error);
      }
    };

    fetchBoardName();
    fetchData();
    fetchAttachments();
  }, [task?.board_id, task?.id, task?.attachment]);

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
        console.log("newAttachment", newAttachment);
        fetchData();
      } catch (error) {
        console.error("Error posting comment or uploading attachment:", error);
      }
    }
  };

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  console.log();

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

  const editDetails = () => {
    setIsEditCardOpen(true);
    setIsTaskDetailVisible(false);
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

  function base64ToBlob(base64, mimeType) {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mimeType });
  }

  return (
    <>
      {isEditCardOpen && (
        <EditCard
          cardId={task?.id}
          projectId={task?.project_id}
          onClose={() => {
            setIsEditCardOpen(false);
            onClose();
          }}
        />
      )}
      {isTaskDetailVisible && (
        <div className="p-4 max-w-[700px] w-[95%] mx-auto bg-white rounded-lg shadow-lg fixed z-10 top-0 right-0 overflow-y-auto h-[100vh] hideScroll">
          <div onClick={onClose} className="flex justify-end mb-3">
            <RxCross2 className="text-baseGray" />
          </div>
          <header className="flex justify-between items-center text-capitilize">
            <h1 className="text-2xl font-bold text-[#323333] font-lato">
              {task?.name}
            </h1>
            <button
              className="flex items-center space-x-2 border border-gray-500 rounded text-gray-500 hover:text-gray-700 px-2 py-1"
              onClick={editDetails}
            >
              <CiEdit />
              <span className="text-base font-lato font-medium">Edit</span>
            </button>
          </header>

          <div className="mb-4 flex gap-2">
            <span className="text-[14px] font-lato text-baseGray">
              is in list{" "}
            </span>
            <span className="text-[14px] font-lato text-baseGray flex">
              <LabelHolo
                text={boardName}
                color={getRandomColor(boardName?.charAt(0))}
              />
            </span>
          </div>

          <div className="mb-4 border border-gray-400 rounded-lg px-3 py-3">
            <div className="flex items-center space-x-10 mb-3">
              <div className="flex items-center gap-x-2">
                <IoCalendarOutline className="text-baseGray" />
                <span className="ml-auto text-base font-lato font-bold text-baseGray">
                  Start Date
                </span>
              </div>
              <span className="ml-8">
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
              <span className="ml-8">
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
              <span className="ml-8">
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
              <span className="ml-8 text-red-500">
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
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between w-auto my-1 bg-gray-100 p-2 rounded-lg shadow-md"
                onClick={(e) => {
                  if (!e.target.closest(".download-icon")) {
                    const dataURL = attachment?.attachments.file;
                    const [metadata, base64Data] = dataURL.split(",");
                    const mimeType = metadata.match(/:(.*?);/)[1];
                    const blob = base64ToBlob(base64Data, mimeType);
                    const blobUrl = URL.createObjectURL(blob);

                    window.open(blobUrl, "_blank");
                  }
                }}
              >
                <div className="flex items-center">
                  <FaRegImage className="h-4 w-4 text-gray-500" />
                  <span className="ml-4 font-lato text-baseGray text-sm">
                    {attachment?.attachments.name}
                  </span>
                </div>
                <div className="flex items-center gap-x-2">
                  <a
                    href={attachment?.attachments.file}
                    download
                    className="text-gray-500 hover:text-gray-700 download-icon"
                  >
                    <AiOutlineDownload className="h-5 w-5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

         
            <Comments task_id={task.id} />
          
        </div>
      )}
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    employees: state.emp.employees,
  };
};

export default connect(mapStateToProps)(TaskDetail);
