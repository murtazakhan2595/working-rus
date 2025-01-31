import React, { useState, useEffect, useRef } from "react";
// import Select from "react-select";
import DatePicker from "react-datepicker";
import { getFileNameFromURL } from "utils/downUtils";
import moment from "moment";
import { Card } from "components/ui/card";
import ReactQuill from "react-quill";
import { Input } from "components/ui/input";
import { Button } from "components/ui/button";
import { TextEditorInputField } from "components/FormControl";
import { Calendar as LucideCalendar } from "lucide-react";
import { AiOutlinePaperClip } from "react-icons/ai";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "src/@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "src/@/components/ui/radio-group";
import AttachmentUI from "components/ui/AttachmentUI";

import {
  ChevronsUpDown,
  Check,
  FileUp,
  CircleX,
  SearchIcon,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "src/@/components/ui/command";
import { cn } from "src/@/lib/utils";
import { format, parse, isValid } from "date-fns";
import { Calendar } from "src/@/components/ui/calendar";
import { PatternFormat } from "react-number-format";
import { addCommentAttachment } from "app/hooks/taskManagment";
import { toast } from "react-toastify";
import { postComment } from "app/hooks/taskManagment";

const CommentsInputField = ({
  taskId,
  userId,
  employees,
  projectDetail,
  fetchData = () => {},
}) => {
  const [newComment, setNewComment] = useState("");
  const [commentAttachments, setCommentAttachment] = useState([]);
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
    console.log(attachment, "123456");
    if (attachment instanceof File) {
      const payload = { attachment: attachment };
      const response = await addCommentAttachment(payload, id);
      console.log(response, "123456");
      if (response) return response;
      else {
        return { id: null, attachment: null };
      }
    }
  };

  const handleSubmitComment = async (comment, attachments, mentionedUsers) => {
    console.log("mentionedUsers", mentionedUsers, comment);
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
          return await Promise.all(attachmentPromises);
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
        upload={async (file) => {
          return await handleAddCommentAttachment(file);
        }}
      />
    </>
  );
};
export default CommentsInputField;
