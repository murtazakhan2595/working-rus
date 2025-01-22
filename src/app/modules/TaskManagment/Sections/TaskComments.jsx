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
import {imageFileType} from 'app/utils/Types/General';

export default function TaskComments({ taskId, refreshComments,setRefreshComments }) {
  const employees = useSelector((state) => state.emp.employees);
  const userId = useSelector((state) => state.user.userProfile.id);
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    try {
      const data = await getCommentsWithAttachments({ task_id: [taskId] });
      setComments(data);
      setRefreshComments(false)
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
                <p className="mt-1 text-neutral-1000 textEditorText" dangerouslySetInnerHTML={{ __html: comment.comment }}></p>
                {comment?.commentattach?.length > 0 &&
                  comment?.commentattach.map((file, index) => (
                    <div key={index}>
                      <AttachmentUI
                        attachment={file.attachment}
                        name={file.name}
                        displayImageAttachment={false}
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
