import React, { useState, useEffect, useRef } from "react";
import { TextEditorInputField } from "components/FormControl";
import { addCommentAttachment,addTask } from "app/hooks/taskManagment";
import { toast } from "react-toastify";
import { postComment } from "app/hooks/taskManagment";

const CommentsInputField = ({
  addAttachment = () => {}, //Add the comments attchment to include in task attachments
  taskId,
  userId,
  employees,
  projectDetail,
  fetchData = () => {},
}) => {
  const [newComment, setNewComment] = useState("");
  const [commentAttachments, setCommentAttachment] = useState([]);
  const [taskAttachment, setTaskAttachment] = useState([]);

  const removeFile = (file) => {
    const filteredFiles = commentAttachments.filter(
      (f) => f.name !== file.name
    );
    setCommentAttachment(filteredFiles);
  };
  const filteredUsers = React.useMemo(() => {
    if (!employees || !projectDetail?.project_members) return [];

    return employees
      .filter((emp) => projectDetail.project_members.includes(emp.value))
      .map((emp) => ({
        id: emp.value, // Using value as id
        name: emp.name, // Using name field
        username: emp.username, // Using username field
      }));
  }, [employees, projectDetail?.project_members]);

  const handleAddCommentAttachment = async (attachment, id) => {
    if (attachment instanceof File) {
      const payload = { attachment: attachment };
      const response = await addCommentAttachment(payload, id);
      if (response) {
        const attachmentId = await addAttachment({ attachment: attachment });
        if(attachmentId)
        setTaskAttachment((preAttachment) => {
          return [...preAttachment, attachmentId];
        });
        return response;
      } else {
        return { id: null, attachment: null };
      }
    }
  };
  const handleSubmitComment = async (comment, attachments, mentionedUsers) => {
    const getAttachmentFileIds = async (attachmentfiles) => {
      if (attachmentfiles && attachmentfiles.length > 0) {
        try {
          const attachmentPromises = attachmentfiles.map(async (file) => {
            if (file.attachment instanceof File) {
              const { id } = await handleAddCommentAttachment(
                file.attachment,
                file.id
              );
              return id;
            } else {
              return file.id;
            }
          });
          return (await Promise.all(attachmentPromises)).filter(Boolean);
        } catch (error) {
          console.error("Error uploading attachments:", error);
          toast.error(
            "Failed to upload one or more attachments. Please try again.",
            {
              position: toast.POSITION.TOP_RIGHT,
            }
          );
          throw error;
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
          mentions: mentionedUsers,
        };
        const response = await postComment(payload);
        if (response.status === 201 || response.status === 200) {
          fetchData(true);
          setNewComment("");
          await addTask({ attachment: taskAttachment }, taskId);
          setCommentAttachment([]);
        }
      } catch (error) {
        console.error("Error Adding Comment:", error);
      }
    }
  };

  return (
    <>
      <TextEditorInputField
        content={newComment}
        setContent={setNewComment}
        handleSubmitContent={handleSubmitComment}
        setAttachments={setCommentAttachment}
        attachments={commentAttachments}
        removeAttachment={removeFile}
        users={filteredUsers}
        allowMentions={true}
        upload={async (file) => {
          return await handleAddCommentAttachment(file);
        }}
      />
    </>
  );
};
export default CommentsInputField;
