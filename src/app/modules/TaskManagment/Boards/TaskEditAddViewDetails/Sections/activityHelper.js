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
  CHECKLIST_ITEM_DESCRIPTION_UPDATED: "CHECKLIST_ITEM_DESCRIPTION_UPDATED",
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
  ACTUAL_TIME_CHANGED: "ACTUAL_TIME_CHANGED",
  CHANGED_LIST: "CHANGED_LIST",
  CUSTOM_FIELD_CHANGED: "CUSTOM_FIELD_CHANGED",
  TASK_DESCRIPTION_UPDATED:"TASK_DESCRIPTION_UPDATED",
};

const getRenderedValue = (value) => {
  return ReactDOMServer.renderToStaticMarkup(
    <span className="text-plum-1100 font-medium">{value}</span>
  );
};

const generateActivityContent = (
  type,
  newValueHTML,
  oldValueHTML = null,
  additionalInfo = null
) => {
  const newValue = newValueHTML || null;
  const oldValue = oldValueHTML || null;
  switch (type) {
    case ActivityTypes.TASK_CREATED:
      return "Created the task";

    case ActivityTypes.TASK_TITLE_UPDATED:
      return `Changed title from "${oldValue}" to "${newValue}"`;

    case ActivityTypes.TASK_DESCRIPTION_UPDATED:
      return "Updated task description";

    case ActivityTypes.TASK_COVER_PHOTO_UPDATED:
      return "Updated task cover photo";

    case ActivityTypes.STATUS_CHANGED:
      return `Marked the card as ${ReactDOMServer.renderToStaticMarkup(
        newValue
      )}`;
    case ActivityTypes.PRIORITY_CHANGED:
      return `Changed priority from ${ReactDOMServer.renderToStaticMarkup(
        oldValue
      )} to ${ReactDOMServer.renderToStaticMarkup(newValue)}`;

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
      return `Added new label${
        newValue?.length > 1 ? "s" : ""
      } ${getRenderedValue(newValue.join(", "))}`;

    case ActivityTypes.LABELS_REMOVED:
      return `Removed label${
        newValue?.length > 1 ? "s" : ""
      } ${getRenderedValue(newValue.join(", "))}`;

    case ActivityTypes.CHECKLIST_ITEM_ADDED:
      return `Added checklist item: ${getRenderedValue(newValue)}`;

    case ActivityTypes.CHECKLIST_ITEM_DESCRIPTION_UPDATED:
      return `Updated checklist item to ${getRenderedValue(
        newValue
      )} from ${getRenderedValue(oldValue)}`;

    case ActivityTypes.CHECKLIST_ITEM_COMPLETED:
      return `Marked checklist item "${newValue}" as ${getRenderedValue(
        additionalInfo
      )}`;

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

    case ActivityTypes.ESTIMATED_TIME_CHANGED:
      return `Updated the estimated time to ${getRenderedValue(
        newValue + "hr"
      )}`;
    case ActivityTypes.ACTUAL_TIME_CHANGED:
      return `Updated the time spent to ${getRenderedValue(newValue + "hr")}`;

    case ActivityTypes.SUBTASK_CREATED:
      return `Created subtask: "${newValue}"`;

    case ActivityTypes.SUBTASK_COMPLETED:
      return `Completed subtask: "${newValue}"`;

    case ActivityTypes.RELATION_ADDED:
      return `Added relation: ${newValue}`;

    case ActivityTypes.RELATION_REMOVED:
      return `Removed relation: ${newValue}`;

    case ActivityTypes.CUSTOM_FIELD_CHANGED:
      return `Updated ${getRenderedValue(
        additionalInfo
      )} custom field to ${getRenderedValue(newValue)} ${
        oldValue ? `from ${oldValue}` : ""
      }`;

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
  console.log("Task ID in trackTaskActivities:", updatedTaskData);
  console.log("Previous Task Data ID:", previousTaskData);

  const activityLog = []; // Stores all detected changes for logging

  /**
   * Function to normalize dates for accurate comparison
   * Ensures all dates are converted to "YYYY-MM-DD" format
   */
  const formatDateForComparison = (date) =>
    date ? moment(date).startOf("day").format("YYYY-MM-DD") : null;

  // If no previous data exists, it means the task was newly created
  if (!previousTaskData || !previousTaskData.id) {
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
          if (updatedTaskData.name !== previousTaskData?.name) {
            activityLog.push({
              task_id: taskId,
              action_type: ActivityTypes.TASK_TITLE_UPDATED,
              content: generateActivityContent(
                ActivityTypes.TASK_TITLE_UPDATED,
                updatedTaskData.name,
                previousTaskData?.name
              ),
              user_id: userId,
            });
          }
          break;

        case "description":
          if (updatedTaskData.description !== previousTaskData?.description) {
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
        case "cover_photo":
          if (updatedTaskData.cover_photo !== previousTaskData?.cover_photo) {
            activityLog.push({
              task_id: taskId,
              action_type: ActivityTypes.TASK_COVER_PHOTO_UPDATED,
              content: generateActivityContent(
                ActivityTypes.TASK_COVER_PHOTO_UPDATED
              ),
              user_id: userId,
            });
          }
          break;

        case "status":
          if (updatedTaskData.status !== previousTaskData?.status) {
            activityLog.push({
              task_id: taskId,
              action_type: ActivityTypes.STATUS_CHANGED,
              content: generateActivityContent(
                ActivityTypes.STATUS_CHANGED,
                TaskStatus.find((obj) => obj.value === updatedTaskData.status)
                  ?.label || updatedTaskData.status,
                TaskStatus.find((obj) => obj.value === previousTaskData?.status)
                  ?.label || previousTaskData?.status
              ),
              user_id: userId,
            });
          }
          break;

        case "priority":
          if (updatedTaskData.priority !== previousTaskData?.priority) {
            activityLog.push({
              task_id: taskId,
              action_type: ActivityTypes.PRIORITY_CHANGED,
              content: generateActivityContent(
                ActivityTypes.PRIORITY_CHANGED,
                PriorityList.find(
                  (option) => option.value === updatedTaskData.priority
                )?.name,
                PriorityList.find(
                  (option) => option.value === previousTaskData?.priority
                )?.name
              ),
              user_id: userId,
            });
          }
          break;

        case "assigned_to":
          if (
            JSON.stringify(updatedTaskData.assigned_to) !==
            JSON.stringify(previousTaskData?.assigned_to)
          ) {
            const newMembers = updatedTaskData.assigned_to_names?.filter(
              (member) => !previousTaskData?.assigned_to_names?.includes(member)
            );
            const removedMembers = previousTaskData?.assigned_to_names?.filter(
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
            previousTaskData?.end_date
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

        case "label":
          if (
            JSON.stringify(updatedTaskData.label || []) !==
            JSON.stringify(previousTaskData?.label || [])
          ) {
            debugger;
            const previousLabels = previousTaskData?.label_name || [];
            const updatedLabels = updatedTaskData.label_name || [];

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
          if (updatedTaskData.is_archive !== previousTaskData?.is_archive) {
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
          if (updatedTaskData.board_id !== previousTaskData?.board_id) {
            activityLog.push({
              task_id: taskId,
              action_type: ActivityTypes.CHANGED_LIST,
              content: generateActivityContent(
                ActivityTypes.CHANGED_LIST,
                updatedTaskData.board_name,
                previousTaskData?.board_name
              ),
              user_id: userId,
            });
          }
          break;

        case "estimated_time":
          if (
            updatedTaskData.estimated_time !== previousTaskData?.estimated_time
          ) {
            activityLog.push({
              task_id: taskId,
              action_type: ActivityTypes.ESTIMATED_TIME_CHANGED,
              content: generateActivityContent(
                ActivityTypes.ESTIMATED_TIME_CHANGED,
                updatedTaskData.estimated_time,
                previousTaskData?.estimated_time
              ),
              user_id: userId,
            });
          }
          break;

        case "actual_time":
          if (updatedTaskData.actual_time !== previousTaskData?.actual_time) {
            activityLog.push({
              task_id: taskId,
              action_type: ActivityTypes.ESTIMATED_TIME_CHANGED,
              content: generateActivityContent(
                ActivityTypes.ACTUAL_TIME_CHANGED,
                updatedTaskData.actual_time,
                previousTaskData?.actual_time
              ),
              user_id: userId,
            });
          }
          break;

        case "custom_fields":
          // Convert previous custom fields (Array of "field:value" strings) into an object
          const updatedCustomFields = Object.fromEntries(
            (updatedTaskData.custom_fields || [])
              .filter((item) => typeof item === "string" && item.includes(":"))
              .map((item) => item.split(":")) // Convert "field:value" to [field, value]
          );

          // Convert updated custom fields (Array of { field, value } objects) into an object
          const previousCustomFields = Object.fromEntries(
            (previousTaskData?.custom_fields || [])
              .filter((item) => typeof item === "object" && item.field) // Ensure valid object format
              .map(({ field, value }) => [field, value]) // Convert to key-value pairs
          );

          // Compare changes and track updates
          Object.keys(updatedCustomFields).forEach((fieldKey) => {
            const newValue = updatedCustomFields[fieldKey]; // New value
            const oldValue = previousCustomFields[fieldKey] || null; // Old value (default to null if missing)

            if (newValue !== oldValue) {
              activityLog.push({
                task_id: taskId,
                action_type: ActivityTypes.CUSTOM_FIELD_CHANGED,
                content: generateActivityContent(
                  ActivityTypes.CUSTOM_FIELD_CHANGED,
                  newValue, // New value
                  oldValue, // Old value (if exists)
                  fieldKey // Field name
                ),
                user_id: userId,
              });
            }
          });

          break;

        case "task_checklist":
          const newCheckList = updatedTaskData?.task_checklist || null;
          const oldCheckList = previousTaskData?.task_checklist || null;
          if (newCheckList?.id && !oldCheckList) {
            activityLog.push({
              task_id: taskId,
              action_type: ActivityTypes.CHECKLIST_ITEM_ADDED,
              content: generateActivityContent(
                ActivityTypes.CHECKLIST_ITEM_ADDED,
                newCheckList.description
              ),
              user_id: userId,
            });
          } else if (newCheckList?.description !== oldCheckList?.description) {
            activityLog.push({
              task_id: taskId,
              action_type: ActivityTypes.CHECKLIST_ITEM_DESCRIPTION_UPDATED,
              content: generateActivityContent(
                ActivityTypes.CHECKLIST_ITEM_DESCRIPTION_UPDATED,
                newCheckList.description,
                oldCheckList.description
              ),
              user_id: userId,
            });
          } else if (
            newCheckList?.is_completed !== oldCheckList?.is_completed
          ) {
            activityLog.push({
              task_id: taskId,
              action_type: ActivityTypes.CHECKLIST_ITEM_COMPLETED,
              content: generateActivityContent(
                ActivityTypes.CHECKLIST_ITEM_COMPLETED,
                newCheckList.description,
                oldCheckList.description,
                newCheckList?.is_completed === true ? "completed" : "incomplete"
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
