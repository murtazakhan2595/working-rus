// utils/activityHelper.js

import moment from "moment";
import { TaskStatus, PriorityList } from "data/Data";
import ReactDOMServer from "react-dom/server";

export const ActivityTypes = {
  TASK_CREATED: "TASK_CREATED",
  TASK_TITLE_UPDATED: "TASK_TITLE_UPDATED",
  TASK_DESCRIPTION_UPDATED: "TASK_DESCRIPTION_UPDATED",
  STATUS_CHANGED: "STATUS_CHANGED",
  PRIORITY_CHANGED: "PRIORITY_CHANGED",
  DUE_DATE_CHANGED: "DUE_DATE_CHANGED",
  MEMBERS_ADDED: "MEMBERS_ADDED",
  MEMBERS_REMOVED: "MEMBERS_REMOVED",
  LABELS_ADDED: "LABELS_ADDED",
  LABELS_REMOVED: "LABELS_REMOVED",
  CHECKLIST_ITEM_ADDED: "CHECKLIST_ITEM_ADDED",
  CHECKLIST_ITEM_COMPLETED: "CHECKLIST_ITEM_COMPLETED",
  CHECKLIST_ITEM_DELETED: "CHECKLIST_ITEM_DELETED",
  ATTACHMENT_ADDED: "ATTACHMENT_ADDED",
  ATTACHMENT_REMOVED: "ATTACHMENT_REMOVED",
  TASK_ARCHIVED: "TASK_ARCHIVED",
  TASK_ARCHIVED_REMOVED: "TASK_ARCHIVED_REMOVED",
  TASK_DELETED: "TASK_DELETED",
  SUBTASK_CREATED: "SUBTASK_CREATED",
  SUBTASK_COMPLETED: "SUBTASK_COMPLETED",
  RELATION_ADDED: "RELATION_ADDED",
  RELATION_REMOVED: "RELATION_REMOVED",
  ESTIMATED_TIME_CHANGED: "ESTIMATED_TIME_CHANGED",
  CHANGED_LIST: "CHANGED_LIST",
};

const getRenderedValue = (value) => {
  return ReactDOMServer.renderToStaticMarkup(
    <span className="text-plum-1100 font-medium">{value}</span>
  );
};

const generateActivityContent = (type, newValueHTML, oldValueHTML = null) => {
  const newValue = newValueHTML || null;
  const oldValue = oldValueHTML || null;
  switch (type) {
    case ActivityTypes.TASK_CREATED:
      return "Created the task";

    case ActivityTypes.TASK_TITLE_UPDATED:
      return `Changed title from "${oldValue}" to "${newValue}"`;

    case ActivityTypes.TASK_DESCRIPTION_UPDATED:
      return "Updated task description";

    case ActivityTypes.STATUS_CHANGED:
      return `Changed status from ${ReactDOMServer.renderToStaticMarkup(oldValue)} to ${ReactDOMServer.renderToStaticMarkup(newValue)}`;
    case ActivityTypes.PRIORITY_CHANGED:
      return `Changed priority from ${ReactDOMServer.renderToStaticMarkup(oldValue)} to ${ReactDOMServer.renderToStaticMarkup(newValue)}`;

    case ActivityTypes.DUE_DATE_CHANGED:
      return oldValue
        ? `Updated due date from ${getRenderedValue(
            oldValue
          )} to ${getRenderedValue(newValue)}`
        : `Set due date to ${getRenderedValue(newValue)}`;

    case ActivityTypes.MEMBERS_ADDED:
      const addedMembers = Array.isArray(newValue)
        ? newValue.join(", ")
        : newValue;
      return `Added ${getRenderedValue(addedMembers)} to the task`;

    case ActivityTypes.MEMBERS_REMOVED:
      const removedMembers = Array.isArray(newValue)
        ? newValue.join(", ")
        : newValue;
      return `Removed ${getRenderedValue(removedMembers)} from the task`;

    case ActivityTypes.LABELS_ADDED:
      return `Added label${newValue?.length > 1 ? "s" : ""}: ${newValue.join(
        ", "
      )}`;

    case ActivityTypes.LABELS_REMOVED:
      return `Removed label${newValue?.length > 1 ? "s" : ""}: ${newValue.join(
        ", "
      )}`;

    case ActivityTypes.CHECKLIST_ITEM_ADDED:
      return `Added checklist item: "${newValue}"`;

    case ActivityTypes.CHECKLIST_ITEM_COMPLETED:
      return `Completed checklist item: "${newValue}"`;

    case ActivityTypes.CHECKLIST_ITEM_DELETED:
      return `Removed checklist item: "${newValue}"`;

    case ActivityTypes.ATTACHMENT_ADDED:
      return `Added attachment: ${newValue}`;

    case ActivityTypes.ATTACHMENT_REMOVED:
      return `Removed attachment: ${newValue}`;

    case ActivityTypes.TASK_ARCHIVED:
      return "Archived the task";
    case ActivityTypes.TASK_ARCHIVED_REMOVED:
      return `Restored the task from archive`;
    case ActivityTypes.TASK_DELETED:
      return "Deleted the task";
    case ActivityTypes.CHANGED_LIST:
      return `Moved card from ${getRenderedValue(
        oldValue
      )} to ${getRenderedValue(newValue)}`;

    case ActivityTypes.SUBTASK_CREATED:
      return `Created subtask: "${newValue}"`;

    case ActivityTypes.SUBTASK_COMPLETED:
      return `Completed subtask: "${newValue}"`;

    case ActivityTypes.RELATION_ADDED:
      return `Added relation: ${newValue}`;

    case ActivityTypes.RELATION_REMOVED:
      return `Removed relation: ${newValue}`;

    default:
      return "Updated the task";
  }
};

export const trackTaskActivities = async (
  updatedTaskData, // New task data after update
  previousTaskData, // Old task data before update
  taskId, // Task identifier
  userId, // User performing the update
  logActivity, // Function to create activity logs
  fieldsToTrack // List of fields to track changes
) => {
  console.log("Task ID in trackTaskActivities:", taskId);
  console.log("Previous Task Data ID:", previousTaskData?.id);

  const activityLog = []; // Stores all detected changes for logging

  /**
   * Function to normalize dates for accurate comparison
   * Ensures all dates are converted to "YYYY-MM-DD" format
   */
  const formatDateForComparison = (date) =>
    date ? moment(date).startOf("day").format("YYYY-MM-DD") : null;

  // If no previous data exists, it means the task was newly created
  if (!previousTaskData || !previousTaskData?.id) {
    activityLog.push({
      task_id: taskId,
      action_type: ActivityTypes.TASK_CREATED,
      content: generateActivityContent(ActivityTypes.TASK_CREATED),
      user_id: userId,
    });
  } else {
    // Iterate through fieldsToTrack to log only relevant changes
    fieldsToTrack.forEach((field) => {
      switch (field) {
        case "name":
          if (updatedTaskData.name !== previousTaskData.name) {
            activityLog.push({
              task_id: taskId,
              action_type: ActivityTypes.TASK_TITLE_UPDATED,
              content: generateActivityContent(
                ActivityTypes.TASK_TITLE_UPDATED,
                updatedTaskData.name,
                previousTaskData.name
              ),
              user_id: userId,
            });
          }
          break;

        case "description":
          if (updatedTaskData.description !== previousTaskData.description) {
            activityLog.push({
              task_id: taskId,
              action_type: ActivityTypes.TASK_DESCRIPTION_UPDATED,
              content: generateActivityContent(
                ActivityTypes.TASK_DESCRIPTION_UPDATED
              ),
              user_id: userId,
            });
          }
          break;

        case "status":
          if (updatedTaskData.status !== previousTaskData.status) {
            activityLog.push({
              task_id: taskId,
              action_type: ActivityTypes.STATUS_CHANGED,
              content: generateActivityContent(
                ActivityTypes.STATUS_CHANGED,
                TaskStatus.find((obj) => obj.value === updatedTaskData.status)
                  ?.label || updatedTaskData.status,
                TaskStatus.find((obj) => obj.value === previousTaskData.status)
                  ?.label || previousTaskData.status
              ),
              user_id: userId,
            });
          }
          break;

        case "priority":
          if (updatedTaskData.priority !== previousTaskData.priority) {
            activityLog.push({
              task_id: taskId,
              action_type: ActivityTypes.PRIORITY_CHANGED,
              content: generateActivityContent(
                ActivityTypes.PRIORITY_CHANGED,
                PriorityList.find(
                  (option) => option.value === updatedTaskData.priority
                )?.name,
                PriorityList.find(
                  (option) => option.value === previousTaskData.priority
                )?.name
              ),
              user_id: userId,
            });
          }
          break;

        case "assigned_to":
          if (
            JSON.stringify(updatedTaskData.assigned_to) !==
            JSON.stringify(previousTaskData.assigned_to)
          ) {
            const newMembers = updatedTaskData.assigned_to_names?.filter(
              (member) => !previousTaskData.assigned_to_names?.includes(member)
            );
            const removedMembers = previousTaskData.assigned_to_names?.filter(
              (member) => !updatedTaskData.assigned_to_names?.includes(member)
            );

            if (newMembers?.length) {
              activityLog.push({
                task_id: taskId,
                action_type: ActivityTypes.MEMBERS_ADDED,
                content: generateActivityContent(
                  ActivityTypes.MEMBERS_ADDED,
                  newMembers
                ),
                user_id: userId,
              });
            }

            if (removedMembers?.length) {
              activityLog.push({
                task_id: taskId,
                action_type: ActivityTypes.MEMBERS_REMOVED,
                content: generateActivityContent(
                  ActivityTypes.MEMBERS_REMOVED,
                  removedMembers
                ),
                user_id: userId,
              });
            }
          }
          break;

        case "end_date":
          const previousDueDate = formatDateForComparison(
            previousTaskData.end_date
          );
          const updatedDueDate = formatDateForComparison(
            updatedTaskData.end_date
          );

          if (updatedDueDate !== previousDueDate) {
            const formattedUpdatedDueDate = updatedDueDate
              ? moment(updatedDueDate).format("DD MMM YYYY")
              : null;
            const formattedPreviousDueDate = previousDueDate
              ? moment(previousDueDate).format("DD MMM YYYY")
              : null;

            activityLog.push({
              task_id: taskId,
              action_type: ActivityTypes.DUE_DATE_CHANGED,
              content: generateActivityContent(
                ActivityTypes.DUE_DATE_CHANGED,
                formattedUpdatedDueDate,
                formattedPreviousDueDate
              ),
              user_id: userId,
            });
          }
          break;

        case "labels":
          if (
            JSON.stringify(updatedTaskData.labels || []) !==
            JSON.stringify(previousTaskData.labels || [])
          ) {
            const previousLabels = previousTaskData.labels || [];
            const updatedLabels = updatedTaskData.labels || [];

            const addedLabels = updatedLabels?.filter(
              (label) => !previousLabels?.includes(label)
            );
            const removedLabels = previousLabels?.filter(
              (label) => !updatedLabels?.includes(label)
            );

            if (addedLabels?.length > 0) {
              activityLog.push({
                task_id: taskId,
                action_type: ActivityTypes.LABELS_ADDED,
                content: generateActivityContent(
                  ActivityTypes.LABELS_ADDED,
                  addedLabels
                ),
                user_id: userId,
              });
            }

            if (removedLabels?.length > 0) {
              activityLog.push({
                task_id: taskId,
                action_type: ActivityTypes.LABELS_REMOVED,
                content: generateActivityContent(
                  ActivityTypes.LABELS_REMOVED,
                  removedLabels
                ),
                user_id: userId,
              });
            }
          }
          break;

        case "is_archive":
          if (updatedTaskData.is_archive !== previousTaskData.is_archive) {
            activityLog.push({
              task_id: taskId,
              action_type: updatedTaskData.is_archive
                ? ActivityTypes.TASK_ARCHIVED
                : ActivityTypes.TASK_ARCHIVED_REMOVED,
              content: generateActivityContent(
                updatedTaskData.is_archive
                  ? ActivityTypes.TASK_ARCHIVED
                  : ActivityTypes.TASK_ARCHIVED_REMOVED
              ),
              user_id: userId,
            });
          }
          break;

        case "board_id":
          if (updatedTaskData.board_id !== previousTaskData.board_id) {
            activityLog.push({
              task_id: taskId,
              action_type: ActivityTypes.CHANGED_LIST,
              content: generateActivityContent(
                ActivityTypes.CHANGED_LIST,
                updatedTaskData.board_name,
                previousTaskData.board_name
              ),
              user_id: userId,
            });
          }
          break;

        default:
          console.warn(`Unhandled field: ${field}`);
      }
    });
  }

  // Log all activities asynchronously
  try {
    await Promise.all(activityLog.map((activity) => logActivity(activity)));
  } catch (error) {
    console.error("Error creating activity logs:", error);
  }
};
