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
import { CommentInput } from "./index";
import { filebase64Download } from "utils/fileUtils";
import { Attachments } from "../Sections";

const Comments = React.memo(({ task, task_id, employees }) => {
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
        <CommentInput
          employees={employees}
          task_id={task_id}
          fetchData={fetchData}
        />
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
                    onDelete={handleDeleteComment}
                  />
                </div>
              </div>
              {editingCommentId === comment.id ? (
                <CommentInput
                  employees={employees}
                  task_id={task_id}
                  fetchData={fetchData}
                  initialComment={comment}
                  initialAttachments={comment.attachments}
                  isEditing={true}
                />
              ) : (
                <div>
                  <Attachments attachments={comment.attachments} />
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
});

const CustomDropdown = ({
  comment,
  isEditing,
  onEditStart,
  onEditCancel,
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
      <DropdownToggle style={{ background: "transparent", border: "none" }}>
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
