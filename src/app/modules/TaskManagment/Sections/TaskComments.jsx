import React, { useEffect, useState } from "react";
import { CommentsInputField } from "components/FormControl";
import { EmployeeName } from "utils/getValuesFromTables";
import moment from "moment";
import AttachmentUI from "components/ui/AttachmentUI";
import { useSelector } from "react-redux";
import {
  addCommentAttachment,
  postComment,
  getCommentsWithAttachments,
  getActivities, // Add this new import
} from "app/hooks/taskManagment";
import { MembersList } from "app/modules/TaskManagment/Sections";
import { imageFileType } from "app/utils/Types/General";
import { ActivityTypes } from "../Boards/TaskEditAddViewDetails/Sections/activityHelper";

export default function TaskComments({
  taskId,
  refreshComments,
  setRefreshComments,
}) {
  const employees = useSelector((state) => state.emp.employees);
  const userId = useSelector((state) => state.user.userProfile.id);
  const [combinedActivities, setCombinedActivities] = useState([]);

  const fetchActivitiesAndComments = async (isMounted) => {
    try {
      // Fetch both comments and activities
      const [commentsData, activitiesData] = await Promise.all([
        getCommentsWithAttachments({ task_id: [taskId] }),
        getActivities({filterData:{ task_id: taskId }}),
      ]);
      console.log("commentsData", commentsData);
      console.log("activitiesData", activitiesData);

      if (isMounted) {
        // Combine and sort activities and comments by date
        const combined = [
          ...commentsData.map((comment) => ({
            ...comment,
            type: "comment",
            timestamp: new Date(comment.created_at),
          })),
          ...activitiesData.results.map((activity) => ({
            ...activity,
            type: "activity",
            timestamp: new Date(activity.created_at),
          })),
        ].sort((a, b) => b.timestamp - a.timestamp);

        setCombinedActivities(combined);
        setRefreshComments(false);
      }
    } catch (error) {
      console.error("Error fetching activities and comments:", error);
      if (isMounted) {
        setCombinedActivities([]);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (taskId) fetchActivitiesAndComments(isMounted);
    return () => {
      isMounted = false;
    };
  }, [taskId, refreshComments]);

  const renderActivityContent = (activity) => {
    const getActivityIcon = (actionType) => {
      switch (actionType) {
        case ActivityTypes.TASK_CREATED:
          return "📝";
        case ActivityTypes.TASK_TITLE_UPDATED:
          return "✏️";
        case ActivityTypes.STATUS_CHANGED:
          return "🔄";
        case ActivityTypes.PRIORITY_CHANGED:
          return "🎯";
        case ActivityTypes.MEMBERS_ADDED:
        case ActivityTypes.MEMBERS_REMOVED:
          return "👥";
        case ActivityTypes.LABELS_ADDED:
        case ActivityTypes.LABELS_REMOVED:
          return "🏷️";
        case ActivityTypes.ATTACHMENT_ADDED:
        case ActivityTypes.ATTACHMENT_REMOVED:
          return "📎";
        case ActivityTypes.TASK_ARCHIVED:
          return "📦";
        case ActivityTypes.TASK_DELETED:
          return "🗑️";
        default:
          return "ℹ️";
      }
    };

    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>{getActivityIcon(activity.action_type)}</span>
        <span>{activity.content}</span>
      </div>
    );
  };

  return (
    <div className="mt-3">
      <div className="mt-3 space-y-4 flex flex-col gap-6">
        {combinedActivities.map((item, index) => (
          <div key={index} className="flex items-start space-x-3">
            <MembersList members={[item.user_id]} display={true} />
            <div className="flex items-start flex-col w-full">
              <div className="flex items-start justify-between w-full">
                <div className="font-semibold">
                  <EmployeeName value={item.user_id} />
                </div>
                <div className="text-[12px] text-baseGray">
                  {moment(item.timestamp).format("DD-MMM-YY HH:mm")}
                </div>
              </div>
              <div className="w-full">
                {item.type === "comment" ? (
                  <>
                    <p
                      className="mt-1 text-neutral-1000 textEditorText"
                      dangerouslySetInnerHTML={{ __html: item.comment }}
                    />
                    {item?.commentattach?.length > 0 && (
                      <div className="mt-2">
                        {item.commentattach.map((file, fileIndex) => (
                          <div key={fileIndex}>
                            <AttachmentUI
                              attachment={file.attachment}
                              name={file.name}
                              displayImageAttachment={false}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="mt-1">{renderActivityContent(item)}</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
