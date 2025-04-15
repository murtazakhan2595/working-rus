import {
  Notification,
  Notifications_Action_URL,
} from "app/utils/Types/Notification";
import moment from "moment";

export function getNotificationActionURL(module, notification_type) {
  if (!module || !notification_type) return "#";
  const URL = Notifications_Action_URL.find(
    (obj) =>
      obj.module === module && obj.notification_type === notification_type
  );
  return URL.action_url ?? "#";
}

export function mapNotificationData(data) {
  const NotificationData = Object.keys(Notification).reduce((acc, key) => {
    if (data.hasOwnProperty(key)) {
      if (key === "notification_type") {
        acc["action_url"] = getNotificationActionURL(data.module, data[key]);
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
