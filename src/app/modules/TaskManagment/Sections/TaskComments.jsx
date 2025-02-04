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
  getActivities,
} from "app/hooks/taskManagment";
import { MembersList } from "app/modules/TaskManagment/Sections";
import { TextUI } from "components";
import { ActivityTypes } from "../Boards/TaskEditAddViewDetails/Sections/activityHelper";
import { Clock, Redo2, X } from "lucide-react";
import { DetailCard } from "components/SheetCardExtension";
import { Button } from "components/ui/button";

function EmptyStateMessage({ message }) {
  return (
    <div className="flex items-center justify-center h-32 ">
      <p className="text-sm">{message}</p>
    </div>
  );
}

function TaskComments({
  taskId,
  refreshComments,
  setRefreshComments,
  showActivities,
}) {
  const employees = useSelector((state) => state.emp.employees);
  const userId = useSelector((state) => state.user.userProfile.id);
  const [combinedActivities, setCombinedActivities] = useState([]);

  const fetchActivitiesAndComments = async (isMounted) => {
    try {
      const [commentsData, activitiesData] = await Promise.all([
        getCommentsWithAttachments({ task_id: [taskId] }),
        getActivities({ filterData: { task_id: [taskId] } }),
      ]);

      if (isMounted) {
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
    return (
      <div className="text-neutral-1000 text-sm">
        <span>{activity.content}</span>
      </div>
    );
  };

  // Filter activities based on showActivities flag
  const filteredActivities = combinedActivities.filter((item) =>
    showActivities ? true : item.type === "comment"
  );

  console.log("filteredActivities", filteredActivities);
  // Check for empty states
  const hasComments = combinedActivities.some(
    (item) => item.type === "comment"
  );
  const hasActivities = combinedActivities.some(
    (item) => item.type === "activity"
  );
  const isCompletelyEmpty = combinedActivities.length === 0;
  const isOnlyActivitiesAndHidden =
    !hasComments && hasActivities && !showActivities;

  // Render empty state if needed
  if (isCompletelyEmpty) {
    return <EmptyStateMessage message="No activities or comments yet" />;
  }

  if (isOnlyActivitiesAndHidden) {
    return <EmptyStateMessage message="No comments available" />;
  }

  return (
    <div className="mt-3 max-h-[530px] max-w-full overflow-x-hidden overflow-y-auto hideScroll relative">
      <div className="space-y-4">
        {filteredActivities.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <MembersList members={[item.user_id]} display={true} />
            </div>

            <div className="flex-1 min-w-0 flex flex-col">
              <div className="flex items-start gap-2">
                <span className="font-semibold text-nowrap">
                  <EmployeeName value={item.user_id} />
                </span>
                {item.type === "comment" ? (
                  <TextUI text={item.comment} isHTMLText={true} />
                ) : (
                  <span>{renderActivityContent(item)}</span>
                )}
              </div>

              <time className="text-sm mt-1 text-neutral-1000 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-neutral-1000" />
                {moment(item.timestamp).format("D MMM YYYY, HH:mm")}
              </time>

              {item.type === "comment" && (
                <div className="">
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
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  className="p-1  bg-neutral-200 flex items-center gap-1 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50 rounded-lg"
                  type="button"
                >
                  <Redo2 size={16} />
                  Reply
                </button>
                {item.user_id === userId && (
                  <button
                    className="p-1  bg-neutral-200 flex items-center gap-1 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50 rounded-lg"
                    type="button"
                  >
                    <X size={16} />
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TaskCommentsContainer({
  taskId,
  refreshComments,
  setRefreshComments,
}) {
  const [showActivities, setShowActivities] = useState(true);

  const toggleActivities = () => {
    setShowActivities(!showActivities);
  };

  return (
    <>
      <div className="flex justify-between items-center mt-2">
        <div className="text-neutral-1200 text-sm font-semibold whitespace-nowrap mb-3">
          {"Activity"}
        </div>
        <button
          className="text-neutral-1200 text-sm font-semibold whitespace-nowrap mb-3"
          type="button"
          onClick={toggleActivities}
        >
          {showActivities ? "Hide Activity" : "Show Activity"}
        </button>
      </div>
      <DetailCard detailCardTitle="" classNames="mt-0">
        <TaskComments
          taskId={taskId}
          refreshComments={refreshComments}
          setRefreshComments={setRefreshComments}
          showActivities={showActivities}
        />
      </DetailCard>
    </>
  );
}
