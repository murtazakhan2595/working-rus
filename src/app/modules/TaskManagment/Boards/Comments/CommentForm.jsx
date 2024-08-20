import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import moment from "moment";
import { connect, useSelector } from "react-redux";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { AiOutlineFile, AiOutlinePaperClip } from "react-icons/ai";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { RiSendPlaneFill } from "react-icons/ri";
import { LiaCommentAlt } from "react-icons/lia";
import {
  fetchComments,
  postComment,
  deleteComment,
  addCommentAttachment,
  getCommentsWithAttachments,
} from "app/hooks/taskManagment";
import { EmployeeName } from "utils/getValuesFromTables";
import { Attachments } from "../Sections";
import { filebase64Download } from "utils/fileUtils";
import { getRandomColor, getInitials } from "utils/renderValues";

const UserInitials = ({ user }) => {
  const employeeName = user.name;
  const name = getInitials(employeeName);
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

const CommentInput = React.memo(
  ({
    employees,
    task_id,
    fetchData,
    initialComment = null,
    initialAttachments = [],
    isEditing = false,
  }) => {
    const commentId = initialComment?.id || null;
    const [newComment, setNewComment] = useState(initialComment?.comment || "");
    const [newAttachments, setNewAttachments] = useState(initialAttachments);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const fileInputRef = useRef(null);
    const commentRef = useRef(null);
    const userId = useSelector((state) => state.user.userProfile.id);

    const handleAddComment = async () => {
      if (newComment.trim() || newAttachments.length > 0) {
        try {
          const attachmentIds = [];
          if (newAttachments.length > 0) {
            for (let attachment of newAttachments) {
              const response = await addCommentAttachment(attachment);
              if (response) {
                attachmentIds.push(response.id);
              }
            }
          }
          const payload = {
            task_id: task_id,
            user_id: userId,
            comment: newComment,
            commentattach: attachmentIds,
          };
          if (commentId && isEditing) {
            payload.id = commentId;
          }
          await postComment(payload);
          setNewAttachments([]);
          setNewComment("");
          fetchData();
        } catch (error) {
          console.error(
            "Error posting comment or uploading attachment:",
            error
          );
        }
      }
    };

    const handleFileClick = () => {
      fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
      const files = Array.from(event.target.files);
      if (files.length > 0) {
        const newFiles = files.map((file) => {
          const reader = new FileReader();

          return new Promise((resolve, reject) => {
            reader.onload = (event) => {
              resolve({
                name: file.name,
                file: event.target.result,
              });
            };

            reader.onerror = (error) => {
              reject(error);
            };

            reader.readAsDataURL(file);
          });
        });

        Promise.all(newFiles)
          .then((fileDataArray) => {
            const newAttachmentFile = fileDataArray.map((fileData) => ({
              attachment: fileData,
            }));
            const attachments = [...newAttachments, ...newAttachmentFile];
            console.log(attachments);
            setNewAttachments(attachments);
          })
          .catch((error) => {
            console.error("Error reading files:", error);
          });
      }
    };

    const handleCommentChange = (e) => {
      const value = e.target.value;
      setNewComment(value);
      const mentionStart = value.lastIndexOf("@");
      if (mentionStart !== -1 && employees && employees?.length > 0) {
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

    const handleMentionClick = (mention) => {
      const mentionStart = newComment.lastIndexOf("@");
      const newText = `${newComment.substring(0, mentionStart)}@${mention} `;
      setNewComment(newText);
      setShowDropdown(false);
      commentRef.current.focus();
    };

    console.log(newAttachments);
    return (
      <>
        <div className="flex items-center border border-gray-300 rounded-lg p-1 bg-[#E8EAED]">
          <div className="relative w-full">
            <Attachments attachments={newAttachments} />
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
                    onClick={() => handleMentionClick(user.label)}
                  >
                    <UserInitials user={user} />
                    <div className="flex-col gap-1">
                      <p>{user.name}</p>
                      <p className="text-sm">{user.label}</p>
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
      </>
    );
  }
);

export default CommentInput;
