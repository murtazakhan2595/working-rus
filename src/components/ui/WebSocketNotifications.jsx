import React, { useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import { Bell } from "lucide-react";

import { Button } from "components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "src/@/components/ui/dropdown-menu";
import moment from "moment";
import { getNotifications } from "app/hooks/notifications";
import { markAsRead } from "app/hooks/notifications";
import { markAllNotificationsAsRead } from "app/hooks/notifications";
import { URLS } from "constants/config";

const WebSocketNotifications = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showUnread, setShowUnread] = useState(false);

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();

      // Transform the notifications to match your UI format
      const transformedNotifications = response.results.map((notification) => ({
        icon: null,
        type: notification.type,
        description: notification.message,
        time: formatNotificationTime(notification.created_at),
        isRead: notification.is_read,
        id: notification.id, // Keep the ID for future reference
      }));

      setNotifications(transformedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const formatNotificationTime = (timestamp) => {
    const now = moment();
    const notificationTime = moment(timestamp);
    const diffInHours = now.diff(notificationTime, "hours");
    const diffInDays = now.diff(notificationTime, "days");

    if (diffInHours < 24) {
      // Within last 24 hours: "5 minutes ago", "2 hours ago"
      return notificationTime.fromNow();
    } else if (diffInDays < 2) {
      // Yesterday: "Yesterday, 2:30 PM"
      return `Yesterday, ${notificationTime.format("h:mm A")}`;
    } else if (diffInDays < 7) {
      // Within last week: "Wed, Jan 24, 2:30 PM"
      return notificationTime.format("ddd, MMM D, h:mm A");
    } else {
      // Older than a week: "Jan 15, 2:30 PM"
      return notificationTime.format("MMM D, h:mm A");
    }
  };

  const getWebSocketURL = () => {
    const currentURL = window.location.origin;

    // Find the matching URL configuration
    const urlConfig = URLS.find((url) => url.Frontend === currentURL);

    if (urlConfig) {
      // Convert http(s):// to wss:// and add the WebSocket path
      const wsURL = urlConfig.Backend.replace("https://", "wss://").replace(
        "/api",
        "/ws/notifications/"
      );

      return wsURL;
    }

    // Default to staging if no match found
    return "wss://staging-hrms-be.tecbrix.cloud/ws/notifications/";
  };

  useEffect(() => {
    // Fetch existing notifications when component mounts
    fetchNotifications();
    // Initialize WebSocket connection
    const wsURL = getWebSocketURL() + "?token=" + localStorage.getItem("token");
    console.log("WebSocket URL:", wsURL);
    const ws = new WebSocket(wsURL);

    ws.onopen = () => {
      console.log("Connected to WebSocket");
    };

    ws.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      // Transform the WebSocket notification to match your notification format
      const transformedNotification = {
        icon: null,
        type: newNotification.type,
        description: newNotification.message,
        time: formatNotificationTime(newNotification.created_at),
        isRead: false,
      };
      setNotifications((prev) => [transformedNotification, ...prev]);
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket");
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        if (socket) {
          socket.close();
        }
      }, 5000);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    setSocket(ws);

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  const filteredNotifications = showUnread
    ? notifications.filter((n) => !n.isRead)
    : notifications;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markRead = async (id) => {
    const response = await markAsRead(id);
    if (response) {
      // Update the local state to mark the notification as read
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
    }
  };
  const markAllRead = async () => {
    const response = await markAllNotificationsAsRead(notifications);
    if (response) {
      // Update all notifications in local state to be marked as read
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[400px] p-0">
        <Card className="border-0 shadow-none">
          <CardHeader className="px-6 py-4 border-b">
            <CardTitle>Notifications</CardTitle>
            {unreadCount > 0 && (
              <CardDescription className="text-yellow-500">
                You have {unreadCount} unread notifications
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="p-0 max-h-[270px] overflow-y-auto overflow-x-hidden">
            <div className="divide-y">
              {filteredNotifications.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  No notifications
                </div>
              ) : (
                notifications.map((notification, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-4 px-6 py-4  transition-colors
    ${
      notification.isRead
        ? "bg-gray-50 hover:bg-gray-100"
        : "hover:bg-muted cursor-pointer"
    }
  `}
                    onClick={() =>
                      !notification.isRead && markRead(notification.id)
                    }
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p
                        className={`text-sm font-medium leading-none ${
                          !notification.isRead ? "font-bold" : ""
                        }`}
                      >
                        {notification.description}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
          <CardFooter className="px-6 py-4 border-t">
            <Button
              variant="secondary"
              size="sm"
              onClick={markAllRead}
              disabled={unreadCount === 0}
            >
              Mark all as read
            </Button>
          </CardFooter>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WebSocketNotifications;
