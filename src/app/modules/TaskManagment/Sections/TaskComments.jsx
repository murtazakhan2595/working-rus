import React, { useEffect, useRef, useState } from "react";
import { CommentsInputField } from "components/FormControl";
import { EmployeeName } from "utils/getValuesFromTables";
import moment from "moment";
import AttachmentUI from "components/ui/AttachmentUI";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  addCommentAttachment,
  postComment,
  getCommentsWithAttachments,
} from "app/hooks/taskManagment";
import { MembersList } from "app/modules/TaskManagment/Sections";

export default function TaskComments({ taskId, refreshComments }) {
  const employees = useSelector((state) => state.emp.employees);
  const userId = useSelector((state) => state.user.userProfile.id);
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    try {
      const data = await getCommentsWithAttachments({ task_id: [taskId] });
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (taskId) fetchComments(isMounted);
    return () => {
      isMounted = false;
    };
  }, [taskId, refreshComments]);

  const handleAddComment = async (comment, attachments) => {
    const getAttachmentFileIds = async (attachmentfiles) => {
      if (attachmentfiles && attachmentfiles.length > 0) {
        try {
          const attachmentPromises = attachmentfiles.map(async (file) => {
            if (file.attachment instanceof File) {
              const payload = { attachment: file.attachment };
              const response = await addCommentAttachment(payload, file.id);
              return response.id; // Return the attachment ID
            } else {
              return file.id;
            }
          });
          return await Promise.all(attachmentPromises);
        } catch (error) {
          console.error("Error uploading attachments:", error);
          toast.error(
            "Failed to upload one or more attachments. Please try again.",
            {
              position: toast.POSITION.TOP_RIGHT,
            }
          );
          throw error; // Propagate the error
        }
      } else return [];
    };
    if (comment.trim() || attachments) {
      try {
        const payload = {
          task_id: taskId,
          comment: comment,
          user_id: userId,
          commentattach: await getAttachmentFileIds(attachments),
        };
        const response = await postComment(payload);
        if (response.status === 201 || response.status === 200) {
          fetchComments();
        }
      } catch (error) {
        console.error("Error Adding Comment:", error);
      }
    }
  };

  return (
    <div className="mt-3">
      <div className="mt-3 space-y-4 flex flex-col gap-6">
        {comments?.map((comment, index) => (
          <div key={index} className="flex items-start space-x-3">
            <MembersList members={[comment.user_id]} display={true} />
            <div className="flex items-start flex-col w-full">
              <div className="flex items-start justify-between w-full">
                <div className="font-semibold">
                  <EmployeeName value={comment.user_id} />
                </div>
                <div className="text-[12px] text-baseGray">
                  {moment(comment.created_at).format("DD-MMM-YY")}
                </div>
              </div>
              <div className="w-full">
                <p className="mt-1 text-neutral-1000">{comment.comment}</p>
                {comment?.commentattach?.length > 0 &&
                  comment?.commentattach.map((file, index) => (
                    <div key={index}>
                      <AttachmentUI
                        attachment={file.attachment}
                        name={file.name}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
