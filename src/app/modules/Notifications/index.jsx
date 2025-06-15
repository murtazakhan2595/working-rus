import React, { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { ScrollArea } from "src/@/components/ui/scroll-area";
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
import { URLS, WEBSOCKET_PATHS } from "constants/config";
import { useNavigate } from "react-router-dom";
import { cn } from "src/@/lib/utils";
import { renderDate } from "utils/renderValues";
import { mapNotificationData } from "app/utils/MappingObjects/mapNotificationData";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const socketRefs = useRef({});
  const navigate = useNavigate();

  // Fetch existing notifications from backend
  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();
      setNotifications(response?.results || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  // Format notification time for better readability
  const formatNotificationTime = (timestamp) => {
    const now = moment();
    const time = moment(timestamp);
    const diffHours = now.diff(time, "hours");
    const diffDays = now.diff(time, "days");

    if (diffHours < 24) return time.fromNow();
    if (diffDays < 2) return `Yesterday, ${time.format("h:mm A")}`;
    if (diffDays < 7) return time.format("ddd, MMM D, h:mm A");
    return time.format("MMM D, h:mm A");
  };

  // Remove all HTML tags and decode special characters
  const stripHtml = (html) => {
    const clean = DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
    return clean.replace(/&nbsp;/g, " ");
  };

  // Truncate text to desired length
  const truncateText = (text, maxLength) =>
    text?.length > maxLength ? text.slice(0, maxLength) + "..." : text;

  // Calculate unread notifications count
  const unreadCount = notifications.filter((n) => !n.is_read)?.length;

  // Derive WebSocket base URL from environment
  const getWebSocketBaseURL = () => {
    const currentURL = window.location.origin;
    const match = URLS.find((url) => url.Frontend === currentURL);
    return match
      ? match.Backend.replace("https://", "wss://").replace("/api", "")
      : "wss://staging-hrms-be.tecbrix.cloud";
  };

  // Connect to all WebSocket paths
  const connectWebSockets = () => {
    const baseWSURL = getWebSocketBaseURL();
    const token = localStorage.getItem("token");

    WEBSOCKET_PATHS.forEach((path) => {
      const fullURL = `${baseWSURL}${path}?token=${token}`;
      const ws = new WebSocket(fullURL);
      socketRefs.current[path] = ws;

      ws.onopen = () => console.log(`Connected to ${path}`);

      ws.onmessage = (event) => {
        try {
          const notification = JSON.parse(event.data);
          const transformed = mapNotificationData(notification);
          setNotifications((prev) => [transformed, ...prev]);
        } catch (error) {
          console.error(`Error parsing message from ${path}`, error);
        }
      };

      ws.onerror = (error) => {
        console.error(`WebSocket error on ${path}:`, error);
        ws.close();
      };

      ws.onclose = () => {
        console.log(`Disconnected from ${path}, retrying...`);
        setTimeout(() => connectWebSocketPath(path), 3000);
      };
    });
  };

  // Reconnect specific WebSocket path
  const connectWebSocketPath = (path) => {
    const baseWSURL = getWebSocketBaseURL();
    const token = localStorage.getItem("token");
    const fullURL = `${baseWSURL}${path}?token=${token}`;
    const ws = new WebSocket(fullURL);
    socketRefs.current[path] = ws;

    ws.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      const transformed = mapNotificationData(notification);
      setNotifications((prev) => [transformed, ...prev]);
    };

    ws.onclose = () => {
      console.log(`Reconnecting ${path}`);
      setTimeout(() => connectWebSocketPath(path), 5000);
    };

    ws.onerror = (error) => {
      console.error(`WebSocket error on reconnect for ${path}:`, error);
      ws.close();
    };
  };

  // Lifecycle: fetch initial data and open WebSocket connections
  useEffect(() => {
    fetchNotifications();
    connectWebSockets();

    return () => {
      Object.values(socketRefs.current).forEach((ws) => {
        if (ws) ws.close();
      });
    };
  }, []);

  // Mark single notification as read
  const markRead = async (id) => {
    const response = await markAsRead(id);
    if (response) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    }
  };

  // Mark all notifications as read
  const markAllRead = async () => {
    const response = await markAllNotificationsAsRead(notifications);
    if (response) {
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    }
  };

  // Handle click and redirect based on notification type
  const handleNotificationClick = (n) => {
    if (!n.is_read) markRead(n.id);
    if (n.action_url) {
      navigate(n.action_url, { state: { id: n.related_id } });
    }
    if (n.type === "PROJECT" && n.project_id) {
      navigate(`/project-board/${n.project_id}`);
    } else if ((n.type === "TASK" || n.type === "MENTION") && n.task_id) {
      navigate(`/project-board/card/${n.task_id}`, {
        state: { projectId: n.project_id },
      });
    }
  };
  return (
    <TooltipProvider>
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
              <CardTitle className="text-neutral-1200">Notifications</CardTitle>
              {unreadCount > 0 && (
                <CardDescription className="text-yellow-500 text-xs">
                  You have {unreadCount} unread notifications
                </CardDescription>
              )}
            </CardHeader>

            <ScrollArea className="[&>div>div[style]]:!block">
              <CardContent className="p-0 px-3 max-h-[60vh] flex flex-col gap-1">
                {notifications?.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    No notifications
                  </div>
                ) : (
                  notifications.map((n, i) => {
                    const plainText = stripHtml(n.message || "");
                    return (
                      <div
                        key={i}
                        className={cn(
                          "flex items-start gap-4 px-1 py-2 transition-colors cursor-pointer hover:bg-gray-100",
                          n.is_read ? "bg-gray-100" : "bg-gray-300"
                        )}
                        onClick={() => handleNotificationClick(n)}
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full">
                          <Bell
                            className={cn(
                              "w-5 h-5",
                              n.is_read ? "text-neutral-1100" : "text-red-700"
                            )}
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-neutral-1200 font-medium ">
                            {n.title}
                          </p>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p
                                className={`text-sm leading-none text-neutral-1100${
                                  !n.is_read ? "font-bold" : ""
                                }`}
                              >
                                {truncateText(plainText, 50)}
                              </p>
                            </TooltipTrigger>
                            {n.message?.length > 50 && (
                              <TooltipContent className="max-w-[250px] max-h-[150px] overflow-y-auto p-2 bg-white shadow-lg rounded-md border border-gray-200">
                                {plainText}
                              </TooltipContent>
                            )}
                          </Tooltip>
                          <p className="text-xs text-neutral-1000">
                            {renderDate(n.created_at)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </ScrollArea>

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

export default Notifications;
