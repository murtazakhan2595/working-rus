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
import { getRandomColor } from "utils/renderValues";
import { filebase64Download } from "utils/fileUtils";

const Comments = ({ task, task_id, employees }) => {
  const [comments, setComments] = useState([]);
  const [editingCommentId, setEditingCommentId] = useState(null);

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

  const handleEditComment = async (
    commentId,
    updatedComment,
    updatedAttachments
  ) => {
    try {
      let payload = {
        comment: updatedComment,
        commentattach: updatedAttachments
          ? updatedAttachments.map((att) => att.id)
          : [],
      };
      await postComment(commentId, payload);
      setEditingCommentId(null);
      fetchData(); // Refresh comments
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      fetchData(); // Refresh comments
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

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
            <div className="h-9 w-9 text-[13px] rounded-full bg-pink-500 flex items-center justify-center text-white font-semibold">
              <EmployeeName value={comment.user_id} length={2} />
            </div>
            <div
              className="flex flex-col"
              style={{ width: "calc(100% - 40px)" }}
            >
              <div className="flex justify-between">
                <div className="text-baseGray">
                  <EmployeeName value={comment.user_id} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-[12px] font-lato text-baseGray">
                    {moment(comment.created_at?.slice(0, 10)).format(
                      "DD-MMM-YY"
                    )}
                  </div>
                  <CustomDropdown
                    comment={comment}
                    isEditing={editingCommentId === comment.id}
                    onEditStart={() => setEditingCommentId(comment.id)}
                    onEditCancel={() => setEditingCommentId(null)}
                    onEdit={(updatedComment, updatedAttachments) =>
                      handleEditComment(
                        comment.id,
                        updatedComment,
                        updatedAttachments
                      )
                    }
                    onDelete={handleDeleteComment}
                  />
                </div>
              </div>
              {editingCommentId === comment.id ? (
                <CommentInput
                  employees={employees}
                  task={task}
                  fetchData={fetchData}
                  initialComment={comment.comment}
                  initialAttachments={comment.attachments}
                  isEditing={true}
                  onSave={(updatedComment, updatedAttachments) =>
                    handleEditComment(
                      comment.id,
                      updatedComment,
                      updatedAttachments
                    )
                  }
                />
              ) : (
                <div>
                  {comment?.commentattach?.length > 0 &&
                    comment?.attachments?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {comment.attachments.map((attachment, idx) => (
                          <button
                            key={idx}
                            className="flex items-center gap-2 hover:bg-[#E8EAED] p-1"
                            onClick={() => {
                              filebase64Download(attachment);
                            }}
                          >
                            <AiOutlineFile className="h-5 w-5 text-black" />
                            <span className="text-sm text-black">
                              {attachment.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  <p className="mt-1 text-[#323333] font-lato text-base">
                    {comment.comment}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

const CommentInput = React.memo(
  ({
    employees,
    task,
    fetchData,
    initialComment = "",
    initialAttachments = [],
    isEditing = false,
    onSave,
  }) => {
    const [newComment, setNewComment] = useState(initialComment);
    const [newAttachments, setNewAttachments] = useState(initialAttachments);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const fileInputRef = useRef(null);
    const commentRef = useRef(null);
    const userId = useSelector((state) => state.user.userProfile.id);

    useEffect(() => {
      setNewComment(initialComment);
      setNewAttachments(initialAttachments);
    }, [initialComment, initialAttachments]);

    const handleAddComment = async () => {
      if (newComment.trim() || newAttachments.length > 0) {
        try {
          if (isEditing) {
            onSave(newComment, newAttachments);
          } else {
            let attachmentIds = [];
            if (newAttachments.length > 0) {
              for (let attachment of newAttachments) {
                const response = await addCommentAttachment(attachment);
                if (response) {
                  attachmentIds.push(response.id);
                }
              }
            }
            const payload = {
              task_id: task.id,
              user_id: userId,
              comment: newComment,
              commentattach: attachmentIds,
            };
            await postComment(payload);
            setNewAttachments([]);
            setNewComment("");
          }
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
            setNewAttachments([...newAttachments, ...fileDataArray]);
          })
          .catch((error) => {
            console.error("Error reading files:", error);
          });
      }
    };

    const handleRemoveAttachment = (index) => {
      setNewAttachments(newAttachments.filter((_, i) => i !== index));
    };

    const handleCommentChange = (e) => {
      debugger;
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

    const handleMentionClick = (mention) => {
      const mentionStart = newComment.lastIndexOf("@");
      const newText = `${newComment.substring(0, mentionStart)}@${mention} `;
      setNewComment(newText);
      setShowDropdown(false);
      commentRef.current.focus();
    };
    console.log(newComment);
    return (
      <>
        <div className="flex items-center border border-gray-300 rounded-lg p-1 bg-[#E8EAED]">
          <div className="relative w-full">
            {newAttachments?.name && (
              <div className="flex items-center gap-2 pb-2">
                <AiOutlineFile className="h-5 w-5 text-black" />
                <span className="text-sm text-black">
                  {newAttachments.name}
                </span>
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
                    // onClick={() => handleUserSelect(user)}
                  >
                    <EmployeeName value={user} length={2} />
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

        <div className="mt-2">
          <div className="flex flex-col space-y-2">
            <input
              type="text"
              placeholder="Type your comment here"
              className="flex-grow px-2 py-1 text-sm bg-transparent text-gray-700 focus:outline-none placeholder:text-[14px] placeholder:font-lato placeholder:text-baseGray w-full"
              value={newComment}
              onChange={handleCommentChange}
              ref={commentRef}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleFileClick}
                  className="text-sm text-blue-500 hover:underline"
                >
                  <AiOutlinePaperClip className="h-5 w-5" />
                  Attach files
                </button>
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                {newAttachments.length > 0 && (
                  <div className="flex items-center space-x-2">
                    {newAttachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded"
                      >
                        <span className="text-sm">{file.name}</span>
                        <button
                          onClick={() => handleRemoveAttachment(index)}
                          className="text-red-500 hover:underline"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={handleAddComment}
                className="flex items-center bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                <RiSendPlaneFill className="mr-1" />
                {isEditing ? "Update" : "Send"}
              </button>
            </div>
            {showDropdown && (
              <div className="bg-white border rounded shadow-lg">
                {filteredUsers.map((user, index) => (
                  <div
                    key={index}
                    className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleMentionClick(user.label)}
                  >
                    {user.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
);

const CustomDropdown = ({
  comment,
  isEditing,
  onEditStart,
  onEditCancel,
  onEdit,
  onDelete,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  return (
    <ButtonDropdown
      isOpen={dropdownOpen}
      toggle={toggleDropdown}
      className="ml-2"
    >
      <DropdownToggle className="p-1">
        <BiDotsVerticalRounded className="text-xl text-black" />
      </DropdownToggle>
      <DropdownMenu right>
        {isEditing ? (
          <DropdownItem onClick={onEditCancel}>Cancel Edit</DropdownItem>
        ) : (
          <>
            <DropdownItem onClick={onEditStart}>Edit</DropdownItem>
            <DropdownItem onClick={() => onDelete(comment.id)}>
              Delete
            </DropdownItem>
          </>
        )}
      </DropdownMenu>
    </ButtonDropdown>
  );
};
const mapStateToProps = (state) => {
  return {
    employees: state.emp.employees,
  };
};
export default connect(mapStateToProps)(Comments);
