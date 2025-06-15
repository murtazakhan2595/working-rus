import React from "react";
import { CardHeader, CardTitle, CardContent } from "components/ui/card";
import { Clock, ArrowRight } from "lucide-react";

export default function RecentActivitiesWidget() {
  const activities = [
    {
      date: "Today",
      time: "09:00 AM",
      type: "Check In",
      status: "On Time",
    },
    {
      date: "Today",
      time: "06:00 PM",
      type: "Check Out",
      status: "On Time",
    },
    {
      date: "Yesterday",
      time: "09:15 AM",
      type: "Check In",
      status: "Late",
    },
    {
      date: "Yesterday",
      time: "06:00 PM",
      type: "Check Out",
      status: "On Time",
    },
  ];

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="font-semibold text-plum-1100 xl:text-2xl lg:text-xl md:text-lg">
          Recent Activities
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {activity.type}
                  </div>
                  <div className="text-xs text-gray-500">{activity.date}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {activity.time}
                  </div>
                  <div className={`text-xs ${
                    activity.status === "Late" ? "text-orange-500" : "text-green-500"
                  }`}>
                    {activity.status}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </>
  );
} 