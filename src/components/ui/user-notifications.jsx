
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "../../src/@/components/ui/dropdown-menu";
import { Button } from "./button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/card";
import { Bell, Inbox, CalendarDays } from "lucide-react";

const notifications = [
  {
    icon: Bell,
    title: "Your call has been confirmed",
    description: "5 minutes ago",
    bgColor: "bg-primary",
    textColor: "text-primary-foreground",
  },
  {
    icon: Inbox,
    title: "You have a new message",
    description: "1 minute ago",
    bgColor: "bg-secondary",
    textColor: "text-secondary-foreground",
  },
  {
    icon: CalendarDays,
    title: "Your subscription is expiring soon",
    description: "2 hours ago",
    bgColor: "bg-accent",
    textColor: "text-accent-foreground",
  },
];

export default function UserNotification() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="w-5 h-5" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[400px] p-0">
        <Card className="border-0 shadow-none">
          <CardHeader className="px-6 py-4 border-b">
            <CardTitle>Notifications</CardTitle>
            <CardDescription className="text-yellow-500">You have 3 unread notifications</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {notifications.map((notification, index) => (
                <div key={index} className="flex items-start gap-4 px-6 py-4 hover:bg-muted">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${notification.bgColor} ${notification.textColor}`}>
                    <notification.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="px-6 py-4 border-t">
            <Button variant="secondary" size="sm">
              Mark all as read
            </Button>
          </CardFooter>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

