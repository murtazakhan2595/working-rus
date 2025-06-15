import React from "react";
import { Card } from "components/ui/card";
import ShiftDetailsWidget from "../ShiftDetailsWidget";
import TimeLogWidget from "./TimeLogWidget";
import StatisticsWidget from "./StatisticsWidget";
import RecentActivitiesWidget from "./RecentActivitiesWidget";

export default function MyAttendance() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">My Attendance</h1>
        <p className="text-slate-500 mt-1">Track your attendance, shifts, and activities</p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Log Section - Full Width on Mobile, Half Width on Desktop */}
        <Card className="lg:col-span-1">
          <TimeLogWidget />
        </Card>

        {/* Shift Schedule Section */}
        <Card className="lg:col-span-1">
          <ShiftDetailsWidget />
        </Card>

        {/* Statistics Section */}
        <Card className="lg:col-span-1">
          <StatisticsWidget />
        </Card>

        {/* Recent Activities Section */}
        <Card className="lg:col-span-1">
          <RecentActivitiesWidget />
        </Card>
      </div>
    </div>
  );
} 