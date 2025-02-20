import React, { useState, useEffect, useRef } from "react";
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
} from "src/@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "src/@/components/ui/tooltip";
import DOMPurify from "dompurify";
import moment from "moment";
import {
  getNotifications,
  markAsRead,
  markAllNotificationsAsRead,
} from "app/hooks/notifications";
import { URLS } from "constants/config";
import { useNavigate } from "react-router-dom";

const WebSocketNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const socketRef = useRef(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();
      const transformedNotifications = response.results.map((notification) => ({
        id: notification.id,
        type: notification.type,
        description: notification.message,
        time: formatNotificationTime(notification.created_at),
        isRead: notification.is_read,
        task_id: notification?.task_id,
        project_id: notification?.project_id,
      }));

      setNotifications(transformedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const stripHtml = (html) => {
    const cleanText = DOMPurify.sanitize(html, { ALLOWED_TAGS: [] }); // Remove all HTML tags
    return cleanText.replace(/&nbsp;/g, " "); // Replace non-breaking spaces with normal spaces
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const formatNotificationTime = (timestamp) => {
    const now = moment();
    const notificationTime = moment(timestamp);
    const diffInHours = now.diff(notificationTime, "hours");
    const diffInDays = now.diff(notificationTime, "days");

    if (diffInHours < 24) {
      return notificationTime.fromNow();
    } else if (diffInDays < 2) {
      return `Yesterday, ${notificationTime.format("h:mm A")}`;
    } else if (diffInDays < 7) {
      return notificationTime.format("ddd, MMM D, h:mm A");
    } else {
      return notificationTime.format("MMM D, h:mm A");
    }
  };

  const getWebSocketURL = () => {
    const currentURL = window.location.origin;
    const urlConfig = URLS.find((url) => url.Frontend === currentURL);
    return urlConfig
      ? urlConfig.Backend.replace("https://", "wss://").replace(
          "/api",
          "/ws/notifications/"
        )
      : "wss://staging-hrms-be.tecbrix.cloud/ws/notifications/";
  };

  const connectWebSocket = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }

    const wsURL = getWebSocketURL() + "?token=" + localStorage.getItem("token");
    console.log("Connecting to WebSocket:", wsURL);

    const ws = new WebSocket(wsURL);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("Connected to WebSocket");
      setRetryCount(0);
    };

    ws.onmessage = (event) => {
      try {
        const newNotification = JSON.parse(event.data);
        console.log("New Notification:", newNotification);

        const transformedNotification = {
          id: newNotification.id,
          type: newNotification.type,
          description: newNotification.message,
          time: formatNotificationTime(newNotification.created_at),
          isRead: false,
          task_id: newNotification?.task_id,
          project_id: newNotification?.project_id,
        };

        setNotifications((prev) => [transformedNotification, ...prev]);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected. Attempting to reconnect...");
      setTimeout(() => {
        if (retryCount < 5) {
          setRetryCount((prev) => prev + 1);
          connectWebSocket();
        }
      }, Math.min(1000 * 2 ** retryCount, 30000)); // Exponential backoff
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      ws.close();
    };
  };

  useEffect(() => {
    fetchNotifications();
    connectWebSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const markRead = async (id) => {
    const response = await markAsRead(id);
    if (response) {
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
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
    }
  };

  const handleNotificationClick = (notification) => {
    console.log(notification, "NOTIFICATION IS DONE")
    if (!notification.isRead) {
      markRead(notification.id);
    }

    if(notification?.type === "PROJECT"){
      navigate(
        `/project-board/${notification.project_id}`
      );
    }

    if (notification.type === "MENTION") {
      navigate(
        `/project-board/${notification.project_id}/${notification.task_id}`
      );
    }
    if(notification.type === "TASK"){
      navigate(
        `/project-board/${notification.project_id}/${notification.task_id}`
      );
    }
  };

  return (
    <TooltipProvider>
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full relative">
          <Bell className="w-5 h-5" />
          {notifications.some((n) => !n.isRead) && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notifications.filter((n) => !n.isRead).length}
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
          <CardContent className="p-0 max-h-[270px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                No notifications
              </div>
            ) : (
              notifications.map((notification, index) => {
                const plainTextDescription = stripHtml(
                  notification.description || ""
                ); // Ensure it's not undefined
                return (
                  <div
                  key={index}
                  className={`flex items-start gap-4 px-6 py-4  transition-colors cursor-pointer
                    ${
                      ("flex items-start gap-4 px-6 py-4 transition-colors cursor-pointer",
                      notification.isRead
                        ? "bg-gray-50 hover:bg-gray-100"
                        : "bg-blue-50 hover:bg-blue-100")
                    }
                  `}
                  onClick={() => handleNotificationClick(notification)}
                >
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full">
                          <Bell className="w-5 h-5" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p
                                className={`text-sm font-medium leading-none ${
                                  !notification.isRead ? "font-bold" : ""
                                }`}
                              >
                                {truncateText(plainTextDescription, 50)}
                              </p>
                            </TooltipTrigger>
                            {notification.description.length > 50 && (
                              <TooltipContent className="max-w-[250px] max-h-[150px] overflow-y-auto p-2 bg-white shadow-lg rounded-md border border-gray-200">
                                {plainTextDescription}
                              </TooltipContent>
                            )}
                          </Tooltip>
                          <p className="text-sm text-muted-foreground">
                            {notification.time}
                          </p>
                        </div>
                  </div>
                );
              })
            )}
          </CardContent>

          <CardFooter className="px-6 py-4 border-t">
            <Button variant="secondary" size="sm" onClick={markAllRead}>
              Mark All as Read
            </Button>
          </CardFooter>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
    </TooltipProvider>
  );
};

export default WebSocketNotifications;
