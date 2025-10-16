import {
  Notification,
  Notifications_Action_URL,
  NotificationTitle,
} from "app/utils/Types/Notification";

const replaceNotificationKeys = (text) => {
  let result = text;
  Object.entries(NotificationTitle).forEach(([key, value]) => {
    const regex = new RegExp(`\\b${key}\\b`, 'g'); // match exact word globally
    result = result.replace(regex, value);
  });
  return result;
};

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
      if (['title', 'message'].includes(key)) {
        // Replace using the mapping
        acc[key] = replaceNotificationKeys(data[key]);
      } else {
        if (key === "notification_type") {
          const action_url =
            getNotificationActionURL(data.module, data[key]) || "#";
          acc["action_url"] = action_url.replace(
            "{related_id}",
            data.related_id || ""
          );
        }
        acc[key] = data[key];
      }
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
