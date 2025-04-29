import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../../components/ui/card";
import { Button } from "components/ui/button";
import { getNotifications } from "app/hooks/notifications";
import { renderDate } from "utils/renderValues";
import DOMPurify from "dompurify";

export default function Component() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications from the API
  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await getNotifications();
      setActivities(response?.results || []);
    } catch (err) {
      console.error("Error fetching activities:", err);
    } finally {
      setLoading(false);
    }
  };

  // Remove all HTML tags and decode special characters
  const stripHtml = (html) => {
    if (!html) return "";
    const clean = DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
    return clean.replace(/&nbsp;/g, " ");
  };

  // Load activities on component mount
  useEffect(() => {
    fetchActivities();

    // Optional: Set up a refresh interval
    const intervalId = setInterval(fetchActivities, 60000); // Refresh every minute

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Format the time relative to current time (e.g., "2h ago")
  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return "";

    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return renderDate(timestamp);
  };

  return (
    <>
      <CardHeader className="items-start pb-0">
        <CardTitle className="flex flex-row justify-between w-full">
          <div className="text-base font-semibold text-plum-1100 xl:text-2xl lg:text-xl md:text-lg">
            Recent Activity
          </div>
          {/* <Button variant="outline" className="">
            <Link to="/notifications">View Details</Link>
          </Button> */}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {loading ? (
          <div className="text-center text-gray-500 py-4">Loading...</div>
        ) : activities.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No recent activity
          </div>
        ) : (
          activities.slice(0, 5).map((activity, index) => {
            const plainText = stripHtml(activity.message || "");
            return (
              <div key={index} className="flex items-start gap-4 pb-4 border-b">
                <div className="w-full space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{activity.title}</h4>
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(activity.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{plainText}</p>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </>
  );
}
