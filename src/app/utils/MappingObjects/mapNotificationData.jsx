import {
  Notification,
  Notifications_Action_URL,
} from "app/utils/Types/Notification";
import moment from "moment";

export function getNotificationActionURL(module, notification_type) {
  if (!module || !notification_type) return null;
  const URL_Object = Notifications_Action_URL.find(
    (obj) =>
      obj.module === module && obj.notification_type === notification_type
  );
  return URL_Object && URL_Object.action_url ? URL_Object.action_url : null;
}

export function mapNotificationData(data) {
  const NotificationData = Object.keys(Notification).reduce((acc, key) => {
    if (data.hasOwnProperty(key)) {
      if (key === "notification_type") {
        const action_url =
          getNotificationActionURL(data.module, data[key]) || "#";
        acc["action_url"] = action_url.replace(
          "{related_id}",
          data.related_id || ""
        );
        if (data[key] === "Mention") {
          const taskId = data.action_url.split("/")[2]; // "34"
          acc["action_url"] = action_url.replace("{related_id}", taskId || "");
        }
      }
      acc[key] = data[key];
    }
    return acc;
  }, {});
  return NotificationData;
}

export async function mapNotificationList(data) {
  if (!data || data.length === 0) return [];
  const NotificationList = await data?.map((notification) => {
    return mapNotificationData(notification);
  });

  return NotificationList;
}
