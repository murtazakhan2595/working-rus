// utils/activityHelper.js

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
  TASK_DELETED: "TASK_DELETED",
  SUBTASK_CREATED: "SUBTASK_CREATED",
  SUBTASK_COMPLETED: "SUBTASK_COMPLETED",
  RELATION_ADDED: "RELATION_ADDED",
  RELATION_REMOVED: "RELATION_REMOVED",
};

const generateActivityContent = (
  type,
  newValue,
  oldValue = null,
  additionalInfo = {}
) => {
  switch (type) {
    case ActivityTypes.TASK_CREATED:
      return "Created the task";

    case ActivityTypes.TASK_TITLE_UPDATED:
      return `Changed title from "${oldValue}" to "${newValue}"`;

    case ActivityTypes.TASK_DESCRIPTION_UPDATED:
      return "Updated task description";

    case ActivityTypes.STATUS_CHANGED:
      return `Changed status from "${oldValue}" to "${newValue}"`;

    case ActivityTypes.PRIORITY_CHANGED:
      return `Changed priority from "${oldValue}" to "${newValue}"`;

    case ActivityTypes.DUE_DATE_CHANGED:
      return `Updated due date to ${newValue}`;

    case ActivityTypes.MEMBERS_ADDED:
      const addedMembers = Array.isArray(newValue)
        ? newValue.join(", ")
        : newValue;
      return `Added ${addedMembers} to the task`;

    case ActivityTypes.MEMBERS_REMOVED:
      const removedMembers = Array.isArray(newValue)
        ? newValue.join(", ")
        : newValue;
      return `Removed ${removedMembers} from the task`;

    case ActivityTypes.LABELS_ADDED:
      return `Added label${newValue.length > 1 ? "s" : ""}: ${newValue.join(
        ", "
      )}`;

    case ActivityTypes.LABELS_REMOVED:
      return `Removed label${newValue.length > 1 ? "s" : ""}: ${newValue.join(
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

    case ActivityTypes.TASK_DELETED:
      return "Deleted the task";

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
  newValues,
  oldValues,
  taskId,
  userId,
  createActivityFn
) => {
  const activities = [];

  // If no oldValues, it's a new task
  if (!oldValues) {
    activities.push({
      task_id: taskId,
      action_type: ActivityTypes.TASK_CREATED,
      content: generateActivityContent(ActivityTypes.TASK_CREATED),
      user_id: userId,
    });
  } else {
    // Compare and track changes
    if (newValues.name !== oldValues.name) {
      activities.push({
        task_id: taskId,
        action_type: ActivityTypes.TASK_TITLE_UPDATED,
        content: generateActivityContent(
          ActivityTypes.TASK_TITLE_UPDATED,
          newValues.name,
          oldValues.name
        ),
        user_id: userId,
      });
    }

    if (newValues.description !== oldValues.description) {
      activities.push({
        task_id: taskId,
        action_type: ActivityTypes.TASK_DESCRIPTION_UPDATED,
        content: generateActivityContent(
          ActivityTypes.TASK_DESCRIPTION_UPDATED
        ),
        user_id: userId,
      });
    }

    if (newValues.status !== oldValues.status) {
      activities.push({
        task_id: taskId,
        action_type: ActivityTypes.STATUS_CHANGED,
        content: generateActivityContent(
          ActivityTypes.STATUS_CHANGED,
          newValues.status,
          oldValues.status
        ),
        user_id: userId,
      });
    }

    if (newValues.priority !== oldValues.priority) {
      activities.push({
        task_id: taskId,
        action_type: ActivityTypes.PRIORITY_CHANGED,
        content: generateActivityContent(
          ActivityTypes.PRIORITY_CHANGED,
          newValues.priority,
          oldValues.priority
        ),
        user_id: userId,
      });
    }

    // Compare arrays (for members, labels, etc.)
    if (
      JSON.stringify(newValues.assigned_to) !==
      JSON.stringify(oldValues.assigned_to)
    ) {
      const added = newValues.assigned_to.filter(
        (x) => !oldValues.assigned_to.includes(x)
      );
      const removed = oldValues.assigned_to.filter(
        (x) => !newValues.assigned_to.includes(x)
      );

      if (added.length) {
        activities.push({
          task_id: taskId,
          action_type: ActivityTypes.MEMBERS_ADDED,
          content: generateActivityContent(ActivityTypes.MEMBERS_ADDED, added),
          user_id: userId,
        });
      }

      if (removed.length) {
        activities.push({
          task_id: taskId,
          action_type: ActivityTypes.MEMBERS_REMOVED,
          content: generateActivityContent(
            ActivityTypes.MEMBERS_REMOVED,
            removed
          ),
          user_id: userId,
        });
      }
    }

    // Add more comparisons as needed
  }

  // Create all activities
  try {
    await Promise.all(activities.map((activity) => createActivityFn(activity)));
  } catch (error) {
    console.error("Error creating activities:", error);
  }
};
