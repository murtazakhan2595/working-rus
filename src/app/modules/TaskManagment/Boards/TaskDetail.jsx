import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { CiEdit } from "react-icons/ci";
import { FiSend } from "react-icons/fi";
import { BsCheckCircle } from "react-icons/bs";
import { HiOutlinePaperClip } from "react-icons/hi";
import { PiHeadlightsBold, PiUsersLight } from "react-icons/pi";
import { IoCalendarOutline } from "react-icons/io5";
import { RxCross2, RxPerson } from "react-icons/rx";
import { AiOutlineDownload, AiOutlineFile, AiOutlinePaperClip, AiOutlineSend } from "react-icons/ai";
import { FaRegImage } from "react-icons/fa";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { RiSendPlaneFill } from "react-icons/ri";
import { LiaCommentAlt } from "react-icons/lia";
import { PriorityList } from "data/Data";
import { MembersList } from "../Sections";
import moment from "moment";
import { fetchComments, postComment, getBoardById, addAttachments, getAttachmentById } from "app/hooks/taskManagment";
import { EmployeeName } from "utils/getValuesFromTables";
import { connect, useSelector } from "react-redux";
import EditCard from "./EditCard";
import { getRandomColor } from "utils/renderValues";

const TaskDetail = ({ task, onClose, employees }) => {
  console.log("employees,", employees);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [boardName, setBoardName] = useState("Loading...");
  const [attachments, setAttachments] = useState([]);
  const [newAttachment, setNewAttachment] = useState(null);
  const [isEditCardOpen, setIsEditCardOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const fileInputRef = useRef(null);
  const [isTaskDetailVisible, setIsTaskDetailVisible] = useState(true);
  const commentRef = useRef(null);


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
        const data = await fetchComments({ task_id: [task.id] });
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setComments([]);
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
        if (newComment.trim()) {
          await postComment(task.id, userId, newComment);
          setNewComment("");
        }

        if (newAttachment) {
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64String = reader.result.split(",")[1];
            const payload = {
              taskId: task.id,
              userId: userId,
              fileName: newAttachment.name,
              fileType: newAttachment.type,
              base64: base64String,
            };
            try {
              const response = await addAttachments(payload);
              if (response) {
                console.log("File uploaded successfully:", response);
                // Refetch attachments after uploading a new one
                const updatedAttachments = await Promise.all(
                  task.attachment.map((id) => getAttachmentById(id))
                );
                setAttachments(updatedAttachments);
              }
            } catch (error) {
              console.error("Error uploading file:", error);
            }
          };
          reader.readAsDataURL(newAttachment);
          setNewAttachment(null);
        }

        const data = await fetchComments({ task_id: [task.id] });
        setComments(data);
      } catch (error) {
        console.error("Error posting comment or uploading attachment:", error);
      }
    }
  };

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewAttachment(file);
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

  const UserInitials = ({user}) => {
    const employeeName = EmployeeName({ value: user.value, length: 2 });
    console.log("emp name - ", employeeName);
    const name = employeeName.props.children;
    return <span
      className={`${getRandomColor(
        name?.charAt(0)
      )} font-lato flex justify-center items-center text-[10.5px] font-bold text-[#FAFBFC] w-8 h-8 rounded-full`}
    >
      {name}
    </span>;
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
        <div className="p-4 max-w-xl w-[40%] mx-auto bg-white rounded-lg shadow-lg fixed z-10 top-0 right-0 overflow-y-auto h-[100vh] hideScroll">
          <div onClick={onClose} className="flex justify-end mb-3">
            <RxCross2 className="text-baseGray" />
          </div>
          <header className="flex justify-between items-center">
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

          <div className="mb-4">
            <span className="text-[14px] font-lato text-baseGray">
              Is in list{" "}
            </span>
            <span className="text-[14px] font-lato text-baseGray">
              {boardName}
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

          <div className="pb-1">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-lato font-bold text-[#323333] flex gap-x-2 items-center">
                <LiaCommentAlt className="text-xl" />
                Comments ({comments.length})
              </h2>
            </div>
            <div className="flex items-center border border-gray-300 rounded-lg p-1 bg-[#E8EAED]">
              <div className="relative w-full">
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
          </div>
          <div className="mt-3 space-y-4">
            {comments?.map((comment, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-9 w-9 rounded-full bg-pink-500 flex items-center justify-center text-white font-semibold">
                    <EmployeeName value={comment.user_id} length={2} />
                  </div>
                </div>
                <div className="flex justify-between items-center w-full">
                  <p className="mt-1 text-[#323333] font-lato text-base">
                    {comment.comment}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-lato text-baseGray">
                      {moment(comment.created_at?.slice(0, 10)).format(
                        "DD-MMM-YY"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
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

